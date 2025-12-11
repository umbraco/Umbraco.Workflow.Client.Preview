import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { UmbCollectionDataSource } from "@umbraco-cms/backoffice/collection";
import type {
  WorkflowApprovalGroupCollectionFilterModel,
  WorkflowApprovalGroupCollectionModel,
} from "../entities.js";
import {
  WORKFLOW_APPROVALGROUP_ICON,
  WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
} from "../../constants.js";
import { ApprovalGroupService } from "@umbraco-workflow/generated";

export class WorkflowApprovalGroupCollectionServerDataSource
  implements UmbCollectionDataSource<WorkflowApprovalGroupCollectionModel>
{
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  async getCollection(query: WorkflowApprovalGroupCollectionFilterModel) {
    const { data, error } = await tryExecute(
      this.#host,
      ApprovalGroupService.getApprovalGroup({ query })
    );

    if (error) {
      return { error };
    }

    const items = data.items.map((item) => {
      const model: WorkflowApprovalGroupCollectionModel = {
        entityType: WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
        name: item.name!,
        unique: item.unique,
        icon: item.icon ?? WORKFLOW_APPROVALGROUP_ICON,
        groupEmail: item.groupEmail ?? undefined,
        members: item.members,
        permissions: item.permissions,
      };

      return model;
    });

    return { data: { items, total: data.totalItems } };
  }
}
