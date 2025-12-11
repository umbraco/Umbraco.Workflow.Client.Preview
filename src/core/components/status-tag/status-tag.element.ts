import {
  css,
  customElement,
  html,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import type {
  UUIInterfaceLook,
  UUIInterfaceColor,
} from "@umbraco-cms/backoffice/external/uui";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { StatusModel } from "../../entities.js";

const elementName = "status-tag";

@customElement(elementName)
export class StatusTagElement extends UmbLitElement {
  @property({ type: String })
  value: StatusModel | undefined;

  #getColor(): UUIInterfaceColor {
    if (this.value === "Published" || this.value === "Complete") {
      return "positive";
    }

    if (this.value === "ReadyToPublish") {
      return "positive";
    }

    return "default";
  }

  #getLook(): UUIInterfaceLook {
    if (this.value === "ReadyToPublish") {
      return "outline";
    }

    if (
      this.value === "Draft" ||
      this.value === "Published" ||
      this.value === "Complete"
    ) {
      return "primary";
    }

    return "secondary";
  }

  render() {
    return html`<uui-tag .color=${this.#getColor()} .look=${this.#getLook()}
      >${this.localize.term(`workflow_${this.value?.toLowerCase()}`)}</uui-tag
    >`;
  }

  static styles = css`
    :host {
      text-transform: capitalize;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: StatusTagElement;
  }
}
