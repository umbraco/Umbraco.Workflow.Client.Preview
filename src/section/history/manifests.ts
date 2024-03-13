// import { manifests as repositoryManifests } from './repository/manifests.js';
import { manifests as treeManifests } from './menu-item/manifests.js';
import { manifests as workspaceManifests } from './workspace/manifests.js';

export const manifests = [
	...treeManifests,
	...workspaceManifests,
];
