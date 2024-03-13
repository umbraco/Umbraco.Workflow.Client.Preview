import { manifests as approvalGroupManifests } from './approval-group/manifests.js';
import { manifests as approvalGroupsRootManifests } from './approval-group-root/manifests.js';

export const manifests = [...approvalGroupManifests, ...approvalGroupsRootManifests];
