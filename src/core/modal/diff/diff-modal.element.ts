import {
  css,
  customElement,
  html,
  repeat,
  unsafeHTML,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { diffWords, type UmbDiffChange } from "@umbraco-cms/backoffice/utils";
import {
  ContentService,
  type WorkflowContentDiffModel,
} from "@umbraco-workflow/generated";
import type { WorkflowDiffModalData } from "./diff-modal.token.js";

interface WorkflowDiff {
  label: string;
  alias: string;
  diff: Array<UmbDiffChange>;
}

const elementName = "workflow-diff-modal";

@customElement(elementName)
export class WorkflowDiffModalElement extends UmbModalBaseElement<WorkflowDiffModalData> {
  currentVersions?: Array<WorkflowContentDiffModel>;
  workflowVersions?: Array<WorkflowContentDiffModel>;

  currentVersion?: WorkflowContentDiffModel;
  workflowVersion?: WorkflowContentDiffModel;

  diffs: Array<WorkflowDiff> = [];

  connectedCallback() {
    super.connectedCallback();
    this.#getDiff();
  }

  async #getDiff() {
    const { data } = await tryExecute(
      this,
      ContentService.getContentDiff({
        query: { guid: this.data?.instanceKey },
      })
    );

    if (!data) {
      return;
    }

    this.currentVersions = data.currentVariants;
    this.workflowVersions = data.workflowVariants;

    if (this.currentVersions?.length === 1) {
      this.currentVersion = this.currentVersions?.at(0);
    }

    if (this.workflowVersions?.length === 1) {
      this.workflowVersion = this.workflowVersions?.at(0);
    }

    if (this.workflowVersion && this.currentVersion) {
      this.#createDiff();
      this.requestUpdate();
    }
  }

  #createDiff() {
    this.diffs = [
      {
        label: this.localize.term("general_name"),
        alias: "name",
        diff: diffWords(
          this.currentVersion?.name || "",
          this.workflowVersion?.name || ""
        ),
      },
    ];

    // extract all properties from the tabs and create new object for the diff
    this.workflowVersion?.properties?.forEach(
      (workflowProperty, propertyIndex) => {
        const currentProperty = this.currentVersion?.properties?.at(
          propertyIndex
        ) ?? { value: "" };

        if (workflowProperty.value === null && currentProperty.value === null) {
          return;
        }

        this.diffs.push({
          label: workflowProperty.label ?? "",
          alias: workflowProperty.alias ?? "",
          diff: diffWords(
            `${currentProperty.value}`,
            `${workflowProperty.value}`
          ),
        });
      }
    );
  }

  #hasDiffs() {
    const filter = (x: WorkflowContentDiffModel) =>
      x.name && x.properties?.length;
    return (
      this.workflowVersions?.some(filter) && this.currentVersions?.some(filter)
    );
  }

  #variantDiff(e) {
    const filter = (x) => x.language!.isoCode === e.target.value;

    this.workflowVersion = this.workflowVersions?.find(filter);
    this.currentVersion = this.currentVersions?.find(filter);

    // if no current version, assume it's an unpublished variant, so all values are new
    if (!this.currentVersion) {
      this.currentVersion = {
        name: "",
        properties: [],
        language: { name: "", culture: "" },
      };
    }

    this.#createDiff();
  }

  render() {
    return html`<umb-body-layout
      headline=${this.localize.term("workflow_showDiff")}
    >
      <div id="main">
        ${when(
          (this.workflowVersions?.length ?? 0) > 1,
          () => html`
            ${this.localize.term("workflow_diffVariants")}

            <uui-select
              .options=${this.workflowVersions?.map((x) => ({
                name: x.language!.name!,
                value: x.language!.culture,
              })) ?? []}
              @change=${this.#variantDiff}
            ></uui-select>
          `
        )}
        ${when(
          this.#hasDiffs(),
          () => html`
            ${unsafeHTML(this.localize.term("workflow_diffHelp"))}
            <uui-table>
              ${repeat(
                this.diffs,
                (diff) => diff,
                (diff) => html` <uui-table-row>
                  <uui-table-cell
                    ><span class="bold">${diff.label}</span
                    ><small>${diff.alias}</small></uui-table-cell
                  >
                  <uui-table-cell>
                    ${diff.diff.map(
                      (part) => html`<span>
                        ${when(
                          part.added,
                          () => html`<ins>${part.value}</ins>`
                        )}
                        ${when(
                          part.removed,
                          () => html`<del>${part.value}</del>`
                        )}
                        ${when(
                          !part.added && !part.removed,
                          () => html`<span>${part.value}</span>`
                        )}
                      </span>`
                    )}
                  </uui-table-cell>
                </uui-table-row>`
              )}
            </uui-table>
          `,
          () => html`<workflow-alert
            .key=${"workflow_diffNoVersions"}
          ></workflow-alert> `
        )}
      </div>
      <uui-button
        slot="actions"
        label=${this.localize.term("general_close")}
        @click=${this._rejectModal}
      ></uui-button>
    </umb-body-layout>`;
  }

  static styles = [
    css`
      small {
        display: block;
      }

      uui-table {
        margin-top: var(--uui-size-space-6);
      }

      ins,
      .diff-added {
        background-color: #00c43e63;
      }

      .diff-removed,
      del {
        background-color: #ff35356a;
      }

      .bold {
        font-weight: bold;
      }
    `,
  ];
}

export default WorkflowDiffModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowDiffModalElement;
  }
}
