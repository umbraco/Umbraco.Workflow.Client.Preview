import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";
import {
  WORKFLOW_MANAGER_CONTEXT,
  type WorkflowState,
} from "@umbraco-workflow/context";

import { ValidActionDescriptor } from "@umbraco-workflow/core";

const elementName = "workflow-action-buttons";

@customElement(elementName)
export class WorkflowActionButtonsElement extends UmbElementMixin(LitElement) {
  @state()
  private _workflowState?: WorkflowState;

  @property({ type: Boolean })
  disabled = false;

  action?: ValidActionDescriptor;

  async connectedCallback() {
    super.connectedCallback();

    const managerContext = await this.getContext(WORKFLOW_MANAGER_CONTEXT);
    this._workflowState = await firstValueFrom(managerContext.state);
  }

  #goToNode() {
    //     this.navigationService.changeSection('content');
    // this.$location.path(`/content/content/edit/${this.state.nodeId}`);
    // this.eventsService.emit(constants.events.goToNode);
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
      this._workflowState?.userCanAction(),
      () => html` <uui-button
        ?disabled=${this.disabled}
        @click=${() => this.#action(ValidActionDescriptor.APPROVE)}
        look="primary"
        color="positive"
        label=${this.localize.term("workflow_approve")}
      ></uui-button>`
    )}
    ${when(
      this._workflowState?.canResubmit,
      () => html` <uui-button
        ?disabled=${this.disabled}
        look="primary"
        color="positive"
        @click=${() => this.#action(ValidActionDescriptor.RESUBMIT)}
        label=${this.localize.term("workflow_resubmit")}
      ></uui-button>`
    )}
    ${when(
      this._workflowState?.userCanAction(),
      () => html` <uui-button
        ?disabled=${this.disabled}
        @click=${this.#reject}
        look="primary"
        color="warning"
        label=${this.localize.term("workflow_reject")}
      ></uui-button>`
    )}
    ${when(
      this._workflowState?.userCanCancel(),
      () => html` <uui-button
        ?disabled=${this.disabled}
        @click=${() => this.#action(ValidActionDescriptor.CANCEL)}
        look="primary"
        color="danger"
        label=${this.localize.term("general_cancel")}
      ></uui-button>`
    )}
    ${when(
      !this._workflowState?.offline && this._workflowState?.isDashboard,
      () => html` <uui-button
        id="goToNodeBtn"
        look="primary"
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
