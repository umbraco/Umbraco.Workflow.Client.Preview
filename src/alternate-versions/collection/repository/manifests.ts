import { WORKFLOW_ALTERNATEVERSIONS_COLLECTION_REPOSITORY_ALIAS } from './constants.js';

export const manifests: Array<UmbExtensionManifest> = [{
  type: "repository",
  alias: WORKFLOW_ALTERNATEVERSIONS_COLLECTION_REPOSITORY_ALIAS,
  name: "Workflow Alternate Versions Collection Repository",
  api: () => import('./alternate-versions-collection.repository.js'),
}];
