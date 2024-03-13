import {
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UMB_MEDIA_TREE_PICKER_MODAL,
  UMB_MODAL_MANAGER_CONTEXT,
  UmbModalBaseElement,
} from "@umbraco-cms/backoffice/modal";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import type { UmbDocumentDetailModel } from "node_modules/@umbraco-cms/backoffice/dist-cms/packages/documents/documents/types.js";
import type { WorkflowAction, DatePickerData } from "../../types.js";
import {
  type WorkflowState,
  WorkflowManagerContext,
} from "@umbraco-workflow/context";
import { constants } from "@umbraco-workflow/constants";
import type { WorkflowTaskModel } from "@umbraco-workflow/generated";

const elementName = "workflow-submit-modal";

@customElement(elementName)
export class WorkflowSubmitModalElement extends UmbModalBaseElement {
  #documentWorkspace?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  #documentData?: UmbDocumentDetailModel;
  #workflowManager = new WorkflowManagerContext(this);

  @state()
  state?: WorkflowState;

  @state()
  currentTask?: WorkflowTaskModel;

  @state()
  action: WorkflowAction = "publish";

  @state()
  releaseDate: DatePickerData = { min: new Date().toString(), raw: "" };

  @state()
  expireDate: DatePickerData = { min: new Date().toString(), raw: "" };

  comment?: string;
  templateKey!: string;
  attachmentId?: string;
  commentInvalid = false;

  variantSyncModel: Record<string, boolean> = {};

  async connectedCallback() {
    super.connectedCallback();

    this.#documentWorkspace = await this.getContext(
      UMB_DOCUMENT_WORKSPACE_CONTEXT
    );

