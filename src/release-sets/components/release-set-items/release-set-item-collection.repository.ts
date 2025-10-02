import type { UmbCollectionRepository } from "@umbraco-cms/backoffice/collection";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowReleaseSetComponentCollectionRepository } from "../release-set-component-repository-base.element.js";
import type { ComponentCollectionFilter } from "../../entities.js";

export class WorkflowReleaseSetItemCollectionRepository
  extends WorkflowReleaseSetComponentCollectionRepository
  implements UmbCollectionRepository
{
  constructor(host: UmbControllerHost) {
    super(host);
  }

  async requestCollection(filter: ComponentCollectionFilter) {
    const items = await this.requestComponentCollection(
      (context) => context.items
    );

    return this.page(items, filter);
  }
}

export default WorkflowReleaseSetItemCollectionRepository;
