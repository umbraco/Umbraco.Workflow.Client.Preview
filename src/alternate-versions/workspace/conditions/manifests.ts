import type { ManifestCondition } from "@umbraco-cms/backoffice/extension-api";
import {
  ALTERNATEVERSION_DELETE_VISIBILITY_CONDITION_ALIAS,
  ALTERNATEVERSION_ACTION_VISIBILITY_CONDITION_ALIAS,
} from "./constants.js";

export const manifests: Array<ManifestCondition> = [
  {
    type: "condition",
    name: "Alternate Version Action Visibility Condition",
    alias: ALTERNATEVERSION_ACTION_VISIBILITY_CONDITION_ALIAS,
    api: () => import("./alternate-version-action-visibility.condition.js"),
  },
  {
    type: "condition",
    name: "Alternate Version Delete Action Visibility Condition",
    alias: ALTERNATEVERSION_DELETE_VISIBILITY_CONDITION_ALIAS,
    api: () => import("./alternate-version-delete-visibility.condition.js"),
  },
];
