import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import {
  Subscription,
  combineLatest,
} from "@umbraco-cms/backoffice/external/rxjs";
import type { WorkflowTaskModel } from "@umbraco-workflow/generated";
import {
  type WorkflowState,
  WORKFLOW_MANAGER_CONTEXT,
  WorkflowManagerContext,
} from "@umbraco-workflow/context";
import { SubView } from "@umbraco-workflow/core";

const elementName = "workflow-document-workspace-view";

@customElement(elementName)
export class WorkflowDocumentWorkspaceViewElement extends UmbElementMixin(
  LitElement
) {
  #subscription = new Subscription();
  #workflowManagerContext = new WorkflowManagerContext(this);

  @state()
  activeView?: SubView;

  @state()
  workflowState?: WorkflowState;

  @state()
  currentTask?: WorkflowTaskModel;

  @state()
  subViews: Array<{
    alias: SubView;
    value: () => string;
  }> = [
    {
      alias: SubView.CONFIG,
      value: () => this.localize.term("workflow_configuration"),
    },
    {
      alias: SubView.HISTORY,
      value: () => this.localize.term("general_history"),
    },
  ];

  constructor() {
    super();

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (instance) => {
      if (!instance) return;
      const data = instance.getData();

      this.#workflowManagerContext.init(
        undefined,
        data?.unique,
        data?.documentType.unique
      );

      this.provideContext(
        WORKFLOW_MANAGER_CONTEXT,
        this.#workflowManagerContext
      );
    });
  }

  connectedCallback() {
    super.connectedCallback();

    const observable = combineLatest({
      state: this.#workflowManagerContext.state,
      currentTask: this.#workflowManagerContext.currentTask,
    });

    this.#subscription.add(
      observable.subscribe({
        next: (value) => {
          this.workflowState = value.state;
          this.currentTask = value.currentTask;
          this.activeView = this.subViews[0].alias;
        },
      })
    );
  }

  disconnectedCallback() {
    this.#subscription.unsubscribe();
  }

  render() {
    return html`<div id="header">
        <uui-tab-group>
          ${this.subViews.map(
            (view) => html` <uui-tab
              ?active=${this.activeView === view.alias}
              @click=${() => (this.activeView = view.alias)}
              label=${view.value()}
              >${view.value()}</uui-tab
            >`
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
        ${when(
          this.activeView === SubView.CONFIG,
          () =>
            html`<workflow-workspace-config
              ?disabled=${this.currentTask !== undefined ||
              this.workflowState?.exclude}
            ></workflow-workspace-config>`
        )}
        ${when(
          this.activeView === SubView.HISTORY,
          () => html`<workflow-workspace-history></workflow-workspace-history>`
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
