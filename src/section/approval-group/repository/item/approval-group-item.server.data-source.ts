import { UmbItemServerDataSourceBase } from "@umbraco-cms/backoffice/repository";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { ApprovalGroupItemModel } from "./types.js";
import {
  ApprovalGroupService,
  type UserGroupItemResponseModel,
} from "@umbraco-workflow/generated";

export class WorkflowApprovalGroupItemServerDataSource extends UmbItemServerDataSourceBase<
  UserGroupItemResponseModel,
  ApprovalGroupItemModel
> {
  constructor(host: UmbControllerHost) {
    super(host, {
      getItems,
      mapper,
    });
  }
}

/* eslint-disable local-rules/no-direct-api-import */
const getItems = (uniques: Array<string>) =>
  ApprovalGroupService.getItemApprovalGroup({ id: uniques });

const mapper = (item: UserGroupItemResponseModel): ApprovalGroupItemModel => {
  return {
    unique: item.id,
    name: item.name,
    icon: item.icon || null,
  };
};
