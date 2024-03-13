/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PagedUserGroupBaseModel } from '../models/PagedUserGroupBaseModel';
import type { PagedUserGroupModel } from '../models/PagedUserGroupModel';
import type { User2UserGroupModel } from '../models/User2UserGroupModel';
import type { UserGroupModel } from '../models/UserGroupModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ApprovalGroupResource {

    /**
     * @returns string Created
     * @throws ApiError
     */
    public static postApprovalGroup({
requestBody,
}: {
requestBody?: UserGroupModel,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/workflow/api/approval-group',
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Umb-Notifications',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns PagedUserGroupModel Success
     * @throws ApiError
     */
    public static getApprovalGroup({
skip,
take = 5,
filter = '',
}: {
skip?: number,
take?: number,
filter?: string,
}): CancelablePromise<PagedUserGroupModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/approval-group',
            query: {
                'skip': skip,
                'take': take,
                'filter': filter,
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
    public static getApprovalGroupById({
id,
}: {
id: string,
}): CancelablePromise<UserGroupModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/approval-group/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static deleteApprovalGroupById({
id,
}: {
id: string,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/umbraco/workflow/api/approval-group/{id}',
            path: {
                'id': id,
            },
            responseHeader: 'Umb-Notifications',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static putApprovalGroupById({
id,
requestBody,
}: {
id: string,
requestBody?: UserGroupModel,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/workflow/api/approval-group/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Umb-Notifications',
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
    public static getApprovalGroupInheritedMembers({
ids,
}: {
ids?: string,
}): CancelablePromise<Array<User2UserGroupModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/approval-group/inherited-members',
            query: {
                'ids': ids,
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
    public static getApprovalGroupScaffold(): CancelablePromise<UserGroupModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/approval-group/scaffold',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns PagedUserGroupBaseModel Success
     * @throws ApiError
     */
    public static getApprovalGroupSlim({
skip,
take = 5,
filter = '',
}: {
skip?: number,
take?: number,
filter?: string,
}): CancelablePromise<PagedUserGroupBaseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/approval-group/slim',
            query: {
                'skip': skip,
                'take': take,
                'filter': filter,
            },
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

}
