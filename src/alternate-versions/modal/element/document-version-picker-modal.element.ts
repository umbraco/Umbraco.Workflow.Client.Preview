import {
  html,
  customElement,
  state,
  css,
  when,
  nothing,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { AlternateVersionItemRepository } from "../../repository/item/alternate-version-item.repository.js";
import type {
  WorkflowDocumentVersionPickerModalData,
  WorkflowDocumentVersionPickerModalResult,
} from "../token/document-version-picker-modal.token.js";
import type { AlternateVersionCollectionResponseModel } from "@umbraco-workflow/generated";
import { UmbPaginationManager } from "@umbraco-cms/backoffice/utils";
import { UUIPaginationEvent } from "@umbraco-cms/backoffice/external/uui";

const elementName = "workflow-document-version-picker-modal";

@customElement(elementName)
export class WorkflowDocumentVersionPickerModalElement extends UmbModalBaseElement<
  WorkflowDocumentVersionPickerModalData,
  WorkflowDocumentVersionPickerModalResult
> {
  #repository = new AlternateVersionItemRepository(this);
  #pagination = new UmbPaginationManager();

  @state()
  private _versions: Array<AlternateVersionCollectionResponseModel> = [];

  @state()
  private _loading = false;

  @state()
  private _currentPageNumber = 1;

  @state()
  private _totalPages = 1;

  constructor() {
    super();

    this.#pagination.setPageSize(5);

    this.observe(
      this.#pagination.currentPage,
      (number) => (this._currentPageNumber = number)
    );
    this.observe(
      this.#pagination.totalPages,
      (number) => (this._totalPages = number)
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this.#requestItems();
  }

  async #requestItems() {
    if (!this.data) return;

    this._loading = true;

    const { data, total, error } = await this.#repository.requestItemsOfCulture(
      {
        unique: this.data.unique,
        culture: this.data.culture ?? undefined,
        segment: this.data.segment ?? undefined,
        skip: this.#pagination.getSkip(),
        take: this.#pagination.getPageSize(),
      }
    );

    this._loading = false;
    if (error) return;

    this.#pagination.setTotalItems(total);

    const versions = this.data.culture
      ? data?.filter((x) => x.culture === this.data?.culture)
      : data;

    if (!versions?.length) {
      return;
    }

    this._versions = versions;
  }

  #onSelect(selectedItem: Partial<AlternateVersionCollectionResponseModel>) {
    this.updateValue({
      selectedItems: [...(this.value?.selectedItems ?? []), selectedItem],
    });
  }

  #onPageChange(event: UUIPaginationEvent) {
    this.#pagination.setCurrentPageNumber(event.target?.current);
    this.#requestItems();
  }

  #renderVersions() {
    return this._versions.map(
      (version) => html`<uui-menu-item
        style="--uui-menu-item-flat-structure: 1;"
        .versionId=${version.unique}
        selectable
        @selected=${() => this.#onSelect(version)}
      >
        <div slot="label">${version.name}</div>
        <umb-icon
          .name=${version.icon ?? "icon-documents"}
          slot="icon"
        ></umb-icon>
      </uui-menu-item> `
    );
  }

  #renderPagination() {
    return html`
      ${this._totalPages > 1
        ? html`
            <uui-pagination
              class="pagination"
              .current=${this._currentPageNumber}
              .total=${this._totalPages}
              firstlabel=${this.localize.term("general_first")}
              previouslabel=${this.localize.term("general_previous")}
              nextlabel=${this.localize.term("general_next")}
              lastlabel=${this.localize.term("general_last")}
              @change=${this.#onPageChange}
            ></uui-pagination>
          `
        : nothing}
    `;
  }

  render() {
    if (!this.data) return;

    if (this._loading) {
      return html`<umb-loading-indicator></umb-loading-indicator>`;
    }

    return html`
      <uui-dialog-layout
        headline=${this.localize.term(
          "workflow_alternateVersions_selectVersion"
        )}
      >
        ${when(
          this._versions.length,
          () => this.#renderVersions(),
          () =>
            html`${this.localize.term(
              "workflow_alternateVersions_noVersions"
            )} `
        )}
        ${this.#renderPagination()}

        <div slot="actions">
          <uui-button
            label=${this.localize.term("general_close")}
            @click=${this._rejectModal}
          ></uui-button>

          ${when(
            this._versions.length,
            () => html` <uui-button
              label=${this.localize.term("general_submit")}
              look="primary"
              color="positive"
              ?disabled=${!this.value?.selectedItems?.length &&
              !this.value?.selectedItem}
              @click=${this._submitModal}
            ></uui-button>`
          )}
        </div>
      </uui-dialog-layout>
    `;
  }

  static styles = css`
    small {
      display: block;
    }

    [slot="label"] {
      padding: var(--uui-size-3) 0;
    }
  `;
}

export default WorkflowDocumentVersionPickerModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowDocumentVersionPickerModalElement;
  }
}
