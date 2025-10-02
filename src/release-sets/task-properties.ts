import type { PropertyDataSetProperty } from "./entities.js";
import { ReleaseSetTaskStatusModel } from "@umbraco-workflow/generated";

// name: string;
//     icon?: string | null;
//     readonly entityType: string;
//     createdOn: string;
//     completedOn?: string | null;
//     assignedTo?: UserItemModel | null;
//     createdBy: UserItemModel;
//     status: ReleaseSetTaskStatusModel;
//     description?: string | null;

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
        value: Object.values(ReleaseSetTaskStatusModel)
          .map((x) => x.toString())
          .sort((a, b) => (a < b ? -1 : 1)),
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
