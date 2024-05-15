import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";
import type {
  WorkflowContentReviewsConfigModalData,
  WorkflowContentReviewsConfigModalResult,
} from "../token/index.js";
import type { ContentReviewConfigItem } from "../../types.js";
import type { WorkflowApprovalGroupInputElement } from "@umbraco-workflow/components";
import { WorkflowApprovalGroupCollectionModel } from "@umbraco-workflow/approval-group";

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
      ...(this.configItems.at(0) ?? {
        groups: [],
        externalReviewers: "",
      }),
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

  #setValue(value: unknown, propertyAlias: string) {
    this.current = { ...this.current, ...{ [propertyAlias]: value } };
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

  /** requires some manual mapping to get the correct type */
  async #onApprovalGroupsUpdated(e: CustomEvent) {
    const target = e.target as WorkflowApprovalGroupInputElement;

    const groups = target.selectedPermissions.map((p) => ({
      icon: "users",
      name: p.groupName,
      unique: p.groupKey,
    }));

    this.#setValue(groups, "groups");
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
      <workflow-approval-group-input
        .config=${{
          basic: true,
          remove: true,
          multiple: false,
        }}
        .selection=${this.current?.groups?.map((x) => x.unique) ?? []}
        @updated=${this.#onApprovalGroupsUpdated}
      ></workflow-approval-group-input>
    </uui-box>`;
  }

  #renderExternalReviewersBox() {
    return html`<uui-box
      .headline=${this.localize.term("contentReviews_externalReviewers")}
      ><umb-property-layout
        .label=${this.localize.term("contentReviews_externalReviewers")}
      >
        <uui-input
          type="text"
          slot="editor"
          label=${this.localize.term("contentReviews_externalReviewers")}
          .value=${this.current?.externalReviewers}
          @change=${(e) => this.#setValue(e.target.value, "externalReviewers")}
        ></uui-input> </umb-property-layout
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
          label=${this.localize.term("general_cancel")}
          @click=${this._rejectModal}
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          label=${this.localize.term("general_submit")}
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
