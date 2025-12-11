import { WORKFLOW_USER_PERMISSION_ACTIVEWORKFLOWS_READ } from "./constants.js";
import { generatePermissionManifest } from "@umbraco-workflow/core";

const data = [WORKFLOW_USER_PERMISSION_ACTIVEWORKFLOWS_READ].map((verb) =>
  generatePermissionManifest({
    verb,
    label: "Active Workflows",
  })
);

export const manifests = data;
