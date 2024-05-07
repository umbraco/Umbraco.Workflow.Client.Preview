import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { UmbDataSourceResponse } from "@umbraco-cms/backoffice/repository";

export interface WorkflowServerDataSourceConstructor<
  DetailType extends object,
  DetalSaveType = DetailType
> {
  new (host: UmbControllerHost): WorkflowServerDataSource<
    DetailType,
    DetalSaveType
  >;
}

export interface WorkflowServerDataSource<
  DataSourceType extends object,
  DataSaveType = DataSourceType
> {
  read: () => Promise<UmbDataSourceResponse<DataSourceType>>;
  update: (
    data: DataSaveType
  ) => Promise<UmbDataSourceResponse<DataSourceType>>;
}
