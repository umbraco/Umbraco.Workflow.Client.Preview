/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UmbCollectionConfiguration } from "@umbraco-cms/backoffice/collection";
import type { WorkflowReleaseSetEntityType } from "@umbraco-workflow/release-sets";
import type { WorkflowAlternateVersionEntityType } from "@umbraco-workflow/alternate-versions";
import type { UmbLanguageDetailModel } from "@umbraco-cms/backoffice/language";
import type { SortDirection } from "./enums.js";
import type { WorkflowFilterConfig } from "@umbraco-workflow/components";
import type {
  WorkflowSearchFilterModel,
  AlternateVersionStatusModel,
  ReleaseSetItemStatusModel,
  ReleaseSetTaskStatusModel,
  ReleaseSetStatusModel,
} from "@umbraco-workflow/generated";

export type SelectableLanguageModel = UmbLanguageDetailModel & { selected: boolean };

export type WorkflowEntityTypes =
  | WorkflowAlternateVersionEntityType
  | WorkflowReleaseSetEntityType;

export const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export interface SettingsStatusModel {
  someDisabled: boolean;
  allDisabled: boolean;
  allHidden: boolean;
}

export interface TableQueryModel extends UmbCollectionConfiguration {
  handler: (o: object) => any;
  filters?: WorkflowSearchFilterModel;
  filterConfig?: WorkflowFilterConfig;
  pageNumber?: number;
  hiddenColumns?: Array<string>;
  direction?: SortDirection;
  meta?: Record<string, any>;
}

export interface DatePickerData {
  raw?: string;
  formatted?: string;
  min?: string;
  max?: string;
}

export interface BaseTableNameColumnData {
  name: string;
  icon?: string;
  unique: string;
  culture?: string;
  editPath?: string;
}

export type StatusModelType =
  | typeof ReleaseSetStatusModel
  | typeof AlternateVersionStatusModel
  | typeof ReleaseSetItemStatusModel
  | typeof ReleaseSetTaskStatusModel;

export type StatusModel =
  | ReleaseSetStatusModel
  | ReleaseSetItemStatusModel
  | ReleaseSetTaskStatusModel
  | AlternateVersionStatusModel;
