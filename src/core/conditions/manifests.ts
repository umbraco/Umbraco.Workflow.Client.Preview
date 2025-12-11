import {
  WORKFLOW_DETAIL_VISIBILITY_CONDITION_ALIAS,
  WORKFLOW_ENTITY_ACTION_VISIBILITY_CONDITION_ALIAS,
  WORKFLOW_ENTITY_IS_NEW_VISIBILITY_CONDITION,
  WORKFLOW_REQUEST_APPROVAL_VISIBILITY_CONDITION_ALIAS,
  WORKFLOW_SETTING_ENABLED_CONDITION_ALIAS,
  WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
} from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "condition",
    name: "Workflow User Permission Condition",
    alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
    api: () => import("./user-permission.condition.js"),
  },
  {
    type: "condition",
    name: "Workflow Setting Enabled Condition",
    alias: WORKFLOW_SETTING_ENABLED_CONDITION_ALIAS,
    api: () => import("./setting-enabled.condition.js"),
  },
  {
    type: "condition",
    name: "Workflow Detail Visibility Condition",
    alias: WORKFLOW_DETAIL_VISIBILITY_CONDITION_ALIAS,
    api: () => import("./workflow-detail-visibility.condition.js"),
  },
  {
    type: "condition",
    name: "Workflow Request Approval Visibility Condition",
    alias: WORKFLOW_REQUEST_APPROVAL_VISIBILITY_CONDITION_ALIAS,
    api: () => import("./workflow-request-approval-visibility.condition.js"),
  },
  {
    type: "condition",
    name: "Workflow Entity Action Visibility Condition",
    alias: WORKFLOW_ENTITY_ACTION_VISIBILITY_CONDITION_ALIAS,
    api: () => import("./entity-action-visibility.condition.js"),
  },
  {
    type: "condition",
    name: "Workflow Entity Is New Condition",
    alias: WORKFLOW_ENTITY_IS_NEW_VISIBILITY_CONDITION,
    api: () => import("./entity-is-new.condition.js"),
  },
];
