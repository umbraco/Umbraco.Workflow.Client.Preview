import {
  WORKFLOW_EXPANDER_COMMENT,
  WORKFLOW_EXPANSION_TYPE_ALIAS,
} from "@umbraco-workflow/core";
import {
  WORKFLOW_RELEASESET_TASK_EDITOR_MODAL_ALIAS,
  WORKFLOW_RELEASESET_UPDATESTATUS_MODAL_ALIAS,
  WORKFLOW_RELEASESET_VERSION_SCHEDULE_MODAL_ALIAS,
  WORKFLOW_RELEASESET_ITEM_EDITOR_MODAL_ALIAS,
  WORKFLOW_RELEASESET_SCHEDULE_MODAL_ALIAS,
  WORKFLOW_RELEASESET_SUBMIT_MODAL_ALIAS,
} from "./token/index.js";
import { RELEASESET_ENTITY_TYPE } from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_RELEASESET_TASK_EDITOR_MODAL_ALIAS,
    name: "Workflow Release Set Task Editor Modal",
    js: () => import("./element/release-set-task-editor-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_RELEASESET_UPDATESTATUS_MODAL_ALIAS,
    name: "Workflow Release Set Update Status Modal",
    js: () => import("./element/release-set-update-status-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_RELEASESET_VERSION_SCHEDULE_MODAL_ALIAS,
    name: "Workflow Release Set Schedule Item Modal",
    element: () =>
      import("./element/release-set-version-schedule-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_RELEASESET_ITEM_EDITOR_MODAL_ALIAS,
    name: "Workflow Release Set Item Editor Modal",
    js: () => import("./element/release-set-item-editor-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_RELEASESET_SCHEDULE_MODAL_ALIAS,
    name: "Workflow Release Set Schedule Modal",
    js: () => import("./element/release-set-schedule-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_RELEASESET_SUBMIT_MODAL_ALIAS,
    name: "Workflow Release Set Submit Modal",
    js: () => import("./element/release-set-submit-modal.element.js"),
  },
  {
    type: WORKFLOW_EXPANSION_TYPE_ALIAS,
    alias: "Workflow.Expansion.ReleaseSet",
    name: "Workflow Release Set Workflow Expansion",
    entityType: RELEASESET_ENTITY_TYPE,
    meta: {
      properties: [WORKFLOW_EXPANDER_COMMENT],
    },
  },
];
