import type { UmbContextBase } from "@umbraco-cms/backoffice/class-api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { ClassConstructor } from "@umbraco-cms/backoffice/extension-api";
import type { Observable } from "@umbraco-cms/backoffice/observable-api";
import type { UmbVariantId } from "@umbraco-cms/backoffice/variant";
import { UmbSubmittableWorkspaceContext } from "@umbraco-cms/backoffice/workspace";
import type {
  ContentReviewsScaffoldResponseModel,
  ScaffoldRequestModel,
} from "@umbraco-workflow/generated";
import { WorkflowRepositoryBase } from "@umbraco-workflow/repository";

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
  activeCultures?: Array<string>;
  review?: ContentReviewsScaffoldResponseModel;
  user?: WorkflowStateUser;
  unique?: string;
  entityType?: string;
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

export interface WorkflowSettingsWorkspaceContextCtorArgs<
  ModelType extends object,
  SaveModelType
> {
  workspaceAlias: string;
  entityTypeAlias: string;
  title: string;
  contextToken: UmbContextToken<UmbSubmittableWorkspaceContext>;
  repositoryCtor: ClassConstructor<
    WorkflowRepositoryBase<ModelType, SaveModelType>
  >;
}
