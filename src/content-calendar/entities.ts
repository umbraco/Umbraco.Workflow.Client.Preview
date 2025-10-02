import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import { WorkflowContentCalendarDayDetailModalData } from "./modal";

export interface CalendarItem {
  name: string;
  fromDate?: Date;
  toDate?: Date;
  unique: string;
  nodeUnique?: string | null;
  action?: string;
  type?: string;
  stack?: number;
  startKey?: string;
  endKey?: string;
  singleDay?: boolean;
  state?: CalendarItemState;
  startsThisMonth?: boolean;
  endsThisMonth?: boolean;
  concurrentCount?: number;
  versions?: Array<CalendarItemVersion>;
  icon?: string | null | undefined;
}

export interface CalendarItemVersion {
  name: string;
  fromDate?: Date;
  toDate?: Date;
  unique: string;
  startKey?: string;
  endKey?: string;
  culture?: string | null;
}

export interface CalendarDay {
    display: number;
    isAffix: boolean;
    items: Array<CalendarItem>;
}

export type CalendarView = "Week" | "Month";

export enum CalendarViewValues {
  Week = "week",
  Month = "month",
}

export type CalendarItemState = "start" | "active" | "continues" | "end";

export interface CalendarLegendItem {
  key: string;
  type: string;
}

export interface CalendarConfig {
  hideLegend?: boolean;
  detailModalToken?: UmbModalToken<WorkflowContentCalendarDayDetailModalData, any>;
}

export interface CalendarItemCultureDetail {
  current?: string;
  pending?: string;
  currentUnique?: string;
  pendingUnique?: string;
  publishTime?: string | null;
  variant?: string | null;
}

export interface CalendarItemDetail {
  documentName: string;
  documentDetail?: string;
  versions?: Record<string, Array<CalendarItemCultureDetail>>;
}
