export const extensions = [
	{
		name: 'Workflow Settings Bundle',
		alias: 'Workflow.Bundle.Settings',
		type: 'bundle',
		js: () => import('./manifests.js'),
	},
];

export * from "./index.js";
