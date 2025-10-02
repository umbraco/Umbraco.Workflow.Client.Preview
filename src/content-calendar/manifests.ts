import { UMB_CONTENT_SECTION_ALIAS } from "@umbraco-cms/backoffice/content";
import { manifests as modalManifests } from "./modal/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...modalManifests,
  // {
  //   type: "dashboard",
  //   alias: "Workflow.ContentCalendar.Dashboard",
  //   name: "Workflow Content Calendar Dashboard",
  //   weight: 100,
  //   element: () => import("./content-calendar-dashboard.element.js"),
  //   meta: {
  //     label: "#workflow_contentCalendar",
  //     pathname: "content-calendar",
  //   },
  //   conditions: [
  //     {
  //       alias: "Umb.Condition.SectionAlias",
  //       match: UMB_CONTENT_SECTION_ALIAS
  //     },
  //   ],
  // },
];
