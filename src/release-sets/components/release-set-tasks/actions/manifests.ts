import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_RELEASESET_TASK_COLLECTION_ALIAS } from "../constants.js";
import { WorkflowReleaseSetTaskCollectionAddTaskAction } from './add-task.collection-action.js';

export const manifests: Array<UmbExtensionManifest> = [{
  type: "collectionAction",
  kind: "button",
  name: "Workflow Release Set Add Task Collection Action",
  alias: "Workflow.CollectionAction.ReleaseSet.AddTask",
  api: WorkflowReleaseSetTaskCollectionAddTaskAction,
  weight: 200,
  meta: {
    label: "#workflow_releaseSets_addTask",
  },
  conditions: [
    {
      alias: UMB_COLLECTION_ALIAS_CONDITION,
      match: WORKFLOW_RELEASESET_TASK_COLLECTION_ALIAS,
    },
  ],
}];
