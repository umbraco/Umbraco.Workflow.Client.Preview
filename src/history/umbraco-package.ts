export const extensions = [
	{
		name: 'Workflow History Bundle',
		alias: 'Workflow.Bundle.History',
		type: 'bundle',
		js: () => import('./manifests.js'),
	},
];
