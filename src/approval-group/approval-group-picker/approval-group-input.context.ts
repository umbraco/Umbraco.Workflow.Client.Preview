import { UmbPickerInputContext } from "@umbraco-cms/backoffice/picker-input";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_APPROVAL_GROUP_ITEM_REPOSITORY_ALIAS } from "../repository/item/index.js";
import { WORKFLOW_GROUP_PICKER_MODAL } from "./modal/group-picker-modal.token.js";
import type { ApprovalGroupItemResponseModel } from "@umbraco-workflow/generated";

export class WorkflowApprovalGroupPickerContext extends UmbPickerInputContext<ApprovalGroupItemResponseModel> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      WORKFLOW_APPROVAL_GROUP_ITEM_REPOSITORY_ALIAS,
      WORKFLOW_GROUP_PICKER_MODAL
    );
  }
}
