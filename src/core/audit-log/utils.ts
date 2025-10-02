import type { WorkflowEntityTypes } from "../entities.js";
import type { WorkflowAuditLogType, HistoryData } from "./types.js";
import { ALTERNATEVERSION_ENTITY_TYPE } from "@umbraco-workflow/alternate-versions";

export const WorkflowAuditLog = Object.freeze({
  DELETE: "Delete",
  NEW: "New",
  OPEN: "Open",
  PUBLISH: "Publish",
  SAVE: "Save",
  SYSTEM: "System",
  UNPUBLISH: "Unpublish",
});

export function getHistoryTagStyleAndText(
  type: WorkflowAuditLogType,
  entityType: WorkflowEntityTypes
): HistoryData {
  const descriptionKey =
    entityType === ALTERNATEVERSION_ENTITY_TYPE
      ? "alternateVersions"
      : "releaseSets";

  switch (type) {
    case WorkflowAuditLog.SAVE:
      return {
        style: { look: "primary", color: "default" },
        text: {
          label: "auditTrails_smallSave",
          desc: `workflow_${descriptionKey}_auditSaved`,
        },
      };

    case WorkflowAuditLog.PUBLISH:
      return {
        style: { look: "primary", color: "positive" },
        text: {
          label: "auditTrails_smallPublish",
          desc: "auditTrails_publish",
        },
      };

    case WorkflowAuditLog.UNPUBLISH:
      return {
        style: { look: "primary", color: "warning" },
        text: {
          label: "auditTrails_smallUnpublish",
          desc: "auditTrails_unpublish",
        },
      };

    case WorkflowAuditLog.DELETE:
      return {
        style: { look: "secondary", color: "danger" },
        text: { label: "auditTrails_smallDelete", desc: "auditTrails_delete" },
      };

    default:
      return {
        style: { look: "placeholder", color: "default" },
        text: { label: type, desc: "" },
      };
  }
}

export const WorkflowAuditTimeOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};
