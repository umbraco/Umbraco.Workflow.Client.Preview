/* eslint-disable @typescript-eslint/no-explicit-any */
import type { WorkflowReleaseSetEntityType } from "@umbraco-workflow/release-sets";
import type { WorkflowAlternateVersionEntityType } from "@umbraco-workflow/alternate-versions";
import type { UmbLanguageDetailModel } from "@umbraco-cms/backoffice/language";
import type {
  AlternateVersionStatusModel,
  ReleaseSetItemStatusModel,
  ReleaseSetTaskStatusModel,
  ReleaseSetStatusModel,
} from "@umbraco-workflow/generated";

export type SelectableLanguageModel = UmbLanguageDetailModel & {
  selected: boolean;
};

export type WorkflowEntityTypes =
  | WorkflowAlternateVersionEntityType
  | WorkflowReleaseSetEntityType;

export interface SettingsStatusModel {
  someDisabled: boolean;
  allDisabled: boolean;
  allHidden: boolean;
}

export interface DatePickerData {
  raw?: string;
  formatted?: string;
  min?: string;
  max?: string;
}

export type StatusModel =
  | ReleaseSetStatusModel
  | ReleaseSetItemStatusModel
  | ReleaseSetTaskStatusModel
  | AlternateVersionStatusModel;
