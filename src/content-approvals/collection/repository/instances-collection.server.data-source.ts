import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UmbCollectionDataSource } from "@umbraco-cms/backoffice/collection";
import {
  WorkflowInstancesCollectionFilterModel,
  WorkflowInstancesCollectionModel,
} from "../entities.js";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import {
  InstanceService,
  WorkflowStatusModel,
} from "@umbraco-workflow/generated";
import { UMB_DOCUMENT_ENTITY_TYPE } from "@umbraco-cms/backoffice/document";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_ENTITY_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_APPROVALGROUP_ENTITY_TYPE } from "@umbraco-workflow/approval-group";
import { makeArray } from "@umbraco-workflow/core";
import { WORKFLOW_HISTORY_ROOT_ENTITY_TYPE } from "@umbraco-workflow/history";

export class WorkflowInstancesCollectionServerDataSource
  extends UmbControllerBase
  implements UmbCollectionDataSource<WorkflowInstancesCollectionModel>
{
  #workspaceContext?: typeof UMB_ENTITY_WORKSPACE_CONTEXT.TYPE;

  constructor(host: UmbControllerHost) {
    super(host);

    this.consumeContext(UMB_ENTITY_WORKSPACE_CONTEXT, (context) => {
      this.#workspaceContext = context;
    });
  }

  async getCollection(filter: WorkflowInstancesCollectionFilterModel) {
    filter = this.#getFiltersFromStorage(filter);
    filter = this.#updateFiltersForWorkspace(filter);

    const { data, error } = await tryExecute(
      this._host,
      (filter.handler ?? InstanceService.postInstanceAll)({ body: filter })
    );

    if (error) {
      return { error };
    }

    return {
      data: {
        items: data.items.map((d) => ({
          ...d,
          entityType: d.entityType ?? UMB_DOCUMENT_ENTITY_TYPE,
        })),
        total: data.totalItems,
      },
    };
  }

  #updateFiltersForWorkspace(filter: WorkflowInstancesCollectionFilterModel) {
    // if we are in a document context, set the unique
    if (!filter.filters?.historyOnly || !this.#workspaceContext) return filter;

    const entityType = this.#workspaceContext.getEntityType();

    const uniqueKey =
      entityType === WORKFLOW_APPROVALGROUP_ENTITY_TYPE ? "groupId" : "unique";

    const filters = {
      ...filter.filters,
      entityType:
        entityType == WORKFLOW_HISTORY_ROOT_ENTITY_TYPE ? null : entityType,
      [uniqueKey]: this.#workspaceContext.getUnique()?.toString(),
    };

    return { ...filter, filters };
  }

  #getFiltersFromStorage(filter: WorkflowInstancesCollectionFilterModel) {
    // check local storage for filters - these are set on the workflow dashboard
    // when clicking a chart header card.
    const filterString = window.localStorage.getItem("workflow_historyFilter");
    if (!filterString) return filter;

    window.localStorage.removeItem("workflow_historyFilter");

    const filterValues: { status: string; from: string } =
      JSON.parse(filterString);

    const filters = {
      ...filter.filters,
      status: [this.#getStatuses(filterValues.status)],
      createdDate: { from: filterValues.from, to: null },
    };

    return { ...filter, filters };
  }

  #getStatuses(status: string) {
    const array = makeArray<WorkflowStatusModel>(
      "Null",
      "Approved",
      "Rejected",
      "PendingApproval",
      "NotRequired",
      "Cancelled",
      "Errored",
      "Resubmitted",
      "CancelledByThirdParty"
    ) as string[];

    return array.findIndex((x) => x.toLowerCase() === status.toLowerCase());
  }
}
