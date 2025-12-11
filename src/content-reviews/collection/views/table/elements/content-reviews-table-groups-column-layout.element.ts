import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  nothing,
  property,
  repeat,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import type { ApprovalGroupItemResponseModel } from "@umbraco-workflow/generated";

const elementName = "content-reviews-table-group-column-layout";

@customElement(elementName)
export class ContentReviewsTableGroupColumnLayoutElement extends UmbLitElement {
  @property({ type: Array })
  value!: Array<ApprovalGroupItemResponseModel>;

  // TODO => is this always a single group?
  render() {
    if (!this.value) return nothing;

    const groupsToRender =
      this.value.length > 4 ? this.value.slice(0, 3) : this.value;

    return html` <uui-ref-list>
        ${repeat(
          groupsToRender,
          (group) => group.unique,
          (group) => html`<workflow-ref-group-permission .name=${group.name}>
            <umb-icon slot="icon" name=${group.icon!}></umb-icon>
          </workflow-ref-group-permission>`
        )}
      </uui-ref-list>
      ${when(
        this.value.length > 4,
        () =>
          html`<uui-tag look="default"
            >${this.localize.term(
              "workflow_plusMore",
              this.value.length - 3
            )}</uui-tag
          >`
      )}`;
  }

  static styles = css`
    uui-tag {
      margin-left: auto;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ContentReviewsTableGroupColumnLayoutElement;
  }
}
