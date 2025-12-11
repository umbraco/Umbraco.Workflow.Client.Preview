import { UMB_CONTENT_SECTION_ALIAS } from "@umbraco-cms/backoffice/content";
import { WORKFLOW_SECTION_ALIAS } from "@umbraco-workflow/core";
import { UMB_SECTION_ALIAS_CONDITION_ALIAS } from "@umbraco-cms/backoffice/section";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "dashboard",
    alias: "workflow.admin.dashboard",
    name: "Workflow Admin Dashboard",
    element: () => import("./admin/admin.dashboard.element.js"),
    meta: {
      label: "#workflow_admin",
      pathname: "admin",
    },
    conditions: [
      {
        alias: UMB_SECTION_ALIAS_CONDITION_ALIAS,
        match: WORKFLOW_SECTION_ALIAS,
      },
    ],
  },
  {
    type: "dashboard",
    alias: "workflow.editor.dashboard",
    name: "Workflow Editor Dashboard",
    weight: 1000,
    element: () => import("./editor/editor.dashboard.element.js"),
    meta: {
      label: "#workflow_workflow",
      pathname: "workflow",
    },
    conditions: [
      {
        alias: UMB_SECTION_ALIAS_CONDITION_ALIAS,
        match: UMB_CONTENT_SECTION_ALIAS,
      },
    ],
  },
];
