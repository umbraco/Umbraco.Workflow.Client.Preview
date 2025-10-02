import {
  html,
  customElement,
  state,
  css,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { WorkflowDetailModalData } from "../token/index.js";
import {
  WORKFLOW_MANAGER_CONTEXT,
  WorkflowManagerContext,
} from "@umbraco-workflow/context";
import type { WorkflowTaskModelReadable } from "@umbraco-workflow/generated";

const elementName = "workflow-detail-modal";

@customElement(elementName)
export class WorkflowDetailModalElement extends UmbModalBaseElement<WorkflowDetailModalData> {
  #workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  @state()
  private _currentTask?: WorkflowTaskModelReadable;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;
      
      this.observe(context.scaffold, (scaffold) => {
        if (!scaffold) return;
        this._currentTask = scaffold.tasks?.invariantTask ?? undefined;
        if (!this._currentTask) this._rejectModal();
      });
    });
  }

  async connectedCallback() {
    super.connectedCallback();

    /** when launched from the dashboard, the context will not exist as it
     * is registered as a workspace context. instead, we provide a new instance.
     * This is destroyed when the modal closes
     */
    if (this.data?.isDashboard) {
      this.#workflowManagerContext = new WorkflowManagerContext(this);
      this.provideContext(
        WORKFLOW_MANAGER_CONTEXT,
        this.#workflowManagerContext
      );

      await this.#workflowManagerContext.loadWorkflowInitializer({
        entityType: this.data.entityType,
        initializerArgs: {
          nodeKey: this.data.entityKey!,
          variant: this.data.variant,
          isDashboard: true,
          entityType: this.data.entityType,
          instanceUnique: this.data.instanceUnique,
        },
      });
    }
  }

  disconnectedCallback() {
    this.#workflowManagerContext?.destroy();
    super.disconnectedCallback();
  }

  #renderSchedulingBlock() {
    if (
      !this._currentTask?.instance?.releaseDate &&
      !this._currentTask?.instance?.expireDate
    )
      return null;

    return html` <workflow-scheduling-block
      .release-date=${this._currentTask.instance.releaseDate}
      .expire-date=${this._currentTask.instance.expireDate}
      ?complete=${!!this._currentTask.instance.completedOn}
      .status=${this._currentTask.instance.status}
      .action=${this._currentTask.instance.type}
    ></workflow-scheduling-block>`;
  }

  #renderChangeDescription() {
    if (!this._currentTask) return null;

    return html`<workflow-change-description
      .item=${this._currentTask}
      .comment=${this._currentTask.instance?.comment ?? undefined}
    ></workflow-change-description>`;
  }

  render() {
    return html`
      <umb-body-layout
        .headline=${this.localize.term(
          "workflow_pendingForNode",
          this.data?.action?.toLowerCase(),
          this.data?.document?.name
        )}
      >
        <div id="detail">
          <workflow-actions></workflow-actions>
          <div id="center">
            ${this.#renderChangeDescription()} ${this.#renderSchedulingBlock()}
          </div>
          <workflow-task-list
          ></workflow-task-list>
        </div>
        <uui-button
          slot="actions"
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
      </umb-body-layout>
    `;
  }

  static styles = [
    css`
      #detail {
        --column-count: 1;

        display: grid;
        grid-template-columns: repeat(var(--column-count), [col-start] 1fr);
        gap: var(--uui-size-layout-1);
      }

      #center {
        display: flex;
        flex-direction: column;
        gap: var(--uui-size-layout-1);
        order: 0;
      }

      workflow-actions {
        order: 1;
      }

      workflow-task-list {
        order: 2;
      }

      @media (min-width: 768px) {
        #detail {
          --column-count: 2;
        }

        workflow-actions {
          grid-column: 1 / 2;
          grid-row: 1 / 3;
          order: 0;
        }

        workflow-task-list {
          grid-column: 2 / 3;
        }
      }

      @media (min-width: 1400px) {
        #detail {
          --column-count: 3;
        }

        workflow-task-list {
          grid-column: 3;
        }
      }
    `,
  ];
}

export default WorkflowDetailModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowDetailModalElement;
  }
}
