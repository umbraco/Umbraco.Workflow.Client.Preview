import { WORKFLOW_ALTERNATEVERSION_DETAIL_REPOSITORY_ALIAS, WORKFLOW_ALTERNATEVERSION_DETAIL_STORE_ALIAS } from './constants.js';

export const manifests: Array<UmbExtensionManifest> = [{
  type: "repository",
  alias: WORKFLOW_ALTERNATEVERSION_DETAIL_REPOSITORY_ALIAS,
  name: "Alternate Version Detail Repository",
  api: () => import('./alternate-version-detail.repository.js'),
}, {
  type: "store",
  alias: WORKFLOW_ALTERNATEVERSION_DETAIL_STORE_ALIAS,
  name: "Alternate Version Detail Store",
  api: () => import('./alternate-version-detail.store.js'),
}];
