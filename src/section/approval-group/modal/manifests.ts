import type { ManifestModal } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_CONFIRM_DELETE_GROUP_MODAL_ALIAS } from "./token/confirm-delete-group-modal.token.js";

const modals: Array<ManifestModal> = [  {
    type: "modal",
    alias: WORKFLOW_CONFIRM_DELETE_GROUP_MODAL_ALIAS,
    name: "Workflow Confirm Delete Group Modal",
    js: () =>
      import(
        "./element/confirm-delete-group-modal.element.js"
      ),
  },
];

export const manifests = [...modals];