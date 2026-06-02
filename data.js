// ═══════════════════════════════════════════════════════════════════
// data.js — All content for the TEF Prep site
// ═══════════════════════════════════════════════════════════════════

// ─── READING PASSAGES ───────────────────────────────────────────────
const PASSAGES = {
  b2: [
    {
      topic: "L'immigration au Canada",
      source: "Adapté d'un article de presse",
      text: `Le Canada est l'un des pays qui accueille le plus grand nombre d'immigrants au monde. Chaque année, le gouvernement fédéral fixe des objectifs d'immigration ambitieux afin de répondre aux besoins du marché du travail et de compenser le vieillissement de la population. En 2024, le pays visait à accueillir plus de 400 000 nouveaux résidents permanents.\n\nCependant, cette politique n'est pas sans défis. L'intégration des nouveaux arrivants dans le tissu social et économique du pays demeure une priorité. Des programmes de formation linguistique, notamment en français pour les candidats qui souhaitent s'établir au Québec, sont mis en place pour faciliter cette transition.\n\nLes immigrants contribuent de manière significative à l'économie canadienne. Ils occupent des postes dans des secteurs en tension, tels que la santé, le génie et les technologies de l'information. Par ailleurs, le multiculturalisme qui caractérise les grandes villes comme Toronto, Vancouver et Montréal est souvent cité comme l'une des forces du Canada sur la scène internationale.\n\nNéanmoins, des voix s'élèvent pour demander une meilleure planification des infrastructures afin d'absorber cette croissance démographique rapide. Le logement, les transports en commun et les services de santé sont particulièrement sous pression dans les zones métropolitaines.`,
      questions: [
        { q: "Pourquoi le Canada cherche-t-il à accueillir autant d'immigrants ?", options: ["Pour des raisons touristiques","Pour compenser le vieillissement de la population et les besoins du marché du travail","Pour augmenter les taxes","Pour développer le tourisme"], answer: 1 },
        { q: "Quel objectif le gouvernement visait-il en 2024 ?", options: ["200 000 résidents permanents","300 000 résidents permanents","Plus de 400 000 résidents permanents","500 000 résidents permanents"], answer: 2 },
        { q: "Dans quels secteurs les immigrants sont-ils particulièrement présents ?", options: ["Agriculture et pêche","Santé, génie et technologies de l'information","Tourisme et hôtellerie","Finance et droit"], answer: 1 },
        { q: "Quel est le principal défi mentionné en fin d'article ?", options: ["La langue française","La pression sur les infrastructures","Le multiculturalisme","Le marché du travail"], answer: 1 },
        { q: "Que signifie l'expression 'tissu social' dans ce contexte ?", options: ["Le secteur textile","La structure et les liens de la société","Les vêtements traditionnels","L'industrie manufacturière"], answer: 1 },
      ]
    },
    {
      topic: "Le télétravail en France",
      source: "Adapté d'une étude socio-économique",
      text: `Le télétravail, longtemps marginal dans les entreprises françaises, a connu une expansion spectaculaire depuis la pandémie de 2020. Ce mode d'organisation du travail, qui permet aux salariés d'exercer leurs fonctions depuis leur domicile ou tout autre lieu distant du bureau, est désormais ancré dans les pratiques professionnelles de nombreuses organisations.\n\nSelon une enquête récente, près de 40 % des salariés français travaillent désormais à distance au moins un jour par semaine. Les travailleurs du secteur tertiaire — informatique, finance, communication — sont les plus concernés. En revanche, les métiers manuels et les professions de service direct au public restent très largement incompatibles avec cette pratique.\n\nLes avantages du télétravail sont nombreux : réduction du temps de transport, meilleure conciliation entre vie professionnelle et vie personnelle, et dans certains cas, augmentation de la productivité. Cependant, des inconvénients existent également. L'isolement social, la difficulté à séparer espace de travail et espace de vie, ainsi que les risques d'hyperconnectivité sont régulièrement signalés par les travailleurs à distance.\n\nFace à ces constats, de nombreuses entreprises adoptent désormais des formules hybrides, combinant présence au bureau et travail à distance. Cette approche vise à tirer le meilleur parti des deux modalités tout en préservant la cohésion des équipes.`,
      questions: [
        { q: "Qu'est-ce qui a provoqué l'essor du télétravail en France ?", options: ["Une nouvelle loi gouvernementale","La pandémie de 2020","Une hausse des prix de l'immobilier","Le développement d'internet"], answer: 1 },
        { q: "Quelle proportion de salariés français télétravaille au moins un jour par semaine ?", options: ["20 %","30 %","Près de 40 %","Plus de 50 %"], answer: 2 },
        { q: "Quel type de travailleurs est le plus concerné par le télétravail ?", options: ["Les agriculteurs","Les travailleurs du secteur tertiaire","Les ouvriers du bâtiment","Les soignants"], answer: 1 },
        { q: "Quel inconvénient du télétravail est mentionné dans le texte ?", options: ["La diminution du salaire","L'isolement social","Le manque de formation","Les coûts du matériel"], answer: 1 },
        { q: "Comment les entreprises répondent-elles aux défis du télétravail ?", options: ["En l'interdisant complètement","En imposant 100 % de présence au bureau","En adoptant des formules hybrides","En réduisant les équipes"], answer: 2 },
      ]
    },
    {
      topic: "Le réchauffement climatique et les villes",
      source: "Adapté d'un rapport environnemental",
      text: `Les villes du monde entier font face à des défis croissants liés au changement climatique. Les phénomènes météorologiques extrêmes — canicules, inondations, tempêtes — se multiplient et mettent à rude épreuve des infrastructures souvent conçues pour un climat plus stable. Les municipalités sont donc contraintes d'adapter leurs politiques urbaines à cette nouvelle réalité.\n\nParmi les solutions envisagées, la végétalisation des espaces urbains occupe une place de choix. Planter des arbres, créer des jardins sur les toits et aménager des parcs permettent de lutter contre les îlots de chaleur urbains, phénomène par lequel les villes sont sensiblement plus chaudes que les zones rurales environnantes. À Montréal, par exemple, la Ville a lancé un plan ambitieux pour augmenter son couvert arboré de 25 % d'ici 2040.\n\nL'adaptation des bâtiments constitue également un enjeu majeur. L'isolation thermique, les systèmes de ventilation naturelle et les matériaux réfléchissants permettent de réduire les besoins en climatisation et donc la consommation d'énergie. Ces mesures présentent un double avantage : elles contribuent à l'atténuation du changement climatique tout en améliorant le confort des habitants.\n\nEnfin, la mobilité durable représente un axe fondamental des stratégies climatiques urbaines. Le développement des transports en commun, des pistes cyclables et des zones piétonnes vise à réduire les émissions de gaz à effet de serre tout en améliorant la qualité de l'air.`,
      questions: [
        { q: "Quel est le thème principal de ce texte ?", options: ["L'histoire des villes","L'adaptation des villes au changement climatique","Le développement économique urbain","La politique de logement"], answer: 1 },
        { q: "Qu'est-ce qu'un 'îlot de chaleur urbain' ?", options: ["Une piscine publique","Un jardin en plein air","Un phénomène où les villes sont plus chaudes que les zones rurales","Un bâtiment mal isolé"], answer: 2 },
        { q: "Quel est l'objectif de Montréal concernant les arbres ?", options: ["Planter 1 000 arbres","Réduire le couvert arboré","Augmenter son couvert arboré de 25 % d'ici 2040","Créer un parc national"], answer: 2 },
        { q: "Quel double avantage offrent les adaptations des bâtiments ?", options: ["Réduire les coûts et augmenter la valeur immobilière","Lutter contre le changement climatique et améliorer le confort","Créer des emplois et attirer des touristes","Réduire le bruit et améliorer la sécurité"], answer: 1 },
        { q: "Que vise à réduire la mobilité durable ?", options: ["Le coût des transports","Les émissions de gaz à effet de serre","Le nombre de voitures","Le prix du carburant"], answer: 1 },
      ]
    },
    {
      topic: "L'éducation bilingue au Canada",
      source: "Adapté d'une publication académique",
      text: `Au Canada, l'éducation bilingue anglais-français constitue un pilier du système éducatif, particulièrement valorisé dans un pays qui possède deux langues officielles. Les programmes d'immersion française, dans lesquels les élèves anglophones reçoivent une partie ou la totalité de leur enseignement en français, connaissent un succès croissant depuis les années 1970.\n\nAujourd'hui, plus d'un demi-million d'élèves participent à des programmes d'immersion française à travers le pays. Ces programmes existent sous deux formes principales : l'immersion précoce, qui débute dès la maternelle, et l'immersion tardive, qui commence généralement en cinquième ou sixième année. Les recherches montrent que les deux approches permettent d'atteindre un niveau de compétence en français significatif.\n\nLes bénéfices du bilinguisme dépassent largement la seule maîtrise d'une seconde langue. Les études cognitives suggèrent que les personnes bilingues présentent une meilleure flexibilité mentale, une plus grande capacité à résoudre des problèmes complexes et même, selon certaines recherches, un retard dans l'apparition des symptômes de maladies neurodégénératives.\n\nSur le plan professionnel, la maîtrise du français ouvre des portes considérables au Canada. Les postes dans la fonction publique fédérale, ainsi que dans de nombreux secteurs privés, valorisent fortement le bilinguisme. Dans une économie mondialisée, parler plusieurs langues est devenu un atout indéniable.`,
      questions: [
        { q: "Depuis quand les programmes d'immersion française connaissent-ils du succès ?", options: ["Les années 1950","Les années 1960","Les années 1970","Les années 1980"], answer: 2 },
        { q: "Combien d'élèves participent aux programmes d'immersion ?", options: ["100 000","250 000","Plus d'un demi-million","Un million"], answer: 2 },
        { q: "Quelle est la différence entre l'immersion précoce et l'immersion tardive ?", options: ["La langue enseignée","L'âge de début du programme","Le nombre d'heures de cours","La certification obtenue"], answer: 1 },
        { q: "Quel avantage cognitif est mentionné pour les personnes bilingues ?", options: ["Une mémoire photographique","Une meilleure flexibilité mentale","Une aptitude musicale supérieure","De meilleures compétences mathématiques"], answer: 1 },
        { q: "Sur le plan professionnel, où le bilinguisme est-il particulièrement valorisé ?", options: ["Dans les universités seulement","Dans les entreprises privées uniquement","Dans la fonction publique fédérale et de nombreux secteurs privés","Dans le secteur agricole"], answer: 2 },
      ]
    },
    {
      topic: "La cuisine québécoise",
      source: "Adapté d'un article gastronomique",
      text: `La cuisine québécoise est le reflet d'une histoire riche et d'un territoire aux ressources abondantes. Née de la rencontre entre les traditions culinaires des colons français et les savoirs autochtones, elle a évolué au fil des siècles pour s'adapter au climat rigoureux du nord-est de l'Amérique du Nord.\n\nParmi les plats emblématiques de cette cuisine, la poutine occupe une place particulière. Ce mets, composé de frites, de fromage en grains et de sauce brune, est devenu un symbole gastronomique reconnu bien au-delà des frontières du Québec. Son origine est revendiquée par plusieurs municipalités de la province, notamment Warwick et Drummondville, chacune affirmant en être le véritable berceau.\n\nLes produits du terroir jouent un rôle fondamental dans la gastronomie québécoise. L'érable, le canard, les bleuets du Lac-Saint-Jean et les fromages artisanaux sont autant d'ingrédients qui définissent l'identité culinaire de la province. Le sirop d'érable, en particulier, est intimement lié à la culture québécoise : la saison des sucres, au printemps, est l'occasion de festivités traditionnelles dans les cabanes à sucre.\n\nCes dernières années, une nouvelle génération de chefs québécois s'est imposée sur la scène gastronomique internationale. Puisant dans les traditions locales tout en s'inspirant des cuisines du monde entier, ils ont contribué à renouveler et à faire rayonner la gastronomie québécoise.`,
      questions: [
        { q: "D'où vient la cuisine québécoise selon le texte ?", options: ["Uniquement des traditions autochtones","De la rencontre entre traditions françaises et savoirs autochtones","Des immigrants irlandais","Des influences américaines"], answer: 1 },
        { q: "De quoi est composée la poutine ?", options: ["Frites, fromage fondu, tomates","Frites, fromage en grains, sauce brune","Pâtes, fromage, sauce tomate","Riz, légumes, viande"], answer: 1 },
        { q: "Quel produit est particulièrement lié à la culture québécoise ?", options: ["Le miel","Le blé","Le sirop d'érable","Le sel de mer"], answer: 2 },
        { q: "Qu'est-ce que 'la saison des sucres' ?", options: ["La récolte du sucre de betterave","Les festivités liées à la production de sirop d'érable au printemps","La période de Noël","La vendange du raisin"], answer: 1 },
        { q: "Comment les jeunes chefs québécois ont-ils renouvelé la gastronomie locale ?", options: ["En abandonnant les traditions locales","En créant de nouveaux ingrédients","En puisant dans les traditions locales tout en s'inspirant des cuisines du monde","En imitant uniquement la cuisine française"], answer: 2 },
      ]
    },
  ],
  b1: [
    {
      topic: "Les transports à Montréal",
      source: "Texte adapté",
      text: `Montréal est une grande ville du Québec, au Canada. Elle a un excellent réseau de transports en commun. Le métro de Montréal a quatre lignes et il fonctionne depuis 1966. Chaque jour, des centaines de milliers de personnes utilisent le métro pour aller au travail ou à l'école.\n\nEn plus du métro, il y a aussi des autobus dans toute la ville. Les autobus sont utiles dans les quartiers où le métro ne va pas. On peut aussi prendre le vélo : Montréal a un système de vélos en libre-service appelé BIXI. Ce système est très populaire en été.\n\nEn hiver, il fait très froid à Montréal. Beaucoup de gens préfèrent marcher dans les souterrains, qui relient les stations de métro aux centres commerciaux et aux immeubles de bureaux. Ce réseau souterrain s'appelle la "Ville souterraine".\n\nPour aller plus loin, par exemple à Toronto ou à Ottawa, on peut prendre le train ou l'avion. La gare centrale de Montréal est un grand hub de transport. L'aéroport international Montréal-Trudeau accueille des millions de voyageurs chaque année.`,
      questions: [
        { q: "Depuis quand le métro de Montréal fonctionne-t-il ?", options: ["1956","1966","1976","1986"], answer: 1 },
        { q: "Qu'est-ce que BIXI ?", options: ["Un type d'autobus","Un service de vélos en libre-service","Une ligne de métro","Un aéroport"], answer: 1 },
        { q: "Pourquoi les gens marchent-ils dans les souterrains en hiver ?", options: ["C'est interdit de marcher dehors","Parce qu'il fait très froid","Les rues sont fermées","C'est plus rapide"], answer: 1 },
        { q: "Comment s'appelle le réseau souterrain de Montréal ?", options: ["Le tunnel de Montréal","Le réseau caché","La Ville souterraine","Le métro express"], answer: 2 },
        { q: "Quel aéroport est mentionné dans le texte ?", options: ["Montréal-Pierre Elliott Trudeau","Montréal-Dorval","Montréal-Mirabel","Montréal-Est"], answer: 0 },
      ]
    },
  ]
};

