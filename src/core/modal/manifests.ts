import type { ManifestModal } from "@umbraco-cms/backoffice/extension-registry";
import {
  WORKFLOW_FILTER_PICKER_MODAL_ALIAS,
  WORKFLOW_GROUP_PICKER_MODAL_ALIAS,
  WORKFLOW_HISTORY_CLEANUP_MODAL_ALIAS,
  WORKFLOW_ITEM_PICKER_MODAL_ALIAS,
} from "./token/index.js";

const modalManifests: Array<ManifestModal> = [
  {
    type: "modal",
    alias: WORKFLOW_FILTER_PICKER_MODAL_ALIAS,
    name: "Workflow Filter Picker Modal",
    js: () => import("./element/filter-picker-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_GROUP_PICKER_MODAL_ALIAS,
    name: "Workflow Group Picker Modal",
    js: () => import("./element/group-picker-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_HISTORY_CLEANUP_MODAL_ALIAS,
    name: "Workflow History Cleanup Modal",
    js: () => import("./element/history-cleanup-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_ITEM_PICKER_MODAL_ALIAS,
    name: "Workflow Item Picker Modal",
    js: () => import("./element/item-picker-modal.element.js"),
  },
];

export const manifests = [...modalManifests];
