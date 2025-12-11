import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { PropertyDataSetProperty } from "../../entities.js";
import type { ReleaseSetTaskResponseModel } from "@umbraco-workflow/generated";

export const WORKFLOW_RELEASESET_TASK_EDITOR_MODAL_ALIAS =
  "Workflow.Modal.ReleaseSet.Task.Editor";

export interface WorkflowReleaseSetTaskEditorModalData {
  task?: ReleaseSetTaskResponseModel;
  properties: Array<PropertyDataSetProperty>;
}

export interface WorkflowReleaseSetTaskEditorModalResult {
  task: Partial<ReleaseSetTaskResponseModel> ;
}

export const WORKFLOW_RELEASESET_TASK_EDITOR_MODAL = new UmbModalToken<
  WorkflowReleaseSetTaskEditorModalData,
  WorkflowReleaseSetTaskEditorModalResult
>(WORKFLOW_RELEASESET_TASK_EDITOR_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "medium",
  },
});
