import type { ApprovalThresholdModel } from "generated/types.gen";

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
