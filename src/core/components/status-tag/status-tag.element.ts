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
import type { StatusModel } from "@umbraco-workflow/core";
import {
  ReleaseSetItemStatusModel,
  ReleaseSetStatusModel,
} from "@umbraco-workflow/generated";

const elementName = "status-tag";

@customElement(elementName)
export class StatusTagElement extends UmbLitElement {
  @property({ type: String })
  value?: StatusModel;

  #getColor(): UUIInterfaceColor {
    if (
      this.value === ReleaseSetStatusModel.PUBLISHED ||
      this.value === ReleaseSetStatusModel.COMPLETE
    ) {
      return "positive";
    }

    if (this.value === ReleaseSetItemStatusModel.READY_TO_PUBLISH) {
      return "positive";
    }

    return "default";
  }

  #getLook(): UUIInterfaceLook {
    if (this.value === ReleaseSetItemStatusModel.READY_TO_PUBLISH) {
      return "outline";
    }

    if (
      this.value === ReleaseSetStatusModel.DRAFT ||
      this.value === ReleaseSetStatusModel.PUBLISHED ||
      this.value === ReleaseSetStatusModel.COMPLETE
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
