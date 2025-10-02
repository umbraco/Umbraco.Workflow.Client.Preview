import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import { UMB_DOCUMENT_WORKSPACE_ALIAS } from "@umbraco-cms/backoffice/document";
import { WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_MARK_REVIEWED_CONDITION } from "../conditions/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.Document.MarkReviewed",
    name: "Mark Reviewed Workspace Action",
    weight: 75,
    api: () => import("./mark-reviewed.action.js"),
    meta: {
      label: "#contentReviews_markAsReviewed",
      look: "primary",
      color: "secondary",
    },
    conditions: [
      {
				alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: UMB_DOCUMENT_WORKSPACE_ALIAS,
      },
      {
        alias: WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_MARK_REVIEWED_CONDITION,
      },
    ],
  },
];
