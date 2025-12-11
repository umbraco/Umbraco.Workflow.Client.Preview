import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { WorkflowReleaseSetVersionsEditorContext } from "./release-set-versions-editor.context.js";

export const WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT =
  new UmbContextToken<WorkflowReleaseSetVersionsEditorContext>(
    "WorkflowReleaseSetVersionsEditorContext"
  );