// ─── WRITING PROMPTS ────────────────────────────────────────────────
const WRITING_PROMPTS = {
  1: [ // Informal task 1 (60-80 words)
    { text: "Vous avez reçu un message d'un ami francophone qui veut savoir comment se passe votre apprentissage du français. Écrivez-lui un message pour décrire vos progrès, les difficultés que vous rencontrez et comment vous vous préparez pour votre examen TEF.", target: "60–80 words" },
    { text: "Votre collègue francophone vous invite à une fête chez lui samedi soir. Malheureusement, vous avez déjà un engagement ce soir-là. Écrivez-lui un message pour vous excuser, lui expliquer pourquoi vous ne pouvez pas venir et lui proposer une autre date pour vous retrouver.", target: "60–80 words" },
    { text: "Vous cherchez un colocataire pour votre appartement. Écrivez un message à un(e) ami(e) pour lui décrire l'appartement, les conditions de colocation et lui demander s'il/elle connaît quelqu'un d'intéressé.", target: "60–80 words" },
    { text: "Vous venez de finir une longue journée de travail et vous écrivez un message à votre famille restée dans votre pays d'origine. Décrivez votre journée, parlez de votre vie au Canada et dites-leur comment vous vous sentez.", target: "60–80 words" },
    { text: "Un ami vous a recommandé un restaurant français à Montréal. Vous y êtes allé(e) hier soir. Écrivez un message à cet ami pour lui donner votre avis sur le restaurant — la nourriture, l'ambiance, le service et si vous le recommanderiez.", target: "60–80 words" },
  ],
  2: [ // Formal task 2 (120-150 words)
    { text: "Vous êtes candidat(e) à un poste dans une entreprise québécoise. Le responsable des ressources humaines vous demande : « Selon vous, quels sont les défis principaux auxquels font face les immigrants qui s'intègrent au marché du travail canadien, et comment les surmonter ? » Rédigez une réponse formelle.", target: "120–150 words" },
    { text: "Vous avez lu dans un journal que la ville de Montréal envisage de supprimer les cours de français obligatoires dans certaines écoles primaires anglophones. Rédigez une lettre formelle au maire de Montréal pour exprimer votre opinion sur cette mesure.", target: "120–150 words" },
    { text: "Votre employeur vous demande de rédiger un rapport court sur les avantages et inconvénients du télétravail pour votre équipe. Présentez les deux côtés de la question et faites une recommandation.", target: "120–150 words" },
    { text: "Un organisme communautaire vous demande : « Pensez-vous que l'apprentissage de la langue française est essentiel pour l'intégration des immigrants au Québec ? Justifiez votre réponse. » Rédigez une réponse formelle et argumentée.", target: "120–150 words" },
    { text: "Vous souhaitez obtenir une bourse pour suivre des cours de français intensifs. Rédigez une lettre de motivation adressée au comité de sélection en expliquant votre situation, vos objectifs linguistiques et pourquoi vous méritez cette bourse.", target: "120–150 words" },
  ]
};

