import type { UserGroupBaseModel } from "@umbraco-workflow/generated";

export type ContentReviewType = "document" | "documentType";

export type ContentReviewConfigItem = {
  id?: number;
  variant?: string;
  groups?: Array<UserGroupBaseModel>;
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
