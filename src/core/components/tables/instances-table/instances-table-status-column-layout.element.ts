import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  html,
  nothing,
  customElement,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { TableColumnLayout } from "../table-column-layout.interface.js";
import type { WorkflowStatusModel } from "@umbraco-workflow/generated";
import { WorkflowTagColorStyles } from "@umbraco-workflow/css";

const elementName = "instances-table-status-column-layout";

@customElement(elementName)
export class InstancesTableStatusColumnLayoutElement
  extends UmbLitElement
  implements TableColumnLayout<WorkflowStatusModel>
{
  @property({ attribute: false })
  value!: WorkflowStatusModel;

  @state()
  private _text = "";

  connectedCallback() {
    super.connectedCallback();

    this._text = this.localize.term(
      `workflow_${this.value[0].toLowerCase() + this.value.slice(1)}`
    );
  }

  render() {
    if (!this._text) return nothing;

    return html`<uui-tag workflow-color=${this._text.toLowerCase()}
      >${this._text}</uui-tag
    >`;
  }

  static styles = [WorkflowTagColorStyles];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: InstancesTableStatusColumnLayoutElement;
  }
}
