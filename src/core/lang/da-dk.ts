import type { UmbLocalizationDictionary } from "@umbraco-cms/backoffice/localization-api";

export default {
  workflow: {
    action: (suffix = "") => `Muligheder ${suffix}`,
    active: "aktiv",
    activity: "Workflow aktivitet",
    addComment: "Tilføj kommentar",
    addCondition: "Tilføj betingelse",
    addFile: "Tilføj fil",
    addStatus: "Tilføj status",
    approvalGroups: "Godkendelsesgrupper",
    approvalRejection: "Afvisning af godkendelse",
    approvalRequest: (documentName?: string) =>
      `Godkendelsesanmodning ${documentName}`,
    approve: "Godkend",
    approved: "Godkendt",
    approvedAndCompleted: "Godkendt og afsluttet",
    approvedAndCompletedForScheduler: "Godkendt og afsluttet til planlægning",
    asAdmin: "som administrator",
    attachment: "Vedhæftet fil (valgfri)",
    averageApproval: "Gennemsnit",
    awaitingResubmission: "Afventer genanmodning",
    buyLicense: "Køb licens",
    cancelled: "Aflyst",
    cancelledbythirdparty: "Annulleret af tredjepart",
    changeDescription: "Skift beskrivelse",
    changeDescriptionDetail: "%0% efterspurgt af %1% på %2% på %3%",
    commentMaxLength:
      "Maks længde på kommentar overskredet - grænsen er %0% tegn",
    completedDate: "Afsluttet dato",
    configuration: "Konfiguration",
    confirmUnlockMessage:
      "Er du sikker på, at du vil annullere den planlagte udgivelse af dette dokument? De afventende ændringer vil blive bibeholdt og kan eventuelt offentliggøres med det samme.",
    createdDate: "Oprettet dato",
    currentPageInheritsFrom: (inheritsFrom: string) =>
      `Denne dokument nedarver fra <strong>${inheritsFrom}</strong>`,
    dateRange: "Interval (dage)",
    deleteGroupWarning: `
  			<h4>Forsigtig! Dette er en destruktiv handling.</h4>
          <p>Sletning af en gruppe annullerer alle afventende opgaver og arbejdsgange, hvor gruppen er en deltager, og vil slette alle tilladelser, der er tildelt gruppen.</p><p>For at slette skal du skrive %0% nedenfor.</p>
  		`,
    describeChanges: "Beskrivelse af ændringerne",
    detail: "Detaljer",
    detailButton: "Workflow detaljer",
    diffHelp: `Tabellen her over viser forskellen på det aktuelle publicerede indhold og de afventende ændringer i workflowet.<br /><br />
            <del>Rød tekst</del> vil blive fjernet. <ins>Grøn tekst</ins> vil blive tilføjet.`,
    diffNoVersions:
      'Kunne ikke finde en version at sammenligne med. Måske er de blevet slettet? Prøv Umbraco\'s "Fortryd ændringer" funktion for at se alle tidligere ændringer for denne node.',
    diffVariants:
      "Det aktive workflow indeholder flere varianter. Vælg sprog her under for at se ændringerne til hver variant.",
    docIsActive: "Noden er i et workflow",
    documentApprovalFlow: "Dokument godkendelser",
    documentTypeApprovalFlow: "Dokumenttype godkendelsesflow",
    editButton: "Gå til node",
    emailGroup: "Email gruppe",
    errored: "Der opstod en fejl",
    fastestApproval: "Hurtigste",
    filters: "Filtre",
    groupPermissionsRemoved: "Gruppetilladelser fjernet",
    groupWorkflowsCancelled: "Gruppearbejdsgange annulleret",
    hasChanged: "har ændret",
    historyFor: "Workflow historik til %0%",
    include: "Omfatte",
    inherited: "nedarvet",
    inheritedApprovalFlow: "Nedarvet godkendelsesflow",
    inheritedMembership: "Nedarvede grupper",
    lastDays: "sidste %0% dage",
    licensing: "Licens",
    lockedPendingRelease:
      "Dokumentet er planlagt til udgivelse og kan ikke redigeres",
    membership: "Gruppemedlemmer",
    mySubmissions: "Mine ændringsanmodninger",
    myTasks: "Ændringer der kræver min godkendelse",
    noApproval: "GODKENDELSE IKKE PÅKRÆVET",
    noDocumentFlow: "Ingen dokument godkendelsesflow sat for dette dokument",
    noDocumentTypeFlow: "Ingen dokumenttype godkendelsflows er sat ",
    noGroup: "GRUPPEN IKKE FUNDET",
    noInheritedFlow:
      "Der er ikke nogle nedarvede godkendelsesflow for denne node",
    none: "Ingen",
    noNode: "NODE IKKE FUNDET",
    notrequired: "Ikke påkrævet",
    noUser: "BRUGER IKKE FUNDET",
    now: "Nu",
    overview: "Oversigt",
    pageSize: "Sidestørrelse",
    pendingapproval: "Afventer godkendelse",
    pendingApproval: "Afventende godkendelser",
    pendingForNode: "Verserende %0% arbejdsgang til '%1%'",
    pendingResubmission: "Afventer genindsendelse",
    plusMore: (count: number) => `plus ${count} mere`,
    publishButton: "Anmod om publicering",
    publishUnlockedDocument: "Udgiv ulåst dokument",
    reject: "Afvis",
    rejected: "Afvist",
    reminder: "Påmindelse",
    removeAll: "Fjern alle",
    requestedBy: "Anmodet af",
    requestedOn: "Dato for anmodning",
    resubmit: "Genanmod",
    resubmitted: "Genindsendt",
    roles: "Roller",
    scheduled: "Planlagt",
    scheduleDescription:
      "Hvis den planlagte publiceringsdato er overskredet inden workflowet er afsluttet, vil ændringerne bliver publiceret når den sidste gruppe i workflowet her godkendt ændringerne.",
    scheduledForAt: "Planlagt til %0% på %1% på %2%",
    schedulePassed:
      "Planlagt publiceringsdato er overskredet før workflowet var afsluttet. Ændringerne vil blive publiceret når workflowet er afsluttet.",
    scheduling: "Planlæg",
    selectDocumentTypes: (plural) => "Dokumenttype",
    selectVariants: (plural) => "Vælg sprog",
    settingsSaved: "Indstillinger opdateret",
    showDiff: "Vis verschillen",
    slowestApproval: "Langsomst",
    stage: (idx?: number) => (!idx ? "Trin" : `Trin ${idx}`),
    status1: "Godkendt",
    status2: "Afvist",
    status3: "Afventer godkendelse",
    status4: "Ikke påkrævet",
    status5: "Aflyst",
    status6: "Der opstod en fejl",
    status7: "Genindsendt",
    status8: "Annulleret af tredjepart",
    toAdmin: "Administrator",
    toAll: "Alle",
    toAuthor: "Forfatter",
    toGroup: "Gruppe",
    unlockButton: "Lås op",
    unpublishButton: "Anmod om afpublicering",
    updateAvailable: "Update available",
    userCannotAction:
      "Aktuelle bruger har ikke rettigheder til at administrere workflowet.",
    viewAttachment: "Vis vedhæftede fil",
    when: "hvornår",
    workflow: "Workflow",
    workflowActivity: "Workflow aktivitet",
    workflowCancelled: "Workflow aflyst",
    workflowErrored: "Workflow fejlede",
  },
  workflow_settings: {
    allowAttachments: "Tillad vedhæftede filer",
    allowAttachmentsDescription:
      "Tillader af referere en mediefil når der startes et workflow",
    documentTypeApprovalFlows: "Dokumenttype godkendelsesflow",
    documentTypeApprovalFlowsDescription:
      "Tilføjer standard workflows for alle noder af en given dokumenttype",
    editUrl: "Backoffice webadresse",
    editUrlDescription:
      "Backoffice site URL som bruges i email notifikationer (f.eks. http://edit.mydomain.com)",
    email: "Workflow email",
    emailDescription: "Afsender adresse for email notifikationer",
    excludeNodes: "Ekskluder noder",
    excludeNodesDescription:
      "Noder (og deres underliggende noder) der vælges her vil ikke blive inkluderet i workflows, og vil fungere som standard Umbraco noder",
    flowType: "Flowtype",
    flowTypeDescription:
      "Angiver hvordan den originale redaktør er håndteret i efterfølgende flows",
    flowTypeDescriptionExtended: `  
    <ul>
      <li><strong>Explicit</strong>: kræver at alle grupper bliver godkendt, inklusiv grupper hvor den originale redaktør er medlem af.</li>
      <li><strong>Implicit</strong>: auto-godkender grupper hvor den originale redaktør er medlem af.</li>
      <li><strong>Exclude</strong>: fungerer lige som Explicit, men undlader at notificere den originale redaktør (dvs. redaktøren kan ikke godkende sit eget arbejde).</li></ul>`,
    groupEmail: "Group email",
    groupEmailDescription:
      "Notifikationer vil blive sendt to denne adresse i stedet for gruppemedlemmerne",
    lockIfActive: "Lås aktivt indhold",
    lockIfActiveDescription:
      "Angiver om en node kan redigeres mens den er i et aktivt workflow.",
    multiVariant: "Multi-variant",
    multiVariantDesc:
      "Sprog uden afventende arbejdsgange vil blive sendt til udgivelse ved hjælp af arbejdsgangen på hvert sprog.",
    requireUnpublish: "Brug workflow ved afpublicér",
    requireUnpublishDescription: "Skal afpublicér kræver workflow godkendelse?",
    scheduledContentLock: "Lås planlagt indhold",
    scheduledContentLockDescription:
      "Indstil til sand for at forhindre redigeringer, mens indhold afventer planlagt udgivelse",
    scheduledContentLockDescriptionExtended: `<p>Låst indhold kan ikke redigeres, før den planlagte udgivelsesdato er passeret. Låse kan frigives af Workflow-administratorer.</p><ul>
      <li><strong>Ingen</strong>: Planlagt indhold er aldrig låst.</li>
      <li><strong>Workflow</strong>: indhold planlagt via workflow-godkendelse er låst.</li>
      <li><strong>Alle</strong>: alt planlagt indhold er låst.</li></ul>`,
    sendNotifications: "Send notifikationer",
    sendNotificationsDescription:
      "Skal der sendes email notifikationer til godkendelsesgrupper?",
    sendTo: "Send til",
    siteUrl: "Websteds URL",
    siteUrlDescription:
      "site URL som bruges i email notifikationer (f.eks. http://www.mydomain.com)",
  },
  workflowNotifications: {
    approved: "Workflow afsluttet.",
    approvedLog: "Workflow godkendt af %0% på %1% [%2%]",
    cancelled: "%0% anmodningen er annulleret.",
    cancelledLog: "%0% anmodning om %1% [%2%] annulleret af %3%.",
    initiate: "%0% indsendt til %1% godkendelse.",
    initiateScheduled: "Ændringer planlagt til %2% %0% på %1%.",
    pageHasBeen: "Siden har været %0%",
    pendingApproval:
      "Opgave afsluttet. Side bliver %0% efter afslutning af workflow.",
    pendingApprovalLog: "Workflow %0% opgave den %1% [%2%] godkendt af %3%.",
    pendingApprovalResubmit:
      "ændringer genindsendt. Side bliver %0% efter afslutning af workflow.",
    pendingApprovalResubmitLog:
      "%0% blev sendt igen af %1% [%2%] blev indsendt af %3%.",
    rejected: "%0% anmodning er blevet afvist.",
    rejectedLog: "%0% anmodning om %1% [%2%] afvist af %3%.",
  },
  treeHeaders: {
    active: "Aktiv workflows",
    approvalGroups: "Godkendelsesgrupper",
    history: "Historie",
    settings: "Indstillinger",
  },
} as UmbLocalizationDictionary;
