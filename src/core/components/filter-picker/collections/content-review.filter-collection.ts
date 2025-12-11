import { FilterType, type WorkflowFilterConfig } from "../types.js";
import { BaseFilters } from "./base.filter-collection.js";

export class ContentReviewFilters
  extends BaseFilters
  implements WorkflowFilterConfig
{
  constructor(args?: object, disabled?: Array<string>) {
    super();

    this.filters = [
      {
        alias: "unique",
        ui: FilterType.DOCUMENT,
        labelKey: "workflow_document",
      },
      {
        alias: "groupIds",
        ui: FilterType.GROUP,
        labelKey: "workflow_contentReviews_reviewGroup",
      },
      {
        alias: "dueOn",
        labelKey: "workflow_contentReviews_nextReviewDue",
        ui: FilterType.DATERANGE,
        default: { from: null, to: null },
      },
      {
        alias: "lastReview",
        labelKey: "workflow_contentReviews_lastReviewed",
        ui: FilterType.DATERANGE,
        default: { from: null, to: null },
      },
      {
        alias: "expired",
        labelKey: "workflow_expired",
        ui: FilterType.BOOLEAN,
        default: true,
      },
    ];

    args ? this.setFromArgs(args) : {};
    this.setFromDefaults();
    disabled ? this.disable(disabled) : {};
  }
}