// ─── SPEAKING PROMPTS ────────────────────────────────────────────────
const SPEAKING_PROMPTS = {
  1: [ // Photo description (2 min)
    "Décrivez une scène de marché animé dans une ville francophone. Que voyez-vous ? Qui sont les personnes présentes ? Quelle atmosphère se dégage de cette image ?",
    "Imaginez une photo d'une famille qui mange ensemble autour d'une grande table. Décrivez la scène en détail : les personnes, l'environnement, ce que vous ressentez en regardant cette image.",
    "Décrivez une scène de bureau moderne. Qui travaille là ? Que font les personnes ? Quelle est l'ambiance générale de cet espace de travail ?",
    "Imaginez une photo d'un jeune immigrant qui arrive à l'aéroport de Montréal. Décrivez la scène : son expression, ses bagages, les gens autour de lui. Que pensez-vous qu'il ressent ?",
  ],
  2: [ // Opinion (2-3 min)
    "Selon vous, quels sont les avantages et les inconvénients de vivre dans une grande ville comme Montréal ou Vancouver par rapport à une ville plus petite ?",
    "Pensez-vous que les réseaux sociaux ont plus d'effets positifs ou négatifs sur la société ? Justifiez votre opinion avec des exemples concrets.",
    "Le gouvernement devrait-il investir davantage dans les transports en commun plutôt que dans la construction de nouvelles routes ? Donnez votre avis et défendez-le.",
    "Pensez-vous que le télétravail devrait être un droit pour tous les employés dont le poste le permet ? Défendez votre position.",
    "L'immigration est-elle bénéfique pour le Canada ? Présentez votre point de vue en vous appuyant sur des arguments concrets.",
  ],
  3: [ // Dialogue/role-play (3-4 min)
    "Vous appelez votre propriétaire pour signaler un problème dans votre appartement (chauffage en panne en hiver). Expliquez le problème, exprimez votre mécontentement poliment et demandez une solution rapide.",
    "Vous êtes en entretien d'embauche pour un poste dans une entreprise francophone à Montréal. Présentez-vous, parlez de votre expérience professionnelle et expliquez pourquoi vous êtes le/la meilleur(e) candidat(e).",
    "Vous rencontrez un voisin dans l'escalier. Il vous demande des conseils sur les meilleurs quartiers de Montréal pour s'installer avec une famille. Donnez-lui vos recommandations en expliquant vos choix.",
    "Vous contactez le service client d'une banque pour contester un frais bancaire incorrect sur votre compte. Expliquez le problème clairement et demandez un remboursement.",
  ]
};

