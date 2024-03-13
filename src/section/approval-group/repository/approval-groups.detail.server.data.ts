import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import type { UmbDetailDataSource } from "@umbraco-cms/backoffice/repository";
import {
  WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
  type WorkflowApprovalGroupDetailModel,
} from "../types.js";
import {
  ApprovalGroupResource,
  type UserGroupModel,
} from "@umbraco-workflow/generated";

/**
 * A data source for Approval Groups that fetches data from the server
 * @export
 * @class WorkflowApprovalGroupsDetailServerDataSource
 * @implements {WorkflowDetailDataSource}
 */
export class WorkflowApprovalGroupsDetailServerDataSource
  implements UmbDetailDataSource<WorkflowApprovalGroupDetailModel>
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
    const { data, error } = await tryExecuteAndNotify(
      this.#host,
      ApprovalGroupResource.getApprovalGroupById({
        id: unique,
      })
    );

    if (error || !data) {
      return { error };
    }

    const group: WorkflowApprovalGroupDetailModel = {
      unique: data.key,
      entityType: WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
      name: data.name,
      users: data.users,
      alias: data.alias,
      icon: data.icon ?? "",
      properties: data.properties,
      permissions: data.permissions,
      inheritMembers: data.inheritMembers,
    };

    return { data: group };
  }

  /**
   * @description - Get the approval groups overview
   * @param {number?} skip
   * @param {number?} take
   * @param {string?} filter
   * @returns {PagedUserGroupModel}
   */
  list(skip = 0, take = 5, filter?) {
    return tryExecuteAndNotify(
      this.#host,
      ApprovalGroupResource.getApprovalGroup({ skip, take, filter })
    );
  }

  /**
   * @description - Get the approval groups overview
   * @param {number?} skip
   * @param {number?} take
   * @param {string?} filter
   * @returns {PagedUserGroupBaseModel}
   */
  listSlim(skip = 0, take = 5, filter?) {
    return tryExecuteAndNotify(
      this.#host,
      ApprovalGroupResource.getApprovalGroupSlim({ skip, take, filter })
    );
  }

  /**
   * Creates a new Approval Group scaffold
   * @param
   * @return {*}
   * @memberof WorkflowApprovalGroupsServerDataSource
   */
  async createScaffold() {
    const { data, error } = await tryExecuteAndNotify(
      this.#host,
      ApprovalGroupResource.getApprovalGroupScaffold()
    );

    if (error || !data) {
      return { error };
    }

    const group: WorkflowApprovalGroupDetailModel = {
      unique: data.key,
      entityType: WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
      name: data.name,
      users: data.users,
      alias: data.alias,
      icon: data.icon ?? "",
      properties: data.properties,
      permissions: data.permissions,
      inheritMembers: data.inheritMembers,
    };

    return { data: group };
  }

  /**
   * Inserts a new group on the server
   * @param {WorkflowApprovalGroupDetailModel} group
   * @return {*}
   * @memberof WorkflowApprovalGroupsServerDataSource
   */
  async create(group: WorkflowApprovalGroupDetailModel) {
    if (!group) {
      throw new Error("Group is missing");
    }

    // TODO => mapping
    const requestBody: UserGroupModel = {
      key: group.unique,
      name: group.name,
      users: group.users.map((u) => ({
        userId: u.userId,
        groupId: u.groupId,
        inherited: u.inherited,
        isActive: u.isActive,
      })),
      properties: group.properties,
    } as UserGroupModel;

    const { data, error } = await tryExecuteAndNotify(
      this.#host,
      ApprovalGroupResource.postApprovalGroup({ requestBody: requestBody })
    );

    if (data) {
      return this.read(data);
    }

    return { error };
  }

  /**
   * Updates a group on the server
   * @param {WorkflowApprovalGroupDetailModel} group
   * @return {*}
   * @memberof WorkflowApprovalGroupsServerDataSource
   */
  async update(group: WorkflowApprovalGroupDetailModel) {
    if (!group.unique) {
      throw new Error("Group ID is missing");
    }

    // TODO => mapping
    const requestBody: UserGroupModel = {
      key: group.unique,
      alias: group.alias,
      icon: group.icon,
      inheritMembers: group.inheritMembers,
      permissions: group.permissions,
      properties: group.properties.map(p => ({ alias: p.alias, value: p.value })),
      name: group.name,
      users: group.users.map((u) => ({
        userId: u.userId,
        groupId: u.groupId,
        inherited: u.inherited,
        isActive: u.isActive,
      })),
    } as UserGroupModel;

    const { data, error } = await tryExecuteAndNotify(
      this.#host,
      ApprovalGroupResource.putApprovalGroupById({
        id: group.unique,
        requestBody,
      })
    );

    if (data) {
      return this.read(data);
    }

    return { error };
  }

  /**
   * Deletes a group on the server
   * @param {number} groupId
   * @return {*}
   * @memberof WorkflowApprovalGroupsServerDataSource
   */
  async delete(key: string) {
    if (!key) throw new Error("Group ID is missing");
    return tryExecuteAndNotify(
      this.#host,
      ApprovalGroupResource.deleteApprovalGroupById({ id: key })
    );
  }
}
