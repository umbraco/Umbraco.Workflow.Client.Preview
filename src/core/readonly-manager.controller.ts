import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import { UmbVariantId } from "@umbraco-cms/backoffice/variant";

export class WorkflowReadonlyManagerController extends UmbControllerBase {
  workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  #localize = new UmbLocalizationController(this);
  #readOnlyStateUnique: string;
  #message: string;

  constructor(
    host: UmbControllerHost,
    readonlyStateUnique: string,
    message: string
  ) {
    super(host);

    this.#readOnlyStateUnique = readonlyStateUnique;
    this.#message = message;

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;
      
      this.workspaceContext = context;
    });
  }

  async #locksmith() {
    if (!this.workspaceContext) return;
    await this.workspaceContext.isLoaded();

    const activeVariant = this.workspaceContext.splitView
      .getActiveVariants()
      ?.at(0);

    if (!activeVariant) return;

    return {
      unique: `${this.#readOnlyStateUnique}_${activeVariant.culture}_${
        activeVariant.segment
      }`,
      culture: activeVariant.culture,
      segment: activeVariant.segment,
    };
  }

  async unlock() {
    if (!this.workspaceContext) return;

    const keys = await this.#locksmith();
    if (!keys) return;

    this.workspaceContext.readOnlyGuard.removeRule(keys.unique);
  }

  async lock() {
    if (!this.workspaceContext) return;

    const keys = await this.#locksmith();
    if (!keys) return;

    // not observing as we do not want to respond to removing the readonly state
    const states = await firstValueFrom(
      this.workspaceContext.readOnlyGuard.rules
    );

    if (states.length && states.some((x) => x.unique === keys.unique)) return;

    this.workspaceContext.readOnlyGuard.addRule({
      unique: keys.unique,
      message: this.#localize.term(this.#message),
      variantId: new UmbVariantId(keys.culture, keys.segment),
    });
  }
}
