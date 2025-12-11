import {
  UMB_DOCUMENT_WORKSPACE_CONTEXT,
  type UmbDocumentVariantOptionModel,
} from "@umbraco-cms/backoffice/document";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  customElement,
  html,
  property,
  state,
  queryAll,
  repeat,
} from "@umbraco-cms/backoffice/external/lit";
import { type UmbLanguageDetailModel } from "@umbraco-cms/backoffice/language";
import type { UmbVariantGuardRule } from "@umbraco-cms/backoffice/utils";
import { WORKFLOW_INVARIANT } from "../../../constants.js";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import {
  UMB_VALIDATION_EMPTY_LOCALIZATION_KEY,
  UmbFormControlMixin,
} from "@umbraco-cms/backoffice/validation";

export type VariantOptionModelType = UmbDocumentVariantOptionModel & {
  state?: UmbVariantGuardRule;
};

const elementName = "workflow-variant-selector";

@customElement(elementName)
export class WorkflowVariantSelectorElement
  extends UmbFormControlMixin<string[] | undefined, typeof UmbLitElement>(
    UmbLitElement
  )
  implements UmbPropertyEditorUiElement
{
  @property({ type: Array })
  variantTasks?: Array<string> = [];

  /**
   * Sets the input to mandatory, meaning validation will fail if the value is empty.
   * @type {boolean}
   */
  @property({ type: Boolean })
  mandatory?: boolean;

  @property({ type: String })
  mandatoryMessage = UMB_VALIDATION_EMPTY_LOCALIZATION_KEY;

  @state()
  private _groupedVariants: Record<string, Array<VariantOptionModelType>> = {};

  @state()
  private _variesBySegment = false;

  @queryAll("uui-ref-node")
  refNodes?;

  #defaultCulture?: UmbLanguageDetailModel;
  #defaultIsPublished = false;
  #defaultIsCreated = false;

  readonly #invariantId = WORKFLOW_INVARIANT;
  readonly #invariantCulture = "*";

  #variants: Array<VariantOptionModelType> = [];

  constructor() {
    super();

    this.addValidator(
      "valueMissing",
      () => UMB_VALIDATION_EMPTY_LOCALIZATION_KEY,
      () => (this.mandatory ?? false) && !(this.value ?? []).length
    );

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.variantOptions, (variantOptions) => {
        this.#variants = variantOptions;
        const variantStates = context.readOnlyGuard.getRules();

        this.#variants.forEach(
          (v) =>
            (v.state = variantStates.find(
              (x) => x.variantId?.culture === v.culture
            ))
        );

        const defaultVariant = this.#variants?.find(
          (x) => x.language.isDefault
        );
        this.#defaultCulture = defaultVariant?.language;
        this.#defaultIsPublished = Boolean(
          defaultVariant?.variant?.publishDate
        );
        this.#defaultIsCreated = Boolean(defaultVariant?.variant);

        this.#groupVariantsByCulture();
      });
    });
  }

  #groupVariantsByCulture() {
    if (!this.#variants) return;

    this._groupedVariants = this.#variants.reduce((result, currentValue) => {
      this._variesBySegment =
        currentValue.segment != null ? true : this._variesBySegment;

      const groupKey = currentValue.culture;
      if (!groupKey) return [];

      if (!result[groupKey]) {
        result[groupKey] = [];
      }

      result[groupKey].push(currentValue);

      return result;
    }, {});
  }

  #handleSelectionChange(variant: VariantOptionModelType) {
    if (!variant.culture) return;

    if (!this.value) {
      this.value = [];
    }

    // Remove '*' if present
    let updatedValue = this.value.filter((v) => v !== this.#invariantCulture);

    // Toggle the incoming culture
    if (updatedValue.includes(variant.culture)) {
      updatedValue = updatedValue.filter((v) => v !== variant.culture);
    } else {
      updatedValue = [...updatedValue, variant.culture];
    }

    this.value = updatedValue;

    this.refNodes.forEach((x) => {
      if (x.id === this.#invariantId) {
        x.selected = false;
      }
    });

    this.dispatchEvent(new UmbChangeEvent());
  }

  #inWorkflow(culture: string | null) {
    if (this.variantTasks?.includes(this.#invariantCulture)) return true;
    return culture && this.variantTasks?.includes(culture);
  }

  #canEdit(variant: VariantOptionModelType) {
    return variant.state === undefined;
  }

  #canSubmit(variant: VariantOptionModelType) {
    if (!this.#canEdit(variant)) return false;
    return this.#inWorkflow(variant.culture) === false;
  }

  #handleInvariantSelectorChange(selected = false) {
    this.value = ["*"];

    this.refNodes.forEach(
      (x) => (x.selected = x.id === this.#invariantId && selected)
    );

    this.dispatchEvent(new UmbChangeEvent());
  }

  #renderInvariantSelector() {
    if (!this.#defaultIsCreated) return;
    if (this.#variants?.some((v) => !this.#canSubmit(v))) return;

    return html`<uui-ref-node
      name=${this.localize.term("workflow_invariantWorkflow")}
      id=${this.#invariantId}
      detail=${this.localize.term(
        "workflow_invariantWorkflowDescription",
        this.#defaultCulture?.name
      )}
      selectable
      @selected=${() => this.#handleInvariantSelectorChange(true)}
      @deselected=${() => this.#handleInvariantSelectorChange()}
    ></uui-ref-node>`;
  }

  #getSegmentNames(culture) {
    if (!this._variesBySegment) return;

    const nameArray = this._groupedVariants[culture]
      .filter((x) => x.segment)
      .map((x) => `'${x.segment}'`);

    return `${this.localize.term("workflow_segments")}: ${nameArray.join(
      ", "
    )}`;
  }

  #renderVariantSelector(culture: string, variant: VariantOptionModelType) {
    const language = variant.language.name;
    const canEdit = this.#canEdit(variant);
    const inWorkflow = this.#inWorkflow(culture);
    const isDefault = variant.language.isDefault;
    const canSubmit =
      canEdit &&
      !inWorkflow &&
      (this.#defaultIsPublished || (isDefault && this.#defaultIsCreated));

    const detail = () => {
      if (!canEdit)
        return (
          variant.state?.message ?? this.localize.term("workflow_notAllowed")
        );
      if (isDefault && !this.#defaultIsCreated)
        return this.localize.term("workflow_defaultVariantIsNotCreated");
      if (!isDefault && !this.#defaultIsPublished)
        return this.localize.term("workflow_defaultVariantIsNotPublished");
      if (!inWorkflow)
        return `${
          this._variesBySegment ? this.#getSegmentNames(culture) + " | " : ""
        }${this.localize.term("general_status")}: ${
          variant.variant?.state ?? "Not created"
        }`;
      if (inWorkflow && canEdit)
        return this.localize.term("workflow_docIsActive");

      return "";
    };

    return html`<uui-ref-node
      name=${language}
      detail=${detail()}
      ?selectable=${canSubmit}
      ?disabled=${!canSubmit}
      @selected=${() => this.#handleSelectionChange(variant)}
      @deselected=${() => this.#handleSelectionChange(variant)}
    ></uui-ref-node>`;
  }

  render() {
    return html` <uui-ref-list>
      ${repeat(
        Object.entries(this._groupedVariants),
        (v) => v[0],
        (v) => this.#renderVariantSelector(v[0], v[1][0])
      )}
      ${this.#renderInvariantSelector()}
    </uui-ref-list>`;
  }
}

export default WorkflowVariantSelectorElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowVariantSelectorElement;
  }
}
