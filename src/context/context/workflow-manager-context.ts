import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import {
  WORKFLOW_CONTEXT,
  WORKFLOW_MANAGER_CONTEXT,
  type WorkflowState,
} from "../index.js";
import {
  PermissionType,
  WorkflowStatus,
  WorkflowActionRepository,
  type ValidActionDescriptor,
} from "@umbraco-workflow/core";
import {
  WorkflowStatusModel,
  type ActionWorkflowResponseModel,
  type NodePermissionsResponseModel,
  type UserGroupPermissionsModel,
  type WorkflowInstanceResponseModel,
  type WorkflowLicenseModel,
  type WorkflowScaffoldResponseModel,
  type WorkflowSettingsBaseModel,
  type WorkflowTaskModel,
} from "@umbraco-workflow/generated";

export class WorkflowManagerContext extends UmbControllerBase {
  public readonly workspaceAlias = WORKFLOW_MANAGER_CONTEXT.contextAlias;

  #scaffold?: WorkflowScaffoldResponseModel;
  #repo: WorkflowActionRepository;
  #source?: WorkflowInstanceResponseModel;

  #isAdmin?: boolean = true;
  #canEdit?: boolean;
  #canResubmit?: boolean;
  #canAction?: boolean;
  #isChangeAuthor?: boolean;
  #rejected?: boolean;

  #readonly = false;

  #userId?: string;
  #hasValidConfig = false;

  #license?: WorkflowLicenseModel;

  notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;
  #workflowContext?: typeof WORKFLOW_CONTEXT.TYPE;

  #state = new UmbObjectState<WorkflowState | undefined>(undefined);
  state = this.#state.asObservable();

  #currentTask = new UmbObjectState<WorkflowTaskModel | undefined>(undefined);
  currentTask = this.#currentTask.asObservable();

  #ready = new UmbObjectState<boolean | undefined>(undefined);
  ready = this.#ready.asObservable();

