import { UmbModalRouteRegistrationController } from "@umbraco-cms/backoffice/router";
import { UMB_WORKSPACE_MODAL } from "@umbraco-cms/backoffice/workspace";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { Subject } from "@umbraco-cms/backoffice/external/rxjs";
import { RELEASESET_ENTITY_TYPE } from "./constants.js";

export class WorkflowReleaseSetWorkspaceModalRouterController extends UmbControllerBase {
  value = new Subject<string>();

  constructor(host: UmbControllerHost) {
    super(host);

    new UmbModalRouteRegistrationController(this, UMB_WORKSPACE_MODAL)
      .addAdditionalPath(RELEASESET_ENTITY_TYPE)
      .onSetup(() => ({
        data: { entityType: RELEASESET_ENTITY_TYPE },
      }))
      .observeRouteBuilder((routeBuilder) => {
        const path = routeBuilder({});
        if (!path?.length) return;
        this.value.next(path);
      });
  }
}
