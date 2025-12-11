import {
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UMB_USER_ITEM_STORE_CONTEXT } from "@umbraco-cms/backoffice/user";
import { EMPTY_GUID } from "../../../../../constants.js";

const elementName = "release-set-task-table-assignedto-column-layout";

@customElement(elementName)
export class ReleaseSetTaskTableAssignedToColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  set value(value: { unique?: string; name?: string } | undefined) {
    if (!value?.unique || value.unique === EMPTY_GUID) {
      this._name = "-";
    } else if (value.name) {
      this._name = value.name;
    } else if (value.unique) {
      (async () => (this._name = await this.#getUserName(value.unique!)))();
    }
  }

  @state()
  private _name?: string;

  async #getUserName(unique: string) {
    const context = await this.getContext(UMB_USER_ITEM_STORE_CONTEXT);
    if (!context) {
      throw new Error("Context not found: UMB_USER_ITEM_STORE_CONTEXT");
    }

    const user = context.getItems([unique]);
    return user.at(0)?.name;
  }

  render() {
    return html`${this._name}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ReleaseSetTaskTableAssignedToColumnLayoutElement;
  }
}
