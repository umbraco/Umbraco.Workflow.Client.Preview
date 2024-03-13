import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { LitElement, html } from "@umbraco-cms/backoffice/external/lit";

export abstract class SectionRootBase extends UmbElementMixin(LitElement) {
  abstract headline: string;

  abstract renderSectionRoot();

  render() {
    return html`<umb-body-layout main-no-padding .headline=${this.headline}>
      <umb-body-layout header-transparent>
        <workflow-license-alert></workflow-license-alert>
        ${this.renderSectionRoot()}
      </umb-body-layout>
    </umb-body-layout>`;
  }
}
