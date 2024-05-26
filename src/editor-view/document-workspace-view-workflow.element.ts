import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { choose } from "lit/directives/choose.js";
import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import type { WorkflowTaskModel } from "@umbraco-workflow/generated";
import {
  type WorkflowState,
  WORKFLOW_MANAGER_CONTEXT,
} from "@umbraco-workflow/context";
import { SubView } from "@umbraco-workflow/core";

const elementName = "workflow-document-workspace-view";

@customElement(elementName)
export class WorkflowDocumentWorkspaceViewElement extends UmbElementMixin(
  LitElement
) {
  #workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  @state()
  activeView?: SubView;

  @state()
  workflowState?: WorkflowState;

  @state()
  currentTask?: WorkflowTaskModel;

  @state()
  subViews: Array<{
    alias: SubView;
    label: string;
  }> = [
    {
      alias: SubView.CONFIG,
      label: "workflow_configuration",
    },
    {
      alias: SubView.HISTORY,
      label: "general_history",
    },
  ];

  #documentUnique?: string;
  #init: Promise<unknown>;

  constructor() {
    super();

    this.#init = Promise.all([
      this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
        if (!context) return;
        this.#documentUnique = context.getUnique();
      }).asPromise(),

      this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
        this.#workflowManagerContext = context;
      }).asPromise(),
    ]);
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.#init;

    if (!this.#workflowManagerContext) return;

    this.#workflowManagerContext.init(
      this.#documentUnique,
    );

    this.observe(
      observeMultiple([
        this.#workflowManagerContext.state,
        this.#workflowManagerContext.currentTask,
      ]),
      ([state, currentTask]) => {
        this.workflowState = state;
        this.currentTask = currentTask;
        this.activeView = this.subViews[0].alias;
      }
    );
  }

  render() {
    return html`<div id="header">
        <uui-tab-group>
          ${this.subViews.map(
            (view) => html` <uui-tab
              ?active=${this.activeView === view.alias}
              @click=${() => (this.activeView = view.alias)}
              label=${this.localize.term(view.label)}
            ></uui-tab>`
          )}
        </uui-tab-group>
      </div>
      <div id="body">
        ${when(
          this.workflowState?.exclude,
          () => html`
            <workflow-alert key="workflow_excludedNodeAlert"></workflow-alert>
          `
        )}
        ${choose(
          this.activeView,
          [
            [
              SubView.CONFIG,
              () => html`<workflow-workspace-config
                ?disabled=${this.currentTask || this.workflowState?.exclude}
              ></workflow-workspace-config>`,
            ],
            [
              SubView.HISTORY,
              () =>
                html`<workflow-workspace-history></workflow-workspace-history>`,
            ],
          ],
          () => null
        )}
      </div>`;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
      }

      #body {
        margin-top: var(--uui-size-layout-1);
      }

      #header {
        display: flex;
        justify-content: flex-end;
        gap: var(--uui-size-3);
      }

      [disabled] {
        position: relative;
        pointer-events: none;
        opacity: 0.4;
      }

      workflow-alert {
        margin-bottom: var(--uui-size-5);
        display: block;
      }
    `,
  ];
}

export default WorkflowDocumentWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowDocumentWorkspaceViewElement;
  }
}
