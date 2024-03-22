import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { UserGroupModel } from "@umbraco-workflow/generated";

export const WORKFLOW_GROUP_DETAIL_MODAL_ALIAS =
  "Workflow.Modal.GroupDetail";

export interface WorkflowGroupDetailModalData {
  group: UserGroupModel;
  isAdmin: boolean;
}

export const WORKFLOW_GROUP_DETAIL_MODAL =
  new UmbModalToken<WorkflowGroupDetailModalData>(
    WORKFLOW_GROUP_DETAIL_MODAL_ALIAS,
    {
      modal: {
        type: "dialog",
        size: "small",
      },
    }
  );
