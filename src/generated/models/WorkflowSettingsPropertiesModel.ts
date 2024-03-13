/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GeneralSettingsModel } from './GeneralSettingsModel';
import type { LanguageModel } from './LanguageModel';
import type { NotificationsSettingsModel } from './NotificationsSettingsModel';

export type WorkflowSettingsPropertiesModel = {
    generalSettings: GeneralSettingsModel;
    notificationsSettings: NotificationsSettingsModel;
    availableLanguages: Array<LanguageModel>;
};
