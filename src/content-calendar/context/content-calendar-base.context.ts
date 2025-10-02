import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  UmbArrayState,
  UmbObjectState,
  UmbStringState,
} from "@umbraco-cms/backoffice/observable-api";
import {
  CalendarViewValues,
  type CalendarConfig,
  type CalendarItemState,
  type CalendarItem,
  type CalendarDay,
  type CalendarLegendItem,
} from "../entities.js";
import { ContentCalendarConfigurationProvider } from "./content-calendar-configuration-provider.js";
import {
  WORKFLOW_CONTENT_CALENDAR_DAY_DETAIL_MODAL,
  WorkflowContentCalendarDayDetailModalData,
} from "../modal/index.js";
import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import { BehaviorSubject } from "@umbraco-cms/backoffice/external/rxjs";
import { WORKFLOW_CONTENT_CALENDAR_CONTEXT } from "./content-calendar-context.token.js";

export abstract class WorkflowContentCalendarContextBase extends UmbControllerBase {
  private readonly MAX_DAYS = 42;

  protected get dayKeys() {
    return Object.keys(this.days.getValue());
  }

  public detailModalContext: UmbModalToken<
    WorkflowContentCalendarDayDetailModalData,
    unknown
  >;

  protected items: Array<CalendarItem> = [];

  protected days = new UmbObjectState<Record<string, CalendarDay>>({});
  days$ = this.days.asObservable();

  protected legend = new UmbArrayState<CalendarLegendItem>([], (x) => x.key);
  legend$ = this.legend.asObservable();

  protected currentView = new UmbStringState(CalendarViewValues.Month);
  currentView$ = this.currentView.asObservable();

  protected currentDate = new UmbStringState("");
  currentDate$ = this.currentDate.asObservable();

  protected configurationProvider = new ContentCalendarConfigurationProvider();
  public daysOfWeek = this.configurationProvider.daysOfWeek;

  updateOutline$ = new BehaviorSubject<boolean>(false);

  public config: CalendarConfig;

  abstract isOutline(key?: string): boolean;

  constructor(host: UmbControllerHost, config: CalendarConfig) {
    super(host);
    this.provideContext(WORKFLOW_CONTENT_CALENDAR_CONTEXT, this);

    this.config = config;

    this.currentDate.setValue(
      this.configurationProvider.getLocalizedCurrentDate()
    );

    this.detailModalContext =
      this.config.detailModalToken ?? WORKFLOW_CONTENT_CALENDAR_DAY_DETAIL_MODAL;
  }

  hostConnected(): void {
    super.hostConnected();

    this.observe(this.days$, (days) => {
      if (!days) return;

      const dateString = this.configurationProvider.getDateString(
        this.currentView.getValue(),
        this.dayKeys
      );

      if (!dateString) return;

      this.currentDate.setValue(dateString);
    });
  }
  
  // group versions by nodeUnique
  protected groupItems(items: Array<CalendarItem>): Array<CalendarItem> {
    return items?.map((item) => {
      const versions = items.filter((x) => x.nodeUnique === item.nodeUnique);
      item.versions = versions.map((v) => ({
        name: v.name,
        unique: v.unique,
        fromDate: v.fromDate,
      }));

      return item;
    });
  }

  isToday(key?: string) {
    return key === this.configurationProvider.getTodayKey();
  }

  updateOutline() {
    this.updateOutline$.next(true);
  }

  toggleView() {
    const currentView = this.currentView.getValue();
    this.currentView.setValue(
      currentView === CalendarViewValues.Month
        ? CalendarViewValues.Week
        : CalendarViewValues.Month
    );

    this.setCurrentMonth();

    if (this.currentView.getValue() === CalendarViewValues.Week) {
      this.configurationProvider.current.setDate(
        this.configurationProvider.current.getMonth() !==
          this.configurationProvider.today.month
          ? 1
          : this.configurationProvider.today.date
      );

      this.#setCurrentWeek();
    }
  }

  goTo(action: 1 | -1) {
    if (this.currentView.getValue() === CalendarViewValues.Month) {
      this.configurationProvider.shiftCurrentMonth(action);
    } else {
      this.configurationProvider.shiftCurrentDate(action * 7);
      this.#setCurrentWeek();
    }

    this.setCurrentMonth();
  }

  goToToday() {
    this.configurationProvider.setCurrent(new Date());
    this.currentView.setValue(CalendarViewValues.Month);
    this.setCurrentMonth();
  }

  protected setCurrentMonth() {
    const currentMonth = this.configurationProvider.current.getMonth();
    const currentYear = this.configurationProvider.current.getFullYear();
    const daysInMonth = this.configurationProvider.getDaysInMonth(
      currentMonth,
      currentYear
    );

    const days = {};

    [...Array(daysInMonth).keys()].forEach(
      (x) =>
        (days[
          this.configurationProvider.getKey({
            year: currentYear,
            month: currentMonth,
            date: x + 1,
          })
        ] = {
          display: x + 1,
          isAffix: false,
          items: [],
        })
    );

    this.#setAffix(currentMonth, currentYear, days);
    this.#setItemsForView();
  }

  #setItemsForView() {
    if (!this.items.length) return;

    const days = { ...this.days.getValue() };
    const dayKeys = Object.keys(days);
    const firstDayKey = dayKeys.at(0)!;
    const lastDayKey = dayKeys.at(-1)!;

