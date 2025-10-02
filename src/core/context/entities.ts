import type { UmbContextBase } from "@umbraco-cms/backoffice/class-api";
import type { Observable } from "@umbraco-cms/backoffice/observable-api";
import type { UmbVariantId } from "@umbraco-cms/backoffice/variant";
import type {
  ContentReviewsScaffoldResponseModel,
  ScaffoldRequestModel,
} from "@umbraco-workflow/generated";

export interface ScaffoldArgsModel extends ScaffoldRequestModel {
  instanceUnique?: string;
  isNew?: boolean;
}

export interface WorkflowState {
  active: boolean;
  exclude?: boolean;
  isDashboard?: boolean;
  rejected?: boolean;
  allowScheduling?: boolean;
  requireComment?: boolean;
  requireUnpublish?: boolean;
  allowAttachments?: boolean;
  activeVariants?: Array<string>;
  review?: ContentReviewsScaffoldResponseModel;
  user?: WorkflowStateUser;
  unique?: string;
}

export interface WorkflowStateUser {
  canActionTask?: boolean;
  canAction?: boolean;
  canEdit?: boolean;
  canResubmit?: boolean;
  canCancel?: boolean;
  isAdmin?: boolean;
  isChangeAuthor?: boolean;
}

export interface WorkflowApprovableWorkspaceContext extends UmbContextBase {
  IS_APPROVABLE_WORKSPACE_CONTEXT: boolean;
  workspaceAlias: string;

  unique: Observable<string | undefined>;
  currentVariant: Observable<UmbVariantId | undefined>;

  destroy: () => void;
  getEntityType: () => string;
  getCurrentVariant: () => UmbVariantId | undefined;
  getUnique: () => string | undefined;
}
