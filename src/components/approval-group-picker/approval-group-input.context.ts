import { UmbPickerInputContext } from "@umbraco-cms/backoffice/picker-input";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_GROUP_PICKER_MODAL } from './modal/group-picker-modal.token.js';
import { WORKFLOW_APPROVAL_GROUP_ITEM_REPOSITORY_ALIAS } from "@umbraco-workflow/approval-group";
import type { UserGroupBaseModel } from "@umbraco-workflow/generated";

export class WorkflowApprovalGroupPickerContext extends UmbPickerInputContext<UserGroupBaseModel> {
  constructor(host: UmbControllerHost, multiple = true) {
    super(
      host,
      WORKFLOW_APPROVAL_GROUP_ITEM_REPOSITORY_ALIAS,
      WORKFLOW_GROUP_PICKER_MODAL
    );
  }
}
