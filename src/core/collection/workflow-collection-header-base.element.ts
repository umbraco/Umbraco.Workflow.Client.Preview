import { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import { css, html, state, when } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  FilterPickerElement,
  PageSizeDropdownElement,
  WorkflowFilterConfig,
} from "@umbraco-workflow/components";
import { WorkflowSearchFilterModel } from "@umbraco-workflow/generated";
import { WorkflowCollectionHeaderCtorArgs } from "./types.js";

export abstract class WorkflowCollectionHeaderBaseElement<
  ContextType extends UmbDefaultCollectionContext
> extends UmbLitElement {
  protected collectionContext?: ContextType;

  @state()
  public _filter?: WorkflowFilterConfig;

  @state()
  private _pageSize?: number;

  @state()
  private _title?: string;

  #onFilterChangeHandler?: (v: Partial<WorkflowSearchFilterModel>) => void;

  constructor(args: WorkflowCollectionHeaderCtorArgs) {
    super();

    this._filter = args.filter;
    this.#onFilterChangeHandler = args.onFilterChange;

    if (args.title) {
      this._title = this.localize.term(args.title);
    }

    this.consumeContext(args.contextToken, (context) => {
      this.collectionContext = context;

      this._pageSize = context?.getConfig()?.pageSize;
    });
  }

  #onFilterChange(e: Event) {
    const filters = (e.target as FilterPickerElement).value;
    if (!filters) return;

    this.#onFilterChangeHandler?.(filters);
  }

  #onPageSizeChange(e: Event) {
    const take = (e.target as PageSizeDropdownElement).value;
    this.collectionContext?.pagination.setPageSize(take);
    this.collectionContext?.setFilter({ take });
  }

  override render() {
    return html`
      ${when(this._title, () => html`<h3 id="title">${this._title}</h3>`)}
      <div id="right">
        ${when(
          this.#onFilterChangeHandler,
          () => html` <workflow-filter-picker
            @change=${this.#onFilterChange}
            .config=${this._filter}
          >
          </workflow-filter-picker>`
        )}
        <workflow-page-size
          @change=${this.#onPageSizeChange}
          value=${this._pageSize ?? 10}
        ></workflow-page-size>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      width: 100%;
    }

    #right {
      display: flex;
      margin-left: auto;
      gap: var(--uui-size-2);
    }

    #title {
      margin: 0 auto 0 0;
      align-self: end;
      line-height: 1;
    }
  `;
}
