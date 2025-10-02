import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import {
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { DropdownBaseElement } from "@umbraco-workflow/components";
import type { SelectableLanguageModel } from "@umbraco-workflow/core";

const elementName = "workflow-variant-dropdown";

@customElement(elementName)
export class VariantDropdownElement extends DropdownBaseElement<
  Array<SelectableLanguageModel>
> {
  @property({ type: Array })
  options: Array<SelectableLanguageModel> = [];

  selectedCount?: number;

  @state()
  label = "All";

  #select(option: SelectableLanguageModel) {
    this.options = this.options.map((o) => {
      if (o.unique === option.unique) {
        o = { ...o, ...{ selected: !o.selected } };
      }
      return o;
    });

    const selectedVariants = this.options.filter((x) => x.selected);
    this.selectedCount = selectedVariants.length;
    this.value = this.options;

    if (this.selectedCount === this.options.length) {
      this.label = "All";
    } else if (this.selectedCount === 1) {
      this.label = selectedVariants[0].name;
    } else {
      this.label = `${selectedVariants[0].name} + ${this.selectedCount - 1}`;
    }

    this.dispatchEvent(new UmbChangeEvent());
  }

  #renderContent() {
    return html`${this.options.map(
      (option) => html` <uui-checkbox
        value=${option.unique}
        label=${option.name}
        ?checked=${option.selected}
        .disabled=${this.selectedCount === 1 && option.selected}
        @change=${() => this.#select(option)}
      ></uui-checkbox>`
    )}`;
  }

  render() {
    return html` <umb-dropdown
      id="dropdown"
      compact
      label="select variant"
      placement="bottom-end"
    >
      <span slot="label"
        >${this.localize.term("workflow_variant")}:
        <span>${this.label}</span>
      </span>
      <div>${this.#renderContent()}</div>
    </umb-dropdown>`;
  }

  static styles = [
    ...DropdownBaseElement.styles,
    css`
      uui-button {
        --uui-button-padding-top-factor: 0;
        --uui-button-padding-right-factor: 0;
        --uui-button-padding-bottom-factor: 0;
        --uui-button-padding-left-factor: 0;
        min-height: 0;
      }

      div {
        display: flex;
        flex-direction: column;
        padding: var(--uui-size-2);
      }
    `,
  ];
}

export default VariantDropdownElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: VariantDropdownElement;
  }
}
