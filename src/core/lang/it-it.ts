import type { UmbLocalizationDictionary } from "@umbraco-cms/backoffice/localization-api";

export default {
  workflow: {
    action: (suffix = "") => `Azione ${suffix}`,
    active: "attivo",
    activity: "Attivita' del flusso di lavoro ",
    addComment: "aggiungi un commento",
    addCondition: "Aggiungi condizione",
    addFile: "aggiungi documento",
    addStatus: "Aggiungi stato",
    addWorkflowGroups:
      "Aggiungi gruppo(i) di approvazione del flusso di lavoro",
    all: "Tutto",
    allSettingsHidden:
      "Tutte le impostazioni sono nascoste - contatta l'amministratore del tuo sito",
    approvalGroups: "Gruppi di approvazione",
    approvalRejection: "Approvazione rifiutata",
    approvalRequest: (documentName?: string) =>
      `Richiesta di approvazione ${documentName ? `- ${documentName}` : ""}`,
    approve: "Approva",
    approved: "Approvato",
    approvedAndCompleted: "Approvato e completato",
    approvedAndCompletedForScheduler: "Approvato e completato per scheduler",
    asAdmin: "come amministratore",
    assignTo: "assegnare l'attività rifiutata",
    attachment: "Allegato",
    averageApproval: "Approvazione media",
    awaitingResubmission: "in attesa di nuova presentazione",
    buyLicense: "Compra una licenza",
    buyLicensePrompt:
      "Per accedere alle funzionalità avanzate e rimuovere i limiti del gruppo, è necessario acquistare una licenza.",
    cancelled: "Cancellato",
    cancelledbythirdparty: "Annullato da terzi",
    changeDescription: "Cambia descrizione",
    changeDescriptionDetail: "%0% richiesti da %1% su %2% a %3%",
    commentMaxLength:
      "Superata lunghezza massima del commento - il limite è %0% caratteri",
    completedByAdmin: "Fase completata dall'amministratore",
    completedDate: "Data di completamento",
    configuration: "Configurazione",
    configurationUpdated: "Configurazione aggiornata",
    confirmUnlockMessage:
      "Sei sicuro di voler annullare la pubblicazione pianificata per questo documento? Le modifiche in sospeso verranno mantenute e, facoltativamente, potranno essere pubblicate immediatamente.",
    contentReview: "Revisione del contenuto",
    createdDate: "Data di creazione",
    currentPageInheritsFrom: (inheritsFrom: string) =>
      `Il documento corrente eredita da <strong>${inheritsFrom}</strong>`,
    dateRange: "Intervallo (giorni)",
    deleteGroupWarning: `<h4>Attento! Questa è un'azione distruttiva.</h4>
            <p>L'eliminazione di un gruppo annullerà tutte le attività e i flussi di lavoro in sospeso a cui il gruppo partecipa ed eliminerà tutte le autorizzazioni assegnate al gruppo.</p><p>Per eliminare, digita <strong>%0%</strong> di seguito.</p>`,
    describeChanges: "Descrivi i cambiamenti",
    detail: "Dettaglio",
    detailButton: "Dettaglio del flusso di lavoro",
    diffHelp: `La tabella sopra mostra le differenze tra la versione pubblicata corrente e le modifiche in sospeso in questo flusso di lavoro.<br /><br /><del>Testo rosso</del> sarà rimosso. <ins>Testo verde</ins> sarà aggiunto.`,
    diffNoVersions:
      "Impossibile trovare versioni per il confronto. Forse sono stati cancellati? Prova lo strumento Rollback di Umbraco per visualizzare tutta la cronologia delle modifiche disponibili per questo elemento.",
    diffVariants:
      "Il flusso di lavoro attivo include più variabili di contenuto. Seleziona il linguaggio qui sotto per visualizzare le modifiche per ciascuna variabile.",
    docIsActive: "Il documento è attualmente in flusso di lavoro",
    document: "Documento",
    documentApprovalFlow: "Flusso di approvazione dei contenuti",
    documentFlows: "Approvazioni del tipo di documento",
    documentTypeApprovalFlow: "Flusso di approvazione del tipo di documento",
    editButton: "Vai al nodo",
    emailGroup: "invia email al gruppo",
    emailTemplates: "Modelli di email",
    errored: "Errore",
    excludedNodeAlert: "Il documento è escluso dal flusso di lavoro",
    expired: "Scaduto",
    explicit: "Esplicito",
    fastestApproval: "Approvazione piu'rapida",
    filters: "Filtri",
    groupHasNoMembers: "Il gruppo non ha membri",
    groupPermissionsRemoved: "Autorizzazioni di gruppo rimosse",
    groupWorkflowsCancelled: "Gruppo di flussi di lavoro annullato",
    hasChanged: "ècambiato",
    historyFor: "Cronologia del flusso di lavoro per %0%",
    implicit: "Implicito",
    include: "Includi",
    inherited: "ereditati",
    inheritedApprovalFlow: "Flusso di approvazione ereditato",
    inheritedMembership: "Adesione al gruppo ereditata",
    installedVersion: (version: string) =>
      `Versione attualmente istallata di Umbraco Workflow: <strong>${version}</strong`,
    invariantWorkflow: "Non variabile flusso di lavoro",
    invariantWorkflowDescription:
      "Linguaggi senza flussi di lavoro in sospeso verranno inviati per la pubblicazione, utilizzando il flusso di lavoro impostato sulla lingua predefinita (%0%).",
    licensedFeature: "Questa funzionalità richiede una licenza.",
    licenseImpersonationActive:
      "La rappresentazione della licenza del flusso di lavoro è attiva. Tutte le funzionalità sono disponibili solo su domini non di produzione.",
    lockedPendingRelease:
      "La pubblicazione del documento è pianificata e non può essere modificata.",
    membership: "Membri del gruppo",
    most: "In maggioranza",
    mySubmissions: "Le mie proposte",
    myTasks: "Attività che richiedono la mia approvazione",
    newNodeConfig:
      "I nuovi nodi devono essere salvati prima di configurare flusso di lavoro",
    noApproval: "APPROVAZIONE NON NECESSARIA",
    noDocumentFlow:
      "Nessun flusso di approvazione del documento impostato per questo documento",
    noDocumentTypeFlow: "Nessun flusso di tipo di documento impostato per %0%",
    noGroup: "GRUPPO NON TROVATO",
    noInheritedFlow:
      "Non esiste alcun flusso ereditato di approvazione per questo documento",
    none: "Nessuno",
    noNode: "NODO NON TROVATO",
    notrequired: "Non richiesto",
    noUser: "UTENTE NON TROVATO",
    now: "Ora",
    one: "Uno",
    optional: "Opzionale",
    originalEditor: "Editore originale",
    outOfDate: "Flusso di lavoro scaduto.",
    overview: "Panoramica",
    pageSize: "Dimensioni della pagina",
    pendingapproval: "In attesa di approvazione",
    pendingApproval: "In attesa di approvazione",
    pendingForNode: "Flusso di lavoro %0% in sospeso per '%1%'",
    pendingResubmission: "In attesa di un nuovo invio",
    plusMore: (count: number) => `piu' ${count} in aggiunta`,
    previousGroup: "Gruppo di approvazione precedente",
    publishButton: "Richiedi la pubblicazione",
    publishOn: "Pubblica",
    publishUnlockedDocument: "Pubblica documento sbloccato",
    reject: "Rifiuta",
    rejected: "Rifiutato",
    reminder: `Promemoria`,
    removeAll: "Rimuovi tutto",
    requestedBy: "Richiesto da",
    requestedOn: "Richiesto",
    requiredApprovals: "Approvazioni necessarie",
    resubmit: "Invia di nuovo",
    resubmitted: "Reinviato",
    roles: "Ruoli",
    scheduled: "Programmato",
    scheduleDescription:
      "Se la data pianificata passa prima del completamento del flusso di lavoro, le modifiche verranno pubblicate una volta approvata la fase finale del flusso di lavoro.",
    scheduledForAt: "Programmato per %0% su %1% al %2%",
    schedulePassed:
      "La data pianificata è passata prima del completamento del flusso di lavoro. Il contenuto verrà rilasciato una volta completato il flusso di lavoro corrente.",
    scheduling: "Pianificazione",
    selectVariants: (plural) => "Seleziona i linguaggi",
    settingsHiddenOrReadonly:
      "%0% impostazioni nascoste o di sola lettura - contatta l'amministratore del tuo sito",
    showDiff: "Visualizza le differenze",
    slowestApproval: "Approvazione piu'lenta",
    some: "Qualche",
    stage: (idx?: number) => (!idx ? "Fase" : `Fase ${idx}`),
    status1: "Approvato",
    status2: "Rifiutato",
    status3: "In attesa di approvazione",
    status4: "Non richiesto",
    status5: "Annullato",
    status6: "Errore",
    status7: "Reinviato",
    status8: "Annullato da terzi",
    status9: "Escluso",
    toAdmin: "Amministratore",
    toAll: "Tutti",
    toAuthor: "Autore",
    toGroup: "Gruppo",
    unableToAction: `Impossibile eseguire il flusso di lavoro.`,
    unableToInitiate: (document: string, variants: Array<string>) =>
      `Impossibile avviare il flusso di lavoro sul documento ${document} (${variants.join(
        ", "
      )})`,
    unlockButton: "Sbloccare",
    unpublishButton: "Richiedi di annullare la pubblicazione",
    unpublishOn: "Annulla pubblicazione",
    updateAvailable: "Aggiornamento disponibile",
    userCannotAction:
      "L'utente corrente non dispone dell'autorizzazione per eseguire azioni sul flusso di lavoro.",
    variant: (plural = false) => "Variabile",
    viewAttachment: "Visualizza allegato",
    when: "quando",
    workflow: "Workflow",
    workflowActivity: "Attività del flusso di lavoro",
    workflowCancelled: "Flusso di lavoro cancellato",
    workflowErrored: "Errore del flusso di lavoro",
    xOfYApprovalsCompleted:
      "%0% di %1% approvazioni richieste sono state completate",
  },
  workflow_settings: {
    adminCanEdit: "Gli amministratori possono modificare",
    adminCanEditDescription:
      "Imposta su 'true' per consentire agli amministratori di modificare il contenuto in qualsiasi fase di un flusso di lavoro ",
    allowAttachments: "Consenti allegati",
    allowAttachmentsDescription:
      "Imposta su 'true' per consentire di allegare un elemento multimediale all'avvio di un flusso di lavoro",
    allowScheduling: "Consenti pianificazione",
    allowSchedulingDescription:
      "Imposta su 'true' per consentire la pianificazione di una pubblicazione all'avvio di un flusso di lavoro",
    approvalThreshold: "Soglia di approvazione",
    approvalThresholdDescription:
      "Quanti membri di un gruppo devono approvare ciascuna attività del flusso di lavoro",
    approvalThresholdDescriptionExtended: `<p>Questo è un valore predefinito e può essere sovrascritto durante la configurazione dei singoli flussi di lavoro.</p><ul>
      <li><strong>One</strong>: qualsiasi membro del gruppo di approvazione può approvare l'attività.</li>
      <li><strong>Most</strong>: il compito deve essere approvato dalla maggioranza assoluta dei membri del gruppo di approvazione.</li>
      <li><strong>All</strong>: tutti i membri del gruppo di approvazione devono approvare l'attività.</li></ul>`,
    configureApprovalThreshold:
      "Consenti la configurazione della soglia di approvazione",
    configureApprovalThresholdDescription:
      "Abilita l'impostazione della soglia di approvazione per qualsiasi fase di un flusso di lavoro",
    documentTypeApprovalFlows: "Flussi di approvazione del Tipo di Documento",
    documentTypeApprovalFlowsDescription:
      "Abilita l'impostazione della soglia di approvazione per ogni fase di un flusso di lavoro",
    editUrl: "Modifica l'URL del sito",
    editUrlDescription:
      "Modifica l'URL del sito per l'inclusione nelle notifiche email (es. http://edit.mydomain.com)",
    email: "Email del flusso di lavoro",
    emailDescription: "Indirizzo FROM per notifiche email",
    excludeNodes: "Escludi i nodi",
    excludeNodesDescription:
      "I nodi (e i loro discendenti) selezionati qui NON saranno inclusi nel flusso di lavoro e torneranno alle azioni Umbraco predefinite",
    extendPermissions: "Estendi le autorizzazioni",
    extendPermissionsDescription:
      "Imposta su 'true' per estendere le autorizzazioni di salvataggio e pubblicazione predefinite degli utenti. Se falso, il pulsante Salva e pubblica viene rimosso",
    flowType: "Tipo di flusso",
    flowTypeDescription:
      "Controlla il modo in cui l'autore originale viene gestito nelle attività successive",
    flowTypeDescriptionExtended: `<ul>
      <li><strong>Explicit</strong>: richiede l'approvazione di tutti i passaggi, compresi i passaggi in cui l'autore della modifica originale è un membro del gruppo.</li>
      <li><strong>Implicit</strong>: approva automaticamente i passaggi in cui l'autore è membro del gruppo di approvazione.</li>
      <li><strong>Exclude</strong>: si comporta in modo simile a Explicit, ma esclude l'autore originale da qualsiasi notifica (ovvero l'autore non può approvare il proprio lavoro).</li></ul>`,
    groupEmail: "Email del gruppo",
    groupEmailDescription:
      "Le notifiche verranno inviate a questo indirizzo anzichè ai membri del gruppo",
    lockIfActive: "Blocca il contenuto attivo",
    lockIfActiveDescription:
      "Imposta su 'true' per impedire modifiche mentre il contenuto si trova in un flusso di lavoro",
    mandatoryComments: "Commenti obbligatori",
    mandatoryCommentsDescription:
      " Imposta su 'true' per richiedere commenti sulle approvazioni del workflow",
    newNodeApprovalFlow: "Flusso di approvazione del nuovo nodo",
    newNodeApprovalFlowDescription:
      "Tutti i nuovi nodi utilizzano questo flusso di lavoro per la pubblicazione iniziale",
    rejectionResetsApprovals: "Il rifiuto reimposta le approvazioni",
    rejectionResetsApprovalsDescription:
      "Imposta su 'true' con la soglia di approvazione impostata su La maggior parte o Tutte, per reimpostare le approvazioni precedenti quando una fase di flusso di lavoro viene rifiutata",
    reminderDelay: "Ritardo promemoria (giorni)",
    reminderDelayDescription:
      "Invia e-mail di promemoria per attività inattive, dopo questo numero di giorni. Imposta su 0 per disabilitare",
    requireUnpublish:
      "Utilizza il flusso di lavoro per annullare la pubblicazione",
    requireUnpublishDescription:
      "Imposta su 'true' per richiedere l'approvazione di un flusso di lavoro quando si annulla la pubblicazione del contenuto",
    scheduledContentLock: "Blocca il contenuto programmato",
    scheduledContentLockDescription:
      "Impostato su true per impedire modifiche mentre il contenuto è in attesa di pubblicazione pianificata",
    scheduledContentLockDescriptionExtended: `<p>Il contenuto bloccato non può essere modificato finché non è trascorsa la data di rilascio prevista. I blocchi possono essere rilasciati dagli amministratori del flusso di lavoro.</p><ul>
        <li><strong>Nessuno</strong>: il contenuto pianificato non viene mai bloccato.</li>
        <li><strong>Workflow</strong>: il contenuto pianificato tramite l'approvazione del flusso di lavoro è bloccato.</li>
        <li><strong>Tutto</strong>: tutto il contenuto programmato è bloccato.</li></ul>`,
    sendNotifications: "Invia notifiche",
    sendNotificationsDescription:
      "Imposta su 'true' per inviare notifiche email",
    sendTo: "Invia a",
    sendToDescription: `<ul>
      <li><strong>All</strong> invia a tutti i membri di tutti i gruppi fino all'attività corrente inclusa</li>
      <li><strong>Admin</strong> include l'email di sistema</li>
      <li><strong>Author</strong> include l'editor che ha avviato il flusso di lavoro</li>
      <li><strong>Group</strong> invia al gruppo responsabile dell'attività corrente</li>
      <li>Duplicate users are removed</li>
    </ul>`,
    siteUrl: "URL del sito",
    siteUrlDescription:
      "URL del sito attivo da includere nelle notifiche e-mail (es. http://www.mydomain.com)",
  },
  workflowNotifications: {
    approved: "Flusso di lavoro completato.",
    approvedLog: "Flusso di lavoro approvato da %0% su %1% [%2%].",
    cancelled: "%0% richiesta è stata cancellata.",
    cancelledLog: "%0% richiesta su %1% [%2%] cancellata da %3%.",
    initiate: "%0% inviato per %1% approvazione.",
    initiateScheduled: "Modifiche pianificate per %2% %0% a %1%.",
    pageHasBeen: "La pagina è stata %0%",
    pendingApproval:
      "Attività completata. La pagina sarà %0% dopo il completamento del flusso di lavoro.",
    pendingApprovalLog:
      "Flusso di lavoro %0% attività su %1% [%2%] approvato da %3%.",
    pendingApprovalResubmit:
      "Modifiche reinviate. La pagina sarà %0% dopo il completamento del flusso di lavoro.",
    pendingApprovalResubmitLog:
      "%0% richiesta per %1% [%2%] è stata reinviata da %3%.",
    rejected: "%0% richiesta è stata respinta.",
    rejectedLog: "%0% richiesta per %1% [%2%] respinta da %3%.",
  },
  treeHeaders: {
    active: "Flussi di lavoro attivi",
    approvalGroups: "Gruppi di approvazione",
    contentReviews: "Revisione del contenuto",
    history: "Cronologia",
    settings: "Impostazioni",
  },
  contentReviews: {
    contentItemReviewed: "Il contenuto è stato contrassegnato come revisionato",
    contentItemReviews: "Revisioni degli elementi di contenuto",
    contentItemReviewsDescription:
      "Configura le revisioni per singoli elementi di contenuto",
    contentRequiresReview: "Il contenuto richiede una revisione",
    contentRequiresReviewDescription:
      "Il contenuto richiede una revisione entro il %0%",
    contentReviewActivity: "Attività di revisione del contenuto",
    contentReviews: "Revisioni del contenuto",
    currentPageInheritsReview: `Il documento corrente eredita da <strong>%0%</strong> (tramite la configurazione %1%) per le <strong>revisioni dei contenuti</strong>.`,
    docTypeReview: "Impostazioni di revisione del tipo di documento",
    documentTypeReviews: "Revisioni di tipo documentale",
    documentTypeReviewsDescription:
      "Configura le revisioni per tutti i nodi di un determinato tipo di documento",
    enableContentReviews: "Abilita le revisioni dei contenuti",
    enableContentReviewsDescription:
      "È opportuno ricordare agli utenti di rivedere i propri contenuti?",
    externalReviewers: "Revisori esterni",
    externalReviewersDescription:
      "Elenco di indirizzi email delimitati da punti e virgola. Questi non devono essere associati agli utenti CMS.",
    force: "Forzalo",
    forceDescription:
      "Imposta su 'true' per sovrascrivere tutte le date di revisione esistenti (esclusa la configurazione di revisione a livello di nodo)",
    generateRelativeTo:
      "Impossibile aggiornare la data di revisione per il nodo",
    lastReviewed: "Ultima revisione",
    markAsReviewed: "Contrassegna come revisionato",
    nextReviewDue: "Prossima revisione prevista",
    noContentReviewGroup:
      "Nessun gruppo di revisione del contenuto impostato per questo documento",
    nodeReview: "Impostazioni di revisione degli elementi di contenuto",
    publishIsReview: "Trattare la pubblicazione come una recensione?",
    publishIsReviewDescription:
      "La pubblicazione di contenuti deve essere trattata come una revisione o il contenuto richiede una revisione esplicita",
    reminderThreshold: "Soglia promemoria (giorni)",
    reminderThresholdDescription:
      "Le notifiche di revisione verranno inviate molti giorni prima della data di revisione. L'impostazione predefinita è 1",
    reviewGroup: "Gruppo di revisione",
    reviewOverlayPeriod:
      "Questo contenuto deve essere rivisto ogni %0% giorni.",
    reviewPeriod: "Periodo di revisione (giorni)",
    reviewPeriodDescription:
      "Periodo di tempo massimo tra le revisioni del contenuto richieste",
    reviewPeriodDescriptionExtended:
      "Questa è l'impostazione predefinita globale e può essere sovrascritta per i singoli nodi.Se impostato su 0 (impostazione predefinita), nessun nodo sarà considerato revisionabile a meno che non venga impostato un periodo di revisione per il singolo nodo.",
    saveAndRegenerate: "Salva e rigenera",
    saveReviewConfigMessage:
      "L'operazione potrebbe richiedere del tempo- il salvataggio genera la data di scadenza della revisione per tutto il contenuto revisionabile, che potrebbe contenere molti nodi.Ciò non modifica la configurazione della revisione a livello di nodo.",
    staleContent: "Contenuti obsoleti",
  },
  workflowCleanup: {
    cleanupEnabled: "Pulizia della cronologia abilitata",
    contentRules: "Regole di pulizia dei contenuti",
    daysToKeepHistory:
      "Giorni in cui conservare la cronologia del flusso di lavoro",
    docTypeRules: "Regole di pulizia del tipo di documento",
    globalSettings: "Impostazioni globali di pulizia",
    rulesUpdated:
      "Regole di pulizia della cronologia del flusso di lavoro aggiornate",
    statusesToDelete: "Stati del flusso di lavoro da eliminare",
  },
  workflowSearch: {
    addContentTypes: "Aggiungi Tipo/i di Contenuto",
    addDataType: "Aggiungi Tipo di Dati",
    addProperties: "Aggiungi proprietà",
    addProperty: "Aggiungi proprietà",
    addPropertyEditor: "Aggiungi Editor di Proprietà",
    allProperties: "Tutte le proprietà",
    datatype: "Tipo di Dati",
    emptyFieldSearch: "Cerca un campo vuoto",
    emptyFieldSearchDescription:
      "La ricerca di campi vuoti può essere costosa e richiedere più tempo del previstod",
    fuzzy: "Ricerca approssimativa",
    fuzzyDescription:
      "La ricerca approssimativa consente di trovare termini che corrispondono molto al termine cercato, considerando lievi variazioni",
    propertyEditor: "Editor di Proprietà",
    selectContentTypes: "Seleziona Tipo/i di Contenuto",
    selectSearchFields: "Seleziona campi di ricerca",
    selectSearchType: "Seleziona tipo di ricerca",
    showBaseProperties: "Mostra proprietà di base",
    singleProperty: "Proprietà singola",
    someProperties: "Alcune proprietà",
  },
} as UmbLocalizationDictionary;
