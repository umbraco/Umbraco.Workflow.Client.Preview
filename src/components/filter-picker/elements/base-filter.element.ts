import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { LitElement, property } from "@umbraco-cms/backoffice/external/lit";

export class WorkflowBaseFilterElement<FilterValueType> extends UmbElementMixin(
  LitElement
) {
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
