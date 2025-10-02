// No read or publish permissions for alternate versions.
// If the user can not read the document, they can not access the alternate versions to read.
// Alt versions are not published, so no publish permission is needed.

// TODO => consider how these permissions interact with release sets - if no update/create permission,
// the release set should not allow creating alternate versions.

export const WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_CREATE = "Workflow.AlternateVersion.Create";
export const WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_UPDATE = "Workflow.AlternateVersion.Update";
export const WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_DELETE = "Workflow.AlternateVersion.Delete";
export const WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_PROMOTE = "Workflow.AlternateVersion.Promote";
