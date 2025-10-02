import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { ReleaseSetComponentCollectionElement } from "../release-set-collection-base.element.js";
import {
  WORKFLOW_RELEASESET_ITEM_COLLECTION_CONTEXT,
  WorkflowReleaseSetItemCollectionContext,
} from "./release-set-item-collection.context.js";
import type { ReleaseSetItemResponseModelReadable } from "@umbraco-workflow/generated";
import {
  UMB_MODAL_MANAGER_CONTEXT,
  UmbModalContext,
  umbOpenModal,
} from "@umbraco-cms/backoffice/modal";
import { ALTERNATEVERSION_ENTITY_TYPE } from "@umbraco-workflow/alternate-versions";
import { WORKFLOW_RELEASESET_ITEM_EDITOR_MODAL } from "../../modal/index.js";
import "./views/table/release-set-item-table-collection-view.element.js";
import { WORKFLOW_RELEASESET_ITEM_EDITOR_CONTEXT } from "../release-set-versions/release-set-versions-editor.context.js";

type ModalType = UmbModalContext<{ [key: string]: any }, any>;

const elementName = "workflow-release-set-item-collection";

@customElement(elementName)
export class WorkflowReleaseSetItemCollectionElement extends ReleaseSetComponentCollectionElement<
  ReleaseSetItemResponseModelReadable,
  WorkflowReleaseSetItemCollectionContext
> {
  #reopen = false;
  #lastModalKey?: string;

  #editorContext?: typeof WORKFLOW_RELEASESET_ITEM_EDITOR_CONTEXT.TYPE;

  constructor() {
    super(WORKFLOW_RELEASESET_ITEM_COLLECTION_CONTEXT, ctx => ctx?.items);

    this.consumeContext(WORKFLOW_RELEASESET_ITEM_EDITOR_CONTEXT, (context) => {
      if (!context) return;
      this.#editorContext = context;
    });

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (context) => {
      this.observe(context?.modals, async (modals) => {
        if (!modals) return;
        await this.#calculateReopen(modals);
      });
    });
  }

  async #calculateReopen(modals: Array<ModalType>) {
    if (!modals?.length) return;
    const topModal = modals[modals.length - 1];

    if (this.#reopen && topModal.key !== this.#lastModalKey) {
      this.#reopen = false;
      this.#lastModalKey = topModal.key;

      await this.#reopenItemEditorModal();
      return;
    }

    this.#lastModalKey = topModal.key;
    this.#reopen = topModal.data?.entityType === ALTERNATEVERSION_ENTITY_TYPE;
  }

  async #reopenItemEditorModal() {
    const item = this.#editorContext?.getCurrent();
    if (!item) return;

    const value = await umbOpenModal(
      this,
      WORKFLOW_RELEASESET_ITEM_EDITOR_MODAL
    ).catch(() => {});

    if (!value?.item) return;

    this.workspaceContext?.updateItem({
      ...item,
      ...value.item,
    });
  }
}

export default WorkflowReleaseSetItemCollectionElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetItemCollectionElement;
  }
}
