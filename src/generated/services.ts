import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { ActionData, AdvancedSearchData, ApprovalGroupData, ChartData, ConfigData, ContentReviewData, ContentData, EmailTemplateData, GlobalVariablesData, HistoryCleanupData, InstanceData, LicenseData, ScaffoldData, SettingsData, TaskData } from './models';

export class ActionService {

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static postActionApprove(data: ActionData['payloads']['PostActionApprove'] = {}): CancelablePromise<ActionData['responses']['PostActionApprove']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/umbraco/workflow/api/v1/action/approve',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static postActionCancel(data: ActionData['payloads']['PostActionCancel'] = {}): CancelablePromise<ActionData['responses']['PostActionCancel']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/umbraco/workflow/api/v1/action/cancel',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static postActionInitiate(data: ActionData['payloads']['PostActionInitiate'] = {}): CancelablePromise<ActionData['responses']['PostActionInitiate']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/umbraco/workflow/api/v1/action/initiate',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static postActionReject(data: ActionData['payloads']['PostActionReject'] = {}): CancelablePromise<ActionData['responses']['PostActionReject']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/umbraco/workflow/api/v1/action/reject',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static postActionResubmit(data: ActionData['payloads']['PostActionResubmit'] = {}): CancelablePromise<ActionData['responses']['PostActionResubmit']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/umbraco/workflow/api/v1/action/resubmit',
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

export class AdvancedSearchService {

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getAdvancedSearchContentTypes(): CancelablePromise<AdvancedSearchData['responses']['GetAdvancedSearchContentTypes']> {
		
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/advanced-search/content-types',
			errors: {
				401: `The resource is protected and requires an authentication token`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static postAdvancedSearchSearch(data: AdvancedSearchData['payloads']['PostAdvancedSearchSearch'] = {}): CancelablePromise<AdvancedSearchData['responses']['PostAdvancedSearchSearch']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/umbraco/workflow/api/v1/advanced-search/search',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `The resource is protected and requires an authentication token`,
			},
		});
	}

}

export class ApprovalGroupService {

