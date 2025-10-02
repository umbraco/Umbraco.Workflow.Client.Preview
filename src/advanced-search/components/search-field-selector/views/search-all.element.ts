import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import { AdvancedSearchFieldElement } from "../../../entities.js";

const elementName = "workflow-advanced-search-all";

@customElement(elementName)
export class WorkflowAdvancedSearchAllElement
  extends UmbLitElement
  implements AdvancedSearchFieldElement
{
  @state()
  value: string = "";

  #onValueChange(e: UUIInputEvent) {
    this.value = e.target.value.toString();
    this.dispatchEvent(new UmbChangeEvent());
  }

  render() {
    return html` <umb-property-layout label="Search term">
      <uui-input
        slot="editor"
        type="text"
        @change=${this.#onValueChange}
      ></uui-input>
    </umb-property-layout>`;
  }
}

export default WorkflowAdvancedSearchAllElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAdvancedSearchAllElement;
  }
}
