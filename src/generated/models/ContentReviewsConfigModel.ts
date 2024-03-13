/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentReviewsSettingsModel } from './ContentReviewsSettingsModel';
import type { ContentTypePropertyModel } from './ContentTypePropertyModel';
import type { LanguageModel } from './LanguageModel';

export type ContentReviewsConfigModel = {
    contentTypes: Array<ContentTypePropertyModel>;
    settings: ContentReviewsSettingsModel;
    availableLanguages: Array<LanguageModel>;
};
