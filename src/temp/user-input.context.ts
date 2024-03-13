import { UmbPickerInputContext } from '@umbraco-cms/backoffice/picker-input';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UserStateModel } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbPickerModalData } from '@umbraco-cms/backoffice/modal';
import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

/**
 * User picker and context are not exported in preview008 - this
 * is a temporary copy of the required pieces
 */

export const UMB_USER_ITEM_REPOSITORY_ALIAS = 'Umb.Repository.User.Item';
export const UMB_USER_ENTITY_TYPE = 'user';
export type UmbUserEntityType = typeof UMB_USER_ENTITY_TYPE;

export class UmbUserPickerContext extends UmbPickerInputContext<UmbUserDetailModel> {
	constructor(host: UmbControllerHost) {
		super(host, UMB_USER_ITEM_REPOSITORY_ALIAS, UMB_USER_PICKER_MODAL);
	}
}

export type UmbUserPickerModalData = UmbPickerModalData<UmbUserDetailModel>;

export interface UmbUserPickerModalValue {
	selection: Array<string | null>;
}

export const UMB_USER_PICKER_MODAL = new UmbModalToken<UmbUserPickerModalData, UmbUserPickerModalValue>(
	'Umb.Modal.User.Picker',
	{
		modal: {
			type: 'sidebar',
			size: 'small',
		},
	},
);

export type UmbUserStateEnum = UserStateModel;
export const UmbUserStateEnum = UserStateModel;

export interface UmbUserDetailModel {
	entityType: UmbUserEntityType;
	email: string;
	userName: string;
	name: string;
	userGroupUniques: Array<string>;
	unique: string;
	languageIsoCode: string | null;
	documentStartNodeUniques: Array<string>;
	mediaStartNodeUniques: Array<string>;
	avatarUrls: Array<string>;
	state: UmbUserStateEnum | null;
	failedLoginAttempts: number;
	createDate: string | null;
	updateDate: string | null;
	lastLoginDate: string | null;
	lastLockoutDate: string | null;
	lastPasswordChangeDate: string | null;
}