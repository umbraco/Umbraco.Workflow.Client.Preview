import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowSubmitModalBaseElement } from "@umbraco-workflow/core";
import {
  UMB_DOCUMENT_ENTITY_TYPE,
  UMB_DOCUMENT_WORKSPACE_CONTEXT,
} from "@umbraco-cms/backoffice/document";

const elementName = "workflow-submit-document-modal";

@customElement(elementName)
export class WorkflowSubmitDocumentWorkflowModalElement extends WorkflowSubmitModalBaseElement {
  #documentWorkspace?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;

  constructor() {
    super({
      varies: async () => {
        const context = await this.getContext(UMB_DOCUMENT_WORKSPACE_CONTEXT);
        return context?.getVaries() ?? false;
      },
    });

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      this.#documentWorkspace = context;
    });
  }

  getInitiatorArgs(value) {
    const nodeUnique = this.#documentWorkspace?.getUnique();
    if (!nodeUnique) {
      throw new Error("Document unique is not available");
    }

    const publish = value.action !== "Unpublish";

    const initiateArgs = {
      nodeUnique,
      entityType: UMB_DOCUMENT_ENTITY_TYPE,
      releaseDate: publish
        ? (value.publishOn?.["date"] as string | undefined)
        : undefined,
      expireDate: value.unpublishOn?.["date"] as string | undefined,
      publish,
      cultures: value.cultures as string[],
      attachmentId: value.attachment as string | undefined,
    };

    return initiateArgs;
  }
}

export default WorkflowSubmitDocumentWorkflowModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowSubmitDocumentWorkflowModalElement;
  }
}
