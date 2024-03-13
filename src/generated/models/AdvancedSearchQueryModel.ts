/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AdvancedSearchTypeModel } from './AdvancedSearchTypeModel';

export type AdvancedSearchQueryModel = {
    contentTypes?: Array<string> | null;
    cultures?: Array<string> | null;
    fields: Record<string, any>;
    baseFields: Record<string, any>;
    category: string;
    searchType: AdvancedSearchTypeModel;
    take: number;
    skip: number;
    fuzzy: boolean;
};
