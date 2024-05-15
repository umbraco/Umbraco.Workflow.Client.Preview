import { manifests as filterPickerManifests } from "./filter-picker/manifests.js";
import { manifests as groupPickerManifests } from "./approval-group-picker/manifests.js";

export const manifests = [...filterPickerManifests, ...groupPickerManifests];