const SPEAKING_TIPS = {
  1: ["Commencez par une description générale avant de passer aux détails", "Utilisez le vocabulaire de la description spatiale : au premier plan, en arrière-plan, à gauche/droite", "Décrivez les personnes (âge, vêtements, expression), l'environnement et l'ambiance", "Utilisez des connecteurs : on peut voir..., il semble que..., ce qui est frappant c'est que..."],
  2: ["Structurez votre réponse : d'un côté... d'un autre côté...", "Donnez des exemples concrets pour étayer chaque argument", "Utilisez le conditionnel pour nuancer : il faudrait que..., on pourrait envisager...", "Concluez clairement en réaffirmant votre position"],
  3: ["Adaptez votre registre : formel pour un entretien, semi-formel pour un voisin", "Utilisez des formules de politesse appropriées", "Réagissez naturellement aux questions imaginaires", "Montrez que vous gérez l'imprévu avec des phrases comme : c'est une bonne question, permettez-moi de réfléchir..."]
};

const USEFUL_PHRASES = [
  { fr: "À mon avis...", en: "In my opinion..." },
  { fr: "Il me semble que...", en: "It seems to me that..." },
  { fr: "D'un côté... d'un autre côté...", en: "On one hand... on the other hand..." },
  { fr: "Je suis convaincu(e) que...", en: "I am convinced that..." },
  { fr: "Permettez-moi de réfléchir...", en: "Allow me to think..." },
  { fr: "C'est une excellente question...", en: "That's an excellent question..." },
  { fr: "En ce qui me concerne...", en: "As far as I'm concerned..." },
  { fr: "Pour conclure...", en: "To conclude..." },
  { fr: "Cependant, il faut noter que...", en: "However, it should be noted that..." },
  { fr: "En d'autres termes...", en: "In other words..." },
  { fr: "Je voudrais ajouter que...", en: "I would like to add that..." },
  { fr: "D'après ce que je comprends...", en: "From what I understand..." },
];

// ─── LISTENING TASKS ────────────────────────────────────────────────
const LISTENING_TASKS = [
  "Aujourd'hui : écoutez un épisode d'InnerFrench (innerfrench.com). Choisissez un épisode de niveau B1/B2. Pendant l'écoute, notez 5 mots ou expressions que vous ne connaissez pas. Ensuite, écrivez un résumé de 3–5 phrases en français de ce que vous avez compris.",
  "Aujourd'hui : écoutez le Journal en français facile de RFI (rfi.fr). C'est une émission d'actualités de 10 minutes, parlée lentement. Notez 3 informations principales que vous avez comprises. Pouvez-vous identifier les sujets traités ?",
  "Aujourd'hui : regardez une vidéo d'Easy French sur YouTube. Écoutez les interviews et essayez de comprendre au moins 3 opinions différentes exprimées par les personnes interrogées. Notez les mots ou structures qui vous ont aidé(e) à comprendre.",
  "Aujourd'hui : écoutez France 24 en français pendant 15 minutes. C'est du français authentique à vitesse normale. Ne vous découragez pas si vous ne comprenez pas tout — concentrez-vous sur les mots-clés. Notez le thème principal et 2–3 détails.",
  "Aujourd'hui : cherchez sur YouTube une conférence TED en français ou un documentaire francophone court. Notez le titre et le sujet. Après l'écoute, écrivez 5 phrases en français résumant ce que vous avez retenu.",
  "Aujourd'hui : exercice d'écoute ciblée. Regardez n'importe quelle vidéo en français avec sous-titres français activés. Écoutez une première fois sans lire. Puis relisez les sous-titres. Quels mots et expressions vous étaient inconnus ? Notez-les ici.",
  "Aujourd'hui : entraînement spécifique TEF. Les enregistrements du TEF comprennent des conversations, des annonces publiques et des reportages. Trouvez une annonce publique ou un bulletin météo en français sur YouTube. Notez les informations clés : qui, quoi, quand, où.",
];

