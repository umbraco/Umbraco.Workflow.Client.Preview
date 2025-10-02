import { WORKFLOW_RELEASESET_DAY_DETAIL_MODAL_ALIAS } from "./release-set-day-detail-modal.token.js";

export const manifests = [
  {
    type: "modal",
    alias: WORKFLOW_RELEASESET_DAY_DETAIL_MODAL_ALIAS,
    name: "Workflow Release Set Day Detail Modal",
    js: () => import("./release-set-day-detail-modal.element.js"),
  },
];
