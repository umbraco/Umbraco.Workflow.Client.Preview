import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { CalendarDay } from "../../entities.js";

export const WORKFLOW_CONTENT_CALENDAR_DAY_DETAIL_MODAL_ALIAS =
  "Workflow.ContentCalendar.Modal.DayDetail";

export interface WorkflowContentCalendarDayDetailModalData {
  day: CalendarDay;
  date: string;
}

export const WORKFLOW_CONTENT_CALENDAR_DAY_DETAIL_MODAL =
  new UmbModalToken<WorkflowContentCalendarDayDetailModalData>(
    WORKFLOW_CONTENT_CALENDAR_DAY_DETAIL_MODAL_ALIAS,
    {
      modal: {
        type: "dialog",
        size: "medium",
      },
    }
  );
