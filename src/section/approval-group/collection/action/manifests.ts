import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import type { ManifestTypes } from "@umbraco-cms/backoffice/extension-registry";

// TODO => condition to check if license allows adding a group. This could be deregistered so
// will not replace any existing server-side checks

export const createManifest: ManifestTypes = {
  type: "collectionAction",
  kind: "button",
  name: "Create Approval Group Collection Action",
  alias: "Umb.CollectionAction.Workflow.ApprovalGroup.Create",
  weight: 200,
  meta: {
    label: "Create",
    href: "section/workflow/workspace/approval-group/create",
  },
  conditions: [
    {
      alias: UMB_COLLECTION_ALIAS_CONDITION,
      match: "Umb.Workflow.Collection.ApprovalGroup",
    },
  ],
};

export const manifests = [createManifest];
