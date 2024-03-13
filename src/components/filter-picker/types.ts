export interface WorkflowFilterConfig {
  filters: Array<Filter<any>>;
  setFromArgs(args: Record<string, any>): void;
  setFromDefaults(): void;
  disable(keys: Array<string>): void;
}

export interface Filter<T> extends FilterValue<T> {
  labelKey: string;
  ui: FilterType;
  disabled?: boolean;
  meta?: Record<string, any>;
  options?: Array<Option>;
}

export interface FilterValue<T> {
  alias: string;
  default?: T;
  value?: T;
}

export type WorkflowFilterValueSet = Record<
  string,
  { value: any; type: number }
>;

export enum FilterType {
  NULL = "null",
  BOOLEAN = "workflow-boolean-filter",
  DOCUMENT = "workflow-document-filter",
  DATERANGE = "workflow-daterange-filter",
  GROUP = "workflow-group-filter",
  STATUS = "workflow-status-filter",
  SELECT = "workflow-select-filter",
  USER = "workflow-user-filter",
  VARIANT = "workflow-variant-filter",
}
