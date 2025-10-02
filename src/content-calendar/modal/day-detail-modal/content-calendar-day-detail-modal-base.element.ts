import { html, TemplateResult } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import {
  UMB_APP_LANGUAGE_CONTEXT,
  type UmbLanguageDetailModel,
} from "@umbraco-cms/backoffice/language";
import type { CalendarItem } from "../../entities.js";
import type { WorkflowContentCalendarDayDetailModalData } from "./content-calendar-day-detail-modal.token.js";

export abstract class WorkflowContentCalendarDayDetailModalBaseElement extends UmbModalBaseElement<WorkflowContentCalendarDayDetailModalData> {
  protected displayDate?: string;
  protected items: Array<CalendarItem> = [];

  protected languages?: Array<UmbLanguageDetailModel> = [];
  protected defaultLanguage?: UmbLanguageDetailModel;

  protected readonly DATE_OPTIONS: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  };

  abstract renderItems(): void;
  abstract renderSubmit(): TemplateResult | symbol;

  constructor() {
    super();

    this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.languages, (languages) => {
        this.defaultLanguage = languages?.find((x) => x.isDefault);
        this.languages = languages;
      });
    });
  }

  protected orderItems() {
    if (!this.data) return;

    this.items.sort((a, b) => {
      if (a.startKey! < b.startKey!) return -1;
      if (a.startKey! > b.startKey!) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  protected formatDate() {
    if (!this.data) return;

    // Extract year, month, and day from the input string
    const year = +this.data.date.slice(0, 4); // YYYY
    const month = +this.data.date.slice(4, 6); // mm
    const day = +this.data.date.slice(6, 8); // DD

    const date = new Date(year, month, day);

    this.displayDate = this.localizeDate(date);
  }

  protected localizeDate(date: Date) {
    return this.localize.date(date, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  protected localizeTime(date: Date) {
    return this.localize.date(date, { timeStyle: "short" });
  }

  protected getLanguageName(culture?: string | null) {
    return (
      this.languages?.find((x) => x.unique === culture)?.name ??
      this.defaultLanguage?.name
    );
  }

  render() {
    if (!this.data) return null;

    return html`<uui-dialog-layout headline=${this.displayDate ?? ""}>
      ${this.renderItems()}
      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
        ${this.renderSubmit()}
      </div>
    </uui-dialog-layout>`;
  }
}

export default WorkflowContentCalendarDayDetailModalBaseElement;
