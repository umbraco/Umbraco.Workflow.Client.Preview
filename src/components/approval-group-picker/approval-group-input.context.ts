import { UmbPickerInputContext } from "@umbraco-cms/backoffice/picker-input";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_GROUP_PICKER_MODAL } from "@umbraco-workflow/modal";
import { WORKFLOW_APPROVAL_GROUP_ITEM_REPOSITORY_ALIAS } from "@umbraco-workflow/approval-group";
import type { UserGroupBaseModel } from "@umbraco-workflow/generated";

export class WorkflowApprovalGroupPickerContext extends UmbPickerInputContext<UserGroupBaseModel> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      WORKFLOW_APPROVAL_GROUP_ITEM_REPOSITORY_ALIAS,
      WORKFLOW_GROUP_PICKER_MODAL
    );
  }
}
