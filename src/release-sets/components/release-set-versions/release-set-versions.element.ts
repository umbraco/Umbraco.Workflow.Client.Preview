import {
  css,
  customElement,
  html,
  repeat,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import {
  WORKFLOW_CREATE_ALTERNATEVERSION_WORKSPACE_PATH_PATTERN,
  WORKFLOW_DOCUMENTVERSION_PICKER_MODAL,
} from "@umbraco-workflow/alternate-versions";
import {
  UMB_APP_LANGUAGE_CONTEXT,
  type UmbLanguageDetailModel,
} from "@umbraco-cms/backoffice/language";
import { RELEASESET_VERSION_ENTITY_TYPE } from "../../constants.js";
import { WorkflowVersionSorterController } from "../../version-sorter.controller.js";
import { WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT } from "./release-set-versions-editor.context-token.js";
import {
  ContentVariationModel,
  type ReleaseSetVersionResponseModel,
} from "@umbraco-workflow/generated";
import { WORKFLOW_RELEASESET_ITEM_COLLECTION_CONTEXT } from "../release-set-items/index.js";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../workspace/index.js";

const elementName = "workflow-release-set-versions";

@customElement(elementName)
export class WorkflowReleaseSetVersionsElement extends UmbLitElement {
  #editorContext?: typeof WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT.TYPE;
  #releaseSetWorkspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;

  #versionSorter = new WorkflowVersionSorterController();
  #languages: Array<UmbLanguageDetailModel> = [];
  #defaultCulture?: string;
  #versionWorkspaceModalPath?: string;

  @state()
  private _versions: Record<string, Array<ReleaseSetVersionResponseModel>> = {};

  @state()
  private _variation?: ContentVariationModel;

  constructor() {
    super();

    this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (context) => {
      this.observe(context?.languages, (languages) => {
        this.#defaultCulture = languages?.find((x) => x.isDefault)?.unique;
        this.#languages = languages ?? [];
      });
    });

    this.consumeContext(
      WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT,
      (context) => {
        if (!context) return;
        this.#editorContext = context;

        this.observe(this.#editorContext.variation, (variation) => {
          if (!variation) return;
          this._variation = variation;
          this.#ensureVariants();
        });

        this.observe(this.#editorContext.items, (items) => {
          this._versions = this.#versionSorter.sortVersions(
            items,
            this.#defaultCulture ?? ""
          );

          this.#ensureVariants();
        });
      }
    );

    this.consumeContext(
      WORKFLOW_RELEASESET_ITEM_COLLECTION_CONTEXT,
      (context) => {
        this.observe(context?.alternateVersionModalPath, (path) => {
          if (!path) return;
          this.#versionWorkspaceModalPath = path;
        });
      }
    );

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;
      this.#releaseSetWorkspaceContext = context;
    });
  }

  #ensureVariants() {
    if (!this._variation || !this.#defaultCulture) return;

    if (this._variation === "Nothing") {
      this._versions[this.#defaultCulture] =
        this._versions[this.#defaultCulture] ?? [];

      return;
    }

    this.#languages.forEach((language) => {
      if (!Object.keys(this._versions).includes(language.unique)) {
        this._versions[language.unique] = [];
      }
    });
  }

  #getLanguage(culture: string) {
    return this.#languages.find((x) => x.unique === culture)?.name ?? culture;
  }

  async #createVersion(culture: string) {
    const unique = this.#editorContext?.getUnique();
    if (!unique || !this.#versionWorkspaceModalPath) return;

    const path =
      WORKFLOW_CREATE_ALTERNATEVERSION_WORKSPACE_PATH_PATTERN.generateAbsolute({
        base: this.#versionWorkspaceModalPath.slice(0, -1),
        unique,
        culture,
      });

    history.pushState({}, "", path);
  }

  async #addVersion(culture: string) {
    const unique = this.#editorContext?.getUnique();
    if (!unique) return;

    const value = await umbOpenModal(
      this,
      WORKFLOW_DOCUMENTVERSION_PICKER_MODAL,
      {
        data: {
          unique,
          culture,
        },
      }
    ).catch(() => {});

    if (!value?.selectedItems?.length) return;

    // when a default date is set, it should be applied to the parent set, assuming
    // that the default date is earlier than the release set date.
    if (
      (this.#editorContext?.defaultReleaseDate ?? "") <
      (this.#releaseSetWorkspaceContext?.getData()?.releaseDate ?? "")
    ) {
      this.#releaseSetWorkspaceContext?.update({
        releaseDate: this.#editorContext?.defaultReleaseDate,
      });
    }

    value.selectedItems.forEach((selectedItem) => {
      const version = {
        ...selectedItem,
        nodeUnique: unique,
        entityType: RELEASESET_VERSION_ENTITY_TYPE,
        status: selectedItem.status ?? "Draft",
        releaseDate: this.#editorContext?.defaultReleaseDate,
        expireAction: "Revert",
      };

      this.#editorContext?.addVersion(
        version as ReleaseSetVersionResponseModel
      );
    });
  }

  #renderItems(culture: string) {
    return repeat(
      this._versions[culture],
      (item) => item.unique,
      (item: ReleaseSetVersionResponseModel, idx: number) =>
        html`<release-set-version
          .version=${item}
          .requiresReleaseDate=${idx !== 0 && !item.releaseDate}
        ></release-set-version>`
    );
  }

  render() {
    return repeat(
      Object.keys(this._versions),
      (culture) => culture,
      (culture) =>
        html`<uui-box>
          ${when(
            Object.keys(this._versions).length > 1,
            () => html` <span slot="headline"
              >${this.#getLanguage(culture)}</span
            >`
          )}

          <uui-ref-list> ${this.#renderItems(culture)} </uui-ref-list>

          <div id="controls">
            <uui-button
              look="placeholder"
              @click=${() => this.#addVersion(culture)}
              .label=${this.localize.term(
                "workflow_alternateVersions_addExistingVersion"
              )}
            ></uui-button>
            <span>${this.localize.term("general_or")}</span>
            <uui-button
              look="placeholder"
              @click=${() => this.#createVersion(culture)}
              .label=${this.localize.term(
                "workflow_alternateVersions_createNewVersion"
              )}
            ></uui-button>
          </div>
        </uui-box>`
    );
  }

  static styles = css`
    uui-box + uui-box {
      display: block;
      margin-top: var(--uui-size-layout-1);
    }

    [look="placeholder"] {
      width: 100%;
    }

    #controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--uui-size-space-2);
      gap: var(--uui-size-space-2);
    }

    release-set-version {
      display: block;
      position: relative;
      --dotC: 10px;
      --dotR: 5px;

      &::before,
      &::after {
        content: "";
        position: absolute;
        z-index: 1;
        background-color: var(--uui-color-interactive);
      }

      &::before {
        border-top: none;
        width: 2px;
        top: -2px;
        left: -1px;
        bottom: -2px;
      }

      &::after {
        width: var(--dotC);
        height: var(--dotC);
        top: calc(50% - var(--dotR));
        left: calc(-1 * var(--dotR));
        border-radius: 50%;
      }
    }

    release-set-version:only-child {
      &::before,
      &::after {
        display: none;
      }
    }

    release-set-version:first-child::before {
      top: 50%;
    }

    release-set-version:last-child::before {
      bottom: 50%;
    }
  `;
}

export default WorkflowReleaseSetVersionsElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetVersionsElement;
  }
}
