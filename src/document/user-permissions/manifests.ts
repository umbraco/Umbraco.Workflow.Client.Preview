import {
  WORKFLOW_USER_PERMISSION_DOCUMENT_INITIATE,
  WORKFLOW_USER_PERMISSION_DOCUMENT_UNLOCK,
} from "./constants.js";
import { generatePermissionManifest } from "@umbraco-workflow/core";

const documentManifests = [
  WORKFLOW_USER_PERMISSION_DOCUMENT_INITIATE,
  WORKFLOW_USER_PERMISSION_DOCUMENT_UNLOCK,
].map((verb) => generatePermissionManifest({ verb, group: "Document" }));

export const manifests = [...documentManifests];
