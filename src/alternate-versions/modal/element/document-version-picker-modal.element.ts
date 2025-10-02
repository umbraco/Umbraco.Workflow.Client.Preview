import {
  html,
  customElement,
  state,
  css,
  repeat,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type {
  UUIMenuItemElement,
  UUIMenuItemEvent,
} from "@umbraco-cms/backoffice/external/uui";
import {
  UMB_APP_LANGUAGE_CONTEXT,
  type UmbLanguageDetailModel,
} from "@umbraco-cms/backoffice/language";
import { AlternateVersionItemRepository } from "../../repository/item/alternate-version-item.repository.js";
import type {
  WorkflowDocumentVersionPickerModalData,
  WorkflowDocumentVersionPickerModalResult,
} from "../token/document-version-picker-modal.token.js";
import { WorkflowVersionSorterController } from "@umbraco-workflow/release-sets";
import { type WorkflowAlternateVersionCollectionModel } from "@umbraco-workflow/alternate-versions";
import type { AlternateVersionCollectionResponseModel } from "@umbraco-workflow/generated";

const elementName = "workflow-document-version-picker-modal";

@customElement(elementName)
export class WorkflowDocumentVersionPickerModalElement extends UmbModalBaseElement<
  WorkflowDocumentVersionPickerModalData,
  WorkflowDocumentVersionPickerModalResult
> {
  #versionSorter = new WorkflowVersionSorterController();
  #repository = new AlternateVersionItemRepository(this);

  @state()
  private _versions: Record<
    string,
    Array<AlternateVersionCollectionResponseModel>
  > = {};

  @state()
  private _multiCultures = false;

  @state()
  private _loading = false;

  #languages?: Array<UmbLanguageDetailModel> = [];
  #defaultLanguage?: UmbLanguageDetailModel;

  constructor() {
    super();

    this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.languages, (languages) => {
        this.#defaultLanguage = languages?.find((x) => x.isDefault);
        this.#languages = languages;
      });
    });
  }

  async connectedCallback() {
    super.connectedCallback();
    if (!this.data) return;

    this._loading = true;

    const { data, error } = await this.#repository.requestItems([
      this.data.unique,
    ]);

    this._loading = false;

    if (error) return;
    const versions = this.data.culture
      ? data?.filter((x) => x.variant === this.data?.culture)
      : data;

    if (!versions?.length) {
      return;
    }

    this._versions = this.#versionSorter.sortVersions(
      versions ?? [],
      this.#defaultLanguage?.unique ?? "en-US"
    );

    this._multiCultures = versions.length !== 0;
  }

  #onSelect(
    e: UUIMenuItemEvent,
    selectedItem: Partial<WorkflowAlternateVersionCollectionModel>
  ) {
    const target = e.target as UUIMenuItemElement;

    if (this.data?.multiple) {
      this.updateValue({
        selectedItems: [...(this.value?.selectedItems ?? []), selectedItem],
      });
      return;
    }

    this.updateValue({ selectedItem });

    target.parentElement
      ?.querySelectorAll("uui-menu-item")
      .forEach((childNode) => {
        if (childNode.getAttribute("version-id") !== `${selectedItem.unique}`) {
          childNode.selected = false;
        }
      });
  }

  #renderMenuItem(item: Partial<WorkflowAlternateVersionCollectionModel>) {
    return html`<uui-menu-item
      style="--uui-menu-item-flat-structure: 1;"
      .versionId=${item.unique}
      selectable
      @selected=${(e) => this.#onSelect(e, item)}
    >
      <div slot="label">${item.name}</div>
      <umb-icon .name=${item.icon} slot="icon"></umb-icon>
    </uui-menu-item>`;
  }

  #renderVersions() {
    return repeat(
      Object.keys(this._versions),
      (culture) => culture,
      (culture) =>
        html`<div>
          ${when(
            Object.keys(this._versions).length > 1,
            () => html` <strong
              >${this.#languages?.find((x) => x.unique === culture)?.name ??
              culture}</strong
            >`
          )}
          ${repeat(
            this._versions[culture] ?? [],
            (version) => version,
            (version) =>
              this.#renderMenuItem({
                ...version,
                ...{ icon: version.icon ?? "icon-documents" },
              })
          )}
        </div>`
    );
  }

  #renderEmpty() {
    return html`${this.localize.term(
      "workflow_alternateVersions_noVersions"
    )} `;
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
          this._multiCultures,
          () => this.#renderVersions(),
          () => this.#renderEmpty()
        )}

        <div slot="actions">
          <uui-button
            label=${this.localize.term("general_close")}
            @click=${this._rejectModal}
          ></uui-button>

          ${when(
            this._multiCultures,
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
