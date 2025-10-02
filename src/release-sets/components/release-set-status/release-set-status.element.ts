import {
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { UmbInputToggleElement } from "@umbraco-cms/backoffice/components";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../workspace/release-set-workspace.context-token.js";
import {
  ReleaseSetItemStatusModel,
  ReleaseSetStatusModel,
  ReleaseSetTaskStatusModel,
} from "@umbraco-workflow/generated";

const elementName = "workflow-release-set-status";

@customElement(elementName)
export class WorkflowReleaseSetStatusElement extends UmbLitElement {
  #workspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;

  @state()
  private _value = false;

  @state()
  private _disabled = false;

  @state()
  private _hasPending = false;

  @property({ reflect: true, type: Boolean })
  ready = false;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      this.#workspaceContext = context;
      this.#observeReleaseSet();
    });
  }

  async #observeReleaseSet() {
    this.observe(this.#workspaceContext?.data, (data) => {
      if (!data) return;

      this._hasPending =
        data?.tasks.some(
          (x) => x.status === ReleaseSetTaskStatusModel.ACTIVE
        ) ||
        data?.items.some((x) =>
          x.items.some((y) => y.status === ReleaseSetItemStatusModel.DRAFT)
        );
      this._disabled = data?.status === ReleaseSetStatusModel.PUBLISHED;
      this._value = data?.status !== ReleaseSetStatusModel.DRAFT;
      this.ready = this._value === true;
    });
  }

  async #onChange(event: CustomEvent & { target: UmbInputToggleElement }) {
    const value = event.target.checked;

    if (!this._hasPending) {
      this._value = value;
      this.#workspaceContext?.updateSetStatus(
        this._value
          ? ReleaseSetStatusModel.PUBLISHED
          : ReleaseSetStatusModel.DRAFT
      );
      return;
    }

    umbConfirmModal(this, {
      headline: this.localize.term(
        "workflow_releaseSets_setHasIncompleteItems"
      ),
      content: this.localize.term(
        "workflow_releaseSets_setHasIncompleteItemsDescription"
      ),
      cancelLabel: this.localize.term("general_close"),
      confirmLabel: this.localize.term("general_ok"),
    })
      .then(() => {
        this._value = true;
        this.#workspaceContext?.updateSetStatus(
          ReleaseSetStatusModel.PUBLISHED,
          true
        );
      })
      .catch(() => {
        this._value = false;
        // setting value to false doesn't update correctly, but this does?
        this.shadowRoot!.querySelector("umb-input-toggle")!.checked = false;
        this.#workspaceContext?.updateSetStatus(ReleaseSetStatusModel.DRAFT);
      });
  }

  render() {
    return html`<uui-box>
      <umb-input-toggle
        .labelOn=${this.localize.term("workflow_readytopublish")}
        .labelOff=${this.localize.term("workflow_draft")}
        ?showLabels=${true}
        ?checked=${this._value}
        ?disabled=${this._disabled}
        @change=${this.#onChange}
      ></umb-input-toggle>
    </uui-box>`;
  }

  static styles = css`
    uui-box {
      display: flex;
      line-height: 1;
      height: var(--uui-size-28);
      align-items: center;
      background-color: var(--fill);
    }

    :host {
      --fill: white;
    }

    :host([ready]) {
      --fill: var(--uui-color-positive-emphasis);
      --uui-color-selected: var(--uui-color-positive);
      --uui-color-selected-emphasis: var(--uui-color-positive);
    }
  `;
}

export default WorkflowReleaseSetStatusElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetStatusElement;
  }
}
