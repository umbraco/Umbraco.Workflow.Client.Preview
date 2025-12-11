import type { UmbDropdownElement } from "@umbraco-cms/backoffice/components";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { css, property, query } from "@umbraco-cms/backoffice/external/lit";

export class DropdownBaseElement<T> extends UmbLitElement {
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
      }

      umb-dropdown {
        position: relative;
        z-index: 2;
      }
    `,
  ];
}
