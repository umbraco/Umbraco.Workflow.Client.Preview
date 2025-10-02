import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UMB_APP_LANGUAGE_CONTEXT } from "@umbraco-cms/backoffice/language";
import { WorkflowBaseFilterElement } from "./base-filter.element.js";

const elementName = "workflow-variant-filter";

@customElement(elementName)
export class WorkflowVariantFilterElement extends WorkflowBaseFilterElement<string> {
  constructor() {
    super();

    this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.languages, (languages) => {
        this.options = languages.map((l) => ({
          name: l.name,
          value: l.unique,
          selected: l.unique === this.value,
        }));
      });
    });
  }

  #setValue(e: InputEvent) {
    this.setValue((e.target as HTMLInputElement).value);
  }

  render() {
    return html` <uui-select
        .options=${this.options ?? []}
        @change=${this.#setValue}
        .value=${this.value}
      ></uui-select>
      <uui-button
        @click=${this.#setValue}
        ?disabled=${!this.value}
        label=${this.localize.term("general_remove")}
      ></uui-button>`;
  }

  static styles = [
    css`
      :host {
        display: flex;
      }

      uui-select {
        flex: 1;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowVariantFilterElement;
  }
}
