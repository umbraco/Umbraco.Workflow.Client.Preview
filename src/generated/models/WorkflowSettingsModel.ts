/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowEmailConfigModel } from './WorkflowEmailConfigModel';
import type { WorkflowSettingsBaseModel } from './WorkflowSettingsBaseModel';

export type WorkflowSettingsModel = (WorkflowSettingsBaseModel & {
email?: string | null;
editUrl?: string | null;
siteUrl?: string | null;
sendNotifications: boolean;
excludeNodes?: string | null;
reminderDelay: number;
extendPermissions: boolean;
rejectionResetsApprovals: boolean;
emailConfig: Array<WorkflowEmailConfigModel>;
emailToOptions?: Record<string, number | null> | null;
currentUserLocale?: string | null;
});
