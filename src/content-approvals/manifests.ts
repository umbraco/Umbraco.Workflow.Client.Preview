import { manifests as activeWorkflowsManifests } from "./active-workflows/manifests.js";
import { manifests as approvalGroupManifests } from "./approval-group/manifests.js";
import { manifests as historyManifests } from "./history/manifests.js";
import { manifests as settingsManifests } from "./settings/manifests.js";
import { manifests as collectionManifests } from "./collection/manifests.js";
import { manifests as dashboardManifests } from "./dashboard/manifests.js";
import { UMB_DOCUMENT_ENTITY_TYPE } from "@umbraco-cms/backoffice/document";
import { WORKFLOW_INITIALIZER_TYPE_ALIAS } from "@umbraco-workflow/core";
import { UmbExtensionManifestKind } from "@umbraco-cms/backoffice/extension-registry";

export const manifests: Array<UmbExtensionManifest | UmbExtensionManifestKind> =
  [
    ...activeWorkflowsManifests,
    ...approvalGroupManifests,
    ...historyManifests,
    ...settingsManifests,
    ...collectionManifests,
    ...dashboardManifests,
    {
      type: WORKFLOW_INITIALIZER_TYPE_ALIAS,
      alias: "Workflow.Initializer.Document",
      name: "Workflow Document Workflow Initializer",
      entityType: UMB_DOCUMENT_ENTITY_TYPE,
      api: () => import("./document-workflow-initializer.controller.js"),
    },
  ];
