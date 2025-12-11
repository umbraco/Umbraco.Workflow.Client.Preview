import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import {
  PageComponent,
  UmbRoute,
  UmbRouterSlotChangeEvent,
  UmbRouterSlotInitEvent,
} from "@umbraco-cms/backoffice/router";
import {
  UMB_VIEW_CONTEXT,
  UmbViewController,
} from "@umbraco-cms/backoffice/view";
import { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/workspace";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import { UMB_DOCUMENT_ENTITY_TYPE } from "@umbraco-cms/backoffice/document";
import { createExtensionElement } from "@umbraco-cms/backoffice/extension-api";
import {
  ManifestWorkflowWorkspaceTab,
  WORKFLOW_WORKSPACE_TAB,
} from "../types.js";

const elementName = "workflow-workspace-editor-view";

@customElement(elementName)
export class WorkflowWorkspaceEditorViewElement
  extends UmbLitElement
  implements UmbWorkspaceViewElement
{
  #viewContext?: typeof UMB_VIEW_CONTEXT.TYPE;

  @state()
  private _routerPath?: string;

  @state()
  private _activePath = "";

  @state()
  private _routes: UmbRoute[] = [];

  @state()
  private _tabs: Array<ManifestWorkflowWorkspaceTab> = [];

  #tabViewContexts: Array<UmbViewController> = [];
  #currentProvidedView?: UmbViewController;

  constructor() {
    super();

    this.consumeContext(UMB_VIEW_CONTEXT, (context) => {
      this.#viewContext = context;
      this.#tabViewContexts.forEach((view) => {
        view.inheritFrom(this.#viewContext);
      });
    });

    this.observe(
      umbExtensionsRegistry.byTypeAndFilter(
        WORKFLOW_WORKSPACE_TAB,
        (x) => x.forEntityType === UMB_DOCUMENT_ENTITY_TYPE
      ),
      (manifests) => this.#createRoutes(manifests)
    );
  }

  #createRoutes(manifests: Array<ManifestWorkflowWorkspaceTab>) {
    const routes: Array<UmbRoute> = [];

    this._tabs = manifests;

    this._tabs.forEach((tab) => {
      routes.push({
        path: this.#getPath(tab),
        component: () => createExtensionElement(tab),
        setup: (component) => {
          this.#provideViewContext(tab.alias, component);
        },
      });

      this.#createViewContext(tab.alias, tab.meta.pathname);
    });

    if (routes.length !== 0) {
      routes.push({
        ...routes[0],
        unique: routes[0].path,
        path: "",
      });
    }

    routes.push({
      path: `**`,
      component: async () =>
        (await import("@umbraco-cms/backoffice/router"))
          .UmbRouteNotFoundElement,
    });

    this._routes = routes;
  }

  #createViewContext(viewAlias: string | null, viewTitle: string | null) {
    if (
      this.#tabViewContexts.find((context) => context.viewAlias === viewAlias)
    )
      return;

    const view = new UmbViewController(this, viewAlias);
    this.#tabViewContexts.push(view);

    view.setTitle(this.localize.term(`workflow_${viewTitle}`));
    view.inheritFrom(this.#viewContext);
  }

  #getPath(tab: ManifestWorkflowWorkspaceTab) {
    return `tab/${tab.meta.pathname}`;
  }

  #provideViewContext(viewAlias: string | null, component: PageComponent) {
    const view = this.#tabViewContexts.find(
      (context) => context.viewAlias === viewAlias
    );

    if (this.#currentProvidedView === view) {
      return;
    }

    this.#currentProvidedView?.unprovide();

    if (!view) {
      throw new Error(`View context with alias ${viewAlias} not found`);
    }

    this.#currentProvidedView = view;
    view.provideAt(component as any);
  }

  #renderTabGroup() {
    if (this._tabs.length < 2) return;

    return html`
      <uui-tab-group slot="header">
        ${this._tabs.map((tab, idx) => {
          const path = this.#getPath(tab);
          const fullPath = `${this._routerPath}/${path}`;
          const active =
            fullPath === this._activePath ||
            (idx === 0 && this._activePath === this._routerPath + "/");

          return html` <uui-tab
            ?active=${active}
            href=${fullPath}
            label=${this.localize.term(`workflow_${tab.meta.pathname}`)}
          ></uui-tab>`;
        })}
      </uui-tab-group>
    `;
  }

  render() {
    if (!this._routes || this._routes.length === 0 || !this._tabs) {
      return html`<umb-view-loader></umb-view-loader>`;
    }

    return html`<umb-body-layout header-fit-height
      >${this.#renderTabGroup()}
      <umb-router-slot
        .routes=${this._routes}
        @init=${(event: UmbRouterSlotInitEvent) => {
          this._routerPath = event.target.absoluteRouterPath;
        }}
        @change=${(event: UmbRouterSlotChangeEvent) => {
          this._activePath = event.target.absoluteActiveViewPath || "";
        }}
      >
      </umb-router-slot>
    </umb-body-layout>`;
  }

  /* layout-1 is reset to correctly render the history collection */
  static styles = [
    css`
      :host {
        --uui-size-layout-1: 0;
      }

      [disabled] {
        position: relative;
        pointer-events: none;
        opacity: 0.6;
      }

      workflow-alert {
        margin: var(--uui-size-8);
        margin-bottom: 0;
        display: block;
      }
    `,
  ];
}

export default WorkflowWorkspaceEditorViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowWorkspaceEditorViewElement;
  }
}
