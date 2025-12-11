import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowContentCalendarContextBase } from "./content-calendar-base.context.js";
import { CalendarConfig, CalendarItem } from "../entities.js";
import {
  ContentService,
  ScheduledContentLegendItemResponseModel,
  ScheduledContentResponseModel,
} from "@umbraco-workflow/generated";
import { tryExecute } from "@umbraco-cms/backoffice/resources";

export class WorkflowContentCalendarContext extends WorkflowContentCalendarContextBase {
  constructor(host: UmbControllerHost, config: CalendarConfig) {
    super(host, config);
  }

  async hostConnected() {
    super.hostConnected();

    await this.#getItems();
    this.setCurrentMonth();
  }

  isOutline(key?: string): boolean {
    return false;
  }

  async #getItems() {
    const mapLegend = (
      items?: Array<ScheduledContentLegendItemResponseModel>
    ) =>
      items
        ?.filter((item) => item.key)
        .map((item) => ({
          key: item.key,
          type: item.type,
        })) ?? [];

    const { data } = await tryExecute(
      this,
      ContentService.getContentScheduled()
    );

    let items = this.#mapItems(data?.items);
    this.items = this.groupItems(items);

    this.legend.setValue(mapLegend(data?.legend));
  }

  #mapItems(items?: Array<ScheduledContentResponseModel>): Array<CalendarItem> {
    return (
      items?.map((item) => ({
        ...item,
        ...{
          name: item.name ?? "",
          fromDate: item.fromDate ? new Date(item.fromDate) : undefined,
          toDate: item.toDate ? new Date(item.toDate) : undefined,
          action: item.action ?? undefined,
          unique: item.unique,
        },
      })) ?? []
    );
  }
}
