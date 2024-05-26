import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
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
    )?.value as Array<ContentReviewItem>;
  }

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT,
      (context) => {
        if (!context) return;
        this.#contentReviewsWorkspaceContext = context;

        this.contentTypes = context.getData()?.contentTypes;
        this.languages = context.getData()?.availableLanguages;

        this.observe(context.settings, (settings) => {
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
    const data = {
      hideTreeRoot: true,
      multiple: false,
    };

    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);

    let modalHandler;
    if (this.type === "document") {
      modalHandler = modalContext.open(this, UMB_DOCUMENT_PICKER_MODAL, {
        data,
      });
    } else {
      modalHandler = modalContext.open(this, UMB_DOCUMENT_TYPE_PICKER_MODAL, {
        data,
      });
    }

    await modalHandler.onSubmit().catch(() => undefined);

    const value = modalHandler.getValue();
    if (!value?.selection?.length) return;

    const itemToConfigure: ContentReviewItem = {
      documentKey: this.type === "document" ? value.selection[0]! : undefined,
      documentTypeKey:
        this.type === "documentType" ? value.selection[0]! : undefined,
      type: this.type!,
      configItems: [],
    };

    this.#getDocument(itemToConfigure);
    this.#editReview(itemToConfigure, true);
  }

  async #editReview(itemToConfigure: ContentReviewItem, isAdd = false) {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext.open(
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

    const result = await modalHandler.onSubmit().catch(() => undefined);
    if (!result?.configItems) return;

    const newItem = {
      ...itemToConfigure,
      ...{ configItems: result?.configItems },
    };

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
                html`<uui-ref-node
                  .name=${this.#getProp("name", item)}
                  @open=${() => this.#editReview(item)}
                >
                  <uui-icon
                    slot="icon"
                    name=${this.#getProp("icon", item)}
                  ></uui-icon>
                  <uui-action-bar slot="actions"
                    ><uui-button
                      @click=${() => this.#remove(idx)}
                      label=${this.localize.term("general_remove")}
                    ></uui-button> </uui-action-bar
                ></uui-ref-node>`
            )}
          </uui-ref-list>
        `
      )}

      <uui-button
        @click=${this.#openPicker}
        .label=${this.localize.term("general_add")}
        look="placeholder"
      ></uui-button>`;
  }

  static styles = css`
    [look="placeholder"] {
      width: 100%;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowContentReviewsConfigListElement;
  }
}
