import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { StatusModel, StatusModelType } from "@umbraco-workflow/core";

export const WORKFLOW_RELEASESET_UPDATESTATUS_MODAL_ALIAS =
  "Workflow.Modal.ReleaseSet.UpdateStatus";

export interface WorkflowReleaseSetUpdateStatusModalData {
  optionType: StatusModelType;
}

export interface WorkflowReleaseSetUpdateStatusModalResult {
  status?: StatusModel;
}

export const WORKFLOW_RELEASESET_UPDATESTATUS_MODAL = new UmbModalToken<
  WorkflowReleaseSetUpdateStatusModalData,
  WorkflowReleaseSetUpdateStatusModalResult
>(WORKFLOW_RELEASESET_UPDATESTATUS_MODAL_ALIAS, {
  modal: {
    type: "dialog",
    size: "small",
  },
  value: {
    status: undefined,
  },
});
