import {
  css,
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { BaseTableNameColumnData } from "./types.js";
import { WORKFLOW_EDIT_DOCUMENT_WORKSPACE_PATH_PATTERN } from "../paths/edit-variant-document-path-pattern.js";
import { UMB_DOCUMENT_ENTITY_TYPE } from "@umbraco-cms/backoffice/document";

const elementName = "workflow-table-name-column-layout";

@customElement(elementName)
export class WorkflowTableNameColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: BaseTableNameColumnData;

  #displayName() {
    return this.value.culture !== "*"
      ? `${this.value.name} (${this.value.culture})`
      : this.value.name;
  }

  #entityType() {
    const values: string[] = [];
    if (this.value.culture && this.value.culture !== "*") {
      values.push(this.value.culture);
    }

    if (
      this.value.entityType &&
      this.value.entityType != UMB_DOCUMENT_ENTITY_TYPE
    ) {
      values.push(
        this.localize.term(`workflow_entityType_${this.value.entityType}`)
      );
    }

    return html`<small>${values.join(" | ")}</small>`;
  }

  render() {
    if (!this.value) return nothing;

    return html`<uui-button
      compact
      .href=${WORKFLOW_EDIT_DOCUMENT_WORKSPACE_PATH_PATTERN.generateAbsolute({
        unique: this.value.unique,
        culture: this.value.culture,
      })}
      label=${this.value.name}
      ><div>${this.value.name} ${this.#entityType()}</div></uui-button
    >`;
  }

  static styles = css`
    div {
      text-align: left;
      line-height: 1.2;
    }
    small {
      display: block;
      opacity: 0.6;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowTableNameColumnLayoutElement;
  }
}
