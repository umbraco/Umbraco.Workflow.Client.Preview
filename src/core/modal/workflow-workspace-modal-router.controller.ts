import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { Subject } from "@umbraco-cms/backoffice/external/rxjs";
import { UmbModalRouteRegistrationController } from "@umbraco-cms/backoffice/router";
import { UMB_WORKSPACE_MODAL } from "@umbraco-cms/backoffice/workspace";

export class WorkflowWorkspaceModalRouterController extends UmbControllerBase {
  path = new Subject<string>();

  constructor(host: UmbControllerHost, entityType: string) {
    super(host);

    new UmbModalRouteRegistrationController(this, UMB_WORKSPACE_MODAL)
      .addAdditionalPath(entityType)
      .onSetup(() => ({
        data: { entityType, preset: {} },
      }))
      .observeRouteBuilder((routeBuilder) => {
        const path = routeBuilder({});
        if (!path?.length) return;

        this.path?.next(path);
      });
  }
}
