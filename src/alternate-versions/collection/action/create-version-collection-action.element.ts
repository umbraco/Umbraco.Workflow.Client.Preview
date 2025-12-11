import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { UMB_COLLECTION_CONTEXT } from "@umbraco-cms/backoffice/collection";
import { ALTERNATEVERSION_ENTITY_TYPE } from "../../constants.js";
import { WORKFLOW_CREATE_ALTERNATEVERSION_WORKSPACE_PATH_PATTERN } from "src/alternate-versions/paths.js";

const elementName = "workflow-create-version-collection-action";

@customElement(elementName)
export class WorkflowCreateVersionCollectionElement extends UmbLitElement {
  #workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;

  @state()
  private _createPath = "";

  constructor() {
    super();

    this.consumeContext(UMB_COLLECTION_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.workspacePathBuilder, (builder) => {
        if (!builder) return;
        this._createPath = builder({
          entityType: ALTERNATEVERSION_ENTITY_TYPE,
        });
      });
    });

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;
      this.#workspaceContext = context;
    });
  }

  #createRoute() {
    const activeVariant =
      this.#workspaceContext?.splitView.getActiveVariants()?.[0];
    if (!activeVariant) return "";

    const unique = this.#workspaceContext?.getUnique();
    if (!unique) return "";

    return WORKFLOW_CREATE_ALTERNATEVERSION_WORKSPACE_PATH_PATTERN.generateAbsolute(
      {
        base: this._createPath.slice(0, -1),
        unique,
        ...activeVariant,
      }
    );
  }

  render() {
    return html`
      <uui-button
        label=${this.localize.term("general_create")}
        href=${this.#createRoute()}
        look="outline"
      ></uui-button>
    `;
  }
}

export default WorkflowCreateVersionCollectionElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowCreateVersionCollectionElement;
  }
}
