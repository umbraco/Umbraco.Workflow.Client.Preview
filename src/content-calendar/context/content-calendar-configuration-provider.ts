import { CalendarViewValues } from '../entities.js';

export class ContentCalendarConfigurationProvider {
  current: Date;
  daysOfWeek: Array<string> = [];
  months: Array<string> = [];
  today: {
    date: number;
    month: number;
    year: number;
  };

  constructor() {
    this.current = new Date();

    this.today = {
      date: this.current.getDate(),
      month: this.current.getMonth(),
      year: this.current.getFullYear(),
    };

    this.daysOfWeek = this.#getLocalizedDays();
    this.months = this.#getLocalizedMonths();
  }

  setCurrent(date: Date) {
    this.current = date;
  }

  shiftCurrentMonth(value: number) {
    this.current.setMonth(this.current.getMonth() + value);
  }

  shiftCurrentDate(value: number) {
    this.current.setDate(this.current.getDate() + value);
  }

  getDateString(view: string, dayKeys: Array<string>) {
    if (!dayKeys.length) return;
    
    const year = this.current.getFullYear();
    const month = this.current.getMonth();

    if (view === CalendarViewValues.Week) {
      return `${this.months[month]} ${year}`;
    }

    const startMonth = dayKeys[0].substring(0, 6);
    const endMonth = dayKeys[7].substring(0, 6);

    if (startMonth === endMonth) {
      return `${this.months[month]} ${year}`;
    }

    const currentKey = this.getKey({ year, month, date: 0 }).substring(0, 6);

    if (endMonth > currentKey) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? ` ${year + 1}` : ` ${year}`;
      const thisYear = month === 11 ? ` ${year}` : "";

      return `${this.months[month]}${thisYear} - ${this.months[nextMonth]}${nextYear}`;
    }

    return `${this.months[month]} ${year}`;
  }

  getCurrentValues() {
    return {
      year: this.current.getFullYear(),
      month: this.current.getMonth(),
      date: this.current.getDate(),
    };
  }

  getLocalizedCurrentDate() {
    return this.current.toLocaleDateString("default", {
      month: "long",
      year: "numeric",
    });
  }

  getTodayKey() {
    return this.getKey({
      year: this.today.year,
      month: this.today.month,
      date: this.today.date,
    });
  }

  getCurrentKey() {
    return this.getKey({
      year: this.current.getFullYear(),
      month: this.current.getMonth(),
      date: this.current.getDate(),
    });
  }

  getKeyFromDate(date?: Date | string) {
    if (!date) return undefined;

    const value = typeof date === "string" ? new Date(date) : date;

    return this.getKey({
      year: value.getFullYear(),
      month: value.getMonth(),
      date: value.getDate(),
    });
  }

  getKey(arg: { year: number; month: number; date: number }) {
    return `${arg.year}${this.#leadingZero(arg.month)}${this.#leadingZero(
      arg.date
    )}`;
  }

  getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  getMonthStartsOn(month: number, year: number) {
    return new Date(year, month, 1).getDay();
  }

  equals(a?: Date, b?: Date) {
    if (!a || !b) return false;

    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  #leadingZero(x: number) {
    return String(x).padStart(2, "0");
  }

  #getLocalizedDays(
    localeName = "en-US",
    weekday: "short" | "long" | "narrow" = "short"
  ) {
    return this.#getLocalizedCalendarArray(
      localeName,
      7,
      (day) => new Date().getTime() - (this.current.getDay() - day) * 86400000,
      { weekday }
    );
  }

  #getLocalizedMonths(
    localeName = "en-US",
    month: "short" | "long" | "narrow" = "long"
  ) {
    return this.#getLocalizedCalendarArray(
      localeName,
      12,
      (month) => new Date().setMonth(0 + month),
      { month }
    );
  }

  #getLocalizedCalendarArray(
    localeName: string,
    count: 7 | 12,
    map: (x: number) => number,
    args?: Intl.DateTimeFormatOptions
  ) {
    const { format } = new Intl.DateTimeFormat(localeName, args);
    return [...Array(count)].map((_, i) => format(map(i)));
  }
}
