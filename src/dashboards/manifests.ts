import type { ManifestDashboard } from "@umbraco-cms/backoffice/extension-registry";

const dashboards: Array<ManifestDashboard> = [
  {
    type: "dashboard",
    alias: "workflow.admin.dashboard",
    name: "Workflow Admin Dashboard",
    elementName: "workflow-admin-dashboard",
    element: () => import("./admin/admin.dashboard.element.js"),
    meta: {
      label: "Admin",
      pathname: "admin",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Workflow",
      },
    ],
  },
  {
    type: "dashboard",
    alias: "workflow.editor.dashboard",
    name: "Workflow Editor Dashboard",
    elementName: "workflow-editor-dashboard",
    weight: 1000,
    element: () => import("./editor.dashboard.element.js"),
    meta: {
      label: "Workflow",
      pathname: "workflow",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content",
      },
    ],
  },
];

export const manifests = [...dashboards];
