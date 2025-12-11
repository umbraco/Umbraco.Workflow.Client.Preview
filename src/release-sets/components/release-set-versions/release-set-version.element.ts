import {
  css,
  customElement,
  html,
  property,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { umbConfirmModal, umbOpenModal } from "@umbraco-cms/backoffice/modal";
import {
  WORKFLOW_RELEASESET_VERSION_SCHEDULE_MODAL,
  type ReleaseSetVersionSchedule,
} from "../../modal/index.js";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../workspace/release-set-workspace.context-token.js";
import { type ReleaseSetVersionResponseModel } from "@umbraco-workflow/generated";
import { TimeFormatOptions } from "@umbraco-workflow/core";
import { WorkflowAlternateVersionDetailRepository } from "@umbraco-workflow/alternate-versions";
import { WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT } from "./release-set-versions-editor.context-token.js";

const elementName = "release-set-version";

@customElement(elementName)
export class WorkflowReleaseSetVersionElement extends UmbLitElement {
  #versionEditorContext?: typeof WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT.TYPE;

  @property({ type: Object })
  version?: ReleaseSetVersionResponseModel;

  @property({ type: Boolean, reflect: true, attribute: "invalid" })
  requiresReleaseDate = false;

  @property({ type: Boolean, reflect: true, attribute: "invalid" })
  invalidReleaseDate = false;

  #minReleaseDate?: string | null;

  get unique() {
    return this.version?.unique;
  }

  get schedule(): ReleaseSetVersionSchedule {
    return {
      unique: this.version?.unique,
      releaseDate: this.version?.releaseDate,
      expireDate: this.version?.expireDate,
      expireAction: this.version?.expireAction,
    };
  }

  constructor() {
    super();

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;
      this.#minReleaseDate = context.getData()?.releaseDate;
    });

    this.consumeContext(
      WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT,
      (context) => {
        this.#versionEditorContext = context;
      }
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this.#checkInvalidReleaseDate();
  }

  #checkInvalidReleaseDate() {
    // if release set was scheduled after scheduling items, it's possible to have
    // versions scheduled earlier than the set, which won't work.
    if (
      this.version?.releaseDate &&
      this.version?.releaseDate < (this.#minReleaseDate ?? "")
    ) {
      this.invalidReleaseDate = true;
    } else {
      this.invalidReleaseDate = false;
    }
  }

  async #remove() {
    await umbConfirmModal(this, {
      headline: this.localize.term("actions_remove"),
      content: this.localize.term(
        "workflow_alternateVersions_deleteVersionDescription"
      ),
      color: "danger",
      confirmLabel: this.localize.term("actions_remove"),
    }).catch(() => {});

    this.#versionEditorContext?.removeVersion(this.version?.unique);
  }

  async #schedule() {
    if (!this.version) return;

    const value = await umbOpenModal(
      this,
      WORKFLOW_RELEASESET_VERSION_SCHEDULE_MODAL,
      {
        data: {
          version: this.version!,
          minReleaseDate: this.#minReleaseDate,
        },
      }
    ).catch(() => {});

    if (!value) return;

    this.version = {
      ...this.version,
      ...value,
    };

    this.#checkInvalidReleaseDate();
    this.#versionEditorContext?.updateVersion(this.version);
  }

  async #setStatus() {
    if (!this.version) return;

    await umbConfirmModal(this, {
      headline: this.localize.term("buttons_confirmActionConfirm"),
      content: this.localize.term(
        "workflow_releaseSets_readyToPublishDescription"
      ),
    });

    // TODO => really should add a separate endpoint just for setting status
    const detailRepository = new WorkflowAlternateVersionDetailRepository(this);
    const { data } = await detailRepository.requestByUnique(
      this.version.unique
    );
    if (!data) return;

    this.#versionEditorContext?.updateVersion({
      ...this.version,
      status: "ReadyToPublish",
    });

    await detailRepository.save({
      ...data,
      status: "ReadyToPublish",
      isStatusUpdate: true,
    });
  }

  #getDetail() {
    if (this.requiresReleaseDate && !this.version?.releaseDate) {
      return "Version requires a publish date";
    }

    if (!this.version?.releaseDate && !this.version?.expireDate) return;

    const detail: Array<string> = [];
    if (this.version?.releaseDate) {
      detail.push(
        `${this.localize.term("content_releaseDate")}: ${this.localize.date(
          this.version.releaseDate!,
          TimeFormatOptions
        )}`
      );
    }

    if (this.version?.expireDate) {
      detail.push(
        `${this.localize.term("content_unpublishDate")}: ${this.localize.date(
          this.version.expireDate!,
          TimeFormatOptions
        )}`
      );
    }

    return html`${detail.join(" | ")}${when(
      this.invalidReleaseDate && this.#minReleaseDate,
      () =>
        html`<br />Publish date must be later than
          ${this.localize.date(this.#minReleaseDate!, TimeFormatOptions)}`
    )}`;
  }

  render() {
    if (!this.version) return;

    return html`<uui-ref-node name=${this.version.name} readonly>
      <div slot="tag">
        <status-tag .value=${this.version.status}></status-tag>
        <uui-action-bar>
          <uui-button label="schedule" @click=${this.#schedule}>
            <uui-icon name="calendar"></uui-icon>
          </uui-button>
          ${when(
            this.version.status === "Draft",
            () => html` <uui-button
              label="update status"
              @click=${this.#setStatus}
            >
              <uui-icon name="icon-badge-add"></uui-icon>
            </uui-button>`
          )}
          <uui-button label="remove" @click=${this.#remove}>
            <uui-icon name="delete"></uui-icon>
          </uui-button>
        </uui-action-bar>
      </div>
      <uui-icon
        slot="icon"
        .name=${this.requiresReleaseDate || this.invalidReleaseDate
          ? "alert"
          : "document"}
      ></uui-icon>
      <div slot="detail">${this.#getDetail()}</div>
    </uui-ref-node>`;
  }

  static styles = css`
    :host([invalid]) {
      color: var(--uui-color-danger);
    }

    [slot="tag"] {
      display: flex;
      align-items: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetVersionElement;
  }
}
