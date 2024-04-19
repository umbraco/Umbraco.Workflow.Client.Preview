import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import {
  appendToFrozenArray,
  partialUpdateFrozenArray,
} from "@umbraco-cms/backoffice/observable-api";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "../../workspace/settings-workspace.context-token.js";
import { WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL } from "../../modal/index.js";
import {
  ContentService,
  ApprovalGroupService,
} from "@umbraco-workflow/generated";
import type {
  WorkflowConfigUpdateRequestModel,
  LanguageModel,
  UserGroupModel,
  ContentTypePropertyModel,
  WorkflowLicenseModel,
} from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

const elementName = "workflow-document-type-flow";

@customElement(elementName)
export class DocumentTypeApprovalFlowElement extends UmbElementMixin(
  LitElement
) {
  #modalManagerContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;
  #workspaceContext?: typeof WORKFLOW_SETTINGS_WORKSPACE_CONTEXT.TYPE;

  #license?: WorkflowLicenseModel;

  #contentTypes?: Array<ContentTypePropertyModel> = [];
  #groups?: Array<UserGroupModel> = [];
  #languages?: Array<LanguageModel> = [];

  @state()
  value: Array<WorkflowConfigUpdateRequestModel> = [];

  constructor() {
    super();

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
      this.#modalManagerContext = instance;
    });

    this.consumeContext(
      WORKFLOW_SETTINGS_WORKSPACE_CONTEXT,
      async (instance) => {
        this.#workspaceContext = instance;
        this.#observeSettings();
      }
    );

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      if (!instance) return;
      this.observe(instance.license, (license) => (this.#license = license));
    });
  }

  #observeSettings() {
    if (!this.#workspaceContext) return;

    this.observe(this.#workspaceContext.generalSettings, async (settings) => {
      await this.#getContentTypes();
      await this.#getGroups();

      this.value = <Array<WorkflowConfigUpdateRequestModel>>settings?.documentTypeApprovalFlows?.value ?? [];
      this.#languages = this.#workspaceContext?.getData()?.availableLanguages;
    });
  }

  async #getContentTypes() {
    const { data } = await tryExecuteAndNotify(
      this,
      ContentService.getContentContentTypes()
    );
    this.#contentTypes = data;
  }

  async #getGroups() {
    const { data } = await tryExecuteAndNotify(
      this,
      ApprovalGroupService.getApprovalGroup({ skip: 0, take: 1000 })
    );
    this.#groups = data?.items;
  }

  async #openOverlay(key?: string) {
    if (this.#license?.isTrial || !this.#modalManagerContext) {
      return;
    }

    const overlayHandler = this.#modalManagerContext.open(
      this,
      WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL,
      {
        data: {
          contentTypes:
            this.#contentTypes?.filter((x) => !key || x.key === key) ?? [],
          permissions: key
            ? this.value.find((x) => x.key === key)?.permissions ?? []
            : [],
          groups: this.#groups ?? [],
          languages: this.#languages ?? [],
          isNew: !key,
        },
      }
    );

    const { result } = await overlayHandler.onSubmit();
    let newValue = [...this.value];

    if (!key) {
      newValue = appendToFrozenArray(newValue, result);
    } else {
      newValue = partialUpdateFrozenArray(
        newValue,
        result,
        (x) => x.key === result.key
      );
    }

    this.#workspaceContext?.setValue(
      newValue,
      "documentTypeApprovalFlows",
      "generalSettings"
    );
  }

  #getProp(prop: "name" | "icon", key?: string) {
    return this.#contentTypes?.find((x) => x.key === key)?.[prop] ?? "";
  }

  #remove(idx: number) {
    const newValue = [...this.value];
    newValue.splice(idx, 1);

    this.#workspaceContext?.setValue(
      newValue,
      "documentTypeApprovalFlows",
      "generalSettings"
    );
  }

  render() {
    return html`${when(
        this.value?.length,
        () => html`
          <uui-ref-list>
            ${this.value!.map(
              (node, idx) =>
                html`<uui-ref-node
                  name=${this.#getProp("name", node.key ?? undefined)}
                  @open=${() => this.#openOverlay(node.key ?? undefined)}
                >
                  <uui-icon
                    slot="icon"
                    name=${this.#getProp("icon", node.key ?? undefined)}
                  ></uui-icon>
                  <uui-action-bar slot="actions">
                    <uui-button
                      @click=${() => this.#remove(idx)}
                      label="Remove ${this.#getProp(
                        "name",
                        node.key ?? undefined
                      )}"
                      >Remove</uui-button
                    >
                  </uui-action-bar>
                </uui-ref-node>`
            )}
          </uui-ref-list>
        `
      )}
      <workflow-add-button
        .labelKey=${"workflow_addDocumentType"}
        @click=${() => this.#openOverlay()}
      ></workflow-add-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: DocumentTypeApprovalFlowElement;
  }
}
