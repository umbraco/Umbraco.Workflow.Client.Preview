import {
  html,
  customElement,
  css,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";
import type {
  WorkflowDocumentTypeFlowModalData,
  WorkflowDocumentTypeFlowModalResult,
} from "../token/index.js";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "../../workspace/settings-workspace.context-token.js";
import { type WorkflowApprovalGroupInputElement } from "@umbraco-workflow/components";
import {
  type ContentTypePropertyModel,
  type UserGroupPermissionsModel,
} from "@umbraco-workflow/generated";

const elementName = "workflow-document-type-flow-modal";

@customElement(elementName)
export class WorkflowDocumentTypeFlowModalElement extends UmbModalBaseElement<
  WorkflowDocumentTypeFlowModalData,
  WorkflowDocumentTypeFlowModalResult
> {
  #contentTypes: Array<ContentTypePropertyModel> = [];

  @state()
  permissions: Array<UserGroupPermissionsModel> = [];

  @state()
  languages: Array<Option & { isDefault: boolean }> = [];

  @state()
  contentTypeOptions: Array<Option & { varies: boolean }> = [];

  @state()
  get selectedPermissions() {
    return this.permissions.filter(
      (p) =>
        p.variant === this.selectedLanguage?.value &&
        p.contentTypeKey === this.selectedType?.value
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

  async connectedCallback() {
    super.connectedCallback();

    const workspaceContext = await this.getContext(
      WORKFLOW_SETTINGS_WORKSPACE_CONTEXT
    );

    this.#contentTypes = this.data?.contentTypes ?? [];
    this.permissions = this.data?.permissions ?? [];

    this.contentTypeOptions = this.#contentTypes
      ?.filter((x) => !this.data?.existing.includes(x.key))
      .map((x, i, arr) => ({
        name: x.name!,
        value: x.key!,
        varies: x.varies,
        selected: (i === 0 && arr.length === 1) || this.data?.key === x.key,
      }));

    this.languages =
      workspaceContext?.getData()?.availableLanguages.map((l) => ({
        name: l.name!,
        value: l.isoCode!,
        selected:
          l.isoCode === this.selectedType?.value ||
          (!this.selectedType?.varies && l.isDefault),
        isDefault: l.isDefault,
      })) ?? [];
  }

  #handleSubmit() {
    const documentType = this.#contentTypes.find(
      (x) => x.key === this.selectedType?.value
    );

    if (!documentType) throw new Error("document type is missing");

    this.value = {
      id: documentType.id,
      key: documentType.key,
      permissions: this.permissions,
    };

    this.modalContext?.submit();
  }

  #handleConditionChange(e: CustomEvent) {
    const updatedPermission = e.detail.permission as UserGroupPermissionsModel;
    const permissionIndex = this.permissions.findIndex(
      (p) =>
        p.contentTypeKey === updatedPermission.contentTypeKey &&
        p.variant === updatedPermission.variant &&
        p.groupKey === updatedPermission.groupKey
    );

    this.permissions[permissionIndex].condition = updatedPermission.condition;
  }

  async #onApprovalGroupsUpdated(e: CustomEvent) {
    const permissions = (e.target as WorkflowApprovalGroupInputElement)
      .selectedPermissions;

    this.permissions = [
      ...this.permissions.filter(
        (p) => p.variant !== this.selectedLanguage?.value
      ),
      ...permissions,
    ];
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
    this.requestUpdate("contentTypeOptions");
  }

  #renderTypeSelect() {
    return html`<uui-box headline=${this.localize.term("content_documentType")}>
      <uui-select
        placeholder=${this.localize.term("workflow_selectDocumentTypes", false)}
        ?disabled=${this.contentTypeOptions.length < 2 || !this.data?.isNew}
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
        .selectedPermissions=${this.selectedPermissions}
        @updated=${this.#onApprovalGroupsUpdated}
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
      !this.permissions.length
    )
      return null;

    return html`<workflow-stage-conditions
      .value=${this.permissions}
      .config=${{
        variant: this.selectedLanguage.value,
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
