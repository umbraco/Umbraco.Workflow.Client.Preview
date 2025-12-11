import {
  UmbEntityNamedDetailWorkspaceContextBase,
  UmbWorkspaceIsNewRedirectController,
  UmbWorkspaceIsNewRedirectControllerAlias,
  type UmbRoutableWorkspaceContext,
  type UmbSubmittableWorkspaceContext,
} from "@umbraco-cms/backoffice/workspace";
import { appendToFrozenArray } from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import { WorkflowApprovalGroupsDetailRepository } from "../../repository/detail/approval-groups-detail.repository.js";
import { WORKFLOW_USER_PERMISSION_APPROVALGROUP_UPDATE } from "../../user-permissions/constants.js";
import {
  WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
  WORKFLOW_APPROVALGROUP_ROOT_ENTITY_TYPE,
  WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
} from "../../constants.js";
import { ApprovalGroupWorkspaceEditorElement } from "./approval-group-workspace-editor.element.js";
import type {
  ApprovalGroupDetailResponseModel,
  SettingsPropertyDisplayModel,
} from "@umbraco-workflow/generated";
import { WORKFLOW_APPROVALGROUP_DETAIL_REPOSITORY_ALIAS } from "../../repository/detail/constants.js";
import { UmbReadOnlyGuardManager } from "@umbraco-cms/backoffice/utils";

export class WorkflowApprovalGroupWorkspaceContext
  extends UmbEntityNamedDetailWorkspaceContextBase<
    ApprovalGroupDetailResponseModel,
    WorkflowApprovalGroupsDetailRepository
  >
  implements UmbSubmittableWorkspaceContext, UmbRoutableWorkspaceContext
{
  public readonly repository = new WorkflowApprovalGroupsDetailRepository(this);
  public readonly readOnlyGuard = new UmbReadOnlyGuardManager(this);

  readonly icon = this._data.createObservablePartOfCurrent(
    (data) => data?.icon || null
  );

  readonly alias = this._data.createObservablePartOfCurrent(
    (data) => data?.alias || ""
  );

  constructor(host: UmbControllerHostElement) {
    super(host, {
      workspaceAlias: WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
      entityType: WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
      detailRepositoryAlias: WORKFLOW_APPROVALGROUP_DETAIL_REPOSITORY_ALIAS,
    });

    this.routes.setRoutes([
      {
        path: "create",
        component: ApprovalGroupWorkspaceEditorElement,
        setup: async () => {
          await this.createScaffold({
            parent: {
              entityType: WORKFLOW_APPROVALGROUP_ROOT_ENTITY_TYPE,
              unique: null,
            },
          });

          new UmbWorkspaceIsNewRedirectController(
            this,
            this,
            this.getHostElement().shadowRoot!.querySelector("umb-router-slot")!
          );
        },
      },
      {
        path: "edit/:unique",
        component: ApprovalGroupWorkspaceEditorElement,
        setup: (_component, info) => {
          this.removeUmbControllerByAlias(
            UmbWorkspaceIsNewRedirectControllerAlias
          );
          this.load(info.match.params.unique);
        },
      },
    ]);

    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (currentUser) => {
      this.observe(currentUser?.fallbackPermissions, (fallbackPermissions) => {
        const readonly = !fallbackPermissions?.includes(
          WORKFLOW_USER_PERMISSION_APPROVALGROUP_UPDATE
        );

        if (readonly) {
          this.readOnlyGuard.addRule({
            unique: WORKFLOW_USER_PERMISSION_APPROVALGROUP_UPDATE,
          });
        } else {
          this.readOnlyGuard.removeRule(
            WORKFLOW_USER_PERMISSION_APPROVALGROUP_UPDATE
          );
        }
      });
    });
  }

  set(data: Partial<ApprovalGroupDetailResponseModel>) {
    this._data.updateCurrent(data);
  }

  setPropertyValue(alias: string, value: any) {
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

    this._data.updateCurrent({ properties: newProperties });
  }
}

export { WorkflowApprovalGroupWorkspaceContext as api };
