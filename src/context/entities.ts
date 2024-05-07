import type { ContentReviewsNodeQueryResponseModel } from "@umbraco-workflow/generated";

export class WorkflowState {
  nodeId?: string;
  userId?: string;
  exclude?: boolean;
  isActive?: boolean;
  isChangeAuthor?: boolean;
  isDashboard?: boolean;
  hasConfig?: boolean;
  canAction?: boolean;
  canEdit?: boolean;
  isAdmin?: boolean;
  isNew?: boolean;
  canResubmit?: boolean;
  rejected?: boolean;
  offline?: boolean;
  allowScheduling?: boolean;
  requireComment?: boolean;
  requireUnpublish?: boolean;
  allowAttachments?: boolean;
  // buttons: {
  //   defaultButton: any;
  //   subButtons: Array<any>;
  // };
  variantTasks?: Array<string>;
  review?: ContentReviewsNodeQueryResponseModel;
}
