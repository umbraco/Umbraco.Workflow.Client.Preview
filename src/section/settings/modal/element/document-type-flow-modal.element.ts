import {
  html,
  customElement,
  css,
  when,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";
import type {
  WorkflowDocumentTypeFlowModalData,
  WorkflowDocumentTypeFlowModalResult,
} from "../token/index.js";
import { type WorkflowApprovalGroupInputElement } from "@umbraco-workflow/components";
import type { UserGroupPermissionsModel } from "@umbraco-workflow/generated";

const elementName = "workflow-document-type-flow-modal";

@customElement(elementName)
export class WorkflowDocumentTypeFlowModalElement extends UmbModalBaseElement<
  WorkflowDocumentTypeFlowModalData,
  WorkflowDocumentTypeFlowModalResult
> {
  @state()
  permissions: Array<UserGroupPermissionsModel> = [];

  @state()
  languages: Array<Option> = [];

  @state()
  contentTypes: Array<Option> = [];

  @state()
  selectedLanguage?: string;

  @state()
  selectedType?: string;

  @state()
  private _selectedGroups: Array<string> = [];

  connectedCallback() {
    super.connectedCallback();

    this.languages =
      this.data?.languages.map((l, i) => ({
        name: l.name!,
        value: l.isoCode!,
        selected: i === 0,
      })) ?? [];

    this.contentTypes =
      this.data?.contentTypes.map((x, i, arr) => ({
        name: x.name!,
        value: x.key!,
        selected: i === 0 && arr.length === 1,
      })) ?? [];

    this.permissions = this.data?.permissions ?? [];
    this.selectedType = (
      this.contentTypes.find((x) => x.selected) ?? this.contentTypes[0]
    ).value;
    this.selectedLanguage = (
      this.languages.find((x) => x.selected) ?? this.languages[0]
    ).value;

    this.#setGroupSelection();
  }

  #handleSubmit() {
    const documentType = this.data?.contentTypes.find(
      (x) => x.key === this.selectedType
    );

    if (!documentType) throw new Error("document type is missing");

    this.value = {
      result: {
        id: documentType.id,
        key: documentType.key,
        permissions: this.permissions,
        variant: this.selectedLanguage!,
      },
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

    const permissions = [...this.permissions];
    permissions[permissionIndex] = updatedPermission;

    this.permissions = [...permissions];

    this.#setGroupSelection();
  }

  async #onApprovalGroupsChange(e: CustomEvent) {
    const target = e.target as WorkflowApprovalGroupInputElement;

    const permissions = target.selectedPermissions(
      undefined,
      this.selectedType,
      {
        variant: this.selectedLanguage,
      }
    );

    this.permissions = [
      ...this.permissions.filter((p) => p.variant !== this.selectedLanguage),
      ...permissions,
    ];

    this.#setGroupSelection();
  }

  #handleLanguageChange(e: UUISelectEvent) {
    this.selectedLanguage = e.target.value.toString();
    this.languages.forEach(
      (l) => (l.selected = l.value === this.selectedLanguage)
    );

    this.#setGroupSelection();
  }

  #handleTypeChange(e: UUISelectEvent) {
    this.selectedType = e.target.value.toString();
    this.contentTypes.forEach(
      (l) => (l.selected = l.value === this.selectedType)
    );

    this.#setGroupSelection();
  }

  #setGroupSelection() {
    this._selectedGroups = this.permissions
      .filter(
        (p) =>
          p.variant === this.selectedLanguage &&
          p.contentTypeKey === this.selectedType
      )
      .map((x) => x.groupKey);
  }

  #renderTypeSelect() {
    return html`<uui-box headline=${this.localize.term("content_documentType")}>
      <uui-select
        placeholder="Select document type"
        ?disabled=${this.contentTypes.length < 2}
        @change=${this.#handleTypeChange}
        .options=${this.contentTypes}
      >
      </uui-select>
    </uui-box>`;
  }

  #renderLanguagesSelect() {
    return html`<uui-box headline=${this.localize.term("general_language")}>
      <uui-select
        ?disabled=${this.languages.length < 2}
        @change=${this.#handleLanguageChange}
        .options=${this.languages}
      ></uui-select>
    </uui-box>`;
  }

  #renderCurrentFlow() {
    return html`<uui-box
      headline=${this.localize.term("workflow_approvalGroups")}
    >
      <workflow-approval-group-input
        .selection=${this._selectedGroups}
        @change=${this.#onApprovalGroupsChange}
      ></workflow-approval-group-input>
    </uui-box> `;
  }

  #renderConditions() {
    const selectedType = this.contentTypes.find((x) => x.selected);
    if (!selectedType || !this.selectedLanguage || !this.permissions.length)
      return null;

    return html`<workflow-stage-conditions
      .variant=${this.languages.find((x) => x.selected)}
      .contentType=${this.data?.contentTypes.find(
        (x) => x.key === selectedType.value
      )}
      .permissions=${this.permissions}
      @change=${this.#handleConditionChange}
    ></workflow-stage-conditions>`;
  }

  render() {
    return html`<umb-body-layout headline="Document type flow">
      <div id="main">
        ${when(this.data?.isNew, () => this.#renderTypeSelect())}
        ${when(this.selectedType, () => this.#renderLanguagesSelect())}
        ${when(this.selectedLanguage, () => this.#renderCurrentFlow())}
        ${when(this.selectedLanguage, () => this.#renderConditions())}
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
