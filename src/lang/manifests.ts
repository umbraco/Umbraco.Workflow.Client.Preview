import type { ManifestLocalization } from '@umbraco-cms/backoffice/extension-registry';

const localizationManifests: Array<ManifestLocalization> = [
    {
        type: 'localization',
        alias: 'Workflow.Localization.En_US',
        weight: -100,
        name: 'English (US)',
        meta: {
            culture: 'en-us',
        },
        js: () => import('./en-us.js'),
    },
    {
        type: 'localization',
        alias: 'Workflow.Localization.Da_DK',
        weight: -100,
        name: 'Dansk (Danmark)',
        meta: {
            culture: 'da-dk',
        },
        js: () => import('./da-dk.js'),
    },
];
export const manifests = [...localizationManifests];