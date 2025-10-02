export const extensions = [
	{
		name: 'Workflow Content Reviews Bundle',
		alias: 'Workflow.Bundle.ContentReviews',
		type: 'bundle',
		js: () => import('./manifests.js'),
	},
];

export * from "./components/index.js"
