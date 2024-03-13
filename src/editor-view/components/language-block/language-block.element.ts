import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  property,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "workflow-language-block";

@customElement(elementName)
export class WorkflowLanguageBlockElement extends UmbElementMixin(LitElement) {
  @property()
  language?: string;

  render() {
    return html` <uui-box .headline=${this.localize.term("general_language")}>
      ${this.language}
    </uui-box>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowLanguageBlockElement;
  }
}
