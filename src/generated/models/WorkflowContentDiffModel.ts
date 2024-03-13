/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LanguageModel } from './LanguageModel';
import type { WorkflowDiffTabModel } from './WorkflowDiffTabModel';

export type WorkflowContentDiffModel = {
    name?: string | null;
    language: LanguageModel;
    tabs: Array<WorkflowDiffTabModel>;
};
