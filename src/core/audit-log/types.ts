import type { UmbAuditLogModel } from "@umbraco-cms/backoffice/audit-log";

export type WorkflowAuditLogType =
  | "New"
  | "Save"
  | "Open"
  | "Delete"
  | "Publish"
  | "System"
  | "Unpublish";

export interface WorkflowAuditLogModel
  extends UmbAuditLogModel<WorkflowAuditLogType> {}

export interface HistoryStyleMap {
  look: "default" | "primary" | "secondary" | "outline" | "placeholder";
  color: "default" | "danger" | "warning" | "positive";
}

export interface HistoryLocalizeKeys {
  label: string;
  desc: string;
}

export interface HistoryData {
  style: HistoryStyleMap;
  text: HistoryLocalizeKeys;
}
