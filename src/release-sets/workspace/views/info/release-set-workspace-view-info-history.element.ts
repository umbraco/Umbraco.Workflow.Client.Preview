import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../release-set-workspace.context-token.js";
import { ReleaseSetAuditLogServerDataSource } from "../../../audit-log/release-set-audit-log.server.data-source.js";
import { RELEASESET_ENTITY_TYPE } from "../../../constants.js";
import { WorkflowWorkspaceViewInfoHistoryBaseElement } from "@umbraco-workflow/core";

const elementName = "workflow-releaseset-workspace-view-info-history";

@customElement(elementName)
export class WorkflowReleaseSetWorkspaceViewInfoHistoryElement extends WorkflowWorkspaceViewInfoHistoryBaseElement {
  constructor() {
    super(
      WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.toString(),
      ReleaseSetAuditLogServerDataSource,
      RELEASESET_ENTITY_TYPE,
    );
  }
}

export default WorkflowReleaseSetWorkspaceViewInfoHistoryElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetWorkspaceViewInfoHistoryElement;
  }
}
