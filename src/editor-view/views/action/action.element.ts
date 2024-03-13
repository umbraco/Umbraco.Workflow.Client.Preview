import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import {
  type WorkflowState,
  WORKFLOW_CONTEXT,
  WORKFLOW_MANAGER_CONTEXT,
} from "@umbraco-workflow/context";
import type { WorkflowTaskModel } from "@umbraco-workflow/generated";

const elementName = "workflow-workspace-action";

@customElement(elementName)
export class WorkflowWorkspaceActionElement extends UmbElementMixin(
  LitElement
) {
  #workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  @state()
  workflowState?: WorkflowState;

  @state()
  currentTask?: WorkflowTaskModel;

  defaultCultureName?: string;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (instance) => {
      if (!instance) return;

      this.#workflowManagerContext = instance;
      this.#observeState();
      this.#observeCurrentTask();
    });

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      if (!instance) return;
      this.observe(instance.globalVariables, (variables) => {
        this.defaultCultureName = variables?.defaultCultureName ?? "";
      });
    });
  }

  #observeCurrentTask() {
    this.observe(this.#workflowManagerContext!.currentTask, (currentTask) => {
      this.currentTask = currentTask;
    });
  }

  #observeState() {
    this.observe(this.#workflowManagerContext!.state, (state) => {
      this.workflowState = state;
    });
  }

  #renderLanguageBlock() {
    const language =
      this.currentTask?.instance?.variantCode !== "*"
        ? this.currentTask?.instance?.variantName ?? this.defaultCultureName
        : this.defaultCultureName;

    if (!language) return null;

    return html` <workflow-language-block
      .language=${language}
    ></workflow-language-block>`;
  }

  #renderStatusBlock() {
    if (!this.currentTask) return null;
    return html` <workflow-status-block
      .task=${this.currentTask}
      ?isAdmin=${this.workflowState?.isAdmin}
    ></workflow-status-block>`;
  }

  #renderSchedulingBlock() {
    if (
      !this.currentTask?.instance?.releaseDate &&
      !this.currentTask?.instance?.expireDate
    )
      return null;

    return html` <workflow-scheduling-block
      .item=${this.currentTask}
    ></workflow-scheduling-block>`;
  }

  #renderChangeDescription() {
    if (!this.currentTask) return null;

    return html`<workflow-change-description
      .item=${this.currentTask}
      .comment=${this.currentTask.instance?.comment ?? undefined}
    ></workflow-change-description>`;
  }

  render() {
    return html`<div id="workflowAction">
      <workflow-actions> </workflow-actions>

      ${this.#renderChangeDescription()}
      <workflow-task-list></workflow-task-list>

      <workflow-block-wrapper>
        ${this.#renderStatusBlock()} ${this.#renderLanguageBlock()}
        ${this.#renderSchedulingBlock()}
      </workflow-block-wrapper>
    </div> `;
  }

  static styles = [
    css`
      workflow-block-wrapper {
        display: grid;
        grid-template-columns: repeat(2, [col-start] 1fr);
        gap: var(--uui-size-space-5);
      }

      workflow-actions {
        margin-bottom: var(--uui-size-space-5);
      }

      workflow-status-block {
        grid-column: col-start 1 / span 1;
      }

      workflow-scheduling {
        grid-column: col-start 1 / span 2;
      }

      workflow-block-wrapper:not(:has(workflow-language-block))
        workflow-scheduling-block,
      workflow-language-block {
        grid-column: col-start 2 / span 1;
      }

      // has no lang or schedule
      workflow-block-wrapper:not(:has(workflow-language-block)):not(
          :has(workflow-scheduling-block)
        ) {
        workflow-status-block {
          grid-column-end: span 2;
        }
      }

      @media (max-width: 766px) {
        #workflowAction {
          display: flex;
          flex-direction: column;
        }

        workflow-change-description {
          order: 1;
        }

        workflow-actions {
          order: 2;
        }

        workflow-task-list {
          order: 3;
        }

        workflow-block-wrapper {
          order: 4;
        }
      }

      @media (min-width: 767px) {
        #workflowAction {
          display: grid;
          grid-template-columns: repeat(12, [col-start] 1fr);
          column-gap: var(--uui-size-space-5);
        }

        workflow-actions {
          grid-column: col-start 1 / span 6;
          grid-row: 1 / 500;
        }

        workflow-change-description {
          grid-column: col-start 7 / span 6;
          grid-row: 1;
        }

        workflow-task-list {
          grid-column: col-start 7 / span 6;
          grid-row: 2 / 800;
        }

        workflow-block-wrapper {
          grid-column: col-start 1 / span 6;
          grid-row: 500;
        }
      }

      @media (min-width: 1600px) {
        workflow-actions {
          grid-column: col-start 1 / span 4;
          grid-row: 1 / span 500;
        }

        workflow-change-description {
          grid-column: col-start 5 / span 4;
          grid-row: 1 / span 1;
          margin-bottom: var(--uui-size-space-5);
        }

        workflow-task-list {
          grid-column: col-start 9 / span 4;
          grid-row: 1 / span 500;
          margin-top: 0;
        }

        workflow-block-wrapper {
          grid-column: col-start 5 / span 4;
          grid-row: unset;
        }
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowWorkspaceActionElement;
  }
}
