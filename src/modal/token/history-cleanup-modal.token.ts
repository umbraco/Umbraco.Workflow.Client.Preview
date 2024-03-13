import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { WorkflowHistoryCleanupRuleSet } from "../index.js";

export const WORKFLOW_HISTORY_CLEANUP_MODAL_ALIAS =
  "Umb.Modal.Workflow.HistoryCleanup";

export interface WorkflowHistoryCleanupModalData {
  unique?: string;
  nodeName?: string;
  contentTypeUnique?: string;
}

export interface WorkflowHistoryCleanupModalResult {
  nodeRules: WorkflowHistoryCleanupRuleSet;
  docTypeRules: WorkflowHistoryCleanupRuleSet;
}

export const WORKFLOW_HISTORY_CLEANUP_MODAL = new UmbModalToken<
  WorkflowHistoryCleanupModalData,
  WorkflowHistoryCleanupModalResult
>(WORKFLOW_HISTORY_CLEANUP_MODAL_ALIAS, {
  modal: {
    type: "dialog",
    size: "large",
  },
});
