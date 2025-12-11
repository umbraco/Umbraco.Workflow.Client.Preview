import { WORKFLOW_USER_PERMISSION_HISTORY_READ } from "./constants.js";
import { generatePermissionManifest } from "@umbraco-workflow/core";

const data = [WORKFLOW_USER_PERMISSION_HISTORY_READ].map((verb) =>
  generatePermissionManifest({ verb, label: "History" })
);

export const manifests = data;
