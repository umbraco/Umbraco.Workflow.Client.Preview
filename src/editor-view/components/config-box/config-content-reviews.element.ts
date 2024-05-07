import {
  customElement,
  html,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowConfigBoxBase } from "./config-box-base.element.js";

const elementName = "workflow-config-content-reviews";

@customElement(elementName)
export class WorkflowConfigContentReviewsElement extends WorkflowConfigBoxBase {
  get reviewConfig() {
    return this.workflowState?.review?.config;
  }

  #renderDescription() {
    if (!this.reviewConfig?.inherited) return null;

    return html` <p>
      ${this.localize.term(
        "contentReviews_currentPageInheritsReview",
        this.reviewConfig?.inheritedFrom,
        this.reviewConfig?.inheritedType
      )}
    </p>`;
  }

  render() {
    return html`<uui-box
      headline=${this.localize.term("treeHeaders_contentReviews")}
    >
      ${when(
        this.reviewConfig?.groups?.length,
        () => html`
          ${this.#renderDescription()}
          <uui-ref-list>
            ${this.reviewConfig!.groups!.map(
              (permission) =>
                html`<workflow-ref-group-permission .name=${permission.name!}>
                </workflow-ref-group-permission>`
            )}
          </uui-ref-list>
        `,
        () => html` <workflow-alert key="contentReviews_noContentReviewGroup">
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
