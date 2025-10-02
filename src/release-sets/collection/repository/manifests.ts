import { WORKFLOW_RELEASESETS_COLLECTION_REPOSITORY_ALIAS } from '../constants.js';

export const manifests: Array<UmbExtensionManifest> = [{
  type: "repository",
  alias: WORKFLOW_RELEASESETS_COLLECTION_REPOSITORY_ALIAS,
  name: "Workflow Release Sets Collection Repository",
  api: () => import('./release-sets-collection.repository.js'),
}];
