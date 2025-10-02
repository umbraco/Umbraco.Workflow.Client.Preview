
import {  html } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

export abstract class SectionRootBaseElement extends UmbLitElement {
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
