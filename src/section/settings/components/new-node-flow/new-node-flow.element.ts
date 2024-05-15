import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowSettingsElementBase } from "../settings-component.base.js";
import type { WorkflowApprovalGroupInputElement } from "@umbraco-workflow/components";
import type { UserGroupPermissionsModel } from "@umbraco-workflow/generated";

const elementName = "workflow-new-node-flow";

@customElement(elementName)
export class WorkflowNewNodeFlowElement extends WorkflowSettingsElementBase {
  readonly #propertyAlias = "newNodeApprovalFlow";
  readonly #settingsAlias = "generalSettings";

  @state()
  value: Array<UserGroupPermissionsModel> = [];

  @state()
  documentUnique?: string;

  init() {
    this.value = (this.generalSettings?.newNodeApprovalFlow?.value ??
      []) as Array<UserGroupPermissionsModel>;
    this.documentUnique =
      (this.generalSettings?.newNodeApprovalFlow?.config.find(
        (x) => x.alias === "nodeKey"
      )?.value as string) ?? "";
  }

  async #onApprovalGroupsUpdated(e: CustomEvent) {
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
        document: this.documentUnique,
        remove: true,
        multiple: true,
        defaultThreshold: this.defaultApprovalThreshold(),
        configureThreshold: this.configureApprovalThreshold(),
      }}
      .selectedPermissions=${this.value}
      @updated=${this.#onApprovalGroupsUpdated}
    ></workflow-approval-group-input>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowNewNodeFlowElement;
  }
}
