import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { PopoverPlacement } from "@umbraco-cms/backoffice/external/uui";

const elementName = "workflow-tooltip";

@customElement(elementName)
export class WorkflowTooltipElement extends UmbElementMixin(LitElement) {
  @state()
  open = false;

  @property()
  key?: string;

  @property()
  icon = "info";

  @property()
  placement: PopoverPlacement = "auto";

  render() {
    return html`<uui-popover
      .placement=${this.placement}
      .open=${this.open}
      @close=${() => (this.open = false)}
    >
      <uui-icon
        slot="trigger"
        name=${this.icon}
        @click=${() => (this.open = !this.open)}
      ></uui-icon>
      <umb-localize slot="popover" .key=${this.key}></umb-localize>
    </uui-popover>`;
  }

  static styles = [
    css`
      uui-popover {
        display: flex;
      }
      [slot="popover"] {
        width: 200px;
        display: block;
        font-weight: 400;
        background-color: var(
          --uui-combobox-popover-background-color,
          var(--uui-color-surface)
        );
        border: 1px solid var(--uui-color-border);
        border-radius: var(--uui-border-radius);
        box-sizing: border-box;
        box-shadow: var(--uui-shadow-depth-3);
        padding: var(--uui-size-2);
        font-size: var(--uui-type-small-size);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowTooltipElement;
  }
}
