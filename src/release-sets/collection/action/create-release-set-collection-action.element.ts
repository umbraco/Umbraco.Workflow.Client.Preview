import { UMB_COLLECTION_CONTEXT } from "@umbraco-cms/backoffice/collection";
import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { RELEASESET_ENTITY_TYPE } from "../../constants.js";

const elementName = "workflow-create-release-set-collection-action";

@customElement(elementName)
export class WorkflowCreateReleaseSetCollectionElement extends UmbLitElement {

  @state()
  private _createPath = "";

  constructor() {
    super();

    this.consumeContext(UMB_COLLECTION_CONTEXT, (context) => {
      if (!context) return;
      
      this.observe(context.workspacePathBuilder, builder => {
        if (!builder) return;
        this._createPath = builder({ entityType: RELEASESET_ENTITY_TYPE });
      });
    });
  }

  render() {
    return html`
      <uui-button
        label=${this.localize.term("general_create")}
        href=${`${this._createPath}create`}
        look="outline"
      ></uui-button>
    `;
  }
}

export default WorkflowCreateReleaseSetCollectionElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowCreateReleaseSetCollectionElement;
  }
}
