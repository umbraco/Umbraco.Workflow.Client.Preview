import {
  html,
  customElement,
  state,
  repeat,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UmbContentTypeContainerStructureHelper,
  type UmbContentTypeStructureManager,
  type UmbPropertyTypeContainerModel,
} from "@umbraco-cms/backoffice/content-type";
import {
  encodeFolderName,
  type UmbRoute,
  type UmbRouterSlotChangeEvent,
  type UmbRouterSlotInitEvent,
} from "@umbraco-cms/backoffice/router";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { type UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../../context/alternate-version-workspace.context-token.js";
import { WorkflowAlternatVersionPropertyDatasetContext } from "../../context/altenate-version-property-dataset.context.js";
import type { AlternateVersionWorkspaceViewEditTabElement } from "./alternate-version-editor-tab.element.js";

const elementName = "workflow-alternateversion-editor";

@customElement(elementName)
export class WorkflowAlternateVersionWorkspaceViewEditElement
  extends UmbLitElement
  implements UmbWorkspaceViewElement
{
  #structureManager?: UmbContentTypeStructureManager;
  #workspaceContext?: typeof WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT.TYPE;

  private _tabsStructureHelper = new UmbContentTypeContainerStructureHelper(
    this
  );

  @state()
  private _hasRootGroups = false;

  @state()
  private _routes: UmbRoute[] = [];

  @state()
  private _tabs?: Array<UmbPropertyTypeContainerModel>;

  @state()
  private _routerPath?: string;

  @state()
  private _activePath = "";

  constructor() {
    super();

    this._tabsStructureHelper.setIsRoot(true);
    this._tabsStructureHelper.setContainerChildType("Tab");
    this.observe(this._tabsStructureHelper.mergedContainers, (tabs) => {
      this._tabs = tabs;
      this.#createRoutes();
    });

    this.consumeContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
      async (context) => {
        if (!context) return;
        this.#workspaceContext = context;
        
        this.#structureManager = context.structure;
        this._tabsStructureHelper.setStructureManager(context.structure);
        this.#observeRootGroups();
        this.#provideDatasetContext();
      }
    );
  }

  #provideDatasetContext() {
    if (!this.#workspaceContext) return;

    this.observe(this.#workspaceContext.currentVariant, (variant) => {
      if (!variant) return;
      new WorkflowAlternatVersionPropertyDatasetContext(
        this,
        this.#workspaceContext?.getUnique(),
        variant
      );
    });
  }

  async #observeRootGroups() {
    if (!this.#structureManager) return;

    this.observe(
      await this.#structureManager.hasRootContainers("Group"),
      (hasRootGroups) => {
        this._hasRootGroups = hasRootGroups;
        this.#createRoutes();
      }
    );
  }

  #createRoutes() {
    const routes: Array<UmbRoute> = [];

    if (this._tabs?.length) {
      this._tabs.forEach((tab) => {
        const tabName = tab.name ?? "";
        routes.push({
          path: `tab/${encodeFolderName(tabName).toString()}`,
          component: () => import("./alternate-version-editor-tab.element.js"),
          setup: (component) => {
            (
              component as AlternateVersionWorkspaceViewEditTabElement
            ).containerId = tab.id;
          },
        });
      });
    }

    if (this._hasRootGroups) {
      routes.push({
        path: "",
        component: async () =>
          import("./alternate-version-editor-tab.element.js"),
        setup: (component) => {
          (
            component as AlternateVersionWorkspaceViewEditTabElement
          ).containerId = null;
        },
      });
    }

    if (routes.length !== 0) {
      routes.push({
        path: "",
        redirectTo: routes[0]?.path,
      });

      routes.push({
        path: `**`,
        component: async () =>
          (await import("@umbraco-cms/backoffice/router"))
            .UmbRouteNotFoundElement,
      });
    }

    this._routes = routes;
  }

  override render() {
    if (!this._routes || !this._tabs) return;
    return html`
      <umb-body-layout header-fit-height>
        ${this._routerPath &&
        (this._tabs.length > 1 ||
          (this._tabs.length === 1 && this._hasRootGroups))
          ? html` <uui-tab-group slot="header">
              ${this._hasRootGroups && this._tabs.length > 0
                ? html`
                    <uui-tab
                      label="Content"
                      .active=${this._routerPath + "/" === this._activePath}
                      href=${this._routerPath + "/"}
                      >Content</uui-tab
                    >
                  `
                : ""}
              ${repeat(
                this._tabs,
                (tab) => tab.name,
                (tab) => {
                  const path =
                    this._routerPath +
                    "/tab/" +
                    encodeFolderName(tab.name || "");
                  return html`<uui-tab
                    label=${tab.name ?? "Unnamed"}
                    .active=${path === this._activePath}
                    href=${path}
                    >${this.localize.string(tab.name)}</uui-tab
                  >`;
                }
              )}
            </uui-tab-group>`
          : ""}

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
      </umb-body-layout>
    `;
  }
}

export default WorkflowAlternateVersionWorkspaceViewEditElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAlternateVersionWorkspaceViewEditElement;
  }
}