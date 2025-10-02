import {
  css,
  customElement,
  html,
  property,
  repeat,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";

import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { type CalendarItem } from "../entities.js";

const elementName = "workflow-content-calendar-day-item";

@customElement(elementName)
export class WorkflowContentCalendarDayItemElement extends UmbLitElement {
  readonly #totalSecondsInDay = 86400;

  @property({ type: Object })
  item?: CalendarItem;

  @property({ type: Number })
  stack = 0;

  @property()
  key?: string;

  @state()
  barWidth?: string;

  #renderConcurrentCount(count: number = 0) {
    return html`${count !== 0 ? "(+" + count + ")" : ""}`;
  }

  #renderSingle() {
    if (!this.item) return;

    return html`<span .class=${this.item.singleDay ? "single" : this.item.state}
      >${this.item.name}
      ${this.#renderConcurrentCount(this.item.concurrentCount)}
    </span>`;
  }

  #renderContinuing() {
    if (!this.item) return;

    return html`<span class="continues"
      >${this.item.name} (cont)
      ${this.#renderConcurrentCount(this.item.concurrentCount)}</span
    >`;
  }

  #renderEnd() {
    if (!this.item) return;
    const width = this.#calculatePosition(this.item);
    this.setAttribute("style", `--bar-width: ${width}%`);
  }

  #calculatePosition(marker?: { toDate?: Date, fromDate?: Date, endKey?: string }) {  
    if (!marker?.fromDate) return 50;

    const date = marker.toDate && this.key === marker.endKey ? marker.toDate : marker.fromDate;

    // Convert current time to total seconds elapsed since midnight
    const elapsedSeconds =
      date.getHours() * 3600 +
      date.getMinutes() * 60 +
      date.getSeconds();

    // Calculate the percentage of the day elapsed
    const percentage = (elapsedSeconds / this.#totalSecondsInDay) * 100;

    return percentage.toFixed(2);
  }

  #renderMarkers() {
    if (!this.item?.versions?.length) return;
    const current = this.item.versions.filter((v) => v.startKey == this.key || v.endKey === this.key);
    if (!current.length) return;

    if (this.item.state === "start") return;

    return repeat(
      current,
      (marker) => marker.unique,
      (marker) =>
        html`<span
          class="marker ${marker.endKey === this.key ? "unpublish" : ""}"
          style="left: calc(${this.#calculatePosition(marker)}% - 6px)"
        ></span>`
    );
  }

  render() {
    if (!this.item) return;

    return html`<div
      class="item-block ${this.item.singleDay ? "single" : this.item.state}"
    >
      ${when(this.item.state === "start", () => this.#renderSingle())}
      ${when(this.item.state === "continues", () => this.#renderContinuing())}
      ${when(this.item.state === "end", () => this.#renderEnd())}
      ${this.#renderMarkers()}
    </div>`;
  }

  static styles = [
    css`
      :host {
        --join-offset: -5px;
        --join-width: 50%;
      }

      span {
        line-height:20px;
        display: block;
        margin-bottom: auto;
        position: relative;
        z-index: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .item-block {
        --block-color: var(--uui-color-default-standalone);

        font-size: 12px;
        background: var(--block-color);
        padding: 0 4px;
        border-radius: 4px;
        position: relative;
        height: 20px;
        box-sizing: border-box;
        color: white;
        margin-top: 2px;
        transform: translateY(0);

        &.end {
          background: white;
        }
      }

      #overflow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 16px 8px;
        border-radius: 4px;
        background: var(--block-color);
        aspect-ratio: 1 / 1;
        height: 20px;
        text-align: center;
        font-size: 12px;
      }

      .marker,
      .end::after,
      .active::before,
      .active::after,
      .continues::after,
      .start:not(.single)::after {
        content: "";
        display: block;
        background: var(--block-color);
        position: absolute;
        top: 0;
        bottom: 0;
        width: var(--join-width);
        z-index: -1;
      }

      .marker.unpublish {
        border:2px solid var(--block-color);
        background:white;
        box-sizing:border-box;
      }

      .active::before,
      .continues::after {
        width: calc(100% + 10px);
      }

      .active,
      .end {
        border-top: 9px solid var(--color-block-border, white);
        border-bottom: 9px solid var(--color-block-border, white);
      }

      :host-context([istoday]) {
        .end {
          background-color: var(--color-block-border);
        }
      }

      .active::before {
        left: var(--join-offset);
      }

      .active::after {
        right: var(--join-offset);
      }

      .continues::after,
      .start:not(.single)::after {
        --join-width: 20px;
        height: 2px;
        right: var(--join-offset);
        top: 50%;
        transform: translateY(-1px);
      }

      .end::after {
        content: "";
        width: var(--bar-width);
        height: 2px;
        top: calc(50% - 1px);
        left: var(--join-offset);
      }

      .start .marker {
        display: none;
      }

      .marker {
        --join-width: 12px;
        border-radius: 50%;
        height: 12px;
        right: 0;
        transform: translateY(var(--join-offset));
      }
    `,
  ];
}

export default WorkflowContentCalendarDayItemElement;

declare global {
  interface HTMLElementTagMap {
    [elementName]: WorkflowContentCalendarDayItemElement;
  }
}
