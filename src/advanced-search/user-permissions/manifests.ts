import { WORKFLOW_USER_PERMISSION_ADVANCEDSEARCH_READ } from "./constants.js";
import { generatePermissionManifest } from "@umbraco-workflow/core";

const data = [WORKFLOW_USER_PERMISSION_ADVANCEDSEARCH_READ].map((verb) =>
  generatePermissionManifest({
    label: "Advanced Search",
    verb,
  })
);

export const manifests = data;
