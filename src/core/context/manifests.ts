import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import { UMB_DOCUMENT_WORKSPACE_ALIAS } from "@umbraco-cms/backoffice/document";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS } from "@umbraco-workflow/alternate-versions";
import {
  WORKFLOW_CONTEXT_ALIAS,
  WORKFLOW_MANAGER_CONTEXT_ALIAS,
  WORKFLOW_SIGNALR_CONTEXT_ALIAS,
} from "./index.js";
import { WORKFLOW_RELEASESET_WORKSPACE_ALIAS } from "@umbraco-workflow/release-sets";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspaceContext",
    name: "Workflow Document Workspace Context",
    alias: WORKFLOW_MANAGER_CONTEXT_ALIAS,
    api: () => import("./context/workflow-manager-context.js"),
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        oneOf: [
          UMB_DOCUMENT_WORKSPACE_ALIAS,
          WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS,
          WORKFLOW_RELEASESET_WORKSPACE_ALIAS,
        ],
      },
    ],
  },
  {
    type: "globalContext",
    name: "Workflow Global Context",
    alias: WORKFLOW_CONTEXT_ALIAS,
    api: () => import("./context/workflow-context.js"),
  },
  {
    type: "globalContext",
    name: "Workflow SignalR Context",
    alias: WORKFLOW_SIGNALR_CONTEXT_ALIAS,
    api: () => import("./context/workflow-signalr.context.js"),
  },
];
