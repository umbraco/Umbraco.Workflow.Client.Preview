import type { ApprovalThresholdModel } from "@umbraco-workflow/generated";

export interface ApprovalGroupInputConfig {
  basic?: boolean;
  multiple: boolean;
  contentType?: string;
  document?: string;
  remove?: boolean;
  edit?: boolean;
  defaultThreshold?: ApprovalThresholdModel;
  configureThreshold?: boolean;
  additionalData?: Record<string, any>;
  emptyLabel?: string;
}
