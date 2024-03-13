import type { UmbLocalizationDictionary } from "@umbraco-cms/backoffice/localization-api";

export default {
  dashboardTabs: {
    workflow: "Workflow",
  },
  sections: {
    workflow: "Workflow",
  },
  workflow: {
    ok: "Ok",
    go: "Kør",
    active: "aktiv",
    activeWorkflow: "Aktiv workflow",
    activity: "Workflow aktivitet",
    add: "Tilføj",
    action: "Muligheder",
    asAdmin: "som administrator",
    byAdmin: "by administrator",
    admin: "Admin",
    administrator: "Administrator",
    approve: "Godkend",
    editButton: "Gå til node",
    cancel: "Anuller",
    dismiss: "Afvis",
    reject: "Afvis",
    save: "Gem",
    resubmit: "Genanmod",
    removeAll: "Fjern alle",
    publishButton: "Anmod om publicering",
    unpublishButton: "Anmod om afpublicering",
    detail: "Detaljer",
    detailButton: "Workflow detaljer",
    actionWorkflow: "Administrer workflow",
    initiateWorkflow: "Start workflow",
    dateRange: "Interval (dage)",
    configuration: "Konfiguration",
    viewType: "Visningstype",
    flowType: "Flowtype",
    showAll: "Vis alle",
    unlimited: "ubegrænset",
    selectNode: "Vælg node",
    selectUser: "Vælg bruger",
    describeChanges: "Beskrivelse af ændringerne",
    addComment: "Tilføj kommentar",
    commentMaxLength:
      "Maks længde på kommentar overskredet - grænsen er %0% tegn",
    commentRemaining: "%0% tegn tilbage",
    requestedBy: "Anmodet af",
    requestedOn: "Dato for anmodning",
    createdDate: "Oprettet dato",
    completedDate: "Afsluttet dato",
    pendingApproval: "Afventende godkendelser",
    awaitingResubmission: "Afventer genanmodning",
    plusMore: "plus %0% mere",
    lastDays: "sidste %0% dage",
    stage: "Trin",
    filters: "Filtre",
    node: "Node",
    pageSize: "Sidestørrelse",
    attachment: "Vedhæftet fil (valgfri)",
    addFile: "Tilføj fil",
    both: "Both",
    by: "ved",
    at: "på",
    on: "på",
    now: "Nu",
    optional: "Optional",

    published: "Udgivet",
    unpublished: "Upubliceret",
    when: "hvornår",
    include: "Omfatte",
    hasChanged: "har ændret",
    email: "Workflow email",
    noUnpublishPermissions:
      "No unpublish workflow configured for this content item.",
    invalidContent:
      "Invalid content can not be submitted for workflow approval",
    noActiveWorkflow: "No active workflow found",
    extendPermissions: "Extend permissions",
    installedVersion: "Current installed version of Umbraco Workflow:",
    assignTo: "Assign rejected task",
    originalEditor: "Original editor",
    previousGroup: "Previous approval group",
    some: "Some",
    groupEmail: "Group email",
    contentReview: "Content review",
    updateAvailable: "Update available",
    outOfDate: "Workflow is out of date.",
    learnMoreAbout: "Learn more about",
    inherited: "nedarvet",
    overview: "Oversigt",

    reviewed: "Reviewed",
    expiring: "Expiring",
    overdue: "Overdue",
    pending: "Pending",
    expired: "Expired",
	approved: "Godkendt",
    rejected: "Afvist",
    pendingapproval: "Afventer godkendelse",
    notrequired: "Ikke påkrævet",
    cancelled: "Aflyst",
    errored: "Der opstod en fejl",
    resubmitted: "Genindsendt",
    cancelledbythirdparty: "Annulleret af tredjepart",

    fastestApproval: "Hurtigste",
    slowestApproval: "Langsomst",
    averageApproval: "Gennemsnit",

    noGroup: "GRUPPEN IKKE FUNDET",
    noNode: "NODE IKKE FUNDET",
    noUser: "BRUGER IKKE FUNDET",
    noContentType: "INDHOLDSTYPE IKKE FUNDET",
    noApproval: "GODKENDELSE IKKE PÅKRÆVET",

    workflowAdministration: "Workflow administration",
    workflowActivity: "Workflow aktivitet",
    history: "Historik",
    historyFor: "Workflow historik til %0%",
    workflowHistory: "Workflow historik",
    docIsActive: "Noden er i et workflow",
    cannotBeEdited: "og kan ikke redigeres",
    previousChangesRejected: "Forrige ændringer blev afvist",
    unsavedChanges: "Ikke gemte ændringer vil blive gemt automatisk",
    currentPageExcluded: "Aktuelle node er ekskluderet fra workflowet",
    selectDoctypes: "Dokumenttype",

    newNodeApprovalFlow: "New node approval flow",
    newNodeApprovalFlowDescription:
      "All new nodes use this workflow for initial publishing",
    newNodeConfig: "New nodes must be saved before configuring workflow",

    emailTemplate: "E-mail-skabelon",
    approvalRequest: "Godkendelsesanmodning",
    approvalRejection: "Afvisning af godkendelse",
    pendingResubmission: "Afventer genindsendelse",
    approvedAndCompleted: "Godkendt og afsluttet",
    approvedAndCompletedForScheduler: "Godkendt og afsluttet til planlægning",
    schedulerActionCancelled: "Planlægningshandling annulleret",
    workflowCancelled: "Workflow aflyst",
    workflowErrored: "Workflow fejlede",
    reminder: "Påmindelse",
    summary: "Resumé",
    changeDescription: "Skift beskrivelse",
    currentStatus: "Nuværende status",

    status1: "Godkendt",
    status2: "Afvist",
    status3: "Afventer godkendelse",
    status4: "Ikke påkrævet",
    status5: "Aflyst",
    status6: "Der opstod en fejl",
    status7: "Genindsendt",
    status8: "Annulleret af tredjepart",
    status9: `Excluded`,
    status10: `Awaiting resubmission`,
    
    changeDescriptionDetail: "%0% efterspurgt af %1% på %2%",

    sendTo: "Send til",
    toAdmin: "Administrator",
    toAll: "Alle",
    toAuthor: "Forfatter",
    toGroup: "Gruppe",
    sendToDescription: `			   
        <ul>
          <li><strong>All</strong> sends to all members of all groups up to and including the current task</li>
          <li><strong>Admin</strong> includes the system email</li>
          <li><strong>Author</strong> includes the editor who initiated the workflow</li>
          <li><strong>Group</strong> sends to the group responsible for the current task</li>
          <li>Duplicate users are removed</li>
        </ul>
		`,

    contentApprovalFlow: "Nodebaseret godkendelsesflow",
    inheritedApprovalFlow: "Nedarvet godkendelsesflow",
    nodeApprovalFlows: "Nodebaseret godkendelser",
    documentFlows: "Dokumenttype godkendelser",
    docTypeApprovalFlow: "Dokumenttype godkendelsesflow",
    currentPageInheritsFrom:
      "Denne dokument nedarver fra <strong>%0%</strong> for <strong>%1%</strong> workflows",
    noInheritedFlow:
      "Der er ikke nogle nedarvede godkendelsesflow for denne node",
    noDoctypeFlow: "Ingen dokumenttype godkendelsflows er sat for %0%",
    currentFlow: "Aktuelle godkendelsesflow",

    approvalGroups: "Godkendelsesgrupper",
    members: "Medlemmer",
    roles: "Roller",
    membership: "Gruppemedlemmer",
    inheritedMembership: "Nedarvede grupper",
    inheritedMembershipDescription:
      "Nedarv gruppemedlemskab fra en eksisterende Umbraco gruppe",
    currentWorkflowRoles: "Aktuelle workflow roller",
    offlineApproval: "Aktiver offline godkendelse",
    emailGroup: "Email gruppe",
    editGroup: "Rediger gruppe",
    saveGroup: "Gem gruppe",
    deleteGroup: "Slet gruppe",
    createGroup: "Opret gruppe",
    defaultApprovalGroup: "Standard godkendelsesgruppe",
    groupEmailDescription:
      "Notifikationer vil blive sendt to denne adresse i stedet for gruppemedlemmerne",
    languageDescription: "Kræves kun, når gruppen har en email adresse",
    groupsLimitedByLicense:
      "Det maksimale antal grupper er begrænset af licenstypen",
    maximumMembers: "Maks antal medlemmer",
    deleteGroupWarning: `
			<h4>Forsigtig! Dette er en destruktiv handling.</h4>
        <p>Sletning af en gruppe annullerer alle afventende opgaver og arbejdsgange, hvor gruppen er en deltager, og vil slette alle tilladelser, der er tildelt gruppen.</p><p>For at slette skal du skrive %0% nedenfor.</p>
		`,
    groupWorkflowsCancelled: "Gruppearbejdsgange annulleret",
    groupPermissionsRemoved: "Gruppetilladelser fjernet",
    addWorkflowGroups: "Add workflow approval group/s",

    settings: "Indstillinger",
    workflowSettings: "Workflow indstillinger",
    workflowSettingsUpdated: "Workflow settings updated",
    excludeNodes: "Ekskluder noder",
    sendNotifications: "Send notifikationer",
    reminderDelay: "Påmindelse forsinkelse",
    editUrl: "Backoffice webadresse",
    siteUrl: "Websteds URL",
    saveSettings: "Gem indstillinger",
    settingsUpdated: "Indstillinger opdateret",
    docTypeApprovalFlowUpdated: "Dokumenttype godkendelsesflow opdateret",
    allowAttachments: "Tillad vedhæftede filer",
    allowAttachmentsDescription:
      "Tillader af referere en mediefil når der startes et workflow",
    viewAttachment: "Vis vedhæftede fil",
    requireUnpublish: "Brug workflow ved afpublicér",
    requireUnpublishDescription: "Skal afpublicér kræver workflow godkendelse?",
    publishOnly: "Kun publicéring",
    publishAndUnpublish: "Publicéring og afpublicéring",
    unpublishDisabled: "Workflow for afpublicéring er slået fra globalt",
    appliesTo: "Gælder",
    settingsHiddenOrReadonly:
      "%0% settings are hidden or readonly - contact your site administrator",
    allSettingsHidden:
      "All settings are hidden - contact your site administrator",
    allowScheduling: "Allow scheduling",

    myTasks: "Ændringer der kræver min godkendelse",
    mySubmissions: "Mine ændringsanmodninger",

    generalSettings: "Generelt",
    notifications: "Notifications",
    emailTemplates: "Email templates",
    lockIfActive: "Lås aktivt indhold",
    emailSettings: "Notifikationer / email",
    excludeNodeSettings: "Undtagelser",
    documentTypeApprovalFlows: "Dokumenttype godkendelsesflow",

    thisVariant: "Kun denne",
    invariant: "Invariant",
    invariantWorkflow: "Invariant workflow",
    selectVariants: "Vælg sprog",
    multiVariant: "Multi-variant",
    multiVariantWorkflow: "Multi-variant workflow",
    variant: "Variant",

    thisVariantDesc: "Det nuværende sprog (%0%) vil blive sendt til udgivelse.",
    invariantDesc:
      "Sprog uden afventende arbejdsgange sendes til udgivelse ved hjælp af arbejdsgangen, der er angivet på standardsproget (%0%).",
    multiVariantDesc:
      "Sprog uden afventende arbejdsgange vil blive sendt til udgivelse ved hjælp af arbejdsgangen på hvert sprog.",
    variantsActiveAndUnavailable:
      "Workflows for varianten er ikke tilgængelig, da følgende sprog har et aktivt workflow:",

    addCondition: "Tilføj betingelse",
    addStatus: "Tilføj status",

    licensing: "Licens",
    buyLicense: "Køb licens",
    buyLicensePrompt:
      "To access advanced features and remove group limits, you must purchase a license.",
    limitedByLicense: "Begrænset af licensen",
    licensedFeature: "This feature requires a license.",

    cancelledWithError: "Proces stoppet grundet en fejl",
    userCannotAction:
      "Aktuelle bruger har ikke rettigheder til at administrere workflowet.",
    defaultApprovalGroupDescription:
      "Den standard publiceringsgruppe der bruges når ingen workflows er konfigureret",
    pendingForNode: "Verserende %0% arbejdsgang til '%1%'",
    scheduledForAt: "Planlagt til %0% på %1% på %2%",
    excludedNodeAlert: "Document is excluded from workflow",

    flowTypeDescription:
      "Angiver hvordan den originale redaktør er håndteret i efterfølgende flows",
    flowTypeDescriptionExtended: `  
			<ul>
          <li>Explicit kræver at alle grupper bliver godkendt, inklusiv grupper hvor den originale redaktør er medlem af.</li>
          <li>Implicit auto-godkender grupper hvor den originale redaktør er medlem af.</li>
          <li>Exclude fungerer lige som Explicit, men undlader at notificere den originale redaktør (dvs. redaktøren kan ikke godkende sit eget arbejde).</li></ul>
		`,

    lockIfActiveDescription:
      "Angiver om en node kan redigeres mens den er i et aktivt workflow.",
    sendNotificationsDescription:
      "Skal der sendes email notifikationer til godkendelsesgrupper?",
    reminderDelayDescription:
      "Send reminder emails for inactive tasks, after this many days. Set to 0 to disable.",
    emailDescription: "Afsender adresse for email notifikationer",
    editUrlDescription:
      "Backoffice site URL som bruges i email notifikationer (f.eks. http://edit.mydomain.com)",
    siteUrlDescription:
      "site URL som bruges i email notifikationer (f.eks. http://www.mydomain.com)",
    allowSchedulingDescription:
      "Enable optionally setting a scheduled date when initiating a workflow",

    excludeNodesDescription:
      "Noder (og deres underliggende noder) der vælges her vil ikke blive inkluderet i workflows, og vil fungere som standard Umbraco noder",
    documentTypeApprovalFlowsDescription:
      "Tilføjer standard workflows for alle noder af en given dokumenttype",
    nodeApprovalFlowsDescription:
      "Disse workflows tilknytter sig kun til de angivede noder",
    documentTypeApprovalsDescription:
      "These workflows apply only to the specified document type",

    offlineApprovalDescription:
      "Slå denne funktion til for at tillade redaktører i denne gruppe godkende ændringer uden at logge ind i Umbraco backoffice. Henviser til dokumentationen for yderligere informationer og opsætning.",

    notConfigured: "Workflow er ikke konfigureret",
    notConfiguredDescription:
      "Venligst sikre at noderne herunder enten har et explicit workflow tilknyttet eller er eksluderet fra workflows:",

    licensedFeatureDescription: `
      <p>Workflow's advanced features require a license. To test these in a development environment, set Umbraco:Workflow:EnableTestLicense to true in appSettings.json</p>
    `,

    extendPermissionsDescription:
      "Should Workflow extend or replace users' save and publish permissions? (default behaviour is replace)",
    invalidOfflineUrl: `
			<strong>INVALID REQUEST:</strong> The requested URL does not map to a valid workflow process. The task may have already been completed, or the requesting user does not have permission to action the task.
		`,

    scheduledDate: "Planlagt publiceringsdato (valgfri)",
    scheduling: "Planlæg",
    scheduleDescription:
      "Hvis den planlagte publiceringsdato er overskredet inden workflowet er afsluttet, vil ændringerne bliver publiceret når den sidste gruppe i workflowet her godkendt ændringerne.",
    schedulePassed:
      "Planlagt publiceringsdato er overskredet før workflowet var afsluttet. Ændringerne vil blive publiceret når workflowet er afsluttet.",

    showDiff: "Vis verschillen",
    diffHelp: `
			Tabellen her over viser forskellen på det aktuelle publicerede indhold og de afventende ændringer i workflowet.<br /><br />
          <del>Rød tekst</del> vil blive fjernet. <ins>Grøn tekst</ins> vil blive tilføjet.
		`,
    diffVariants:
      "Det aktive workflow indeholder flere varianter. Vælg sprog her under for at se ændringerne til hver variant.",
    diffNoVersions:
      'Kunne ikke finde en version at sammenligne med. Måske er de blevet slettet? Prøv Umbraco\'s "Fortryd ændringer" funktion for at se alle tidligere ændringer for denne node.',
  },
  workflowNotifications: {
    initiate: "%0% indsendt til %1% godkendelse.",
    initiateScheduled: "Ændringer planlagt til %2% %0% på %1%.",
    pendingApproval:
      "Opgave afsluttet. Side bliver %0% efter afslutning af workflow.",
    pendingApprovalLog: "Workflow %0% opgave den %1% [%2%] godkendt af %3%.",
    pendingApprovalResubmit:
      "ændringer genindsendt. Side bliver %0% efter afslutning af workflow.",
    pendingApprovalResubmitLog:
      "%0% blev sendt igen af %1% [%2%] blev indsendt af %3%.",
    rejected: "%0% anmodning er blevet afvist.",
    rejectedLog: "%0% anmodning om %1% [%2%] afvist af %3%.",
    cancelled: "%0% anmodningen er annulleret.",
    cancelledLog: "%0% anmodning om %1% [%2%] annulleret af %3%.",
    approved: "Workflow afsluttet.",
    approvedLog: "Workflow godkendt af %0% på %1% [%2%]",
    pageHasBeen: "Siden har været %0%",
  },
  treeHeaders: {
    approvalGroups: "Godkendelsesgrupper",
    history: "Historie",
    settings: "Indstillinger",
    active: "Aktiv workflows",
    contentReviews: "Content reviews",
  },
  workflowCommentTemplates: {
    homepage: `This is an important\ntemplate for the homepage doctype\n\nit can have spaces\n\nand new lines`,
  },
} as UmbLocalizationDictionary;