// ─── VOCAB DATA ──────────────────────────────────────────────────────
const VOCAB = {
  work: [
    { fr: "embaucher", en: "to hire", type: "verb", ex: "L'entreprise a embauché vingt nouveaux employés." },
    { fr: "licencier", en: "to fire / lay off", type: "verb", ex: "Il a été licencié à cause des restrictions budgétaires." },
    { fr: "un entretien", en: "an interview", type: "noun (m)", ex: "J'ai un entretien d'embauche demain matin." },
    { fr: "postuler", en: "to apply (for a job)", type: "verb", ex: "J'ai postulé à trois offres d'emploi cette semaine." },
    { fr: "un délai", en: "a deadline", type: "noun (m)", ex: "Nous devons respecter ce délai impérativement." },
    { fr: "une réunion", en: "a meeting", type: "noun (f)", ex: "La réunion de ce matin a duré deux heures." },
    { fr: "le salaire", en: "salary / wage", type: "noun (m)", ex: "Son salaire a augmenté de 10 % cette année." },
    { fr: "un congé", en: "leave / day off", type: "noun (m)", ex: "Je prends deux semaines de congé en août." },
    { fr: "la retraite", en: "retirement", type: "noun (f)", ex: "Elle prendra sa retraite l'année prochaine." },
    { fr: "les heures supplémentaires", en: "overtime", type: "noun (f pl)", ex: "Il fait des heures supplémentaires chaque semaine." },
  ],
  immigration: [
    { fr: "la résidence permanente", en: "permanent residence", type: "noun (f)", ex: "Il a obtenu sa résidence permanente après deux ans." },
    { fr: "s'intégrer", en: "to integrate", type: "verb", ex: "Elle s'est bien intégrée dans sa nouvelle communauté." },
    { fr: "un permis de travail", en: "a work permit", type: "noun (m)", ex: "Mon permis de travail expire dans six mois." },
    { fr: "la citoyenneté", en: "citizenship", type: "noun (f)", ex: "Il a demandé la citoyenneté canadienne l'an dernier." },
    { fr: "déménager", en: "to move (house)", type: "verb", ex: "Nous avons déménagé à Vancouver il y a un an." },
    { fr: "une demande", en: "an application / request", type: "noun (f)", ex: "Ma demande de visa a été acceptée." },
    { fr: "le pays d'origine", en: "country of origin", type: "noun (m)", ex: "Mon pays d'origine est Singapour." },
    { fr: "s'établir", en: "to settle / establish oneself", type: "verb", ex: "Ils se sont établis au Québec il y a cinq ans." },
    { fr: "bilingue", en: "bilingual", type: "adj", ex: "Le Canada est un pays officiellement bilingue." },
    { fr: "un formulaire", en: "a form", type: "noun (m)", ex: "Vous devez remplir ce formulaire en ligne." },
  ],
  society: [
    { fr: "le gouvernement", en: "the government", type: "noun (m)", ex: "Le gouvernement a annoncé de nouvelles mesures." },
    { fr: "une loi", en: "a law", type: "noun (f)", ex: "Une nouvelle loi sur le logement a été votée." },
    { fr: "l'égalité", en: "equality", type: "noun (f)", ex: "L'égalité des chances est un droit fondamental." },
    { fr: "la diversité", en: "diversity", type: "noun (f)", ex: "Montréal est une ville connue pour sa diversité culturelle." },
    { fr: "voter", en: "to vote", type: "verb", ex: "Les citoyens canadiens votent tous les quatre ans." },
    { fr: "un débat", en: "a debate", type: "noun (m)", ex: "Ce sujet fait l'objet d'un vif débat dans la société." },
    { fr: "les droits de l'homme", en: "human rights", type: "noun (m pl)", ex: "Le respect des droits de l'homme est essentiel." },
    { fr: "le chômage", en: "unemployment", type: "noun (m)", ex: "Le taux de chômage a diminué ce trimestre." },
    { fr: "une manifestation", en: "a protest / demonstration", type: "noun (f)", ex: "Des milliers de personnes ont participé à la manifestation." },
    { fr: "la laïcité", en: "secularism", type: "noun (f)", ex: "La laïcité est un principe fondateur de la République française." },
  ],
  daily: [
    { fr: "se débrouiller", en: "to manage / get by", type: "verb", ex: "Je me débrouille bien en français maintenant." },
    { fr: "une habitude", en: "a habit", type: "noun (f)", ex: "J'ai l'habitude de lire en français chaque matin." },
    { fr: "le quotidien", en: "daily life / the everyday", type: "noun (m)", ex: "Le français fait maintenant partie de mon quotidien." },
    { fr: "un quartier", en: "a neighbourhood", type: "noun (m)", ex: "J'habite dans un quartier très animé." },
    { fr: "les transports en commun", en: "public transport", type: "noun (m pl)", ex: "Je prends les transports en commun chaque jour." },
    { fr: "faire les courses", en: "to go grocery shopping", type: "expression", ex: "Je fais les courses le samedi matin." },
    { fr: "un loyer", en: "rent", type: "noun (m)", ex: "Mon loyer est élevé dans ce quartier central." },
    { fr: "une facture", en: "a bill / invoice", type: "noun (f)", ex: "J'ai reçu la facture d'électricité ce matin." },
    { fr: "la vie quotidienne", en: "daily life", type: "noun (f)", ex: "La vie quotidienne au Canada est très différente." },
    { fr: "s'en sortir", en: "to manage / cope", type: "expression", ex: "Il s'en sort bien malgré les difficultés." },
  ],
  health: [
    { fr: "une ordonnance", en: "a prescription", type: "noun (f)", ex: "Le médecin m'a donné une ordonnance." },
    { fr: "se faire soigner", en: "to get treatment", type: "expression", ex: "Il faut vous faire soigner rapidement." },
    { fr: "les urgences", en: "the emergency room", type: "noun (f pl)", ex: "Elle a été transportée aux urgences hier soir." },
    { fr: "un rendez-vous", en: "an appointment", type: "noun (m)", ex: "J'ai pris rendez-vous chez le médecin pour lundi." },
    { fr: "l'assurance maladie", en: "health insurance", type: "noun (f)", ex: "L'assurance maladie couvre les consultations médicales." },
    { fr: "se rétablir", en: "to recover", type: "verb", ex: "Il se rétablit progressivement après son opération." },
    { fr: "une douleur", en: "pain / ache", type: "noun (f)", ex: "J'ai une douleur dans le dos depuis hier." },
    { fr: "un symptôme", en: "a symptom", type: "noun (m)", ex: "Quels sont vos symptômes exactement ?", },
    { fr: "la prévention", en: "prevention", type: "noun (f)", ex: "La prévention est essentielle en matière de santé." },
    { fr: "guérir", en: "to heal / recover", type: "verb", ex: "Cette maladie guérit en quelques semaines avec traitement." },
  ],
  environment: [
    { fr: "le réchauffement climatique", en: "climate change / global warming", type: "noun (m)", ex: "Le réchauffement climatique est l'enjeu du siècle." },
    { fr: "les énergies renouvelables", en: "renewable energy", type: "noun (f pl)", ex: "Le Canada investit dans les énergies renouvelables." },
    { fr: "la pollution", en: "pollution", type: "noun (f)", ex: "La pollution de l'air est un problème majeur en ville." },
    { fr: "développement durable", en: "sustainable development", type: "noun (m)", ex: "Nous devons adopter un modèle de développement durable." },
    { fr: "recycler", en: "to recycle", type: "verb", ex: "Il est important de recycler les déchets." },
    { fr: "une empreinte carbone", en: "a carbon footprint", type: "noun (f)", ex: "Prendre l'avion augmente notre empreinte carbone." },
    { fr: "la biodiversité", en: "biodiversity", type: "noun (f)", ex: "La déforestation menace la biodiversité mondiale." },
    { fr: "un déchet", en: "waste / rubbish", type: "noun (m)", ex: "Il faut réduire nos déchets plastiques." },
    { fr: "la sécheresse", en: "drought", type: "noun (f)", ex: "Les sécheresses sont de plus en plus fréquentes." },
    { fr: "s'engager", en: "to commit / get involved", type: "verb", ex: "Nous devons nous engager pour la planète." },
  ],
  connectors: [
    { fr: "cependant", en: "however", type: "connector (contrast)", ex: "C'est une bonne idée ; cependant, elle présente des risques." },
    { fr: "néanmoins", en: "nevertheless", type: "connector (contrast)", ex: "La situation est difficile. Néanmoins, nous pouvons progresser." },
    { fr: "de plus", en: "furthermore / moreover", type: "connector (addition)", ex: "De plus, cette solution est économique." },
    { fr: "par conséquent", en: "consequently / therefore", type: "connector (result)", ex: "Il a travaillé dur ; par conséquent, il a réussi." },
    { fr: "en revanche", en: "on the other hand", type: "connector (contrast)", ex: "Le prix est élevé. En revanche, la qualité est excellente." },
    { fr: "en outre", en: "in addition / furthermore", type: "connector (addition)", ex: "En outre, ce projet crée de l'emploi." },
    { fr: "c'est pourquoi", en: "that is why", type: "connector (cause-effect)", ex: "Il pleut ; c'est pourquoi nous restons à la maison." },
    { fr: "bien que (+ subj.)", en: "although / even though", type: "connector (concession)", ex: "Bien qu'il soit fatigué, il continue à travailler." },
    { fr: "en définitive", en: "ultimately / in the end", type: "connector (conclusion)", ex: "En définitive, c'est la meilleure solution." },
    { fr: "à condition que (+ subj.)", en: "provided that", type: "connector (condition)", ex: "Nous partirons à condition qu'il fasse beau." },
  ],
};

