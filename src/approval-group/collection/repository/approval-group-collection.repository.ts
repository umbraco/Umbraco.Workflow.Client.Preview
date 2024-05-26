import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbCollectionRepository } from "@umbraco-cms/backoffice/collection";
import type { WorkflowApprovalGroupCollectionFilterModel } from "../types.js";
import {
  WORKFLOW_APPROVALGROUPS_DETAIL_STORE_CONTEXT,
  type WorkflowApprovalGroupsDetailStore,
} from "../../repository/detail/approval-groups-detail.store.js";
import { WorkflowApprovalGroupCollectionServerDataSource } from "./approval-group-collection.server.data-source.js";

export class WorkflowApprovalGroupCollectionRepository
  extends UmbControllerBase
  implements UmbCollectionRepository
{
  #init;

  #detailStore?: WorkflowApprovalGroupsDetailStore;
  #collectionSource: WorkflowApprovalGroupCollectionServerDataSource;

  constructor(host: UmbControllerHost) {
    super(host);
    this.#collectionSource =
      new WorkflowApprovalGroupCollectionServerDataSource(this._host);

    this.#init = this.consumeContext(
      WORKFLOW_APPROVALGROUPS_DETAIL_STORE_CONTEXT,
      (instance: WorkflowApprovalGroupsDetailStore) => {
        this.#detailStore = instance;
      }
    ).asPromise();
  }

  async requestCollection(filter: WorkflowApprovalGroupCollectionFilterModel = { skip: 0, take: 100 }) {
    await this.#init;

		const { data, error } = await this.#collectionSource.getCollection(filter);

		if (data) {
			this.#detailStore?.appendItems(data.items);
		}

		return { data, error, asObservable: () => this.#detailStore!.all() };  }

  destroy(): void {}
}

export default WorkflowApprovalGroupCollectionRepository;
