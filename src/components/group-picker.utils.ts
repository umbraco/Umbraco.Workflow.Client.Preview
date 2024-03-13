import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { UmbModalManagerContext } from "@umbraco-cms/backoffice/modal";
import type { UserGroupPermissionsModel } from "@umbraco-workflow/generated";
import { WORKFLOW_GROUP_PICKER_MODAL } from "@umbraco-workflow/modal";

export function remove(arr: Array<UserGroupPermissionsModel>, idx: number) {
  const unfrozenArr = [...arr];
  unfrozenArr.splice(idx, 1);
  return unfrozenArr.map((x, i) => ({ ...x, permission: i }));
}

export async function add(
  host: UmbControllerHost,
  arr: Array<UserGroupPermissionsModel>,
  nodeKey?: string,
  contentTypeKey?: string,
  modalManagerContext?: UmbModalManagerContext,
  additionalProps?: Record<string, any>
) {
  const modalHandler = modalManagerContext?.open(host, WORKFLOW_GROUP_PICKER_MODAL, {
    data: {
      selection: [...(arr.map((p) => p.groupKey ?? null) ?? [])],
    },
  });

  const { groups } = await modalHandler!.onSubmit();

  const mapped: Array<UserGroupPermissionsModel> = [];

  groups?.forEach((group) => {
    if (arr.find((p) => p.groupKey === group.key)) {
      return;
    }

    mapped.push({
      groupName: group.name,
      nodeKey,
      contentTypeKey,
      groupKey: group.key,
      groupId: group.groupId!,
      approvalThreshold: 0,
      permission: arr.length + mapped.length,
      id: 0,
      variant: "",
      nodeId: 0,
      contentTypeId: 0,
      ...additionalProps,
    });
  });

  return [...arr, ...mapped];
}
