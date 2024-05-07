import type { SettingsStatusModel } from "@umbraco-workflow/core";
import type {
  ContentReviewsSettingsModel,
  GeneralSettingsModel,
  NotificationsSettingsModel,
  SettingsPropertyDisplayModel,
} from "@umbraco-workflow/generated";

/**
 * Determine if some, all or none of the provided items are hidden or readonly
 * */
export function noneSomeAll(
  param:
    | GeneralSettingsModel
    | NotificationsSettingsModel
    | ContentReviewsSettingsModel
): SettingsStatusModel {
  const topLevelItems = Object.values(param).filter(
    (x) => !Array.isArray(x)
  ) as SettingsPropertyDisplayModel[];

  const hiddenReadonlyFilter = (x) => x.hidden || x.readonly;

  const someDisabled =
    param.properties?.some(hiddenReadonlyFilter) ||
    topLevelItems.some(hiddenReadonlyFilter);

  const allDisabled =
    (param.properties?.every(hiddenReadonlyFilter) ?? false) &&
    topLevelItems.every(hiddenReadonlyFilter);

  const allHidden =
    (param.properties?.every((x) => x.hidden) ?? false) &&
    topLevelItems.every((x) => x.hidden);

  return {
    someDisabled,
    allDisabled,
    allHidden,
  };
}
