/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkflowScaffoldResponseModel } from '../models/WorkflowScaffoldResponseModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ScaffoldResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getScaffold({
nodeId,
nodeKey,
contentTypeId,
contentTypeKey,
path,
variant,
}: {
nodeId?: number,
nodeKey?: string,
contentTypeId?: number,
contentTypeKey?: string,
path?: string,
variant?: string,
}): CancelablePromise<WorkflowScaffoldResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/v1/scaffold',
            query: {
                'NodeId': nodeId,
                'NodeKey': nodeKey,
                'ContentTypeId': contentTypeId,
                'ContentTypeKey': contentTypeKey,
                'Path': path,
                'Variant': variant,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

}
