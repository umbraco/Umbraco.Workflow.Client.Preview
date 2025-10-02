import {
  WORKFLOW_DETAIL_MODAL_ALIAS,
  WORKFLOW_DETAIL_READONLY_MODAL_ALIAS,
  WORKFLOW_DIFF_MODAL_ALIAS,
  WORKFLOW_DOCUMENT_UNLOCK_MODAL_ALIAS,
  WORKFLOW_REJECT_TASK_MODAL_ALIAS,
  WORKFLOW_SUBMIT_MODAL_ALIAS,
} from "./token/index.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_SUBMIT_MODAL_ALIAS,
    name: "Workflow Submit Workflow Modal",
    js: () => import("./element/workflow-submit-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_DIFF_MODAL_ALIAS,
    name: "Workflow Diff Modal",
    js: () => import("./element/diff-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_REJECT_TASK_MODAL_ALIAS,
    name: "Workflow Reject Task Modal",
    js: () => import("./element/reject-task-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_DETAIL_MODAL_ALIAS,
    name: "Workflow Detail Modal",
    js: () => import("./element/workflow-detail-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_DETAIL_READONLY_MODAL_ALIAS,
    name: "Workflow Detail Readonly Modal",
    js: () => import("./element/workflow-detail-readonly-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_DOCUMENT_UNLOCK_MODAL_ALIAS,
    name: "Workflow Document Unlock Modal",
    js: () => import("./element/document-unlock-modal.element.js"),
  },
];
