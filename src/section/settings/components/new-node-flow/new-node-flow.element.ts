import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "../../workspace/settings-workspace.context-token.js";
import type { WorkflowApprovalGroupInputElement } from "@umbraco-workflow/components";
import type {
  GeneralSettingsModel,
  UserGroupPermissionsModel,
} from "@umbraco-workflow/generated";

const elementName = "workflow-new-node-flow";

@customElement(elementName)
export class WorkflowNewNodeFlowElement extends UmbElementMixin(LitElement) {
  workspaceContext?: typeof WORKFLOW_SETTINGS_WORKSPACE_CONTEXT.TYPE;

  readonly #propertyAlias = "newNodeApprovalFlow";
  readonly #settingsAlias = "generalSettings";
  readonly #configureApprovalThreshold = "configureApprovalThreshold";
  readonly #approvalThreshold = "approvalThreshold";

  @state()
  _generalSettings?: GeneralSettingsModel;

  @state()
  value: Array<UserGroupPermissionsModel> = [];

  @state()
  documentUnique?: string;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_SETTINGS_WORKSPACE_CONTEXT, (instance) => {
      this.workspaceContext = instance;

      this.observe(this.workspaceContext.generalSettings, (settings) => {
        this._generalSettings = settings;
        this.value = (this._generalSettings?.newNodeApprovalFlow?.value ??
          []) as Array<UserGroupPermissionsModel>;
        this.documentUnique = this._generalSettings?.newNodeApprovalFlow?.config.find(x => x.alias === 'nodeKey')?.value as string ?? "";
      });
    });
  }

  configureApprovalThreshold() {
    return (
      <boolean>(
        this._generalSettings?.properties?.find(
          (x) => x.alias === this.#configureApprovalThreshold
        )?.value
      ) ?? false
    );
  }

  defaultApprovalThreshold() {
    const prop = this._generalSettings?.properties?.find(
      (x) => x.alias === this.#approvalThreshold
    );

    const value = (
      (prop?.config.find((c) => c.alias === "items")?.value as Array<any>) ?? []
    ).indexOf(prop?.value);
    return value;
  }

  async #onApprovalGroupsChange(e: CustomEvent) {
    const target = e.target as WorkflowApprovalGroupInputElement;
    this.workspaceContext?.setValue(
      target.selectedPermissions,
      this.#propertyAlias,
      this.#settingsAlias
    );
  }

  render() {
    return html`<workflow-approval-group-input
      .config=${{
        edit: false,
        remove: true,
        defaultThreshold: this.defaultApprovalThreshold(),
        configureThreshold: this.configureApprovalThreshold(),
      }}
      .document=${this.documentUnique}
      .selectedPermissions=${this.value}
      @change=${this.#onApprovalGroupsChange}
    ></workflow-approval-group-input>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowNewNodeFlowElement;
  }
}
