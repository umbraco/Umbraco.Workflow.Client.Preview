import { property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

export class WorkflowBaseFilterElement<FilterValueType> extends UmbLitElement {
  @property({ attribute: false })
  value?: FilterValueType;

  @property()
  alias?: string;

  @property({ type: Array })
  options?: Array<Option>;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  setValue(value?: FilterValueType) {
    this.value = value;
    this.dispatchEvent(new CustomEvent("change"));
  }
}
