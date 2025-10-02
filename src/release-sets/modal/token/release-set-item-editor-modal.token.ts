import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { ReleaseSetItemResponseModelReadable } from "@umbraco-workflow/generated";

export const WORKFLOW_RELEASESET_ITEM_EDITOR_MODAL_ALIAS =
  "Workflow.Modal.ReleaseSet.Item.Editor";

export interface WorkflowReleaseSetItemEditorModalResult {
  item: Partial<ReleaseSetItemResponseModelReadable>;
}

export const WORKFLOW_RELEASESET_ITEM_EDITOR_MODAL = new UmbModalToken<
  never,
  WorkflowReleaseSetItemEditorModalResult
>(WORKFLOW_RELEASESET_ITEM_EDITOR_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "medium",
  },
});
