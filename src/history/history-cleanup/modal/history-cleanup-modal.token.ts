import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { WorkflowHistoryCleanupRuleSet } from '../types.js';

export const WORKFLOW_HISTORY_CLEANUP_MODAL_ALIAS =
  "Workflow.Modal.HistoryCleanup";

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
