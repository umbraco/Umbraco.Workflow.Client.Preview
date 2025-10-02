import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_RELEASESET_ITEM_COLLECTION_ALIAS } from "../constants.js";
import { WorkflowReleaseSetItemCollectionAddItemAction } from "./add-item.collection-action.js";

export const manifests: Array<UmbExtensionManifest> = [{
  type: "collectionAction",
  kind: "button",
  name: "Workflow Release Set Add Item Collection Action",
  alias: "Workflow.CollectionAction.ReleaseSet.AddItem",
  api: WorkflowReleaseSetItemCollectionAddItemAction,
  weight: 200,
  meta: {
    label: "#workflow_releaseSets_addDocument",
  },
  conditions: [
    {
      alias: UMB_COLLECTION_ALIAS_CONDITION,
      match: WORKFLOW_RELEASESET_ITEM_COLLECTION_ALIAS,
    },
  ],
}];
