import React, { useState, useMemo } from "react";

/* ============================================================================
   FICHE DE SYNTHÈSE INTERACTIVE — COMPARATIVE LAW (LDROI1310)
   C. Laske — UCLouvain — Q2 / 3 crédits
   App de révision : matière, fiches auteurs, tableau comparatif,
   schémas conceptuels, banque de questions (QCM + ouvertes).
   ========================================================================== */

/* ----------------------------- DESIGN TOKENS ----------------------------- */
const C = {
  ink: "#1a1410",
  paper: "#f4ece0",
  paper2: "#ece0cf",
  line: "#cbb89c",
  accent: "#8a3324",      // rouge ocre (sceau de cire)
  accent2: "#3f5e4e",     // vert juridique
  gold: "#b08229",
  muted: "#6b5d49",
  white: "#fffdf8",
};

const TRADITION_COLORS = {
  classique: "#3f5e4e",
  imperial: "#8a3324",
  postcolonial: "#b08229",
  pluralisme: "#4a6b8a",
  module: "#6b4a8a",
};

/* ============================================================================
   DONNÉES — FICHES AUTEURS
   ========================================================================== */
const AUTHORS = [
  {
    id: "scarciglia",
    name: "R. Scarciglia",
    era: "classique",
    role: "Histoire du droit comparé avant le 19e s.",
    one: "Mémoire juridique : comment les modèles de droit émergent et circulent dans le temps.",
    must: false,
    points: [
      { h: "Thèse centrale", t: "Le droit comparé n'est pas une invention moderne : il a des origines anciennes. Mais c'est au 19e s. qu'il devient une discipline à part entière. Insiste sur la mémoire juridique et la référence historique." },
      { h: "Méthode", t: "Dépasser la simple classification : intégrer histoire, culture et politique. Plaide pour un pluralisme méthodologique et une ouverture aux phénomènes transnationaux et globaux." },
      { h: "Antiquité", t: "Lycurgue (Sparte) et Solon (Athènes) voyagent pour étudier d'autres lois. Les XII Tables = règles surtout morales, pas comparatives." },
      { h: "Moyen Âge", t: "Étude conjointe du droit romain et du droit canonique. Rôle central des universités italiennes." },
      { h: "Renaissance", t: "Dumoulin : comparaison systématique entre droit national et droit romain. Critique des décisions des juges → développement d'idées juridiques universelles." },
      { h: "17e–18e s.", t: "Diffusion des méthodes comparatives en Europe ; circulation accrue des livres de droit." },
      { h: "19e s.", t: "Naissance du droit comparé moderne ; centres universitaires spécialisés ; influence des écoles historiques." },
      { h: "1900 – mi-20e s.", t: "Congrès de Paris (1900) = acte fondateur officiel. Pollock & Kohler : combiner approche historique et comparative." },
      { h: "Après 2e GM / 21e s.", t: "Expansion du droit comparé, Guerre froide, américanisation du droit. Puis pluralisme méthodologique, interdisciplinarité, phénomènes transnationaux/globaux." },
    ],
  },
  {
    id: "samuel",
    name: "Geoffrey Samuel",
    era: "classique",
    role: "Problèmes et promesses du droit comparé",
    one: "4 niveaux de controverse + 2 « briques » de la discipline (comparaison & droit).",
    must: true,
    points: [
      { h: "4 niveaux de difficulté/controverse", t: "1) CONTENU (qu'enseigner : un common core ou la diversité ?) — 2) MÉTHODOLOGIE (méthode fonctionnelle ? insider vs outsider ?) — 3) ÉPISTÉMOLOGIE (que compare-t-on, comment définir « le droit » sans imposer ses concepts ?) — 4) THÉORIE (simple technique ou besoin d'un fondement théorique ?)." },
      { h: "Variante des 4 niveaux (cours)", t: "Épistémologique (nature/validité du savoir comparatif), Méthodologique (outils, unités, classification), Ontologique (qu'est-ce qu'un système juridique ?), Axiologique (valeurs et finalités de la comparaison)." },
      { h: "Les 2 briques de la discipline", t: "COMPARAISON (révéler ressemblances/différences, dépend du contexte, plusieurs niveaux) + DROIT (souvent réduit aux règles/normes, mais le droit dépasse les règles)." },
      { h: "Problème de définition", t: "Le droit comparé n'est pas l'acquisition de connaissances sur un autre système, ni de l'histoire du droit : c'est regarder les approches comparatives d'autres disciplines et définir chaque terme." },
      { h: "Dimension interdisciplinaire", t: "Apport de la sociologie, anthropologie, linguistique, sciences cognitives, psychologie, économie… → ouvre les questions épistémologiques et élargit la comparaison." },
      { h: "Forces / Faiblesses", t: "Forces : comprendre la diversité, identifier ressemblances/différences, inspirer des réformes. Faiblesses : simplification excessive, distorsion culturelle, outil idéologique en cas de mauvais usage." },
    ],
  },
  {
    id: "saleilles",
    name: "R. Saleilles",
    era: "classique",
    role: "Montée de l'État-nation (19e s.) — Congrès de Paris 1900",
    one: "« Droit commun de l'humanité civilisée » par l'histoire comparative.",
    must: true,
    points: [
      { h: "Vision du droit comparé", t: "Objectif : identifier un droit commun universel de l'humanité civilisée, produit de l'histoire comparative. Les droits nationaux ne sont que des adaptations locales de cette science universelle du droit." },
      { h: "Contexte", t: "Rédige le rapport du Congrès international (« Sur l'utilité, le but et le programme du congrès »). Inspiré par la Société de législation comparée (1869) et le Congrès international (1900). Conscient de l'imperialisme colonial en toile de fond." },
      { h: "3 façons dont le droit étranger influence le droit national", t: "1) Processus législatif (observation → comparaison → adaptation ; ne pas copier mécaniquement) — 2) Apports coutumiers et doctrinaux (la coutume précède souvent la loi ; jurisprudence/doctrine inspirées de solutions étrangères) — 3) Accords internationaux (tacites ou exprès) vers un « droit commun » des nations civilisées." },
      { h: "Les 3 voies (version cours)", t: "Critique comparative ; emprunt juridique (legal borrowing) ; harmonisation internationale." },
      { h: "Enseignement", t: "Pour Saleilles, c'est aussi une méthode pédagogique : il faut déterminer à quelles conditions les conclusions tirées de la comparaison sont légitimes." },
      { h: "⚠ Toile de fond", t: "L'Europe est vue comme le centre du monde ; les autres pays « non civilisés ». Universalisme mais imperialisme colonial sous-jacent." },
    ],
  },
  {
    id: "maine",
    name: "H. S. Maine",
    era: "imperial",
    role: "Imperialisme & colonialisme — fondateur de l'anthropologie juridique",
    one: "Du « statut » au « contrat » ; sociétés « stationnaires » vs « progressives ».",
    must: true,
    points: [
      { h: "Qui était Maine ?", t: "Professeur de droit civil à Cambridge, conseiller du gouvernement britannique en Inde, chaire de jurisprudence historique et comparative à Oxford. Souvent considéré comme le fondateur de l'anthropologie juridique. Œuvres : Ancient Law (1861), Village-Communities in East and West (1871), The Early History of the Property of Married Women (1873)." },
      { h: "Status → Contract", t: "Le statut = position attribuée/héritée (famille, classe sociale) ; l'individu est sous contrôle externe. Le contrat = phase moderne où l'individu est un agent autonome capable d'accords. Le progrès des sociétés = transition du statut au contrat (l'individu remplace la famille comme unité de base du droit civil)." },
      { h: "Stationnaire vs Progressive", t: "Une fois le droit primitif codifié, son évolution spontanée cesse ; les changements deviennent volontaires et externes. Sociétés stationnaires (peu de changement) vs progressives (en évolution constante, rares dans l'histoire)." },
      { h: "Pourquoi un regard imperialiste ?", t: "Croyance en la supériorité des systèmes juridiques occidentaux : « English law is the perfection of human reason ». Croyance en une évolution vers le paradigme occidental. Recherche d'éléments communs dans les codes « civilisés »." },
      { h: "Supériorité du code sur le droit « primitif »", t: "La codification fait sortir du droit primitif (= tout le « pré-code »). Pousse la société à « progresser ». ⚠ Doctrine idéaliste et discriminante : où sont les femmes, les non-éduqués ? Le « contrat social » ne s'appliquerait ni en Asie ni en Afrique." },
    ],
  },
  {
    id: "kohler",
    name: "Joseph Kohler",
    era: "imperial",
    role: "Évolution juridique (1849–1919) — le droit comme phénomène culturel",
    one: "La science du droit doit être philosophique, historique, comparative et dogmatique.",
    must: false,
    points: [
      { h: "Évolution juridique", t: "Reprend la théorie de l'évolution (biologie/géologie) : variation, sélection, transmission/rétention. Le droit évolue selon des lois régulières et naturelles ; perspective téléologique (développement directionnel et finalisé)." },
      { h: "4 dimensions de la science du droit", t: "Philosophique (justice, droits, morale), historique (développement dans le temps), comparative (autres systèmes), dogmatique (exposé systématique des lois telles qu'elles sont)." },
      { h: "Le droit est dynamique", t: "Le droit n'est pas statique : il change constamment. Kohler le voit comme un « phénomène culturel » (pensée nouvelle au 19e s. à côté de la pensée imperialiste)." },
    ],
  },
  {
    id: "zweigert",
    name: "Zweigert & Kötz",
    era: "postcolonial",
    role: "Fonctionnalisme — Introduction to Comparative Law (1987)",
    one: "Comparer le droit = comparer les fonctions ; praesumptio similitudinis.",
    must: true,
    points: [
      { h: "Méthode fonctionnelle", t: "Le but premier du droit est de résoudre les problèmes de la société. Comparer le droit = comparer les fonctions des systèmes (ex : la « promesse » fonctionne différemment en civil law et common law). Pas comment c'est écrit, mais comment ça marche en pratique." },
      { h: "4 propositions", t: "1) Le droit est fonctionnel (résout des problèmes) — 2) Le droit est sociologique (problèmes globalement similaires entre sociétés) — 3) Praesumptio similitudinis (présomption de similarité) — 4) Thèse de la convergence (à terme, un système juridique global unique pourrait émerger)." },
      { h: "Rechtskreise (familles)", t: "Classification de Zweigert-Kötz, plus basée sur « civilisé/non civilisé » : tradition romane, germanique, nordique/scandinave, common law, socialiste, extrême-orientale, islamique, hindoue." },
      { h: "⚠ Critique du fonctionnalisme", t: "« Trop facile » : on présume la similarité parce qu'on « pense » que c'est similaire — c'est NOTRE représentation du droit. Risque d'ignorer les nuances culturelles/historiques et d'homogénéiser la diversité (cf. Ruskola : imperialisme épistémologique)." },
    ],
  },
  {
    id: "said",
    name: "Edward Said",
    era: "postcolonial",
    role: "Théorie post-coloniale — Orientalism (1978)",
    one: "L'Orient est une invention culturelle, produit d'un discours de pouvoir.",
    must: true,
    points: [
      { h: "Qui était Said ?", t: "Né à Jérusalem (1935), famille chrétienne palestinienne ; carrière aux USA (professeur, penseur, musicien, critique littéraire et culturel). Influencé par Derrida, Foucault, Gramsci, Adorno. Un des fondateurs des études post-coloniales." },
      { h: "Thèse d'Orientalism (1978)", t: "L'Occident a construit l'Orient comme une entité exotique, arriérée et inférieure. L'orientalisme = un style occidental de domination : un corps de savoir mais aussi un cadre de pouvoir qui permet à l'Occident de définir l'Orient pour ses propres fins." },
      { h: "Représentation devient réalité", t: "Les représentations (peintures, littérature, académie) « européanisent » l'Orient ; ces clichés deviennent mainstream et passent pour la réalité. Ce qui manque : la voix et le point de vue réels des peuples concernés." },
      { h: "Post-colonialisme / études post-coloniales", t: "Analysent l'effet du colonialisme sur les identités, cultures et récits (dans les colonies ET chez les colonisateurs). Enjeux : représentation, langage, hybridité. Logique de division du monde entre « dominants » et « dominés » (forme d'imperialisme intellectuel)." },
    ],
  },
  {
    id: "ruskola",
    name: "T. Ruskola",
    era: "postcolonial",
    role: "Legal Orientalism — critique du fonctionnalisme",
    one: "Said appliqué au droit : la Chine représentée comme pays « sans droit ».",
    must: true,
    points: [
      { h: "Critique du fonctionnalisme", t: "Le fonctionnalisme suppose que tous les systèmes répondent aux mêmes problèmes universels. Mais ce qui compte comme « problème juridique » dépend du contexte culturel → risque de projeter une vision occidentale = imperialisme épistémologique." },
      { h: "Imperialisme épistémologique", t: "Un système de savoir dominant (souvent occidental) impose ses propres cadres. Ex : en Inde coloniale, les Anglais interprètent le droit hindou selon leurs catégories (propriété privée), déformant le droit local." },
      { h: "Orientalisme juridique", t: "L'Orient perçu via des discours biaisés produits par l'Occident. Appliqué au droit : la Chine est représentée comme un pays « sans droit » ou « non moderne ». Il ne parle pas du droit chinois en soi, mais de sa représentation dans le discours occidental." },
      { h: "Auto-orientalisation", t: "Les élites chinoises ont elles-mêmes renforcé l'image d'une Chine gouvernée par la morale (confucianisme) et non par le droit — ce qui masque le rôle réel et complexe du droit dans l'histoire chinoise." },
      { h: "Communauté imaginée (B. Anderson)", t: "La Chine n'a pas toujours été unifiée, mais l'idée d'une Chine unifiée persiste comme mythe politique ; le droit participe à la construction de cette identité." },
      { h: "Interlégalité (B. de Sousa Santos)", t: "Interaction et interpénétration des systèmes ; le « bagage » que les Occidentaux apportent à leur compréhension du droit chinois inclut leurs propres biais et souvent ceux des Chinois eux-mêmes." },
      { h: "Éthique plutôt que morale", t: "Éthique = approche nuancée, respectueuse, reconnaissant la logique interne de chaque système. Morale = impose un cadre unique et présuppose ce qui est « juste »." },
    ],
  },
  {
    id: "tamanaha",
    name: "B. Tamanaha",
    era: "pluralisme",
    role: "Pluralisme juridique & contexte colonial",
    one: "Coexistence de plusieurs systèmes juridiques dans un même espace social.",
    must: true,
    points: [
      { h: "Profil", t: "Théoricien contemporain, spécialiste du pluralisme juridique et des liens droit/société. Approche interdisciplinaire (droit, sociologie, anthropologie) et empirique." },
      { h: "Pluralisme juridique", t: "Coexistence de plusieurs systèmes dans un même espace social : droit étatique, coutumier, religieux, international, transnational, indigène… Rejet du monisme juridique (seul le droit de l'État compte)." },
      { h: "Droit comme phénomène social", t: "Le droit ne se réduit pas aux textes : il vit par les pratiques sociales. Distinguer law in books (droit écrit, formel) et law in action (droit réellement appliqué)." },
      { h: "Pluralisme colonial", t: "Coexistence forcée : droit colonial (imposé) + droit coutumier local (souvent limité aux matières « mineures ») + normes religieuses. Pluralisme hiérarchique : le droit colonial domine." },
      { h: "Deux périodes de colonisation", t: "1500–1800 : missionnaires, ressources matérielles. 19e s. : tracé des frontières, saisie de l'autorité, affirmation de la domination (frontières tracées sans égard aux réalités locales)." },
      { h: "3 couches de tribunaux coloniaux", t: "1) Cours coloniales (juges de la métropole, droit colonial/codes transplantés) — 2) Cours de district/régionales (+ droit coutumier/religieux avec experts locaux) — 3) Cours indigènes/villageoises (chefs, anciens ; coutumes locales, pas d'interférence coloniale)." },
      { h: "Droit foncier colonial", t: "Réorganisation de l'accès à la terre au service des intérêts économiques coloniaux ; titres de propriété écrits → dépossession des populations locales (dépossession légalisée)." },
      { h: "Critiques", t: "Le pluralisme n'est pas toujours positif : il peut être instrumentalisé pour exploiter/exclure. Ses effets persistent après la décolonisation (inégalités structurelles)." },
    ],
  },
  {
    id: "griffiths",
    name: "John Griffiths",
    era: "pluralisme",
    role: "Théorie du pluralisme juridique (1986)",
    one: "« Le pluralisme juridique est un fait ; le centralisme juridique est un mythe. »",
    must: true,
    points: [
      { h: "Thèse", t: "Centralisme juridique = idéologie selon laquelle le droit est (et devrait être) uniquement le droit de l'État, hiérarchique et unifié. Griffiths le rejette : c'est un mythe, une illusion. Le pluralisme juridique est la réalité empirique." },
      { h: "Pluralisme faible vs fort", t: "FAIBLE : diversité reconnue ET régulée par l'État (contexte colonial ; ex. conseils de la charia validés par la justice britannique). FORT : systèmes autonomes, non reconnus par l'État, opérant en parallèle (ex. règlements internes appliqués par certaines communautés en Allemagne). Griffiths s'intéresse au pluralisme FORT." },
      { h: "Principe de personnalité", t: "Selon le groupe auquel on appartient (ex. citoyenneté), des lois différentes s'appliquent dans le même espace géographique → illustration du pluralisme." },
      { h: "Pospisil (niveaux juridiques)", t: "Dans une société, plusieurs niveaux juridiques superposés ; chaque sous-groupe (village, tribu, corporation) a son système. Critiques de Griffiths : vision trop « holistique », manque de critères pour identifier un sous-groupe, risque de retomber dans le centralisme." },
      { h: "Auteurs discutés", t: "Smith (firm theory : groupes comme unités régulatrices — trop statique). Ehrlich (living law : règles de décision vs règles de conduite). Moore (semi-autonomous social fields : entités qui produisent et appliquent leurs propres règles tout en étant intégrées)." },
    ],
  },
  {
    id: "duplessis",
    name: "J. Du Plessis",
    era: "pluralisme",
    role: "Systèmes juridiques mixtes",
    one: "La « mixité » est l'expression institutionnalisée du pluralisme juridique.",
    must: true,
    points: [
      { h: "Notions clés", t: "Pluralisme = coexistence de systèmes dans un espace social. Mixité = interaction/chevauchement entre ces ordres (question de degré ; tous les systèmes sont « mixtes » à un stade). Hybridité = mélange du légal ET du normatif (normes non écrites qui régissent le comportement)." },
      { h: "3 phases du pluralisme", t: "CLASSIQUE (ère coloniale : droit impérial sur le coutumier ; application différenciée selon le groupe). NOUVELLE (États modernes : interaction droit étatique / non étatique ; reconnaissance partielle). GLOBALE (mondialisation : standards internationaux, européens, corporatifs, environnementaux ; pluralisme multi-niveaux)." },
      { h: "Exemples de systèmes mixtes", t: "Afrique du Sud (roman-néerlandais + common law anglaise) ; Écosse (droit romain + common law) ; Québec (droit civil français privé + public/constitutionnel anglais) ; Louisiane (Code civil français/espagnol + influence common law US)." },
      { h: "Classifications — Palmer", t: "1re famille : civil law ; 2e : common law ; 3e : systèmes mixtes civil/common (Third Legal Family). Critères : approche occidentale, quantitatif (quelle proportion ?), structurel (privé vs public)." },
      { h: "Classifications — Ottawa Study", t: "5e grande famille. 11 sous-familles selon l'interaction civil/common/coutumier/religieux. Les 5 grandes familles : civil, common, coutumier, musulman, mixte. ⚠ Problèmes : peu utile au niveau global, exclut le religieux (seulement « musulman »), où commence/s'arrête un système moniste ?" },
      { h: "Classifications — Örücü", t: "Rejette la classification rigide : « arbre généalogique » (family tree). Pas de « familles pures ». Mixes ouverts (overt) vs cachés (covert). Critères : origines historiques, structures, contexte socio-culturel, effectivité, adaptabilité, interactions inter-légales." },
      { h: "Glenn (legal traditions)", t: "Radical : évite la « classification de systèmes », décrit les grandes traditions juridiques (occidentale civil/common, indigène, religieuses/philosophiques). Regarder le degré d'influence d'une tradition sur les systèmes nationaux." },
      { h: "Rôle des droits fondamentaux", t: "Fonction intégratrice dans les systèmes mixtes : harmonisation, interprétation, résolution de conflits — mais aussi tensions entre traditions." },
    ],
  },
  {
    id: "nelken",
    name: "D. Nelken",
    era: "pluralisme",
    role: "Droit comparé et culture juridique",
    one: "Culture juridique interne (professionnels) vs externe (société).",
    must: true,
    points: [
      { h: "Culture juridique", t: "Distingue la culture juridique INTERNE (acteurs du système : juges, avocats, personnel des tribunaux) et la culture juridique EXTERNE (attitudes, attentes et opinions de la société sur le droit)." },
      { h: "Conseil aux comparatistes", t: "S'engager de manière critique avec le concept de « culture juridique » : ne pas le réifier ni le traiter comme une boîte fermée et homogène ; rester attentif à ses ambiguïtés et à son caractère dynamique." },
    ],
  },
  {
    id: "cotterrell",
    name: "R. Cotterrell",
    era: "module",
    role: "Ch. 6 — Droit comparé et culture juridique",
    one: "Law in culture vs law as culture ; la culture comme fait, approche et valeur.",
    must: true,
    points: [
      { h: "Pourquoi la culture ?", t: "Comparer le droit écrit seul est insuffisant : il faut intégrer la « culture juridique » (ex. réactions différentes aux règles Covid dans des pays au droit similaire)." },
      { h: "Deux angles", t: "Law IN culture (le droit dans la culture) vs law AS culture (tout le phénomène du droit est culturel)." },
      { h: "Trois façons d'aborder", t: "La culture juridique comme FAIT (quelles preuves ? interne/externe — Friedman), comme APPROCHE (manière d'étudier le droit en société ; conditionne/bloque les changements — Blankenberg), comme VALEUR (évaluation ; ex. law and economics ; Kultur allemande vs civilisation française)." },
      { h: "Critique de Watson", t: "Cotterrell reproche à Watson un usage de la culture juridique « sociologiquement orienté mais sans sociologie »." },
      { h: "Langue & traduction", t: "Notions culturellement intraduisibles (contract ≠ contrat ; magistrat ≠ magistrate). En droit comparé : décoder le sens dans la langue source, comprendre le contexte, recoder." },
    ],
  },
  {
    id: "friedman",
    name: "L. Friedman",
    era: "module",
    role: "Ch. 6 — Culture juridique interne / externe",
    one: "La culture juridique n'est pas un fait mais une catégorie ; interne vs externe.",
    must: false,
    points: [
      { h: "Catégorie, pas fait", t: "Pour Friedman, la culture juridique n'est pas un fait en soi mais une catégorie dans laquelle ranger les faits." },
      { h: "Interne", t: "Culture des officiels/professionnels du droit (Parlement, tribunaux) — ceux qui agissent « dans le droit »." },
      { h: "Externe", t: "Culture des individus/groupes « sujets » du droit ; leur attitude et leur usage du droit en façonnent le contenu et la direction (ex. respect ou non des règles Covid)." },
      { h: "Confiance (trust)", t: "Notion centrale : le degré de confiance dans le droit (dimension externe) conditionne le recours au droit." },
    ],
  },
  {
    id: "merry",
    name: "Sally Merry",
    era: "module",
    role: "Ch. 6 — Dimensions de la culture juridique",
    one: "Quatre dimensions de la culture juridique.",
    must: false,
    points: [
      { h: "4 dimensions", t: "1) Pratiques et idéologies dans le système juridique ; 2) attitude publique envers le droit ; 3) façon dont les gens définissent leurs problèmes en termes juridiques et recourent au droit ; 4) conscience juridique des individus (se voient-ils protégés par le droit ?)." },
    ],
  },
  {
    id: "kelsen",
    name: "Hans Kelsen",
    era: "module",
    role: "Ch. 7 — Le canon est-il un système juridique ?",
    one: "L'Église catholique équivaut à un État → « droit étatique un peu spécial ».",
    must: false,
    points: [
      { h: "Théorie pure du droit", t: "Constitutionnaliste autrichien ; théorie pure du droit (sans référence aux sciences sociales). Construit une théorie de l'État." },
      { h: "Canon = quasi-État", t: "Dans les années 1930, il étudie le canon et conclut que sa structure porteuse — l'Église catholique — équivaut à un État (même sans territoire) → « le droit canonique est un droit étatique un peu spécial ». (NB : États pontificaux disparus en 1870 ; État du Vatican en 1929.)" },
    ],
  },
  {
    id: "romano",
    name: "Santi Romano",
    era: "module",
    role: "Ch. 7 — Pluralisme juridique",
    one: "Partout où il y a structure de sanctions, il y a du droit (même la mafia).",
    must: false,
    points: [
      { h: "Pluralisme", t: "Juriste italien célèbre pour son livre sur le pluralisme juridique. Tout corps social capable d'organisation et de structurer une sanction produit du droit (ex. la mafia)." },
    ],
  },
  {
    id: "sohm",
    name: "Rudolf Sohm",
    era: "module",
    role: "Ch. 7 — Critique théologique du droit canon",
    one: "Le droit canonique est une « imposture » : le Christ a aboli la loi.",
    must: false,
    points: [
      { h: "Critique théologique", t: "Théologien protestant (19e s.) : le Christ est venu révoquer la loi et instaurer la « loi nouvelle du Salut et de l'amour » → il ne peut y avoir de droit dans une Église chrétienne ; le canon est une imposture. Critique théologique (non étatique). Rappel : Luther brûle le Corpus Iuris Canonici en 1517. La théologie catholique du 20e s. délégitimera le canon en suivant Sohm." },
    ],
  },
];

