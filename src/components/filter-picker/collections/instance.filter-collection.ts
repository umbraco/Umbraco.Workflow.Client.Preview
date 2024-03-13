import type { WorkflowFilterConfig } from '../types.js';
import { FilterType } from '../types.js';
import { BaseFilters } from './base.filter-collection.js';

export class InstanceFilters extends BaseFilters implements WorkflowFilterConfig {
  constructor(args?: object, disabled?: Array<string>) {
    super();

    this.filters = [
      {
        alias: "nodeId",
        ui: FilterType.DOCUMENT,
        labelKey: "workflow_document",
      },
      {
        alias: "authorUserId",
        ui: FilterType.USER,
        labelKey: "workflow_requestedBy",
      },
      {
        alias: "createdDate",
        ui: FilterType.DATERANGE,
        labelKey: "workflow_createdDate",
        default: ["", ""],
      },
      {
        alias: "completedDate",
        ui: FilterType.DATERANGE,
        labelKey: "workflow_completedDate",
        default: ["", ""],
      },
      {
        alias: "variant",
        ui: FilterType.VARIANT,
        labelKey: "general_language",
      },
      {
        alias: "type",
        ui: FilterType.SELECT,
        labelKey: "general_type",
        options: [
          { name: "Publish", value: "1" },
          { name: "Unpublish", value: "2" },
          { name: "Scheduled publish", value: "11" },
          { name: "Scheduled unpublish", value: "22" },
        ],
      },
      {
        alias: "status",
        ui: FilterType.STATUS,
        labelKey: "general_status",
        default: [],
        options: [
          { name: "Pending approval", value: "3" },
          { name: "Approved", value: "1" },
          { name: "Rejected", value: "2" },
          { name: "Resubmitted", value: "7" },
          { name: "Cancelled", value: "5" },
          { name: "Cancelled by 3rd party", value: "8" },
          { name: "Errored", value: "6" },
        ],
      },
    ];

    args ? this.setFromArgs(args) : {};
    this.setFromDefaults();
    disabled ? this.disable(disabled) : {};
  }
}
