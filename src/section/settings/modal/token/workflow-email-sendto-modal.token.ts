import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { ExtendedWorkflowEmailConfigModel } from "../../components/email-templates/email-templates.element.js";
import type { ConfigTypeModel } from "@umbraco-workflow/generated";

export const WORKFLOW_EMAIL_SENDTO_MODAL_ALIAS =
  "Workflow.Modal.Email.SendTo";

export interface WorkflowEmailSendToModalData {
  config: ConfigTypeModel[];
  emailType: ExtendedWorkflowEmailConfigModel;
}

export interface WorkflowEmailSendToModalResult {
  selectedIds: Array<number>;
}

export const WORKFLOW_EMAIL_SENDTO_MODAL = new UmbModalToken<
  WorkflowEmailSendToModalData,
  WorkflowEmailSendToModalResult
>(WORKFLOW_EMAIL_SENDTO_MODAL_ALIAS, {
  modal: {
    type: "dialog",
    size: "medium",
  },
});
