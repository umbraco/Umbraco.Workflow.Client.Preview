export type SettingsSectionType = "generalSettings" | "notificationsSettings";

export type SettingsAliasType =
  | "documentTypeApprovalFlows"
  | "excludeNodes"
  | "newNodeApprovalFlow"
  | "emailTemplates";

export type ExtendedWorkflowEmailConfigModel = {
  sendTo: string;
  name: string;
  to: Array<number>;
  key: string;
};
