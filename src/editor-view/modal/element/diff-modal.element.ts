import {
  css,
  customElement,
  html,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UmbModalBaseElement,
} from "@umbraco-cms/backoffice/modal";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import * as Diff from "diff";
import type { WorkflowDiffModalData } from "../token/index.js";
import type {
  WorkflowContentDiffModel,
  WorkflowDiffPropertyModel,
} from "@umbraco-workflow/generated";
import { InstanceService } from "@umbraco-workflow/generated";

interface WorkflowDiff {
  label: string;
  diff: Array<Diff.Change>;
  isObject: boolean;
}

const elementName = "workflow-diff-modal";

@customElement(elementName)
export class WorkflowDiffModalElement extends UmbModalBaseElement<WorkflowDiffModalData> {
  currentVersions?: Array<WorkflowContentDiffModel>;
  workflowVersions?: Array<WorkflowContentDiffModel>;

  currentVersion?: WorkflowContentDiffModel;
  workflowVersion?: WorkflowContentDiffModel;

  diffs: Array<WorkflowDiff> = [];

  #handleClose() {
    this.modalContext?.reject();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#getDiff();
  }

  async #getDiff() {
    const { data } = await tryExecuteAndNotify(
      this,
      InstanceService.getInstanceDiff({ guid: this.data?.instanceKey })
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
    this.diffs = [];

    if (this.currentVersion?.name !== this.workflowVersion?.name) {
      this.diffs.push({
        label: "Name",
        diff: Diff.diffWords(
          this.currentVersion?.name || "",
          this.workflowVersion?.name || ""
        ),
        isObject: false,
      });
    }

    const valuestring = (x: WorkflowDiffPropertyModel) =>
      (x.value = x.value + "");

    const valueObject = (x: WorkflowDiffPropertyModel) => {
      if (x.value instanceof Object) {
        x.value = JSON.stringify(x.value, null, 1);
        return true;
      }

      return false;
    };

    // extract all properties from the tabs and create new object for the diff
    // TODO => diff json if data is object
    this.workflowVersion?.tabs?.forEach((tab, tabIndex) => {
      tab.properties?.forEach((workflowProperty, propertyIndex) => {
        const currentProperty = this.currentVersion?.tabs
          ?.at(tabIndex)
          ?.properties?.at(propertyIndex) ?? { value: "" };

        let isObject = false;

        // we have to make properties storing values as object into strings (Grid, nested content, etc.)
        isObject = valueObject(workflowProperty);
        isObject = valueObject(currentProperty);

        // diff requires a string
        valuestring(workflowProperty);
        valuestring(currentProperty);

        this.diffs.push({
          label: workflowProperty.label ?? "",
          diff: Diff.diffWords(<string>currentProperty.value, <string>workflowProperty.value),
          isObject,
        });
      });
    });
  }

  #hasDiffs() {
    const filter = (x: WorkflowContentDiffModel) => x.name && x.tabs?.length;
    return (
      this.workflowVersions?.some(filter) && this.currentVersions?.some(filter)
    );
  }

  // TODO => verify this when variants are working
  #variantDiff(e) {
    const filter = (x) => x.language!.isoCode === e.target.value;

    this.workflowVersion = this.workflowVersions?.find(filter);
    this.currentVersion = this.currentVersions?.find(filter);

    // if no current version, assume it's an unpublished variant, so all values are new
    if (!this.currentVersion) {
      this.currentVersion = {
        name: "",
        tabs: [],
        language: { name: "", isoCode: "" },
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
            <small>
              <umb-localize key="workflow_diffVariants"
                >The active workflow includes multiple content variants. Select
                the language below to view the changes for each
                variant.</umb-localize
              >
            </small>
            <uui-select
              .options=${this.workflowVersions!.map((x) => ({
                name: x.language!.name!,
                value: x.language!.isoCode!,
              }))}
              @change=${this.#variantDiff}
            ></uui-select>
          `
        )}
        ${when(
          this.#hasDiffs(),
          () => html`
            <uui-table>
              ${this.diffs.map(
                (diff) => html` <uui-table-row>
                  <uui-table-cell class="bold">${diff.label}</uui-table-cell>
                  <uui-table-cell
                    class="${diff.isObject ? "pre-line" : "word-wrap"}"
                  >
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

            <small>
              <umb-localize key="workflow_diffHelp">
                The table above shows the differences between the current
                published version and the pending changes in this workflow.<br /><br />
                <del>Red text</del> will be removed. <ins>Green text</ins> will
                be added.
              </umb-localize>
            </small>
          `,
          () => html`<workflow-alert
            .key=${"workflow_diffNoVersions"}
          ></workflow-alert> `
        )}
      </div>
      <div slot="actions">
        <uui-button
          id="close"
          label="Close"
          @click="${this.#handleClose}"
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }

  static styles = [
    css`
      small {
        display: block;
      }

      uui-table {
        margin-bottom: var(--uui-size-space-6);
      }

      .bold {
        font-weight: bold;
      }

      .pre-line {
        white-space: pre-line;
      }

      .word-wrap {
        word-break: break-all;
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
