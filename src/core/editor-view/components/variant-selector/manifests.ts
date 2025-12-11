export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "propertyEditorUi",
    alias: "Workflow.PropertyEditorUi.VariantSelector",
    name: "Workflow Variant Selector Property Editor UI",
    element: () => import("./workflow-variant-selector.element.js"),
    meta: {
      label: "Workflow Variant Selector",
      icon: "document",
      group: "this editor is not available for selection",
    },
  },
];
