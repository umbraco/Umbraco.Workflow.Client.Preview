export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "localization",
    alias: "Workflow.Localization.En",
    weight: -100,
    name: "English",
    meta: {
      culture: "en",
    },
    js: () => import("./en.js"),
  },
  {
    type: "localization",
    alias: "Workflow.Localization.Da-DK",
    weight: -100,
    name: "Dansk (Danmark)",
    meta: {
      culture: "da-dk",
    },
    js: () => import("./da-dk.js"),
  },
  {
    type: "localization",
    alias: "Workflow.Localization.It-IT",
    weight: -100,
    name: "italiano",
    meta: {
      culture: "it-it",
    },
    js: () => import("./it-it.js"),
  },
  {
    type: "localization",
    alias: "Workflow.Localization.Nl-NL",
    weight: -100,
    name: "Nederlands",
    meta: {
      culture: "nl-nl",
    },
    js: () => import("./nl-nl.js"),
  },
  {
    type: "localization",
    alias: "Workflow.Localization.Ar",
    weight: -100,
    name: "Arabic",
    meta: {
      culture: "ar",
    },
    js: () => import("./ar.js"),
  },
    {
    type: "localization",
    alias: "Workflow.Localization.Fr",
    weight: -100,
    name: "French",
    meta: {
      culture: "fr",
    },
    js: () => import("./fr.js"),
  },
];
