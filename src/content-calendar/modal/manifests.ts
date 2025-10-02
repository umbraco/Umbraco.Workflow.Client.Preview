import { WORKFLOW_CONTENT_CALENDAR_DAY_DETAIL_MODAL_ALIAS } from "./index.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_CONTENT_CALENDAR_DAY_DETAIL_MODAL_ALIAS,
    name: "Workflow Content Calendar Day Detail Modal",
    js: () =>
      import("./day-detail-modal/content-calendar-day-detail-modal.element.js"),
  },
];
