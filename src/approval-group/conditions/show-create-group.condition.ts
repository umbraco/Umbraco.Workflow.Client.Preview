import type {
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import { WORKFLOW_APPROVALGROUPS_DETAIL_STORE_CONTEXT } from "../repository/detail/approval-groups-detail.store.js";
import type { WorkflowApprovalGroupWorkspaceShowCreateGroupConditionConfig } from "./manifests.js";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

export class WorkflowApprovalGroupWorkspaceShowCreateGroupCondition
  extends UmbConditionBase<WorkflowApprovalGroupWorkspaceShowCreateGroupConditionConfig>
  implements UmbExtensionCondition
{
  #init: Promise<unknown>;
  #workflowContext?: typeof WORKFLOW_CONTEXT.TYPE;
  #storeContext?: typeof WORKFLOW_APPROVALGROUPS_DETAIL_STORE_CONTEXT.TYPE;

  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<WorkflowApprovalGroupWorkspaceShowCreateGroupConditionConfig>
  ) {
    super(host, args);

    this.#init = Promise.all([
      this.consumeContext(
        WORKFLOW_APPROVALGROUPS_DETAIL_STORE_CONTEXT,
        (context) => {
          this.#storeContext = context;
        }
      ).asPromise(),
      this.consumeContext(WORKFLOW_CONTEXT, (context) => {
        this.#workflowContext = context;
      }).asPromise(),
    ]);
  }

  async hostConnected() {
    super.hostConnected();

    await this.#init;

    if (!this.#workflowContext || !this.#storeContext) {
      this.permitted = false;
      return;
    }

    this.observe(
      observeMultiple([
        this.#workflowContext.license,
        this.#storeContext.totalItems,
      ]),
      ([license, totalItems]) => {
        if (license?.isImpersonating || license?.isLicensed) {
          this.permitted = true;
          return;
        }

        this.permitted = totalItems <= (license?.maxGroups ?? 5);
      }
    );
  }
}