/* ============================================================================
   DONNÉES — STRUCTURE DU COURS (chapitres / matière)
   ========================================================================== */
const COURSE = [
  {
    id: "ch0",
    n: "Chapitre 0",
    title: "Introduction générale",
    color: "#3f5e4e",
    sections: [
      { h: "Qu'est-ce que le droit comparé ?", t: "Pas un ensemble de lois mais une ACTIVITÉ : comparer différents systèmes/droits pour mieux comprendre les cultures étrangères et favoriser le progrès juridique. Comme apprendre une langue étrangère (vocabulaire, grammaire, étrangeté qui se familiarise)." },
      { h: "Les 4 questions", t: "POURQUOI compare-t-on ? QUE peut-on comparer ? QUE compare-t-on ? COMMENT compare-t-on ? → questions de théorie (pourquoi/quoi), de méthodologie (comment) et de contexte historique." },
      { h: "Terme moderne", t: "Le droit comparé est un terme moderne désignant une branche distincte de la science juridique, née au 19e s. Avant : usage sporadique et limité de la méthode comparative." },
      { h: "Applications", t: "Mettre en évidence ressemblances/différences, classer en familles/traditions, analyser les influences mutuelles. Usages pratiques : harmonisation du droit, coopération judiciaire, protection des droits humains, enseignement." },
      { h: "Examen", t: "Écrit, 2h, livre fermé (pas de PPT/textes/notes). Dictionnaire bilingue général autorisé SANS annotations. Hybride : 50% = 2 questions ouvertes (~500 mots, ex. évaluation d'une affirmation, comparaison de traditions) + 50% = QCM vrai/faux (½ pt) avec justification (½ pt), ~20 affirmations. ⚠ Le prof ne s'intéresse pas aux détails (dates) mais aux grandes idées." },
    ],
  },
  {
    id: "ch1",
    n: "Chapitre 1",
    title: "Approches traditionnelles — comparaison des systèmes nationaux",
    color: "#3f5e4e",
    sections: [
      { h: "Montée des États-nations (19e s.)", t: "Avant le 19e s. : on pense en « régence », pas en « pays ». Avec l'État-nation et la codification : abandon du droit romain idéal au profit d'un droit national unifié et écrit. UN pays = entité juridique homogène = unité de base de la comparaison (ex. Code Napoléon). Fin de l'existence parallèle du ius commune et du droit pratiqué." },
      { h: "Classification en familles", t: "Distinction majeure : common law (jurisprudence, le juge fait le droit) vs civil law (codes, textes législatifs généraux et abstraits). Autres familles : coutumière, religieuse, mixte. Carte fréquente : 5 familles (civil, common, musulman, coutumier, mixte). Souvent fondée sur des présupposés « civilisé/non civilisé »." },
      { h: "Contexte du 19e s.", t: "1) Nationalisme + codification (France, Allemagne, Italie, Japon). 2) Imperialisme/colonialisme : confrontation aux droits non occidentaux (coutumier, religieux). 3) Montée de la science moderne et du positivisme (Darwin, méthode scientifique : observer, mesurer, expérimenter)." },
      { h: "Buts du DC liés aux États-nations", t: "Informer sur les systèmes étrangers (concordances FR/DE/EN) ; inspirer les réformes (les USA importent la doctrine allemande/française ; HGB, Code de commerce). En Belgique : législation sociale comparée pour la « question sociale ». Idéal : trouver un « terrain commun » après le ius commune." },
      { h: "Exemples « providing information »", t: "Souvent simple juxtaposition par les praticiens : Blaxland (Codex legum anglicanarum, 1839) ; Saint-Joseph (Concordance entre les codes civils étrangers et le Code Napoléon, 1840)." },
      { h: "Congrès de Paris (1900)", t: "Aboutissement de la Société de législation comparée (1869). Vision avec fondement philosophique (nouveau !). Idée d'« universal jurisprudence » et de rapprochement. Contexte : Exposition universelle (« qui suis-je ? »). ⚠ Mais l'Europe se voit comme le centre du monde (toile de fond coloniale)." },
    ],
  },
  {
    id: "ch2",
    n: "Chapitre 2",
    title: "Imperialisme, colonialisme & montée de la science moderne",
    color: "#8a3324",
    sections: [
      { h: "Imperialisme juridique", t: "Imperialisme = politique d'un État réduisant d'autres États à la dépendance politique/économique. Dans la pensée du 19e s., les cultures colonisées sont vues comme « primitives ». On compare leur système au sien → croyance en la supériorité occidentale." },
      { h: "Maine & anthropologie juridique", t: "Maine (Ancient Law, 1861) : « English law = perfection of human reason ». Status → contract ; stationnaire → progressive. Justifie l'imposition des systèmes occidentaux aux colonies. (Voir fiche Maine.)" },
      { h: "Buts du DC en contexte colonial", t: "Informer les administrateurs coloniaux, comprendre le droit des colonisés pour mieux administrer la justice (et mieux coloniser). Questions : quel droit appliquer aux litiges mixtes ? Validité des jugements des juges indigènes/étrangers ? Importance du droit international privé et des tribunaux mixtes." },
      { h: "Montée de la science moderne", t: "Méthode scientifique : observation, mesure, expérimentation, hypothèses. Étendue au-delà des sciences exactes (biologie, linguistique). Darwin : l'évolution par sélection naturelle ; la méthode comparative devient centrale. Émergence de l'évolutionnisme juridique." },
      { h: "Buts du DC liés au tournant scientifique", t: "Identifier des lois/patterns régissant l'évolution des systèmes ; classer les droits nationaux en groupes (comme Darwin classe les animaux) ; combler les lacunes de l'histoire du droit via un modèle évolutionniste (« eux aujourd'hui = nous dans le passé », ex. « Germanic law »)." },
      { h: "Évolution juridique & Kohler", t: "Théorie de l'évolution appliquée au droit (variation, sélection, transmission) ; perspective téléologique. Kohler : la science du droit est philosophique, historique, comparative et dogmatique ; le droit est un phénomène culturel dynamique. (Voir fiche Kohler.)" },
    ],
  },
  {
    id: "ch3",
    n: "Chapitre 3",
    title: "Ère post-coloniale — nouvelles méthodologies & paradigmes",
    color: "#b08229",
    sections: [
      { h: "Théorie post-coloniale", t: "Étudie comment le colonialisme a affecté colonies ET colonisateurs (ex. Inde, Congo, Belgique). Décolonisation après la 2e GM (Afrique, Asie du Sud). Said & Orientalism (1978) = acte fondateur. (Voir fiches Said, Ruskola.)" },
      { h: "Persistance des approches classiques", t: "On informe toujours sur les systèmes étrangers : Société de législation comparée (1869, toujours active), Académie internationale de droit comparé (La Haye, 1924), European Law Institute (idéalistes : terrain commun). Classification en « Legal Families » / Rechtskreise (Zweigert-Kötz), sans présupposé civilisé/non civilisé." },
      { h: "Fonctionnalisme (Zweigert & Kötz)", t: "Le droit résout des problèmes ; comparer = comparer les fonctions. 4 propositions + praesumptio similitudinis + thèse de convergence. Critique : trop facile, projette notre représentation. (Voir fiche Zweigert & Kötz.)" },
      { h: "Inspiration d'autres sciences", t: "Oxford Handbook (Reimann & Zimmermann, 2e éd. 2019). Linguistique (la langue façonne l'interprétation), économie (analyse économique du droit), sociologie (droit comme institution sociale), anthropologie (rôle de la culture)." },
      { h: "Nouveaux paradigmes conceptuels", t: "Pluralisme juridique, pluralisme juridictionnel, legal transplants → systèmes mixtes/hybrides, legal traditions, multinormativité. Conséquence : le droit n'est pas monolithique ; même le droit belge n'est pas homogène. Conscience de l'hétérogénéité interne des systèmes." },
    ],
  },
  {
    id: "ch4",
    n: "Chapitre 4",
    title: "Avant et après le Brexit — la Constitution historique du Royaume-Uni (Wijffels)",
    color: "#6b4a8a",
    sections: [
      { h: "English / British / UK : distinguer", t: "Royaume d'Angleterre (+ Galles) avec sa propre Constitution ; début 18e s. union avec l'Écosse → « Great Britain » (Angleterre + Galles + Écosse, sans l'Irlande) = British Constitution ; 19e s. union avec l'Irlande → « United Kingdom ». ⚠ Les principes constitutionnels anglais ne s'appliquent pas toujours en Écosse. 84% de la population du UK est en Angleterre → poids démocratique écrasant." },
      { h: "Devolution (régionalisation)", t: "Depuis la fin du 16e s. : transfert de pouvoir du gouvernement central (Westminster) vers les régions, de façon ASYMÉTRIQUE. Écosse, Galles, Irlande ont leurs assemblées élues et exécutifs ; l'Angleterre n'en a pas (pas de « Premier ministre anglais », car son pouvoir dépasserait celui du PM du UK)." },
      { h: "Deux référendums sur l'Europe", t: "1975 (Wilson) : ~2/3 pour rester dans la CEE — moyen de contourner la division du Parlement. 2016 (Brexit) : 52% pour quitter. Géographie quasi inversée : Écosse (62%) et Irlande du Nord (55%) pour rester ; Angleterre et Galles pour partir. Les référendums ne faisaient traditionnellement pas partie de la Constitution UK." },
      { h: "Une Constitution « non écrite » ?", t: "Pas de document unique intitulé « the Constitution », mais une grande partie est écrite ANYWAY (textes depuis le 13e s. ; certaines affaires Brexit citent le Bill of Rights du 17e s.). Mieux vaut dire NON CODIFIÉE (pas systématiquement réunie/promulguée) que « non écrite ». Comparaison : la Belgique a une Constitution codifiée mais aussi des coutumes/pratiques qui la complètent." },
      { h: "Constitution « légale » ou « politique » ?", t: "Vue traditionnelle : constitution politique (gérée par les politiques élus). Tendance récente (controversée) : constitution légale (les cours tranchent). Enjeu = légitimité des juges. Le Brexit a ravivé un conflit inédit exécutif/Parlement ; la Cour suprême tranche selon des principes juridiques, pas politiques." },
      { h: "Sources (arrêt 2019 de la Cour suprême)", t: "« Bien que le UK n'ait pas un document unique, il possède une Constitution établie par la common law, les statutes, les conventions et les pratiques. » Sources : (A) législation/statute-law (Parliament Act, Devolution Acts, Constitutional Reform Acts) ; (B) common law et prérogatives royales." },
      { h: "Souveraineté du Parlement", t: "Principe majeur : Parliamentary Supremacy/Sovereignty — pas de norme supérieure à un Act of Parliament ; les cours ne peuvent jamais déclarer un Act inconstitutionnel. En théorie, le Parlement pourrait abolir la monarchie. Pas de procédure renforcée (≠ Belgique « entrenched constitution »). Deux piliers : aucun Parlement ne lie un futur Parlement ; aucun juge ne peut refuser d'appliquer une loi. = absence de contrôle de constitutionnalité au UK. Conventions/coutumes bloquent toutefois certains changements en pratique (ex. Thoburn v Sunderland, 2002 : abrogation implicite)." },
      { h: "Affaire Brexit & prérogatives", t: "Le gouvernement voulait notifier l'UE via la prérogative royale, sans le Parlement. La Cour suprême a imposé le passage par le Parlement car les droits des citoyens étaient affectés. Les prérogatives ne peuvent que se réduire (jamais réapparaître)." },
      { h: "Human Rights Act (1998)", t: "Act of Parliament incorporant la Convention EDH et la jurisprudence de Strasbourg en droit UK → on peut invoquer la CEDH directement devant les cours UK. ⚠ Formellement « juste » un Act → en théorie abrogeable à tout moment. Si une loi est contraire aux droits humains, la cour peut seulement la déclarer incompatible (« disapplied ») ; c'est au gouvernement/Parlement de la changer. Tension démocratie majoritaire vs droits fondamentaux." },
    ],
  },
  {
    id: "ch5",
    n: "Chapitre 5",
    title: "La Common Law (Laske)",
    color: "#3f5e4e",
    sections: [
      { h: "Définition (terme polysémique)", t: "Sens général : règle/coutume commune à une communauté. Sens juridique : la partie du droit dérivée de la coutume et du précédent judiciaire plutôt que prescrite par la loi (statute). Comme SYSTÈME : « le UK a un système de common law » (englobe toutes les sources). Comme SOURCE : le droit créé par les précédents/juges." },
      { h: "Sources", t: "1) Coutumes (plus très importantes) — 2) Common law créée par les juges (précédents) — 3) Statute law / Acts of Parliament (processus démocratique). Ex : le droit pénal, très ancien, est régulé par les juges ; les domaines nouveaux (discrimination, technologie) par statute." },
      { h: "Pourquoi si différente du civil law ? (3 raisons)", t: "1) RÉCEPTION DU DROIT ROMAIN moindre qu'en Europe continentale. 2) CONTINUITÉ : pas de rupture comparable au mouvement de codification (« seamless web », van Caenegem) ; pas de tabula rasa. 3) PRAGMATISME : résoudre le cas concret prime sur la doctrine." },
      { h: "Réception du droit romain — histoire", t: "À la chute de Rome, tribus sans organisation centrale en Europe ; mais l'Angleterre était déjà une nation unifiée (royaume anglo-saxon), droit largement oral. 1066 : conquête normande → gouvernement fort, Curia regis (cour du roi), justices itinérants, juges sédentaires à Westminster. 11e–12e s. (Plantagenêt/Angevin) : système centralisé. Fin 12e s., Henri II : réforme, unification des coutumes, writs, « law French ». → Le droit romain a donc moins influencé l'Angleterre (structure déjà en place)." },
      { h: "Continuité", t: "Pas de rupture : évolution organique, jamais codifiée ; les vieilles lois sont simplement remplacées. 1640–1660 (exécution de Charles Ier, pas de roi) : tentative de codification en « simple English » (un code dans chaque poche) — échouée car Charles II n'en voulait pas." },
      { h: "Pragmatisme & formation", t: "La common law = œuvre des juges ; rôle marginal des professeurs/doctrine. Le droit n'était PAS enseigné à l'université (qui enseignait droit canonique et civil, jugés non pertinents) mais aux Inns of Court : apprentissage par observation des tribunaux + Year Books / Law Reports." },
      { h: "Caractéristique : « non écrite »", t: "Vrai et faux : pas codifiée, mais TOUT est écrit dans les law reports (précédents). Pas de Constitution écrite comme texte unique, mais des textes constitutionnels existent. Souveraineté absolue du Parlement (Gough) : pas de « droit fondamental » au sens d'inaltérable." },
      { h: "Doctrine du précédent", t: "Stare decisis = « s'en tenir à ce qui a été décidé ». Précédent = décision passée devenant autorité ; les décisions des cours supérieures lient les inférieures. Principe : les cas semblables doivent être jugés de la même façon. ⚠ Tension : sécurité juridique vs adaptation au changement social (ex. évolution du statut de l'épouse)." },
      { h: "Le précédent est-il « law-making » ? (débat)", t: "Pour (NON-law-making) : le juge ne fait qu'appliquer/découvrir des règles existantes par analogie (J. Parke, Mirehouse v Rennel 1833). Contre : en appliquant à de nouveaux cas, il CRÉE du droit nouveau — problème démocratique (juges non élus). Illustration Brexit : juges qualifiés d'« ennemis du peuple » pour avoir contré le référendum." },
      { h: "Law reporting", t: "Pour utiliser la case law, il faut des rapports fiables. Mi-19e s. : Council of Law Reporting → ICLR. Standards + accessibilité (physique + abordable). Seuls les arrêts utiles au développement du droit sont publiés (nouveau principe, modification d'une règle, point douteux à régler, ou particulièrement instructifs)." },
      { h: "Terminologie clé", t: "Original / binding / persuasive precedent ; dissenting judgment (cité, non contraignant) ; stare decisis ; ratio decidendi (la raison nécessaire à la décision — SEULE partie qui lie) ; obiter dicta (« autres propos », non contraignants, valeur persuasive) ; overruling (une cour supérieure déclare une règle antérieure erronée). Le raisonnement juridique (pourquoi X l'emporte) est l'essence de la case law." },
      { h: "Lois spécifiques : Equity", t: "Equity (Aristote : « idée de justice qui contrevient à la loi écrite »). Pas l'égalité (même chose pour tous) mais l'équité (s'adapter aux besoins de chacun). Intervient quand le droit écrit/common law crée une injustice. Historiquement : pétitions au roi → le chancelier décidait autrement. Aujourd'hui : Chancery Division. Ex. Lord Denning : droits de l'épouse délaissée sur la maison malgré l'absence de titre. (Autres domaines propres : land, trusts.)" },
      { h: "Adversarial vs inquisitorial", t: "INQUISITOIRE (civil law) : on cherche la vérité en interrogeant ; le juge est actif (mène l'instruction, interroge), les avocats passifs ; les droits de l'accusé sont secondaires. ADVERSARIAL (common law) : vérité par confrontation des parties ; droits individuels suprêmes ; juge/jury passifs, sans connaissance préalable ; avocats très actifs (recueillent et présentent les preuves, persuasion). → Plus de « courtroom drama »." },
      { h: "Professions juridiques (Angleterre & Galles)", t: "SOLICITOR : premier contact, conseil, contrats, testaments, conveyancing (~ notaire mais plus large) ; examen SQE. BARRISTER : plaidoirie (right of audience), formation centrée sur l'advocacy, « Called to the Bar » + pupillage. JUGES : recrutés parmi barristers expérimentés (10–20 ans), PAS de nominations politiques (Judicial Appointments Commission). Inns of Court : Lincoln's Inn, Inner Temple, Middle Temple, Gray's Inn." },
      { h: "Diffusion de la common law (colonisation)", t: "USA, UK, Australie, Canada, Nouvelle-Zélande. AUSTRALIE : colonisée 1788, système anglais ; Australia Act 1986 (indépendance législative) mais monarchie constitutionnelle. CANADA : biculturel (présence française antérieure) ; Québec hybride — droit privé civiliste (Code civil du Québec), droit public common law. AFRIQUE DU SUD : hybride fort (roman-néerlandais + common law anglaise). JAPON : civil law (modèle BGB) avec éléments common law (stare decisis donné à la Cour suprême pour réduire les frictions)." },
    ],
  },
  {
    id: "ch6",
    n: "Chapitre 6",
    title: "Le débat sur la codification — la culture juridique (Cotterrell)",
    color: "#4a6b8a",
    sections: [
      { h: "Pourquoi la culture juridique ?", t: "Pratiquer/vivre le droit diffère même entre pays au droit similaire (ex. réactions aux règles Covid). Comparer en regardant seulement le droit écrit dans un livre est insuffisant : il faut intégrer la « culture ». Texte de référence : R. Cotterrell, « Comparative Law and Legal Culture »." },
      { h: "Law in culture / law as culture", t: "Deux angles : le droit DANS la culture vs le droit COMME culture (tout le phénomène du droit est culturel). Trois façons d'aborder le droit comme culture : comme fait, comme approche, comme valeur." },
      { h: "1) Culture juridique comme fait", t: "Quelles preuves, quels faits ? Où pointer la culture dans le droit ? Peut-on la séparer des cultures politique/économique/religieuse ? Friedman : la culture juridique n'est pas un fait en soi mais une CATÉGORIE. Il distingue culture INTERNE (officiels du droit : Parlement, tribunaux) et culture EXTERNE (individus/groupes « sujets » du droit : leur façon d'user du droit le façonne — ex. respect ou non des règles Covid)." },
      { h: "Dimensions (Sally Merry)", t: "Quatre dimensions : 1) pratiques et idéologies dans le système juridique ; 2) attitude publique envers le droit ; 3) façon dont les gens définissent leurs problèmes en termes juridiques et recourent au droit ; 4) conscience juridique des individus (se voient-ils protégés par le droit ?)." },
      { h: "Culture nationale & globalisation", t: "Jusqu'où traiter les nations comme unités de culture juridique ? Si liée à la culture nationale → uniformité supposée (mais est-ce exact ?). La globalisation affecte la culture juridique au-delà des frontières (ex. Covid : règles transnationales ; Suède peu de règles vs Norvège beaucoup). La globalisation ne supprime pas l'impact des frontières nationales." },
      { h: "2) Culture juridique comme approche", t: "Pas l'objet d'étude mais une MANIÈRE d'étudier le droit dans la société : comment le droit se relie aux structures sociales (confiance, justice, pouvoir, identités). La culture juridique conditionne, facilite ou bloque les changements juridiques (le droit n'est pas statique). Blankenberg : comparer des mécanismes de règlement des litiges sans tenir compte des cultures juridiques n'a aucun sens." },
      { h: "3) Culture juridique comme valeur", t: "Sert à évaluer dans la comparaison. Ex. « law and economics » : applique l'économie au droit, évalue le meilleur résultat de marché comme « meilleure culture juridique » (conséquences de marché, non sociales). Distinction « Kultur » allemande (romantique, unifiante, 19e s.) vs « civilisation » française (idéal universalisant, démocratie). Cultures d'« illégalité » dans certaines régions." },
      { h: "Langue juridique & traduction", t: "Certaines notions sont culturellement intraduisibles. L'environnement conditionne la langue (ex. mots pour la neige en Alaska). Le « contract » de common law ≠ le « contrat » civiliste ; « magistrat » (FR) ≠ « magistrate » (EN, lay magistrate non payé ; équivalent ~ public prosecutor). En droit comparé : décoder le sens dans la langue d'origine, comprendre le contexte, puis recoder dans sa propre langue." },
    ],
  },
  {
    id: "ch7",
    n: "Chapitre 7",
    title: "Le droit canonique (L.-L. Christians)",
    color: "#b08229",
    sections: [
      { h: "Le canon est-il un système juridique ?", t: "Dépend de la définition. Le droit = dispositif de prudence qui entoure le passage à la SANCTION (violence légitime). Kelsen (théorie pure du droit) : l'Église catholique équivaut à un État (sans territoire) → « droit étatique un peu spécial ». Santi Romano (pluralisme) : partout où il y a structure de sanctions, il y a du droit (même la mafia). Rudolf Sohm (théologien protestant, 19e s.) : le Christ a aboli la loi → le droit canonique est une « imposture » (critique théologique, non étatique ; cf. Luther brûle le Corpus Iuris Canonici en 1517)." },
      { h: "Un droit du passé ?", t: "Non. Le canon a structuré la pensée juridique européenne dès le 12e s. (et servi à redécouvrir le droit romain), jusqu'à la Révolution française (fin du privilège du for ; fin du bras séculier). Toujours actif : > 1,38 milliard de personnes, tribunaux ecclésiastiques dans chaque diocèse (> 400). Codifié en 1983, modifié régulièrement." },
      { h: "Densification normative", t: "Multiplication des normes éthiques, déontologiques, professionnelles (avec sanctions). On baigne dans des normes étatiques + usages familiaux + normes religieuses. Le canon coexiste sur le territoire des États sans être reconnu par eux." },
      { h: "Actualités canoniques", t: "Beaucoup de contentieux sur les couples catholiques en difficulté (~100 000/an dans le monde : déclaration de « liberté »/nullité) ; aussi des litiges pénaux. En France : tribunal pénal canonique pour les abus sexuels sur majeurs (mineurs → Vatican)." },
      { h: "Statut du droit religieux dans le droit étatique", t: "Le canon n'est pas un droit étranger ni reconnu comme « droit » par l'État belge, mais actif. Ex. CC arrêt 49/2025 (révocation d'un prof de religion : le dignitaire a le dernier mot s'il motive — « statut hybride ») ; Gand (refus de formation de diacre à une femme → perte de chance) ; registres de baptêmes (RGPD vs archives sacramentelles → question préjudicielle CJUE) ; Cass. fr. 2015 (incompétence des tribunaux étatiques sur les décisions ecclésiastiques)." },
      { h: "Généalogie d'un droit commun européen ?", t: "Le canon a laissé des traces. Mariage : liberté des jeunes de se marier sans accord parental (12e s.) ; indissolubilité → le civil crée le divorce pour faute (adultère, injure, violence) ; hétérosexualité canonique vs same-sex marriage belge (2003) ; pas de devoir conjugal mais indissolubilité ; opposition à la polygamie (comme le civil). Le Code civil belge garde le concept de « mariage » issu du canon." },
      { h: "« Sacré » ou « révélé » ?", t: "Dans la Bible, « loi » = loi du Salut des âmes, pas un code. Le canon se déploie sans perdre de vue la finalité du Salut (canon 1752) → non sacré mais RÉVÉLÉ par Dieu. La Constitution belge (liberté de religion) implique que le droit religieux ne s'applique que sur base du CONSENTEMENT." },
      { h: "Abus sexuels du clergé", t: "La nomenclature existe depuis le Moyen Âge (droit pénal du mariage). Canon 1398 : renvoi de l'état clérical (sanction la plus grave = perte de l'office). ⚠ Formules vagues (« délits contre le 6e commandement ») mettant dans le même sac main baladeuse et viol → non-respect du principe de légalité des délits et des peines. Échec à traiter les ~4% de clergé concernés ; parquet civil absent ; délégitimation du droit canonique." },
      { h: "Démocratique ?", t: "Non démocratique : ce n'est pas le Peuple des Fidèles qui légifère mais le successeur de Pierre (évêque de Rome) via la succession apostolique. Vatican II : abandon du schéma pyramidal → collège des ~4000 évêques (le pape « primus inter pares ») ; chaque évêque légifère pour son diocèse. SYNODALITÉ = parallèle de la démocratie participative (associer les fidèles pour discuter/argumenter, sans décider)." },
      { h: "Séparé de l'État ?", t: "Oui, mais sous réserve du principe (réinterprété) de PROPORTIONNALITÉ : l'autonomie de l'Église est garantie par la Constitution, mais aucun droit fondamental ne prime sur les autres → statut hybride." },
      { h: "Présence et variété", t: "Le canon couvre : les biens (propriété, tutelle du Vatican sur ventes importantes) ; les personnes (prêtre, marié, religieux, vie privée) ; procédures et peines (droits de la défense, secret pontifical) ; relations interreligieuses (mariages mixtes) ; relations avec l'État (> 190 droits étatiques ; ex. nullité du mariage relève du civil, dont le canon déduit une séparation de corps)." },
    ],
  },
  {
    id: "ch8",
    n: "Chapitre 8",
    title: "Introduction au droit congolais (Ch. Via Balole)",
    color: "#8a3324",
    sections: [
      { h: "Avant 1885 (précolonial)", t: "Droit exclusivement coutumier : chaque royaume/tribu/clan a son droit → pluralité de droits coutumiers. Éléments : matériel (pratiques/usages) et psychologique (sentiment d'obligation). 2e moitié du 19e s. : intérêt européen pour l'Afrique. Conférence de Berlin (Bismarck) : règles d'acquisition ; 16 février 1885, le Congo reconnu propriété du roi Léopold II." },
      { h: "1885 (colonial — EIC)", t: "1er juillet 1885 : naissance de l'État indépendant du Congo, Léopold II souverain absolu, législation inspirée du droit belge/occidental → coexistence droit écrit / droits coutumiers. Ex. ordonnance du 1er juillet 1885 sur l'occupation des terres (dépossession, violence coloniale) ; décret du 30 juillet 1888 sur les contrats (toujours en vigueur) ; décret du 4 mai 1895 (immatriculation, « registre des populations civilisées »). Pressions → cession à la Belgique en 1908." },
      { h: "1908 (Congo belge)", t: "Loi du 18 octobre 1908 (« Charte coloniale ») : maintient les textes antérieurs non contraires ; instaure le principe de « personnalité de la loi » (lois différentes selon l'origine nationale : Congolais vs Belges). Droit coutumier toujours coexistant. Critiques (travail forcé) → indépendance en 1960." },
      { h: "1960 (postcolonial)", t: "Indépendance le 30 juin 1960 (Léopoldville). Paradoxe : le Parlement BELGE adopte une loi fondamentale pour le Congo (maintien des textes coloniaux non contraires ; interdiction du travail forcé). Modification progressive des textes. Années 1970, Mobutu : « idéologie de l'authenticité » / zaïrianisation (rejet de l'occidental, retour aux traditions ; ex. interdiction des prénoms occidentaux). Droit écrit toujours calqué sur le belge → mimétisme juridique." },
      { h: "Place dans les traditions juridiques", t: "Les puissances coloniales ont imposé leurs systèmes en Afrique ; à l'indépendance, héritage d'un système non choisi (d'autres pays non colonisés l'ont adopté volontairement). Le Congo a hérité du droit civil belge d'origine germano-canonique et a gardé cette tradition civiliste." },
      { h: "Sources actuelles", t: "Matérielles (facteurs à l'origine des normes ; ex. art. 16 al.5 Const. : interdiction du travail forcé, source = histoire coloniale). Formelles : Constitution (inspirée de la belge, norme suprême, contrôle de constitutionnalité) ; traités internationaux (Congo MONISTE : application directe après ratification) ; loi (constitutionnelles, organiques, ordinaires) ; jurisprudence (peu accessible, non informatisée, pas de jurisprudence constante) ; règlement (autonome, d'application, exceptionnel) ; doctrine ; principes généraux de droit (ord. 14 mai 1986) ; coutume." },
      { h: "La coutume (source originelle majeure)", t: "Traduit l'identité et les valeurs du peuple ; autant de droits coutumiers que de tribus ; non écrite, transmise oralement par le « gardien de la coutume » (qui détermine normes/pratiques applicables ; doctrine et jurisprudence coutumières non écrites). Types : secundum legem (la loi renvoie à la coutume ; ex. fiançailles → coutume de la fiancée en cas de conflit) ; praeter legem (silence de la loi ; ex. dot → coutume de la femme) ; contra legem (contraire à la loi, non appliquée)." },
      { h: "Tensions droit écrit / coutumier — indifférence réciproque", t: "Avant l'indépendance : le colonisateur juge les droits coutumiers « impurs, imprécis, dégénérés, incivilisés, irrationnels » (vs droit romain) → volonté de « civiliser ». Les gardiens de la coutume jugent le droit écrit « importé », occidental, déconnecté → indifférence mutuelle." },
      { h: "Tensions par matière (après l'indépendance)", t: "BIENS : propriété individuelle + certificat d'enregistrement (loi 1973, inspirée du belge, principes Léopold II 1885) vs terre « sacrée »/communautaire et preuve orale (droit foncier « légitime » connu de la communauté) → litiges fonciers, gardiens de la coutume encore actifs (2013). FAMILLE : Code 1987 (inspiré du belge) interdit la polygamie (art. 374), mariage entre 2 personnes de sexe opposé, enregistrement civil, égalité successorale entre tous les enfants vs polygamie coutumière, mariage entre familles/tribus, aîné héritier → INEFFECTIVITÉ. OBLIGATIONS : responsabilité civile individuelle (Léopold II) vs responsabilité collective coutumière (pas de distinction faute/infraction). PUBLIC : mimétisme (démocratie, élections) vs royaumes héréditaires → non-respect, coups d'État." },
      { h: "Organisation judiciaire", t: "Trois ordres juridictionnels (proches du modèle belge) : constitutionnel (Cour constitutionnelle) ; administratif (Conseil d'État, cours d'appel et tribunaux administratifs) ; judiciaire (tribunaux de droit commun avec la Cour de cassation à la tête, + tribunaux spécialisés travail/emploi ; juridictions de droit commun et spécialisées). Avant la colonisation : tribunaux coutumiers ; sous le droit écrit : naissance des tribunaux de droit écrit (compétents ratione personae pour les colons et « assimilés/évolués » ; les coutumiers pour les litiges entre « indigènes »)." },
      { h: "Personnel & auxiliaires de justice", t: "Officiers de police judiciaire affectés à un territoire. Défenseurs judiciaires : corps créé dans les années 1980 (pénurie d'avocats) — un titulaire de BAC 3 en droit peut défendre en 1re instance, dans un seul ressort (vs avocat = tous tribunaux) ; corps voué à disparaître (essor des universités et des avocats)." },
    ],
  },
];

