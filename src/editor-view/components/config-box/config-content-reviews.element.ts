import {
  customElement,
  html,
  unsafeHTML,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowConfigBoxBaseElement } from "./config-box-base.element.js";

const elementName = "workflow-config-content-reviews";

@customElement(elementName)
export class WorkflowConfigContentReviewsElement extends WorkflowConfigBoxBaseElement {
  get reviewConfig() {
    return this.workflowState?.review;
  }

  #renderDescription() {
    if (!this.reviewConfig?.inheritedFrom) return null;

    return html` <p>
      ${unsafeHTML(
        this.localize.term(
          "contentReviews_currentPageInheritsReview",
          this.reviewConfig?.inheritedFrom,
          this.reviewConfig?.inheritedType
        )
      )}
    </p>`;
  }

  render() {
    return html`<uui-box
      headline=${this.localize.term("workflow_treeHeaders_contentReviews")}
    >
      ${when(
        this.reviewConfig?.groups?.length,
        () => html`
          ${this.#renderDescription()}
          <uui-ref-list>
            ${this.reviewConfig!.groups!.map(
              (permission) =>
                html`<workflow-ref-group-permission .name=${permission.name}>
                  <umb-icon slot="icon" .name=${permission.icon ?? "icon-group"}></umb-icon>
                </workflow-ref-group-permission>`
            )}
          </uui-ref-list>
        `,
        () => html` <workflow-alert light key="contentReviews_noContentReviewGroup">
        </workflow-alert>`
      )}
    </uui-box>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowConfigContentReviewsElement;
  }
}
