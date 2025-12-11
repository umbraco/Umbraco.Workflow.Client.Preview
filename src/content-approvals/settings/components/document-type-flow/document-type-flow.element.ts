import {
  css,
  customElement,
  html,
  property,
  repeat,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import {
  appendToFrozenArray,
  partialUpdateFrozenArray,
} from "@umbraco-cms/backoffice/observable-api";
import { UmbDocumentTypeItemRepository } from "@umbraco-cms/backoffice/document-type";
import { WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL } from "./index.js";
import {
  type DocumentTypeConfigResponseModel,
  type DocumentTypePermissionConfigModel,
} from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT } from "../../workspace/settings-workspace.context-token.js";

export interface DocumentTypeApprovalFlowConfig {
  add?: boolean;
  group?: string;
}

const elementName = "workflow-document-type-flow";

@customElement(elementName)
export class DocumentTypeApprovalFlowElement extends UmbLitElement {
  #workspaceContext?: typeof WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT.TYPE;
  #documentTypeItemRepo = new UmbDocumentTypeItemRepository(this);

  @property({ type: Object })
  config?: DocumentTypeApprovalFlowConfig = {
    add: false,
  };

  @state()
  value: Array<
    DocumentTypeConfigResponseModel & { icon?: string; name?: string }
  > = [];

  @state()
  private _allowUpdate = false;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      this._allowUpdate = !context?.getLicense()?.isTrial;
    });

    this.consumeContext(
      WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT,
      (context) => {
        if (!context) return;

        this.#workspaceContext = context;

        this.observe(
          this.#workspaceContext.documentTypeApprovalFlows,
          async (value) => {
            if (!value) return;

            await this.#setValues(
              value.value as Array<DocumentTypeConfigResponseModel>
            );
          }
        );
      }
    );
  }

  async #setValues(value?: Array<DocumentTypeConfigResponseModel>) {
    if (!value) return;

    // if a filter is provided do not apply it here as we can't
    // (yet) do a partial save of this data. Filter is applied at render-time,
    // to ensure all data exists for saving.

    const { data } = await this.#documentTypeItemRepo.requestItems(
      value.filter((x) => x.key).map((x) => x.key!)
    );

    this.value = value.map((x) => {
      const type = data?.find((d) => d.unique === x.key);
      return {
        ...x,
        ...{ icon: type?.icon ?? "document", name: type?.name },
      };
    });
  }

  async #openOverlay(unique?: string | null) {
    if (!this._allowUpdate || !this.#workspaceContext) {
      return;
    }

    const result = await umbOpenModal(this, WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL, {
      data: {
        existing: this.value.map((x) => x.key).filter((x) => x !== unique),
        unique,
        permissions: (unique
          ? this.value.find((x) => x.key === unique)?.permissions ?? []
          : []) as Array<DocumentTypePermissionConfigModel>,
        configureThreshold:
          this.#workspaceContext.getConfigureApprovalThreshold(),
        defaultThreshold: this.#workspaceContext.getDefaultApprovalThreshold(),
      },
    }).catch(() => {});

    if (!result) return;

    let newValue = [...this.value];

    if (!unique) {
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

    await this.#setValues();
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

  /**
   * Detail is shown when a group id is provided in config, as we
   * are then viewing in a group context, and filtering value by group
   */
  #maybeRenderDetail(permissions: Array<DocumentTypePermissionConfigModel>) {
    if (!this.config?.group) return "";

    const permission = permissions.find(
      (x) => x.group.unique === this.config?.group
    );

    if (!permission) return "";

    return `${this.localize.term("workflow_stage", permission.permission + 1)}
            | ${permission.culture}`;
  }

  render() {
    return html`${when(
      this.value.length,
      () => html`
        <uui-ref-list>
          ${repeat(
            this.value.filter((v) =>
              this.config?.group
                ? v.permissions.some(
                    (x) => x.group.unique === this.config?.group
                  )
                : v
            ),
            (node) => node.key,
            (node, idx) =>
              html`<uui-ref-node
                .name=${node.name ?? ""}
                .detail=${this.#maybeRenderDetail(node.permissions)}
              >
                <umb-icon slot="icon" .name=${node.icon}></umb-icon>
                <uui-action-bar slot="actions">
                  <uui-button
                    @click=${() => this.#openOverlay(node.key)}
                    label=${this.localize.term("general_edit")}
                  ></uui-button>
                  <uui-button
                    @click=${() => this.#remove(idx)}
                    label=${this.localize.term("general_remove")}
                  ></uui-button>
                </uui-action-bar>
              </uui-ref-node>`
          )}
        </uui-ref-list>
      `
    )}
    ${when(
      this.config?.add,
      () => html`
        <uui-button
          .label=${this.localize.term("general_choose")}
          look="placeholder"
          @click=${() => this.#openOverlay()}
        ></uui-button>
      `
    )}`;
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
