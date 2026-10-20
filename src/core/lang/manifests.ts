export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "localization",
    alias: "Workflow.Localization.En",
    weight: -100,
    name: "Workflow Localization - English",
    meta: {
      culture: "en",
    },
    js: () => import("./en.js"),
  },
  {
    type: "localization",
    alias: "Workflow.Localization.Da",
    weight: -100,
    name: "Workflow Localization - Danish",
    meta: {
      culture: "da",
    },
    js: () => import("./da.js"),
  },
  {
    type: "localization",
    alias: "Workflow.Localization.It",
    weight: -100,
    name: "Workflow Localization - Italian",
    meta: {
      culture: "it",
    },
    js: () => import("./it.js"),
  },
  {
    type: "localization",
    alias: "Workflow.Localization.Nl",
    weight: -100,
    name: "Workflow Localization - Dutch",
    meta: {
      culture: "nl",
    },
    js: () => import("./nl.js"),
  },
  {
    type: "localization",
    alias: "Workflow.Localization.Ar",
    weight: -100,
    name: "Workflow Localization - Arabic",
    meta: {
      culture: "ar",
    },
    js: () => import("./ar.js"),
  },
    {
    type: "localization",
    alias: "Workflow.Localization.Fr",
    weight: -100,
    name: "Workflow Localization - French",
    meta: {
      culture: "fr",
    },
    js: () => import("./fr.js"),
  },
    {
    type: "localization",
    alias: "Workflow.Localization.Se",
    weight: -100,
    name: "Workflow Localization - Swedish",
    meta: {
      culture: "se",
    },
    js: () => import("./se.js"),
  },
];
