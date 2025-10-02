import { UMB_SUBMITTABLE_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/workspace";
import { AlternateVersionWorkspaceActionBase } from "./base.action.js";

export class WorkflowAlternateVersionSaveWorkspaceAction extends AlternateVersionWorkspaceActionBase {
  override async execute() {
    const workspaceContext = await this.getContext(
      UMB_SUBMITTABLE_WORKSPACE_CONTEXT
    );

    if (!workspaceContext) {
      throw new Error("Context not found: UMB_SUBMITTABLE_WORKSPACE_CONTEXT");
    }
    
    return await workspaceContext?.requestSubmit();
  }
}

export { WorkflowAlternateVersionSaveWorkspaceAction as api };
