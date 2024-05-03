import type { UmbCollectionConfiguration } from "@umbraco-cms/backoffice/collection";
import type { FilterModel } from '@umbraco-workflow/generated';

export interface SettingsStatusModel {
  someDisabled: boolean;
  allDisabled: boolean;
  allHidden: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FilterModelBase {
  nodeId?: string;
  keys?: string;
  values?: string;
  count?: number;
  changed?: boolean;
}

// TODO => types
export interface WorkflowInstancesFilterModel extends FilterModelBase {
  status?: Array<any>;
  variant?: string;
  type?: string;
  user?: any;
  createdFrom?: string;
  createdTo?: string;
  completedFrom?: Date;
  completedTo?: Date;
  groupId?: number;
}

export interface ContentReviewsFilterModel extends FilterModelBase {
  nextReviewFrom?: Date;
  nextReviewTo?: Date;
  lastReviewFrom?: Date;
  lastReviewTo?: Date;
  groupId?: number;
  expired?: boolean;
}

export interface TableQueryModel extends UmbCollectionConfiguration {
  handler: (o: object) => any;
  filters?: FilterModel;
  count?: number;
  page?: number;
  hiddenColumns?: Array<string>;
  direction?: "up" | "down";
  meta?: Record<string, any>;
}
