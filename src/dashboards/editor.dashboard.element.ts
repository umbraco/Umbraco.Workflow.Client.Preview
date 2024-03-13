import {
  LitElement,
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { TableQueryModel } from "../types.js";
import type { PageSizeDropdownElement } from "@umbraco-workflow/components";
import {
  ContentReviewResource,
  InstanceResource,
} from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

const elementName = "workflow-editor-dashboard";

@customElement(elementName)
export class EditorDashboardElement extends UmbElementMixin(LitElement) {
  #defaultPerPage = 5;
  #workflowContext?: typeof WORKFLOW_CONTEXT.TYPE;
  #meta?: {
    userId: string,
    isAdmin: boolean,
  }

  @state()
  _approvalsModel!: TableQueryModel;
  @state()
  _submissionsModel!: TableQueryModel;
  @state()
  _contentReviewsModel!: TableQueryModel;

  @state()
  _perPageApprovals = this.#defaultPerPage;
  @state()
  _perPageSubmissions = this.#defaultPerPage;
  @state()
  _perPageReviews = this.#defaultPerPage;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      this.#workflowContext = instance;
      this.#observeWorkflowVariables();
    });
  }

  //async connectedCallback() {
  //   // subscribe to signalr magick only for updating task lists - everything else
  //   // comes from angular events. there's the outside chance of concurrent workflow changes
  //   // but there's also the same possibility in Umbraco's save/publish, so not too concerned.
  //   this.workflowHub.initHub((hub) => {
  //     hub.on("refresh", (data) => {
  //       // scope may be destroyed before this resolves, so model won't exist
  //       if (data?.includes(this.user.id)) {
  //         this.#fetch();
  //       }
  //     });

  //     hub.start();
  //   });

  //   // hub isn't super reliable, so do it manually instead in response to any workflow task
  //   // completed by the current user. signalr will still broadcast other users actions
  //   this.onWorkflowActioned = this.eventsService.on(
  //     constants.events.workflowActioned,
  //     (_, data) => {
  //       this.#fetch();
  //     }
  //   );
  // this.#fetch();
  //}

  #observeWorkflowVariables() {
    if (!this.#workflowContext) return;

    this.observe(this.#workflowContext.globalVariables, (variables) => {
      if (!variables) return;
      this.#meta = {
        isAdmin: variables?.currentUserIsAdmin ?? false,
        userId: variables?.currentUserUnique ?? "",
      }
      this.#fetchApprovals();
      this.#fetchSubmissions();
      this.#fetchReviews();
    });
  }

  #fetchApprovals(event?: CustomEvent) {
    this._perPageApprovals =
      (event?.target as PageSizeDropdownElement)?.value ??
      this._perPageApprovals;

    this._approvalsModel = {
      count: this._perPageApprovals,
      page: 1,
      handler: InstanceResource.postInstanceAssignedTo,
      meta: this.#meta,
    };
  }

  #fetchSubmissions(event?: CustomEvent) {
    this._perPageSubmissions =
      (event?.target as PageSizeDropdownElement)?.value ??
      this._perPageSubmissions;

    this._submissionsModel = {
      count: this._perPageSubmissions,
      page: 1,
      handler: InstanceResource.postInstanceInitiatedBy,
      meta: this.#meta,
    };
  }

  #fetchReviews(event?: CustomEvent) {
    this._perPageReviews =
      (event?.target as PageSizeDropdownElement)?.value ?? this._perPageReviews;

    this._contentReviewsModel = {
      count: this._perPageReviews,
      page: 1,
      hiddenColumns: ["period", "reviewGroup"],
      handler: ContentReviewResource?.getContentReviewNodes,
      meta: this.#meta,
    };
  }

  render() {
    return html` <uui-box>
        <div slot="headline">${this.localize.term("workflow_myTasks")}</div>
        <workflow-page-size
          slot="header-actions"
          @change=${this.#fetchApprovals}
          .value=${this._perPageApprovals}
        ></workflow-page-size>
        <workflow-instances-table
          .model=${this._approvalsModel}
        ></workflow-instances-table>
       </uui-box>
      <uui-box>
        <div slot="headline">
          ${this.localize.term("workflow_mySubmissions")}
        </div>
        <workflow-page-size
          slot="header-actions"
          @change=${this.#fetchSubmissions}
          .value=${this._perPageSubmissions}
        ></workflow-page-size>
        <workflow-instances-table
          .model=${this._submissionsModel}
        ></workflow-instances-table>
      </uui-box>
      <uui-box>
        <div slot="headline">
          ${this.localize.term("contentReviews_staleContent")}
        </div>
        <workflow-page-size
          slot="header-actions"
          @change=${this.#fetchReviews}
          .value=${this._perPageReviews}
        ></workflow-page-size>
        </div>
        <content-reviews-table
          .model=${this._contentReviewsModel}
        ></content-reviews-table>
      </uui-box>`;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
      }

      uui-box + * {
        margin-top: var(--uui-size-layout-1);
      }
    `,
  ];
}

export default EditorDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: EditorDashboardElement;
  }
}
