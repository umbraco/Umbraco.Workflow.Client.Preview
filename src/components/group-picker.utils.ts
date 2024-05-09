import type {
  UserGroupPermissionsModel,
} from "@umbraco-workflow/generated";

export function remove(arr: Array<UserGroupPermissionsModel>, idx: number) {
  const unfrozenArr = [...arr];
  unfrozenArr.splice(idx, 1);
  return unfrozenArr.map((x, i) => ({ ...x, permission: i }));
}

export function add(
  uniques: Array<string>,
  nodeKey?: string,
  contentTypeKey?: string,
  additionalProps?: Record<string, any>
) {
  const mapped: Array<UserGroupPermissionsModel> = [];

  uniques?.forEach((unique, idx) => {
    mapped.push({
      nodeKey,
      contentTypeKey,
      groupKey: unique,
      approvalThreshold: 0,
      permission: idx,
      id: 0,
      variant: "",
      nodeId: 0,
      contentTypeId: 0,
      groupId: 0,
      groupName: "",
      ...additionalProps,
    });

  });

  return mapped;
}
