import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { partialUpdateFrozenArray } from "@umbraco-cms/backoffice/observable-api";
import {
  UMB_DOCUMENT_PICKER_MODAL,
  UmbDocumentItemRepository,
} from "@umbraco-cms/backoffice/document";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL } from "@umbraco-cms/backoffice/document-type";
import { WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT } from "../../workspace/content-reviews-workspace.context-token.js";
import type { ContentReviewItem, ContentReviewType } from "../../types.js";
import { WORKFLOW_CONTENTREVIEWS_CONFIG_MODAL } from "../../modal/token/index.js";
import type {
  ContentReviewsSettingsModel,
  ContentTypePropertyModel,
  LanguageModel,
} from "@umbraco-workflow/generated";

const elementName = "workflow-content-reviews-config-list";

@customElement(elementName)
export class WorkflowContentReviewsConfigListElement extends UmbElementMixin(
  LitElement
) {
  #modalManagerContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;
  #contentReviewsWorkspaceContext?: typeof WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT.TYPE;
  #documentRepository = new UmbDocumentItemRepository(this);

  @property()
  type?: ContentReviewType;

  @state()
  settings?: ContentReviewsSettingsModel;

  @state()
  languages?: Array<LanguageModel>;

  @state()
  contentTypes?: Array<ContentTypePropertyModel>;

  @state()
  get value(): Array<ContentReviewItem> {
    return (
      this.type === "document"
        ? this.settings?.contentItemReviews
        : this.settings?.documentTypeReviews
    )?.value;
  }

  constructor() {
    super();

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
      if (!instance) return;
      this.#modalManagerContext = instance;
    });

    this.consumeContext(
      WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT,
      (instance) => {
        if (!instance) return;
        this.#contentReviewsWorkspaceContext = instance;

        this.contentTypes = instance.getData()?.contentTypes;
        this.languages = instance.getData()?.availableLanguages;

        this.observe(instance.settings, (settings) => {
          this.settings = settings;
        });
      }
    );
  }

  #setValue(value: Array<ContentReviewItem>) {
    this.#contentReviewsWorkspaceContext?.setContentReviewValue(
      value,
      this.type === "document" ? "contentItemReviews" : "documentTypeReviews"
    );
  }

  async #openPicker() {
    if (!this.#modalManagerContext) return;

    const data = {
      hideTreeRoot: true,
      multiple: false,
    };

    let modalHandler;
    if (this.type === "document") {
      modalHandler = this.#modalManagerContext.open(
        this,
        UMB_DOCUMENT_PICKER_MODAL,
        {
          data,
        }
      );
    } else {
      modalHandler = this.#modalManagerContext.open(
        this,
        UMB_DOCUMENT_TYPE_PICKER_MODAL,
        { data }
      );
    }

    const { selection } = await modalHandler.onSubmit();

    if (!selection?.length) return;

    const itemToConfigure: ContentReviewItem = {
      documentKey: this.type === "document" ? selection[0]! : undefined,
      documentTypeKey: this.type === "documentType" ? selection[0]! : undefined,
      type: this.type!,
      configItems: [],
    };

    this.#getDocument(itemToConfigure);
    this.#editReview(itemToConfigure, true);
  }

  async #editReview(itemToConfigure: ContentReviewItem, isAdd = false) {
    const modalHandler = this.#modalManagerContext?.open(
      this,
      WORKFLOW_CONTENTREVIEWS_CONFIG_MODAL,
      {
        data: {
          model: itemToConfigure,
          type: this.type!,
          isAdd,
          languages: this.languages ?? [],
        },
      }
    );

    const { configItems } = await modalHandler!.onSubmit();
    const newItem = { ...itemToConfigure, ...{ configItems } };

    if (isAdd) {
      this.#setValue([...this.value, newItem]);
    } else {
      const newValue = partialUpdateFrozenArray(this.value, newItem, (x) =>
        this.type === "document"
          ? x.documentKey === newItem.documentKey
          : x.documentTypeKey === newItem.documentTypeKey
      );
      this.#setValue(newValue);
    }
  }

  async #getDocument(item: ContentReviewItem) {
    if (!item.documentKey) {
      return;
    }

    const { data } = await this.#documentRepository.requestItems([
      item.documentKey,
    ]);

    if (!data) return;

    item.name = data[0].name;
    item.icon = data[0].documentType?.icon;
  }

  #getProp(prop: "name" | "icon", item: ContentReviewItem) {
    const key =
      this.type === "document" ? item.documentKey : item.documentTypeKey;

    if (item[prop] !== undefined) return item[prop]!;
    return this.contentTypes?.find((x) => x.key === key)?.[prop] ?? "";
  }

  #remove(idx: number) {
    const value = [...this.value];
    const deleted = value.splice(idx, 1);
    this.#setValue(value);
    this.#contentReviewsWorkspaceContext?.deleteReview(deleted[0]);
  }

  render() {
    return html`${when(
        this.value?.length,
        () => html`
          <uui-ref-list>
            ${this.value.map(
              (item, idx) =>
                html`<workflow-ref-group-permission
                  .name=${this.#getProp("name", item)}
                  .icon=${this.#getProp("icon", item)}
                  ?canEdit=${true}
                  ?canRemove=${true}
                  @edit=${() => this.#editReview(item)}
                  @remove=${() => this.#remove(idx)}
                ></workflow-ref-group-permission>`
            )}
          </uui-ref-list>
        `
      )}

      <workflow-add-button
        @click=${this.#openPicker}
        .labelKey=${"workflow_addItem"}
      >
      </workflow-add-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowContentReviewsConfigListElement;
  }
}