/* ============================================================================
   DONNÉES — CONCEPTS CLÉS (glossaire / liens)
   ========================================================================== */
const CONCEPTS = [
  { term: "Fonctionnalisme", def: "Comparer le droit = comparer les fonctions (résoudre des problèmes sociaux similaires).", who: ["zweigert", "ruskola", "samuel"] },
  { term: "Praesumptio similitudinis", def: "Présomption de similarité entre systèmes (Zweigert & Kötz).", who: ["zweigert"] },
  { term: "Imperialisme épistémologique", def: "Un savoir dominant impose ses cadres aux autres (ex. droit hindou lu via la propriété privée anglaise).", who: ["ruskola"] },
  { term: "Orientalisme", def: "Construction occidentale d'un Orient exotique et inférieur ; discours de pouvoir.", who: ["said", "ruskola"] },
  { term: "Orientalisme juridique", def: "Orientalisme appliqué au droit : Chine représentée comme « sans droit ».", who: ["ruskola"] },
  { term: "Auto-orientalisation", def: "Les élites locales renforcent elles-mêmes l'image (Chine = morale, pas droit).", who: ["ruskola"] },
  { term: "Interlégalité", def: "Interpénétration des systèmes ; biais mutuels (de Sousa Santos).", who: ["ruskola"] },
  { term: "Communauté imaginée", def: "Unité nationale comme mythe politique (B. Anderson).", who: ["ruskola"] },
  { term: "Status → Contract", def: "De la position héritée à l'agent autonome (sociétés progressives).", who: ["maine"] },
  { term: "Sociétés stationnaires/progressives", def: "Peu de changement vs évolution constante (post-codification).", who: ["maine"] },
  { term: "Évolutionnisme juridique", def: "Le droit évolue comme les espèces (variation, sélection, transmission).", who: ["kohler", "maine"] },
  { term: "Pluralisme juridique", def: "Coexistence de plusieurs ordres juridiques dans un même espace social.", who: ["griffiths", "tamanaha", "duplessis"] },
  { term: "Centralisme juridique", def: "Idéologie : seul le droit de l'État compte ; pour Griffiths = mythe.", who: ["griffiths"] },
  { term: "Pluralisme faible / fort", def: "Faible = reconnu/régulé par l'État ; fort = systèmes autonomes non reconnus.", who: ["griffiths"] },
  { term: "Law in books / law in action", def: "Droit écrit/formel vs droit réellement appliqué.", who: ["tamanaha"] },
  { term: "Systèmes mixtes / mixité", def: "Interaction de traditions (civil, common, coutumier, religieux).", who: ["duplessis"] },
  { term: "Hybridité", def: "Mélange du légal ET du normatif (normes non écrites).", who: ["duplessis"] },
  { term: "Legal transplants", def: "Adoption de pratiques d'une juridiction vers une autre → systèmes hybrides.", who: ["duplessis"] },
  { term: "Multinormativité", def: "Pluralité de cadres normatifs dans une société.", who: ["duplessis"] },
  { term: "Rechtskreise", def: "Familles juridiques (Zweigert-Kötz) sans présupposé civilisé/non civilisé.", who: ["zweigert"] },
  { term: "Culture juridique interne/externe", def: "Professionnels du droit vs société.", who: ["nelken"] },
  { term: "Droit commun de l'humanité civilisée", def: "Idéal universaliste de Saleilles.", who: ["saleilles"] },
  { term: "Principe de personnalité", def: "Lois différentes selon le groupe d'appartenance, même espace.", who: ["griffiths"] },
  { term: "Stare decisis", def: "« S'en tenir à ce qui a été décidé » — fondement du précédent.", who: [] },
  { term: "Ratio decidendi / obiter dicta", def: "Raison nécessaire à la décision (lie) vs propos accessoires (persuasifs).", who: [] },
  { term: "Souveraineté du Parlement", def: "Pas de norme supérieure à un Act ; pas de contrôle de constitutionnalité (UK).", who: [] },
  { term: "Equity", def: "Justice qui corrige l'injustice du droit écrit (s'adapter aux besoins), Chancery.", who: [] },
  { term: "Adversarial / inquisitorial", def: "Common law (parties actives, juge passif) vs civil law (juge actif).", who: [] },
  { term: "Solicitor / barrister", def: "Conseil & paperwork vs plaidoirie (right of audience) — UK.", who: [] },
  { term: "Culture juridique interne/externe", def: "Officiels du droit vs société (Friedman/Nelken).", who: ["nelken", "friedman"] },
  { term: "Law in / as culture", def: "Le droit DANS la culture vs le droit COMME culture (Cotterrell).", who: ["cotterrell"] },
  { term: "Mimétisme juridique", def: "Transposition d'un régime d'un État vers un autre (ex. Congo ← Belgique).", who: [] },
  { term: "Coutume secundum/praeter/contra legem", def: "Selon, à défaut de, ou contraire à la loi (droit congolais).", who: [] },
  { term: "Personnalité de la loi (Congo)", def: "Charte 1908 : lois différentes selon l'origine (Congolais/Belges).", who: [] },
  { term: "Zaïrianisation / authenticité", def: "Mobutu : rejet de l'occidental, retour aux traditions.", who: [] },
  { term: "Synodalité", def: "Associer les fidèles sans qu'ils décident — ≈ démocratie participative (canon).", who: ["sohm", "kelsen"] },
];

