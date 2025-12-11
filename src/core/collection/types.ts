import { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { WorkflowFilterConfig } from "@umbraco-workflow/components";
import { WorkflowSearchFilterModel } from "generated/types.gen";

export interface WorkflowCollectionHeaderCtorArgs {
  contextToken: UmbContextToken<UmbDefaultCollectionContext, any>;
  title?: string;
  filter?: WorkflowFilterConfig;
  onFilterChange?: (filters: Partial<WorkflowSearchFilterModel>) => void;
}

export interface BaseTableNameColumnData {
  name: string;
  unique: string;
  culture?: string;
  entityType?: string;
}
