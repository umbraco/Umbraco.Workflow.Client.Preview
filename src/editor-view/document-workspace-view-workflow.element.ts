import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { choose } from "lit/directives/choose.js";
import {
  type WorkflowState,
  WORKFLOW_MANAGER_CONTEXT,
} from "@umbraco-workflow/context";
import { SubView } from "@umbraco-workflow/core";

const elementName = "workflow-document-workspace-view";

@customElement(elementName)
export class WorkflowDocumentWorkspaceViewElement extends UmbLitElement {
  #workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  @state()
  activeView?: SubView;

  @state()
  workflowState?: WorkflowState;

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

  #init: Promise<unknown>;

  constructor() {
    super();

    this.#init = Promise.all([
      this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
        this.#workflowManagerContext = context;
      }).asPromise(),
    ]);
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.#init;

    if (!this.#workflowManagerContext) return;

    this.observe(this.#workflowManagerContext.state, (state) => {
      this.workflowState = state;
      this.activeView = this.subViews[0].alias;
    });
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
                ?disabled=${this.workflowState?.active ||
                this.workflowState?.exclude}
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
