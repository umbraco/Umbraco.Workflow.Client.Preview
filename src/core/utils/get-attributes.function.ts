export function getAttributes(
  arg: {
    hidden: boolean;
    readonly: boolean;
    requiresLicense: boolean;
  },
  isTrial
) {
  const obj = {
    "?hidden": arg.hidden,
    "?unlicensed": arg.requiresLicense && isTrial === true,
  };

  if (arg.readonly || (arg.requiresLicense && isTrial === true)) {
    obj["inert"] = true;
  }

  return obj;
}
