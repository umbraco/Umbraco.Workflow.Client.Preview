import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../../workspace/context/alternate-version-workspace.context-token.js";
import { ALTERNATEVERSION_ENTITY_TYPE } from "../../constants.js";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";
import type { WorkflowCommentsElement } from "@umbraco-workflow/editor-view";

const elementName = "workflow-alternate-version-submit-modal";

@customElement(elementName)
export class WorkflowAlternateVersionSubmitModalElement extends UmbModalBaseElement {
  #documentWorkspace?: typeof WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT.TYPE;
  #workflowManager?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  @state()
  private _commentInvalid = false;

  #comment?: string;
  #templateKey!: string;

  async connectedCallback() {
    super.connectedCallback();

    this.consumeContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
      (context) => {
        this.#documentWorkspace = context;
      }
    );

    this.#workflowManager = await this.getContext(WORKFLOW_MANAGER_CONTEXT);
  }

  async #submit() {
    if (!this.#comment || !this.#documentWorkspace) return;

    // alt version has minimal data
    // no dates => schedule via release set
    await this.#workflowManager?.initiate({
      entityType: ALTERNATEVERSION_ENTITY_TYPE,
      nodeUnique: this.#documentWorkspace.getUnique()!,
      comment: this.#comment,
      releaseDate: undefined,
      expireDate: undefined,
      publish: true,
      variants: [
        this.#documentWorkspace.getCurrentVariant()?.toCultureString() ?? "",
      ],
    });

    this._submitModal();
  }

  #handleCommentChange(e: CustomEvent) {
    const target = e.target as WorkflowCommentsElement;
    this.#comment = target.value;
    this._commentInvalid = target.invalid;
  }

  render() {
    return html` <umb-body-layout
      .headline=${this.localize.term("workflow_approvalRequest")}
    >
      <uui-box>
        <workflow-comments
          .templateKey=${this.#templateKey}
          labelKey="workflow_describeChanges"
          .mandatory=${true}
          orientation="horizontal"
          @change=${this.#handleCommentChange}
        >
        </workflow-comments>
      </uui-box>

      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          ?disabled=${this._commentInvalid}
          label=${this.localize.term("workflow_approvalButton")}
          @click=${this.#submit}
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }
}

export default WorkflowAlternateVersionSubmitModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAlternateVersionSubmitModalElement;
  }
}
