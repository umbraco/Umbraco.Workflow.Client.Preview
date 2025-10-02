import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/workspace";
import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type {
  UmbPropertyDatasetElement,
  UmbPropertyValueData,
} from "@umbraco-cms/backoffice/property";
import { spread } from "@open-wc/lit-helpers";
import { WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT } from "../content-reviews-workspace.context-token.js";
import type { ContentReviewsSettingsModel } from "@umbraco-workflow/generated";
import { WorkspaceWithSettingsViewBaseElement } from "@umbraco-workflow/core";

const elementName = "workflow-content-reviews-settings-workspace-view";

@customElement(elementName)
export class WorkflowContentReviewsSettingsWorkspaceViewElement
  extends WorkspaceWithSettingsViewBaseElement
  implements UmbWorkspaceViewElement
{
  #workspaceContext?: typeof WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT.TYPE;

  @state()
  settings?: ContentReviewsSettingsModel;

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT,
      (instance) => {
        if (!instance) return;
        this.#workspaceContext = instance;

        this.observe(this.#workspaceContext.settings, (settings) => {
          if (!settings) return;
          this.settings = settings;
        });
      }
    );
  }

  #renderContentItemReviews() {
    if (!this.settings) return;

    return html`<uui-box
      ${spread(this.getAttributes(this.settings.contentItemReviews))}
    >
      <div slot="headline">
        ${this.localize.term("contentReviews_contentItemReviews")}
        <small
          >${this.localize.term(
            "contentReviews_contentItemReviewsDescription"
          )}</small
        >
      </div>

      <workflow-content-reviews-config-list
        .type=${"document"}
      ></workflow-content-reviews-config-list>
    </uui-box>`;
  }

  #renderDocumentTypeReviews() {
    if (!this.settings) return;

    return html`<uui-box
      ${spread(this.getAttributes(this.settings.documentTypeReviews))}
    >
      <div slot="headline">
        ${this.localize.term("contentReviews_documentTypeReviews")}
        <small
          >${this.localize.term(
            "contentReviews_documentTypeReviewsDescription"
          )}</small
        >
      </div>
      <workflow-content-reviews-config-list
        .type=${"documentType"}
      ></workflow-content-reviews-config-list>
    </uui-box>`;
  }

  #onDataChange(e: Event) {
    const newValue = (e.target as UmbPropertyDatasetElement).value;
    this.settings?.properties.forEach((p) => {
      this.#workspaceContext?.setPropertyValue(
        newValue.find((x) => x.alias === p.alias)?.value,
        p.alias
      );
    });
  }

  render() {
    if (!this.settings) return;

    return html`<workflow-license-alert></workflow-license-alert>
      ${this.renderNoneSomeAllBanner()}
      <div id="flexyboi">
        <uui-box headline=${this.localize.term("general_general")}>
          <umb-property-dataset
            .value=${this.settings.properties as Array<UmbPropertyValueData>}
            @change=${this.#onDataChange}
          >
            ${this.settings.properties.map(
              (p) =>
                html`<umb-property
                  .label=${this.localize.term(p.label)}
                  .description=${this.localize.term(p.label + "Description")}
                  .config=${p.config}
                  alias=${p.alias}
                  property-editor-ui-alias=${p.editorUiAlias}
                ></umb-property>`
            )}
          </umb-property-dataset>
        </uui-box>
        <div id="sidebar">
          ${this.#renderContentItemReviews()}
          ${this.#renderDocumentTypeReviews()}
        </div>
      </div>`;
  }

  static styles = [...WorkspaceWithSettingsViewBaseElement.styles];
}

export default WorkflowContentReviewsSettingsWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowContentReviewsSettingsWorkspaceViewElement;
  }
}
