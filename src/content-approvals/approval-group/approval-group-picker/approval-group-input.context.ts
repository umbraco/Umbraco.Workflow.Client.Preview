import { UmbPickerInputContext } from "@umbraco-cms/backoffice/picker-input";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  ApprovalGroupItemModel,
  WORKFLOW_APPROVALGROUP_ITEM_REPOSITORY_ALIAS,
} from "../repository/item/index.js";
import { WORKFLOW_APPROVALGROUP_PICKER_MODAL } from "./modal/group-picker-modal.token.js";

export class WorkflowApprovalGroupPickerContext extends UmbPickerInputContext<ApprovalGroupItemModel> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      WORKFLOW_APPROVALGROUP_ITEM_REPOSITORY_ALIAS,
      WORKFLOW_APPROVALGROUP_PICKER_MODAL
    );
  }
}
