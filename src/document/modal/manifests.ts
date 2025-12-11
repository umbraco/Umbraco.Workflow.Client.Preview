import {
  WORKFLOW_EXPANDER_COMMENT,
  WORKFLOW_EXPANSION_TYPE_ALIAS,
} from "@umbraco-workflow/core";
import { UMB_DOCUMENT_ENTITY_TYPE } from "@umbraco-cms/backoffice/document";
import {
  WORKFLOW_SUBMIT_DOCUMENT_WORKFLOW_MODAL_ALIAS,
  WORKFLOW_DOCUMENT_UNLOCK_MODAL_ALIAS,
} from "./token/index.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_SUBMIT_DOCUMENT_WORKFLOW_MODAL_ALIAS,
    name: "Workflow Submit Document Workflow Modal",
    js: () => import("./element/submit-document-workflow-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_DOCUMENT_UNLOCK_MODAL_ALIAS,
    name: "Workflow Document Unlock Modal",
    js: () => import("./element/document-unlock-modal.element.js"),
  },
  {
    type: WORKFLOW_EXPANSION_TYPE_ALIAS,
    alias: "Workflow.Expansion.Document",
    name: "Workflow Document Workflow Expansion",
    entityType: UMB_DOCUMENT_ENTITY_TYPE,
    meta: {
      properties: [
        WORKFLOW_EXPANDER_COMMENT,
        {
          alias: "cultures",
          propertyEditorUiAlias: "Workflow.PropertyEditorUi.VariantSelector",
          label: "Variants",
          core: true,
          weight: 100,
          validation: { mandatory: true },
          include: (args) => args.varies,
        },
        {
          alias: "attachment",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.MediaPicker",
          label: "Attachment",
          core: true,
          config: [
            { alias: "validationLimit", value: { min: 0, max: 1 } },
            { alias: "multiple", value: false },
          ],
          weight: 600,
          include: (args) => args.state?.allowAttachments,
        },
        {
          alias: "publishOn",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.DateTimePicker",
          label: "Publish on",
          core: true,
          weight: 800,
          include: (args) => args.state?.allowScheduling,
        },
        {
          alias: "unpublishOn",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.DateTimePicker",
          label: "Unpublish on",
          core: true,
          weight: 700,
          include: (args) => args.state?.allowScheduling,
        },
        {
          alias: "action",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.RadioButtonList",
          label: "Action",
          core: true,
          config: [{ alias: "items", value: ["Publish", "Unpublish"] }],
          weight: 900,
          validation: { mandatory: true },
          include: (args) => args.state?.requireUnpublish,
        },
      ],
    },
  },
];
