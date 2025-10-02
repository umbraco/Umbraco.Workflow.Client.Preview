import { WORKFLOW_USER_PERMISSION_CONDITION_ALIAS } from './constants.js';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'condition',
		name: 'Workflow User Permission Condition',
		alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
		api: () => import('./user-permission.condition.js'),
	},
];
