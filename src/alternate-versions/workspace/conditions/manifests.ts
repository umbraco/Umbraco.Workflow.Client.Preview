import type { ManifestCondition } from "@umbraco-cms/backoffice/extension-api";
import {
  ALTERNATEVERSION_MAKECURRENT_VISIBILITY_CONDITION_ALIAS,
  ALTERNATEVERSION_DELETE_VISIBILITY_CONDITION_ALIAS,
  ALTERNATEVERSION_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION_ALIAS,
  ALTERNATEVERSION_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION_ALIAS,
} from "./constants.js";

export const manifests: Array<ManifestCondition> = [
  {
    type: "condition",
    name: "Alternate Version Make Current Action Visibility Condition",
    alias: ALTERNATEVERSION_MAKECURRENT_VISIBILITY_CONDITION_ALIAS,
    api: () =>
      import("./alternate-version-make-current-visibility.condition.js"),
  },
  {
    type: "condition",
    name: "Alternate Version Delete Action Visibility Condition",
    alias: ALTERNATEVERSION_DELETE_VISIBILITY_CONDITION_ALIAS,
    api: () => import("./alternate-version-delete-visibility.condition.js"),
  },
  {
    type: "condition",
    name: "Alternate Version Workflow Detail Visibility Condition",
    alias: ALTERNATEVERSION_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION_ALIAS,
    api: () => import("./alternate-version-show-workflow-detail.condition.js"),
  },
  {
    type: "condition",
    name: "Alternate Version Request Approval Visibility Condition",
    alias: ALTERNATEVERSION_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION_ALIAS,
    api: () => import("./alternate-version-show-request-approval.condition.js"),
  },
];
