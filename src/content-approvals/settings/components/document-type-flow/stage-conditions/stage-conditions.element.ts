import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import type { UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";
import {
  ApprovalThresholdModel,
  type ContentTypePropertyModel,
  type DocumentTypePermissionConfigModel,
} from "@umbraco-workflow/generated";

interface StageCondition {
  groupKey?: string;
  variant?: string;
  condition?: string;
}

export interface StageConditionConfig {
  variant: string;
  groups: Array<{
    name: string;
    unique: string;
    condition: string | null | undefined;
  }>;
  contentType?: ContentTypePropertyModel;
}

const elementName = "workflow-stage-conditions";

@customElement(elementName)
export class StageConditionElement extends UmbLitElement {
  @property({ type: Object })
  config?: StageConditionConfig;

  @state()
  conditions: Array<StageCondition> = [];

  @state()
  value?: DocumentTypePermissionConfigModel;

  connectedCallback(): void {
    super.connectedCallback();

    this.config?.groups?.forEach((p) => {
      if (!p.condition) return;

      p.condition.split(",").forEach((condition) => {
        this.conditions.push({
          groupKey: p.unique,
          variant: this.config?.variant,
          condition,
        });
      });
    });
  }

  #addCondition() {
    this.conditions = [...this.conditions, { variant: this.config?.variant }];
  }

  #removeCondition(idx: number) {
    const conditions = [...this.conditions];
    const removedCondition = conditions.splice(idx, 1).at(0);
    if (!removedCondition) throw new Error("removedCondition is missing");
    this.conditions = conditions;

    // update permission to remove condition value
    const permission = this.config?.groups?.find(
      (p) =>
        removedCondition.condition &&
        p.condition?.includes(removedCondition.condition) &&
        p.unique === removedCondition?.groupKey
    );

    // permission may be undefined if added but not saved
    // if so, there's nothing more to do.
    if (!permission) return;

    const updatedCondition =
      permission?.condition
        ?.split(",")
        .filter((x) => x !== removedCondition?.condition) ?? [];

    this.#dispatch(updatedCondition.join(","), permission.unique);
  }

  #handleGroupSelect(condition: StageCondition, e: UUISelectEvent) {
    const value = e.target.value as string;
    condition.groupKey = value;
  }

  #handlePropertySelect(condition: StageCondition, e: UUISelectEvent) {
    const permission = this.config?.groups?.find(
      (p) => p.unique === condition.groupKey
    );

    if (!permission) return;

    const value = e.target.value as string;
    const existingValue = condition?.condition ?? "";

    let conditionArray = permission.condition?.split(",") ?? [];

    if (permission.condition) {
      const existingIndex = existingValue
        ? permission.condition.indexOf(existingValue)
        : -1;

      if (existingIndex > -1) {
        conditionArray[existingIndex] = value;
      } else {
        conditionArray.push(value);
      }
    } else {
      conditionArray = [value];
    }

    condition.condition = value;
    this.#dispatch(conditionArray.join(","), permission.unique);
  }

  #dispatch(condition: string, groupUnique: string) {
    this.value = {
      group: {
        name: "",
        unique: groupUnique,
      },
      approvalThreshold: "One", // value is ignored in event handler
      permission: 0, // value is ignored in event handler
      condition,
      culture: this.config?.variant ?? "",
      contentTypeUnique: this.config?.contentType?.key ?? "",
    };

    // emit event to update on modal element
    this.dispatchEvent(new CustomEvent("change"));
  }

  #renderConditionElement(condition, idx: number) {
    return html`<li class="conditions-listitem">
      <umb-localize key="workflow_include">Include</umb-localize>
      <uui-select
        placeholder="Select"
        .options=${this.config?.groups?.map((p) => ({
          name: p.name,
          value: p.unique,
          selected: condition.groupKey === p.unique,
        })) ?? []}
        @change=${(e) => this.#handleGroupSelect(condition, e)}
      >
      </uui-select>
      <umb-localize key="workflow_when">when</umb-localize>
      <uui-select
        placeholder="Select"
        .options=${this.config?.contentType?.properties?.map((x) => ({
          name: x.name,
          value: x.key,
          selected: condition.condition === x.key,
        })) ?? []}
        @change=${(e) => this.#handlePropertySelect(condition, e)}
      >
      </uui-select>
      <umb-localize key="workflow_hasChanged">has changed</umb-localize>
      <uui-button
        look="default"
        color="default"
        label=${this.localize.term("general_remove")}
        @click=${() => this.#removeCondition(idx)}
      ></uui-button>
    </li>`;
  }

  render() {
    return html`<uui-box
      .headline=${this.localize.term("workflow_conditionalStages")}
    >
      ${when(
        this.conditions.length,
        () => html`
          <ul id="conditionsList">
            ${this.conditions
              .filter((c) => c.variant === this.config?.variant)
              .map((c, i) => this.#renderConditionElement(c, i))}
          </ul>
        `
      )}
      <uui-button
        look="placeholder"
        .label=${this.localize.term("workflow_addCondition")}
        @click=${this.#addCondition}
      ></uui-button>
    </uui-box>`;
  }

  static styles = [
    css`
      :host {
        display: block;
      }

      #conditionsList {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      .conditions-listitem {
        display: flex;
        align-items: center;
        padding: calc(var(--uui-size-2, 6px) + 1px);
      }

      .conditions-listitem > *:not(:first-child) {
        margin-left: var(--uui-size-space-3);
        display: block;
      }

      .conditions-listitem > uui-button {
        margin-left: auto !important;
        opacity: 0;
        transition: opacity 120ms ease 0s;
        --uui-button-border-radius: 50px 50px 50px 50px;
        --uui-button-padding-left-factor: 2;
        --uui-button-padding-right-factor: 2;
      }

      .conditions-listitem:hover uui-button {
        opacity: 1;
      }

      [look="placeholder"] {
        width: 100%;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: StageConditionElement;
  }
}
