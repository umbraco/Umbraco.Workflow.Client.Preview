import { UmbPathPattern } from "@umbraco-cms/backoffice/router";

const BASE = new UmbPathPattern<{ base: string }>(":base");

export const WORKFLOW_EDIT_ALTERNATEVERSION_WORKSPACE_PATH_PATTERN =
  new UmbPathPattern<{
    base: string;
    unique: string;
  }>("edit/:unique", BASE);

export const WORKFLOW_CREATE_ALTERNATEVERSION_WORKSPACE_PATH_PATTERN =
  new UmbPathPattern<{
    base: string;
    unique: string;
    culture?: string | null;
    segment?: string | null;
  }>("create/:unique/:culture/:segment", BASE);
