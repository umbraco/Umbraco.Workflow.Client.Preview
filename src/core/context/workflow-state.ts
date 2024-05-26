import type { ContentReviewsNodeQueryResponseModel } from "@umbraco-workflow/generated";

export class WorkflowState {
  exclude?: boolean;
  isChangeAuthor?: boolean;
  isDashboard?: boolean;
  canAction?: boolean;
  isAdmin?: boolean;
  canResubmit?: boolean;
  rejected?: boolean;
  offline?: boolean;
  allowScheduling?: boolean;
  requireComment?: boolean;
  requireUnpublish?: boolean;
  allowAttachments?: boolean;
  variantTasks?: Array<string>;
  review?: ContentReviewsNodeQueryResponseModel;

  constructor(args: {
    [key in keyof Omit<WorkflowState, "userCanActionTask" | "userCanAction" | "userCanCancel">]: any;
  }) {
    Object.assign(this, args);
  }

  userCanActionTask() {
    return (
      this.canAction || this.isAdmin || this.canResubmit || this.isChangeAuthor
    );
  }

  userCanAction() {
    return (this.canAction || this.isAdmin) && !this.rejected;
  }

  userCanCancel() {
    return this.canAction || this.isAdmin || this.isChangeAuthor;
  }
}
