import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbModalRouteRegistrationController } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_DETAIL_MODAL } from "@umbraco-workflow/editor-view";

export class WorkflowDetailModalRouterController extends UmbControllerBase {
  constructor(host: UmbControllerHost) {
    super(host);

    new UmbModalRouteRegistrationController(this, WORKFLOW_DETAIL_MODAL)
      .addAdditionalPath(":documentUnique/:instanceUnique")
      .onSetup((params) => {
        return {
          data: params,
          value: undefined,
        };
      });
  }
}