// ─── VERBS (subset of the verb trainer data) ─────────────────────────
const VERBS = [
  {v:'être',e:'to be',g:'irr',present:['suis','es','est','sommes','êtes','sont'],pc:['ai été','as été','a été','avons été','avez été','ont été'],imparfait:['étais','étais','était','étions','étiez','étaient'],futur:['serai','seras','sera','serons','serez','seront'],conditionnel:['serais','serais','serait','serions','seriez','seraient'],subjonctif:['sois','sois','soit','soyons','soyez','soient'],imperatif:[null,'sois',null,'soyons','soyez',null]},
  {v:'avoir',e:'to have',g:'irr',present:['ai','as','a','avons','avez','ont'],pc:['ai eu','as eu','a eu','avons eu','avez eu','ont eu'],imparfait:['avais','avais','avait','avions','aviez','avaient'],futur:['aurai','auras','aura','aurons','aurez','auront'],conditionnel:['aurais','aurais','aurait','aurions','auriez','auraient'],subjonctif:['aie','aies','ait','ayons','ayez','aient'],imperatif:[null,'aie',null,'ayons','ayez',null]},
  {v:'aller',e:'to go',g:'irr',present:['vais','vas','va','allons','allez','vont'],pc:['suis allé(e)','es allé(e)','est allé(e)','sommes allé(e)s','êtes allé(e)(s)','sont allé(e)s'],imparfait:['allais','allais','allait','allions','alliez','allaient'],futur:['irai','iras','ira','irons','irez','iront'],conditionnel:['irais','irais','irait','irions','iriez','iraient'],subjonctif:['aille','ailles','aille','allions','alliez','aillent'],imperatif:[null,'va',null,'allons','allez',null]},
  {v:'faire',e:'to do/make',g:'irr',present:['fais','fais','fait','faisons','faites','font'],pc:['ai fait','as fait','a fait','avons fait','avez fait','ont fait'],imparfait:['faisais','faisais','faisait','faisions','faisiez','faisaient'],futur:['ferai','feras','fera','ferons','ferez','feront'],conditionnel:['ferais','ferais','ferait','ferions','feriez','feraient'],subjonctif:['fasse','fasses','fasse','fassions','fassiez','fassent'],imperatif:[null,'fais',null,'faisons','faites',null]},
  {v:'prendre',e:'to take',g:'irr',present:['prends','prends','prend','prenons','prenez','prennent'],pc:['ai pris','as pris','a pris','avons pris','avez pris','ont pris'],imparfait:['prenais','prenais','prenait','prenions','preniez','prenaient'],futur:['prendrai','prendras','prendra','prendrons','prendrez','prendront'],conditionnel:['prendrais','prendrais','prendrait','prendrions','prendriez','prendraient'],subjonctif:['prenne','prennes','prenne','prenions','preniez','prennent'],imperatif:[null,'prends',null,'prenons','prenez',null]},
  {v:'venir',e:'to come',g:'irr',present:['viens','viens','vient','venons','venez','viennent'],pc:['suis venu(e)','es venu(e)','est venu(e)','sommes venu(e)s','êtes venu(e)(s)','sont venu(e)s'],imparfait:['venais','venais','venait','venions','veniez','venaient'],futur:['viendrai','viendras','viendra','viendrons','viendrez','viendront'],conditionnel:['viendrais','viendrais','viendrait','viendrions','viendriez','viendraient'],subjonctif:['vienne','viennes','vienne','venions','veniez','viennent'],imperatif:[null,'viens',null,'venons','venez',null]},
  {v:'pouvoir',e:'can/to be able',g:'irr',present:['peux','peux','peut','pouvons','pouvez','peuvent'],pc:['ai pu','as pu','a pu','avons pu','avez pu','ont pu'],imparfait:['pouvais','pouvais','pouvait','pouvions','pouviez','pouvaient'],futur:['pourrai','pourras','pourra','pourrons','pourrez','pourront'],conditionnel:['pourrais','pourrais','pourrait','pourrions','pourriez','pourraient'],subjonctif:['puisse','puisses','puisse','puissions','puissiez','puissent'],imperatif:[null,null,null,null,null,null]},
  {v:'vouloir',e:'to want',g:'irr',present:['veux','veux','veut','voulons','voulez','veulent'],pc:['ai voulu','as voulu','a voulu','avons voulu','avez voulu','ont voulu'],imparfait:['voulais','voulais','voulait','voulions','vouliez','voulaient'],futur:['voudrai','voudras','voudra','voudrons','voudrez','voudront'],conditionnel:['voudrais','voudrais','voudrait','voudrions','voudriez','voudraient'],subjonctif:['veuille','veuilles','veuille','voulions','vouliez','veuillent'],imperatif:[null,'veuille',null,'voulons','voulez',null]},
  {v:'devoir',e:'must/have to',g:'irr',present:['dois','dois','doit','devons','devez','doivent'],pc:['ai dû','as dû','a dû','avons dû','avez dû','ont dû'],imparfait:['devais','devais','devait','devions','deviez','devaient'],futur:['devrai','devras','devra','devrons','devrez','devront'],conditionnel:['devrais','devrais','devrait','devrions','devriez','devraient'],subjonctif:['doive','doives','doive','devions','deviez','doivent'],imperatif:[null,null,null,null,null,null]},
  {v:'savoir',e:'to know (facts)',g:'irr',present:['sais','sais','sait','savons','savez','savent'],pc:['ai su','as su','a su','avons su','avez su','ont su'],imparfait:['savais','savais','savait','savions','saviez','savaient'],futur:['saurai','sauras','saura','saurons','saurez','sauront'],conditionnel:['saurais','saurais','saurait','saurions','sauriez','sauraient'],subjonctif:['sache','saches','sache','sachions','sachiez','sachent'],imperatif:[null,'sache',null,'sachons','sachez',null]},
  {v:'voir',e:'to see',g:'irr',present:['vois','vois','voit','voyons','voyez','voient'],pc:['ai vu','as vu','a vu','avons vu','avez vu','ont vu'],imparfait:['voyais','voyais','voyait','voyions','voyiez','voyaient'],futur:['verrai','verras','verra','verrons','verrez','verront'],conditionnel:['verrais','verrais','verrait','verrions','verriez','verraient'],subjonctif:['voie','voies','voie','voyions','voyiez','voient'],imperatif:[null,'vois',null,'voyons','voyez',null]},
  {v:'mettre',e:'to put',g:'irr',present:['mets','mets','met','mettons','mettez','mettent'],pc:['ai mis','as mis','a mis','avons mis','avez mis','ont mis'],imparfait:['mettais','mettais','mettait','mettions','mettiez','mettaient'],futur:['mettrai','mettras','mettra','mettrons','mettrez','mettront'],conditionnel:['mettrais','mettrais','mettrait','mettrions','mettriez','mettraient'],subjonctif:['mette','mettes','mette','mettions','mettiez','mettent'],imperatif:[null,'mets',null,'mettons','mettez',null]},
  {v:'partir',e:'to leave',g:'irr',present:['pars','pars','part','partons','partez','partent'],pc:['suis parti(e)','es parti(e)','est parti(e)','sommes parti(e)s','êtes parti(e)(s)','sont parti(e)s'],imparfait:['partais','partais','partait','partions','partiez','partaient'],futur:['partirai','partiras','partira','partirons','partirez','partiront'],conditionnel:['partirais','partirais','partirait','partirions','partiriez','partiraient'],subjonctif:['parte','partes','parte','partions','partiez','partent'],imperatif:[null,'pars',null,'partons','partez',null]},
  {v:'parler',e:'to speak',g:'er',present:['parle','parles','parle','parlons','parlez','parlent'],pc:['ai parlé','as parlé','a parlé','avons parlé','avez parlé','ont parlé'],imparfait:['parlais','parlais','parlait','parlions','parliez','parlaient'],futur:['parlerai','parleras','parlera','parlerons','parlerez','parleront'],conditionnel:['parlerais','parlerais','parlerait','parlerions','parleriez','parleraient'],subjonctif:['parle','parles','parle','parlions','parliez','parlent'],imperatif:[null,'parle',null,'parlons','parlez',null]},
  {v:'finir',e:'to finish',g:'ir',present:['finis','finis','finit','finissons','finissez','finissent'],pc:['ai fini','as fini','a fini','avons fini','avez fini','ont fini'],imparfait:['finissais','finissais','finissait','finissions','finissiez','finissaient'],futur:['finirai','finiras','finira','finirons','finirez','finiront'],conditionnel:['finirais','finirais','finirait','finirions','finiriez','finiraient'],subjonctif:['finisse','finisses','finisse','finissions','finissiez','finissent'],imperatif:[null,'finis',null,'finissons','finissez',null]},
  {v:'choisir',e:'to choose',g:'ir',present:['choisis','choisis','choisit','choisissons','choisissez','choisissent'],pc:['ai choisi','as choisi','a choisi','avons choisi','avez choisi','ont choisi'],imparfait:['choisissais','choisissais','choisissait','choisissions','choisissiez','choisissaient'],futur:['choisirai','choisiras','choisira','choisirons','choisirez','choisiront'],conditionnel:['choisirais','choisirais','choisirait','choisirions','choisiriez','choisiraient'],subjonctif:['choisisse','choisisses','choisisse','choisissions','choisissiez','choisissent'],imperatif:[null,'choisis',null,'choisissons','choisissez',null]},
  {v:'réussir',e:'to succeed',g:'ir',present:['réussis','réussis','réussit','réussissons','réussissez','réussissent'],pc:['ai réussi','as réussi','a réussi','avons réussi','avez réussi','ont réussi'],imparfait:['réussissais','réussissais','réussissait','réussissions','réussissiez','réussissaient'],futur:['réussirai','réussiras','réussira','réussirons','réussirez','réussiront'],conditionnel:['réussirais','réussirais','réussirait','réussirions','réussiriez','réussiraient'],subjonctif:['réussisse','réussisses','réussisse','réussissions','réussissiez','réussissent'],imperatif:[null,'réussis',null,'réussissons','réussissez',null]},
  {v:'travailler',e:'to work',g:'er',present:['travaille','travailles','travaille','travaillons','travaillez','travaillent'],pc:['ai travaillé','as travaillé','a travaillé','avons travaillé','avez travaillé','ont travaillé'],imparfait:['travaillais','travaillais','travaillait','travaillions','travailliez','travaillaient'],futur:['travaillerai','travailleras','travaillera','travaillerons','travaillerez','travailleront'],conditionnel:['travaillerais','travaillerais','travaillerait','travaillerions','travailleriez','travailleraient'],subjonctif:['travaille','travailles','travaille','travaillions','travailliez','travaillent'],imperatif:[null,'travaille',null,'travaillons','travaillez',null]},
  {v:'comprendre',e:'to understand',g:'irr',present:['comprends','comprends','comprend','comprenons','comprenez','comprennent'],pc:['ai compris','as compris','a compris','avons compris','avez compris','ont compris'],imparfait:['comprenais','comprenais','comprenait','comprenions','compreniez','comprenaient'],futur:['comprendrai','comprendras','comprendra','comprendrons','comprendrez','comprendront'],conditionnel:['comprendrais','comprendrais','comprendrait','comprendrions','comprendriez','comprendraient'],subjonctif:['comprenne','comprennes','comprenne','comprenions','compreniez','comprennent'],imperatif:[null,'comprends',null,'comprenons','comprenez',null]},
  {v:'apprendre',e:'to learn',g:'irr',present:['apprends','apprends','apprend','apprenons','apprenez','apprennent'],pc:['ai appris','as appris','a appris','avons appris','avez appris','ont appris'],imparfait:['apprenais','apprenais','apprenait','apprenions','appreniez','apprenaient'],futur:['apprendrai','apprendras','apprendra','apprendrons','apprendrez','apprendront'],conditionnel:['apprendrais','apprendrais','apprendrait','apprendrions','apprendriez','apprendraient'],subjonctif:['apprenne','apprennes','apprenne','apprenions','appreniez','apprennent'],imperatif:[null,'apprends',null,'apprenons','apprenez',null]},
  {v:'se lever',e:'to get up',g:'er',present:["me lève","te lèves","se lève","nous levons","vous levez","se lèvent"],pc:["me suis levé(e)","t'es levé(e)","s'est levé(e)","nous sommes levé(e)s","vous êtes levé(e)(s)","se sont levé(e)s"],imparfait:["me levais","te levais","se levait","nous levions","vous leviez","se levaient"],futur:["me lèverai","te lèveras","se lèvera","nous lèverons","vous lèverez","se lèveront"],conditionnel:["me lèverais","te lèverais","se lèverait","nous lèverions","vous lèveriez","se lèveraient"],subjonctif:["me lève","te lèves","se lève","nous levions","vous leviez","se lèvent"],imperatif:[null,"lève-toi",null,"levons-nous","levez-vous",null]},
  {v:'devenir',e:'to become',g:'irr',present:['deviens','deviens','devient','devenons','devenez','deviennent'],pc:['suis devenu(e)','es devenu(e)','est devenu(e)','sommes devenu(e)s','êtes devenu(e)(s)','sont devenu(e)s'],imparfait:['devenais','devenais','devenait','devenions','deveniez','devenaient'],futur:['deviendrai','deviendras','deviendra','deviendrons','deviendrez','deviendront'],conditionnel:['deviendrais','deviendrais','deviendrait','deviendrions','deviendriez','deviendraient'],subjonctif:['devienne','deviennes','devienne','devenions','deveniez','deviennent'],imperatif:[null,'deviens',null,'devenons','devenez',null]},
];

