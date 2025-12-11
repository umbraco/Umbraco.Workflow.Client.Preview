import {
  css,
  customElement,
  html,
  repeat,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import {
  WorkflowReleaseSetItemCollectionAddItemAction,
  WorkflowVersionSorterController,
} from "@umbraco-workflow/release-sets";
import {
  CalendarItem,
  CalendarItemCultureDetail,
  CalendarItemDetail,
  CalendarItemVersion,
  WorkflowContentCalendarDayDetailModalBaseElement,
} from "@umbraco-workflow/calendar";
import { WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT } from "../components/index.js";

const elementName = "release-set-day-detail-modal";

@customElement(elementName)
export class WorkflowReleaseSetDayDetailModalElement extends WorkflowContentCalendarDayDetailModalBaseElement {
  #versionSorter = new WorkflowVersionSorterController();
  #editorContext?: typeof WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT.TYPE;

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT,
      (context) => {
        if (!context) return;
        this.#editorContext = context;
      }
    );
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.items = [...(this.data?.day.items ?? [])];
    this.orderItems();
    this.formatDate();
  }

  #mapPublishingVersionDetail(
    version: CalendarItemVersion,
    item: CalendarItem
  ) {
    const currentVersion =
      item.versions
        ?.filter(
          (x) =>
            x.fromDate! < version.fromDate! && x.culture === version.culture
        )
        .reverse()
        .at(0) ?? item;

    const mapped: CalendarItemCultureDetail = {
      pending: version.name,
      pendingUnique: version.unique,
      current: currentVersion.name,
      currentUnique: currentVersion.unique,
      variant: this.getLanguageName(version.culture),
      publishTime: `Publish at ${this.localizeTime(version.fromDate!)}`,
    };

    return mapped;
  }

  #mapUnpublishingVersionDetail(version: CalendarItemVersion) {
    const mapped: CalendarItemCultureDetail = {
      variant: this.getLanguageName(version.culture),
      current: version.name,
      currentUnique: version.unique,
    };

    if (version.toDate && version.endKey === this.data?.date) {
      mapped.publishTime = `Unpublish at ${this.localizeTime(version.toDate)}`;
    }

    return mapped;
  }

  #getItemDetail(item: CalendarItem): CalendarItemDetail {
    const data: CalendarItemDetail = {
      documentName: item.name,
    };

    if (item.singleDay) {
      data.documentDetail = `${
        item.action ?? "Publish"
      } on ${this.localize.date(item.fromDate!, this.DATE_OPTIONS)}`;
    } else {
      data.documentDetail = `${this.localize.date(
        item.fromDate!,
        this.DATE_OPTIONS
      )} - ${this.localize.date(item.toDate!, this.DATE_OPTIONS)}`;
    }

    const publishing =
      item.versions
        ?.filter((x) => x.startKey === this.data?.date)
        ?.map((v) => this.#mapPublishingVersionDetail(v, item)) ?? [];

    const unpublishing =
      item.versions
        ?.filter((x) => x.endKey === this.data?.date)
        ?.map((v) => this.#mapUnpublishingVersionDetail(v)) ?? [];

    let versions = [...publishing, ...unpublishing];

    // find current version for the current date
    const versionUniques = versions.map((v) => v.currentUnique);
    const cultures = new Set(item.versions?.map((x) => x.culture) ?? []);
    let currentVersions = Array.from(cultures)
      .map(
        (c) =>
          item.versions
            ?.filter(
              (x) =>
                x.startKey! < (this.data?.date ?? "") &&
                x.culture === c &&
                !versionUniques.includes(x.unique)
            )
            ?.filter((_, i, arr) => i === arr.length - 1)
            ?.map((v) => ({
              variant: this.getLanguageName(v.culture),
              current: v.name,
              currentUnique: v.unique,
            })) ?? []
      )
      .flat();

    versions.push(...currentVersions);

    data.versions = this.#versionSorter.sortVersions(
      versions,
      this.defaultLanguage?.unique ?? ""
    );

    return data;
  }

  #renderActionTag(version: CalendarItemCultureDetail) {
    const look = version.pendingUnique ? "primary" : "outline";
    const className = version.pendingUnique ? "joined-both" : "joined-left";

    return when(
      version.publishTime,
      () =>
        html` <uui-tag .look=${look} class="joined ${className}"
          >${version.publishTime}</uui-tag
        >`
    );
  }

  #renderVersions(version: CalendarItemCultureDetail) {
    return html`<div class="tags">
      <uui-tag look="secondary" title="Current">${version.current}</uui-tag>
      ${this.#renderActionTag(version)}
      ${when(
        version.pendingUnique,
        () =>
          html` <uui-tag look="placeholder" title="Next"
            >${version.pending}</uui-tag
          >`
      )}
    </div>`;
  }

  #renderCultures(cultures?: Record<string, Array<CalendarItemCultureDetail>>) {
    if (!cultures) return;

    return html`${repeat(
      Object.keys(cultures),
      (culture) => culture,
      (culture) =>
        html`<div>
          <strong>${culture}</strong>
          ${repeat(
            cultures[culture] ?? [],
            (version) => version,
            (version) => this.#renderVersions(version)
          )}
        </div>`
    )}`;
  }

  #renderContent(item: CalendarItem) {
    const detail = this.#getItemDetail(item);

    return html` <div slot="name">${detail.documentName}</div>
      <div slot="detail">${detail.documentDetail}</div>
      <div slot="versions">${this.#renderCultures(detail.versions)}</div>`;
  }

  override renderItems() {
    if (!this.items.length)
      return this.localize.term("workflow_calendar_noItems");

    return html`<uui-ref-list
      >${repeat(
        this.items,
        (item) => item.unique,
        (item) =>
          html`<workflow-ref-calendar-item>
            <umb-icon
              slot="icon"
              .name=${item.icon ?? "icon-document"}
            ></umb-icon>
            ${this.#renderContent(item)}</workflow-ref-calendar-item
          >`
      )}</uui-ref-list
    >`;
  }

  #onSubmit() {
    const date = this.data?.date
      ? new Date(
          +this.data.date.slice(0, 4),
          +this.data.date.slice(4, 6),
          +this.data.date.slice(6)
        )
      : undefined;

    this.#editorContext?.setDefaultReleaseDate(date);

    const addItemAction = new WorkflowReleaseSetItemCollectionAddItemAction(
      this
    );

    addItemAction.execute();
  }

  override renderSubmit() {
    return html` <uui-button
      look="secondary"
      color="default"
      label=${this.localize.term("general_add")}
      @click=${this.#onSubmit}
    ></uui-button>`;
  }

  static styles = [
    css`
      [slot="versions"] div {
        margin-top: var(--uui-size-2);
      }

      [slot="versions"] .tags {
        display: flex;
        gap: var(--uui-size-2);
      }

      [slot="versions"] .joined {
        position: relative;
        align-self: center;

        &::before,
        &::after {
          content: "";
          width: var(--uui-size-2);
          border-top-width: 2px;
          border-top-style: solid;
          border-image: linear-gradient(
              to right,
              var(--uui-color-surface-alt),
              var(--uui-color-border-standalone)
            )
            1;
          position: absolute;
          top: 50%;
          left: calc(var(--uui-size-2) * -1 - 1px);
        }

        &::after {
          left: auto;
          right: calc(var(--uui-size-2) * -1 - 1px);
          border-top-style: dashed;
          border-image: none;
          border-top-color: var(--uui-color-border-standalone);
        }
      }

      .joined.joined-left::after {
        display: none;
      }
    `,
  ];
}

export default WorkflowReleaseSetDayDetailModalElement;

declare global {
  interface HTMLElementTagMap {
    [elementName]: WorkflowReleaseSetDayDetailModalElement;
  }
}