  #permissions = new UmbObjectState<NodePermissionsResponseModel>({
    nodeId: 0,
    node: [],
    new: [],
    contentType: [],
    inherited: [],
    excluded: false,
  });
  permissions = this.#permissions.asObservable();

  settings?: WorkflowSettingsBaseModel;
  #unique?: string;
  #contentTypeUnique?: string;
  #init: Promise<unknown>;
  #isDashboard = false;

  get isNew() {
    // const activeVariant =
    //   this.workspaceContext?.splitView.getActiveVariants()[0];
    // TODO => track active variant
    // return !variants?.at(0) ?? false;
    return false;
  }

  constructor(host: UmbControllerHostElement) {
    super(host);
    this.#repo = new WorkflowActionRepository(host);

    this.#init = Promise.all([
      this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
        if (!instance) return;
        this.#workflowContext = instance;
        this.#observeLicense();
        this.#observeVariables();
        this.#observeScaffold();
      }).asPromise(),

      this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
        this.notificationContext = instance;
      }).asPromise(),
    ]);
  }

  #observeLicense() {
    if (!this.#workflowContext) return;
    this.observe(this.#workflowContext.license, (license) => {
      if (!license) return;
      this.#license = license;
    });
  }

  #observeVariables() {
    if (!this.#workflowContext) return;
    this.observe(this.#workflowContext.globalVariables, (variables) => {
      if (!variables) return;
      this.#isAdmin = variables.currentUserIsAdmin;
    });
  }

  #observeScaffold() {
    if (!this.#workflowContext) return;
    this.observe(this.#workflowContext.scaffold, (scaffold) => {
      if (!scaffold) return;
      this.#scaffold = scaffold;
      this.settings = this.#scaffold.settings ?? undefined;
    });
  }

  async init(
    item?: WorkflowInstanceResponseModel,
    unique?: string,
    contentTypeUnique?: string
  ) {
    await this.#init;

    if (!this.#scaffold && item) {
      await this.#workflowContext?.scaffoldNode(item.node?.key);
    }

    if (this.#readonly) {
      this.#ready.setValue(true);
      return;
    }

    this.#source = item;
    this.#unique = unique;
    this.#contentTypeUnique = contentTypeUnique;
    this.#isDashboard = item !== undefined;

    this.#setHasValidConfig();
    this.#buildState();
    this.#ready.setValue(true);
  }

  async initiate(args: {
    nodeUnique: string;
    publish: boolean;
    comment: string;
    variants: Array<string>;
    releaseDate?: string;
    expireDate?: string;
    attachmentId?: string;
  }) {
    const state = this.#state.getValue();

    if (!state || !args.nodeUnique) {
      return;
    }

    const data = await this.#repo?.initiate(
      args.publish,
      args.nodeUnique,
      args.comment,
      args.variants,
      args.releaseDate,
      args.expireDate,
      args.attachmentId
    );

    if (!data) {
      return;
    }

    this.#updateAfterAction(data, args.variants);
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

    this.#updateAfterAction(data);
  }

  #updateAfterAction(
    data?: ActionWorkflowResponseModel,
    variant?: Array<string>
  ) {
    this.#ready.setValue(false);

    if (!data || !data.activeWorkflows?.length) {
      this.#currentTask.setValue(undefined);
      return;
    }

    let currentTask: WorkflowTaskModel | undefined;

    // when initiating, might be multiple items returned but we only want the current variant
    // TODO => this should be the current backoffice variant, not the variant used in the request
    if (variant?.length) {
      currentTask = data.activeWorkflows?.find((x) =>
        // TODO => variant code should not be nullable, should always be the default
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        variant.includes(x.instance?.variantCode!)
      );
    } else {
      currentTask = data.activeWorkflows?.at(0);
    }

    // handle complete
    if (!currentTask) {
      this.#ready.setValue(true);
      return;
    }

    this.#currentTask.setValue(currentTask);

    this.#setNodeState();
    this.#setNodePermissions();
    this.#buildConfigState();

    this.#ready.setValue(true);
  }

  happy(message: string, headline = "Workflow") {
    this.notificationContext?.peek("positive", { data: { headline, message } });
  }

  getEntityId() {
    return this.#unique;
  }

  getContentTypeId() {
    return this.#contentTypeUnique;
  }

  getInstanceUnique() {
    return (this.#source ?? this.getCurrentTask())?.instance?.key;
  }

  getCurrentTask(): WorkflowTaskModel | undefined {
    return this.#currentTask.getValue();
  }

  getPermissions(): NodePermissionsResponseModel {
    return this.#permissions.getValue();
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
      currentTask.userGroup?.usersSummary?.indexOf(`|${this.#userId}|`) !==
        -1 ?? false;

    this.#rejected =
      currentTask.instance?.status === WorkflowStatusModel.REJECTED;

    // if the task has been rejected and the current user requested the change, let them edit
    this.#isChangeAuthor =
      currentTask.instance?.requestedByKey === this.#userId;

    // if the current user is a member of the group and task is pending, they can action, UNLESS...
    // if the user requested the change, is a member of the current group, and flow type is exclude, they cannot action
    // if the user has already approved the change in a task where the approval threshold is > 1, they cannot action
    this.#canAction =
      userInAssignedGroup &&
      !this.#rejected &&
      !currentTask.approvedByIds?.some((id) => id === this.#userId);

    if (
      this.settings?.flowType !== 0 &&
      this.#isChangeAuthor &&
      this.#canAction
    ) {
      this.#canAction = false;
    }

    this.#canResubmit =
      (this.#rejected && !currentTask.assignTo && this.#isChangeAuthor) ||
      (!!currentTask.assignTo && userInAssignedGroup);
  }

  #setCanEdit() {
    if (!this.settings?.lockIfActive) {
      this.#canEdit = true;
      return true;
    }

    const currentTask = this.getCurrentTask();

    // if locked, no one can edit, unless they have canResubmit permission
    // OR isAdmin is true, and adminCanEdit is also true
    // HOWEVER changeAuthor can edit, if the workflow has not had any approvals
    const isAuthorUserAndNoApprovals =
      this.#userId === currentTask?.instance?.requestedByKey &&
      currentTask?.currentStep === 0 &&
      currentTask?.approvedByIds?.length === 0 &&
      currentTask?.status === WorkflowStatus.PENDING_APPROVAL;

    this.#canEdit =
      isAuthorUserAndNoApprovals ||
      this.#canResubmit ||
      (this.settings?.adminCanEdit && this.#isAdmin) ||
      false;

    return this.#canEdit;
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

  #getBaseConfig(hasConfig: boolean): WorkflowState {
    return {
      nodeId: this.getEntityId(),
      isDashboard: this.#isDashboard,
      hasConfig,
      isAdmin: this.#isAdmin ?? false,
      exclude: this.#scaffold?.config?.excluded ?? false,
      review: this.#scaffold?.review ?? undefined,
    };
  }

  #buildConfigState() {
    const config = {
      ...this.#getBaseConfig(true),
      ...this.settings,
      // allowAttachments: this.settings?.allowAttachments ?? false,
      // allowScheduling: this.settings?.allowScheduling ?? false,
      // requireComment: this.settings?.mandatoryComments ?? true,
      // requireUnpublish: this.settings?.requireUnpublish ?? false,
      canEdit: this.#canEdit ?? false,
      variantTasks: this.#scaffold?.tasks?.variantTasks ?? [],
      canAction: this.#canAction ?? false,
      rejected: this.#rejected ?? false,
      canResubmit: this.#canResubmit ?? false,
      isChangeAuthor: this.#isChangeAuthor ?? false,
      userId: this.#userId,
      offline: false,
    };
    this.#state?.setValue(config);
  }

  #buildState() {
    if (this.#hasValidConfig) {
      if (this.#scaffold?.tasks?.invariantTask) {
        this.#currentTask.setValue(this.#scaffold.tasks.invariantTask);
      }

      this.#setNodeState();

      if (!this.#isDashboard) {
        this.#setCanEdit();
        this.#setNodePermissions();
      }

      this.#buildConfigState();

      return;
    }

    this.#state?.setValue({
      ...this.#getBaseConfig(false),
    });
  }

  /**
   * Trial license must have node or inherited config and !excluded for config to be valid
   * Other license types can have any of node, contentType or inherited, and !excluded
   *
   * this.isPublished is set to true when a workflow completes for the current context, it
   * is reset to false on a route change. the isPublished param is derived from the active
   * variant publishDate, so will be false on a new node, but since the node state doesn't update
   * in this factory, we need a flag to indicate the change of status, to avoid showing request-publish
   * button after a node is published via the new-node flow.
   */
  #setHasValidConfig() {
    const validConfig =
      (this.#scaffold?.config?.node ?? []).length > 0 ||
      (this.#scaffold?.config?.inherited ?? []).length > 0 ||
      ((this.#scaffold?.config?.new ?? []).length > 0 && this.isNew);

    if (this.#license === undefined || this.#license.isTrial) {
      this.#hasValidConfig = validConfig;
      return;
    }

    this.#hasValidConfig =
      validConfig || (this.#scaffold?.config?.contentType ?? []).length > 0;
  }
}
