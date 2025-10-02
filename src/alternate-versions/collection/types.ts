import type { AlternateVersionStatusModel } from "@umbraco-workflow/generated";

export interface WorkflowAlternateVersionsCollectionFilterModel {
  unique: string;
  skip: number;
  take: number;
  variant?: string;
  segment?: string;
  filter?: string;
}

export interface WorkflowAlternateVersionCollectionModel {
  entityType: string;
  name?: string | null;
  unique: string;
  icon: string;
  updateDate?: string | null;
  active?: boolean | null;
  variant?: string | null;
  segment?: string | null;
  status?: AlternateVersionStatusModel;
  inSet?: Array<string>;
}

export interface AlternateVersionTableNameColumnData {
  name: string;
  unique: string;
  modalPath?: string | null;
};
