/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentReviewsDetailedConfigModel } from './ContentReviewsDetailedConfigModel';

export type ContentReviewsNodeQueryResponseModel = {
    nodeKey: string;
    userKey: string;
    variant: string;
    config?: ContentReviewsDetailedConfigModel | null;
    currentUserShouldReview: boolean;
};
