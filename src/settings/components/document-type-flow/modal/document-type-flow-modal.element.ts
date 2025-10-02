import {
  html,
  customElement,
  css,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { partialUpdateFrozenArray } from "@umbraco-cms/backoffice/observable-api";
import { UMB_APP_LANGUAGE_CONTEXT } from "@umbraco-cms/backoffice/language";
import type {
  StageConditionElement,
  WorkflowDocumentTypeFlowModalData,
  WorkflowDocumentTypeFlowModalResult,
} from "../index.js";
import { type WorkflowApprovalGroupInputElement } from "@umbraco-workflow/approval-group";
import {
  ContentService,
  type ContentTypePropertyModel,
  type DocumentTypePermissionConfigModel,
} from "@umbraco-workflow/generated";

const elementName = "workflow-document-type-flow-modal";

@customElement(elementName)
export class WorkflowDocumentTypeFlowModalElement extends UmbModalBaseElement<
  WorkflowDocumentTypeFlowModalData,
  WorkflowDocumentTypeFlowModalResult
> {
  #contentTypes: Array<ContentTypePropertyModel> = [];

  @state()
  permissions: Array<DocumentTypePermissionConfigModel> = [];

  @state()
  languages: Array<Option & { isDefault: boolean }> = [];

  @state()
  contentTypeOptions: Array<Option & { varies: boolean }> = [];

  @state()
  get selectedPermissions() {
    return this.permissions.filter(
      (p) =>
        p.culture === this.selectedLanguage?.value &&
        p.contentTypeUnique === this.selectedType?.value
    );
  }

  @state()
  get selectedType() {
    return this.contentTypeOptions.find((x) => x.selected);
  }

  @state()
  get selectedLanguage() {
    return this.languages.find((x) => x.selected);
  }

  constructor() {
    super();

    this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.languages, (languages) => {
        this.languages =
        languages.map((l) => ({
          name: l.name,
          value: l.unique,
          selected:
            l.unique === this.selectedType?.value ||
            (!this.selectedType?.varies && l.isDefault),
          isDefault: l.isDefault,
        })) ?? [];
      });
    });
  }

  async connectedCallback() {
    super.connectedCallback();

    const { data } = await tryExecute(
      this,
      ContentService.getContentContentTypes()
    );

    this.permissions = this.data?.permissions ?? [];

    this.#contentTypes = data ?? [];
    this.contentTypeOptions = this.#contentTypes
      ?.filter((x) => !this.data?.existing.includes(x.key))
      .map((x, i, arr) => ({
        name: x.name!,
        value: x.key!,
        varies: x.varies,
        selected: (i === 0 && arr.length === 1) || this.data?.unique === x.key,
      }));
  }

  #handleSubmit() {
    this.value = {
      key: this.selectedType?.value,
      permissions: this.permissions,
    };
    this._submitModal();
  }

  #handleConditionChange(e: CustomEvent) {
    const updatedPermission = (e.target as StageConditionElement).value;
    if (!updatedPermission) return;

    this.permissions = partialUpdateFrozenArray(
      this.permissions,
      { condition: updatedPermission.condition },
      (p) =>
        p.contentTypeUnique === updatedPermission.contentTypeUnique &&
        p.culture === updatedPermission.culture &&
        p.group!.unique === updatedPermission.group?.unique
    );
  }

  async #onApprovalGroupsUpdated(e: CustomEvent) {
    const permissions = (e.target as WorkflowApprovalGroupInputElement)
      .selectedPermissions;

    permissions.forEach((p) => {
      const existing = this.permissions.find(
        (x) => x.group.unique === p.groupUnique
      );

      if (existing) {
        this.permissions = partialUpdateFrozenArray(
          this.permissions,
          {
            ...existing,
            ...p,
          },
          (x) => x.group.unique === existing.group.unique
        );
      } else {
        this.permissions = [
          ...this.permissions,
          {
            group: {
              name: p.name!,
              unique: p.groupUnique,
            },
            approvalThreshold: p.approvalThreshold,
            permission: p.permission,
            culture: this.selectedLanguage!.value,
            contentTypeUnique: this.selectedType!.value,
          },
        ];
      }
    });
  }

  #handleLanguageChange(e: UUISelectEvent) {
    const selectedLanguage = e.target.value.toString();
    this.languages.forEach((l) => (l.selected = l.value === selectedLanguage));
    this.requestUpdate("languages");
  }

  #handleTypeChange(e: UUISelectEvent) {
    const selectedType = e.target.value.toString();
    this.contentTypeOptions.forEach(
      (l) => (l.selected = l.value === selectedType)
    );

    this.languages.forEach((l) => (l.selected = l.isDefault));
    this.requestUpdate();
  }

  #renderTypeSelect() {
    return html`<uui-box headline=${this.localize.term("content_documentType")}>
      <uui-select
        placeholder=${this.localize.term("workflow_selectDocumentTypes", false)}
        ?disabled=${this.contentTypeOptions.length < 2 || !!this.data?.unique}
        @change=${this.#handleTypeChange}
        .options=${this.contentTypeOptions}
      >
      </uui-select>
    </uui-box>`;
  }

  #renderLanguagesSelect() {
    return html`<uui-box headline=${this.localize.term("general_language")}>
      <uui-select
        placeholder=${this.localize.term("workflow_selectVariants", false)}
        ?disabled=${this.languages.length < 2 || !this.selectedType?.varies}
        @change=${this.#handleLanguageChange}
        .options=${this.languages}
      ></uui-select>
    </uui-box>`;
  }

  #renderCurrentFlow() {
    if (!this.selectedLanguage?.value || !this.selectedType?.value) return null;

    return html`<uui-box
      headline=${this.localize.term("workflow_approvalGroups")}
    >
      <workflow-approval-group-input
        .selectedPermissions=${this.selectedPermissions.map((x) => ({
          permission: x.permission,
          approvalThreshold: x.approvalThreshold,
          name: x.group.name,
          groupUnique: x.group.unique,
          icon: x.group.icon,
        }))}
        @change=${this.#onApprovalGroupsUpdated}
        .config=${{
          contentType: this.selectedType?.value,
          remove: true,
          multiple: true,
          configureThreshold: this.data?.configureThreshold,
          defaultThreshold: this.data?.defaultThreshold,
          additionalData: {
            variant: this.selectedLanguage?.value,
          },
        }}
      ></workflow-approval-group-input>
    </uui-box> `;
  }

  #renderConditions() {
    if (
      !this.selectedType?.value ||
      !this.selectedLanguage?.value ||
      !this.selectedPermissions.length
    )
      return null;

    return html`<workflow-stage-conditions
      .config=${{
        variant: this.selectedLanguage.value,
        groups:
          this.selectedPermissions.map((p) => ({
            name: p.group.name,
            unique: p.group.unique,
            condition: p.condition,
          })) ?? [],
        contentType: this.#contentTypes.find(
          (x) => x.key === this.selectedType?.value
        ),
      }}
      @change=${this.#handleConditionChange}
    ></workflow-stage-conditions>`;
  }

  render() {
    return html`<umb-body-layout headline="Document type flow">
      <div id="main">
        ${this.#renderTypeSelect()} ${this.#renderLanguagesSelect()}
        ${this.#renderCurrentFlow()} ${this.#renderConditions()}
      </div>
      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click="${this._rejectModal}"
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          label=${this.localize.term("general_submit")}
          @click=${this.#handleSubmit}
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }

  static styles = [
    css`
      uui-scroll-container {
        overflow-y: scroll;
        max-height: 100%;
        min-height: 0;
        flex: 1;
      }

      uui-box + uui-box,
      uui-box + workflow-stage-conditions {
        margin-top: var(--uui-size-layout-1);
      }
    `,
  ];
}

export default WorkflowDocumentTypeFlowModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowDocumentTypeFlowModalElement;
  }
}
