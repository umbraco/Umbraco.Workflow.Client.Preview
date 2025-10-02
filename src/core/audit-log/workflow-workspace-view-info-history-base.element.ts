import {
  css,
  html,
  state,
  nothing,
  repeat,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { UmbPaginationManager } from "@umbraco-cms/backoffice/utils";
import type { UUIPaginationEvent } from "@umbraco-cms/backoffice/external/uui";
import {
  UmbUserItemRepository,
  type UmbUserItemModel,
} from "@umbraco-cms/backoffice/user";
import type { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type {
  UMB_DOCUMENT_WORKSPACE_CONTEXT,
  UmbDocumentWorkspaceContext,
} from "@umbraco-cms/backoffice/document";
import {
  getHistoryTagStyleAndText,
  WorkflowAuditLogRepository,
  WorkflowAuditTimeOptions,
  type WorkflowEntityTypes,
  type WorkflowAuditLogServerDataSourceConstructor,
  type WorkflowAuditLogModel,
} from "@umbraco-workflow/core";

export class WorkflowWorkspaceViewInfoHistoryBaseElement extends UmbLitElement {
  @state()
  _currentPageNumber = 1;

  @state()
  _totalPages = 1;

  @state()
  private _items: Array<WorkflowAuditLogModel> = [];

  #workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  #auditLogRepository: WorkflowAuditLogRepository;
  #entityType: WorkflowEntityTypes;

  #pagination = new UmbPaginationManager();
  #userItemRepository = new UmbUserItemRepository(this);
  #userMap = new Map<string, UmbUserItemModel>();

  constructor(
    workspaceContextAlias:
      | string
      | UmbContextToken<UmbDocumentWorkspaceContext>,
    dataSource: WorkflowAuditLogServerDataSourceConstructor,
    entityType: WorkflowEntityTypes
  ) {
    super();

    this.#entityType = entityType;
    this.#auditLogRepository = new WorkflowAuditLogRepository(this, dataSource);

    this.#pagination.setPageSize(10);

    this.observe(
      this.#pagination.currentPage,
      (number) => (this._currentPageNumber = number)
    );
    this.observe(
      this.#pagination.totalPages,
      (number) => (this._totalPages = number)
    );

    this.consumeContext(workspaceContextAlias, (instance) => {
      if (!instance) return;
      this.#workspaceContext = instance;
      this.#requestAuditLogs();
    });
  }

  async #requestAuditLogs() {
    const unique = this.#workspaceContext?.getUnique();
    if (!unique) throw new Error("Unique is required");

    const { data } = await this.#auditLogRepository.requestAuditLog({
      unique,
      skip: this.#pagination.getSkip(),
      take: this.#pagination.getPageSize(),
    });

    if (data) {
      this._items = data.items;
      this.#pagination.setTotalItems(data.total);
      this.#requestAndCacheUserItems();
    }
  }

  #onPageChange(event: UUIPaginationEvent) {
    this.#pagination.setCurrentPageNumber(event.target?.current);
    this.#requestAuditLogs();
  }

  async #requestAndCacheUserItems() {
    const allUsers = this._items
      ?.map((item) => item.user.unique)
      .filter(Boolean) as string[];
    const uniqueUsers = [...new Set(allUsers)];
    const uncachedUsers = uniqueUsers.filter(
      (unique) => !this.#userMap.has(unique)
    );

    // If there are no uncached user items, we don't need to make a request
    if (uncachedUsers.length === 0) return;

    const { data: items } = await this.#userItemRepository.requestItems(
      uncachedUsers
    );

    if (items) {
      items.forEach((item) => {
        // cache the user item
        this.#userMap.set(item.unique, item);
        this.requestUpdate("_items");
      });
    }
  }

  #renderHistory() {
    if (this._items && this._items.length) {
      return html`
        <umb-history-list>
          ${repeat(
            this._items,
            (item) => item.timestamp,
            (item) => {
              const { text, style } = getHistoryTagStyleAndText(
                item.logType,
                this.#entityType
              );
              const user = this.#userMap.get(item.user.unique);

              return html`<umb-history-item
                .name=${user?.name ?? "Unknown"}
                .detail=${this.localize.date(
                  item.timestamp,
                  WorkflowAuditTimeOptions
                )}
              >
                <umb-user-avatar
                  slot="avatar"
                  .name=${user?.name}
                  .kind=${user?.kind}
                  .imgUrls=${user?.avatarUrls ?? []}
                ></umb-user-avatar>

                <span class="log-type">
                  <uui-tag look=${style.look} color=${style.color}>
                    ${this.localize.term(text.label, item.parameters)}
                  </uui-tag>
                  ${this.localize.term(text.desc, item.parameters)}
                </span>
              </umb-history-item>`;
            }
          )}
        </umb-history-list>
      `;
    } else {
      return html`${this.localize.term("content_noItemsToShow")}`;
    }
  }

  #renderPagination() {
    return html`
      ${this._totalPages > 1
        ? html`
            <uui-pagination
              class="pagination"
              .current=${this._currentPageNumber}
              .total=${this._totalPages}
              @change=${this.#onPageChange}
            ></uui-pagination>
          `
        : nothing}
    `;
  }

  override render() {
    return html`<uui-box>
      <umb-localize slot="headline" key="general_history">History</umb-localize>
      ${this._items
        ? this.#renderHistory()
        : html`<uui-loader-circle></uui-loader-circle> `}
      ${this.#renderPagination()}
    </uui-box> `;
  }

  static override styles = [
    UmbTextStyles,
    css`
      uui-loader-circle {
        font-size: 2rem;
      }

      uui-tag uui-icon {
        margin-right: var(--uui-size-space-1);
      }

      .log-type {
        flex-grow: 1;
        gap: var(--uui-size-space-2);
      }

      uui-pagination {
        flex: 1;
        display: inline-block;
      }

      .pagination {
        display: flex;
        justify-content: center;
        margin-top: var(--uui-size-layout-1);
      }
    `,
  ];
}
