import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_RELEASESET_SCHEDULE_MODAL_ALIAS =
  "Workflow.Modal.ReleaseSet.Schedule";

export interface WorkflowReleaseSetScheduleModalData {
  releaseDate?: string | null;
}

export interface WorkflowReleaseSetScheduleModalValue {
  releaseDate?: string | null;
}

export const WORKFLOW_RELEASESET_SCHEDULE_MODAL = new UmbModalToken<
  WorkflowReleaseSetScheduleModalData,
  WorkflowReleaseSetScheduleModalValue
>(WORKFLOW_RELEASESET_SCHEDULE_MODAL_ALIAS, {
  modal: {
    type: "dialog",
  },
});
