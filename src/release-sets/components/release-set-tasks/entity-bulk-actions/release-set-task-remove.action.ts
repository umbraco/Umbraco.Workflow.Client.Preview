import { UmbEntityBulkActionBase } from "@umbraco-cms/backoffice/entity-bulk-action";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../../workspace/release-set-workspace.context-token.js";
import type { ReleaseSetTaskResponseModelReadable } from "@umbraco-workflow/generated";

export class WorkflowReleaseSetTaskRemoveEntityBulkAction extends UmbEntityBulkActionBase<ReleaseSetTaskResponseModelReadable>  {
  async execute(): Promise<void> {
    const workspaceContext = await this.getContext(
      WORKFLOW_RELEASESET_WORKSPACE_CONTEXT
    );
    if (!workspaceContext) {
      throw new Error("Could not find context: WORKFLOW_RELEASESET_WORKSPACE_CONTEXT");
    }
    
    workspaceContext.removeTasks(this.selection);
  }
}
