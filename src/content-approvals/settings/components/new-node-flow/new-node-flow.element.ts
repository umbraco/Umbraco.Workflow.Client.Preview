import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { WorkflowApprovalGroupInputElement } from "@umbraco-workflow/approval-group";
import type { ApprovalGroupDetailPermissionConfigModel } from "@umbraco-workflow/generated";
import { WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT } from "../../workspace/settings-workspace.context-token";

const elementName = "workflow-new-node-flow";

@customElement(elementName)
export class WorkflowNewNodeFlowElement extends UmbLitElement {
  #workspaceContext?: typeof WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT.TYPE;

  readonly #propertyAlias = "newNodeApprovalFlow";
  readonly #settingsAlias = "generalSettings";

  @state()
  value: Array<ApprovalGroupDetailPermissionConfigModel> = [];

  @state()
  documentUnique?: string;

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT,
      (workspaceContext) => {
        if (!workspaceContext) return;

        this.#workspaceContext = workspaceContext;

        this.observe(
          this.#workspaceContext.newNodeApprovalFlow,
          (newNodeApprovalFlow) => {
            this.value = (newNodeApprovalFlow?.value ??
              []) as Array<ApprovalGroupDetailPermissionConfigModel>;
            this.documentUnique = newNodeApprovalFlow?.config.find(
              (x) => x.alias === "nodeKey"
            )?.value as string;
          }
        );
      }
    );
  }

  async #onApprovalGroupsUpdated(e: CustomEvent) {
    const target = e.target as WorkflowApprovalGroupInputElement;
    this.#workspaceContext?.setValue(
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
        edit: true,
        multiple: true,
        defaultThreshold: this.#workspaceContext?.getDefaultApprovalThreshold(),
        configureThreshold:
          this.#workspaceContext?.getConfigureApprovalThreshold(),
      }}
      .selectedPermissions=${this.value}
      @change=${this.#onApprovalGroupsUpdated}
    ></workflow-approval-group-input>`;
  }
}

export default WorkflowNewNodeFlowElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowNewNodeFlowElement;
  }
}
