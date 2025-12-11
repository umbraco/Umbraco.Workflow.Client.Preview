import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  CalendarConfig,
  CalendarItem,
  CalendarItemVersion,
  WorkflowContentCalendarContextBase,
} from "@umbraco-workflow/calendar";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../workspace/index.js";
import {
  ReleaseSetDetailResponseModel,
  ReleaseSetItemResponseModel,
} from "@umbraco-workflow/generated";
import { asDatetimeLocal } from "@umbraco-workflow/core";

export class WorkflowReleaseSetCalendarContext extends WorkflowContentCalendarContextBase {
  #workspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;
  #releaseSet?: Partial<ReleaseSetDetailResponseModel>;

  constructor(host: UmbControllerHost, config: CalendarConfig) {
    super(host, config);

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;
      this.#workspaceContext = context;
      this.#observeReleaseSetItems();
    });
  }

  isOutline(key?: string): boolean {
    if (!this.#releaseSet || !key) return false;
    return (
      (this.#releaseSet.releaseDate ?? "").localeCompare(key) <= 0 &&
      (this.#releaseSet.expireDate ?? "").localeCompare(key) >= 0
    );
  }

  async #observeReleaseSetItems() {
    if (!this.#workspaceContext) return;

    this.observe(this.#workspaceContext.items, async (items) => {
      this.items = await this.#mapToCalendarItem(items ?? []);
      this.setCurrentMonth();
    });

    this.observe(this.#workspaceContext?.data, (set) => {
      if (!set) return;

      const { start, end } = this.#getBoundaryDates(set);

      this.#releaseSet = {
        name: set?.name,
        releaseDate: this.configurationProvider.getKeyFromDate(start),
        expireDate: this.configurationProvider.getKeyFromDate(end),
        icon: set.icon,
      };

      this.updateOutline();
    });
  }

  #getBoundaryDates(set: ReleaseSetDetailResponseModel) {
    let start = set.releaseDate ?? asDatetimeLocal();
    let end = "";

    const versions = set.items.map((x) => x.items).flat();

    for (const version of versions) {
      const values = [version.releaseDate, version.expireDate].filter(
        (x) => x !== null && x !== undefined
      );

      for (const value of values) {
        if (!value) continue;

        if (!end || value.localeCompare(end) > 0) {
          end = value;
        }
        if (!start || value.localeCompare(start) < 0) {
          start = value;
        }
      }
    }

    // when no end date, neither the set nor any items have an end
    // therefore the set is published once only, with all items
    if (!end) {
      end = start;
    }

    return { start, end };
  }

  async #mapToCalendarItem(
    items: Array<ReleaseSetItemResponseModel>
  ): Promise<Array<CalendarItem>> {
    const versions = items?.map((x) => x.items).flat() ?? [];

    const releaseDate = this.#workspaceContext?.getData()?.releaseDate;
    const defaultReleaseDate = releaseDate ? new Date(releaseDate) : new Date();

    return (
      items?.map((item) => {
        const mapped: CalendarItem = {
          name: item.name,
          unique: item.unique,
          icon: item.icon,
          versions:
            versions
              .filter((x) => x.nodeUnique === item.unique)
              .map((x) => {
                const version: CalendarItemVersion = {
                  name: x.name,
                  unique: x.unique,
                  culture: x.culture,
                  fromDate: x.releaseDate
                    ? new Date(x.releaseDate)
                    : defaultReleaseDate,
                  toDate: x.expireDate ? new Date(x.expireDate) : undefined,
                };
                version.startKey = this.configurationProvider.getKeyFromDate(
                  version.fromDate
                );
                version.endKey = this.configurationProvider.getKeyFromDate(
                  version.toDate
                );
                return version;
              })
              .sort((a, b) => {
                if (!a.fromDate && !b.fromDate) return 0;
                if (!a.fromDate) return -1;
                if (!b.fromDate) return 1;

                return a.fromDate.getTime() - b.fromDate.getTime();
              }) ?? [],
        };

        mapped.fromDate = mapped.versions?.at(0)?.fromDate;

        const lastVersion = mapped.versions?.at(mapped.versions.length - 1);
        mapped.toDate = lastVersion?.toDate ?? lastVersion?.fromDate;

        return mapped;
      }) ?? []
    );
  }
}
