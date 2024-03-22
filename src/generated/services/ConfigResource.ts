/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NodePermissionsResponseModel } from '../models/NodePermissionsResponseModel';
import type { WorkflowConfigResponseModel } from '../models/WorkflowConfigResponseModel';
import type { WorkflowConfigUpdateRequestModel } from '../models/WorkflowConfigUpdateRequestModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ConfigResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getConfig({
nodeId,
contentTypeId,
variant,
}: {
nodeId?: number,
contentTypeId?: number,
variant?: string,
}): CancelablePromise<NodePermissionsResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/v1/config',
            query: {
                'NodeId': nodeId,
                'ContentTypeId': contentTypeId,
                'Variant': variant,
            },
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putConfig({
requestBody,
}: {
requestBody?: (WorkflowConfigUpdateRequestModel | WorkflowConfigResponseModel),
}): CancelablePromise<WorkflowConfigResponseModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/workflow/api/v1/config',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

}
