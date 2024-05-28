import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import type { ManifestBase } from "@umbraco-cms/backoffice/extension-api";
import {
  ScaffoldService,
  ServerInformationService,
  type GlobalVariablesModel,
  type WorkflowLicenseModel,
  type WorkflowScaffoldResponseModel,
} from "@umbraco-workflow/generated";

/** TODO => how do we handle new nodes? Currently creating a node won't trigger the change detection
 * so will receive the previous document's scaffold. Need to check how this is managed in current backoffice
 * as we need to get the correct scaffold for the node based on parent id (I think)
 */
export class WorkflowContext extends UmbControllerBase {
  #license = new UmbObjectState<WorkflowLicenseModel | undefined>(undefined);
  license = this.#license.asObservable();

  #globalVariables = new UmbObjectState<GlobalVariablesModel | undefined>(
    undefined
  );
  globalVariables = this.#globalVariables.asObservable();

  _currentDocument?: string;
  _currentVariant?: string;

  #scaffold = new UmbObjectState<WorkflowScaffoldResponseModel | undefined>(
    undefined
  );
  scaffold = this.#scaffold.asObservable();

  readonly #documentEditSegment = "/content/workspace/document/edit/";
  readonly #documentCreateSegment = "/content/workspace/document/create";

  #actionItemCache: Array<ManifestBase> = [];
  #restoreActionCache: Array<ManifestBase> = [];

  // actions to remove when the user is non admin and we are not extending permissions
  #requestApprovalRemovedActions = [
    "Umb.WorkspaceAction.Document.SaveAndPublish",
    "Umb.Document.WorkspaceActionMenuItem.SchedulePublishing",
    "Umb.Document.WorkspaceActionMenuItem.PublishWithDescendants",
    "Umb.Document.WorkspaceActionMenuItem.Unpublish",
  ];

  #saveActions = [
    "Umb.WorkspaceAction.Document.Save",
    "Umb.WorkspaceAction.Document.SaveAndPreview",
  ];

  constructor(host: UmbControllerHostElement) {
    super(host);
    window.addEventListener("changestate", () => this.#handleChangeState());
  }

  async hostConnected() {
    super.hostConnected();
    this.#getGlobals();

    // only interested in CMS document actions
    this.observe(
      umbExtensionsRegistry.byTypesAndFilter(
        ["workspaceActionMenuItem", "workspaceAction", "entityAction"],
        (t) =>
          t.alias.startsWith("Umb.") &&
          t.alias.includes(".Document.") &&
          !t.alias.includes(".Workflow.")
      ),
      (actionItems) => {
        this.#actionItemCache = actionItems;
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

    if (!pathname.includes(this.#documentEditSegment)) {
      this.#scaffold.setValue(undefined);
      this._currentDocument = undefined;
      return;
    }

    const splitPathname = pathname
      .split(this.#documentEditSegment)[1]
      .split("/");

    const currentDocument = splitPathname[0];
    const currentVariant = splitPathname[1];

    if (
      !currentVariant || !currentDocument ||
      (currentDocument === this._currentDocument &&
        currentVariant === this._currentVariant)
    )
      return;

    this._currentDocument = currentDocument;
    this._currentVariant = currentVariant;

    this.#restoreWorkspaceActions();
    this.scaffoldNode();
  }

  async scaffoldNode(
    nodeKey = this._currentDocument,
    variant = this._currentVariant
  ) {
    const { data } = await tryExecuteAndNotify(
      this,
      ScaffoldService.getScaffold({
        nodeKey,
        variant,
      })
    );

    this.#scaffold.setValue(data);
  }

  async #getGlobals() {
    const { data } = await tryExecuteAndNotify(
      this,
      ServerInformationService.getInformation()
    );

    this.#globalVariables.setValue(data?.globalVariables);
    this.#license.setValue(data?.license ?? undefined);
  }

  #restoreWorkspaceActions() {
    if (!this.#restoreActionCache.length) return;
    umbExtensionsRegistry.registerMany([...this.#restoreActionCache]);
    this.#restoreActionCache = [];
  }

  /**
   * Determine which actions should remain, based on the node state,
   * the calling action, the current user, and general workflow settings.
   */
  removeWorkspaceActions(workflowActionAlias: string, canEdit = true) {
    const globalVariables = this.#globalVariables.getValue();
    const settings = this.#scaffold.getValue()?.settings;
    const userIsAdmin = globalVariables?.currentUserIsAdmin;

    // not admin? remove all base actions
    if (!userIsAdmin && !settings?.extendPermissions) {
      this.#actionItemCache.forEach((x) => {
        if (this.#requestApprovalRemovedActions.includes(x.alias)) {
          this.#restoreActionCache.push(x);
          umbExtensionsRegistry.unregister(x.alias);
        }
      });
    }

    // if can not edit, remove save and save+publish
    if (!canEdit) {
      this.#actionItemCache.forEach((x) => {
        if (this.#saveActions.includes(x.alias)) {
          this.#restoreActionCache.push(x);
          umbExtensionsRegistry.unregister(x.alias);
        }
      });
    }
  }
}
