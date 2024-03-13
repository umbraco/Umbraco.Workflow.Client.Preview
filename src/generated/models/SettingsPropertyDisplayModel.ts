/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConfigTypeModel } from './ConfigTypeModel';

export type SettingsPropertyDisplayModel = {
    alias: string;
    label: string;
    description: string;
    extendedDescription: string;
    editorUiAlias: string;
    value?: any;
    validation: any;
    config: Array<ConfigTypeModel>;
    hideLabel: boolean;
    readonly: boolean;
    hidden: boolean;
    requiresLicense: boolean;
};
