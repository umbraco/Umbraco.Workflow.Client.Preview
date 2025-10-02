import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../../context/alternate-version-workspace.context-token.js";
import { AlternateVersionAuditLogServerDataSource } from "../../../audit-log/alternate-version-audit-log.server.data-source.js";
import { ALTERNATEVERSION_ENTITY_TYPE as ALTERNATEVERSION_ENTITY_TYPE } from "../../../constants.js";
import { WorkflowWorkspaceViewInfoHistoryBaseElement } from "@umbraco-workflow/core";

const elementName = "workflow-alternate-version-workspace-view-info-history";

@customElement(elementName)
export class WorkflowAlternateVersionWorkspaceViewInfoHistoryElement extends WorkflowWorkspaceViewInfoHistoryBaseElement {
  constructor() {
    super(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT.toString(),
      AlternateVersionAuditLogServerDataSource,
      ALTERNATEVERSION_ENTITY_TYPE,
    );
  }
}

export default WorkflowAlternateVersionWorkspaceViewInfoHistoryElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAlternateVersionWorkspaceViewInfoHistoryElement;
  }
}
