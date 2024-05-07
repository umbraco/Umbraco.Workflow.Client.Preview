import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import type {
  MetaWorkspaceActionMenuItem,
  ManifestWorkspaceActionMenuItem,
  ManifestWorkspaceAction,
} from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION } from "../../editor-view/conditions/manifests.js";
import type {
  GlobalVariablesResponseModel,
  WorkflowLicenseModel,
  WorkflowScaffoldResponseModel,
} from "@umbraco-workflow/generated";
import {
  GlobalVariablesService,
  LicenseService,
  ScaffoldService,
} from "@umbraco-workflow/generated";

/** TODO => how do we handle new nodes? Currently creating a node won't trigger the change detection
 * so will receive the previous document's scaffold. Need to check how this is managed in current backoffice
 * as we need to get the correct scaffold for the node based on parent id (I think)
 */
export class WorkflowContext extends UmbControllerBase {
  #license = new UmbObjectState<WorkflowLicenseModel | undefined>(undefined);
  license = this.#license.asObservable();

  #globalVariables = new UmbObjectState<
    GlobalVariablesResponseModel | undefined
  >(undefined);
  globalVariables = this.#globalVariables.asObservable();

  #currentDocument?: string;

  #scaffold = new UmbObjectState<WorkflowScaffoldResponseModel | undefined>(
    undefined
  );
  scaffold = this.#scaffold.asObservable();

  #documentEditSegment = "/content/workspace/document/edit/";
  #documentCreateSegment = "/content/workspace/document/create";
  actionCache?: Array<ManifestWorkspaceAction>;
  actionMenuItemCache: Array<
    ManifestWorkspaceActionMenuItem<MetaWorkspaceActionMenuItem>
  > = [];

  #hasRemovedActions = false;

  constructor(host: UmbControllerHostElement) {
    super(host);
    window.addEventListener("changestate", () => this.#handleChangeState());
  }

  async hostConnected() {
    super.hostConnected();
    this.#getLicense();
    this.#getGlobals();

    this.observe(
      umbExtensionsRegistry.byType("workspaceActionMenuItem"),
      (items) => {
        this.actionMenuItemCache = items;
        this.#handleChangeState();
      }
    );
  }

  #handleChangeState() {
    const pathname = window.location.pathname;

    if (pathname.includes(this.#documentCreateSegment)) {
      this.#scaffold.setValue(undefined);
      this.#restoreWorkspaceActions();
      return;
    }

    if (!pathname.includes(this.#documentEditSegment)) return;

    const currentDocument = pathname
      .split(this.#documentEditSegment)[1]
      .split("/")[0];

    if (currentDocument === this.#currentDocument) return;
    this.#currentDocument = currentDocument;

    if (this.#hasRemovedActions) {
      this.#restoreWorkspaceActions();
      this.#hasRemovedActions = false;
    }

    this.scaffoldNode();
  }

  async scaffoldNode(nodeKey = this.#currentDocument) {
    const { data } = await tryExecuteAndNotify(
      this,
      ScaffoldService.getScaffold({
        nodeKey,
      })
    );

    this.#scaffold.setValue(data);
  }

  // TODO => combine these to return an object
  async #getLicense() {
    const { data } = await tryExecuteAndNotify(
      this,
      LicenseService.getLicense()
    );

    this.#license.setValue(data);
  }

  async #getGlobals() {
    const { data } = await tryExecuteAndNotify(
      this,
      GlobalVariablesService.getGlobal()
    );

    this.#globalVariables.setValue(data);
  }

  #restoreWorkspaceActions() {
    if (this.#hasRemovedActions) {
      this.restoreWorkspaceActions();
      this.#hasRemovedActions = false;
    }
  }

  restoreWorkspaceActions() {
    umbExtensionsRegistry.registerMany(this.actionMenuItemCache);
  }

  removeWorkspaceActions(actionAlias: string) {
    if (
      actionAlias ===
        WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION ||
      !this.#globalVariables.getValue()?.currentUserIsAdmin
    ) {
      this.actionMenuItemCache.forEach((x) => {
        umbExtensionsRegistry.unregister(x.alias);
      });
      this.#hasRemovedActions = true;
    }
  }
}
