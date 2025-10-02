import {
  UmbSubmittableWorkspaceContextBase,
  type UmbRoutableWorkspaceContext,
  type UmbSubmittableWorkspaceContext,
} from "@umbraco-cms/backoffice/workspace";
import {
  UmbObjectState,
  appendToFrozenArray,
} from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowApprovalGroupsDetailRepository } from "../../repository/detail/approval-groups-detail.repository.js";
import {
  WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
  WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
} from "../../constants.js";
import { ApprovalGroupWorkspaceEditorElement } from "./approval-group-workspace-editor.element.js";
import type {
  ApprovalGroupDetailResponseModelReadable,
  SettingsPropertyDisplayModel,
} from "@umbraco-workflow/generated";

export class WorkflowApprovalGroupWorkspaceContext
  extends UmbSubmittableWorkspaceContextBase<ApprovalGroupDetailResponseModelReadable>
  implements UmbSubmittableWorkspaceContext, UmbRoutableWorkspaceContext
{
  public readonly IS_APPROVAL_GROUPS_WORKSPACE_CONTEXT = true;
  public readonly repository = new WorkflowApprovalGroupsDetailRepository(this);

  #data = new UmbObjectState<ApprovalGroupDetailResponseModelReadable | undefined>(
    undefined
  );
  data = this.#data.asObservable();

  readonly unique = this.#data.asObservablePart((data) => data?.unique);
  readonly icon = this.#data.asObservablePart((data) => data?.icon);

  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS);

    this.routes.setRoutes([
      {
        path: "edit/:id",
        component: ApprovalGroupWorkspaceEditorElement,
        setup: (_component, info) => {
          this.load(info.match.params.id);
        },
      },
      {
        path: "create",
        component: ApprovalGroupWorkspaceEditorElement,
        setup: () => {
          this.create();
        },
      },
    ]);
  }

  async load(unique: string) {
    const { data } = await this.repository.requestByUnique(unique);
    if (data) {
      this.setIsNew(false);
      this.#data.update(data);
    }
  }

  async create() {
    const { data } = await this.repository.createScaffold();
    if (!data) return;

    this.setIsNew(true);
    this.#data.setValue(data);

    return { data };
  }

  getData() {
    return this.#data.getValue();
  }

  getEntityType() {
    return WORKFLOW_APPROVALGROUP_ENTITY_TYPE;
  }

  getUnique() {
    return this.getData()?.unique;
  }

  setName(name: string) {
    this.#data.update({ name });
  }

  setAlias(alias: string) {
    this.#data.update({ alias });
  }

  setIcon(icon: string) {
    this.#data.update({ icon });
  }

  set(value: object) {
    this.#data.update(value);
  }

  setPropertyValue(value: any, alias: string) {
    const properties = this.getData()?.properties ?? [];
    const property = {
      ...properties.find((p) => p.alias === alias),
      ...{ value },
    } as SettingsPropertyDisplayModel;

    const newProperties = appendToFrozenArray(
      properties,
      property,
      (x) => x.alias
    );

    this.#data.update({ properties: newProperties });
  }

  // TODO => validation?
  async submit() {
    const data = this.getData();
    if (!data) return;

    if (this.getIsNew()) {
      await this.repository.create(data, null);
    } else {
      await this.repository.save(data);
    }

    await this.load(data.unique);
  }

  async delete() {
    const unique = this.getUnique();
    if (!unique) return;

    const { error } = await this.repository.delete(unique);
    return error === undefined;
  }

  destroy(): void {
    this.repository.destroy();
    super.destroy();
  }
}

export { WorkflowApprovalGroupWorkspaceContext as api };
