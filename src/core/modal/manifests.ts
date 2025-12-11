import { WORKFLOW_DETAIL_READONLY_MODAL_ALIAS } from "./detail-readonly/index.js";
import { WORKFLOW_DETAIL_MODAL_ALIAS } from "./detail/index.js";
import { WORKFLOW_DIFF_MODAL_ALIAS } from "./diff/index.js";
import { WORKFLOW_REJECT_TASK_MODAL_ALIAS } from "./reject/index.js";
import { WORKFLOW_TEXT_MODAL_ALIAS } from "./text/index.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_TEXT_MODAL_ALIAS,
    name: "Workflow Text Modal",
    js: () => import("./text/workflow-text-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_DETAIL_MODAL_ALIAS,
    name: "Workflow Detail Modal",
    js: () => import("./detail/workflow-detail-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_REJECT_TASK_MODAL_ALIAS,
    name: "Workflow Reject Task Modal",
    js: () => import("./reject/reject-task-modal.element.js"),
  },

  {
    type: "modal",
    alias: WORKFLOW_DETAIL_READONLY_MODAL_ALIAS,
    name: "Workflow Detail Readonly Modal",
    js: () =>
      import("./detail-readonly/workflow-detail-readonly-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_DIFF_MODAL_ALIAS,
    name: "Workflow Diff Modal",
    js: () => import("./diff/diff-modal.element.js"),
  },
];
