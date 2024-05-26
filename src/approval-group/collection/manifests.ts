import type { ManifestTypes } from "@umbraco-cms/backoffice/extension-registry";
import {
  WORKFLOW_APPROVALGROUP_COLLECTION_REPOSITORY_ALIAS,
  manifests as collectionRepositoryManifests,
} from "./repository/manifests.js";
import { manifests as collectionViewsManifests } from "./views/manifests.js";
import { manifests as collectionActionManifests } from "./action/manifests.js";

export const WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS =
  "Umb.Workflow.Collection.ApprovalGroup";

const collectionManifest: ManifestTypes = {
  type: "collection",
  kind: "default",
  alias: WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS,
  name: "Approval Group Collection",
  meta: {
    repositoryAlias: WORKFLOW_APPROVALGROUP_COLLECTION_REPOSITORY_ALIAS,
  },
};

export const manifests = [
  collectionManifest,
  ...collectionRepositoryManifests,
  ...collectionViewsManifests,
  ...collectionActionManifests,
];
