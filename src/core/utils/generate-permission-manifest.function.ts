import { toCamelCase } from "@umbraco-cms/backoffice/utils";

/**
 * Generates the manifest for a user permission, deriving values from the given parameters.
 * One of group or label is required, if no group the item will render in the General group
 */
export function generatePermissionManifest({
  group,
  verb,
  label,
  weight,
}: {
  group?: string;
  verb: string;
  label?: string;
  weight?: number;
}) {
  group ||= "general";

  const action = verb.split(".").pop() ?? "";
  const camelGroup = toCamelCase(group);

  const description = `${label ? toCamelCase(label) : camelGroup}${action}`;

  return {
    type: "entityUserPermission",
    alias: `Workflow.EntityUserPermission.${group.replaceAll(" ", "")}.${
      label ? description : action
    }`,
    name: `Workflow ${group} ${action} User Permission`,
    forEntityTypes: ["workflow"],
    weight: group === "general" ? 1000 : weight ?? 100,
    meta: {
      verbs: [verb],
      label: label
        ? `#workflow_actions_${toCamelCase(label)}${action}`
        : `#actions_${action.toLowerCase()}`,
      description: `#workflow_permissions_${description}`,
      group: camelGroup,
    },
  };
}
