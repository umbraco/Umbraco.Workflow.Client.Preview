import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import type { UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";
import type {
  ContentTypePropertyModel,
  UserGroupPermissionsModel,
} from "@umbraco-workflow/generated";

type StageCondition = {
  groupKey?: string;
  variant?: string;
  condition?: string;
};

export interface StageConditionConfig {
  variant: string;
  contentType: ContentTypePropertyModel;
}

const elementName = "workflow-stage-conditions";

@customElement(elementName)
export class StageConditionElement extends UmbElementMixin(LitElement) {
  @property({ type: Object })
  config?: StageConditionConfig;

  @property({ type: Array })
  value?: Array<UserGroupPermissionsModel> = [];

  @state()
  conditions: Array<StageCondition> = [];

  get valueByVariant() {
    return this.value?.filter((x) => x.variant === this.config?.variant);
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.value?.forEach((p) => {
      if (!p.condition) return;

      p.condition.split(",").forEach((condition) => {
        this.conditions.push({
          groupKey: p.groupKey,
          variant: p.variant,
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
    let permission = this.value?.find(
      (p) =>
        removedCondition.condition &&
        p.variant === removedCondition.variant &&
        p.condition?.includes(removedCondition.condition) &&
        p.groupKey === removedCondition?.groupKey
    );

    // permission may be undefined if added but not saved
    // if so, there's nothing more to do.
    if (!permission) return;

    const updatedCondition =
      permission?.condition
        ?.split(",")
        .filter((x) => x !== removedCondition?.condition) ?? [];

    permission = {
      ...permission,
      ...{ condition: updatedCondition.join(",") },
    };

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          permission,
        },
      })
    );
  }

  #handleGroupSelect(condition: StageCondition, e: UUISelectEvent) {
    const value = e.target.value as string;
    condition.groupKey = value;
  }

  #handlePropertySelect(condition: StageCondition, e: UUISelectEvent) {
    let permission = this.value?.find(
      (p) =>
        p.contentTypeKey === this.config?.contentType.key &&
        p.variant === this.config?.variant &&
        p.groupKey === condition.groupKey
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
    permission = { ...permission, ...{ condition: conditionArray.join(",") } };

    // emit event to update on modal element
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          permission,
        },
      })
    );
  }

  #renderConditionElement(condition, idx: number) {
    return html`<li class="conditions-listitem">
      <umb-localize key="workflow_include">Include</umb-localize>
      <uui-select
        placeholder="Select"
        .options=${this.valueByVariant?.map((p) => ({
          name: p.groupName!,
          value: p.groupKey!.toString(),
          selected: condition.groupKey === p.groupKey,
        })) ?? []}
        @change=${(e) => this.#handleGroupSelect(condition, e)}
      >
      </uui-select>
      <umb-localize key="workflow_when">when</umb-localize>
      <uui-select
        placeholder="Select"
        .options=${this.config?.contentType.properties?.map((x) => ({
          name: x.name!,
          value: x.key!,
          selected: condition.condition === x.key,
        })) ?? []}
        @change=${(e) => this.#handlePropertySelect(condition, e)}
      >
      </uui-select>
      <umb-localize key="workflow_hasChanged">has changed</umb-localize>
      <uui-button
        type="button"
        look="default"
        color="default"
        @click=${() => this.#removeCondition(idx)}
      >
        <umb-localize key="general_remove">Remove</umb-localize>
      </uui-button>
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
      <workflow-add-button
        .labelKey=${"workflow_addCondition"}
        @click=${this.#addCondition}
      ></workflow-add-button>
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
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: StageConditionElement;
  }
}
