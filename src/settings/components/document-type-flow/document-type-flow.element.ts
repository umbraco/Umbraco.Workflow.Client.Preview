import {
  css,
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
import { WorkflowSettingsElementBase } from "../settings-component.base.js";
import { WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL } from "./index.js";
import {
  ContentService,
  type WorkflowConfigUpdateRequestModel,
  type ContentTypePropertyModel,
  type WorkflowLicenseModel,
} from "@umbraco-workflow/generated";

import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

const elementName = "workflow-document-type-flow";

@customElement(elementName)
export class DocumentTypeApprovalFlowElement extends WorkflowSettingsElementBase {
  #license?: WorkflowLicenseModel;

  @state()
  contentTypes: Array<ContentTypePropertyModel> = [];

  @state()
  value: Array<WorkflowConfigUpdateRequestModel> = [];

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      if (!instance) return;
      this.observe(instance.license, (license) => (this.#license = license));
    });
  }

  async connectedCallback() {
    super.connectedCallback();

    const { data } = await tryExecuteAndNotify(
      this,
      ContentService.getContentContentTypes()
    );

    this.contentTypes = data ?? [];
  }

  init() {
    this.value =
      <Array<WorkflowConfigUpdateRequestModel>>(
        this.generalSettings?.documentTypeApprovalFlows?.value
      ) ?? [];
  }

  async #openOverlay(key?: string | null) {
    if (this.#license?.isTrial) {
      return;
    }

    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext.open(
      this,
      WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL,
      {
        data: {
          contentTypes: this.contentTypes,
          existing: this.value.map((x) => x.key).filter((x) => x !== key),
          key,
          permissions: key
            ? this.value.find((x) => x.key === key)?.permissions ?? []
            : [],
          isNew: !key,
          configureThreshold: this.configureApprovalThreshold(),
          defaultThreshold: this.defaultApprovalThreshold(),
        },
      }
    );

    const result = (await modalHandler
      .onSubmit()
      .catch(() => undefined)) as WorkflowConfigUpdateRequestModel;

    if (!result) return;

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

    this.workspaceContext?.setValue(
      newValue,
      "documentTypeApprovalFlows",
      "generalSettings"
    );
  }

  #getProp(prop: "name" | "icon", key?: string | null) {
    return this.contentTypes?.find((x) => x.key === key)?.[prop] ?? "";
  }

  #remove(idx: number) {
    const newValue = [...this.value];
    newValue.splice(idx, 1);

    this.workspaceContext?.setValue(
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
                  .name=${this.#getProp("name", node.key)}
                  @open=${() => this.#openOverlay(node.key)}
                >
                  <uui-icon
                    slot="icon"
                    name=${this.#getProp("icon", node.key)}
                  ></uui-icon>
                  <uui-action-bar slot="actions">
                    <uui-button
                      @click=${() => this.#remove(idx)}
                      label=${this.localize.term("general_remove")}
                    ></uui-button
                    >s
                  </uui-action-bar>
                </uui-ref-node>`
            )}
          </uui-ref-list>
        `
      )}
      <uui-button
        .label=${this.localize.term("workflow_addDocumentType")}
        look="placeholder"
        @click=${this.#openOverlay}
      ></uui-button> `;
  }

  static styles = css`
    [look="placeholder"] {
      width: 100%;
    }
  `;
}

export default DocumentTypeApprovalFlowElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: DocumentTypeApprovalFlowElement;
  }
}
