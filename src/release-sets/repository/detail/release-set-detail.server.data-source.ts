import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { UmbDetailDataSource } from "@umbraco-cms/backoffice/repository";
import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UmbId } from "@umbraco-cms/backoffice/id";
import { RELEASESET_ENTITY_TYPE } from "../../constants.js";
import {
  type ReleaseSetDetailResponseModelReadable,
  ReleaseSetsService,
  ReleaseSetStatusModel,
} from "@umbraco-workflow/generated";

export class WorkflowReleaseSetDetailServerDataSource
  extends UmbControllerBase
  implements UmbDetailDataSource<ReleaseSetDetailResponseModelReadable>
{
  constructor(host: UmbControllerHost) {
    super(host);
  }

  async read(unique: string) {
    if (!unique) throw new Error("Release Set ID is missing");
    const { data, error } = await tryExecute(
      this,
      ReleaseSetsService.getReleaseSetById({
        path: { id: unique },
      })
    );

    if (error || !data) {
      return { error };
    }

    return { data };
  }

  list(skip = 0, take = 5, filter?) {
    return tryExecute(
      this,
      ReleaseSetsService.getReleaseSet({ query: { skip, take, filter } })
    );
  }

  async createScaffold() {
    return {
      data: {
        unique: UmbId.new(),
        createDate: null,
        itemCount: 0,
        status: ReleaseSetStatusModel.DRAFT,
        entityType: RELEASESET_ENTITY_TYPE,
        collaborators: [],
        items: [],
        tasks: [],
        owner: {
          unique: (await this.#getCurrentUser())?.unique,
        },
      },
    };
  }

  async #getCurrentUser() {
    const context = await this.getContext(UMB_CURRENT_USER_CONTEXT);

    if (!context) {
      throw new Error("Context not found: UMB_CURRENT_USER_CONTEXT");
    }

    return await firstValueFrom(context.currentUser);
  }

  async create(set: ReleaseSetDetailResponseModelReadable) {
    if (!set) {
      throw new Error("Release Set is missing");
    }

    const { data, error } = await tryExecute(
      this,
      ReleaseSetsService.postReleaseSet({ body: set })
    );

    if (data) {
      return this.read(set.unique);
    }

    return { error };
  }

  async update(set: ReleaseSetDetailResponseModelReadable) {
    if (!set.unique) {
      throw new Error("Release Set ID is missing");
    }

    const { data, error } = await tryExecute(
      this,
      ReleaseSetsService.putReleaseSetById({
        path: { id: set.unique },
        body: set,
      })
    );

    if (data) {
      return this.read(set.unique);
    }

    return { error };
  }

  async delete(key: string) {
    if (!key) throw new Error("Key is missing");
    return tryExecute(
      this,
      ReleaseSetsService.deleteReleaseSetById({ path: { id: key } })
    );
  }
}
