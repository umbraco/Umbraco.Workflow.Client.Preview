import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import {
  UmbObjectState,
  observeMultiple,
} from "@umbraco-cms/backoffice/observable-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { UmbVariantId } from "@umbraco-cms/backoffice/variant";
import {
  WORKFLOW_CONTEXT,
  WORKFLOW_MANAGER_CONTEXT,
  WorkflowState,
} from "../index.js";
import {
  PermissionType,
  type ValidActionDescriptor,
} from "@umbraco-workflow/core";
import {
  WorkflowStatusModel,
  type NodePermissionsResponseModel,
  type UserGroupPermissionsModel,
  type WorkflowLicenseModel,
  type WorkflowScaffoldResponseModel,
  type WorkflowTaskModel,
} from "@umbraco-workflow/generated";
import {
  WorkflowActionRepository,
  type InitiateWorkflowArgs,
} from "@umbraco-workflow/repository";

export class WorkflowManagerContext extends UmbControllerBase {
  readonly IS_WORKFLOW_MANAGER_CONTEXT = true;

  #workflowContext?: typeof WORKFLOW_CONTEXT.TYPE;
  workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;

  #scaffold?: WorkflowScaffoldResponseModel;
  #repo?: WorkflowActionRepository;
  #license?: WorkflowLicenseModel;

  #isAdmin?: boolean;
  #canResubmit?: boolean;
  #canAction?: boolean;
  #isChangeAuthor?: boolean;
  #rejected?: boolean;
  #userUnique?: string | null;
  #isDashboard = false;

  #instanceUnique?: string;
  #documentUnique?: string;

  #state = new UmbObjectState<WorkflowState | undefined>(undefined);
  #currentTask = new UmbObjectState<WorkflowTaskModel | undefined>(undefined);
  #ready = new UmbObjectState<boolean | undefined>(undefined);

  state = this.#state.asObservable();
  currentTask = this.#currentTask.asObservable();
  ready = this.#ready.asObservable();

