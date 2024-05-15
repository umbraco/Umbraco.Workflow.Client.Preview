import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowBaseFilterElement } from "./base-filter.element.js";
import type { WorkflowApprovalGroupInputElement } from "@umbraco-workflow/components";

const elementName = "workflow-group-filter";

@customElement(elementName)
export class WorkflowGroupFilterElement extends WorkflowBaseFilterElement<
  string | undefined
> {
  async #onApprovalGroupsUpdated(e: CustomEvent) {
    const target = e.target as WorkflowApprovalGroupInputElement;
    this.setValue(target.selection.at(0));
  }

  render() {
    return html`<workflow-approval-group-input
      .config=${{ basic: true, multiple: false, remove: true }}
      .value=${this.value ?? ""}
      @updated=${this.#onApprovalGroupsUpdated}
    ></workflow-approval-group-input>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowGroupFilterElement;
  }
}
