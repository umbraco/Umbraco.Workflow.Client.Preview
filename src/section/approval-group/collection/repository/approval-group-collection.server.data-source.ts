import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import type { UmbCollectionDataSource } from "@umbraco-cms/backoffice/collection";
import type {
  WorkflowApprovalGroupCollectionFilterModel,
  WorkflowApprovalGroupCollectionModel,
} from "../types.js";
import { WORKFLOW_APPROVALGROUP_ENTITY_TYPE } from "../../types.js";
import { ApprovalGroupService } from "@umbraco-workflow/generated";

export class WorkflowApprovalGroupCollectionServerDataSource
  implements UmbCollectionDataSource<WorkflowApprovalGroupCollectionModel>
{
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  async getCollection(filter: WorkflowApprovalGroupCollectionFilterModel) {
    const { data, error } = await tryExecuteAndNotify(
      this.#host,
      ApprovalGroupService.getApprovalGroup(filter)
    );

    if (data) {
      const items = data.items.map((item) => {
        const model: WorkflowApprovalGroupCollectionModel = {
          entityType: WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
          name: item.name!,
          groupEmail: item.groupEmail ?? undefined,
          unique: item.key,
          icon: item.icon ?? "icon-users",
          users: item.users
            .filter((u) => !!u.username)
            .map((u) => ({
              name: u.username!,
              inherited: u.inherited,
              email: u.email ?? undefined,
            })),
          permissions: item.permissions,
          languageCount: Object.keys(item.availableLanguages).length,
        };

        return model;
      });

      return { data: { items, total: data.totalItems } };
    }

    return { error };
  }
}
