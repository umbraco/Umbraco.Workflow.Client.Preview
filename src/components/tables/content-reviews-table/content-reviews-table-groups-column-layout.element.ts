import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  nothing,
  property,
  repeat,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import type { UserGroupBaseModel } from "@umbraco-workflow/generated";

const elementName = "content-reviews-table-group-column-layout";

@customElement(elementName)
export class ContentReviewsTableGroupColumnLayoutElement extends UmbElementMixin(
  LitElement
) {
  @property({ attribute: false })
  value!: Array<UserGroupBaseModel>;

  render() {
    if (!this.value) return nothing;

    const groupsToRender =
      this.value.length > 4 ? this.value.slice(0, 3) : this.value;
    const plusMore = this.value.length > 4 ? this.value.length - 3 : 0;

    return html` <ul>
      ${repeat(
        groupsToRender,
        (group) => group.groupId,
        (group) => html` <li>${group.name}</li>`
      )}
      ${when(plusMore >= 1, () => html`<li>Plus ${plusMore} more</li>`)}
    </ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ContentReviewsTableGroupColumnLayoutElement;
  }
}
