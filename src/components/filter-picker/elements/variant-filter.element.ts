import {
  css,
  customElement,
  html,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowBaseFilterElement } from './base-filter.element.js';
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

const elementName = "workflow-variant-filter";

@customElement(elementName)
export class WorkflowVariantFilterElement extends WorkflowBaseFilterElement<string> {
  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      if (!instance) return;
      this.observe(instance.globalVariables, (variables) => {
        this.options = variables?.availableLanguages.map(l => ({ name: l.name, value: l.isoCode }));
      })
    })
  }

  connectedCallback() {
    super.connectedCallback();
    this.options?.forEach((o) => (o.selected = o.value === this.value));
  }

  #setValue(e: InputEvent) {
    this.setValue((e.target as HTMLInputElement).value);
  }

  render() {
    return html` <uui-select
        .options=${this.options ?? []}
        @change=${this.#setValue}
        label="Select variant"
      ></uui-select>
      <uui-button
        @click=${this.#setValue}
        ?disabled=${!this.value}
        label="Remove"
        >Remove</uui-button
      >`;
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
