import type { UmbDocumentEntityType  } from '@umbraco-cms/backoffice/document';
import type { UmbDocumentTypeEntityType } from '@umbraco-cms/backoffice/document-type';
import type { WorkflowApprovalGroupCollectionModel } from '../approval-group/collection/index.js';

export type ContentReviewType = UmbDocumentEntityType | UmbDocumentTypeEntityType;

export type ContentReviewConfigItem = {
  id?: number;
  variant?: string;
  groups?: Array<WorkflowApprovalGroupCollectionModel>;
  excluded?: boolean;
  period?: number;
  externalReviewers?: string;
  documentKey?: string;
  documentTypeKey?: string;
};

export type ContentReviewItem = {
  documentKey?: string;
  documentTypeKey?: string;
  type: ContentReviewType;
  configItems: Array<ContentReviewConfigItem>;
  name?: string;
  icon?: string;
};
