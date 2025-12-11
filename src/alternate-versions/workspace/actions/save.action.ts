import { AlternateVersionWorkspaceActionBase } from "./base.action.js";

export class WorkflowAlternateVersionSaveWorkspaceAction extends AlternateVersionWorkspaceActionBase {
  override async execute() {
    return await this.workspaceContext?.requestSubmit();
  }
}

export { WorkflowAlternateVersionSaveWorkspaceAction as api };
