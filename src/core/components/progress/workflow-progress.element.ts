import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

const elementName = "workflow-progress-bar";

@customElement(elementName)
export class WorkflowProgressBarElement extends LitElement {
  #progress = 0;
  #current = 0;

  @property({ type: Number })
  get current() {
    return this.#current;
  }

  @property({ type: Number })
  get progress() {
    return this.#progress;
  }

  set progress(newVal) {
    const oldVal = this.#progress;
    this.#progress = clamp(newVal, 0, 100);
    this.requestUpdate("progress", oldVal);
  }

  set current(newVal) {
    const oldVal = this.#current;
    this.#current = clamp(newVal, 0, 100);
    this.requestUpdate("current", oldVal);
  }

  private _getProgressStyle() {
    return { width: `${this.#progress}%` };
  }

  private _getCurrentStyle() {
    return { width: `${this.#current + this.#progress}%` };
  }

  render() {
    return html`
      <div id="progress" style=${styleMap(this._getProgressStyle())}></div>
      <div id="current" style=${styleMap(this._getCurrentStyle())}></div>
    `;
  }

  static styles = [
    css`
      :host {
        width: 100%;
        height: 4px;
        position: relative;
        overflow: hidden;
        background: var(--uui-color-surface-alt);
        border-radius: 100px;
        display: block;
      }

      div {
        transition: width 250ms ease;
        background: var(--uui-color-positive);
        height: 100%;
        width: 0%;
      }

      #current {
        background: var(--current-task-background-color);
      }

      #progress {
        background: var(--uui-color-positive);
        position: absolute;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowProgressBarElement;
  }
}
