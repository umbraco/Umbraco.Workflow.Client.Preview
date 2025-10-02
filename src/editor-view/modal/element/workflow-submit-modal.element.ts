import {
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UMB_MODAL_MANAGER_CONTEXT,
  UmbModalBaseElement,
} from "@umbraco-cms/backoffice/modal";
import {
  UMB_DOCUMENT_ENTITY_TYPE,
  UMB_DOCUMENT_WORKSPACE_CONTEXT,
} from "@umbraco-cms/backoffice/document";
import { UMB_MEDIA_TREE_PICKER_MODAL } from "@umbraco-cms/backoffice/media";
import {
  WORKFLOW_MANAGER_CONTEXT,
  type WorkflowState,
} from "@umbraco-workflow/context";
import type {
  VariantOptionModelType,
  WorkflowCommentsElement,
  WorkflowVariantSelectorElement,
} from "@umbraco-workflow/editor-view";
import type { DatePickerData } from "@umbraco-workflow/core";

type WorkflowAction = "publish" | "unpublish";

const elementName = "workflow-submit-modal";

@customElement(elementName)
export class WorkflowSubmitModalElement extends UmbModalBaseElement {
  #documentWorkspace?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  #workflowManager?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  @state()
  private _state?: WorkflowState;

  @state()
  private _action: WorkflowAction = "publish";

  @state()
  private _releaseDate: DatePickerData = {
    min: new Date().toString(),
    raw: "",
  };

  @state()
  private _expireDate: DatePickerData = { min: new Date().toString(), raw: "" };

  @state()
  private _commentInvalid = false;

  @state()
  private _variantSyncModel: Record<string, boolean> = {};

  #comment?: string;
  #templateKey!: string;
  #attachmentId?: string;
  #variants: Array<VariantOptionModelType> = [];

