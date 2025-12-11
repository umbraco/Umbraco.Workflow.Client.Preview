import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import {
  customElement,
  html,
  nothing,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_USER_PERMISSION_RELEASESET_READ } from "../../../../user-permissions/constants.js";

export type ReleaseSetTableNameColumnData = {
  name: string;
  unique: string;
  modalPath?: string | null;
};

const elementName = "release-set-table-name-column-layout";

@customElement(elementName)
export class ReleaseSetTableNameColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: ReleaseSetTableNameColumnData;

  @state()
  private _permitted = false;

  constructor() {
    super();

    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (context) => {
      this.observe(context?.currentUser, (currentUser) => {
        this._permitted =
          currentUser?.fallbackPermissions.includes(
            WORKFLOW_USER_PERMISSION_RELEASESET_READ
          ) ?? false;
      });
    });
  }

  #renderButton() {
    return html`<uui-button
      href=${`${this.value.modalPath}edit/${this.value.unique}`}
      compact
      .label=${this.value.name}
    ></uui-button>`;
  }

  render() {
    if (!this.value) return nothing;

    return when(
      this._permitted,
      () => this.#renderButton(),
      () => html`${this.value.name}`
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ReleaseSetTableNameColumnLayoutElement;
  }
}
