import {
  WORKFLOW_USER_PERMISSION_RELEASESET_CREATE,
  WORKFLOW_USER_PERMISSION_RELEASESET_READ,
  WORKFLOW_USER_PERMISSION_RELEASESET_DELETE,
  WORKFLOW_USER_PERMISSION_RELEASESET_UPDATE,
  WORKFLOW_USER_PERMISSION_RELEASESET_PUBLISH,
} from "./constants";

const data = [
  { action: "Create", verbs: WORKFLOW_USER_PERMISSION_RELEASESET_CREATE },
  { action: "Read", verbs: WORKFLOW_USER_PERMISSION_RELEASESET_READ },
  { action: "Update", verbs: WORKFLOW_USER_PERMISSION_RELEASESET_UPDATE },
  { action: "Delete", verbs: WORKFLOW_USER_PERMISSION_RELEASESET_DELETE },
  { action: "Publish", verbs: WORKFLOW_USER_PERMISSION_RELEASESET_PUBLISH },
].map(({ action, verbs }) => ({
  type: "entityUserPermission",
  alias: `Workflow.EntityUserPermission.ReleaseSet.${action}`,
  name: `Workflow Release Set ${action} User Permission`,
  forEntityTypes: ["workflow"],
  weight: 100,
  meta: {
    verbs: [verbs],
    label: `#actions_${action.toLowerCase()}`,
    description: `#workflow_permissions_releaseSet${action}`,
    group: "Release Set",
  },
}));

export const manifests = data;
