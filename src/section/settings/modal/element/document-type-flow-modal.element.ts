import {
  html,
  customElement,
  css,
  when,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UMB_MODAL_MANAGER_CONTEXT,
  UmbModalBaseElement,
} from "@umbraco-cms/backoffice/modal";
import type { UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";
import type { UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import type {
  WorkflowDocumentTypeFlowModalData,
  WorkflowDocumentTypeFlowModalResult,
} from "../token/index.js";
import { add, remove } from "@umbraco-workflow/components";
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
  conditions: Array<any> = [];

  @state()
  selectedLanguage?: string;

  @state()
  selectedType?: string;

  #modalManagerContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    super();

    this.#host = host;
    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
      this.#modalManagerContext = instance;
    });
  }

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
    this.selectedType = this.contentTypes.find((x) => x.selected)?.value;
    this.selectedLanguage = this.languages.find((x) => x.selected)?.value;
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
        variant: "TODO...",
      },
    };

    this.modalContext?.submit();
  }

  #handleClose() {
    this.modalContext?.reject();
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
  }

  #remove(idx: number) {
    let permissions = this.permissions.filter(
      (p) => p.variant === this.selectedLanguage
    );
    permissions = [...remove(permissions, idx)];

    this.permissions = [
      ...this.permissions.filter((p) => p.variant !== this.selectedLanguage),
      ...permissions,
    ];
  }

  async #openGroupPicker() {
    const permissions = [
      ...(await add(
        this.#host,
        this.permissions.filter((p) => p.variant === this.selectedLanguage),
        undefined,
        this.selectedType,
        this.#modalManagerContext,
        { variant: this.selectedLanguage }
      )),
    ];

    this.permissions = [
      ...this.permissions.filter((p) => p.variant !== this.selectedLanguage),
      ...permissions,
    ];
  }

  #handleLanguageChange(e: UUISelectEvent) {
    this.selectedLanguage = e.target.value.toString();
    this.languages.forEach(
      (l) => (l.selected = l.value === this.selectedLanguage)
    );
  }

  #handleTypeChange(e: UUISelectEvent) {
    this.selectedType = e.target.value.toString();
    this.contentTypes.forEach(
      (l) => (l.selected = l.value === this.selectedType)
    );
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
    return html`<uui-box headline=${this.localize.term("workflow_currentFlow")}>
      ${when(
        this.permissions.length,
        () => html` <uui-ref-list>
          ${this.permissions
            .filter((p) => p.variant === this.selectedLanguage)
            .map(
              (p, idx) =>
                html`<workflow-ref-group-permission
                  .name=${p.groupName!}
                  .stage=${p.permission}
                  ?canRemove=${true}
                  @remove=${() => this.#remove(idx)}
                ></workflow-ref-group-permission>`
            )}
        </uui-ref-list>`
      )}

      <workflow-add-button
        .labelKey=${"workflow_addWorkflowGroups"}
        @click=${this.#openGroupPicker}
      ></workflow-add-button>
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
          id="close"
          label="Close"
          @click="${this.#handleClose}"
        ></uui-button>
        <uui-button
          id="submit"
          color="positive"
          look="primary"
          label="Submit"
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
