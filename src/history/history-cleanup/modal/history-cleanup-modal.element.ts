import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
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
  #currentUserContext?: typeof UMB_CURRENT_USER_CONTEXT.TYPE;

  @state()
  showSubmitButton = false;

  @state()
  nodeRules: WorkflowHistoryCleanupRuleSet = {};

  @state()
  docTypeRules: WorkflowHistoryCleanupRuleSet = {};

  @state()
  globalRules: WorkflowHistoryCleanupRuleSet = {};

  hasNodeRules = false;
  hasDocTypeRules = false;
  hasUneditable = false;

  async connectedCallback() {
    super.connectedCallback();

    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (instance) => {
      this.#currentUserContext = instance;
      this.#observeCurrentUser();
    });
    this.#getHistoryCleanup();
  }

  async #getHistoryCleanup() {
    const { data } = await tryExecuteAndNotify(
      this,
      HistoryCleanupService.getHistoryCleanup({
        uniqueId: this.data?.unique,
        contentTypeId: this.data?.contentTypeUnique,
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

  #observeCurrentUser() {
    if (!this.#currentUserContext) return;

    this.observe(this.#currentUserContext.currentUser, (user) => {
      // TODO => what permissions here?
      this.showSubmitButton =
        (user?.hasAccessToAllLanguages && this.data?.unique !== undefined) ??
        false;
    });
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
        rules,
        () => html` <workflow-history-cleanup-detail
          .model=${rules!}
          .editable=${this.showSubmitButton}
          @change=${this.#handleValueChange}
        ></workflow-history-cleanup-detail>`,
        () => this.localize.term("content_noItemsToShow")
      )}
    </uui-box>`;
  }

  render() {
    return html`<umb-body-layout
      headline=${this.localize.term("workflowCleanup_modalHeadline")}
    >
      <div id="main">
        ${when(
          !this.data?.unique,
          () =>
            html`
              <uui-box
                .headline=${this.localize.term(
                  "workflowCleanup_globalSettings"
                )}
              >
                <workflow-history-cleanup-detail
                  .model=${this.globalRules}
                  .hideName=${true}
                ></workflow-history-cleanup-detail>
              </uui-box>
            `
        )}
        ${this.#renderRuleSet(
          "workflowCleanup_contentRules",
          this.data?.nodeName,
          this.nodeRules
        )}
        ${this.#renderRuleSet(
          "workflowCleanup_docTypeRules",
          this.data?.contentTypeUnique,
          this.docTypeRules
        )}
        ${when(
          this.hasUneditable && this.data?.unique && this.showSubmitButton,
          () => html` <small>
            <umb-localize key="workflowCleanup_hasUneditable">
              Cleanup rules defined in application settings can not be edited
              from the backoffice.
            </umb-localize>
          </small>`
        )}
      </div>
      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
        ${when(
          this.showSubmitButton,
          () => html` <uui-button
            color="positive"
            look="primary"
            label=${this.localize.term("general_save")}
            @click=${this.#handleSubmit}
          ></uui-button>`
        )}
      </div>
    </umb-body-layout>`;
  }

  static styles = [
    css`
      umb-body-layout {
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
