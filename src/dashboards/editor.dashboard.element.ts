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
  ContentReviewService,
  InstanceService,
} from "@umbraco-workflow/generated";

const elementName = "workflow-editor-dashboard";

@customElement(elementName)
export class EditorDashboardElement extends UmbElementMixin(LitElement) {
  #defaultPerPage = 5;

  @state()
  _approvalsModel: TableQueryModel = {
    count: this.#defaultPerPage,
    page: 1,
    handler: InstanceService.postInstanceAssignedTo,
  };

  @state()
  _submissionsModel: TableQueryModel = {
    count: this.#defaultPerPage,
    page: 1,
    handler: InstanceService.postInstanceInitiatedBy,
  };

  @state()
  _contentReviewsModel: TableQueryModel = {
    count: this.#defaultPerPage,
    page: 1,
    hiddenColumns: ["period", "reviewGroup"],
    handler: ContentReviewService?.postContentReviewNodes,
  };

  @state()
  _perPageApprovals = this.#defaultPerPage;
  @state()
  _perPageSubmissions = this.#defaultPerPage;
  @state()
  _perPageReviews = this.#defaultPerPage;

  constructor() {
    super();

    this.#fetchApprovals();
    this.#fetchSubmissions();
    this.#fetchReviews();
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

  #fetchApprovals(event?: CustomEvent) {
    this._perPageApprovals =
      (event?.target as PageSizeDropdownElement)?.value ??
      this._perPageApprovals;

    this._approvalsModel.count = this._perPageApprovals;
  }

  #fetchSubmissions(event?: CustomEvent) {
    this._perPageSubmissions =
      (event?.target as PageSizeDropdownElement)?.value ??
      this._perPageSubmissions;

    this._submissionsModel.count = this._perPageSubmissions;
  }

  #fetchReviews(event?: CustomEvent) {
    this._perPageReviews =
      (event?.target as PageSizeDropdownElement)?.value ?? this._perPageReviews;

    this._contentReviewsModel.count = this._perPageReviews;
  }

  render() {
    return html` <uui-box .headline=${this.localize.term("workflow_myTasks")}>
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
