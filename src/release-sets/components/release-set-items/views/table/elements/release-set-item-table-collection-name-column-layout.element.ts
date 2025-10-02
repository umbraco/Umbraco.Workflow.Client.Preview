import {
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_RELEASESET_ITEM_EDITOR_MODAL } from "../../../../../modal/index.js";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../../../../workspace/release-set-workspace.context-token.js";
import type { ReleaseSetItemResponseModelReadable } from "@umbraco-workflow/generated";
import { WORKFLOW_RELEASESET_ITEM_EDITOR_CONTEXT } from "src/release-sets/components/release-set-versions/release-set-versions-editor.context.js";

const elementName = "release-set-item-table-name-column-layout";

@customElement(elementName)
export class ReleaseSetItemTableNameColumnLayoutElement extends UmbLitElement {
  #workspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;
  #editorContext?: typeof WORKFLOW_RELEASESET_ITEM_EDITOR_CONTEXT.TYPE;

  @property({ attribute: false })
  value!: ReleaseSetItemResponseModelReadable;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      this.#workspaceContext = context;
    });

    this.consumeContext(WORKFLOW_RELEASESET_ITEM_EDITOR_CONTEXT, (context) => {
      this.#editorContext = context;
    });
  }

  async #onClick() {
    await this.#editorContext?.setValue(this.value);

    const value = await umbOpenModal(
      this,
      WORKFLOW_RELEASESET_ITEM_EDITOR_MODAL
    ).catch(() => {});

    if (!value?.item) return;
    this.#workspaceContext?.updateItem({ ...this.value, ...value.item });
  }

  render() {
    if (!this.value) return nothing;

    return html`<uui-button compact @click=${this.#onClick}
      >${this.value.name ?? ""}</uui-button
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ReleaseSetItemTableNameColumnLayoutElement;
  }
}
