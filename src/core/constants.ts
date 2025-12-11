export const WORKFLOW_SECTION_ALIAS = "Umb.Section.Workflow";
export const WORKFLOW_SECTION_MENU_ALIAS = "Umb.Menu.Workflow";
export const WORKFLOW_SECTION_PATHNAME = "workflow";
export const WORKFLOW_ICON = "icon-nodes";

export const WORKFLOW_INVARIANT = "invariant";

export const WORKFLOW_EXPANDER_COMMENT = {
  alias: "comment",
  propertyEditorUiAlias: "Umb.PropertyEditorUi.TextArea",
  label: "#workflow_describeChanges",
  core: true,
  config: [
    { alias: "maxChars", value: 250 },
    { alias: "rows", value: 5 },
  ],
  weight: 1000,
  validation: { mandatory: true },
};
