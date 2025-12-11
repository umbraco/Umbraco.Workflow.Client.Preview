import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import {
  UmbDocumentItemRepository,
  UmbDocumentPickerInputContext,
} from "@umbraco-cms/backoffice/document";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../../workspace/index.js";
import { RELEASESET_ITEM_ENTITY_TYPE } from "../../../constants.js";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_RELEASESET_ITEM_EDITOR_MODAL } from "../../../modal/index.js";
import { WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT } from "../../release-set-versions/index.js";
import { ReleaseSetItemResponseModel } from "@umbraco-workflow/generated";

export class WorkflowReleaseSetItemCollectionAddItemAction extends UmbControllerBase {
  #workspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;
  #editorContext?: typeof WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT.TYPE;

  #currentItems?: Array<string>;

  constructor(host: UmbControllerHost) {
    super(host);

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;
      this.#workspaceContext = context;

      this.observe(context.items, (items) => {
        this.#currentItems = items?.map((x) => x.unique);
      });
    });

    this.consumeContext(
      WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT,
      (context) => {
        if (!context) return;
        this.#editorContext = context;
      }
    );
  }

  async execute() {
    const documentPickerContext = new UmbDocumentPickerInputContext(this);

    await documentPickerContext.openPicker({
      multiple: false,
      hideTreeRoot: true,
      pickableFilter: (x) => !this.#currentItems?.includes(x.unique),
    });

    const selectedItem = documentPickerContext.getSelection()?.at(0);
    if (!selectedItem) return;

    if (this.#currentItems?.includes(selectedItem)) {
      this.#openEditor(selectedItem);
    } else {
      await this.#addItem(selectedItem);
    }
  }

  async #openEditor(unique: string) {
    const existingItem = this.#workspaceContext
      ?.getData()
      ?.items.find((x) => x.unique === unique);

    await this.#edit(existingItem);
  }

  async #addItem(selectedItem: string) {
    const detailRepository = new UmbDocumentItemRepository(this);
    const { data } = await detailRepository.requestItems([selectedItem]);

    if (!data?.length) return;

    const item = data[0];

    const newItem: ReleaseSetItemResponseModel = {
      entityType: RELEASESET_ITEM_ENTITY_TYPE,
      name: item.variants.at(0)?.name ?? "",
      icon: item.documentType.icon,
      unique: item.unique,
      status: "Draft",
      items: [],
    };

    await this.#edit(newItem);
  }

  async #edit(item?: ReleaseSetItemResponseModel) {
    if (!item || !this.#editorContext) return;

    await this.#editorContext?.setValue(item);
    const value = await umbOpenModal(
      this,
      WORKFLOW_RELEASESET_ITEM_EDITOR_MODAL
    ).catch(() => {});

    if (!value?.item.unique) return;

    // the returned value is the document with its selected versions.
    // the document may not already be in the set, so we need to check, add, then add the versions.
    const existingData = this.#workspaceContext?.getData();
    if (!existingData) return;

    const document = existingData.items.find(
      (x) => x.unique === value.item.unique
    );

    if (document) {
      this.#workspaceContext?.updateItem({
        ...document,
        items: value.item.items ?? [],
      });

      return;
    }

    this.#workspaceContext?.addItem({
      ...value.item,
      entityType: RELEASESET_ITEM_ENTITY_TYPE,
      name: value.item.name ?? "",
      unique: value.item.unique,
      status: "Draft",
      items: value.item.items ?? [],
    });
  }
}
