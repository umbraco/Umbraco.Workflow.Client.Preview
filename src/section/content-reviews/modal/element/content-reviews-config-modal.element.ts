import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UMB_MODAL_MANAGER_CONTEXT,
  UmbModalBaseElement,
} from "@umbraco-cms/backoffice/modal";
import type { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";
import type {
  WorkflowContentReviewsConfigModalData,
  WorkflowContentReviewsConfigModalResult,
} from "../token/index.js";
import type { ContentReviewConfigItem } from "../../types.js";
import { WORKFLOW_GROUP_PICKER_MODAL } from "@umbraco-workflow/modal";

const elementName = "workflow-content-reviews-config-modal";

@customElement(elementName)
export class WorkflowContentReviewsConfigModalElement extends UmbModalBaseElement<
  WorkflowContentReviewsConfigModalData,
  WorkflowContentReviewsConfigModalResult
> {
  @state()
  current?: ContentReviewConfigItem;

  @state()
  configItems: Array<ContentReviewConfigItem> = [];

  @state()
  headline = "";

  connectedCallback() {
    super.connectedCallback();

    this.headline =
      this.localize.term(`general_${this.data?.isAdd ? "add" : "edit"}`) +
      " " +
      this.localize.term(
        `contentReviews_${
          this.data?.model.documentKey != "0" ? "nodeReview" : "docTypeReview"
        }`
      );

    // unfreeze
    this.configItems = [...this.data!.model.configItems];
    this.current = {
      ...(this.configItems.at(0) ?? { groups: [], externalReviewers: "" }),
    };

    if (!this.current.variant) {
      this.current.variant = this.data?.languages.at(0)?.isoCode;
    }
  }

  #getExistingIndex() {
    return this.configItems.findIndex(
      (x) => x.variant === this.current?.variant
    );
  }

  #handleSubmit() {
    const idx = this.#getExistingIndex();

    if (idx > -1) {
      this.configItems[idx] = this.current!;
    } else {
      this.configItems.push(this.current!);
    }

    this.value = { configItems: this.configItems };
    this.modalContext?.submit();
  }

  #handleClose() {
    this.modalContext?.reject();
  }

  #setValue(value: unknown, propertyAlias: string) {
    this.current = { ...this.current, ...{ [propertyAlias]: value } };
  }

  #removeGroup(idx: number) {
    const groups = [...this.current!.groups!];
    groups.splice(idx, 1);
    this.#setValue(groups, "groups");
  }

  async #openGroupPicker() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext.open(this, WORKFLOW_GROUP_PICKER_MODAL, {
      data: {
        selection: [...(this.current!.groups?.map((p) => p.key ?? null) ?? [])],
      },
    });

    const { groups } = await modalHandler!.onSubmit();
    this.#setValue(groups, "groups");
  }

  #handleLanguageChange(e: UUIInputEvent) {
    const idx = this.configItems.findIndex((x) => x.variant === e.target.value);
    const existingIndex = this.#getExistingIndex();

    this.configItems[existingIndex] = this.current!;

    if (idx !== -1) {
      this.current = { ...this.configItems[idx] };
      return;
    }

    this.current = {
      variant: e.target.value as string,
      groups: [],
      excluded: false,
      externalReviewers: "",
      documentKey: this.data?.model.documentKey,
      documentTypeKey: this.data?.model.documentTypeKey,
    };

    this.configItems.push(this.current);
  }

  #renderLanguagesBox() {
    return html`<uui-box .headline=${this.localize.term("general_language")}>
      <uui-select
        ?disabled=${this.data?.languages.length === 1}
        .options=${this.data?.languages.map((l) => ({
          name: l.name!,
          value: l.isoCode!,
          selected: l.isoCode === this.current?.variant,
        })) ?? []}
        @change=${this.#handleLanguageChange}
      ></uui-select>
    </uui-box>`;
  }

  #renderGeneralBox() {
    return html`<uui-box .headline=${this.localize.term("general_general")}>
      <umb-property-layout label="Exclude from review">
        <uui-toggle
          slot="editor"
          .checked=${this.current?.excluded ?? false}
          @change=${(e) => this.#setValue(e.target.checked, "excluded")}
        ></uui-toggle>
      </umb-property-layout>
      ${when(
        !this.current?.excluded,
        () => html`<umb-property-layout label="Review period (days)">
          <uui-input
            type="number"
            slot="editor"
            label="Review period (days)"
            .value=${this.current?.period}
            @change=${(e) => this.#setValue(Number(e.target.value), "period")}
          ></uui-input>
        </umb-property-layout>`
      )}</uui-box
    >`;
  }

  #renderGroupBox() {
    return html`<uui-box
      .headline=${this.localize.term("contentReviews_reviewGroup")}
    >
      <uui-ref-list>
        ${this.current?.groups?.map(
          (group, idx) =>
            html`<workflow-ref-group-permission
              .name=${group.name!}
              ?canRemove=${true}
              @remove=${() => this.#removeGroup(idx)}
            ></workflow-ref-group-permission>`
        )}
      </uui-ref-list>
      <workflow-add-button
        @click=${this.#openGroupPicker}
        labelKey="workflow_addWorkflowGroups"
      ></workflow-add-button>
    </uui-box>`;
  }

  #renderExternalReviewersBox() {
    return html`<uui-box
      .headline=${this.localize.term("contentReviews_externalReviewers")}
      ><umb-workspace-property-layout
        .label=${this.localize.term("contentReviews_externalReviewers")}
      >
        <uui-input
          type="text"
          slot="editor"
          label=${this.localize.term("contentReviews_externalReviewers")}
          .value=${this.current?.externalReviewers}
          @change=${(e) => this.#setValue(e.target.value, "externalReviewers")}
        ></uui-input> </umb-workspace-property-layout
    ></uui-box>`;
  }

  render() {
    return html`<umb-body-layout .headline=${this.headline}>
      <div id="main">
        ${when(this.data?.languages, () => this.#renderLanguagesBox())}
        ${this.#renderGeneralBox()}
        ${when(!this.current?.excluded, () => this.#renderGroupBox())}
        ${when(!this.current?.excluded, () =>
          this.#renderExternalReviewersBox()
        )}
      </div>
      <div slot="actions">
        <uui-button
          id="close"
          label="Close"
          @click="${this.#handleClose}"
        ></uui-button>
        <uui-button
          id="submit"
          color="positive"
          look="primary"
          label="Ok"
          @click=${this.#handleSubmit}
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }

  static styles = [
    css`
      uui-box + uui-box {
        margin-top: var(--uui-size-layout-1);
      }
    `,
  ];
}

export default WorkflowContentReviewsConfigModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowContentReviewsConfigModalElement;
  }
}
