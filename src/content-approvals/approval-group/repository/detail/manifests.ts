import type {
  ManifestStore,
  ManifestRepository,
} from "@umbraco-cms/backoffice/extension-registry";
import {
  WORKFLOW_APPROVALGROUP_DETAIL_REPOSITORY_ALIAS,
  WORKFLOW_APPROVALGROUP_DETAIL_STORE_ALIAS,
} from "./constants.js";

const repository: ManifestRepository = {
  type: "repository",
  alias: WORKFLOW_APPROVALGROUP_DETAIL_REPOSITORY_ALIAS,
  name: "Approval Groups Detail Repository",
  api: () => import("./approval-groups-detail.repository.js"),
};

const store: ManifestStore = {
  type: "store",
  alias: WORKFLOW_APPROVALGROUP_DETAIL_STORE_ALIAS,
  name: "Approval Groups Detail Store",
  api: () => import("./approval-groups-detail.store.js"),
};

export const manifests = [repository, store];
