import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { type WorkflowTaskModel } from "@umbraco-workflow/generated";
import {
  type WorkflowState,
  WORKFLOW_MANAGER_CONTEXT,
} from "@umbraco-workflow/context";
import { WorkflowCommentsElement } from "./comments.element.js";
import { ValidActionDescriptor } from "../../../enums.js";
import { WorkflowActionButtonsElement } from "./action-buttons.element.js";
import { WORKFLOW_REJECT_TASK_MODAL } from "../../../modal/index.js";

const elementName = "workflow-actions";

@customElement(elementName)
export class WorkflowActionsElement extends UmbLitElement {
  #workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  @state()
  private _workflowState?: WorkflowState;

  @state()
  private _currentTask?: WorkflowTaskModel;

  @state()
  private _comment = "";

  @state()
  private _commentInvalid? = true;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;
      this.#workflowManagerContext = context;

      this.observe(context.state, (state) => {
        if (!state) return;

        this._workflowState = state;
        this.#clearComment();
      });

      this.observe(context.scaffold, (scaffold) => {
        this._currentTask = scaffold?.tasks?.invariantTask ?? undefined;
        this.#clearComment();
      });
    });
  }

  #clearComment() {
    this._comment = "";
  }

  #handleCommentChange(e: CustomEvent & { target: WorkflowCommentsElement }) {
    this._comment = e.target.value;
    this._commentInvalid =
      this._workflowState?.requireComment &&
      e.target.invalid &&
      !this._workflowState?.user?.isAdmin;
  }

  get controlLabelSuffix() {
    if (!this._workflowState || !this._workflowState.user) return "";

    if (!this._workflowState.user.isAdmin) {
      return "";
    }

    // only show isAdmin suffix if admin action would
    // override their calculated permissions
    let suffix =
      this._workflowState.user.isAdmin &&
      !this._workflowState.user.canAction &&
      !this._workflowState.user.canResubmit
        ? `(${this.localize.term("workflow_asAdmin")})`
        : "";

    if (
      this._currentTask?.status === "Rejected" &&
      this._workflowState?.user?.canResubmit
    ) {
      suffix = "";
    }

    return suffix;
  }

  #execute(action?: ValidActionDescriptor, assignTo?: string) {
    if (action === undefined) return;

    this.#workflowManagerContext?.action(action, this._comment, assignTo);
    this._comment = "";
  }

  #action(e: CustomEvent) {
    const action = (e.target as WorkflowActionButtonsElement)?.action;
    this.#execute(action);
  }

  async #reject() {
    // when rejecting, can chose any of the previous groups, but we
    // will auto select the first group if this is the first workflow task
    // state holds all the permissions, and knows which are active
    const activePermissions =
      this.#workflowManagerContext?.getActivePermissions() ?? [];

    const activeIndex = activePermissions.findIndex(
      (x) => x.groupUnique === this._currentTask?.group?.unique
    );

    if (activeIndex === 0) {
      this.#execute(ValidActionDescriptor.REJECT, "user");
      return;
    }

    const assignTo = await umbOpenModal(this, WORKFLOW_REJECT_TASK_MODAL, {
      data: {
        groups: activePermissions.slice(0, activeIndex),
        requestedBy: this._currentTask?.instance?.requestedBy,
      },
    })
      .then((result) => result.assignTo)
      .catch(() => {});

    if (!assignTo) return;

    this.#execute(ValidActionDescriptor.REJECT, assignTo);
  }

  #renderWorkflowActions() {
    return html`
      <workflow-comments
        label=${this.localize.term("workflow_addComment")}
        orientation="vertical"
        ?mandatory=${this._workflowState?.requireComment}
        @change=${this.#handleCommentChange}
        .value=${this._comment}
      >
      </workflow-comments>

      <umb-property-layout
        orientation="vertical"
        .label=${this.localize.term("workflow_action", this.controlLabelSuffix)}
      >
        <workflow-action-buttons
          slot="editor"
          ?disabled=${this._commentInvalid}
          @action=${this.#action}
          @reject=${this.#reject}
        ></workflow-action-buttons>
      </umb-property-layout>
    `;
  }

  render() {
    return html`
      <uui-box headline=${this.localize.term("workflow_action")}>
        ${when(
          this._workflowState?.user?.canActionTask ||
            this._workflowState?.user?.isAdmin,
          () => this.#renderWorkflowActions(),
          () => html`<workflow-alert
            key="workflow_userCannotAction"
          ></workflow-alert>`
        )}
      </uui-box>
    `;
  }

  static styles = [
    css`
      [slot="editor"] {
        display: flex;
        gap: var(--uui-size-space-2);
      }

      #goToNodeBtn {
        margin-left: auto;
      }

      umb-property-layout {
        padding-bottom: 0;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowActionsElement;
  }
}
