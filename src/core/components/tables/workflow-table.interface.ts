import type { UmbTableItem } from "@umbraco-cms/backoffice/components";

export interface WorkflowTable {
  buildTable: () => void;
  map: (data: any) => Array<UmbTableItem>;
}
