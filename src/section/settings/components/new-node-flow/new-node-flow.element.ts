import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "../../workspace/settings-workspace.context-token.js";
import {
  add,
  remove,
  type WorkflowRefGroupPermissionElement,
} from "@umbraco-workflow/components";

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

  #host: UmbControllerHost;

  @state()
  _generalSettings?: GeneralSettingsModel;

  constructor(host: UmbControllerHost) {
    super();

    this.#host = host;

    this.consumeContext(WORKFLOW_SETTINGS_WORKSPACE_CONTEXT, (instance) => {
      this.workspaceContext = instance;

      this.observe(this.workspaceContext.generalSettings, (settings) => {
        this._generalSettings = settings;
      });
    });
  }

  get value() {
    return (this._generalSettings?.newNodeApprovalFlow?.value ??
      []) as Array<UserGroupPermissionsModel>;
  }

  get configureApprovalThreshold() {
    return (
      <boolean>(
        this._generalSettings?.properties?.find(
          (x) => x.alias === this.#configureApprovalThreshold
        )?.value
      ) ?? false
    );
  }

  get defaultApprovalThreshold() {
    return (
      <number>(
        this._generalSettings?.properties?.find(
          (x) => x.alias === this.#approvalThreshold
        )?.value
      ) ?? 0
    );
  }

  #remove(idx: number) {
    const value = remove([...this.value], idx);
    this.workspaceContext?.setValue(
      value,
      this.#propertyAlias,
      this.#settingsAlias
    );
  }

  async #openGroupPicker() {
    // const value = await add(
    //   this.#host,
    //   this.value,
    //   undefined,
    //   undefined,
    //   await this.getContext(UMB_MODAL_MANAGER_CONTEXT)
    // );

    // this.workspaceContext?.setValue(
    //   value,
    //   this.#propertyAlias,
    //   this.#settingsAlias
    // );
  }

  #handleApprovalThresholdChange(event: CustomEvent) {
    // TODO => fix me, unknown shouldn't be needed
    const detail = (event.target as unknown as WorkflowRefGroupPermissionElement)?.value;
    const permissions = structuredClone(this.value ?? []);
    const idx = permissions.findIndex(
      (x) => x.permission === detail?.permission
    );

    if (idx === -1) {
      return;
    }

    permissions[idx].approvalThreshold =
      detail?.approvalThreshold ?? this.defaultApprovalThreshold ?? 0;

    this.workspaceContext?.setValue(
      permissions,
      this.#propertyAlias,
      this.#settingsAlias
    );
  }

  render() {
    return html`${when(
        this.value?.length,
        () => html`
          <uui-ref-list>
            ${this.value!.map(
              (permission, idx) =>
                html`<workflow-ref-group-permission
                  .value=${permission}
                  ?canEdit=${false}
                  ?canRemove=${true}
                  ?canConfigureApprovalThreshold=${this
                    .configureApprovalThreshold}
                  .defaultApprovalThreshold=${this.defaultApprovalThreshold}
                  @approvalThresholdChange=${this
                    .#handleApprovalThresholdChange}
                  @remove=${() => this.#remove(idx)}
                >
                </workflow-ref-group-permission>`
            )}
          </uui-ref-list>
        `
      )}

      <workflow-add-button
        @click=${this.#openGroupPicker}
        .labelKey=${"workflow_addWorkflowGroups"}
      >
      </workflow-add-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowNewNodeFlowElement;
  }
}
