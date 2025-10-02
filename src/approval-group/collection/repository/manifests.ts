import { WORKFLOW_APPROVALGROUP_COLLECTION_REPOSITORY_ALIAS } from '../constants.js';

export const manifests: Array<UmbExtensionManifest> = [{
  type: "repository",
  alias: WORKFLOW_APPROVALGROUP_COLLECTION_REPOSITORY_ALIAS,
  name: "Workflow Approval Group Collection Repository",
  api: () => import('./approval-group-collection.repository.js'),
}];
