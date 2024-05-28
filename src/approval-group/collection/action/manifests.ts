import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import type { ManifestTypes } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_APPROVAL_GROUP_WORKSPACE_SHOW_CREATE_GROUP_CONDITION } from '../../conditions/manifests.js';

export const createManifest: ManifestTypes = {
  type: "collectionAction",
  kind: "button",
  name: "Create Approval Group Collection Action",
  alias: "Workflow.CollectionAction.ApprovalGroup.Create",
  weight: 200,
  meta: {
    label: "#general_create",
    href: "section/workflow/workspace/approval-group/create",
  },
  conditions: [
    {
      alias: UMB_COLLECTION_ALIAS_CONDITION,
      match: "Umb.Workflow.Collection.ApprovalGroup",
    },
    {
      alias: WORKFLOW_APPROVAL_GROUP_WORKSPACE_SHOW_CREATE_GROUP_CONDITION,
    }
  ],
};

export const manifests = [createManifest];
