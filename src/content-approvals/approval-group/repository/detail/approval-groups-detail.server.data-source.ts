import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { UmbDetailDataSource } from "@umbraco-cms/backoffice/repository";
import {
  ApprovalGroupService,
  type ApprovalGroupDetailResponseModel,
} from "@umbraco-workflow/generated";

export class WorkflowApprovalGroupsDetailServerDataSource
  implements UmbDetailDataSource<ApprovalGroupDetailResponseModel>
{
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  /**
   * Fetches a group with the given id from the server
   * @param {number} groupId
   * @return {*}
   * @memberof WorkflowApprovalGroupsServerDataSource
   */
  async read(unique: string) {
    if (!unique) throw new Error("Group ID is missing");
    const { data, error } = await tryExecute(
      this.#host,
      ApprovalGroupService.getApprovalGroupById({
        path: {
          id: unique,
        },
      })
    );

    if (!data || error) {
      return { error };
    }

    return { data };
  }

  /**
   * @description - Get the approval groups overview
   * @param {number?} skip
   * @param {number?} take
   * @param {string?} filter
   * @returns {PagedApprovalGroupModel}
   */
  list(skip = 0, take = 5, filter?) {
    return tryExecute(
      this.#host,
      ApprovalGroupService.getApprovalGroup({ query: { skip, take, filter } })
    );
  }

  /**
   * Creates a new Approval Group scaffold
   * @param
   * @return {*}
   * @memberof WorkflowApprovalGroupsServerDataSource
   */
  async createScaffold() {
    return await tryExecute(
      this.#host,
      ApprovalGroupService.getApprovalGroupScaffold()
    );
  }

  /**
   * Inserts a new group on the server
   * @param {WorkflowApprovalGroupDetailModel} group
   * @return {*}
   * @memberof WorkflowApprovalGroupsServerDataSource
   */
  async create(group: ApprovalGroupDetailResponseModel) {
    if (!group) {
      throw new Error("Group is missing");
    }

    const { error } = await tryExecute(
      this.#host,
      ApprovalGroupService.postApprovalGroup({ body: group })
    );

    if (error) {
      return { error };
    }

    return this.read(group.unique);
  }

  /**
   * Updates a group on the server
   * @param {WorkflowApprovalGroupDetailModel} group
   * @return {*}
   * @memberof WorkflowApprovalGroupsServerDataSource
   */
  async update(group: ApprovalGroupDetailResponseModel) {
    if (!group.unique) {
      throw new Error("Group ID is missing");
    }

    const { error } = await tryExecute(
      this.#host,
      ApprovalGroupService.putApprovalGroupById({
        path: {
          id: group.unique,
        },
        body: group,
      })
    );

    if (error) {
      return { error };
    }

    return this.read(group.unique);
  }

  /**
   * Deletes a group on the server
   * @param {number} groupId
   * @return {*}
   * @memberof WorkflowApprovalGroupsServerDataSource
   */
  async delete(key: string) {
    if (!key) throw new Error("Group ID is missing");
    return tryExecute(
      this.#host,
      ApprovalGroupService.deleteApprovalGroupById({ path: { id: key } })
    );
  }
}
