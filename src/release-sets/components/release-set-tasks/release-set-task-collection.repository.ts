import type { UmbCollectionRepository } from "@umbraco-cms/backoffice/collection";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowReleaseSetComponentCollectionRepository } from "../release-set-component-repository-base.element.js";
import type { ComponentCollectionFilter } from "../../entities.js";

export class WorkflowReleaseSetTaskCollectionRepository
  extends WorkflowReleaseSetComponentCollectionRepository
  implements UmbCollectionRepository
{
  constructor(host: UmbControllerHost) {
    super(host);
  }

  async requestCollection(filter: ComponentCollectionFilter) {
    const tasks = await this.requestComponentCollection(
      (context) => context.tasks
    );

    return this.page(tasks, filter);
  }
}

export default WorkflowReleaseSetTaskCollectionRepository;
