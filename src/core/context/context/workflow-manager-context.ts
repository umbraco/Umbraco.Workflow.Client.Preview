import { type UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { UmbContextBase } from "@umbraco-cms/backoffice/class-api";
import { UMB_ENTITY_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/workspace";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import { loadManifestApi } from "@umbraco-cms/backoffice/extension-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import {
  WORKFLOW_MANAGER_CONTEXT,
  type ScaffoldArgsModel,
  type WorkflowState,
} from "../index.js";
import { WorkflowStateController } from "../workflow-state.controller.js";
import type { WorkflowEntityWorkflowInitializer } from "../../initializers/entity-workflow-initializer.manifest.js";
import { PermissionType, type ValidActionDescriptor } from "../../enums.js";
import {
  ScaffoldService,
  type WorkflowScaffoldResponseModelReadable,
  type NodePermissionsResponseModel,
  type ApprovalGroupDetailPermissionConfigModel,
} from "@umbraco-workflow/generated";
import {
  WorkflowActionRepository,
  type InitiateWorkflowArgs,
} from "@umbraco-workflow/repository";

export class WorkflowManagerContext extends UmbContextBase {
  readonly IS_WORKFLOW_MANAGER_CONTEXT = true;

  readonly #defaultPermissions = {
    node: [],
    new: [],
    contentType: [],
    inherited: [],
    excluded: false,
    locked: false,
  };

  #repo: WorkflowActionRepository;
  #stateController: WorkflowStateController;

  #workflowInitializer?: WorkflowEntityWorkflowInitializer;
  #currentScaffoldArgs?: ScaffoldArgsModel;

  #state = new UmbObjectState<WorkflowState | undefined>(undefined);
  #permissions = new UmbObjectState<NodePermissionsResponseModel>(
    this.#defaultPermissions
  );
  #scaffold = new UmbObjectState<
    WorkflowScaffoldResponseModelReadable | undefined
  >(undefined);

  state = this.#state.asObservable();
  permissions = this.#permissions.asObservable();
  scaffold = this.#scaffold.asObservable();

  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_MANAGER_CONTEXT.toString());

    this.#repo = new WorkflowActionRepository(host);
    this.#stateController = new WorkflowStateController(this);

    // handles workspace-workflows only. dashboard is managed by the detail modal
    this.consumeContext(UMB_ENTITY_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.unique, async (unique) => {
        if (!unique) return;
        await this.loadWorkflowInitializer({
          entityType: context.getEntityType(),
        });
      });
    });
  }

  async loadWorkflowInitializer(args: {
    entityType: string | undefined | null;
    initializerArgs?: ScaffoldArgsModel;
  }) {
    if (!args.entityType) throw new Error("Entity type is missing");

    const manifests = umbExtensionsRegistry.getByTypeAndFilter(
      "workflowInitializer",
      (x) => x.entityType === args.entityType
    );

    const manifest = manifests.at(0);
    if (!manifest?.api) return;

    const api = await loadManifestApi<WorkflowEntityWorkflowInitializer>(
      manifest.api
    );
    if (!api) return;

    // context is shared, initializer is not. if we don't destroy
    // we build a queue of state controllers
    this.#workflowInitializer?.destroy();
    this.#workflowInitializer = new api(this, args.initializerArgs);

    this.observe(
      this.#workflowInitializer?.initializerArgs,
      async (initializerArgs) => {
        if (!initializerArgs) return;
        await this.initializeContext(initializerArgs);
      }
    );
  }

  async initializeContext(args: ScaffoldArgsModel) {
    if (
      args.isNew ||
      (args.instanceUnique &&
        args.instanceUnique === this.#currentScaffoldArgs?.instanceUnique)
    ) {
      this.#scaffold.setValue(undefined);
      return;
    }

    const requestArgs = { ...args };

    if (!requestArgs.variant || requestArgs.variant === "*") {
      requestArgs.variant = "invariant";
    }

    if (
      this.#currentScaffoldArgs?.variant === requestArgs.variant &&
      this.#currentScaffoldArgs.nodeKey === requestArgs.nodeKey &&
      this.#currentScaffoldArgs.entityType === requestArgs.entityType
    ) {
      // avoids observers consuming the previous scaffold value
      // means we need to ensure checking and returning early for undefined
      return;
    }

    this.#currentScaffoldArgs = requestArgs;
    await this.refreshScaffold();
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

    await this.refreshScaffold();
  }

  async refreshScaffold() {
    if (!this.#currentScaffoldArgs) return;

    const variant =
      this.#currentScaffoldArgs.variant === "invariant"
        ? "*"
        : this.#currentScaffoldArgs.variant;

    const { data } = await tryExecute(
      this._host,
      ScaffoldService.postScaffold({
        body: { ...this.#currentScaffoldArgs, variant },
      })
    );

    this.#scaffold.setValue(data);

    this.#currentScaffoldArgs.instanceUnique =
      data?.tasks?.invariantTask?.instance?.key;

    const { state, valid } = await this.#stateController.generate(
      this.#currentScaffoldArgs.isDashboard,
      this.getIsPublished()
    );

    this.#permissions.setValue(this.#defaultPermissions);

    if (valid) {
      this.#setNodePermissions();
    }

    this.#state.setValue(state);
  }

  async action(
    action: ValidActionDescriptor,
    comment?: string,
    assignTo?: string
  ) {
    if (
      !this.#currentScaffoldArgs?.instanceUnique ||
      !this.#currentScaffoldArgs?.entityType
    )
      return;

    const data = await this.#repo?.action({
      action,
      instanceUnique: this.#currentScaffoldArgs.instanceUnique,
      comment,
      assignTo,
      entityType: this.#currentScaffoldArgs.entityType,
    });

    if (!data) {
      return;
    }

    await this.refreshScaffold();
  }

  getEntityId() {
    return this.#currentScaffoldArgs?.nodeKey;
  }

  getState() {
    return this.#state.getValue();
  }

  getIsPublished() {
    return this.#workflowInitializer?.getIsPublished();
  }

  getIsNew() {
    return this.#workflowInitializer?.getIsNew();
  }

  getPermissions(): NodePermissionsResponseModel {
    return this.#permissions.getValue();
  }

  getActiveVariant() {
    return this.#currentScaffoldArgs?.variant;
  }

  setNodePermissions(
    newValue: Array<ApprovalGroupDetailPermissionConfigModel>
  ) {
    this.#permissions.update({
      ...this.getPermissions(),
      ...{ node: newValue },
    });
  }

  getActivePermissions(): Array<ApprovalGroupDetailPermissionConfigModel> {
    const permissions = this.getPermissions();

    if (permissions.new.length && !this.getIsPublished()) return permissions.new;
    if (permissions.node.length) return permissions.node;
    if (permissions.contentType.length) return permissions.contentType;
    if (permissions.inherited.length) return permissions.inherited;

    return [];
  }

  getActivePermissionType(): PermissionType | undefined {
    const permissions = this.getPermissions();

    if (permissions.new.length && !this.getIsPublished()) return PermissionType.NEW;
    if (permissions.node.length) return PermissionType.NODE;
    if (permissions.contentType.length) return PermissionType.CONTENT_TYPE;
    if (permissions.inherited.length) return PermissionType.INHERITED;

    return undefined;
  }

  get hasPermissions() {
    return this.getActivePermissions().length > 0;
  }

  #setNodePermissions() {
    const scaffold = this.#scaffold.getValue();
    if (!scaffold?.config) return;
    this.#permissions.update(scaffold.config);
  }

  public override destroy() {
    this.#state.destroy();
    this.#permissions.destroy();
    super.destroy();
  }
}

export { WorkflowManagerContext as api };
