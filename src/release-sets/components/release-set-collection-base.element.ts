import {
  UmbCollectionDefaultElement,
  type UmbDefaultCollectionContext,
} from "@umbraco-cms/backoffice/collection";
import type { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { state, html, css } from "@umbraco-cms/backoffice/external/lit";
import type { UmbRoute } from "@umbraco-cms/backoffice/router";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../workspace/release-set-workspace.context-token.js";
import { Observable } from "@umbraco-cms/backoffice/external/rxjs";
import { WorkflowReleaseSetWorkspaceContext } from "../workspace/release-set-workspace.context.js";

export class ReleaseSetComponentCollectionElement<
  EntityType extends { entityType: string; unique: string },
  CollectionContext extends UmbDefaultCollectionContext<EntityType>
> extends UmbCollectionDefaultElement {
  protected collectionContext?: CollectionContext;
  protected workspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;

  @state()
  protected collectionRoutes: Array<UmbRoute> = [];

  constructor(
    contextToken: UmbContextToken<CollectionContext>,
    observable: (
      ctx?: WorkflowReleaseSetWorkspaceContext
    ) => Observable<Array<EntityType> | undefined> | undefined
  ) {
    super();

    this.consumeContext(contextToken, (context) => {
      this.collectionContext = context;
      this.#observeCollectionRoutes();
    });

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      this.workspaceContext = context;

      this.observe(observable(context), (result) => {
        if (!result) return;
        this.collectionContext?.requestCollection();
      });
    });
  }

  #observeCollectionRoutes() {
    if (!this.collectionContext) return;

    this.observe(
      this.collectionContext.view.routes,
      (routes) => {
        this.collectionRoutes = routes;
      },
      "collectionRoutesObserver"
    );
  }

  override render() {
    return html`
      ${this.renderToolbar()}
      <umb-router-slot
        id="router-slot"
        .routes=${this.collectionRoutes}
      ></umb-router-slot>
      ${this.renderSelectionActions()}${this.renderPagination()}
    `;
  }

  static override styles = [
    ...UmbCollectionDefaultElement.styles,
    css`
      :host {
        height: auto;
      }

      umb-collection-pagination {
        margin-top: 0;
      }
    `,
  ];
}
