import {
  WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_CREATE,
  WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_DELETE,
  WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_PROMOTE,
  WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_UPDATE,
} from "./constants";

const data = [
  { action: "Create", verbs: WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_CREATE },
  { action: "Update", verbs: WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_UPDATE },
  { action: "Delete", verbs: WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_DELETE },
  { action: "Promote", verbs: WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_PROMOTE },
].map(({ action, verbs }) => ({
  type: "entityUserPermission",
  alias: `Workflow.EntityUserPermission.AlternateVersion.${action}`,
  name: `Workflow Alternate Version ${action} User Permission`,
  forEntityTypes: ["workflow"],
  weight: 200,
  meta: {
    verbs: [verbs],
    label: `#workflow_permissions_${action.toLowerCase()}`,
    description: `#workflow_permissions_alternateVersion${action}`,
    group: "Alternate Version",
  },
}));

export const manifests = data;