  async connectedCallback() {
    super.connectedCallback();

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;
      this.#documentWorkspace = context;

      this.observe(this.#documentWorkspace.variantOptions, (variantOptions) => {
        this.#variants = variantOptions;
        const variantStates = context.readOnlyGuard.getRules();

        this.#variants.forEach(
          (v) =>
            (v.state = variantStates.find(
              (x) => x.variantId?.culture === v.culture
            ))
        );
      });
    });

    this.#workflowManager = await this.getContext(WORKFLOW_MANAGER_CONTEXT);
    if (!this.#workflowManager) return;

    this._state = this.#workflowManager.getState();
  }

  #submit() {
    if (!this.#comment || !this.#variants || !this._state) return;

    const variants =
      this._variantSyncModel["*"] || this.#variants.length === 1
        ? ["*"]
        : [
            ...new Set(
              Object.keys(this._variantSyncModel).filter(
                (v) => this._variantSyncModel[v]
              )
            ),
          ];

    this.#workflowManager?.initiate({
      nodeUnique: this.#documentWorkspace!.getUnique()!,
      entityType: UMB_DOCUMENT_ENTITY_TYPE,
      comment: this.#comment,
      releaseDate:
        this._state?.allowScheduling && this._action === "publish"
          ? this._releaseDate.raw
          : undefined,
      expireDate: this._state?.allowScheduling
        ? this._expireDate.raw
        : undefined,
      publish: this._action === "publish",
      variants,
      attachmentId: this.#attachmentId,
    });

    this._submitModal();
  }

  #handleCommentChange(e: CustomEvent) {
    const target = e.target as WorkflowCommentsElement;
    this.#comment = target.value;
    this._commentInvalid = target.invalid;
  }

  #handleRequestTypeChange(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value;
    this._action = value as WorkflowAction;
    this._releaseDate = {};
  }

  // TODO => date picker clear
  #handleDatePickerChange(e: InputEvent, action: WorkflowAction) {
    const date = (e.target as HTMLInputElement).value;
    if (action === "publish") {
      this._expireDate = { ...this._expireDate, ...{ min: date } };
      this._releaseDate = { ...this._releaseDate, ...{ raw: date } };
    } else {
      this._expireDate = { ...this._expireDate, ...{ raw: date } };
      this._releaseDate = {
        ...this._releaseDate,
        ...{ max: date, min: new Date().toString() },
      };
    }
  }

  #handleVariantSelectionChange(e: CustomEvent) {
    this._variantSyncModel = (
      e.target as WorkflowVariantSelectorElement
    )?.value;
  }

  async #filepicker() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    if (!modalContext) return;

    const modalHandler = modalContext.open(this, UMB_MEDIA_TREE_PICKER_MODAL, {
      data: {
        multiple: false,
      },
      value: {
        selection: [this.#attachmentId ?? null],
      },
    });

    await modalHandler!.onSubmit().catch(() => undefined);
    this.#attachmentId = modalHandler.getValue().selection[0] ?? undefined;
  }

  #filepickerClear() {
    this.#attachmentId = undefined;
  }

  #invalid() {
    const invalid =
      this._commentInvalid ||
      (this.#variants.length > 1 &&
        !Object.entries(this._variantSyncModel).some((x) => x[1]));

    return invalid;
  }

  #renderPublishOptions() {
    if (!this._state?.requireUnpublish) return;

    return html` <umb-property-layout
      .label=${this.localize.term("workflow_action")}
    >
      <div slot="editor">
        <uui-radio-group
          .value=${this._action}
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
    if (!this._state?.allowAttachments) return;

    return html`<umb-property-layout
      .label=${this.localize.term("workflow_attachment")}
      .description=${this.localize.term("workflow_optional")}
    >
      <div slot="editor">
        <div>
          ${when(
            !this.#attachmentId,
            () => html` <uui-button
              @click=${this.#filepicker}
              look="primary"
              color="default"
              label=${this.localize.term("workflow_addFile")}
            ></uui-button>`,
            () => html` <uui-button
              @click=${this.#filepicker}
              look="primary"
              color="default"
              label=${this.#attachmentId!}
            ></uui-button>`
          )}
        </div>
        ${when(
          this.#attachmentId,
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
    if (!this._state?.allowScheduling) return;

    return html` <umb-property-layout
      .label=${this.localize.term("workflow_publishOn")}
      .description=${this.localize.term("workflow_optional")}
    >
      <umb-input-date
        slot="editor"
        type="datetime-local"
        .value=${this._releaseDate.raw ?? ""}
        .min=${this._releaseDate.min}
        .max=${this._releaseDate.max}
        @change=${(e) => this.#handleDatePickerChange(e, "publish")}
      ></umb-input-date>
    </umb-property-layout>`;
  }

  #renderScheduleUnpublish() {
    if (!this._state?.allowScheduling) return;

    return html` <umb-property-layout
      .label=${this.localize.term("workflow_unPublishOn")}
      .description=${this.localize.term("workflow_optional")}
    >
      <umb-input-date
        slot="editor"
        type="datetime-local"
        .value=${this._expireDate.raw ?? ""}
        .min=${this._expireDate.min}
        .max=${this._expireDate.max}
        @change=${(e) => this.#handleDatePickerChange(e, "unpublish")}
      ></umb-input-date>
    </umb-property-layout>`;
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
        ${this.#renderPublishOptions()} ${this.#renderAllowAttachments()}
        ${this.#renderSchedulePublish()} ${this.#renderScheduleUnpublish()}
        ${when(
          this.#variants.length > 1,
          () =>
            html`<workflow-variant-selector
              .variants=${this.#variants}
              .variantTasks=${this._state?.activeVariants}
              @change=${this.#handleVariantSelectionChange}
            ></workflow-variant-selector>`
        )}
        ${when(
          this._releaseDate.raw || this._expireDate.raw,
          () => html`
            <workflow-alert key="workflow_scheduleDescription">
            </workflow-alert>
          `
        )}
      </uui-box>

      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          ?disabled=${this.#invalid()}
          label=${this.localize.term(
            this._action === "publish"
              ? "workflow_publishButton"
              : "workflow_unpublishButton"
          )}
          @click=${this.#submit}
        ></uui-button>
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
