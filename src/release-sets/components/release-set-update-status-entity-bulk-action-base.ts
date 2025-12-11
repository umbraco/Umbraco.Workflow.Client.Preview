import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  UmbEntityBulkActionBase,
  type UmbEntityBulkActionArgs,
} from "@umbraco-cms/backoffice/entity-bulk-action";
import type { MetaEntityBulkAction } from "@umbraco-cms/backoffice/extension-registry";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_RELEASESET_UPDATESTATUS_MODAL } from "../modal/index.js";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../workspace/index.js";
import type { StatusModel } from "@umbraco-workflow/core";
import {
  ObservableArrayGetterFnType,
  ObservableArraySetterFnType,
} from "../entities.js";

export class WorkflowReleaseSetUpdateStatusEntityBulkActionBase<
  EntityType extends MetaEntityBulkAction & {
    unique: string;
    status: StatusModel;
  }
> extends UmbEntityBulkActionBase<EntityType> {
  #optionType: Array<StatusModel>;

  #getter: ObservableArrayGetterFnType<EntityType>;
  #setter: ObservableArraySetterFnType<EntityType>;

  constructor(
    host: UmbControllerHost,
    args: UmbEntityBulkActionArgs<EntityType>,
    optionType: Array<StatusModel>,
    getter: ObservableArrayGetterFnType<EntityType>,
    setter: ObservableArraySetterFnType<EntityType>
  ) {
    super(host, args);

    this.#optionType = optionType;
    this.#getter = getter;
    this.#setter = setter;
  }

  async execute() {
    const status = await umbOpenModal(
      this,
      WORKFLOW_RELEASESET_UPDATESTATUS_MODAL,
      {
        data: {
          optionType: this.#optionType,
        },
      }
    )
      .then((result) => result.status)
      .catch(() => {});

    if (status === undefined) return;

    const workspaceContext = await this.getContext(
      WORKFLOW_RELEASESET_WORKSPACE_CONTEXT
    );

    if (!workspaceContext) {
      throw new Error(
        "Context not found: WORKFLOW_RELEASESET_WORKSPACE_CONTEXT"
      );
    }

    workspaceContext.updateStatus<EntityType>(
      this.selection,
      status,
      this.#getter,
      this.#setter
    );
  }
}
