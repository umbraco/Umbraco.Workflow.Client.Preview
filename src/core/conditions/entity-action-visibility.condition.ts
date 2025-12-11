import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type {
  UmbConditionControllerArguments,
  UmbConditionConfigBase,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import {
  WORKFLOW_CONTEXT,
  WORKFLOW_MANAGER_CONTEXT,
  type WorkflowStateUser,
} from "@umbraco-workflow/context";

export class WorkflowDocumentWorkspaceEntityActionVisibilityCondition
  extends UmbConditionBase<UmbConditionConfigBase>
  implements UmbExtensionCondition
{
  #reviewable = false;
  #extendPermissions = false;
  #locked = false;
  #user?: WorkflowStateUser;
  #active = false;
  #hasActivePermissions = false;

  #adminOnlyActions = [
    "Umb.WorkspaceAction.Document.SaveAndPublish",
    "Umb.WorkspaceAction.Document.Unpublish",
    "Umb.EntityAction.Document.Publish",
    "Umb.EntityAction.Document.Unpublish",
  ];

  #noReviewActions = [
    "Umb.WorkspaceAction.Document.SaveAndPublish",
    "Umb.WorkspaceAction.Document.Unpublish",
    "Umb.EntityAction.Document.Publish",
    "Umb.EntityAction.Document.Unpublish",
  ];

  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<UmbConditionConfigBase>
  ) {
    super(host, args);

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, async (context) => {
      if (!context) return;

      const workflowContext = await this.getContext(WORKFLOW_CONTEXT);
      if (!workflowContext) return;

      this.#extendPermissions =
      workflowContext.getVariables()?.extendPermissions ?? false;

      this.observe(context.scaffold, (scaffold) => {
        this.#setFromScaffold(scaffold);
        this.#calculateActionState();
      });
  
      this.observe(context.state, (state) => {
        this.#user = state?.user;
        this.#active = state?.active ?? false;
        this.#hasActivePermissions = context?.getActivePermissions().length > 0;
        this.#calculateActionState();
      });
    });
  }

  #setFromScaffold(scaffold?) {
    this.#locked = scaffold?.config?.locked ?? false;
    this.#reviewable = scaffold?.review?.currentUserShouldReview ?? false;
  }

  #calculateActionState() {
    const alias = (this._host as any).manifest.alias;

    // if no workflow configured, let the CMS decide
    if (!this.#hasActivePermissions) {
      this.permitted = true;
      return;
    }

    // locked due to scheduling
    if (this.#locked) {
      this.permitted = false;
      return;
    }

    // requires review and action is a save/publish
    if (this.#reviewable && this.#noReviewActions.includes(alias)) {
      this.permitted = false;
      return;
    }

    // no edit, no button
    if (this.#user?.canEdit === false) {
      this.permitted = false;
      return;
    }

    // never show saveAndpPublish when worklow is active
    if (this.#active && alias.endsWith("SaveAndPublish")) {
      this.permitted = false;
      return;
    }

    // no buttons when action is for admin, user is not admin and not extending permissions
    // eg will only show request/detail
    if (
      this.#adminOnlyActions.includes(alias) &&
      this.#user?.isAdmin === false &&
      !this.#extendPermissions
    ) {
      this.permitted = false;
      return;
    }

    // any other unexpected scenario, WF gets out of the way
    this.permitted = true;
  }
}

export { WorkflowDocumentWorkspaceEntityActionVisibilityCondition as api };
