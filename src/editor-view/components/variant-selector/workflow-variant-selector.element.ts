import type { UmbDocumentVariantModel } from "@umbraco-cms/backoffice/document";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  customElement,
  LitElement,
  html,
  property,
  when,
  css,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UUIBooleanInputEvent } from "@umbraco-cms/backoffice/external/uui";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";
import type { LanguageModel } from "@umbraco-workflow/generated";

const elementName = "workflow-variant-selector";

@customElement(elementName)
export class WorkflowVariantSelectorElement extends UmbElementMixin(
  LitElement
) {
  #workflowContext?: typeof WORKFLOW_CONTEXT.TYPE;

  @property({ type: Array })
  variants?: Array<UmbDocumentVariantModel> = [];

  @property({ type: Array })
  variantTasks?: Array<string> = [];

  @property()
  currentVariant?: string | null;

  #languages?: Array<LanguageModel> = [];
  #defaultCultureName?: string | null;

  @state()
  value: Record<string, boolean> = {};

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      if (!context) return;
      this.#workflowContext = context;

      this.observe(this.#workflowContext.globalVariables, (globalVariables) => {
        this.#languages = globalVariables?.availableLanguages;
        this.#defaultCultureName = globalVariables?.defaultCultureName;
      });
    });
  }

  #handleSelectionChange(
    event: UUIBooleanInputEvent,
    variant: UmbDocumentVariantModel
  ) {
    this.value[variant.culture!] = event.target.checked;
    this.value["*"] = false;

    this.dispatchEvent(new CustomEvent("change"));
  }

  #inWorkflow(variant: UmbDocumentVariantModel) {
    // handle culture variant workflows
    if (variant.culture && this.variantTasks?.includes(variant.culture))
      return true;

    // handle invariant node - culture may be null or invariant (*)
    return (
      !!this.currentVariant &&
      (!variant.culture || this.currentVariant.localeCompare(variant.culture))
    );
  }

  // TODO => variant editing permissions?
  #canEdit(variant: UmbDocumentVariantModel) {
    return true; //variant.allowedActions.includes("A");
  }

  #canSubmit(variant: UmbDocumentVariantModel) {
    if (!this.#canEdit(variant)) return false;
    return this.#inWorkflow(variant) === false;
  }

  #showInvariantSelector() {
    return this.variants?.every((v) => this.#canSubmit(v));
  }

  #handleInvariantSelectorChange(e: UUIBooleanInputEvent) {
    this.value = { "*": e.target.checked };
    this.dispatchEvent(new CustomEvent("change"));
  }

  #getLanguageByCulture(culture: string | null) {
    const language = this.#languages?.find(
      (l) =>
        l.isoCode.localeCompare(culture ?? "", undefined, {
          sensitivity: "base",
        }) === 0
    );

    return language;
  }

  #renderVariantSelector(variant: UmbDocumentVariantModel) {
    const language = this.#getLanguageByCulture(variant.culture);
    const canEdit = this.#canEdit(variant);
    const inWorkflow = this.#inWorkflow(variant);
    const canSubmit = canEdit && !inWorkflow;

    return html`<uui-checkbox
      @change=${(e) => this.#handleSelectionChange(e, variant)}
      ?checked=${this.value[variant.culture!] === true}
      ?disabled=${!canSubmit || this.value["*"]}
      ><div>
        ${language?.name} ${language?.isoCode}
        <small>
          ${when(!inWorkflow, () => html`${variant.state}`)}
          ${when(
            inWorkflow && canEdit,
            () => html`${this.localize.term("workflow_docIsActive")}`
          )}
          ${when(
            !canEdit,
            () => html`${this.localize.term("workflow_notAllowed")}`
          )}
        </small>
      </div></uui-checkbox
    >`;
  }

  render() {
    return html`<umb-property-layout
      .label=${this.localize.term("workflow_variants")}
    >
      <div slot="editor">
        ${this.variants?.map((v) => this.#renderVariantSelector(v))}
        ${when(
          this.#showInvariantSelector(),
          () => html` <uui-checkbox
            @change=${this.#handleInvariantSelectorChange}
          >
            <div>
              ${this.localize.term("workflow_invariantWorkflow")}s
              <small
                >${this.localize.term(
                  "workflow_invariantDesc",
                  this.#defaultCultureName
                )}
              </small>
            </div></uui-checkbox
          >`
        )}
      </div>
    </umb-property-layout>`;
  }

  static styles = [
    css`
      uui-checkbox,
      small {
        display: block;
      }
    `,
  ];
}

export default WorkflowVariantSelectorElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowVariantSelectorElement;
  }
}