    const validItems = structuredClone(this.items).filter((x) => {
      x.startKey =
        x.startKey ?? this.configurationProvider.getKeyFromDate(x.fromDate);
      x.endKey =
        x.endKey ?? this.configurationProvider.getKeyFromDate(x.toDate);

      if (!x.startKey || !x.endKey) return;

      const startsThisMonth =
        x.startKey < lastDayKey && x.startKey >= firstDayKey;

      const endsThisMonth = firstDayKey < x.endKey && x.endKey <= lastDayKey;

      x.concurrentCount = 0;
      x.singleDay = this.configurationProvider.equals(x.toDate, x.fromDate);
      x.endsThisMonth = endsThisMonth;
      x.startsThisMonth = startsThisMonth;

      return (
        (x.startKey < lastDayKey && x.endKey > lastDayKey) ||
        startsThisMonth ||
        endsThisMonth
      );
    });

    validItems
      .sort((a, b) => b.endKey!.localeCompare(a.endKey!))
      .forEach((x) => {
        if (!x.startKey || !x.endKey) {
          return;
        }

        // if the event continues from a previous month and is not
        // visible in the prefixed days, it is marked as continuing
        let startDay = days[x.startKey];
        let initialState: CalendarItemState = "start";

        if (!startDay) {
          initialState = "continues";
          startDay = days[firstDayKey];
          x.startKey = firstDayKey;
        }

        // if this item overlaps entirely with an existing item, don't add it
        const overlappedItem = startDay.items.find(
          (y) => x.startKey === y.startKey && x.endKey === y.endKey
        );

        if (overlappedItem) {
          overlappedItem.concurrentCount! += 1;
          return;
        }

        // stack is used to offset items in display, up to max of 3
        x.stack = startDay.items.length;
        x.state = initialState;

        days[x.startKey] = {
          ...days[x.startKey],
          ...{ items: [...startDay.items, x] },
        };

        // if the event is single-day, there's no active or end state required
        if (x.singleDay) {
          return;
        }

        // calculate the range for multi-day events
        let startDayIndex = dayKeys.indexOf(x.startKey);
        startDayIndex = startDayIndex === -1 ? 0 : startDayIndex;
        let endDayIndex = dayKeys.indexOf(x.endKey);
        endDayIndex = endDayIndex === -1 ? dayKeys.length : endDayIndex;

        const addItem = (key, item, state: "active" | "end") => {
          item = { ...item, ...{ state } };
          days[key] = {
            ...days[key],
            ...{ items: [...(days[key]?.items ?? []), item] },
          };
        };

        for (let i = startDayIndex + 1; i < endDayIndex; i += 1) {
          addItem(dayKeys[i], x, "active");
        }

        if (dayKeys.indexOf(x.endKey) !== -1) {
          addItem(x.endKey, x, "end");
        }
      });

    this.days.update(days);
  }

  #setCurrentWeek() {
    // when not viewing the current month, changing to week view should
    // default to the first week of the active month. When viewing the
    // current month, default to the current week.
    const todayKey = this.configurationProvider.getCurrentKey();

    const firstDayIndex =
      this.dayKeys.indexOf(todayKey) -
      this.configurationProvider.current.getDay();

    const currentDays = this.days.getValue();
    const days = this.dayKeys
      .slice(firstDayIndex, firstDayIndex + 7)
      .reduce((acc, key) => {
        acc[key] = currentDays[key];
        return acc;
      }, {});

    this.days.setValue(days);
  }

  #setAffix(
    currentMonth: number,
    currentYear: number,
    days: Record<string, CalendarDay>
  ) {
    let prevMonth = currentMonth - 1;
    let prevMonthYear = currentYear;

    if (prevMonth < 0) {
      prevMonth = 11;
      prevMonthYear -= 1;
    }

    let nextMonth = currentMonth + 1;
    let nextMonthYear = currentYear;

    if (nextMonth > 11) {
      nextMonth = 0;
      nextMonthYear += 1;
    }

    const monthStartsOn = this.configurationProvider.getMonthStartsOn(
      currentMonth,
      currentYear
    );
    const daysInPrevMonth = this.configurationProvider.getDaysInMonth(
      prevMonth,
      prevMonthYear
    );

    const prefix = this.#getAffix(
      daysInPrevMonth,
      monthStartsOn,
      -monthStartsOn
    );

    const suffixLength =
      this.MAX_DAYS -
      prefix.length -
      this.configurationProvider.getDaysInMonth(currentMonth, currentYear);

    this.#getAffix(suffixLength, 7, 0, suffixLength).forEach((x) => {
      days[
        this.configurationProvider.getKey({
          year: nextMonthYear,
          month: nextMonth,
          date: x,
        })
      ] = {
        display: x,
        isAffix: true,
        items: [],
      };
    });

    const affixedDays = Object.assign(
      prefix.reverse().reduce(
        (acc, curr) => (
          (acc[
            this.configurationProvider.getKey({
              year: prevMonthYear,
              month: prevMonth,
              date: curr,
            })
          ] = {
            display: curr,
            isAffix: true,
            items: [],
          }),
          acc
        ),
        {}
      ),
      days
    );

    this.days.setValue(affixedDays);
  }

  #getAffix(count: number, zeroCase: number, from: number, to?: number) {
    return zeroCase === 0
      ? []
      : [...Array(count)].map((_, i) => i + 1).slice(from, to || count);
  }
}

export { WorkflowContentCalendarContextBase as api };
