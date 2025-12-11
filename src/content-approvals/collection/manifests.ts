import { UmbExtensionManifestKind } from "@umbraco-cms/backoffice/extension-registry";
import { manifests as repositoryManifests } from "./repository/manifests.js";

export const manifests: Array<UmbExtensionManifest | UmbExtensionManifestKind> =
  [
    ...repositoryManifests,
    {
      type: "kind",
      alias: "Workflow.Kind.Collection.Default",
      matchKind: "workflowDefaultCollection",
      matchType: "collectionView",
      manifest: {
        type: "collectionView",
        kind: "workflowDefaultCollection",
        element: () =>
          import(
            "./views/table/workflow-instances-table-collection-view.element.js"
          ),
        meta: {
          label: "Table",
          icon: "icon-list",
          pathName: "table",
        },
      },
    },
  ];
