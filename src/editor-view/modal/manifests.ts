import type { ManifestModal } from "@umbraco-cms/backoffice/extension-registry";
import {
  WORKFLOW_DETAIL_MODAL_ALIAS,
  WORKFLOW_DETAIL_READONLY_MODAL_ALIAS,
  WORKFLOW_DIFF_MODAL_ALIAS,
  WORKFLOW_GROUP_DETAIL_MODAL_ALIAS,
  WORKFLOW_REJECT_TASK_MODAL_ALIAS,
  WORKFLOW_SUBMIT_MODAL_ALIAS,
} from "./token/index.js";

const modals: Array<ManifestModal> = [
  {
    type: "modal",
    alias: WORKFLOW_SUBMIT_MODAL_ALIAS,
    name: "Workflow Submit Workflow Modal",
    js: () =>
      import(
        "../../editor-view/modal/element/workflow-submit-modal.element.js"
      ),
  },
  {
    type: "modal",
    alias: WORKFLOW_DIFF_MODAL_ALIAS,
    name: "Workflow Diff Modal",
    js: () => import("../../editor-view/modal/element/diff-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_REJECT_TASK_MODAL_ALIAS,
    name: "Workflow Reject Task Modal",
    js: () =>
      import("../../editor-view/modal/element/reject-task-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_DETAIL_MODAL_ALIAS,
    name: "Workflow Detail Modal",
    js: () =>
      import(
        "../../editor-view/modal/element/workflow-detail-modal.element.js"
      ),
  },
  {
    type: "modal",
    alias: WORKFLOW_DETAIL_READONLY_MODAL_ALIAS,
    name: "Workflow Detail Readonly Modal",
    js: () =>
      import(
        "../../editor-view/modal/element/workflow-detail-readonly-modal.element.js"
      ),
  },
  {
    type: "modal",
    alias: WORKFLOW_GROUP_DETAIL_MODAL_ALIAS,
    name: "Workflow Group Detail Modal",
    js: () =>
      import("../../editor-view/modal/element/group-detail-modal.element.js"),
  },
];

export const manifests = [...modals];