/* ============================================================================
   DONNÉES — QCM (vrai/faux + justification)
   ========================================================================== */
const QCM = [
  { s: "Pour Zweigert & Kötz, comparer le droit revient à comparer la fonction des règles plutôt que leur forme.", a: true, j: "C'est la méthode fonctionnelle : on regarde quel problème la règle résout (ex. la promesse), pas comment elle est rédigée." },
  { s: "Selon Griffiths, le pluralisme juridique est un mythe et le centralisme juridique est un fait.", a: false, j: "C'est l'inverse : « le pluralisme juridique est un fait ; le centralisme juridique est un mythe, un idéal, une illusion »." },
  { s: "Ruskola affirme étudier en détail le droit chinois tel qu'il existe en Chine.", a: false, j: "Il étudie la REPRÉSENTATION du droit chinois dans le discours occidental, pas le droit chinois en soi." },
  { s: "Pour Maine, l'évolution des sociétés progressives va du « statut » vers le « contrat ».", a: true, j: "L'individu autonome (contrat) remplace la position héritée (statut) ; l'individu remplace la famille comme unité du droit civil." },
  { s: "Le fonctionnalisme repose sur la présomption que les systèmes juridiques sont fondamentalement différents.", a: false, j: "Au contraire : praesumptio similitudinis — présomption de SIMILARITÉ entre systèmes." },
  { s: "Said soutient que l'« Orient » est une invention culturelle produite par un discours de pouvoir occidental.", a: true, j: "Orientalism (1978) : l'Occident construit l'Orient comme exotique/inférieur pour justifier sa domination." },
  { s: "Le pluralisme « fort » de Griffiths désigne une diversité reconnue et régulée par l'État.", a: false, j: "Ça, c'est le pluralisme FAIBLE. Le FORT vise des systèmes autonomes NON reconnus par l'État." },
  { s: "Pour Tamanaha, le droit se réduit à ses textes écrits.", a: false, j: "Le droit vit par les pratiques sociales : distinction law in books vs law in action." },
  { s: "Le Congrès de Paris (1900) est souvent présenté comme l'acte fondateur officiel du droit comparé.", a: true, j: "Aboutissement de la Société de législation comparée (1869) ; Saleilles en rédige le rapport." },
  { s: "Du Plessis distingue trois phases du pluralisme : classique, nouvelle et globale.", a: true, j: "Classique (colonial), nouvelle (État/non-État moderne), globale (mondialisation, multi-niveaux)." },
  { s: "Pour Samuel, le droit comparé se réduit à acquérir des connaissances sur un autre système juridique.", a: false, j: "Justement non : ce n'est ni cela ni de l'histoire du droit ; c'est examiner les approches comparatives et définir les termes." },
  { s: "L'imperialisme épistémologique consiste à imposer les cadres de savoir d'une culture à une autre.", a: true, j: "Ex. de Ruskola : les Anglais lisent le droit hindou via la « propriété privée », déformant le droit local." },
  { s: "Selon Zweigert & Kötz, aucune convergence des systèmes juridiques n'est envisageable.", a: false, j: "Leur 4e proposition est la thèse de la CONVERGENCE : un système global unique pourrait émerger." },
  { s: "Palmer propose une « troisième famille » regroupant les systèmes mêlant civil law et common law.", a: true, j: "Au-delà de l'opposition civil/common, il crée une 3e famille des juridictions mixtes." },
  { s: "Örücü défend une classification rigide et fermée des systèmes juridiques.", a: false, j: "Elle rejette la rigidité : métaphore de l'« arbre généalogique », mixes overt/covert, pas de familles pures." },
  { s: "Pour Maine, le « contrat social » s'applique de la même manière en Asie et en Afrique.", a: false, j: "Selon son point de vue (critiquable), il ne s'y appliquerait pas (droit « primitif ») — vision imperialiste." },
  { s: "La distinction de Nelken oppose culture juridique interne (professionnels) et externe (société).", a: true, j: "Interne = juges/avocats/personnel ; externe = attitudes et attentes de la société." },
  { s: "En droit coutumier congolais, la terre est susceptible d'appropriation privative comme en droit écrit.", a: false, j: "La terre y est « sacrée » et communautaire, non privatisable ; d'où les tensions foncières après l'indépendance." },
  { s: "La souveraineté du Parlement au Royaume-Uni signifie que les cours peuvent annuler un Act of Parliament jugé inconstitutionnel.", a: false, j: "Au contraire : aucune norme n'est supérieure à un Act ; les cours ne peuvent pas le déclarer inconstitutionnel." },
  { s: "Kohler considère que le droit est statique et coupé de la culture.", a: false, j: "Il le voit comme dynamique et comme un « phénomène culturel » ; science du droit = philo + histoire + comparé + dogmatique." },
  { s: "Pour Griffiths, le principe de personnalité (lois selon le groupe d'appartenance) illustre le pluralisme.", a: true, j: "Des lois différentes s'appliquent dans le même espace selon le groupe → plusieurs systèmes coexistent." },
  { s: "Saleilles vise un « droit commun de l'humanité civilisée » issu de l'histoire comparative.", a: true, j: "Les droits nationaux ne seraient que des adaptations locales de cette science universelle du droit." },
  { s: "Au Royaume-Uni, la Constitution est totalement non écrite.", a: false, j: "Elle est NON CODIFIÉE : une grande partie est écrite (textes depuis le 13e s., Acts constitutionnels, Bill of Rights) ; mieux vaut dire partiellement non écrite." },
  { s: "Dans la doctrine du précédent, c'est l'obiter dictum qui lie les juridictions futures.", a: false, j: "C'est la RATIO DECIDENDI (raison nécessaire à la décision) qui lie ; l'obiter dictum n'a qu'une valeur persuasive." },
  { s: "Le système de common law est adversarial, le système de civil law est inquisitorial.", a: true, j: "Common law : parties actives, juge passif, droits individuels suprêmes. Civil law : juge actif menant l'instruction." },
  { s: "La moindre réception du droit romain en Angleterre s'explique notamment par une structure juridique centralisée déjà en place.", a: true, j: "Royaume anglo-saxon unifié, puis gouvernement normand fort (1066), réforme d'Henri II : pas de vacuum comme sur le continent." },
  { s: "L'equity vise à donner exactement la même chose à tout le monde.", a: false, j: "Pas l'égalité mais l'équité : s'adapter aux besoins de chacun ; elle corrige l'injustice du droit écrit (Chancery)." },
  { s: "Au Royaume-Uni, les juges sont en général des nominations politiques.", a: false, j: "Ils sont recrutés parmi les barristers expérimentés via la Judicial Appointments Commission — PAS de nomination politique." },
  { s: "Pour Friedman, la culture juridique interne est celle des individus « sujets » du droit.", a: false, j: "Inverse : l'INTERNE = officiels/professionnels du droit ; l'EXTERNE = individus/groupes sujets du droit." },
  { s: "Pour Kelsen, l'Église catholique peut être assimilée à un État malgré l'absence de territoire propre.", a: true, j: "Il en conclut que le droit canonique est « un droit étatique un peu spécial »." },
  { s: "Selon Santi Romano, seul l'État peut produire du droit.", a: false, j: "Au contraire : tout corps social capable de structurer une sanction produit du droit (même la mafia) — vision pluraliste." },
  { s: "Rudolf Sohm critique le droit canonique sur une base étatique.", a: false, j: "Sa critique est THÉOLOGIQUE : le Christ ayant aboli la loi, le droit canonique serait une « imposture »." },
  { s: "Le droit canonique n'est plus appliqué aujourd'hui.", a: false, j: "Il reste actif (>1,38 milliard de personnes, tribunaux ecclésiastiques par diocèse) ; codifié en 1983, modifié régulièrement." },
  { s: "Le Congo a opté pour le monisme juridique : un traité ratifié s'applique directement devant les juridictions.", a: true, j: "Pas de mécanisme de transposition (≠ pays de common law) ; application directe après ratification valable." },
  { s: "La Charte coloniale de 1908 a instauré un principe de « personnalité de la loi ».", a: true, j: "Des lois différentes s'appliquaient selon l'origine nationale : Congolais vs Belges." },
  { s: "En droit coutumier congolais, en cas de conflit de coutumes pour les fiançailles, c'est la coutume du fiancé qui prime.", a: false, j: "C'est la coutume de la FIANCÉE qui prime (coutume secundum legem)." },
  { s: "Le mariage entre personnes de même sexe est reconnu par la tradition canonique.", a: false, j: "Le mariage canonique exige l'hétérosexualité ; le same-sex marriage est une avancée du droit civil belge (2003)." },
];

