import { manifests as emailTemplateManifests } from "./email-templates/manifests.js";
import { manifests as docTypeFlowManifests } from "./document-type-flow/manifests.js";

export const manifests = [...emailTemplateManifests, ...docTypeFlowManifests];
