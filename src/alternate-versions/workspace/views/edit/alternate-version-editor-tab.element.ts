import {
  css,
  html,
  customElement,
  property,
  state,
  repeat,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UmbContentTypeContainerStructureHelper,type 
  UmbPropertyTypeContainerModel,
} from "@umbraco-cms/backoffice/content-type";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../../context/alternate-version-workspace.context-token.js";

import "./alternate-version-editor-properties.element.js";

const elementName = "alternate-version-workspace-view-edit-tab";

@customElement(elementName)
export class AlternateVersionWorkspaceViewEditTabElement extends UmbLitElement {
  @property({ type: String })
	public get containerId(): string | null | undefined {
		return this._containerId;
	}
	public set containerId(value: string | null | undefined) {
		this._containerId = value;
		this.#groupStructureHelper.setContainerId(value);
	}
	@state()
	private _containerId?: string | null;

	#groupStructureHelper = new UmbContentTypeContainerStructureHelper(this);

	@state()
	_groups: Array<UmbPropertyTypeContainerModel> = [];

	@state()
	_hasProperties = false;

	constructor() {
		super();

		this.consumeContext(WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT, (workspaceContext) => {
			if (!workspaceContext) return;
			this.#groupStructureHelper.setStructureManager(workspaceContext.structure);
		});
		this.observe(this.#groupStructureHelper.mergedContainers, (groups) => {
			this._groups = groups;
		});
		this.observe(this.#groupStructureHelper.hasProperties, (hasProperties) => {
			this._hasProperties = hasProperties;
		});
	}

	override render() {
		return html`
			${this._hasProperties
				? html`
						<uui-box>
							<alternate-version-workspace-view-edit-properties
								class="properties"
								.containerId=${this._containerId}></alternate-version-workspace-view-edit-properties>
						</uui-box>
				  `
				: ''}
			${repeat(
				this._groups,
				(group) => group.id,
				(group) =>
					html`<uui-box .headline=${this.localize.string(group.name) ?? ''}>
						<alternate-version-workspace-view-edit-properties
							class="properties"
							.containerId=${group.id}></alternate-version-workspace-view-edit-properties>
					</uui-box>`,
			)}
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			uui-box {
				--uui-box-default-padding: 0 var(--uui-size-space-5);
			}
			uui-box:not(:first-child) {
				margin-top: var(--uui-size-layout-1);
			}
		`,
	];
}

export default AlternateVersionWorkspaceViewEditTabElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: AlternateVersionWorkspaceViewEditTabElement;
  }
}