const TENSE_LABELS = {present:'Présent',pc:'Passé composé',imparfait:'Imparfait',futur:'Futur simple',conditionnel:'Conditionnel',subjonctif:'Subjonctif',imperatif:'Impératif'};
const SUBJECTS = ['je (j\')','tu','il / elle','nous','vous','ils / elles'];

const RUBRIC_CRITERIA = {
  1: [
    { name: 'Task completion', hint: 'Did you address all parts of the prompt?' },
    { name: 'Register', hint: 'Is the tone appropriately informal?' },
    { name: 'Vocabulary', hint: 'Varied and appropriate word choices?' },
    { name: 'Grammar', hint: 'Correct tenses, agreements, articles?' },
  ],
  2: [
    { name: 'Task completion', hint: 'Did you address all parts of the prompt?' },
    { name: 'Register & format', hint: 'Formal greeting, body, closing?' },
    { name: 'Connectors', hint: 'Used linking words: cependant, de plus, etc.?' },
    { name: 'Grammar & vocabulary', hint: 'Complex structures, varied vocabulary?' },
  ]
};

const DAILY_TARGETS = [
  "Complete today's reading passage (15 min timed)",
  "Listen to 25+ mins of authentic French audio",
  "Write your TEF writing task (Task 1 + Task 2)",
  "Practice speaking for 5 minutes on today's prompt",
  "Do 20 grammar conjugation questions",
  "Review 15 vocabulary flashcards",
];
