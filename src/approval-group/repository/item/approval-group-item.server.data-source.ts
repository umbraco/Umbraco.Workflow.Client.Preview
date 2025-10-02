import { UmbItemServerDataSourceBase } from "@umbraco-cms/backoffice/repository";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { ApprovalGroupItemModel } from "./types.js";
import {
  ApprovalGroupService,
  type ApprovalGroupItemResponseModel,
} from "@umbraco-workflow/generated";

export class WorkflowApprovalGroupItemServerDataSource extends UmbItemServerDataSourceBase<
  ApprovalGroupItemResponseModel,
  ApprovalGroupItemModel
> {
  constructor(host: UmbControllerHost) {
    super(host, {
      getItems,
      mapper,
    });
  }
}

const getItems = (uniques: Array<string>) =>
  ApprovalGroupService.getItemApprovalGroup({ query: { id: uniques } });

const mapper = (
  item: ApprovalGroupItemResponseModel
): ApprovalGroupItemModel => {
  return {
    unique: item.unique,
    name: item.name,
    icon: item.icon || null,
  };
};
