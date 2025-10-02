import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbItemServerDataSourceBase } from "@umbraco-cms/backoffice/repository";
import { ALTERNATEVERSION_ENTITY_TYPE } from "../../constants.js";
import {
  VersionsService,
  type AlternateVersionCollectionResponseModel,
} from "@umbraco-workflow/generated";

export class AlternateVersionItemServerDataSource extends UmbItemServerDataSourceBase<
  AlternateVersionCollectionResponseModel,
  AlternateVersionCollectionResponseModel
> {
  constructor(host: UmbControllerHost) {
    super(host, {
      getItems,
      mapper,
    });
  }
}

const getItems = async (uniques: Array<string>) => {
  const data = await VersionsService.getVersionAll({ query: { unique: uniques[0] } });
  return { data: data.data.items };
}

const mapper = (item: AlternateVersionCollectionResponseModel) => {
  return {
    ...item,
    entityType: ALTERNATEVERSION_ENTITY_TYPE,
  };
};