  #defaultPermissions = {
    nodeId: 0,
    node: [],
    new: [],
    contentType: [],
    inherited: [],
    excluded: false,
  };
  #permissions = new UmbObjectState<NodePermissionsResponseModel>(
    this.#defaultPermissions
  );
  permissions = this.#permissions.asObservable();

  /* variant is new if never published as it will use the new-workflow (if defined) on initial publish request */
  get isNew() {
    const activeVariant = this.getActiveVariant();
    return !activeVariant?.publishDate;
  }

  /* workflow considers a document new if never published, but needs to 
  know if the document has been saved, which reflects the CMS' isNew property */
  get isSaved() {
    const activeVariant = this.getActiveVariant();
    return activeVariant?.createDate;
  }

  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_MANAGER_CONTEXT.toString());

    this.provideContext(WORKFLOW_MANAGER_CONTEXT, this);
    this.#repo = new WorkflowActionRepository(host);
  }

  #observe() {
    if (!this.#workflowContext) return;

    this.observe(
      observeMultiple([
        this.#workflowContext.license,
        this.#workflowContext.globalVariables,
        this.#workflowContext.scaffold,
      ]),
      ([license, variables, scaffold]) => {
        this.#license = license;
        this.#isAdmin = variables?.currentUserIsAdmin;
        this.#userUnique = variables?.currentUserUnique;
        this.#scaffold = scaffold;
      }
    );
  }

  async init(documentUnique?: string, instanceUnique?: string) {
    if (!instanceUnique && !documentUnique) return;

    /* instanceUnqiue indicate a dashboard or history item, where
   the workspaceContext will not be available, so should not be awaited */
    const promises: Array<Promise<any>> = [
      this.consumeContext(WORKFLOW_CONTEXT, (context) => {
        this.#workflowContext = context;
        this.#observe();
      }).asPromise(),
    ];

    if (!instanceUnique) {
      promises.push(
        this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
          this.workspaceContext = context;
        }).asPromise()
      );
    }

    await Promise.all(promises);

    this.#instanceUnique = instanceUnique;
    this.#documentUnique = documentUnique;
    this.#isDashboard = instanceUnique !== undefined;

    if (!this.#scaffold || this.#instanceUnique) {
      await this.#workflowContext?.scaffoldNode(this.#documentUnique);
    }

    this.#currentTask.setValue(undefined);
    this.#permissions.setValue(this.#defaultPermissions);

    this.#hasValidConfig();
    this.#buildState();
    this.#ready.setValue(true);
  }

  async initiate(args: InitiateWorkflowArgs) {
    const state = this.#state.getValue();

    if (!state || !args.nodeUnique) {
      return;
    }

    const data = await this.#repo?.initiate(args);

    if (!data) {
      return;
    }

    this.#workflowContext?.scaffoldNode();
  }

  async action(
    action: ValidActionDescriptor,
    comment?: string,
    assignTo?: string
  ) {
    const state = this.#state.getValue();
    const instanceUnique = this.getInstanceUnique();
    if (!state || !instanceUnique) return;

    const data = await this.#repo?.action(
      action,
      instanceUnique,
      state.offline ?? false,
      comment,
      assignTo
    );
    if (!data) {
      return;
    }

    await this.#workflowContext?.scaffoldNode();
  }

  async happy(message: string, headline = "Workflow") {
    const notificationContext = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    notificationContext?.peek("positive", { data: { headline, message } });
  }

  getEntityId() {
    return this.#documentUnique;
  }

  getInstanceUnique() {
    return this.#instanceUnique ?? this.getCurrentTask()?.instance?.key;
  }

  getCurrentTask(): WorkflowTaskModel | undefined {
    return this.#currentTask.getValue();
  }

  getPermissions(): NodePermissionsResponseModel {
    return this.#permissions.getValue();
  }

  getActiveVariant() {
    const activeVariant =
      this.workspaceContext?.splitView.getActiveVariants()[0];

    // TODO => how should this be handled? Maybe an error is more appropriate
    if (!activeVariant) return;

    return this.workspaceContext?.getVariant(
      new UmbVariantId(activeVariant.culture)
    );
  }

  #setNodeState() {
    this.#rejected = false;
    this.#isChangeAuthor = false;
    this.#canAction = false;

    const currentTask = this.getCurrentTask();
    if (!currentTask) {
      return;
    }

    const userInAssignedGroup =
      currentTask.userGroup?.usersSummary?.indexOf(`|${this.#userUnique}|`) !==
        -1 ?? false;

    this.#rejected =
      currentTask.instance?.status === WorkflowStatusModel.REJECTED;

    // if the task has been rejected and the current user requested the change, let them edit
    this.#isChangeAuthor =
      currentTask.instance?.requestedByKey === this.#userUnique;

    // if the current user is a member of the group and task is pending, they can action, UNLESS...
    // if the user requested the change, is a member of the current group, and flow type is exclude, they cannot action
    // if the user has already approved the change in a task where the approval threshold is > 1, they cannot action
    this.#canAction =
      userInAssignedGroup &&
      !this.#rejected &&
      !currentTask.approvedByIds?.some((id) => id === this.#userUnique);

    if (
      this.#scaffold?.settings?.flowType !== 0 &&
      this.#isChangeAuthor &&
      this.#canAction
    ) {
      this.#canAction = false;
    }

    this.#canResubmit =
      (this.#rejected && !currentTask.assignTo && this.#isChangeAuthor) ||
      (!!currentTask.assignTo && userInAssignedGroup);
  }

  setNodePermissions(newValue: Array<UserGroupPermissionsModel>) {
    this.#permissions.update({
      ...this.getPermissions(),
      ...{ node: newValue },
    });
  }

  getActivePermissions(): Array<UserGroupPermissionsModel> {
    const permissions = this.getPermissions();
    if (!permissions) return [];

    if (permissions.new?.length && this.isNew) return permissions.new;
    if (permissions.node?.length) return permissions.node;
    if (permissions.contentType?.length) return permissions.contentType;
    if (permissions.inherited?.length) return permissions.inherited;

    return [];
  }

  getActivePermissionType(): PermissionType | undefined {
    const permissions = this.getPermissions();
    if (!permissions) return undefined;

    if (permissions.new?.length && this.isNew) return PermissionType.NEW;
    if (permissions.node?.length) return PermissionType.NODE;
    if (permissions.contentType?.length) return PermissionType.CONTENT_TYPE;
    if (permissions.inherited?.length) return PermissionType.INHERITED;

    return undefined;
  }

  get hasPermissions() {
    return this.getActivePermissions().length > 0;
  }

  #setNodePermissions() {
    if (!this.#scaffold?.config) return;
    const config = this.#scaffold.config;

    this.#permissions.update({
      node: config.node ?? [],
      contentType: config.contentType ?? [],
      inherited: config.inherited ?? [],
      new: config.new ?? [],
    });
  }

  #getBaseState() {
    return {
      isDashboard: this.#isDashboard,
      isAdmin: this.#isAdmin ?? false,
      exclude: this.#scaffold?.config?.excluded ?? false,
      review: this.#scaffold?.review ?? undefined,
    };
  }

  #buildConfigState() {
    return {
      ...this.#getBaseState(),
      allowAttachments: this.#scaffold?.settings?.allowAttachments ?? false,
      allowScheduling: this.#scaffold?.settings?.allowScheduling ?? false,
      requireComment: this.#scaffold?.settings?.mandatoryComments ?? true,
      requireUnpublish: this.#scaffold?.settings?.requireUnpublish ?? false,
      variantTasks: this.#scaffold?.tasks?.variantTasks ?? [],
      canAction: this.#canAction ?? false,
      rejected: this.#rejected ?? false,
      canResubmit: this.#canResubmit ?? false,
      isChangeAuthor: this.#isChangeAuthor ?? false,
      offline: false,
    };
  }

  #buildState() {
    if (this.#hasValidConfig()) {
      if (this.#scaffold?.tasks?.invariantTask) {
        this.#currentTask.setValue(this.#scaffold.tasks.invariantTask);
      }

      this.#setNodeState();

      if (!this.#isDashboard) {
        this.#setNodePermissions();
      }

      const state = this.#buildConfigState();
      this.#state.setValue(new WorkflowState(state));
      return;
    }

    const state = this.#getBaseState();
    this.#state?.setValue(new WorkflowState(state));
  }

  /**
   * Trial license must have node or inherited config and !excluded for config to be valid
   * Other license types can have any of node, contentType or inherited, and !excluded
   */
  #hasValidConfig() {
    const validConfig =
      (this.#scaffold?.config?.node ?? []).length > 0 ||
      (this.#scaffold?.config?.inherited ?? []).length > 0 ||
      ((this.#scaffold?.config?.new ?? []).length > 0 && this.isNew);

    if (this.#license === undefined || this.#license.isTrial) {
      return validConfig;
    }

    return (
      validConfig || (this.#scaffold?.config?.contentType ?? []).length > 0
    );
  }
}

export { WorkflowManagerContext as api };
