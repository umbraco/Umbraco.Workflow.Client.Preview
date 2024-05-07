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
import { WorkflowApprovalGroupsRepository } from "../../repository/approval-groups.repository.js";
import {
  WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
  type WorkflowPropertyModel,
  type WorkflowApprovalGroupDetailModel,
} from "../../types.js";

import { ApprovalGroupWorkspaceEditorElement } from "./approval-group-workspace-editor.element.js";

export class WorkflowApprovalGroupWorkspaceContext
  extends UmbSubmittableWorkspaceContextBase<WorkflowApprovalGroupDetailModel>
  implements UmbSubmittableWorkspaceContext, UmbRoutableWorkspaceContext
{
  public readonly IS_APPROVAL_GROUPS_WORKSPACE_CONTEXT = true;
  public readonly repository = new WorkflowApprovalGroupsRepository(this);

  readonly unique;

  #data = new UmbObjectState<WorkflowApprovalGroupDetailModel | undefined>(
    undefined
  );
  data = this.#data.asObservable();
  #getDataPromise?: Promise<any>;

  constructor(host: UmbControllerHostElement) {
    super(host, "Workflow.Workspace.ApprovalGroup");

    this.routes.setRoutes([
      {
        path: "edit/:id",
        component: ApprovalGroupWorkspaceEditorElement,
        setup: (_component, info) => {
          this.load(info.match.params.id);
        },
      },
    ]);
  }

  async load(unique: string) {
    this.#getDataPromise = this.repository?.requestByUnique(unique);
    const { data } = await this.#getDataPromise;
    if (data) {
      this.setIsNew(false);
      this.#data.update(data);
    }
  }

  async create() {
    this.#getDataPromise = this.repository?.createScaffold();
    const { data } = await this.#getDataPromise;

    if (!data) return;

    this.setIsNew(true);
    this.#data.setValue(data as WorkflowApprovalGroupDetailModel);

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
    } as WorkflowPropertyModel;
    const newProperties = appendToFrozenArray(
      properties,
      property,
      (x) => x.alias
    );

    this.#data.update({ properties: newProperties });
  }

  removeUser(userId: string) {
    const users = [...(this.getData()?.users ?? [])];

    const idx = users.findIndex((u) => u.userId === userId) ?? -1;
    if (idx < 0) return;

    users?.splice(idx, 1);

    this.set({ users });
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
