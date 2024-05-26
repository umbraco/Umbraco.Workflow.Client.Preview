import type {
  ManifestTypes,
} from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_MANAGER_CONTEXT_ALIAS } from "./token/workflow-manager.context-token.js";

const contextManifests: Array<ManifestTypes> = [{
    type: "workspaceContext",
    name: "Workflow Document Workspace Context",
    alias: WORKFLOW_MANAGER_CONTEXT_ALIAS,
    api: () => import('./context/workflow-manager-context.js'),
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: "Umb.Workspace.Document",
      },
    ],
  }];

export const manifests = [...contextManifests];
