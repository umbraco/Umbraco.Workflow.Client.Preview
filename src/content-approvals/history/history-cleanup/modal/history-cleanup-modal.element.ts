import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { WorkflowHistoryCleanupRuleSet } from "../types.js";
import type {
  WorkflowHistoryCleanupModalData,
  WorkflowHistoryCleanupModalResult,
} from "./history-cleanup-modal.token.js";
import {
  type HistoryCleanupConfigModel,
  type HistoryCleanupModel,
  HistoryCleanupService,
} from "@umbraco-workflow/generated";

const elementName = "workflow-history-cleanup-modal";

@customElement(elementName)
export class WorkflowHistoryCleanupModalElement extends UmbModalBaseElement<
  WorkflowHistoryCleanupModalData,
  WorkflowHistoryCleanupModalResult
> {
  @state()
  nodeRules: WorkflowHistoryCleanupRuleSet = {};

  @state()
  docTypeRules: WorkflowHistoryCleanupRuleSet = {};

  @state()
  globalRules: WorkflowHistoryCleanupRuleSet = {};

  @state()
  hasNodeRules = false;

  @state()
  hasDocTypeRules = false;

  @state()
  hasUneditable = false;

  async connectedCallback() {
    super.connectedCallback();
    this.#getHistoryCleanup();
  }

  async #getHistoryCleanup() {
    const { data } = await tryExecute(
      this,
      HistoryCleanupService.getHistoryCleanup({
        query: {
          uniqueId: this.data?.unique,
          contentTypeId: this.data?.contentTypeUnique,
        },
      })
    );

    if (!data) return;

    this.globalRules = {
      GLOBAL: {
        enableCleanup: data.enableCleanup,
        keepHistoryForDays: data.keepHistoryForDays,
        statusesToDelete: data.statusesToDelete,
        isNodeConfig: false,
        editable: false,
        entityKey: "",
      },
    };

    this.nodeRules = this.getRules(data, true);
    this.docTypeRules = this.getRules(data, false);

    this.hasNodeRules = Object.keys(this.nodeRules).length > 0;
    this.hasDocTypeRules = Object.keys(this.docTypeRules).length > 0;
    this.hasUneditable = Object.values(data?.cleanupRules ?? {}).some(
      (x) => x.editable === false
    );
  }

  #handleSubmit() {
    this.value = { nodeRules: this.nodeRules, docTypeRules: this.docTypeRules };
    this.modalContext?.submit();
  }

  #handleValueChange(e) {
    const entity = e.detail as HistoryCleanupConfigModel;

    [this.nodeRules, this.docTypeRules].forEach((rules) => {
      let rule = rules[entity.entityKey!];
      if (rule) {
        rule = entity;
      }
    });
  }

  getRules(data?: HistoryCleanupModel, isNodeConfig?: boolean) {
    return Object.fromEntries(
      Object.entries(data?.cleanupRules ?? {}).filter(
        ([, value]) => value.isNodeConfig === isNodeConfig
      )
    );
  }

  #renderRuleSet(
    labelKey: string,
    typeName?: string,
    rules?: WorkflowHistoryCleanupRuleSet
  ) {
    return html`<uui-box .headline=${this.localize.term(labelKey)}>
      ${when(
        !this.data?.unique,
        () => html`<div slot="header">${typeName}</div>`
      )}
      ${when(
        Object.keys(rules ?? {}).length,
        () => html` <workflow-history-cleanup-detail
          .model=${rules!}
          @change=${this.#handleValueChange}
        ></workflow-history-cleanup-detail>`,
        () => this.localize.term("content_noItemsToShow")
      )}
    </uui-box>`;
  }

  render() {
    return html`<uui-dialog-layout
      headline=${this.localize.term("workflow_cleanup_modalHeadline")}
    >
      ${when(
        !this.data?.unique,
        () =>
          html`
            <uui-box
              .headline=${this.localize.term("workflow_cleanup_globalSettings")}
            >
              <workflow-history-cleanup-detail
                .model=${this.globalRules}
                .hideName=${true}
              ></workflow-history-cleanup-detail>
            </uui-box>
          `
      )}
      ${this.#renderRuleSet(
        "workflow_cleanup_contentRules",
        this.data?.nodeName,
        this.nodeRules
      )}
      ${this.#renderRuleSet(
        "workflow_cleanup_docTypeRules",
        this.data?.contentTypeUnique,
        this.docTypeRules
      )}
      ${when(
        this.hasUneditable && this.data?.unique,
        () => html` <small>
          <umb-localize key="workflow_cleanup_hasUneditable">
            Cleanup rules defined in application settings can not be edited from
            the backoffice.
          </umb-localize>
        </small>`
      )}
      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button
        ><uui-button
          color="positive"
          look="primary"
          label=${this.localize.term("buttons_save")}
          @click=${this.#handleSubmit}
        ></uui-button>
      </div>
    </uui-dialog-layout>`;
  }

  static styles = [
    css`
      uui-dialog-layout {
        max-height: 90vh;
      }

      small {
        margin-top: var(--uui-size-space-3);
      }

      uui-box + uui-box {
        margin-top: var(--uui-size-layout-1);
      }
    `,
  ];
}

export default WorkflowHistoryCleanupModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowHistoryCleanupModalElement;
  }
}
