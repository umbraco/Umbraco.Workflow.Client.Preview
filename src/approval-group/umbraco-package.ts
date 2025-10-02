export const extensions = [
	{
		name: 'Workflow Approval Groups Bundle',
		alias: 'Workflow.Bundle.ApprovalGroups',
		type: 'bundle',
		js: () => import('./manifests.js'),
	},
];

export * from "./index.js";
