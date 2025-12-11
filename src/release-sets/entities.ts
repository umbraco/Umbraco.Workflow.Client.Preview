import type { UmbPropertyValueData } from "@umbraco-cms/backoffice/property";
import type { RELEASESET_ENTITY_TYPE } from "./constants.js";
import {
  Observable,
  UmbObjectState,
} from "@umbraco-cms/backoffice/observable-api";
import { ReleaseSetDetailResponseModel } from "@umbraco-workflow/generated";
import { WorkflowReleaseSetWorkspaceContext } from "./workspace/release-set-workspace.context.js";

export type WorkflowReleaseSetEntityType = typeof RELEASESET_ENTITY_TYPE;

export interface ComponentCollectionFilter {
  skip: number;
  take: number;
}

export interface PropertyDataSetProperty extends UmbPropertyValueData {
  propertyEditorUiAlias: string;
  name: string;
  create?: boolean;
  edit?: boolean;
  config?: Array<{ alias: string; value: unknown }>;
}

export type ObservableArrayGetterFnType<T> = (
  context: WorkflowReleaseSetWorkspaceContext
) => Observable<Array<T> | undefined>;

export type ObservableArraySetterFnType<T> = (
  data: UmbObjectState<ReleaseSetDetailResponseModel | undefined>,
  arr: Array<T>
) => void;
