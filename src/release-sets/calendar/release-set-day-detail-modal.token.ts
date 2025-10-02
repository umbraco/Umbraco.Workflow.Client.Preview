import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import { WorkflowContentCalendarDayDetailModalData } from "@umbraco-workflow/calendar";

export const WORKFLOW_RELEASESET_DAY_DETAIL_MODAL_ALIAS =
  "Workflow.ReleaseSet.Modal.DayDetail";

export const WORKFLOW_RELEASESET_DAY_DETAIL_MODAL =
  new UmbModalToken<WorkflowContentCalendarDayDetailModalData>(
    WORKFLOW_RELEASESET_DAY_DETAIL_MODAL_ALIAS,
    {
      modal: {
        type: "dialog",
        size: "medium",
      },
    }
  );
