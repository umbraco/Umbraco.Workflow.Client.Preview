import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { WorkflowContentCalendarContextBase } from "./content-calendar-base.context.js";

export const WORKFLOW_CONTENT_CALENDAR_CONTEXT =
  new UmbContextToken<WorkflowContentCalendarContextBase>(
    "WorkflowContentCalendarContext"
  );