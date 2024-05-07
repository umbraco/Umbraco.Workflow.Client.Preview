import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import {
  html,
  customElement,
  property,
  state,
  ifDefined,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { WorkflowApprovalGroupCollectionModel } from "../../../types.js";

const elementName = "approval-groups-table-entity-actions-column-layout";

@customElement(elementName)
export class ApprovalGroupsTableEntityActionsColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: WorkflowApprovalGroupCollectionModel;

  @state()
  _isOpen = false;

  #onActionExecuted() {
    this._isOpen = false;
  }

  render() {
    return html`
      <umb-dropdown .open=${this._isOpen} compact hide-expand>
        <uui-symbol-more slot="label"></uui-symbol-more>
        <umb-entity-action-list
          @action-executed=${this.#onActionExecuted}
          entity-type=${this.value.entityType}
          unique=${ifDefined(this.value.unique)}
        ></umb-entity-action-list>
      </umb-dropdown>
    `;
  }

  static styles = [UmbTextStyles];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupsTableEntityActionsColumnLayoutElement;
  }
}
