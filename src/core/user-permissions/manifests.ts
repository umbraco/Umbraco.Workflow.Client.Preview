import { generatePermissionManifest } from "../utils/index.js";
import {
  WORKFLOW_USER_PERMISSION_CONFIGURATION_READ,
  WORKFLOW_USER_PERMISSION_CONFIGURATION_UPDATE,
} from "./constants.js";

const configurationManifests = [
  WORKFLOW_USER_PERMISSION_CONFIGURATION_READ,
  WORKFLOW_USER_PERMISSION_CONFIGURATION_UPDATE,
].map((verb) => generatePermissionManifest({ verb, group: "Configuration" }));

export const manifests = [...configurationManifests];
