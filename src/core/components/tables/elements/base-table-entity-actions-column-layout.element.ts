import {
  html,
  customElement,
  property,
  state,
  ifDefined,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

const elementName = "base-table-entity-actions-column-layout";

@customElement(elementName)
export class BaseTableEntityActionsColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: { entityType: string, unique: string };

  @state()
  _isOpen = false;

  #onActionExecuted() {
    this._isOpen = false;
  }

  #onClick(e: Event) {
    e.preventDefault();
  }

  render() {
    return html`
      <umb-dropdown .open=${this._isOpen} compact hide-expand @click=${this.#onClick}>
        <uui-symbol-more slot="label"></uui-symbol-more>
        <umb-entity-action-list
          @action-executed=${this.#onActionExecuted}
          entity-type=${this.value.entityType}
          unique=${ifDefined(this.value.unique)}
        ></umb-entity-action-list>
      </umb-dropdown>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: BaseTableEntityActionsColumnLayoutElement;
  }
}

export default BaseTableEntityActionsColumnLayoutElement;