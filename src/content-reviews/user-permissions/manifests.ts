import { WORKFLOW_USER_PERMISSION_CONTENTREVIEW_READ } from "./constants.js";
import { generatePermissionManifest } from "@umbraco-workflow/core";

const data = [WORKFLOW_USER_PERMISSION_CONTENTREVIEW_READ].map((verb) =>
  generatePermissionManifest({ verb, label: "Content Review" })
);

export const manifests = data;
