import {
  UmbPathPattern,
  UmbPathPatternParamsType,
} from "@umbraco-cms/backoffice/router";
import { umbUrlPatternToString } from "@umbraco-cms/backoffice/utils";
import { WORKFLOW_INVARIANT } from "../constants.js";

export class WorkflowPathPattern<
  LocalParamsType extends UmbPathPatternParamsType = UmbPathPatternParamsType,
  BaseParamsType = LocalParamsType
> extends UmbPathPattern {
  #local: string;
  #base: string;

  constructor(localPattern: string, basePath?: UmbPathPattern | string) {
    super(localPattern, basePath);
    this.#local = localPattern;

    basePath = basePath?.toString() ?? "";
    this.#base =
      basePath.lastIndexOf("/") !== basePath.length - 1
        ? basePath + "/"
        : basePath;
  }

  override generateAbsolute(params: LocalParamsType & BaseParamsType) {
    return (
      (this.#base.indexOf(":") !== -1
        ? umbUrlPatternToString(this.#base, this.#updateCulture(params))
        : this.#base) +
      umbUrlPatternToString(this.#local, this.#updateCulture(params))
    );
  }

  override generateLocal(params: LocalParamsType) {
    return umbUrlPatternToString(this.#local, this.#updateCulture(params));
  }

  #updateCulture(params: LocalParamsType) {
    if (params.culture === "*") {
      return { ...params, culture: WORKFLOW_INVARIANT };
    }

    return params;
  }
}
