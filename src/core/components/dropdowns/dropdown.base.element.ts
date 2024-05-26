import type { UmbDropdownElement } from "@umbraco-cms/backoffice/components";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  property,
  query,
} from "@umbraco-cms/backoffice/external/lit";

export class DropdownBaseElement<T> extends UmbElementMixin(LitElement) {
  @query("#dropdown")
  private _dropdown!: UmbDropdownElement;

  /**
   * The default value
   */
  @property({ attribute: false })
  value!: T;

  select(value: T) {
    this._dropdown.open = false;
    this.value = value;
    this.dispatchEvent(new CustomEvent("change"));
  }

  static styles = [
    css`
      :host {
        display: block;
        position: relative;
        --uui-button-height: var(--uui-size-7);
      }

      umb-dropdown {
        position: relative;
        z-index: 2;
      }
    `,
  ];
}