	/**
	 * @returns string Created
	 * @throws ApiError
	 */
	public static postApprovalGroup(data: ApprovalGroupData['payloads']['PostApprovalGroup'] = {}): CancelablePromise<ApprovalGroupData['responses']['PostApprovalGroup']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/umbraco/workflow/api/v1/approval-group',
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
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getApprovalGroup(data: ApprovalGroupData['payloads']['GetApprovalGroup'] = {}): CancelablePromise<ApprovalGroupData['responses']['GetApprovalGroup']> {
		const {
                    
                    skip,
take,
filter
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/approval-group',
			query: {
				skip, take, filter
			},
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getApprovalGroupById(data: ApprovalGroupData['payloads']['GetApprovalGroupById']): CancelablePromise<ApprovalGroupData['responses']['GetApprovalGroupById']> {
		const {
                    
                    id
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/approval-group/{id}',
			path: {
				id
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
	public static deleteApprovalGroupById(data: ApprovalGroupData['payloads']['DeleteApprovalGroupById']): CancelablePromise<ApprovalGroupData['responses']['DeleteApprovalGroupById']> {
		const {
                    
                    id
                } = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/umbraco/workflow/api/v1/approval-group/{id}',
			path: {
				id
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
	public static putApprovalGroupById(data: ApprovalGroupData['payloads']['PutApprovalGroupById']): CancelablePromise<ApprovalGroupData['responses']['PutApprovalGroupById']> {
		const {
                    
                    id,
requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/umbraco/workflow/api/v1/approval-group/{id}',
			path: {
				id
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
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getApprovalGroupInheritedMembers(data: ApprovalGroupData['payloads']['GetApprovalGroupInheritedMembers'] = {}): CancelablePromise<ApprovalGroupData['responses']['GetApprovalGroupInheritedMembers']> {
		const {
                    
                    ids
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/approval-group/inherited-members',
			query: {
				ids
			},
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getApprovalGroupScaffold(): CancelablePromise<ApprovalGroupData['responses']['GetApprovalGroupScaffold']> {
		
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/approval-group/scaffold',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getApprovalGroupSlim(data: ApprovalGroupData['payloads']['GetApprovalGroupSlim'] = {}): CancelablePromise<ApprovalGroupData['responses']['GetApprovalGroupSlim']> {
		const {
                    
                    skip,
take,
filter
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/approval-group/slim',
			query: {
				skip, take, filter
			},
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

}

export class ChartService {

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getChartContentReviewChart(data: ChartData['payloads']['GetChartContentReviewChart'] = {}): CancelablePromise<ChartData['responses']['GetChartContentReviewChart']> {
		const {
                    
                    range
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/chart/content-review-chart',
			query: {
				range
			},
			errors: {
				401: `The resource is protected and requires an authentication token`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getChartWorkflowChart(data: ChartData['payloads']['GetChartWorkflowChart'] = {}): CancelablePromise<ChartData['responses']['GetChartWorkflowChart']> {
		const {
                    
                    range,
groupId
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/chart/workflow-chart',
			query: {
				range, groupId
			},
			errors: {
				401: `The resource is protected and requires an authentication token`,
			},
		});
	}

}

export class ConfigService {

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getConfig(data: ConfigData['payloads']['GetConfig'] = {}): CancelablePromise<ConfigData['responses']['GetConfig']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
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

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static putConfig(data: ConfigData['payloads']['PutConfig'] = {}): CancelablePromise<ConfigData['responses']['PutConfig']> {
		const {
                    
                    requestBody
                } = data;
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

export class ContentReviewService {

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getContentReviewCheck(data: ContentReviewData['payloads']['GetContentReviewCheck'] = {}): CancelablePromise<ContentReviewData['responses']['GetContentReviewCheck']> {
		const {
                    
                    nodeId,
nodeKey,
contentTypeId,
variant
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/content-review/check',
			query: {
				NodeId: nodeId, NodeKey: nodeKey, ContentTypeId: contentTypeId, Variant: variant
			},
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getContentReviewConfig(): CancelablePromise<ContentReviewData['responses']['GetContentReviewConfig']> {
		
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/content-review/config',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static putContentReviewConfig(data: ContentReviewData['payloads']['PutContentReviewConfig'] = {}): CancelablePromise<ContentReviewData['responses']['PutContentReviewConfig']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/umbraco/workflow/api/v1/content-review/config',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static postContentReviewNodes(data: ContentReviewData['payloads']['PostContentReviewNodes'] = {}): CancelablePromise<ContentReviewData['responses']['PostContentReviewNodes']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/umbraco/workflow/api/v1/content-review/nodes',
			body: requestBody,
			mediaType: 'application/json',
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
	public static putContentReviewReview(data: ContentReviewData['payloads']['PutContentReviewReview'] = {}): CancelablePromise<ContentReviewData['responses']['PutContentReviewReview']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/umbraco/workflow/api/v1/content-review/review',
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
	public static getContentReviewSeed(): CancelablePromise<ContentReviewData['responses']['GetContentReviewSeed']> {
		
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/content-review/seed',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

}

export class ContentService {

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getContentContentSlim(data: ContentData['payloads']['GetContentContentSlim'] = {}): CancelablePromise<ContentData['responses']['GetContentContentSlim']> {
		const {
                    
                    ids
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/content/content-slim',
			query: {
				ids
			},
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getContentContentTypes(): CancelablePromise<ContentData['responses']['GetContentContentTypes']> {
		
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/content/content-types',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

}

export class EmailTemplateService {

	/**
	 * @returns string Success
	 * @throws ApiError
	 */
	public static getEmailTemplateInstall(): CancelablePromise<EmailTemplateData['responses']['GetEmailTemplateInstall']> {
		
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/email-template/install',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

}

export class GlobalVariablesService {

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getGlobal(): CancelablePromise<GlobalVariablesData['responses']['GetGlobal']> {
		
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/global',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

}

export class HistoryCleanupService {

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getHistoryCleanup(data: HistoryCleanupData['payloads']['GetHistoryCleanup'] = {}): CancelablePromise<HistoryCleanupData['responses']['GetHistoryCleanup']> {
		const {
                    
                    uniqueId,
contentTypeId
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/history-cleanup',
			query: {
				uniqueId, contentTypeId
			},
			errors: {
				401: `The resource is protected and requires an authentication token`,
			},
		});
	}

	/**
	 * @returns string Success
	 * @throws ApiError
	 */
	public static putHistoryCleanup(data: HistoryCleanupData['payloads']['PutHistoryCleanup'] = {}): CancelablePromise<HistoryCleanupData['responses']['PutHistoryCleanup']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/umbraco/workflow/api/v1/history-cleanup',
			body: requestBody,
			mediaType: 'application/json',
			responseHeader: 'Umb-Notifications',
			errors: {
				401: `The resource is protected and requires an authentication token`,
			},
		});
	}

}

export class InstanceService {

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static postInstanceActive(data: InstanceData['payloads']['PostInstanceActive'] = {}): CancelablePromise<InstanceData['responses']['PostInstanceActive']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/umbraco/workflow/api/v1/instance/active',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static postInstanceAll(data: InstanceData['payloads']['PostInstanceAll'] = {}): CancelablePromise<InstanceData['responses']['PostInstanceAll']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/umbraco/workflow/api/v1/instance/all',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static postInstanceAssignedTo(data: InstanceData['payloads']['PostInstanceAssignedTo'] = {}): CancelablePromise<InstanceData['responses']['PostInstanceAssignedTo']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/umbraco/workflow/api/v1/instance/assigned-to',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getInstanceDiff(data: InstanceData['payloads']['GetInstanceDiff'] = {}): CancelablePromise<InstanceData['responses']['GetInstanceDiff']> {
		const {
                    
                    guid
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/instance/diff',
			query: {
				guid
			},
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static postInstanceInitiatedBy(data: InstanceData['payloads']['PostInstanceInitiatedBy'] = {}): CancelablePromise<InstanceData['responses']['PostInstanceInitiatedBy']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/umbraco/workflow/api/v1/instance/initiated-by',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getInstanceRange(data: InstanceData['payloads']['GetInstanceRange'] = {}): CancelablePromise<InstanceData['responses']['GetInstanceRange']> {
		const {
                    
                    days
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/instance/range',
			query: {
				days
			},
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns boolean Success
	 * @throws ApiError
	 */
	public static getInstanceStatus(data: InstanceData['payloads']['GetInstanceStatus'] = {}): CancelablePromise<InstanceData['responses']['GetInstanceStatus']> {
		const {
                    
                    ids
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/instance/status',
			query: {
				ids
			},
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

}

export class LicenseService {

	/**
	 * @returns any Success
	 * @throws ApiError
	 */
	public static getLicense(): CancelablePromise<LicenseData['responses']['GetLicense']> {
		
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/license',
			errors: {
				401: `The resource is protected and requires an authentication token`,
			},
		});
	}

}

export class ScaffoldService {

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getScaffold(data: ScaffoldData['payloads']['GetScaffold'] = {}): CancelablePromise<ScaffoldData['responses']['GetScaffold']> {
		const {
                    
                    nodeId,
nodeKey,
contentTypeId,
contentTypeKey,
path,
variant
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/scaffold',
			query: {
				NodeId: nodeId, NodeKey: nodeKey, ContentTypeId: contentTypeId, ContentTypeKey: contentTypeKey, Path: path, Variant: variant
			},
			errors: {
				401: `The resource is protected and requires an authentication token`,
			},
		});
	}

}

export class SettingsService {

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getSettings(): CancelablePromise<SettingsData['responses']['GetSettings']> {
		
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/settings',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static putSettings(data: SettingsData['payloads']['PutSettings'] = {}): CancelablePromise<SettingsData['responses']['PutSettings']> {
		const {
                    
                    requestBody
                } = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/umbraco/workflow/api/v1/settings',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getSettingsVersion(): CancelablePromise<SettingsData['responses']['GetSettingsVersion']> {
		
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/settings/version',
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

}

export class TaskService {

	/**
	 * @returns unknown Success
	 * @throws ApiError
	 */
	public static getTaskById(data: TaskData['payloads']['GetTaskById']): CancelablePromise<TaskData['responses']['GetTaskById']> {
		const {
                    
                    id
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/task/{id}',
			path: {
				id
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
	public static getTaskActiveVariantsById(data: TaskData['payloads']['GetTaskActiveVariantsById']): CancelablePromise<TaskData['responses']['GetTaskActiveVariantsById']> {
		const {
                    
                    id
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/workflow/api/v1/task/active-variants/{id}',
			path: {
				id
			},
			errors: {
				400: `Bad Request`,
				401: `The resource is protected and requires an authentication token`,
				500: `Server Error`,
			},
		});
	}

}