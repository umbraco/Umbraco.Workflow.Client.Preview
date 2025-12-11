import { makeArray } from "@umbraco-workflow/core";
import type { PropertyDataSetProperty } from "../../entities.js";
import { ReleaseSetTaskStatusModel } from "@umbraco-workflow/generated";

export const taskProperties: Array<PropertyDataSetProperty> = [
  {
    name: "Title",
    alias: "name",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox",
  },
  {
    name: "Description",
    alias: "description",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.TextArea",
  },
  {
    alias: "assignedTo",
    name: "Assigned to",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.UserPicker",
  },
  {
    alias: "status",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.RadioButtonList",
    name: "Status",
    create: false,
    config: [
      {
        alias: "items",
        value: makeArray<ReleaseSetTaskStatusModel>(
          "Active",
          "Closed",
          "Complete"
        ).sort((a, b) => (a < b ? -1 : 1)),
      },
    ],
  },
  {
    alias: "creatorBy",
    name: "Created by",
    create: false,
    edit: false,
    propertyEditorUiAlias: "Umb.PropertyEditorUi.UserPicker",
  },
];
