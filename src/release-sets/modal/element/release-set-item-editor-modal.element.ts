import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UMB_MODAL_MANAGER_CONTEXT,
  UmbModalBaseElement,
} from "@umbraco-cms/backoffice/modal";
import type { WorkflowReleaseSetItemEditorModalResult } from "../token/index.js";
import { WORKFLOW_RELEASESET_ITEM_EDITOR_CONTEXT } from "../../components/release-set-versions/release-set-versions-editor.context.js";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";

const elementName = "workflow-releaseset-item-editor-modal";

@customElement(elementName)
export class WorkflowReleaseSetItemModalElement extends UmbModalBaseElement<
  never,
  WorkflowReleaseSetItemEditorModalResult
> {
  @state()
  private _headline = "";

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_RELEASESET_ITEM_EDITOR_CONTEXT,
      async (context) => {
        this.observe(context?.current, (item) => {
          this._headline = item?.name ?? "";
          this.updateValue({ item });
        });
      }
    );
  }

  async #submitModal() {
    // if we got here from an empty date, close the detail modal
    const manager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    if (manager) {
      const modals = await firstValueFrom(manager.modals);
      const modal = modals.find(
        (x) => x.alias.toString() === "Workflow.ReleaseSet.Modal.DayDetail"
      );

      modal?.key && !modal.data.day.items.length
        ? manager.close(modal.key)
        : {};
    }

    this._submitModal();
  }

  render() {
    return html`<umb-body-layout headline=${this._headline}>
      <workflow-release-set-versions></workflow-release-set-versions>
      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          label=${this.localize.term("general_submit")}
          @click=${this.#submitModal}
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }
}

export default WorkflowReleaseSetItemModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetItemModalElement;
  }
}
