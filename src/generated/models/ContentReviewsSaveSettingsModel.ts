/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentReviewsDetailedConfigModel } from './ContentReviewsDetailedConfigModel';
import type { ContentReviewsSettingsModel } from './ContentReviewsSettingsModel';

export type ContentReviewsSaveSettingsModel = {
    config: Array<ContentReviewsDetailedConfigModel>;
    settings: ContentReviewsSettingsModel;
    delete: Array<number>;
    regenerate: boolean;
};
