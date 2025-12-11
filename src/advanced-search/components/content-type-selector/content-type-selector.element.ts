import { UMB_DOCUMENT_TYPE_PICKER_MODAL } from "@umbraco-cms/backoffice/document-type";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  repeat,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_ADVANCEDSEARCH_CONTEXT } from "../../advanced-search-context.token.js";
import type { VariantDropdownElement } from "../index.js";
import type { SelectableLanguageModel } from "@umbraco-workflow/core";
import type { SelectableContentTypePropertyDetailModel } from "@umbraco-workflow/generated";

const elementName = "workflow-advanced-search-content-types";

@customElement(elementName)
export class WorkflowAdvancedSearchContentTypesElement extends UmbLitElement {
  #advancedSearchContext?: typeof WORKFLOW_ADVANCEDSEARCH_CONTEXT.TYPE;

  @state()
  languages: Array<SelectableLanguageModel> = [];

  @state()
  contentTypes: Array<SelectableContentTypePropertyDetailModel> = [];

  @state()
  selectedContentTypes: Array<SelectableContentTypePropertyDetailModel> = [];

  value: {
    selectedContentTypes: Array<string>;
    selectedCultures: Array<string>;
  } = { selectedContentTypes: [], selectedCultures: [] };

  constructor() {
    super();

    this.consumeContext(WORKFLOW_ADVANCEDSEARCH_CONTEXT, (context) => {
      if (!context) return;
      this.#advancedSearchContext = context;

      this.observe(context.languages, (languages) => {
        this.languages = languages;
        this.value.selectedCultures = this.languages.map((x) => x.unique);
      });

      this.observe(context.contentTypes, (contentTypes) => {
        this.contentTypes = contentTypes ?? [];
      });

      this.observe(context.selectedContentTypes, (selectedContentTypes) => {
        this.selectedContentTypes = selectedContentTypes;
        this.value.selectedContentTypes = selectedContentTypes
          .filter((x) => x.alias)
          .map((x) => x.alias!);
      });
    });
  }

  async #addContentType() {
    const selection = await umbOpenModal(this, UMB_DOCUMENT_TYPE_PICKER_MODAL, {
      data: {
        multiple: true,
        hideTreeRoot: true,
      },
      value: {
        selection: [
          ...(this.contentTypes?.filter((x) => x.selected).map((x) => x.key!) ??
            []),
        ],
      },
    })
      .then((result) => result.selection)
      .catch(() => {});

    if (!selection) return;

    this.contentTypes?.forEach((contentType) => {
      this.#advancedSearchContext?.setContentTypeSelected(
        contentType.key,
        (!!contentType.key && selection.includes(contentType.key)) ?? false
      );
    });
  }

  #removeContentType(type) {
    this.#advancedSearchContext?.setContentTypeSelected(type.key, false);
  }

  #onVariantChange(e: CustomEvent) {
    const { value } = e.target as VariantDropdownElement;
    this.value.selectedCultures = value
      .filter((x) => x.selected)
      .map((x) => x.unique);
  }

  render() {
    return html`<uui-box
      .headline=${this.localize.term("workflow_search_selectContentTypes")}
    >
      ${when(
        this.selectedContentTypes?.some((x) => x.varies),
        () => html` <workflow-variant-dropdown
          slot="header-actions"
          .options=${this.languages}
          @change=${this.#onVariantChange}
        ></workflow-variant-dropdown>`
      )}
      <uui-ref-list>
        ${repeat(
          this.selectedContentTypes,
          (type) => type.key,
          (contentType) =>
            html`<uui-ref-node .name=${contentType.name!}>
              <umb-icon
                name=${contentType.icon ?? "icon-folder"}
                slot="icon"
              ></umb-icon
              ><uui-action-bar slot="actions"
                ><uui-button
                  @click=${() => this.#removeContentType(contentType)}
                  ><uui-icon
                    name="delete"
                  ></uui-icon></uui-button></uui-action-bar
            ></uui-ref-node>`
        )}
      </uui-ref-list>

      <uui-button
        look="placeholder"
        @click=${this.#addContentType}
        label=${this.localize.term("workflow_search_addContentTypes")}
      ></uui-button>
    </uui-box>`;
  }

  static styles = css`
    [look="placeholder"] {
      width: 100%;
    }
  `;
}

export default WorkflowAdvancedSearchContentTypesElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAdvancedSearchContentTypesElement;
  }
}
