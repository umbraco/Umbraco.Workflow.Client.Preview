import { UMB_DOCUMENT_WORKSPACE_PATH } from "@umbraco-cms/backoffice/document";
import { WorkflowPathPattern } from "./edit-variant-document-path-pattern.class.js";

export const WORKFLOW_EDIT_DOCUMENT_WORKSPACE_PATH_PATTERN =
  new WorkflowPathPattern<{ unique: string; culture?: string }>(
    "edit/:unique/:culture",
    UMB_DOCUMENT_WORKSPACE_PATH
  );
