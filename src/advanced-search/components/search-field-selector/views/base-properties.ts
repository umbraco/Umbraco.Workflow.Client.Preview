import type { UmbPropertyValueData } from "@umbraco-cms/backoffice/property";
import { makeArray } from "@umbraco-workflow/core";
import { WorkflowStatusModel } from "@umbraco-workflow/generated";

const statuses = makeArray<WorkflowStatusModel>(
  "Approved",
  "Cancelled",
  "CancelledByThirdParty",
  "Errored",
  "NotRequired",
  "Null",
  "PendingApproval",
  "Rejected",
  "Resubmitted"
);

export const baseProperties: Array<
  UmbPropertyValueData & {
    propertyEditorUiAlias: string;
    name: string;
    config?: Array<{ alias: string; value: Array<string> }>;
  }
> = [
  {
    alias: "workflowStatus",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.CheckBoxList",
    name: "Workflow status",
    config: [
      {
        alias: "items",
        value: statuses
          .filter(
            (x: string) =>
              x === "PendingApproval" ||
              x === "Rejected"
          )
          .map((x) => x.toString())
          .sort((a, b) => (a < b ? -1 : 1)),
      },
    ],
  },
  {
    alias: "creatorID",
    name: "Created by",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.UserPicker",
  },
  {
    alias: "writerID",
    name: "Updated by",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.UserPicker",
  },
  {
    alias: "createDate_before",
    name: "Created before",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.DatePicker",
  },
  {
    alias: "createDate_after",
    name: "Created after",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.DatePicker",
  },
  {
    alias: "updateDate_before",
    name: "Updated before",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.DatePicker",
  },
  {
    alias: "updateDate_after",
    name: "Updated after",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.DatePicker",
  },
];
