import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";
import type { Observable } from "@umbraco-cms/backoffice/observable-api";
import type { WorkflowReleaseSetWorkspaceContext } from "../workspace/release-set-workspace.context.js";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../workspace/release-set-workspace.context-token.js";
import type { ComponentCollectionFilter } from "../entities.js";

export class WorkflowReleaseSetComponentCollectionRepository extends UmbControllerBase {
  constructor(host: UmbControllerHost) {
    super(host);
  }

  async requestComponentCollection<R>(
    callback: (context: WorkflowReleaseSetWorkspaceContext) => Observable<R>
  ) {
    const context = await this.getContext(
      WORKFLOW_RELEASESET_WORKSPACE_CONTEXT
    );

    if (!context) {
      throw new Error(
        "Context not found: WORKFLOW_RELEASESET_WORKSPACE_CONTEXT"
      );
    }

    const observable = callback(context);
    return (await firstValueFrom(observable)) ?? [];
  }

  page<T>(items: Array<T>, filter: ComponentCollectionFilter, sorter?: (a, b) => number) {
    const pagedItems = items.slice(filter.skip, filter.skip + filter.take);

    if (sorter) {
      pagedItems.sort(sorter);
    }

    return {
      data: {
        items: pagedItems,
        total: items.length,
      },
    };
  }
}