/* ============================================================================
   DONNÉES — QUESTIONS OUVERTES (avec plan de réponse)
   ========================================================================== */
const OPEN = [
  {
    q: "« Le pluralisme juridique est un fait ; le centralisme juridique est un mythe. » Évaluez cette affirmation de Griffiths.",
    plan: [
      "Définir centralisme (idéologie : droit = droit de l'État, unifié, hiérarchique) et pluralisme (coexistence de plusieurs ordres dans un espace social).",
      "Position de Griffiths : approche empirique → le monisme ne correspond pas à la réalité ; tout système est plural.",
      "Distinguer pluralisme faible (reconnu/régulé par l'État) vs fort (systèmes autonomes) ; il privilégie le fort.",
      "Illustrer : principe de personnalité ; charia validée (UK, faible) vs communautés non reconnues (Allemagne, fort).",
      "Auteurs discutés (Pospisil, Smith, Ehrlich, Moore) et leurs limites selon Griffiths.",
      "Discussion critique : reconnaissance étatique ne crée pas un système autonome ; nuance avec Tamanaha (instrumentalisation coloniale).",
    ],
  },
  {
    q: "Comparez la méthode fonctionnelle (Zweigert & Kötz) et la critique qu'en fait l'orientalisme juridique (Ruskola).",
    plan: [
      "Exposer le fonctionnalisme : droit = résolution de problèmes ; comparer = comparer les fonctions ; praesumptio similitudinis ; convergence.",
      "Montrer l'utilité méthodologique (cadre, unité de comparaison via la fonction, ex. la promesse).",
      "Critique de Ruskola : « problème juridique » dépend du contexte culturel → imperialisme épistémologique.",
      "Orientalisme (Said) appliqué : la Chine représentée comme « sans droit » ; auto-orientalisation des élites.",
      "Lien avec Tamanaha/colonialisme : la présomption de similarité masque la domination ; interlégalité.",
      "Conclusion nuancée : le fonctionnalisme est utile mais doit être appliqué avec prudence et conscience des biais.",
    ],
  },
  {
    q: "En quoi Maine incarne-t-il un regard imperialiste sur le droit ? Discutez « status → contract » et « stationnaire → progressive ».",
    plan: [
      "Qui est Maine (Inde, Oxford/Cambridge, fondateur de l'anthropologie juridique).",
      "Status → contract : de la position héritée à l'agent autonome ; l'individu remplace la famille.",
      "Stationnaire vs progressive : la codification fige l'évolution spontanée ; rares sociétés progressives.",
      "Marqueurs imperialistes : « English law = perfection of human reason » ; évolution vers le paradigme occidental.",
      "Critiques : doctrine idéaliste, discriminante (femmes, non-éduqués) ; « contrat social » nié hors Occident.",
      "Postérité : justification de l'imposition coloniale ; résonance dans le débat post-colonial (Said, Ruskola).",
    ],
  },
  {
    q: "Qu'est-ce qu'un système juridique mixte ? Présentez les classifications (Palmer, Ottawa, Örücü, Glenn) et le rôle des droits fondamentaux.",
    plan: [
      "Définir pluralisme / mixité (interaction, question de degré) / hybridité (légal + normatif).",
      "3 phases (classique, nouvelle, globale) ; exemples (Afrique du Sud, Écosse, Québec, Louisiane).",
      "Palmer : 3e famille civil/common ; Ottawa : 5e famille + 11 sous-familles (limites).",
      "Örücü : arbre généalogique, mixes overt/covert, rejet de la rigidité.",
      "Glenn : traditions juridiques plutôt que classification de systèmes.",
      "Droits fondamentaux : rôle intégrateur (harmonisation, interprétation, résolution de conflits) et tensions.",
    ],
  },
  {
    q: "Comment le colonialisme a-t-il produit du pluralisme juridique, dans les colonies et dans les métropoles ? (Tamanaha)",
    plan: [
      "Deux périodes (1500–1800 missionnaires/ressources ; 19e s. frontières/domination).",
      "Coexistence forcée et hiérarchique : droit colonial + coutumier (matières mineures) + religieux.",
      "3 couches de tribunaux (coloniaux / district / villageois) ; droit foncier colonial et dépossession.",
      "Pluralisme dans la métropole : migrations depuis les colonies ; empires non coloniaux (Russie, Chine).",
      "Persistance post-coloniale : inégalités structurelles ; ex. tensions foncières au Congo.",
      "Critique : le pluralisme peut être instrumentalisé (exploiter/exclure), pas toujours « positif ».",
    ],
  },
  {
    q: "Le droit congolais comme illustration du pluralisme : exposez les tensions droit écrit / droit coutumier par matière.",
    plan: [
      "Contexte : coexistence droit écrit colonial (libéral/individualiste) et coutumier (oral/communautaire) ; deux ordres de juridiction ; indifférence réciproque.",
      "Biens : propriété individuelle + certificat (1973, inspiré BE) vs terre sacrée/communautaire, preuve orale.",
      "Famille : interdiction polygamie (art. 374, 1987), égalité successorale vs polygamie, mariage entre familles, aîné héritier → ineffectivité.",
      "Obligations : responsabilité civile individuelle (Léopold II) vs responsabilité collective.",
      "Public : mimétisme juridique (démocratie importée) vs royaumes héréditaires → coups d'État.",
      "Lien théorique : Tamanaha (pluralisme colonial persistant), Said/Ruskola (vision « primitive » du coutumier).",
    ],
  },
  {
    q: "Pourquoi la common law est-elle si différente du système civiliste continental ? Développez les trois raisons et illustrez par le précédent et l'equity.",
    plan: [
      "Raison 1 — réception du droit romain moindre : structure juridique centralisée déjà en place (anglo-saxon, normand 1066, Henri II).",
      "Raison 2 — continuité : pas de rupture codificatrice, évolution organique (« seamless web », van Caenegem).",
      "Raison 3 — pragmatisme : œuvre des juges, rôle marginal de la doctrine, formation aux Inns of Court.",
      "Doctrine du précédent : stare decisis, ratio decidendi vs obiter dicta, binding/persuasive, tension sécurité/adaptation, débat « law-making ».",
      "Equity : correction de l'injustice du droit écrit (Aristote, chancelier, Lord Denning), Chancery.",
      "Ouverture : adversarial vs inquisitorial ; diffusion par colonisation (Australie, Canada/Québec hybride, Afrique du Sud, Japon).",
    ],
  },
  {
    q: "« Comparer le droit sans tenir compte de la culture juridique est insuffisant. » Discutez à partir de Cotterrell (et Friedman/Merry).",
    plan: [
      "Poser le problème : droit similaire mais pratiques différentes (ex. Covid) ; law in culture vs law as culture.",
      "Culture comme fait : Friedman (catégorie, non fait) ; interne (officiels) vs externe (sujets) ; rôle de la confiance.",
      "Dimensions de Merry (pratiques/idéologies, attitude publique, recours au droit, conscience juridique).",
      "Culture comme approche : conditionne/facilite/bloque les changements (Blankenberg : comparer les litiges sans la culture n'a pas de sens).",
      "Culture comme valeur : law and economics ; Kultur vs civilisation ; cultures d'illégalité.",
      "Langue & traduction : intraduisibilité (contract ≠ contrat, magistrat ≠ magistrate) → décoder/recoder. Lien avec Nelken (usage critique du concept).",
    ],
  },
  {
    q: "Le droit canonique est-il un « système juridique » ? Confrontez Kelsen, Santi Romano et Sohm, et discutez son actualité.",
    plan: [
      "Définir le droit par le passage à la sanction (violence légitime) ; enjeu de la définition du « système juridique ».",
      "Kelsen : l'Église = quasi-État → « droit étatique un peu spécial » (Vatican 1929).",
      "Santi Romano : toute structure de sanctions produit du droit (pluralisme ; ex. mafia).",
      "Sohm : critique théologique — le Christ a aboli la loi → « imposture » (Luther 1517 ; délégitimation par la théologie du 20e s.).",
      "Actualité : toujours actif (>1,38 milliard, tribunaux ecclésiastiques, codifié 1983) ; statut hybride et principe de proportionnalité ; interactions avec le droit étatique belge.",
      "Critique : abus sexuels (formules vagues, légalité des délits/peines) ; caractère non démocratique mais synodalité.",
    ],
  },
  {
    q: "Expliquez la souveraineté du Parlement au Royaume-Uni et ce que l'affaire Brexit en révèle.",
    plan: [
      "Distinguer English/British/UK et la devolution asymétrique (contexte).",
      "Constitution non codifiée : sources (common law, statutes, conventions, pratiques ; arrêt CS 2019).",
      "Souveraineté du Parlement : pas de norme supérieure à un Act, pas de contrôle de constitutionnalité, deux piliers ; rôle des conventions.",
      "Constitution « légale » ou « politique » : montée du rôle des juges, légitimité.",
      "Affaire Brexit : prérogative royale vs Parlement ; la CS impose le passage par le Parlement (droits des citoyens affectés) ; « ennemis du peuple ».",
      "Human Rights Act 1998 : incorporation de la CEDH, simple Act (abrogeable), déclaration d'incompatibilité ; tension majorité/droits fondamentaux.",
    ],
  },
];

