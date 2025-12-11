import type { HistoryCleanupConfigModel } from "@umbraco-workflow/generated";

export type WorkflowHistoryCleanupRuleSet = {
    [k: string]: HistoryCleanupConfigModel;
  };