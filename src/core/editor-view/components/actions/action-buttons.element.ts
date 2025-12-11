import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import {
  WORKFLOW_MANAGER_CONTEXT,
  type WorkflowStateUser,
  type WorkflowState,
} from "@umbraco-workflow/context";
import { ValidActionDescriptor } from "../../../enums.js";

const elementName = "workflow-action-buttons";

@customElement(elementName)
export class WorkflowActionButtonsElement extends UmbLitElement {
  @state()
  private _workflowState?: WorkflowState;

  @property({ type: Boolean })
  disabled = false;

  action?: ValidActionDescriptor;

  #user?: WorkflowStateUser;
  #isAdmin = false;
  #culture?: string | null;

  async connectedCallback() {
    super.connectedCallback();

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;
      this.observe(context.state, (state) => {
        this._workflowState = state;
        this.#user = state?.user;
        this.#isAdmin = state?.user?.isAdmin ?? false;
        this.#culture = context?.getActiveCulture();
      });
    });
  }

  #goToNode() {
    window.history.pushState(
      null,
      "",
      `/umbraco/section/content/workspace/document/edit/${
        this._workflowState?.unique
      }/${this.#culture}/`
    );
  }

  #action(action: ValidActionDescriptor) {
    this.action = action;
    this.dispatchEvent(new CustomEvent("action"));
  }

  #reject() {
    this.dispatchEvent(new CustomEvent("reject"));
  }

  render() {
    return html`${when(
      (this.#user?.canAction || this.#isAdmin) &&
        !this._workflowState?.rejected,
      () => html` <uui-button
        ?disabled=${this.disabled}
        @click=${() => this.#action(ValidActionDescriptor.APPROVE)}
        look="primary"
        color="positive"
        label=${this.localize.term("workflow_approve")}
      ></uui-button>`
    )}
    ${when(
      this.#user?.canResubmit,
      () => html` <uui-button
        ?disabled=${this.disabled}
        look="primary"
        color="positive"
        @click=${() => this.#action(ValidActionDescriptor.RESUBMIT)}
        label=${this.localize.term("workflow_resubmit")}
      ></uui-button>`
    )}
    ${when(
      (this.#user?.canAction || this.#isAdmin) &&
        !this._workflowState?.rejected,
      () => html` <uui-button
        ?disabled=${this.disabled}
        @click=${this.#reject}
        look="primary"
        color="warning"
        label=${this.localize.term("workflow_reject")}
      ></uui-button>`
    )}
    ${when(
      this.#user?.canCancel || this.#isAdmin,
      () => html` <uui-button
        ?disabled=${this.disabled}
        @click=${() => this.#action(ValidActionDescriptor.CANCEL)}
        look="primary"
        color="danger"
        label=${this.localize.term("general_cancel")}
      ></uui-button>`
    )}
    ${when(
      this._workflowState?.isDashboard,
      () => html` <uui-button
        id="goToNodeBtn"
        look="secondary"
        @click=${this.#goToNode}
        label=${this.localize.term("workflow_editButton")}
      ></uui-button>`
    )}`;
  }

  static styles = css`
    #goToNodeBtn {
      margin-left: auto;
    }
  `;
}

export default WorkflowActionButtonsElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowActionButtonsElement;
  }
}
