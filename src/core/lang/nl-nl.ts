import type { UmbLocalizationDictionary } from "@umbraco-cms/backoffice/localization-api";

export default {
  workflow: {
    action: (suffix = "") => `Actie ${suffix}`,
    active: "actief",
    activity: "Workflow-activiteit",
    addComment: "Opmerking toevoegen",
    addCondition: "Voorwaarde toevoegen",
    addFile: "Bestand toevoegen",
    addStatus: "Status toevoegen",
    addWorkflowGroups: "Voeg workflow beoordelingsgroep(en) toe",
    all: "Alles",
    allSettingsHidden:
      "Alle instellingen zijn verborgen - neem contact op met uw sitebeheerder",
    approvalGroups: "Beoordelingsgroepen",
    approvalRejection: "Afgewezen",
    approvalRequest: (documentName?: string) =>
      `Aanvraag voor goedkeuring ${documentName ? `- ${documentName}` : ""}`,
    approve: "Goedkeuren",
    approved: "Goedgekeurd",
    approvedAndCompleted: "Goedgekeurd en afgerond",
    approvedAndCompletedForScheduler: "Goedgekeurd en voltooid voor planning",
    asAdmin: "als admin",
    assignTo: "Afgewezen taak toewijzen",
    attachment: "Bijlage",
    averageApproval: "Gemiddeld",
    awaitingResubmission: "In afwachting van herindiening",
    buyLicense: "Schaf een licentie aan",
    buyLicensePrompt:
      "Om toegang te krijgen tot geavanceerde functies en om groepslimieten te verwijderen, dient u een licentie aan te schaffen.",
    cancelled: "Geannuleerd",
    cancelledbythirdparty: "Geannuleerd door derde partij",
    cancelledWithError: "Verwerking geannuleerd wegens fout",
    changeDescription: "Omschrijving aanpassen",
    changeDescriptionDetail: "%0% aangevraagd door %1% on %2% op %3%",
    commentMaxLength:
      "Opmerking max. lengte overschreden - limiet is %0% tekens",
    completedByAdmin: "Fase voltooid door beheerder",
    completedDate: "Datum voltooid",
    configuration: "Configuratie",
    confirmUnlockMessage:
      "Weet u zeker dat u de geplande publicatie voor dit document wilt annuleren? De hangende wijzigingen blijven behouden en kunnen desgewenst onmiddellijk worden gepubliceerd.",
    documentApprovalFlow: "Content beoordelingsflow",
    contentReview: "Inhoud beoordeling",
    createdDate: "Aanmaakdatum",
    currentPageInheritsFrom: (inheritsFrom: string) =>
      `Het huidige document neemt over van <strong>${inheritsFrom}</strong>`,
    dateRange: "Bereik (days)",
    deleteGroupWarning: `<h4>Voorzichtig! Dit is een destructieve actie.</h4>
                  <p>Als u een groep verwijdert, worden alle lopende taken en workflows waarvan de groep deelnemer is, geannuleerd en worden alle aan de groep toegewezen machtigingen verwijderd.</p><p>Als u wilt verwijderen, typt u hieronder <strong>%0%</strong>.</p>`,
    describeChanges: "Beschrijf de wijzigingen",
    diffHelp: `De bovenstaande tabel toont de verschillen tussen de huidige gepubliceerde versie en de openstaande wijzigingen voor deze workflow.<br /><br />
                      <del>Rode tekst</del> zal worden verwijderd. <ins>Groene tekst</ins> zal worden toegevoegd.`,
    diffNoVersions:
      "Kan geen versies vinden om te vergelijken. Misschien zijn ze verwijderd? Probeer de Rollback-tool van Umbraco om alle beschikbare wijzigingsgeschiedenis voor dit item te bekijken.",
    diffVariants:
      "De actieve workflow bevat meerdere inhoudsvarianten. Selecteer hieronder de taal om de wijzigingen voor elke variant te bekijken.",
    docIsActive: "Document bevindt zich momenteel in een workflow",
    documentApprovalFlows: "Documenttype beoordelingen",
    documentTypeApprovalFlows: "Documenttype beoordelingsflows",
    editButton: "Ga naar node",
    emailGroup: "Email groep",
    emailTemplates: "E-mail sjablonen",
    errored: "Fouten",
    excludedNodeAlert: "Document is uitgesloten van workflow",
    expired: "Verlopen",
    explicit: "Foo",
    fastestApproval: "Snelste beoordeling",
    groupHasNoMembers: "Groep heeft geen leden",
    groupPermissionsRemoved: "Groepsrechten verwijderd",
    groupWorkflowsCancelled: "Groepsworkflows geannuleerd",
    hasChanged: "is aangepast",
    historyFor: "Workflowgeschiedenis voor %0%",
    implicit: "Bar",
    include: "Bevat",
    inherited: "geërfd",
    inheritedApprovalFlow: "Overgenomen goedkeuringsflow",
    inheritedMembership: "Overgenomen groepslidmaatschap",
    installedVersion: (version: string) =>
      `Geïnstalleerde versie van Umbraco Workflow: <strong>${version}</strong>`,
    invariantWorkflow: "Invariante workflow",
    invariantWorkflowDescription: `Inhoudsvarianten zonder lopende workflows worden verzonden voor publicatie, met behulp van de workflow die is ingesteld op de standaardtaal (%0%).`,
    licensedFeature: "Voor deze functie is een licentie vereist.",
    licenseImpersonationActive:
      "De licentie-imitatie van de workflow is actief. Alle functies zijn alleen beschikbaar op niet-productiedomeinen.",
    lockedPendingRelease: "Inhoud vergrendeld voor geplande release",
    membership: "Groepsleden",
    most: "Meeste",
    mySubmissions: "Mijn bijdragen",
    myTasks: "Taken die mijn goedkeuring vereisen",
    newNodeConfig:
      "Nieuwe nodes moeten worden opgeslagen voordat de workflow wordt geconfigureerd",
    noApproval: "GOEDKEURING NIET VEREIST",
    noDocumentFlow: "Geen document goedkeuringsflow ingesteld voor dit document",
    noDocumentTypeFlow: "Geen documenttypes flow ingesteld voor %0%",
    noGroup: "GROEP NIET GEVONDEN",
    noInheritedFlow:
      "Er bestaat geen overgenomen beoordelingsworkflow voor dit document",
    none: "Geen",
    noNode: "NODE NIET GEVONDEN",
    notrequired: "Niet verplicht",
    noUser: "GEBRUIKER NIET GEVONDEN",
    now: "Nu",
    one: "Een",
    optional: "Optioneel",
    originalEditor: "Oorspronkelijke redacteur",
    outOfDate: "Workflow is verouderd.",
    overview: "Overzicht",
    pageSize: "Aantal items",
    pendingapproval: "In afwachting van goedkeuring",
    pendingApproval: "In afwachting van goedkeuring",
    pendingForNode: "In afwachting %0% workflow voor '%1%'",
    pendingResubmission: "In afwachting van herindiening",
    plusMore: (count: number) => `en ${count} meer`,
    previousGroup: "Vorige goedkeuringsgroep",
    publishButton: "Publicatie aanvragen",
    publishUnlockedDocument: "Publiceer een ontgrendeld document",
    reject: "Afwijzen",
    rejected: "Afgewezen",
    reminder: `Herinnering`,
    removeAll: "Alles verwijderen",
    requestedBy: "Aangevraagd door",
    requestedOn: "Aangevraagd op",
    requiredApprovals: "Vereiste goedkeuringen",
    resubmit: "Opnieuw indienen",
    resubmitted: "Opnieuw ingediend",
    roles: "Rollen",
    scheduled: "Gepland",
    scheduleDescription:
      "Als de geplande datum verstrijkt voordat de workflow is voltooid, worden de wijzigingen gepubliceerd wanneer de laatste workflow is goedgekeurd.",
    scheduledForAt: "Gepland voor %0% op %1% op %2%",
    schedulePassed:
      "Geplande datum verstreken voordat de workflow werd voltooid. Inhoud wordt vrijgegeven wanneer de huidige workflow is voltooid.",
    scheduling: "Plannen",
    selectVariants: (plural) => "Selecteer talen",
    settingsHiddenOrReadonly:
      "%0% instellingen zijn verborgen of alleen-lezen - neem contact op met uw sitebeheerder",
    showDiff: "Bekijk verschillen",
    slowestApproval: "Langzaamste beoordeling",
    some: "Sommige",
    stage: (idx?: number) => (!idx ? "Fase" : `Fase ${idx}`),
    status1: "Goedgekeurd",
    status2: "Afgekeurd",
    status3: "In afwachting",
    status4: "Niet verplicht",
    status5: "Geannuleerd",
    status6: "Fouten",
    status7: "Opnieuw ingediend",
    status8: "Geannuleerd door derde partij",
    status9: "Uitgesloten",
    toAdmin: "Beheerder",
    toAll: "Alles",
    toAuthor: "Auteur",
    toGroup: "Groep",
    unlockButton: "Ontgrendelen",
    unpublishButton: "Verzoek tot depublicatie",
    updateAvailable: "Update beschikbaar",
    userCannotAction:
      "De huidige gebruiker heeft geen toestemming om de workflow uit te voeren.",
    viewAttachment: "Bekijk bijlage",
    when: "wanneer",
    workflow: "Workflow",
    workflowActivity: "Workflow-activiteit",
    workflowCancelled: "Workflow geannuleerd",
    workflowErrored: "Workflow is mislukt",
    xOfYApprovalsCompleted: "%0% van %1% vereiste goedkeuringen voltooid",
  },
  workflow_settings: {
    adminCanEdit: "Administrators kunnen bewerken",
    adminCanEditDescription:
      "Zet deze optie aan om beheerders in staat te stellen inhoud in elk stadium van een workflow te bewerken",
    allowAttachments: "Bijlagen toestaan",
    allowAttachmentsDescription:
      "Zet deze optie aan om het toevoegen van een media-item toe te staan bij het starten van een workflow",
    allowScheduling: "Plannen toestaan",
    allowSchedulingDescription:
      "Zet deze optie aan om het plannen van publicatie toe te staan bij het starten van een workflow",
    approvalThreshold: "Goedkeuringsdrempel",
    approvalThresholdDescription:
      "Hoeveel groepsleden moeten elke workflowtaak goedkeuren?",
    approvalThresholdDescriptionExtended: `<p>Dit is een standaardwaarde en kan worden overschreven bij het configureren van afzonderlijke workflows.</p><ul>
      <li><strong>Een</strong>: elk lid van de beoordelingsgroep kan de taak goedkeuren.</li>
      <li><strong>Meeste</strong>: een absolute meerderheid van de leden van de beoordelingsgroep moet de taak goedkeuren.</li>
      <li><strong>Alle</strong>: alle leden van de beoordelingsgroep moeten de taak goedkeuren.</li></ul>`,
    configureApprovalThreshold: "Sta configureren van goedkeuringsdrempel toe",
    configureApprovalThresholdDescription:
      "Schakel het instellen van de goedkeuringsdrempel in voor elke fase van een workflow",
    documentTypeApprovalFlows: "Document Type beoordelingsflow",
    documentTypeApprovalFlowsDescription:
      "Configureer standaard workflows voor alle knooppunten van een bepaald documenttype",
    documentTypeApprovalsDescription:
      "Deze workflows zijn alleen van toepassing op het opgegeven documenttype",
    editUrl: "Site-URL bewerken",
    editUrlDescription:
      "Site-URL bewerken voor weergave in e-mailmeldingen (bijv. http://edit.mydomain.com)",
    email: "Workflow e-mail",
    emailDescription: "VAN-adres voor e-mailmeldingen",
    excludeNodes: "Nodes uitsluiten",
    excludeNodesDescription:
      "Nodes (en hun afstammelingen) die hier worden geselecteerd, worden NIET opgenomen in de workflow en keren terug naar de standaard Umbraco-acties",
    extendPermissions: "Machtigingen uitbreiden",
    extendPermissionsDescription:
      "Zet deze optie aan de standaard machtigingen voor opslaan en publiceren van gebruikers uit te breiden. Als deze optie uit staat, wordt de knop Opslaan en publiceren verwijderd",
    flowTypeDescription:
      "Bepaalt hoe de oorspronkelijke auteur wordt beheerd in volgende taken",
    flowTypeDescriptionExtended: `<ul>
      <li><strong>Expliciet</strong>: vereist dat alle stappen worden goedgekeurd, inclusief stappen waarbij de oorspronkelijke wijzigingsauteur een groepslid is.</li>
      <li><strong>Impliciete</strong>: automatische goedkeuring van stappen waarbij de auteur lid is van de beoordelingsgroep.</li>
      <li><strong>Uitsluiten</strong>: gedraagt zich vergelijkbaar met Expliciet, maar sluit de oorspronkelijke auteur uit van meldingen (dwz de auteur kan zijn eigen werk niet goedkeuren)</li></ul>`,
    groupEmail: "Groeps e-mail",
    groupEmailDescription:
      "Meldingen worden naar dit adres gestuurd in plaats van naar groepsleden",
    lockIfActive: "Vergrendel actieve inhoud",
    lockIfActiveDescription:
      "Zet deze optie aan om bewerkingen te voorkomen terwijl inhoud zich in een workflow bevindt",
    mandatoryComments: "Verplichte opmerkingen",
    mandatoryCommentsDescription:
      "Zet deze optie aan om opmerkingen over workflows verplicht te maken",
    newNodeApprovalFlow: "Nieuwe goedkeuringsflow voor nodes",
    newNodeApprovalFlowDescription:
      "Alle nieuwe nodes gebruiken deze workflow voor de eerste publicatie",
    nodeApprovalFlows: "Documenttype beoordelingen",
    nodeApprovalFlowsDescription:
      "Deze workflows zijn alleen van toepassing voor de opgegeven node",
    rejectionResetsApprovals: "Afwijzing stelt beoordeling opnieuw in",
    rejectionResetsApprovalsDescription:
      "Zet deze optie aan, als de goedkeuringsdrempel is ingesteld op Meest of Alle, om eerdere goedkeuringen te resetten wanneer een workflowfase wordt afgewezen",
    reminderDelay: "Herinneringsvertraging (dagen)",
    reminderDelayDescription:
      "Stel hier het aantal dagen in voor herinneringsmails voor inactieve taken. Zet op 0 om uit te schakelen",
    requireUnpublish: "Gebruik de workflow om te depubliceren",
    requireUnpublishDescription:
      "Zet deze optie aan om workflowgoedkeuring te vereisen bij het ongedaan maken van de publicatie van inhoud",
    scheduledContentLock: "Geplande inhoud vergrendelen",
    scheduledContentLockDescription:
      "Stel deze in op true om bewerkingen te voorkomen terwijl de inhoud in afwachting is van geplande publicatie",
    scheduledContentLockDescriptionExtended: `<p>
Vergrendelde inhoud kan pas worden bewerkt als de geplande releasedatum is verstreken. Vergrendelingen kunnen worden vrijgegeven door Workflow-beheerders.</p><ul>
      <li><strong>Geen</strong>: geplande inhoud is nooit vergrendeld.</li>
      <li><strong>Workflow</strong>: inhoud die is gepland via workflowgoedkeuring is vergrendeld.</li>
      <li><strong>Alles</strong>: alle geplande inhoud is vergrendeld.</li></ul>`,
    sendNotifications: "Meldingen verzenden",
    sendNotificationsDescription:
      "Zet deze optie aan om e-mailmeldingen te verzenden",
    sendTo: "Verzenden naar",
    sendToDescription: `<ul>
      <li><strong>Alle</strong> verzendt naar alle leden van alle groepen tot en met de huidige taak</li>
      <li><strong>Admin</strong> bevat de systeem-e-mail</li>
      <li><strong>Auteur</strong> bevat de redacteur die de workflow heeft geïnitieerd</li>
      <li><strong>Groep</strong> stuurt naar de groep die verantwoordelijk is voor de huidige taak</li>
      <li>Dubbele gebruikers worden verwijderd</li>
    </ul>`,
    settingsEmailDescription:
      "Beide onderstaande velden zijn optioneel en worden ingevuld met het huidige domein als ze niet zijn ingesteld. Stel deze velden in als de openbare productiesite wordt bediend vanuit een ander domein dan de backoffice van Umbraco (meestal een load-balanced/distributed omgeving). Als dat u niet bekend voorkomt, laat u deze blanco",
    siteUrlDescription:
      "Live site-URL voor opname in e-mailmeldingen (bijv. http://www.mijndomein.com)",
  },
  workflowNotifications: {
    approved: "Workflow voltooid.",
    approvedLog: "Workflow goedgekeurd door %0% op %1% [%2%].",
    cancelled: "%0% verzoek is geannuleerd.",
    cancelledLog: "%0% verzoek voor %1% [%2%] geannuleerd door %3%.",
    initiate: "%0% ingediend voor %1% beoordeling.",
    initiateScheduled: "Wijzigingen gepland voor %2% %0% bij %1%.",
    pageHasBeen: "Pagina is %0%",
    pendingApproval:
      "Taak afgerond. Pagina zal %0% zijn na voltooiing van de workflow.",
    pendingApprovalLog: "Workflow %0% taak op %1% [%2%] goedgekeurd door %3%.",
    pendingApprovalResubmit:
      "Wijzigingen opnieuw ingediend. Pagina zal %0% zijn na voltooiing van de workflow.",
    pendingApprovalResubmitLog:
      "%0% verzoek voor %1% [%2%] is opnieuw ingediend door %3%.",
    rejected: "%0% verzoek is afgewezen.",
    rejectedLog: "%0% verzoek voor %1% [%2%] afgewezen door %3%.",
  },
  treeHeaders: {
    active: "Actieve workflows",
    approvalGroups: "Beoordelingsgroepen",
    contentReviews: "Inhoud beoordelingen",
    history: "Geschiedenis",
    settings: "Instellingen",
  },

  contentReviews: {
    contentItemReviewed: "Inhoud is gemarkeerd als beoordeeld",
    contentItemReviews: "Beoordelingen van inhoudsitems",
    contentItemReviewsDescription:
      "Configureer recensies voor individuele items",
    contentRequiresReview: "De inhoud moet worden beoordeeld",
    contentRequiresReviewDescription:
      "Inhoud vereist beoordeling op of vóór %0%",
    contentReviewActivity: "Inhoudsbeoordelingsactiviteit",
    contentReviews: "Inhoud beoordelingen",
    currentPageInheritsReview: `Het huidige document neemt over van <strong>%0%</strong> (via %1% configuratie) voor <strong>inhoudsreviews</strong>.`,
    docTypeReview: "Instellingen voor beoordeling van het documenttype",
    documentTypeReviews: "Documenttypes beoordelingen",
    documentTypeReviewsDescription:
      "Configureer beoordelingen voor alle nodes van een bepaald documenttype",
    enableContentReviews: "Inhoudsbeoordelingen inschakelen",
    enableContentReviewsDescription:
      "Moeten gebruikers eraan worden herinnerd hun inhoud te beoordelen?",
    externalReviewers: "Externe recensenten",
    externalReviewersDescription:
      "Door puntkomma's gescheiden lijst met e-mailadressen. Deze mogen niet worden gekoppeld aan CMS-gebruikers.",
    force: "Kracht",
    forceDescription: "True om bestaande beoordelingsdatums te overschrijven",
    generateRelativeTo: "Genereer beoordelingsdatums ten opzichte van",
    lastReviewed: "Laatst beoordeeld",
    markAsReviewed: "Markeer als beoordeeld",
    nextReviewDue: "Volgende beoordeling komt eraan",
    noContentReviewGroup:
      "Er is geen inhoudsbeoordelingsgroep ingesteld voor dit document",
    nodeReview: "Instellingen voor beoordeling van inhoudsitems",
    noReviewableNodes: "Geen beoordeelbare nodes gevonden",
    publishIsReview: "Publiceren behandelen als een beoordeling?",
    publishIsReviewDescription:
      "Moet gepubliceerde inhoud worden behandeld als een beoordeling, of moet de inhoud een expliciete beoordeling vereisen",
    reminderThreshold: "Herinneringsdrempel (dagen)",
    reminderThresholdDescription:
      "Beoordelingsmeldingen worden zoveel dagen voor de beoordelingsdatum verzonden. Standaard is 1",
    reviewConfigDeleted: "Configuratie van contentreview verwijderd",
    reviewGroup: "Beoordelingsgroep",
    reviewOverlayPeriod: "Deze inhoud moet elke %0% dagen worden beoordeeld.",
    reviewPeriod: "Beoordelingsperiode (dagen)",
    reviewPeriodDescription:
      "Maximale tijdsperiode tussen vereiste inhoudsbeoordelingen",
    saveAndRegenerate: "Opslaan en regenereren",
    saveReviewConfigMessage:
      "Dit kan even duren - door op te slaan wordt de einddatum voor de beoordeling gegenereerd voor alle inhoud die kan worden beoordeeld, wat een groot aantal nodes kan zijn.",
    staleContent: "Verouderde inhoud",
  },
  workflowCleanup: {
    cleanupEnabled: "Geschiedenis opschonen ingeschakeld",
    contentRules: "Regels voor het opschonen van inhoud",
    daysToKeepHistory: "Dagen om de workflow geschiedenis bij te houden",
    docTypeRules: "Regels voor opschonen van documenttypen",
    globalSettings: "Algemene opschooninstellingen",
    rulesUpdated:
      "Regels voor het opschonen van workflow geschiedenis bijgewerkt",
    statusesToDelete: "Workflowstatussen om te verwijderen",
  },
  workflowSearch: {
    addContentTypes: "Inhoudstype(s) toevoegen",
    addDataType: "Gegevenstype toevoegen",
    addProperties: "Eigenschappen toevoegen",
    addProperty: "Eigenschap toevoegen",
    addPropertyEditor: "Eigenschappeneditor toevoegen",
    allProperties: "Alle eigendommen",
    datatype: "Data Type",
    emptyFieldSearch: "Zoek naar een leeg veld",
    emptyFieldSearchDescription: "Het zoeken naar lege velden kan kostbaar zijn en langer duren dan verwacht",
     fuzzy: "Geschatte zoekopdracht",
    fuzzyDescription:
      "Met zoeken bij benadering kunt u termen vinden die nauw aansluiten bij de zoekterm, rekening houdend met kleine variaties",
    propertyEditor: "Eigendomseditor",
    selectContentTypes: "Selecteer inhoudstype(s)",
    selectSearchFields: "Selecteer zoekvelden",
    selectSearchType: "Selecteer zoektype",
    showBaseProperties: "Toon basiseigenschappen",
    singleProperty: "Enkel eigendom",
    someProperties: "Enkele eigenschappen",
  },
} as UmbLocalizationDictionary;
