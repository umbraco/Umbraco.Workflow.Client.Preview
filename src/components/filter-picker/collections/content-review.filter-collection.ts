import type { WorkflowFilterConfig } from '../types.js';
import { FilterType } from '../types.js';
import { BaseFilters } from './base.filter-collection.js';

export class ContentReviewFilters extends BaseFilters implements WorkflowFilterConfig {
  constructor(args?: object, disabled?: Array<string>) {
    super();

    this.filters = [
      {
        alias: "nodeId",
        ui: FilterType.DOCUMENT,
        labelKey: "workflow_document",
      },
      {
        alias: "groupIds",
        ui: FilterType.GROUP,
        labelKey: "contentReviews_reviewGroup",
      },
      {
        alias: "nextReview",
        labelKey: "contentReviews_nextReviewDue",
        ui: FilterType.DATERANGE,
        default: ["", ""],
      },
      {
        alias: "lastReview",
        labelKey: "contentReviews_lastReviewed",
        ui: FilterType.DATERANGE,
        default: ["", ""],
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