/* ============================================================================
   UI HELPERS
   ========================================================================== */
const FONT_DISPLAY = "'Cormorant Garamond', 'Hoefler Text', Georgia, serif";
const FONT_BODY = "'Spectral', 'Iowan Old Style', Georgia, serif";
const FONT_SANS = "'IBM Plex Sans', system-ui, sans-serif";

function eraLabel(era) {
  return {
    classique: "Approche classique",
    imperial: "Imperialisme / colonialisme",
    postcolonial: "Post-colonial",
    pluralisme: "Pluralisme & mixité",
    module: "Module",
  }[era];
}

/* ============================================================================
   MAIN COMPONENT
   ========================================================================== */
export default function ComparativeLawRevision() {
  const [tab, setTab] = useState("home");

  const tabs = [
    ["home", "Accueil"],
    ["course", "La matière"],
    ["authors", "Fiches auteurs"],
    ["table", "Tableau comparatif"],
    ["map", "Schémas & liens"],
    ["concepts", "Glossaire"],
    ["qcm", "QCM"],
    ["open", "Questions ouvertes"],
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.paper, color: C.ink, fontFamily: FONT_BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,500&family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: ${C.accent}; color: ${C.white}; }
        .clw-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
        .clw-scroll::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 4px; }
        .clw-card { transition: transform .25s ease, box-shadow .25s ease; }
        .clw-card:hover { transform: translateY(-3px); box-shadow: 0 14px 30px rgba(26,20,16,.16); }
        .clw-tab { transition: all .2s ease; }
        @keyframes clwFade { from { opacity: 0; transform: translateY(8px);} to {opacity:1; transform:none;} }
        .clw-anim { animation: clwFade .4s ease both; }
        details > summary { list-style: none; cursor: pointer; }
        details > summary::-webkit-details-marker { display: none; }
      `}</style>

      {/* HEADER */}
      <header style={{
        borderBottom: `2px solid ${C.ink}`,
        background: `linear-gradient(180deg, ${C.paper2}, ${C.paper})`,
        padding: "26px 22px 18px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: FONT_SANS, fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
              color: C.accent, fontWeight: 600,
            }}>LDROI1310 · UCLouvain · Q2</span>
            <span style={{ fontFamily: FONT_SANS, fontSize: 11, color: C.muted, letterSpacing: 1 }}>
              C. Laske — Fiche de révision interactive
            </span>
          </div>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(34px, 6vw, 60px)",
            lineHeight: 1, margin: "6px 0 0", letterSpacing: -0.5,
          }}>
            Comparative Law
          </h1>
          <p style={{ margin: "8px 0 0", maxWidth: 720, color: C.muted, fontSize: 16, fontStyle: "italic" }}>
            Comparer les systèmes juridiques pour comprendre les cultures et faire progresser le droit —
            de l'État-nation au tournant post-colonial et au pluralisme.
          </p>
        </div>
      </header>

      {/* NAV */}
      <nav className="clw-scroll" style={{
        position: "sticky", top: 0, zIndex: 20, background: C.ink,
        overflowX: "auto", whiteSpace: "nowrap", borderBottom: `1px solid ${C.gold}`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex" }}>
          {tabs.map(([k, label]) => (
            <button key={k} className="clw-tab" onClick={() => setTab(k)}
              style={{
                background: tab === k ? C.gold : "transparent",
                color: tab === k ? C.ink : C.paper,
                border: "none", padding: "13px 17px", cursor: "pointer",
                fontFamily: FONT_SANS, fontSize: 13, fontWeight: tab === k ? 600 : 400,
                letterSpacing: 0.4, flexShrink: 0,
              }}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 22px 80px" }}>
        {tab === "home" && <Home go={setTab} />}
        {tab === "course" && <Course />}
        {tab === "authors" && <Authors />}
        {tab === "table" && <CompareTable />}
        {tab === "map" && <ConceptMap />}
        {tab === "concepts" && <Glossary />}
        {tab === "qcm" && <Quiz />}
        {tab === "open" && <OpenQuestions />}
      </main>

      <footer style={{ borderTop: `1px solid ${C.line}`, padding: "20px", textAlign: "center" }}>
        <p style={{ fontFamily: FONT_SANS, fontSize: 12, color: C.muted, margin: 0 }}>
          Révision personnelle · synthèse des notes de cours & fiches auteurs · ne remplace pas la lecture des textes obligatoires.
        </p>
      </footer>
    </div>
  );
}

/* ----------------------------- HOME ----------------------------- */
function Home({ go }) {
  const cards = [
    ["course", "La matière", "9 chapitres complets (0–8) : histoire, État-nation, imperialisme, post-colonial, Brexit/UK, common law, culture juridique, droit canon, droit congolais.", C.accent2],
    ["authors", "18 fiches auteurs", "Des classiques (Scarciglia, Samuel, Saleilles, Maine, Kohler) aux post-coloniaux et pluralistes (Zweigert-Kötz, Said, Ruskola, Tamanaha, Griffiths, Du Plessis, Nelken) + culture juridique et droit canon (Cotterrell, Friedman, Merry, Kelsen, Romano, Sohm).", C.accent],
    ["table", "Tableau comparatif", "Tous les auteurs côte à côte : époque, thèse, concept-clé, mot-clé d'examen.", C.gold],
    ["map", "Schémas & liens", "Trois fils conducteurs et la carte des concepts reliés aux auteurs.", "#4a6b8a"],
    ["concepts", "Glossaire", "~23 concepts définis, chacun relié aux auteurs concernés.", "#6b4a8a"],
    ["qcm", "QCM (37)", "Vrai/Faux avec justification — format exact de l'examen.", C.accent2],
    ["open", "Questions ouvertes", "6 sujets type examen avec plan de réponse détaillé.", C.accent],
  ];
  return (
    <div className="clw-anim">
      <Banner>
        <strong>Format d'examen :</strong> écrit 2h, livre fermé. 50% = 2 questions ouvertes (~500 mots) ·
        50% = ~20 affirmations vrai/faux <em>avec justification</em> (½ + ½ pt). Dictionnaire bilingue
        sans annotations autorisé. ⚠ Le prof vise les <strong>grandes idées</strong>, pas les détails/dates.
      </Banner>
      <div style={{
        display: "grid", gap: 16, marginTop: 22,
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      }}>
        {cards.map(([k, t, d, col], i) => (
          <button key={k} className="clw-card" onClick={() => go(k)}
            style={{
              textAlign: "left", cursor: "pointer", background: C.white,
              border: `1px solid ${C.line}`, borderTop: `4px solid ${col}`,
              borderRadius: 10, padding: "18px 18px 20px", animationDelay: `${i * 50}ms`,
            }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, color: col }}>{t}</div>
            <div style={{ fontSize: 14.5, color: C.muted, marginTop: 6, lineHeight: 1.45 }}>{d}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Banner({ children }) {
  return (
    <div style={{
      background: C.ink, color: C.paper, borderRadius: 10, padding: "16px 20px",
      fontSize: 14.5, lineHeight: 1.5, borderLeft: `5px solid ${C.gold}`,
    }}>{children}</div>
  );
}

/* ----------------------------- COURSE ----------------------------- */
function Course() {
  const [open, setOpen] = useState(COURSE[0].id);
  return (
    <div className="clw-anim">
      <SectionTitle k="Structure du cours" t="La matière, chapitre par chapitre" />
      {COURSE.map((ch) => {
        const isOpen = open === ch.id;
        return (
          <div key={ch.id} style={{
            border: `1px solid ${C.line}`, borderRadius: 10, marginBottom: 12,
            overflow: "hidden", background: C.white,
          }}>
            <button onClick={() => setOpen(isOpen ? null : ch.id)}
              style={{
                width: "100%", textAlign: "left", cursor: "pointer", border: "none",
                background: isOpen ? ch.color : C.white, color: isOpen ? C.white : C.ink,
                padding: "16px 18px", display: "flex", justifyContent: "space-between",
                alignItems: "center", gap: 12,
              }}>
              <span>
                <span style={{ fontFamily: FONT_SANS, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.85 }}>{ch.n}</span>
                <span style={{ display: "block", fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{ch.title}</span>
              </span>
              <span style={{ fontSize: 22, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
            </button>
            {isOpen && (
              <div style={{ padding: "6px 18px 18px" }}>
                {ch.sections.map((s, i) => (
                  <div key={i} style={{ padding: "12px 0", borderBottom: i < ch.sections.length - 1 ? `1px dashed ${C.line}` : "none" }}>
                    <div style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 15, color: ch.color, marginBottom: 4 }}>{s.h}</div>
                    <div style={{ fontSize: 15, lineHeight: 1.55, color: C.ink }}>{s.t}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------- AUTHORS ----------------------------- */
function Authors() {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  const eras = [["all", "Tous"], ["classique", "Classiques"], ["imperial", "Imperialisme"], ["postcolonial", "Post-colonial"], ["pluralisme", "Pluralisme"], ["module", "Modules (culture/canon)"]];
  const list = AUTHORS.filter((a) => filter === "all" || a.era === filter);

  return (
    <div className="clw-anim">
      <SectionTitle k="Les penseurs" t="18 fiches auteurs" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {eras.map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            style={{
              cursor: "pointer", border: `1px solid ${filter === k ? C.ink : C.line}`,
              background: filter === k ? C.ink : "transparent", color: filter === k ? C.paper : C.ink,
              padding: "6px 14px", borderRadius: 30, fontFamily: FONT_SANS, fontSize: 13,
            }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {list.map((a, i) => (
          <button key={a.id} className="clw-card" onClick={() => setActive(a)}
            style={{
              textAlign: "left", cursor: "pointer", background: C.white,
              border: `1px solid ${C.line}`, borderLeft: `5px solid ${TRADITION_COLORS[a.era]}`,
              borderRadius: 8, padding: "16px", animationDelay: `${i * 40}ms`,
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 23, fontWeight: 700, lineHeight: 1.05 }}>{a.name}</span>
              {a.must && <span style={{ fontFamily: FONT_SANS, fontSize: 9.5, background: C.accent, color: C.white, padding: "3px 7px", borderRadius: 20, letterSpacing: 0.5, whiteSpace: "nowrap" }}>LECTURE OBLIG.</span>}
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: TRADITION_COLORS[a.era], textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>{eraLabel(a.era)}</div>
            <div style={{ fontSize: 13.5, color: C.muted, marginTop: 6, fontStyle: "italic" }}>{a.role}</div>
            <div style={{ fontSize: 14.5, marginTop: 8, lineHeight: 1.45 }}>{a.one}</div>
          </button>
        ))}
      </div>
      {active && <AuthorModal a={active} close={() => setActive(null)} />}
    </div>
  );
}

function AuthorModal({ a, close }) {
  return (
    <div onClick={close} style={{
      position: "fixed", inset: 0, background: "rgba(26,20,16,.6)", zIndex: 50,
      display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "5vh 16px", overflowY: "auto",
    }}>
      <div onClick={(e) => e.stopPropagation()} className="clw-anim" style={{
        background: C.paper, maxWidth: 720, width: "100%", borderRadius: 12,
        border: `1px solid ${C.ink}`, overflow: "hidden",
      }}>
        <div style={{ background: TRADITION_COLORS[a.era], color: C.white, padding: "20px 22px", position: "relative" }}>
          <button onClick={close} style={{ position: "absolute", top: 14, right: 16, background: "transparent", border: "none", color: C.white, fontSize: 26, cursor: "pointer", lineHeight: 1 }}>×</button>
          <div style={{ fontFamily: FONT_SANS, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.85 }}>{eraLabel(a.era)}{a.must ? " · lecture obligatoire" : ""}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, fontWeight: 700, lineHeight: 1 }}>{a.name}</div>
          <div style={{ fontSize: 15, fontStyle: "italic", marginTop: 4, opacity: 0.95 }}>{a.role}</div>
        </div>
        <div style={{ padding: "8px 22px 24px" }}>
          {a.points.map((p, i) => (
            <div key={i} style={{ padding: "13px 0", borderBottom: i < a.points.length - 1 ? `1px dashed ${C.line}` : "none" }}>
              <div style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 14.5, color: TRADITION_COLORS[a.era], marginBottom: 4 }}>{p.h}</div>
              <div style={{ fontSize: 15, lineHeight: 1.55 }}>{p.t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- COMPARE TABLE ----------------------------- */
function CompareTable() {
  const rows = AUTHORS.map((a) => ({
    name: a.name, era: a.era, role: a.role,
    key: a.points[0] ? a.points[0].h : "",
    one: a.one,
  }));
  return (
    <div className="clw-anim">
      <SectionTitle k="Vue d'ensemble" t="Tableau comparatif des auteurs" />
      <div className="clw-scroll" style={{ overflowX: "auto", border: `1px solid ${C.line}`, borderRadius: 10 }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 720, background: C.white }}>
          <thead>
            <tr style={{ background: C.ink, color: C.paper, fontFamily: FONT_SANS, fontSize: 12.5 }}>
              <th style={th}>Auteur</th>
              <th style={th}>Courant</th>
              <th style={th}>Apport / rôle</th>
              <th style={th}>Idée-force à retenir</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 ? C.paper : C.white, borderTop: `1px solid ${C.line}` }}>
                <td style={{ ...td, fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17 }}>{r.name}</td>
                <td style={td}>
                  <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: TRADITION_COLORS[r.era], marginRight: 6 }} />
                  <span style={{ fontFamily: FONT_SANS, fontSize: 12 }}>{eraLabel(r.era)}</span>
                </td>
                <td style={{ ...td, fontSize: 13.5, color: C.muted }}>{r.role}</td>
                <td style={{ ...td, fontSize: 14 }}>{r.one}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontFamily: FONT_SANS, fontSize: 12.5, color: C.muted, marginTop: 10 }}>
        Astuce : pour les questions ouvertes « comparez X et Y », mobilise une ligne du tableau + un point de désaccord (ex. fonctionnalisme Zweigert vs critique Ruskola).
      </p>
    </div>
  );
}
const th = { textAlign: "left", padding: "12px 14px", fontWeight: 600, letterSpacing: 0.5 };
const td = { padding: "12px 14px", verticalAlign: "top", lineHeight: 1.45 };

/* ----------------------------- CONCEPT MAP ----------------------------- */
function ConceptMap() {
  const threads = [
    {
      title: "Fil 1 — De l'universalisme à la critique",
      color: C.accent2,
      steps: ["Saleilles : droit commun de l'humanité civilisée", "Zweigert & Kötz : fonctionnalisme + praesumptio similitudinis", "Ruskola : imperialisme épistémologique", "Said : orientalisme (discours de pouvoir)"],
    },
    {
      title: "Fil 2 — Évolution & supériorité occidentale",
      color: C.accent,
      steps: ["Science moderne (Darwin, méthode comparative)", "Maine : status→contract, stationnaire→progressive", "Kohler : évolutionnisme + droit phénomène culturel", "Critique post-coloniale de la hiérarchie des droits"],
    },
    {
      title: "Fil 3 — Monisme → pluralisme → mixité",
      color: "#4a6b8a",
      steps: ["État-nation : UN droit unifié (monisme)", "Griffiths : pluralisme est un fait (faible/fort)", "Tamanaha : pluralisme colonial (law in books/action)", "Du Plessis : systèmes mixtes & hybridité (3 phases)"],
    },
    {
      title: "Fil 4 — Traditions & cultures juridiques (modules)",
      color: "#6b4a8a",
      steps: ["Common law : précédent, equity, adversarial (Ch. 5)", "UK : souveraineté du Parlement, Brexit (Ch. 4)", "Cotterrell : culture juridique, interne/externe (Ch. 6)", "Droit canon (Ch. 7) & droit congolais (Ch. 8) : pluralisme appliqué"],
    },
  ];
  return (
    <div className="clw-anim">
      <SectionTitle k="Comprendre les liens" t="Trois fils conducteurs du cours" />
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {threads.map((t, i) => (
          <div key={i} style={{ background: C.white, border: `1px solid ${C.line}`, borderTop: `4px solid ${t.color}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 700, color: t.color, marginBottom: 12 }}>{t.title}</div>
            {t.steps.map((s, j) => (
              <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: j < t.steps.length - 1 ? 4 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: t.color, color: C.white, fontFamily: FONT_SANS, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{j + 1}</span>
                  {j < t.steps.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 18, background: C.line }} />}
                </div>
                <div style={{ fontSize: 14.5, paddingTop: 1, paddingBottom: 8, lineHeight: 1.4 }}>{s}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 26 }}>
        <SectionTitle k="Carte des concepts" t="Chaque concept → ses auteurs" />
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
          {CONCEPTS.map((c, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, padding: "12px 13px" }}>
              <div style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 14, color: C.accent }}>{c.term}</div>
              <div style={{ fontSize: 13.5, color: C.ink, margin: "4px 0 8px", lineHeight: 1.4 }}>{c.def}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {c.who.map((id) => {
                  const au = AUTHORS.find((a) => a.id === id);
                  return <span key={id} style={{ fontFamily: FONT_SANS, fontSize: 10.5, background: C.paper2, border: `1px solid ${C.line}`, padding: "2px 7px", borderRadius: 20 }}>{au ? au.name : id}</span>;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- GLOSSARY ----------------------------- */
function Glossary() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return CONCEPTS.filter((c) => !s || c.term.toLowerCase().includes(s) || c.def.toLowerCase().includes(s))
      .sort((a, b) => a.term.localeCompare(b.term, "fr"));
  }, [q]);
  return (
    <div className="clw-anim">
      <SectionTitle k="Vocabulaire d'examen" t="Glossaire des concepts" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un concept…"
        style={{
          width: "100%", padding: "12px 16px", borderRadius: 30, border: `1px solid ${C.line}`,
          background: C.white, fontFamily: FONT_SANS, fontSize: 15, marginBottom: 16, color: C.ink,
        }} />
      <div style={{ display: "grid", gap: 0, background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
        {list.map((c, i) => (
          <div key={i} style={{ padding: "14px 18px", borderBottom: i < list.length - 1 ? `1px solid ${C.paper2}` : "none", display: "grid", gridTemplateColumns: "minmax(150px, 230px) 1fr", gap: 14, alignItems: "baseline" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.accent }}>{c.term}</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>{c.def}
              <span style={{ display: "block", marginTop: 4, fontFamily: FONT_SANS, fontSize: 11.5, color: C.muted }}>
                → {c.who.map((id) => { const au = AUTHORS.find((a) => a.id === id); return au ? au.name : id; }).join(", ")}
              </span>
            </div>
          </div>
        ))}
        {list.length === 0 && <div style={{ padding: 24, textAlign: "center", color: C.muted }}>Aucun concept trouvé.</div>}
      </div>
    </div>
  );
}

/* ----------------------------- QUIZ (QCM) ----------------------------- */
function Quiz() {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const score = Object.keys(revealed).reduce((acc, k) => acc + (answers[k] === QCM[k].a ? 1 : 0), 0);
  const done = Object.keys(revealed).length;

  function answer(i, val) {
    if (revealed[i]) return;
    setAnswers((p) => ({ ...p, [i]: val }));
    setRevealed((p) => ({ ...p, [i]: true }));
  }
  function reset() { setAnswers({}); setRevealed({}); }

  return (
    <div className="clw-anim">
      <SectionTitle k="Entraînement" t="QCM — Vrai / Faux + justification" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, background: C.ink, color: C.paper, borderRadius: 10, padding: "12px 18px", marginBottom: 16 }}>
        <span style={{ fontFamily: FONT_SANS, fontSize: 14 }}>Score : <strong style={{ color: C.gold, fontSize: 18 }}>{score}</strong> / {done} répondu(es) · {QCM.length} au total</span>
        <button onClick={reset} style={{ background: C.gold, color: C.ink, border: "none", padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600 }}>Recommencer</button>
      </div>
      {QCM.map((item, i) => {
        const r = revealed[i]; const my = answers[i];
        const correct = my === item.a;
        return (
          <div key={i} style={{ background: C.white, border: `1px solid ${r ? (correct ? C.accent2 : C.accent) : C.line}`, borderRadius: 10, padding: "15px 18px", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.muted, fontSize: 18, flexShrink: 0 }}>{i + 1}.</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15.5, lineHeight: 1.5 }}>{item.s}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  {[["Vrai", true], ["Faux", false]].map(([lbl, val]) => {
                    const chosen = my === val;
                    let bg = "transparent", bd = C.line, col = C.ink;
                    if (r) {
                      if (val === item.a) { bg = C.accent2; col = C.white; bd = C.accent2; }
                      else if (chosen) { bg = C.accent; col = C.white; bd = C.accent; }
                    } else if (chosen) { bg = C.ink; col = C.paper; }
                    return (
                      <button key={String(val)} onClick={() => answer(i, val)} disabled={r}
                        style={{ cursor: r ? "default" : "pointer", background: bg, color: col, border: `1px solid ${bd}`, padding: "7px 22px", borderRadius: 8, fontFamily: FONT_SANS, fontSize: 14, fontWeight: 600 }}>{lbl}</button>
                    );
                  })}
                </div>
                {r && (
                  <div className="clw-anim" style={{ marginTop: 12, padding: "11px 14px", background: C.paper, borderRadius: 8, borderLeft: `4px solid ${correct ? C.accent2 : C.accent}` }}>
                    <span style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 12.5, color: correct ? C.accent2 : C.accent, letterSpacing: 0.5 }}>
                      {correct ? "✓ CORRECT" : "✗ INCORRECT"} — réponse : {item.a ? "Vrai" : "Faux"}
                    </span>
                    <div style={{ fontSize: 14, lineHeight: 1.5, marginTop: 5 }}>{item.j}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------- OPEN QUESTIONS ----------------------------- */
function OpenQuestions() {
  return (
    <div className="clw-anim">
      <SectionTitle k="Questions ouvertes" t="6 sujets type examen + plan de réponse" />
      <p style={{ fontSize: 14.5, color: C.muted, marginBottom: 18, maxWidth: 760 }}>
        Réfléchis d'abord à ton propre plan (~500 mots), puis déplie le plan suggéré pour vérifier que tous
        les éléments de la question sont couverts. Pense à toujours <strong>relier au moins deux auteurs</strong> et à inclure une critique.
      </p>
      {OPEN.map((o, i) => (
        <details key={i} style={{ background: C.white, border: `1px solid ${C.line}`, borderLeft: `5px solid ${C.gold}`, borderRadius: 10, padding: "14px 18px", marginBottom: 12 }}>
          <summary style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.gold, fontSize: 22, flexShrink: 0, lineHeight: 1 }}>Q{i + 1}</span>
            <span style={{ fontSize: 16, lineHeight: 1.45, fontWeight: 500 }}>{o.q}</span>
          </summary>
          <div className="clw-anim" style={{ marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${C.line}` }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: C.accent, marginBottom: 8 }}>Plan de réponse</div>
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              {o.plan.map((p, j) => (
                <li key={j} style={{ fontSize: 14.5, lineHeight: 1.55, marginBottom: 6 }}>{p}</li>
              ))}
            </ol>
          </div>
        </details>
      ))}
    </div>
  );
}

/* ----------------------------- SHARED ----------------------------- */
function SectionTitle({ k, t }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: FONT_SANS, fontSize: 11.5, letterSpacing: 2.5, textTransform: "uppercase", color: C.accent }}>{k}</div>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, margin: "2px 0 0", lineHeight: 1.05 }}>{t}</h2>
    </div>
  );
}
