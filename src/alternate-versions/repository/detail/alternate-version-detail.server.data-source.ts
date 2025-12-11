import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { UmbDetailDataSource } from "@umbraco-cms/backoffice/repository";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UmbId } from "@umbraco-cms/backoffice/id";
import { ALTERNATEVERSION_ENTITY_TYPE } from "../../constants.js";
import {
  AlternateVersionStatusModel,
  VersionsService,
  type AlternateVersionDetailResponseModel,
} from "@umbraco-workflow/generated";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { WORKFLOW_INVARIANT } from "@umbraco-workflow/core";

export class WorkflowAlternateVersionDetailServerDataSource
  extends UmbControllerBase
  implements UmbDetailDataSource<AlternateVersionDetailResponseModel>
{
  #documentWorkspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;

  constructor(host: UmbControllerHost) {
    super(host);

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      this.#documentWorkspaceContext = context;
    }).skipHost();
  }

  #cultureMapper(culture?: string | null) {
    return culture === WORKFLOW_INVARIANT ? undefined : culture ?? undefined;
  }

  async read(unique: string) {
    if (!unique) throw new Error("Unique is missing");

    // culture and segment can safely be set here, as they are not independent of the
    // selected document. EG if the document is en-US, the version request will always be en-US.
    const activeVariant =
      this.#documentWorkspaceContext?.splitView.getActiveVariants()?.[0];

    const culture = activeVariant?.culture ?? undefined;
    const segment = activeVariant?.segment ?? undefined;

    const { data, error } = await tryExecute(
      this,
      VersionsService.getVersionById({
        path: { id: unique },
        query: { culture: this.#cultureMapper(culture), segment },
      })
    );

    if (error || !data) {
      return { error };
    }

    return { data };
  }

  async createScaffold(
    preset?: Partial<
      AlternateVersionDetailResponseModel & { culture?: string | null }
    >
  ) {
    if (!preset?.parentUnique) throw new Error("Parent unique is missing");

    return {
      data: {
        unique: UmbId.new(),
        parentUnique: preset?.parentUnique,
        entityType: ALTERNATEVERSION_ENTITY_TYPE,
        status: "Draft" as AlternateVersionStatusModel,
        isStatusUpdate: false,
        versionName: null,
        documentName: preset?.documentName,
        createDate: null,
        variant: this.#cultureMapper(preset.culture),
        segment: preset.segment ?? null,
        updateDate: null,
        values: [],
        sets: [],
        icon: preset.icon ?? "icon-documents",
      },
    };
  }

  async create(version: AlternateVersionDetailResponseModel) {
    const { error } = await tryExecute(
      this,
      VersionsService.postVersion({ body: version })
    );

    if (!error) {
      return this.read(version.unique);
    }

    return { error };
  }

  async update(version: AlternateVersionDetailResponseModel) {
    if (!version.unique) {
      throw new Error("Unique is missing");
    }

    const { error } = await tryExecute(
      this,
      VersionsService.putVersionById({
        path: { id: version.unique },
        body: version,
      })
    );

    return { error };
  }

  async delete(key: string) {
    const { data, error } = await tryExecute(
      this,
      VersionsService.deleteVersionById({ path: { id: key } })
    );

    return { data, error };
  }
}