    this.observe(this.#workflowManager!.state, (state) => {
      this.state = state;
    });

    this.observe(this.#workflowManager!.currentTask, (currentTask) => {
      this.currentTask = currentTask;
    });

    this.#documentData = this.#documentWorkspace.getData();
    
    this.#workflowManager.init(
      undefined,
      this.#documentData?.unique,
      this.#documentData?.documentType.unique,
    );
  }

  #close() {
    this.modalContext?.reject();
  }

  #submit() {
    if (!this.comment || !this.#documentData || !this.state) return;

    // TODO => variant permissions
    // const variants: Array<string> = this.variantSyncModel["*"]
    //   ? ["*"]
    //   : this.#documentData?.variants
    //       // .filter(
    //       //   (v) =>
    //       //     v.allowedActions?.includes("A") &&
    //       //     (!v.language || this.variantSyncModel[v.language.culture])
    //       // )
    //       .map((v) => v.culture ?? constants.invariantCulture) ?? [
    //       constants.invariantCulture,
    //     ];

    const variants =
      this.variantSyncModel["*"] || this.#documentData.variants.length === 1
        ? ["*"]
        : [
            ...new Set(
              Object.keys(this.variantSyncModel).filter(
                (v) => this.variantSyncModel[v]
              )
            ),
          ];

    this.#workflowManager?.initiate({
      nodeUnique: this.#documentData.unique,
      comment: this.comment,
      releaseDate:
        this.state?.allowScheduling && this.action === "publish"
          ? this.releaseDate.raw
          : undefined,
      expireDate: this.state?.allowScheduling ? this.expireDate.raw : undefined,
      publish: this.action === constants.actions.publish,
      variants,
      attachmentId: this.attachmentId,
    });

    this.#close();
  }

  #handleCommentChange(e: CustomEvent) {
    this.comment = e.detail.comment;
    this.commentInvalid = e.detail.invalid;
  }

  #handleRequestTypeChange(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value;
    this.action = value as WorkflowAction;
    this.releaseDate = {};
  }

  // TODO => date picker clear
  #handleDatePickerChange(e: InputEvent, action: WorkflowAction) {
    const date = (e.target as HTMLInputElement).value;
    if (action === constants.actions.publish) {
      this.expireDate = { ...this.expireDate, ...{ min: date } };
      this.releaseDate = { ...this.releaseDate, ...{ raw: date } };
    } else {
      this.expireDate = { ...this.expireDate, ...{ raw: date } };
      this.releaseDate = {
        ...this.releaseDate,
        ...{ max: date, min: new Date().toString() },
      };
    }
  }

  #handleVariantSelectionChange(e: CustomEvent) {
    this.variantSyncModel = (e.target as HTMLInputElement)
      ?.value as unknown as Record<string, boolean>;
  }

  async #filepicker() {
    const currentSelection = [this.attachmentId ?? null];

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, async (modalContext) => {
      if (!modalContext) return;

      const modalHandler = modalContext.open(
        this,
        UMB_MEDIA_TREE_PICKER_MODAL,
        {
          data: {
            multiple: false,
          },
          value: {
            selection: currentSelection,
          },
        }
      );

      const { selection } = await modalHandler!.onSubmit();
      this.attachmentId = selection[0] ?? undefined;
    });
  }

  #filepickerClear() {
    delete this.attachmentId;
  }

  #headline() {
    return `Workflow approval request - ${
      this.#documentData?.variants[0].name
    }`;
  }

  #renderPublishOptions() {
    return html` <umb-property-layout
      .label=${this.localize.term("workflow_action")}
    >
      <div slot="editor">
        <uui-radio-group
          .value=${this.action}
          name="action_radio"
          @change=${this.#handleRequestTypeChange}
        >
          <uui-radio
            value="publish"
            label=${this.localize.term("actions_publish")}
          >
          </uui-radio>
          <uui-radio
            value="unpublish"
            label=${this.localize.term("actions_unpublish")}
          >
          </uui-radio>
        </uui-radio-group>
      </div>
    </umb-property-layout>`;
  }

  #renderAllowAttachments() {
    return html`<umb-property-layout
      .label=${this.localize.term("workflow_attachment")}
      .description=${this.localize.term("workflow_optional")}
    >
      <div slot="editor">
        <div>
          ${when(
            !this.attachmentId,
            () => html` <uui-button
              @click=${this.#filepicker}
              look="primary"
              color="default"
              label="Select file"
            >
              ${this.localize.term("workflow_addFile")}
            </uui-button>`,
            () => html` <uui-button
              @click=${this.#filepicker}
              look="primary"
              color="default"
              label="Select file"
            >
              ${this.attachmentId}
            </uui-button>`
          )}
        </div>
        ${when(
          this.attachmentId,
          () => html` <uui-button
            label="Remove attachment"
            look="default"
            color="default"
            @click=${this.#filepickerClear}
          >
            <uui-icon name="wrong"></uui-icon>
          </uui-button>`
        )}
      </div>
    </umb-property-layout>`;
  }

  #renderSchedulePublish() {
    return html` <umb-property-layout
      .label=${this.localize.term("workflow_publishOn")}
      .description=${this.localize.term("workflow_optional")}
    >
      <div slot="editor">
        <umb-input-date
          type="datetime-local"
          .value=${this.releaseDate.raw}
          .min=${this.releaseDate.min}
          .max=${this.releaseDate.max}
          @change=${(e) => this.#handleDatePickerChange(e, "publish")}
        ></umb-input-date>
      </div>
    </umb-property-layout>`;
  }

  #renderScheduleUnpublish() {
    return html` <umb-property-layout
      .label=${this.localize.term("workflow_unPublishOn")}
      .description=${this.localize.term("workflow_optional")}
    >
      <div slot="editor">
        <umb-input-date
          type="datetime-local"
          .value=${this.expireDate.raw}
          .min=${this.expireDate.min}
          .max=${this.expireDate.max}
          @change=${(e) => this.#handleDatePickerChange(e, "unpublish")}
        ></umb-input-date>
      </div>
    </umb-property-layout>`;
  }

  render() {
    return html` <umb-body-layout .headline=${this.#headline()}>
      <uui-box>
        <workflow-comments
          .templateKey=${this.templateKey}
          labelKey="workflow_describeChanges"
          .mandatory=${true}
          orientation="horizontal"
          @change=${this.#handleCommentChange}
        >
        </workflow-comments>
        ${when(this.state?.requireUnpublish, () =>
          this.#renderPublishOptions()
        )}
        ${when(this.state?.allowAttachments, () =>
          this.#renderAllowAttachments()
        )}
        ${when(this.state?.allowScheduling, () =>
          this.#renderSchedulePublish()
        )}
        ${when(this.state?.allowScheduling, () =>
          this.#renderScheduleUnpublish()
        )}
        ${when(
          (this.#documentData?.variants.length ?? 0) > 1,
          () =>
            html`<workflow-variant-selector
              .variants=${this.#documentData?.variants}
              .variantTasks=${this.state?.variantTasks}
              .currentVariant=${this.currentTask?.instance?.variantCode}
              @change=${this.#handleVariantSelectionChange}
            ></workflow-variant-selector>`
        )}
        ${when(
          this.releaseDate.raw || this.expireDate.raw,
          () => html`
            <workflow-alert key="workflow_scheduleDescription">
            </workflow-alert>
          `
        )}
      </uui-box>

      <div slot="actions">
        <uui-button id="close" label="Close" @click="${this.#close}"
          >Close</uui-button
        >
        <uui-button id="submit" label="Submit" @click="${
          this.#submit
        }" color="positive" look="primary"
          ><umb-localize .key=${
            this.action === "publish"
              ? "workflow_publishButton"
              : "workflow_unpublishButton"
          }></uui-button
        >
      </div>
    </umb-body-layout>`;
  }
}

export default WorkflowSubmitModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowSubmitModalElement;
  }
}
