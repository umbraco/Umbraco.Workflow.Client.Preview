import { ManifestCollectionView } from "@umbraco-cms/backoffice/collection";

export interface ManifestWorkflowDefaultCollectionKind
  extends ManifestCollectionView {
  type: "collectionView";
  kind: "workflowDefaultCollection";
}

declare global {
  interface UmbExtensionManifestMap {
    workflowManifestWorkflowDefaultCollectionKind: ManifestWorkflowDefaultCollectionKind;
  }
}
