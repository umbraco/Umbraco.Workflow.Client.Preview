import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { ReleaseSetVersionResponseModelReadable, VersionExpireActionModel } from "@umbraco-workflow/generated";

export const WORKFLOW_RELEASESET_VERSION_SCHEDULE_MODAL_ALIAS =
  "Workflow.Modal.ReleaseSet.VersionSchedule";

export interface ReleaseSetVersionSchedule {
  unique?: string;
  releaseDate?: string | null;
  expireDate?: string | null;
  expireAction?: VersionExpireActionModel;
}

export interface WorkflowReleaseSetVersionScheduleModalData {
  version: ReleaseSetVersionResponseModelReadable;
  minReleaseDate?: string | null;
}

export interface WorkflowReleaseSetVersionScheduleModalValue extends ReleaseSetVersionSchedule {
}

export const WORKFLOW_RELEASESET_VERSION_SCHEDULE_MODAL = new UmbModalToken<
  WorkflowReleaseSetVersionScheduleModalData,
  WorkflowReleaseSetVersionScheduleModalValue
>(WORKFLOW_RELEASESET_VERSION_SCHEDULE_MODAL_ALIAS, {
  modal: {
    type: "dialog",
    size: "small",
  },
});
