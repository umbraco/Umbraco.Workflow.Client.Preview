import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbSubmittableWorkspaceContext } from "@umbraco-cms/backoffice/workspace";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import type { ScaffoldArgsModel } from "../context/entities.js";

export abstract class WorkflowInitializerBaseController<
  ContextType extends UmbSubmittableWorkspaceContext
> extends UmbControllerBase {
  protected workspaceContext?: ContextType;

  #initializerArgs = new UmbObjectState<ScaffoldArgsModel | undefined>(
    undefined
  );
  initializerArgs = this.#initializerArgs.asObservable();

  abstract observeWorkspace(): void;

  constructor(
    host: UmbControllerHost,
    contextToken: UmbContextToken<UmbSubmittableWorkspaceContext, ContextType>,
    initializerArgs?: ScaffoldArgsModel
  ) {
    super(host);

    if (initializerArgs) {
      this.#initializerArgs.setValue(initializerArgs);
      return;
    }

    this.consumeContext(contextToken, async (context) => {
      this.workspaceContext = context;
      this.observeWorkspace();
    });
  }

  setInitializerArgs(args: ScaffoldArgsModel) {
    this.#initializerArgs.setValue(args);
  }
}
