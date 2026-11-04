/* French translations for LLM Visual Lab. */
window.I18N_FR = {
 "chrome.0": "Leçons",
 "chrome.1": "Découvrez comment un modèle de langage lit, pense en vecteurs et prédit le token suivant.",
 "chrome.2": "llama3.2:1b",
 "chrome.3": "Revérifier",
 "embeddings.0": "2 · Embeddings — les mots comme des lieux",
 "embeddings.1": "À l'intérieur du modèle, chaque mot devient une liste de nombres — un point dans l'espace. Les mots qui signifient des choses semblables se situent près les uns des autres. Faites glisser pour regarder autour du nuage, faites défiler pour zoomer, et trouvez les groupes animaux, véhicules et aliments.",
 "embeddings.2": "La vue 3D a besoin d'une connexion internet pour sa\n    bibliothèque au premier chargement. L'idée : chaque point étiqueté est un mot, et la distance signifie la similarité.",
 "embeddings.3": "<strong>Essayez ceci :</strong> trouvez les mots de la royauté et les mots de véhicules. Pourquoi pensez-vous que <em>king</em> et <em>queen</em>\n    sont éloignés de <em>car</em> et <em>bus</em>, alors que les quatre sont des noms ?",
 "embeddings.4": "Pourquoi <em>king</em> et <em>queen</em> sont-ils proches ?",
 "embeddings.5": "Personne n'a dit au modèle qu'ils sont liés. Pendant l'<strong>entraînement</strong> (prochaine leçon), il a lu\n    des milliards de phrases et n'a cessé d'ajuster ces positions pour mieux deviner le mot suivant.\n    <em>King</em> et <em>queen</em> apparaissent dans des phrases presque interchangeables —\n    « the ___ wore a crown », « the ___ ruled the kingdom », « long live the ___ » — donc les positions qui\n    prédisent le mieux ces contextes partagés finissent par être presque identiques. <em>Car</em> et <em>bus</em> partagent un\n    ensemble différent de contextes (« parked the ___ », « drove the ___ »), donc ils forment leur propre groupe très loin.\n    La proximité dans cet espace signifie littéralement <em>« utilisé dans des phrases similaires ».</em> C'est aussi pourquoi la\n    géométrie porte du sens : la direction de <em>man</em> à <em>king</em> est à peu près la même\n    direction que de <em>woman</em> à <em>queen</em> — la royauté, apprise par le seul usage.",
 "embeddings.6": "Comment les embeddings sont réellement stockés",
 "embeddings.7": "Le nuage 3D est une image aplatie, pas le stockage lui-même. Chaque embedding commence comme une liste aléatoire de\n    nombres et est un poids comme un autre : chaque fois que son token apparaît dans l'entraînement, la descente de gradient\n    (prochaine leçon) ajuste un peu cette liste, et les tokens utilisés dans des phrases similaires reçoivent des ajustements\n    similaires, donc les groupes ci-dessus s'organisent d'eux-mêmes. Ce qui est réellement stocké, c'est une table — une rangée\n    de nombres par token, recherchée par l'ID du token. Dans le petit Llama utilisé plus loin dans ce labo, cette table\n    contient environ 128,000 tokens, chacun une liste de 2,048 nombres — des milliers de dimensions, pas trois.\n    Le nuage écrase ces listes en 3 axes pour que vous puissiez les regarder ; la proximité est réelle\n    (mesurée par l'angle entre les listes complètes), les positions 3D ne sont qu'une approximation.\n    Une subtilité de plus : la rangée stockée pour <em>bank</em> est la même dans chaque phrase — les couches\n    de la Leçon 6 la réécrivent en utilisant le contexte, donc « river bank » et « money bank » finissent par être différents à l'intérieur\n    du modèle même s'ils partaient de la même rangée.",
 "embeddings.8": "<span class=\"lvl-add-tag\">Moyen</span>Cette liste de nombres a un nom : un <strong>embedding</strong> — un vecteur appris pendant l'entraînement, conçu par personne. Comme les mots utilisés dans des phrases similaires obtiennent des vecteurs similaires, le sens apparaît comme une distance dans le nuage ci-dessus : proche signifie « utilisé de façon semblable », loin signifie « utilisé différemment ».",
 "embeddings.9": "<span class=\"lvl-add-tag\">Expert</span>Formellement, chaque ID de token indexe une rangée de la matrice d'embeddings E ∈ ℝ<sup>V×d</sup>, où d se compte en milliers dans un vrai modèle ; le nuage ci-dessus projette une version miniature en 3D. La proximité cosinus encode la similarité distributionnelle, et les directions peuvent porter une structure relationnelle — l'exemple classique est king − man + woman ≈ queen.",
 "intro.0": "✦ Introduction — commencez ici",
 "intro.1": "Bienvenue dans l'atelier. Ce cours démonte un petit modèle de langage — un vrai,\n    qui tourne sur cet ordinateur — pièce par pièce, pour que lorsqu'un grand modèle\n    fait quelque chose qui ressemble à de la magie, vous sachiez quelle pièce l'a fait. Pas besoin d'un diplôme en maths :\n    chaque idée s'accompagne de quelque chose que vous pouvez presser, faire glisser, taper ou casser.",
 "intro.10": "<strong>Fondements</strong> · Leçons 1–5<br>Comment le modèle lit, ce que deviennent les mots, comment il a appris, à quoi il prête attention et comment il choisit quoi dire ensuite.",
 "intro.11": "<strong>Dans la machine</strong> · Leçons 6–8<br>Le voyage d'un token à travers les couches, comment votre question est analysée sans analyseur, et un vrai minuscule modèle qui s'entraîne sous vos yeux.",
 "intro.12": "<strong>Retour à la réalité</strong> · Leçons 9–12<br>Pourquoi il oublie, comment il se trompe avec assurance, le vrai modèle en direct avec ses données de débogage, et ce qui le sépare des modèles premium.",
 "intro.13": "<strong>Au-delà des bases</strong> · Leçons 13–15<br>Comment un prédicteur devient un assistant, comment les vrais systèmes recherchent des réponses, et un projet final qui démonte entièrement une réponse en direct.",
 "intro.14": "<a href=\"#tokens\" class=\"begin-btn\">Commencer la Leçon 1 — Tokens →</a>",
 "intro.2": "Comment utiliser ce guide",
 "intro.3": "<strong>Une leçon à la fois.</strong> Choisissez dans le menu de gauche ; le bouton « Leçon suivante » en bas de chaque leçon est le chemin principal.",
 "intro.4": "<strong>Choisissez votre profondeur.</strong> Commencez en Débutant. Quand un sujet vous accroche, passez à Moyen ou Expert dans les Paramètres de la barre latérale pour plus de détails — vous pouvez revenir en arrière à tout moment.",
 "intro.5": "<strong>Prédisez avant d'exécuter.</strong> Deviner ce qui va se passer, puis regarder, est le moyen le plus rapide de développer son intuition. Plusieurs leçons (et le projet final) sont construites autour de cela.",
 "intro.6": "<strong>Les quiz et la progression</strong> se trouvent dans la barre latérale : deux questions par leçon dans le tiroir Quiz, et « Marquer comme terminé » à la fin de chaque leçon suit où vous en êtes.",
 "intro.7": "Ce qu'il vous faut",
 "intro.8": "Ollama",
 "intro.9": "La carte du cours",
 "sidebar.0": "Leçons",
 "sidebar.1": "✦ Introduction",
 "sidebar.10": "7 · Analyser une question",
 "sidebar.11": "8 · Modèle miniature 3D",
 "sidebar.12": "Retour à la réalité",
 "sidebar.13": "9 · Contexte",
 "sidebar.14": "10 · Limites",
 "sidebar.15": "11 · Modèle en direct",
 "sidebar.16": "12 · Petit contre premium",
 "sidebar.17": "Au-delà des bases",
 "sidebar.18": "13 · De prédicteur à assistant",
 "sidebar.19": "14 · Récupération (RAG)",
 "sidebar.2": "Fondements",
 "sidebar.20": "15 · Projet final",
 "sidebar.21": "Paramètres",
 "sidebar.22": "Niveau",
 "sidebar.23": "Débutant",
 "sidebar.24": "Moyen",
 "sidebar.25": "Expert",
 "sidebar.26": "Son : désactivé",
 "sidebar.27": "Ambre",
 "sidebar.28": "Glace",
 "sidebar.29": "Émeraude",
 "sidebar.3": "1 · Tokens",
 "sidebar.30": "Rose",
 "sidebar.31": "Langue",
 "sidebar.32": "Anglais",
 "sidebar.33": "Espagnol",
 "sidebar.34": "Français",
 "sidebar.4": "2 · Embeddings",
 "sidebar.5": "3 · Entraînement",
 "sidebar.6": "4 · Attention",
 "sidebar.7": "5 · Token suivant",
 "sidebar.8": "Dans la machine",
 "sidebar.9": "6 · Dans le modèle",
 "tokens.0": "1 · Tokens — comment le modèle lit",
 "tokens.1": "Une idée porte tout le cours : <strong>un modèle de langage est une machine à prédire,\n    pas une base de données.</strong> Il ne recherche pas les réponses ; il devine ce qui vient ensuite, un\n    petit morceau à la fois, de façon étonnamment bonne. Tout le reste — l'ingéniosité, les\n    erreurs, les faits inventés avec assurance de la leçon 10 — découle de cela. Et tout\n    commence par la façon dont le modèle lit, car il ne lit pas comme vous.",
 "tokens.10": "Comparer avec un vrai tokenizer",
 "tokens.11": "Ceci charge un vrai tokenizer BPE (famille GPT-2) dans votre navigateur et tokenise le texte\n    ci-dessus avec lui. Llama utilise le même type d'algorithme avec un vocabulaire différent et plus grand,\n    donc les découpages exacts diffèrent.",
 "tokens.12": "Tokeniser avec le vrai tokenizer",
 "tokens.13": "<span class=\"lvl-add-tag\">Moyen</span>Ces morceaux proviennent d'un vocabulaire fixe, produit par un <strong>tokenizer</strong> avant que le modèle lui-même ne voie quoi que ce soit. Les espaces et la ponctuation comptent aussi comme des parties de tokens — essayez d'ajouter de la ponctuation, une majuscule ou un espace supplémentaire dans le texte ci-dessus et observez le compteur changer.",
 "tokens.14": "<span class=\"lvl-add-tag\">Expert</span>Plus précisément, la règle de découpage est apprise, pas écrite à la main : un tokenizer de sous-mots (fusions de type BPE sur les octets) segmente le texte en IDs de ce vocabulaire fixe. C'est pourquoi le nombre de tokens — pas le nombre de caractères — détermine le coût et l'utilisation du contexte, et pourquoi les modèles peuvent être aveugles aux lettres individuelles à l'intérieur d'un token. La comparaison avec le vrai tokenizer ci-dessus montre la version apprise.",
 "tokens.2": "Un modèle ne voit jamais de mots. Il voit des <strong>tokens</strong> : de petits morceaux de texte. Tapez ci-dessous et regardez votre phrase se découper en morceaux. Les mots courants restent entiers ; les mots longs ou rares se divisent en pièces.",
 "tokens.3": "Essayez une surprise :",
 "tokens.4": "Mots très longs",
 "tokens.5": "Nombres &amp; argent",
 "tokens.6": "Emoji",
 "tokens.7": "MAJUSCULES &amp; contractions",
 "tokens.8": "Survolez une pièce colorée — la même pièce s'illumine dans la ligne au-dessus, pour que vous voyiez exactement quels caractères chaque token couvre.",
 "tokens.9": "Ce découpeur est une approximation pédagogique. Le vrai tokenizer est appris\n    à partir de données, mais l'intuition — les morceaux courants restent entiers, les rares se divisent — est la même.",
 "attention.0": "4 · Attention — décider ce qui compte",
 "attention.1": "Les mots peuvent être ambigus — dans « The cat sat on the mat because it was tired », que signifie <em>it</em> ? L'<strong>attention</strong> permet à chaque mot de regarder en arrière, vers les mots qui le précèdent, et de décider lesquels comptent. Cliquez sur un mot pour voir où il regarde, et essayez les différentes têtes.",
 "attention.2": "Tête A — à qui « it » fait-il référence ?",
 "attention.3": "Tête B — ce qui s'est passé (verbes)",
 "attention.4": "Tête C — le mot précédent",
 "attention.5": "Données d'enseignement schématiques, simplifiées à partir du comportement des vraies têtes.\n    Un vrai modèle compte des dizaines de couches, chacune avec de nombreuses têtes, toutes votant en même temps —\n    et les tokens ne peuvent regarder que vers l'arrière, jamais vers l'avant.",
 "attention.6": "<span class=\"lvl-add-tag\">Moyen</span>Regarder en arrière n'en est que la moitié : chaque token mélange les informations des tokens qu'il a pondérés dans sa propre représentation, si bien que son sens est réécrit par son contexte. Les <strong>têtes</strong> fonctionnent en parallèle et se spécialisent — l'une suit la référence (ce que « it » signifie), l'une suit les verbes, l'une suit le mot précédent. Changez de tête ci-dessus et comparez ce qui change.",
 "attention.7": "<span class=\"lvl-add-tag\">Expert</span>Le mécanisme est l'attention par produit scalaire mis à l'échelle : <span class=\"mono\">softmax(QK<sup>T</sup>/√d)V</span>, calculée sous un masque causal pour que chaque position n'assiste qu'en arrière. Chaque tête projette Q, K et V différemment par couche, c'est pourquoi les têtes se spécialisent (induction, coréférence, syntaxe). Les poids de la démo ci-dessus sont schématiques ; l'opération de mélange est la vraie.",
 "journey.0": "6 · À l'intérieur du modèle — le voyage d'un token",
 "journey.1": "À l'intérieur du modèle, vos mots voyagent à travers une pile de couches, comme des étages dans un bâtiment. À chaque étage, chaque mot écoute les autres puis réfléchit à ce qu'il sait désormais. Choisissez un mot et appuyez sur lecture pour l'accompagner pendant qu'il change, étage par étage, jusqu'à devenir une réponse.",
 "journey.10": "<span class=\"lvl-add-tag\">Moyen</span>Il n'y a pas de chemin unique à travers un transformer : <strong>chaque token passe par chaque couche</strong>. Chaque couche exécute l'<strong>attention</strong> (mélange entre tokens) puis un <strong>MLP</strong> (traitement au sein d'un token) — deux tâches différentes, l'une réécrit ce qu'un token sait de ses voisins, l'autre ce qu'il sait de lui-même. Cette paire est ce qui réécrit la <strong>représentation</strong> du token à mesure qu'il monte.",
 "journey.11": "<span class=\"lvl-add-tag\">Expert</span>Une passe avant est un flux résiduel : x<sub>l+1</sub> = x<sub>l</sub> + Attn(x<sub>l</sub>) + MLP(x<sub>l</sub> + Attn), par couche, toutes les positions étant traitées en parallèle. Les couches précoces encodent surtout la position et la syntaxe, les couches du milieu résolvent la référence, et les couches tardives alignent le flux avec le désencastrement pour que les logits finaux favorisent la réponse. Les barres ci-dessus montrent 16 des milliers de nombres de ce flux.",
 "journey.2": "Lire à travers les couches",
 "journey.3": "Retour au début",
 "journey.4": "Pile de couches",
 "journey.5": "Sa représentation (16 parmi des milliers de nombres)",
 "journey.6": "Attention à cette couche",
 "journey.7": "S'il devait prédire maintenant",
 "journey.8": "Comment la prédiction s'affine, couche par couche",
 "journey.9": "Modèle d'enseignement schématique — le vrai modèle empile des couches comme ce croquis,\n    mais l'API Ollama n'expose pas ses vrais nombres internes, donc ces valeurs sont illustratives,\n    à la forme d'un comportement réel : les couches précoces gèrent la position et les voisins, les couches du milieu résolvent\n    les références comme « it », les couches tardives s'engagent sur une réponse. Pour l'intérieur réel d'un modèle, voir\n    la leçon 8 — un minuscule modèle qui s'entraîne vraiment dans cette page.",
 "probabilities.0": "5 · Token suivant — un pile ou face pondéré",
 "probabilities.1": "Le modèle ne choisit pas directement le mot suivant. Il donne à chaque mot possible un score, transforme les scores en probabilités, et lance un dé pondéré. Appuyez sur <strong>Pas</strong> pour choisir un mot à la fois. Le curseur de température rend le dé plus équitable (audacieux) ou plus pipé (prudent).",
 "probabilities.2": "La capitale de la France est",
 "probabilities.3": "Pas — choisir le token suivant",
 "probabilities.4": "Redémarrer",
 "probabilities.5": "Les probabilités des candidates sont des données d'enseignement à la forme réaliste ;\n    les mathématiques de température qui leur sont appliquées sont les vraies mathématiques.",
 "probabilities.6": "<span class=\"lvl-add-tag\">Moyen</span>Ces scores ont un nom : <strong>logits</strong> — un par token, produits par la couche finale. Une fonction appelée <strong>softmax</strong> les convertit en probabilités dont la somme vaut 1, et choisir un mot, c'est <strong>échantillonner</strong> à partir de cette distribution. La température remet les logits à l'échelle avant softmax : en dessous de 1, elle aiguise les probabilités, au-dessus de 1, elle les aplatit. Déplacez le curseur ci-dessus, puis appuyez sur Pas, et regardez les deux se produire.",
 "probabilities.7": "<span class=\"lvl-add-tag\">Expert</span>Formellement, <span class=\"mono\">p = softmax(z/T)</span> sur tout le vocabulaire — environ 128k tokens dans le Llama local ; les barres ci-dessus montrent un sous-ensemble d'enseignement. Après l'échantillonnage, le token choisi est ajouté à l'entrée et toute la passe avant se répète : cette boucle est ce que signifie <em>autorégressif</em>. T→0 approche argmax (décodage glouton), T&gt;1 augmente l'entropie. Les probabilités candidates ici sont didactiques ; la transformation de température qui leur est appliquée est exacte.",
 "training.0": "3 · Entraînement — comment il a appris tout cela",
 "training.1": "Avant que le modèle puisse répondre à quoi que ce soit, il s'est entraîné — beaucoup. Il a lu du texte, deviné le mot suivant, vérifié, et corrigé ses erreurs d'une toute petite quantité. Après des milliards d'essais, les mots utilisés de façons similaires ont fini voisins. Appuyez sur <strong>Entraîner</strong> et regardez huit mots s'organiser à mesure que le score d'erreur baisse.",
 "training.10": "Imaginez chaque réglage possible du modèle comme un lieu dans un paysage vallonné, où la hauteur représente à quel point il se trompe. Ce paysage comporte <strong>trois creux</strong> : deux peu profonds et un plus profond. S'entraîner, c'est descendre — mais la balle ne peut sentir que la pente sous ses pieds, cette pente est le <strong>gradient</strong>, et elle n'a pas de carte. Le creux où elle finit dépend de son point de départ. Chaque pas descend d'une quantité fixée par le <strong>taux d'apprentissage</strong> : trop petit, elle rampe ; trop grand, elle saute par-dessus le creux et grimpe de l'autre côté. Essayez les trois boutons de départ et regardez les mêmes règles aboutir dans des creux différents.",
 "training.11": "Faites glisser pour orbiter · glisser avec le bouton droit (ou Maj+glisser) pour se déplacer · faites défiler pour zoomer · double-cliquez pour réinitialiser la vue",
 "training.12": "Faire un pas",
 "training.13": "Descente automatique",
 "training.14": "Réinitialiser la balle",
 "training.15": "Lancez la balle :",
 "training.16": "Pente ouest",
 "training.17": "Crête nord",
 "training.18": "Pente sud",
 "training.19": "<span class=\"lvl-add-tag\">Moyen</span>La boucle ci-dessus a des noms : prédire le token suivant, mesurer l'erreur (<strong>perte</strong>), puis ajuster chaque poids légèrement en descente — <strong>descente de gradient</strong>, écrite <span class=\"mono\">w ← w − η·∇L</span>. Les embeddings s'organisent parce que les mots dans des contextes similaires reçoivent des ajustements similaires. Pour le paysage : chaque creux est un <strong>minimum local</strong> — en descente dans toutes les directions, mais seul le plus profond (creux est, perte ≈ 0.83) est le <strong>minimum global</strong>. La balle ne peut pas savoir lequel elle a trouvé ; gradient ≈ 0 donne exactement la même sensation dans les trois. Essayez η = 0.1 (elle rampe), 0.35 (elle se stabilise), puis 0.8 (trop grand pour ces creux — elle s'agite ou s'échappe).",
 "training.2": "Entraîner",
 "training.20": "<span class=\"lvl-add-tag\">Expert</span>Le pré-entraînement minimise l'entropie croisée du token suivant sur des milliers de milliards de tokens par descente de gradient stochastique, l'erreur étant transportée vers l'arrière à travers chaque couche (rétropropagation). Les jouets ci-dessus utilisent la même mise à jour, <span class=\"mono\">w ← w − η·∂L/∂w</span> — et le point de départ choisit l'issue, car cette surface est non convexe : le bassin d'attraction dans lequel vous commencez décide du minimum vers lequel vous convergerez. L'entraînement réel combat cela avec des redémarrages aléatoires en quelque sorte — ordre des données mélangé, bruit dans chaque gradient stochastique, moment — pour que l'optimiseur puisse sortir en s'agitant des bassins peu profonds et étroits et préfère les bassins larges et plats, qui généralisent mieux.",
 "training.21": "<span class=\"lvl-add-tag\">Expert · le paysage, mathématiquement</span>La surface ci-dessus est <span class=\"mono\">L(x,y) = 0.22(x²+y²) + 3 − Σᵢ dᵢ·exp(−((x−aᵢ)²+(y−bᵢ)²)/(2σᵢ²))</span> : un bol doux moins trois puits gaussiens en (−1.9, 1.3), (0.2, −1.7) et (2.0, 0.9). Son gradient est exact, non mesuré : <span class=\"mono\">∂L/∂x = 0.44x + Σᵢ dᵢ·exp(·)·(x−aᵢ)/σᵢ²</span> (et de même pour y) — chaque puits attire la balle vers son centre avec une force proportionnelle à la distance, qui s'estompe avec la gaussienne. Poser ∇L = 0 donne les points stationnaires ; en résolvant numériquement, les minima sont (−1.68, 1.15) avec L = 1.43, (0.19, −1.51) avec L = 1.36, et le minimum global (1.76, 0.79) avec L = 0.83. Entre chaque paire de bassins se trouve une <strong>crête en selle</strong> : franchissez-la et un minimum différent vous possède. La courbure décide de la taille du pas : aux minima, la plus grande valeur propre de la hessienne λ<sub>max</sub> ≈ 3.5–4.2, et la simple descente de gradient n'est stable que pour <span class=\"mono\">η &lt; 2/λ<sub>max</sub> ≈ 0.5</span> — voilà pourquoi η = 0.45 se stabilise (de justesse, avec une oscillation) et η = 0.8 ne peut rester immobile dans aucun creux. Près d'un minimum, la perte est localement quadratique, L ≈ L* + ½(w−w*)ᵀH(w−w*), donc la convergence est géométrique : l'erreur diminue d'environ |1 − ηλ| par pas le long de chaque direction propre. Une réserve honnête : dans le cas réel, à des milliards de dimensions, les vrais minima locaux comptent moins que ne le suggère cette image — les points-selles et les vallées connectées de faible perte dominent la géométrie en haute dimension, et les gradients stochastiques restent rarement immobiles assez longtemps pour être piégés. La leçon 2D qui survit intacte est la limite de stabilité et l'idée de bassin, pas la peur des creux.",
 "training.3": "Réinitialiser",
 "training.4": "Perte d'entraînement — plus elle est basse, mieux c'est",
 "training.5": "La boucle, en mathématiques — <strong>descente de gradient</strong> :<br>\n      1 · Deviner : le modèle produit des probabilités <span class=\"mono\">p</span> pour le token suivant.<br>\n      2 · Mesurer : <span class=\"mono\">loss = −log p(correct token)</span> — énorme quand il s'est trompé avec assurance, proche de zéro quand il avait raison.<br>\n      3 · Blâmer : chaque poids reçoit un gradient <span class=\"mono\">∂loss/∂w</span> — sa part personnelle du blâme (la règle de la chaîne transporte l'erreur vers l'arrière, couche par couche : « rétropropagation »).<br>\n      4 · Ajuster : <span class=\"mono\">w ← w − η · ∂loss/∂w</span>, avec un taux d'apprentissage <span class=\"mono\">η</span> petit (le modèle jouet de la leçon 8 utilise η = 0.4) pour qu'il s'améliore au lieu de sauter au-delà de la réponse.<br>\n      Répétez cela des milliards de fois, et la perte baisse lentement — comme descendre une pente dans le brouillard, en avançant toujours le long de la pente descendante la plus raide que vous puissiez sentir sous vos pieds.",
 "training.6": "Modèle jouet, principe réel. Le vrai système s'entraîne sur des milliers de milliards de tokens pendant des semaines\n    sur des milliers de processeurs, et les « mots » sont des tokens dans un espace à des milliers de dimensions —\n    mais la boucle est la même : deviner, mesurer l'erreur, ajuster, répéter. Point crucial : l'entraînement est terminé\n    avant même que vous tapiez un prompt ; discuter avec le modèle (<strong>inférence</strong>) ne change rien\n    en lui. Il n'apprend pas de vous.",
 "training.7": "Utiliser un modèle ne le réentraîne pas",
 "training.8": "La descente de gradient a besoin d'une réponse correcte connue pour mesurer la perte, et cela n'existe\n    que dans les données d'entraînement. Pendant que vous discutez avec un modèle terminé — <strong>inférence</strong> —\n    les poids sont gelés : il n'y a ni perte, ni gradient, ni passe arrière, ni ajustement. Le modèle\n    ne fonctionne que vers l'avant — lire le prompt, prédire le token suivant, l'ajouter, répéter (leçon 5). Si une\n    conversation semble lui apprendre quelque chose, c'est la fenêtre de contexte à l'œuvre (leçon 9) : les mots\n    restent dans sa mémoire à court terme et façonnent la prédiction suivante, mais aucun poids ne change, et tout est\n    oublié quand le contexte se termine. Apprendre quelque chose durablement à un modèle signifie toujours un autre\n    entraînement, effectué hors ligne par ses créateurs — jamais la discussion elle-même.",
 "training.9": "Le paysage de la perte — la descente de gradient en 3D",
 "context.0": "9 · Contexte — pourquoi il oublie",
 "context.1": "Le modèle ne peut se souvenir que d'une quantité limitée de votre conversation. Quand on en a trop dit, les mots les plus anciens disparaissent et sont oubliés — le modèle ne le remarque jamais, car pour lui ils n'existent plus. Ajoutez des phrases et regardez le début disparaître.",
 "context.2": "Remplissage de la fenêtre de contexte",
 "context.3": "Ajouter une phrase",
 "context.4": "Réinitialiser la conversation",
 "context.5": "Les vraies fenêtres sont bien plus grandes (ce petit modèle annonce jusqu'à 128k tokens), mais la règle est identique à toute taille. C'est aussi pourquoi les longues conversations « dérivent » : l'instruction que vous avez donnée au début a pu littéralement quitter la fenêtre.",
 "context.6": "<span class=\"lvl-add-tag\">Moyen</span>Cette quantité limitée a un nom : la <strong>fenêtre de contexte</strong> — un nombre fixe de tokens récents. Vos prompts et les réponses du modèle y vivent ensemble ; au-delà de la limite, les tokens les plus anciens tombent par l'avant, exactement comme dans la démo ci-dessus.",
 "context.7": "<span class=\"lvl-add-tag\">Expert</span>L'inférence est sans état : tout l'état est la séquence de tokens à l'intérieur de cette fenêtre fixe (le modèle local annonce 128k tokens ; la fenêtre miniature ci-dessus en contient 18). Les tokens au-delà de la limite ne sont ni compressés ni résumés — ils sont absents de la passe avant suivante, et c'est pourquoi les longues sessions perdent silencieusement les instructions initiales.",
 "limits.0": "10 · Limites — assuré, plausible, faux",
 "limits.1": "Le modèle essaie de dire des choses qui <em>semblent</em> justes — ce qui n'est pas la même chose qu'<em>être</em> juste. Quand il ne sait pas, il invente souvent des choses, avec assurance. Chaque bouton ci-dessous charge une question piège dans le modèle en direct ; devinez ce qui va se passer avant de l'exécuter.",
 "limits.10": "Pas encore exécuté",
 "limits.11": "Fausse citation",
 "limits.12": "Tombe dans le piège",
 "limits.13": "Trouve la bonne réponse",
 "limits.14": "Pas encore exécuté",
 "limits.15": "Maths à la va-vite",
 "limits.16": "Tombe dans le piège",
 "limits.17": "Trouve la bonne réponse",
 "limits.18": "Pas encore exécuté",
 "limits.19": "Réinitialiser le tableau",
 "limits.2": "Le piège du comptage de lettres",
 "limits.20": "Pourquoi il échoue : compter demande des lettres, mais le modèle voit des tokens (leçon 1) ; les citations sont faciles à imiter même quand elles n'existent pas ; et la réponse mathématique qui « semble juste » (10 centimes) l'emporte sur la bonne (5 centimes), sauf si le modèle ralentit. Les plus grands modèles tombent moins dans ces pièges — aucun n'est immunisé.",
 "limits.21": "<span class=\"lvl-add-tag\">Moyen</span>La raison tient à l'entraînement : il optimise un texte plausible, pas une vérité vérifiée. Sans base de données de faits ni auto-vérification, les lacunes sont comblées avec fluidité — ce mode d'échec s'appelle <strong>hallucination</strong>. Les petits modèles le font constamment ; surveillez-le quand les pièges s'exécuteront dans la leçon 11.",
 "limits.22": "<span class=\"lvl-add-tag\">Expert</span>L'objectif est la vraisemblance, pas la vérité : rien dans l'entraînement au token suivant ne fonde une affirmation, et le décodage poursuivra volontiers une prémisse fausse dans un style parfait. Attendez-vous à des citations inventées, à des échecs de comptage dus à la tokenisation et à des réponses fausses à forte probabilité (le leurre à 10¢ de la batte et de la balle). Les plus grands modèles réduisent ces trois problèmes — ils n'en éliminent aucun.",
 "limits.3": "Le piège de la fausse citation",
 "limits.4": "Le piège des maths à la va-vite",
 "limits.5": "Tableau des pièges — pronostiquez avant de l'exécuter",
 "limits.6": "Pour chaque piège : faites votre prédiction, puis exécutez le piège dans la leçon 11. Quand la réponse est terminée, le résultat est évalué automatiquement ici (une heuristique — vérifiez aussi la réponse vous-même).",
 "limits.7": "Comptage de lettres",
 "limits.8": "Tombe dans le piège",
 "limits.9": "Trouve la bonne réponse",
 "parsing.0": "7 · Analyse syntaxique — comment votre question est lue",
 "parsing.1": "Lorsque vous saisissez une question, le modèle doit déterminer ce que vous lui demandez avant de pouvoir répondre — mais personne ne lui a donné de livre de grammaire. Il n'y a à l'intérieur ni dictionnaire de noms et de verbes, ni code qui dessine des diagrammes de phrases. La compréhension de lecture que vous avez vu se construire — les tokens (leçon 1), les liens d'attention (leçon 4), les couches qui se spécialisent (leçon 6) — <em>est</em> l'analyseur syntaxique. La compréhension s'assemble d'elle-même, couche par couche. Parcourez les trois étapes ci-dessous et regardez une question être démontée.",
 "parsing.10": "2 · Liens",
 "parsing.11": "3 · Ce qu'elle demande",
 "parsing.12": "Annotations pédagogiques schématiques — les couleurs et les liens montrent le type de structure que l'attention doit construire, et non une lecture de l'intérieur réel du modèle (il n'en expose aucune). Les questions prédéfinies sont annotées à la main ; votre propre texte reçoit de simples règles par mot.",
 "parsing.13": "<span class=\"lvl-add-tag\">Moyen</span>Trois choses se produisent en séquence. Les couches précoces fixent la structure de surface — l'ordre des mots, quels mots se regroupent. Les couches intermédiaires relient les pointeurs : un mot interrogatif comme <em>combien</em> doit trouver la chose comptée, un <em>ne … pas</em> doit trouver le verbe qu'il annule (le deuxième préréglage est un piège exactement de ce type). Les couches tardives conservent le résultat sous forme d'interprétation de travail à partir de laquelle la réponse est générée. Les tokens de gabarit invisibles autour de votre question (la bande de débogage de la leçon 11) sont eux aussi analysés : le modèle distingue « l'humain pose une question » de « texte à poursuivre ».",
 "parsing.14": "<span class=\"lvl-add-tag\">Expert</span>Ce que les linguistes appellent analyse syntaxique — constituants, structure de dépendance, rôles sémantiques — apparaît dans les sondes du flux résiduel : la profondeur de l'arbre syntaxique et les relations de dépendance sont linéairement décodables à partir des représentations des couches intermédiaires, et des têtes d'attention individuelles suivent des relations comme sujet→verbe et pronom→antécédent. Rien de tout cela n'est symbolique : il n'y a aucune structure de données arborescente, seulement des vecteurs qui se comportent <em>comme si</em> un arbre avait été calculé, suffisamment bien pour que la perte du token suivant diminue. L'ambiguïté est donc un pari, pas une recherche — avec deux analyses valides, la masse de probabilité suit la distribution d'entraînement, et le perdant n'est tout simplement jamais représenté. C'est pourquoi une question mal lue reçoit une réponse fluide, assurée et fausse : la génération est fidèle à l'analyse, et c'est l'analyse qui était l'erreur.",
 "parsing.2": "Combien y a-t-il de lettres r dans le mot strawberry ? Réponds uniquement avec le nombre.",
 "parsing.3": "Pourquoi la Lune ne tombe-t-elle pas ?",
 "parsing.4": "Écris un haïku sur les feuilles d'automne, mais n'utilise pas le mot chute.",
 "parsing.5": "Le temps vole comme une flèche.",
 "parsing.6": "Les mouches des fruits aiment une banane.",
 "parsing.7": "Analyse la mienne",
 "parsing.8": "Les questions personnalisées reçoivent une analyse syntaxique schématique approximative — les préréglages sont annotés à la main.",
 "parsing.9": "1 · Rôles des mots",
 "toymodel.0": "8 · Un vrai modèle miniature — regardez-le penser en 3D",
 "toymodel.1": "Cette leçon est un <strong>vrai</strong> petit modèle, pas un dessin. Il apprend à partir de quelques phrases courtes, ici même dans votre navigateur. Entraînez-le, puis donnez-lui un mot et regardez la route lumineuse montrer comment il choisit le mot suivant.",
 "toymodel.10": "Comment le lire : chaque nœud caché calcule <span class=\"mono\">h = tanh(Σ w·x + b)</span>, chaque mot de sortie obtient un score <span class=\"mono\">z = Σ h·W + b</span>, et softmax transforme les scores en probabilités dont la somme fait 100 % : <span class=\"mono\">p = e<sup>z</sup> / Σ e<sup>z</sup></span>. Pendant l'entraînement, l'erreur pour le mot correct est <span class=\"mono\">loss = −log p(correct)</span>, et la <strong>descente de gradient</strong> ajuste chaque poids à l'opposé de son gradient : <span class=\"mono\">w ← w − η · ∂loss/∂w</span>, où le gradient de sortie a la forme magnifiquement simple <span class=\"mono\">p − 1</span> pour le mot correct et <span class=\"mono\">p</span> pour chaque mot incorrect — abaisser ce qu'il croyait à tort, relever ce qu'il a manqué, une fraction η à la fois.",
 "toymodel.11": "Entraînez-le avec vos propres phrases",
 "toymodel.12": "Remplacez tout son monde : écrivez quelques phrases courtes et répétitives (une par ligne, au moins deux mots chacune). Le modèle reconstruit son vocabulaire à partir de vos mots et se réentraîne de zéro. Les motifs que vous répétez seront les motifs qu'il apprendra.",
 "toymodel.13": "Utiliser mes phrases (recharge la page)",
 "toymodel.14": "Revenir aux phrases intégrées",
 "toymodel.15": "Essayez ceci : avant l'entraînement, choisissez « cat » — la prédiction est presque aléatoire.",
 "toymodel.16": "<span class=\"lvl-add-tag\">Moyen</span>À l'intérieur, chaque mot entre sous forme de nombres, traverse deux couches cachées de 16 et 12 nœuds, et ressort sous forme de probabilités pour le mot suivant. La taille et la luminosité des nœuds dans la vue 3D ci-dessus sont des activations réelles, et les lignes ambrées tracent les connexions les plus fortes derrière la prédiction — rien n'est mis en scène.",
 "toymodel.17": "<span class=\"lvl-add-tag\">Expert</span>Le réseau, exactement : entrée one-hot → 16 unités tanh → 12 unités tanh → softmax sur un vocabulaire de 12 mots, entraîné par SGD sur des paires de mot suivant. Contrairement au Llama de la leçon 11, chaque poids et chaque activation vivent dans cette page, donc la route ambrée peut montrer les plus grandes contributions |h·W| au logit gagnant. C'est un MLP, pas un transformer — sans attention —, ce qui rend l'inspection totale possible.",
 "toymodel.2": "Entraîner le modèle miniature",
 "toymodel.3": "Réinitialiser les poids",
 "toymodel.4": "Glisser pour orbiter · faire défiler pour zoomer",
 "toymodel.5": "La vue 3D nécessite une connexion internet pour sa bibliothèque lors du premier chargement.",
 "toymodel.6": "Ce qu'il prédit ensuite (probabilités de sortie réelles)",
 "toymodel.7": "Route la plus forte : entraînez d'abord le modèle.",
 "toymodel.8": "Les maths, avec les chiffres réels de ce modèle",
 "toymodel.9": "Entraînez ou choisissez un mot pour voir ses chiffres.",
 "playground.0": "11 · Modèle en direct — tout à la fois",
 "playground.1": "Maintenant, la vraie chose : un petit modèle d'IA qui tourne sur votre propre ordinateur. Tapez quelque chose, appuyez sur Générer et regardez-le écrire — un petit morceau à la fois, en devinant toujours ce qui vient ensuite. Rien de ce que vous tapez ne quitte cette machine.",
 "playground.10": "Chaque morceau lumineux de la réponse ci-dessus est un token que le modèle a choisi. Cliquez sur l'un d'eux : les tours montrent les autres mots entre lesquels il choisissait, et à quel point il était sûr. Tour haute = « presque certainement celui-ci ». Plusieurs tours similaires = « un vrai choix ». Cela se rejoue en direct pendant que le modèle écrit.",
 "playground.11": "Tours de candidats — faites glisser pour orbiter · faites défiler pour zoomer · cliquez sur un token dans la réponse pour l'inspecter",
 "playground.12": "Générez quelque chose, puis cliquez sur un token dans la réponse.",
 "playground.13": "<span class=\"lvl-add-tag\">Expert · débogage</span>À l'intérieur de la requête — données du serveur du modèle",
 "playground.14": "Ci-dessous figurent les données que le serveur du modèle de votre ordinateur rapporte sur la dernière exécution : à quelle vitesse il a réfléchi, et les ID de token numérotés exacts qu'il a traités — y compris les tokens d'instruction cachés placés autour de votre prompt que vous n'avez jamais tapés.",
 "playground.15": "Aucune génération pour l'instant dans cette session.",
 "playground.16": "Cliquez sur un token dans la réponse pour voir ici ses chiffres de débogage de niveau Expert.",
 "playground.17": "Le modèle local est injoignable",
 "playground.18": "Installez Ollama depuis <span class=\"mono\">ollama.com/download</span>",
 "playground.19": "Exécutez : <span class=\"mono\">ollama pull llama3.2:1b</span>",
 "playground.2": "Générer",
 "playground.20": "Exécutez : <span class=\"mono\">ollama serve</span> (ou lancez simplement l'application Ollama)",
 "playground.21": "Appuyez sur <strong>Revérifier</strong> ci-dessus.",
 "playground.22": "<span class=\"lvl-add-tag\">Moyen</span>Le modèle derrière le bouton est un vrai petit Llama qui tourne localement via Ollama. Il génère de façon <strong>autorégressive</strong> — un token à la fois, en échantillonnant chaque token suivant à partir de sa distribution de probabilité à la température que vous avez choisie, puis en réinjectant ce token. Les tours ci-dessus sont les 5 principaux candidats réels avec leurs probabilités (tirées des logprobs d'Ollama) pour le token sur lequel vous avez cliqué — la même compétition softmax que dans la leçon 5, maintenant avec des chiffres réels. La hauteur des tours utilise une échelle en racine carrée pour que les petites probabilités restent visibles.",
 "playground.23": "<span class=\"lvl-add-tag\">Expert</span>Inférence en direct contre llama3.2:1b sur localhost:11434, diffusée token par token depuis <span class=\"mono\">/api/generate</span> avec <span class=\"mono\">logprobs + top_logprobs=5</span>. Chaque fragment est un token échantillonné depuis softmax(z/T) à votre T ; le contexte complet est retraité par token (avec cache KV côté serveur). Les probabilités sont <span class=\"mono\">exp(logprob)</span>, « tous les autres » est la masse restante sur le vocabulaire d'environ 128k, et la hauteur de la tour est proportionnelle à √p, pour que les petites probabilités restent visibles. Une remarque d'honnêteté sur la vue du voyage : Ollama n'expose aucun élément interne par couche, donc le passage par les couches est une relecture schématique synchronisée avec vos tokens — mais la tokenisation, le nombre de 16 couches (réel, via <span class=\"mono\">/api/show</span>), la sortie diffusée et les probabilités des candidats sont réels. Le détail complet de débogage se trouve dans le panneau de débogage Expert ci-dessus.",
 "playground.3": "Arrêter",
 "playground.4": "Température basse = choix sûrs et répétitifs. Température élevée = choix plus extravagants et risqués.",
 "playground.5": "Regardez-le voyager — vos tokens à travers le modèle",
 "playground.6": "Voyage du token — faites glisser pour orbiter · faites défiler pour zoomer · à gauche : vos tokens qui montent à travers 16 couches · à droite : candidats réels au token suivant pour la première prédiction",
 "playground.7": "En attente — appuyez sur Générer et vos tokens monteront à travers les couches.",
 "playground.8": "Flux de tokens — une rafale par fragment de token généré",
 "playground.9": "Ce que le modèle a envisagé — probabilités réelles",
 "scaling.0": "12 · Petit contre premium — pourquoi l'échelle le rend plus intelligent",
 "scaling.1": "Tout ce que vous avez fait jusqu'ici utilisait un modèle d'environ un milliard de boutons, tournant sur votre propre ordinateur. Les modèles premium — les grands modèles hébergés — fonctionnent exactement de la même façon : des tokens entrent, des embeddings, de l'attention, des probabilités du token suivant sortent. Il n'y a aucun ingrédient secret supplémentaire dans la recette. La différence, c'est <strong>l'échelle, le polissage et l'endroit où il tourne</strong> : bien plus de boutons, entraînés sur bien plus de texte, achevés par un entraînement supplémentaire qui lui apprend à suivre les instructions et à montrer son raisonnement.",
 "scaling.10": "Llama 3.2 1B (le vôtre, chiffres réels)",
 "scaling.11": "Classe premium (grands modèles hébergés)",
 "scaling.12": "Paramètres",
 "scaling.13": "1.23 milliard",
 "scaling.14": "Non publié — estimé dans la classe des centaines de milliards",
 "scaling.15": "Couches / taille de l'embedding",
 "scaling.16": "16 couches · 2,048 nombres par token",
 "scaling.17": "Non publié — bien plus profond et plus large",
 "scaling.18": "Vocabulaire",
 "scaling.19": "128,256 tokens",
 "scaling.2": "Pourquoi « plus de la même chose » rendrait-il quelque chose plus intelligent ? Un modèle plus grand a la place de stocker plus de motifs, plus de faits et des relations plus subtiles entre eux — et il a vu plus d'exemples de chaque type de problème pendant l'entraînement. Ses prédictions du token suivant (leçon 5) sont simplement justes plus souvent, surtout pour les choses rares et compliquées. Changez la mesure ci-dessous et comparez — les deux blocs sont dessinés à <strong>échelle de volume réelle</strong> : le petit cube est tout votre modèle, et le volume du grand bloc est son multiple réel. Un écart de 200× semble abstrait ; un bloc qui avale 200 de votre modèle, dessiné honnêtement, ne l'est pas. (La grille gravée dans le grand bloc montre à peu près combien de petits cubes tiennent à l'intérieur.)",
 "scaling.20": "Non publié — même ordre de grandeur",
 "scaling.21": "Fenêtre de contexte",
 "scaling.22": "131,072 tokens (~100k mots)",
 "scaling.23": "Environ 200k–1M tokens selon le produit",
 "scaling.24": "Texte d'entraînement",
 "scaling.25": "Jusqu'à 9 billions de tokens (carte de modèle de Meta)",
 "scaling.26": "Non publié — classe des dizaines de billions, plus un filtrage et une curation importants",
 "scaling.27": "Après l'entraînement",
 "scaling.28": "Il existe des versions ajustées aux instructions ; la vôtre est légèrement polie",
 "scaling.29": "Ajustement extensif aux instructions, entraînement par retour humain, ajustement de sécurité et de raisonnement",
 "scaling.3": "Paramètres",
 "scaling.30": "Tourne sur",
 "scaling.31": "Votre ordinateur, une puce, nombres arrondis à 8 bits",
 "scaling.32": "Centres de données, de nombreux accélérateurs, nombres de plus grande précision",
 "scaling.33": "Lisez la colonne premium honnêtement : ces entreprises ne publient pas leurs recettes, donc tout ce qui n'a pas été annoncé est marqué comme une estimation de la classe, pas comme une spécification. Quiconque vous cite un nombre exact de paramètres pour un modèle premium devine.",
 "scaling.34": "<span class=\"lvl-add-tag\">Moyen</span>Le motif derrière les tours est une <strong>loi d'échelle</strong> : la perte de prédiction diminue de façon régulière et prévisible lorsque vous augmentez ensemble les paramètres, les données et le calcul — une ligne droite sur un graphique log-log, trouvée empiriquement dans de nombreuses familles de modèles. Doublez les trois et le modèle s'améliore de façon mesurable à la prédiction du token suivant, et les capacités en aval (arithmétique, code, traduction) suivent. Il y a aussi un bon rapport : la recherche (le résultat « Chinchilla ») a découvert que de nombreux modèles étaient sous-entraînés pour leur taille — environ 20 tokens d'entraînement par paramètre est un meilleur équilibre qu'un énorme modèle nourri de peu de texte.",
 "scaling.35": "<span class=\"lvl-add-tag\">Expert</span>L'arithmétique de l'échelle : calcul d'entraînement ≈ 6 · paramètres · tokens d'entraînement FLOPs, donc la colonne premium multiplie deux grands nombres entre eux — c'est pourquoi les entraînements à la frontière se mesurent en mégawatt-mois. L'inférence coûte environ 2 · paramètres FLOPs par token généré (avant le trafic d'attention et de mémoire), ce qui explique pourquoi les réponses premium sont facturées au compteur et pourquoi votre 1B semble instantané. Trois réserves gardent l'échelle honnête : (1) beaucoup de systèmes premium sont des mélanges d'experts — les paramètres totaux surestiment ceux actifs utilisés par token ; (2) les rendements diminuent — chaque division par deux de la perte coûte exponentiellement plus de calcul, et le texte de haute qualité est fini (le « mur des données ») ; (3) l'échelle n'est pas tout l'écart — la curation des données, le post-entraînement (ajustement aux instructions, RLHF/optimisation par préférences), une génération délibérée plus longue et l'utilisation d'outils sont construits par-dessus. Votre modèle local est le même type de machine avec tous les réglages baissés — et ses poids arrondis à des entiers 8 bits (Q8_0) pour tenir, ce qui coûte à lui seul un peu de précision.",
 "scaling.4": "Tokens d'entraînement",
 "scaling.5": "Fenêtre de contexte",
 "scaling.6": "Calcul par token",
 "scaling.7": "Petit contre premium à échelle de volume réelle — faites glisser pour orbiter · faites défiler pour zoomer · le volume du grand bloc est le rapport réel (son arête est la racine cubique du rapport)",
 "scaling.8": "La vue 3D a besoin d'une connexion internet pour sa bibliothèque lors du premier chargement. Le tableau ci-dessous contient la même comparaison.",
 "scaling.9": "Mesure",
 "assistant.0": "13 · Du prédicteur à l'assistant — les couches de finition",
 "assistant.1": "Voici un puzzle que ce cours a préparé. La leçon 3 a entraîné une machine qui ne fait que prédire le token suivant. Le modèle de la leçon 11 <em>répond aux questions, suit les instructions, met en forme les réponses et s'arrête quand il a fini</em>. La prédiction seule ne fait rien de tout cela : un modèle brut (« base ») à qui l'on donne « Quelle est la capitale de la France ? » continue joyeusement avec d'autres questions de quiz, parce que c'est ce à quoi ressemble habituellement un texte en forme de question dans le monde réel. Le comportement d'assistant est <strong>entraîné ensuite</strong>, par étapes. Cliquez pour parcourir le pipeline, puis comparez le même prompt avant et après la finition.",
 "assistant.10": "Assistant (après les étapes 2–3)",
 "assistant.11": "Des reconstructions pédagogiques, écrites pour montrer la différence typique — pas des enregistrements d'un modèle précis. Votre Llama local est déjà un modèle ajusté par instructions ; la colonne de base montre ce que son frère non ajusté tendrait à faire avec le même texte.",
 "assistant.12": "<span class=\"lvl-add-tag\">Moyen</span>L'étape 2 (ajustement par instructions, ou SFT) s'entraîne sur des milliers d'exemples « instruction → bonne réponse », si bien qu'une entrée en forme de question commence à prédire une sortie en forme de réponse. L'étape 3 classe plusieurs réponses candidates à l'aide de préférences humaines (ou d'IA) et pousse le modèle vers les gagnantes — utile, honnête, inoffensif est le slogan habituel. Les tokens de gabarit de chat de la bande de débogage de la leçon 11 en font partie : ils marquent qui parle, et le modèle ajusté a appris qu'après la fin du tour de l'utilisateur commence le tour d'un assistant — une réponse, pas d'autres questions.",
 "assistant.13": "<span class=\"lvl-add-tag\">Expert</span>Mécaniquement, les étapes 2–3 restent la leçon 3 : descente de gradient sur la perte de prédiction du token suivant. SFT est un ajustement fin ordinaire sur des démonstrations sélectionnées. L'entraînement par préférences classique ajuste un modèle de récompense aux classements humains, puis optimise la politique face à lui avec RL (PPO) sous une pénalité KL par rapport au modèle SFT ; les pipelines plus récents (DPO et apparentés) sautent le modèle de récompense explicite et optimisent directement sur des paires choisies/rejetées. La laisse KL compte : sans elle, le reward hacking dévore le modèle — il trouve un texte dégénéré que le modèle de récompense surévalue. Effets secondaires connus à surveiller dans le monde réel : la flagornerie (être d'accord avec la prémisse de l'utilisateur), des styles de refus qui varient selon le sujet, et une « taxe d'alignement » sur certaines capacités brutes. Le prompt système est analysé comme n'importe quel autre token (leçon 7), mais il se place plus tôt dans le contexte et, dans les modèles ajustés, porte une priorité apprise lors de l'entraînement : la hiérarchie des instructions est un comportement appris, pas un système strict de contrôle d'accès — et c'est exactement pour cela que l'injection de prompt peut fonctionner.",
 "assistant.2": "1 · Pré-entraînement<br><span>tout prédire</span>",
 "assistant.3": "2 · Ajustement par instructions<br><span>réponds, ne continue pas</span>",
 "assistant.4": "3 · Entraînement par préférences<br><span>sois utile, sois sûr</span>",
 "assistant.5": "Le même prompt, deux machines",
 "assistant.6": "Quelle est la capitale de la France ? Réponds en un mot.",
 "assistant.7": "Écris un poème de deux vers sur la pluie.",
 "assistant.8": "Comment crocheter une serrure ?",
 "assistant.9": "Modèle de base (après l'étape 1 seulement)",
 "capstone.0": "15 · Projet final — démonter une réponse",
 "capstone.1": "Tout ce que vous avez appris, tiré en une fois. Cette page vous guide pour disséquer une seule réponse en direct avec toute la boîte à outils : <strong>prédisez d'abord</strong> (la plus forte habitude d'apprentissage du cours), analysez la question, générez, inspectez les candidates et lisez les chiffres de débogage comme un ingénieur. Chaque étape se coche au fur et à mesure que vous la faites — ici, ou dans les leçons où elle vit.",
 "capstone.2": "Réinitialiser le projet final",
 "capstone.3": "Quand les cinq sont cochées, vous aurez utilisé tous les instruments de l'atelier sur une seule réponse : analyse, prédiction, échantillonnage, inspection des candidates et débogage du serveur. Cette boucle — prédire, exécuter, disséquer — est toute la compétence que ce cours construisait.",
 "capstone.4": "<span class=\"lvl-add-tag\">Moyen</span>Pourquoi prédire d'abord ? Parce que regarder une réponse arriver apprend à reconnaître, mais s'engager d'abord sur une prédiction expose votre propre modèle du modèle — et les corrections restent. Tout flux d'évaluation professionnel est cette boucle à grande échelle : formez une attente, exécutez, comparez, et laissez l'écart entre les deux réécrire votre compréhension.",
 "capstone.5": "<span class=\"lvl-add-tag\">Expert</span>Ce que vous venez de faire à la main est, formellement, une évaluation comportementale à un seul élément avec une hypothèse préenregistrée — la même forme qu'un benchmark, moins les statistiques. Mettez-la à l'échelle et les problèmes ouverts apparaissent : fiabilité du juge (votre heuristique de la leçon 10 peut mal juger, exactement comme un juge LLM), contamination (des éléments que le modèle a pu mémoriser) et variance selon les graines et les températures (leçon 5). Gardez ces trois-là en tête et vous pourrez lire n'importe quel classement comme un ingénieur plutôt que comme un fan.",
 "footer.0": "LLM Visual Lab — un outil d'apprentissage local. Les leçons 1–7 et 13–15 sont des modèles pédagogiques schématiques, la leçon 8 est un vrai (minuscule) modèle entraîné, la leçon 11 utilise le vrai Llama local, et la leçon 12 le compare à des modèles premium (les chiffres premium sont des estimations étiquetées).",
 "quiz.0": "Quiz de contrôle",
 "quiz.1": "Fermer ✕",
 "quiz.2": "Gardés à l'écart des leçons pour que l'apprentissage reste propre. Répondez aux deux questions d'une leçon pour la terminer automatiquement — ou utilisez plutôt « Marquer la leçon comme terminée » à la fin d'une leçon.",
 "rag.0": "14 · Trouver des réponses — la récupération (RAG)",
 "rag.1": "Le modèle de la leçon 11 ne sait que ce que l'entraînement a gravé dans ses poids, et la fenêtre de contexte de la leçon 9 oublie. Les systèmes réels trichent, de façon productive : avant de répondre, ils <strong>cherchent les choses</strong>. Les documents sont découpés en morceaux, chaque morceau est transformé en embedding (leçon 2), et votre question est elle aussi transformée en embedding. Les morceaux dont les vecteurs sont les plus proches de la question sont collés dans la fenêtre de contexte, et le modèle répond avec les preuves sous les yeux. C'est la <strong>génération augmentée par récupération</strong>. Essayez-la sur une minuscule archive fictive — la réponse n'existe qu'à l'intérieur de ces documents, donc un modèle sans récupération devrait deviner.",
 "rag.2": "De quelle couleur est le phare du port ?",
 "rag.3": "Quand le ferry part-il le dimanche ?",
 "rag.4": "Que dois-je faire pour une chaîne de vélo qui grince ?",
 "rag.5": "1 · Chercher par le sens",
 "rag.6": "2 · Construire le prompt bourré",
 "rag.7": "Les scores de similarité ici sont une vraie arithmétique sur cette archive jouet (vecteurs de chevauchement de mots, similarité cosinus — une miniature de la géométrie de la leçon 2, les embeddings appris étant remplacés par des comptages). Les systèmes réels utilisent un modèle d'embedding dédié, cherchent parmi des millions de morceaux avec des plus proches voisins approximatifs, et reclassent.",
 "rag.8": "<span class=\"lvl-add-tag\">Moyen</span>Remarquez ce que la récupération fait aux modes d'échec que vous connaissez : les connaissances vivent désormais <em>en dehors</em> des poids, donc elles peuvent être mises à jour, citées et supprimées sans réentraînement ; la fenêtre de contexte (leçon 9) devient une mémoire de travail au lieu d'être le monde entier ; et l'hallucination (leçon 10) diminue quand la réponse est copiée depuis les preuves — même si elle revient dès que le récupérateur rapporte avec assurance le mauvais morceau. La taille des morceaux est un vrai réglage : trop petite et l'autre moitié de la réponse est dans le morceau suivant ; trop grande et vous payez des tokens (le calcul de la leçon 12) pour coller un texte en grande partie non pertinent.",
 "rag.9": "<span class=\"lvl-add-tag\">Expert</span>Le RAG en production est un pipeline, et chaque étape a ses propres métriques : découpage (limites fixes, récursives ou sémantiques ; chevauchement pour protéger les réponses qui franchissent les limites), choix du modèle d'embedding (dimension, adéquation au domaine), index (cosinus exact pour les petits corpus, recherche approximative HNSW/IVF à grande échelle, en échangeant le recall contre la latence), récupération hybride (vecteurs denses plus correspondance par mots-clés BM25 — la sémantique pure manque les noms et les nombres exacts), reclassement avec un cross-encoder, et enfin génération conditionnée par l'ensemble récupéré. L'évaluation se divise en deux : qualité de récupération (recall@k — le bon morceau a-t-il même été collé ?) contre fidélité de la génération (la réponse est-elle restée dans les preuves ?). La plupart des rapports « le RAG ne marche pas » sont des échecs de récupération déguisés en génération. Et la note de sécurité : les documents collés sont aussi des tokens — un morceau empoisonné peut porter des instructions, ce qui est une injection de prompt arrivant par la porte d'entrée."
};
window.I18N_DYN_FR = {
 "cap_steps": {
  "expert": "<strong>5 · Lisez le débogage comme un ingénieur.</strong> Passez au niveau Expert et ouvrez le panneau de débogage dans la leçon 11 : raison de l'arrêt, utilisation du contexte et choix le plus incertain.",
  "inspect": "<strong>4 · Inspectez un jeton.</strong> Dans la réponse de la leçon 11, cliquez sur n'importe quel jeton lumineux et lisez entre quoi le modèle choisissait.",
  "judged": "<strong>3 · Exécutez-le.</strong> Générez la réponse piège dans la leçon 11. Le juge du tableau de bord de la leçon 10 la note automatiquement par rapport à votre prédiction.",
  "parse": "<strong>2 · Analysez-le.</strong> Ouvrez la question strawberry dans la leçon 7 et menez-la à l'étape 3 — nommez ce qu'il faut compter et la contrainte de format avant que le modèle ne la voie.",
  "predict": "<strong>1 · Prédire.</strong> Le piège du comptage de lettres, encore une fois : le modèle local comptera-t-il correctement les r de “strawberry” ?"
 },
 "input_defaults": {
  "ctxInput": "Ma couleur préférée est le bleu canard et je vis à Bergen.",
  "parsePlaceholder": "Tapez une question et appuyez sur « Analyser la mienne »",
  "promptInput": "La capitale de la France est",
  "tokenInput": "Le renard brun rapide saute par-dessus le chien paresseux."
 },
 "lesson_titles": {
  "assistant": "De prédicteur à assistant",
  "attention": "Attention",
  "capstone": "Projet de synthèse",
  "context": "Contexte",
  "embeddings": "Plongements",
  "journey": "Dans le modèle",
  "limits": "Limites",
  "parsing": "Analyser une question",
  "playground": "Modèle en direct",
  "probabilities": "Jeton suivant",
  "rag": "Trouver des réponses (RAG)",
  "scaling": "Petit vs premium",
  "tokens": "Jetons",
  "toymodel": "Modèle miniature 3D",
  "training": "Entraînement"
 },
 "quizzes": {
  "assistant": [
   [
    "Un modèle de base devant « What is the capital of France? » souvent…",
    [
     "Répond « Paris » et s'arrête",
     "Continue avec d'autres questions de quiz",
     "Refuse"
    ],
    "La prédiction sans réglage d'instructions continue le motif du texte en forme de questions."
   ],
   [
    "Les refus et le ton serviable viennent surtout de…",
    [
     "Le volume de données de pré-entraînement",
     "L'entraînement aux préférences après le réglage d'instructions",
     "Une plus grande fenêtre de contexte"
    ],
    "L'étape 3 entraîne les goûts : serviable, honnête, sûr — par-dessus la capacité."
   ]
  ],
  "attention": [
   [
    "Dans la tête A, à quoi « it » prête-t-il le plus attention ?",
    [
     "mat",
     "cat",
     "tired"
    ],
    "Les têtes de référence relient les pronoms à leur nom."
   ],
   [
    "Un jeton peut-il prêter attention aux mots qui viennent après lui ?",
    [
     "Oui",
     "Non — seulement en arrière",
     "Seuls les verbes le peuvent"
    ],
    "Le masque causal bloque l'avenir ; la prédiction ne peut pas tricher en regardant devant."
   ]
  ],
  "capstone": [
   [
    "La première étape de la boucle finale est de prédire avant d'exécuter parce que…",
    [
     "Cela rend la génération plus rapide",
     "Un pari engagé expose votre modèle du modèle, et les corrections restent",
     "Le juge l'exige"
    ],
    "Des attentes enregistrées à l'avance transforment le fait de regarder en évaluation."
   ],
   [
    "Une évaluation comportementale à grande échelle doit s'inquiéter de…",
    [
     "La fiabilité du juge, la contamination et la variance",
     "Les choix de polices",
     "Rien — une seule exécution prouve tout"
    ],
    "Une exécution fluide est une anecdote ; la fiabilité est un problème de statistiques."
   ]
  ],
  "context": [
   [
    "Quand la fenêtre de contexte se remplit, qu'arrive-t-il aux jetons les plus anciens ?",
    [
     "Ils sont résumés",
     "Ils sortent de la fenêtre et n'existent plus pour le modèle",
     "Ils sont enregistrés sur disque"
    ],
    "Hors de la fenêtre = absent du prochain passage avant."
   ],
   [
    "Pourquoi les longues conversations peuvent-elles commencer à ignorer votre première instruction ?",
    [
     "Le modèle s'ennuie",
     "Elle a pu sortir de la fenêtre de contexte",
     "Internet la perd"
    ],
    "Les jetons initiaux peuvent littéralement sortir de ce que le modèle voit."
   ]
  ],
  "embeddings": [
   [
    "Deux mots proches dans l'espace de plongement signifient…",
    [
     "Ils s'écrivent de façon semblable",
     "Ils apparaissent dans des phrases similaires",
     "Ils ont la même longueur"
    ],
    "Proximité = contextes d'usage similaires, appris pendant l'entraînement."
   ],
   [
    "king − man + woman atterrit près de…",
    [
     "car",
     "queen",
     "apple"
    ],
    "Les directions dans l'espace codent des relations comme la royauté et le genre."
   ]
  ],
  "journey": [
   [
    "Par quelles couches passe un jeton ?",
    [
     "Seulement celles dont il a besoin",
     "Toutes les couches, dans l'ordre",
     "Une couche au hasard"
    ],
    "Tous les jetons traversent la pile entière ; l'attention et le MLP réécrivent chacun par couche."
   ],
   [
    "Que sort-il de la couche finale ?",
    [
     "Une phrase terminée",
     "Des scores pour le jeton suivant",
     "Une image"
    ],
    "La représentation finale devient les probabilités du jeton suivant."
   ]
  ],
  "limits": [
   [
    "Pourquoi le modèle hallucine-t-il ?",
    [
     "Il ment exprès",
     "Il a été entraîné pour du texte plausible, pas pour la vérité vérifiée",
     "Il est cassé"
    ],
    "La vraisemblance est l'objectif ; des inventions fluides comblent les vides."
   ],
   [
    "Demandez un article scientifique prouvant une affirmation inventée et il peut…",
    [
     "Refuser à chaque fois",
     "Inventer une fausse citation convaincante",
     "Chercher sur le web"
    ],
    "Les citations sont un style qu'il peut imiter sans aucune base de données."
   ]
  ],
  "parsing": [
   [
    "Dans le modèle, les règles de grammaire vivent dans…",
    [
     "Un dictionnaire intégré de noms et de verbes",
     "Nulle part — l'analyse émerge de l'attention et des couches",
     "Le tokeniseur"
    ],
    "Il n'existe aucun analyseur symbolique ; la structure est construite par les mêmes mécanismes des leçons 4 et 6."
   ],
   [
    "« Fruit flies like a banana » est dangereux pour un modèle parce que…",
    [
     "Les bananes sont rares dans les données d'entraînement",
     "La même forme de mot exige l'analyse opposée, et il doit parier sur l'une d'elles",
     "Elle contient une négation"
    ],
    "Deux analyses valides, un gagnant — un mauvais pari en amont devient une réponse fluide mais fausse."
   ]
  ],
  "playground": [
   [
    "Où le modèle en direct s'exécute-t-il ?",
    [
     "Dans le cloud",
     "Sur votre propre ordinateur",
     "Uniquement dans l'onglet du navigateur"
    ],
    "Ollama sert llama3.2:1b localement — rien ne quitte cette machine."
   ],
   [
    "Une température basse (proche de 0) rend la sortie…",
    [
     "Plus aléatoire",
     "Plus sûre et plus répétitive",
     "Plus longue"
    ],
    "Une T basse aiguise la distribution vers le favori."
   ]
  ],
  "probabilities": [
   [
    "Augmenter la température rend les choix…",
    [
     "Toujours corrects",
     "Plus aléatoires et farfelus",
     "Plus rapides"
    ],
    "Une T plus élevée aplatit la distribution, donc les options improbables sont choisies plus souvent."
   ],
   [
    "Échantillonner signifie que le jeton suivant est choisi…",
    [
     "Par ordre alphabétique",
     "En lançant un dé pondéré sur les probabilités",
     "Par un humain"
    ],
    "Softmax donne les probabilités ; la génération échantillonne à partir d'elles."
   ]
  ],
  "rag": [
   [
    "Dans RAG, les morceaux récupérés finissent…",
    [
     "Écrits dans les poids du modèle",
     "Collés dans la fenêtre de contexte comme preuves",
     "Supprimés après la recherche"
    ],
    "La récupération insère les preuves dans le prompt ; les poids ne changent jamais."
   ],
   [
    "La plupart des échecs « RAG ne marche pas » sont généralement…",
    [
     "Le récupérateur a ramené le mauvais morceau",
     "Le modèle a oublié son entraînement",
     "La fenêtre de contexte était trop honnête"
    ],
    "Si le bon morceau n'a jamais été collé, la génération n'a jamais eu sa chance — vérifiez d'abord recall@k."
   ]
  ],
  "scaling": [
   [
    "Un modèle premium est plus intelligent principalement parce que…",
    [
     "Il utilise un type de maths différent et secret",
     "La même recette à bien plus grande échelle, plus un entraînement de polissage",
     "Il cherche les réponses dans une base de données"
    ],
    "Jetons, attention et prédiction du jeton suivant sont identiques ; les paramètres, les données et le post-entraînement, non."
   ],
   [
    "Quelqu'un cite un nombre exact de paramètres pour un modèle premium. Vous devriez…",
    [
     "Le croire — toutes les specs sont publiques",
     "Demander la source officielle — les fabricants ne le publient pas, c'est donc une estimation",
     "Multiplier par dix le nombre de votre modèle local"
    ],
    "Les fabricants premium ne divulguent pas le nombre de paramètres ; les comparaisons honnêtes les étiquettent comme estimations."
   ]
  ],
  "tokens": [
   [
    "Que lit réellement le modèle ?",
    [
     "Des mots entiers",
     "Des jetons (morceaux de texte)",
     "Des lettres"
    ],
    "Il lit des jetons — des morceaux qui peuvent être un mot, une partie de mot ou un signe de ponctuation."
   ],
   [
    "Pourquoi les modèles échouent-ils souvent à compter les lettres d'un mot ?",
    [
     "Ils sont mauvais en maths",
     "Ils voient des jetons, pas des lettres",
     "Le mot est trop long"
    ],
    "Un mot peut être un seul jeton, donc ses lettres n'ont jamais été des entrées séparées."
   ]
  ],
  "toymodel": [
   [
    "Après l'entraînement, pourquoi « cat » prédit-il « sat » si fort ?",
    [
     "C'est programmé",
     "Ses phrases associent toujours cat à sat",
     "Les chats s'assoient dans la vraie vie"
    ],
    "Le modèle ne connaît que les motifs de ses phrases d'entraînement."
   ],
   [
    "La route ambre montre…",
    [
     "Le seul chemin emprunté",
     "Les connexions les plus actives — tous les nœuds s'activent quand même",
     "Un raccourci secret"
    ],
    "Chaque nœud s'active en même temps ; la route montre les contributions les plus fortes."
   ]
  ],
  "training": [
   [
    "Que mesure la perte (loss) ?",
    [
     "La taille du modèle",
     "À quel point la prédiction était fausse",
     "À quelle vitesse il fonctionne"
    ],
    "La perte est le score d'erreur — la descente de gradient la réduit pas à pas."
   ],
   [
    "Le modèle apprend-il de votre conversation avec lui ?",
    [
     "Oui, définitivement",
     "Seulement pour les utilisateurs payants",
     "Non — l'entraînement est déjà terminé"
    ],
    "Discuter, c'est de l'inférence ; les poids ne changent pas."
   ]
  ]
 },
 "title": "LLM Visual Lab — Comment fonctionnent les modèles de langage",
 "trap_status": {
  "fell": "Le modèle est tombé dans le piège",
  "fell_called": " — vous l'aviez vu venir ✓",
  "fell_missed": " — vous ne l'aviez pas vu venir",
  "locked": "Prédiction verrouillée — exécutez-le maintenant",
  "not_run": "Pas encore exécuté",
  "survived": "Le modèle a réussi",
  "survived_called": " — vous l'aviez vu venir ✓",
  "survived_missed": " — plus dur que vous ne pensiez"
 },
 "ui": {
  "cap_expert_btn": "Passer en Expert et y aller",
  "cap_fall": "Il va tomber dans le piège",
  "cap_parse_btn": "L'ouvrir dans la leçon 7",
  "cap_run_btn": "Charger le piège dans la leçon 11",
  "cap_survive": "Il va réussir",
  "cap_tally": "Projet de synthèse : {a} étapes sur 5 faites.",
  "cap_tally_all": " Les cinq — vous avez exécuté la boucle complète : prédire, analyser, générer, inspecter, déboguer.",
  "complete_btn": "Marquer la leçon comme terminée",
  "completed_btn": "Terminée ✓ — cliquez pour annuler",
  "completed_status": "Terminée ✓",
  "correct_prefix": "Correct. ",
  "final_note": "Dernière leçon — terminez-la pour finir le cours.",
  "language_label": "Langue",
  "lesson_complete_toast": "Leçon terminée : {title} — {a} sur {b} faites.",
  "next_lesson": "Leçon suivante : {title} →",
  "not_completed": "Non terminée",
  "progress": "Progression {a}/{b}",
  "quiz_intro": "Répondez aux deux questions pour terminer cette leçon automatiquement.",
  "rag_answer_prefix": "Avec les preuves collées, le modèle peut répondre à partir du morceau supérieur : ",
  "rag_prompt_intro": "Répondez uniquement à partir des preuves ci-dessous. Si elles n'y sont pas, dites-le.",
  "rag_question_label": "Question : ",
  "rag_top_msg": "Les 2 meilleurs morceaux sélectionnés (surlignés). Construisez maintenant le prompt que le modèle recevrait réellement.",
  "sharp_note": "S'il devait répondre dès la couche 0, la meilleure hypothèse serait “{first}” à {fp}%. À la couche 15, le leader est “{last}” à {lp}%. Les points roses marquent où le mot leader change — les premières couches devinent encore des mots grammaticaux ; la vraie réponse ne prend la tête que lorsque le contexte arrive.",
  "sound_off": "Son : désactivé",
  "sound_on": "Son : activé",
  "trap_tally": "Prédictions correctes : {a} pièges sur {b} jugés.",
  "wrong_prefix": "Pas tout à fait. "
 },
 "assistant_scenarios": [
  {
   "asst": "Paris.",
   "base": "Quelle est la capitale de la France ? Répondez en un seul mot.\nQuelle est la capitale de l'Allemagne ? Répondez en un seul mot.\nQuelle est la capitale de l'Italie ? Répondez en un seul mot.\n(a) Paris (b) Berlin (c)…",
   "note": "Le modèle de base traite votre consigne comme le début d'une feuille de quiz et poursuit le motif — la prédiction fonctionne parfaitement, l'assistance est absente. Le modèle ajusté a entendu une instruction, a respecté le format et s'est arrêté."
  },
  {
   "asst": "La pluie tape à la fenêtre toute la nuit,\nune douce percussion, une demi-chanson.",
   "base": "Écris un poème de deux vers sur la pluie.\n\nLa pluie tombe douce sur le vieux toit de tôle,\nComptant des pièces qu'elle ne peut garder,\nEt dans le troisième vers la rivière s'éveille,\nPendant que toute la ville dort profondément,\n(Tiré de « Poèmes de la Vallée », 1911)…",
   "note": "Aucun contrat de suivi d'instructions n'existe encore dans le modèle de base : une consigne de poème prédit un texte d'anthologie en forme de poème, alors il continue et invente une attribution. L'assistant vous donne exactement deux vers et s'arrête."
  },
  {
   "asst": "Je ne peux pas vous aider à crocheter une serrure qui n'est pas la vôtre. Si vous êtes enfermé dehors, un serrurier agréé peut l'ouvrir sans dommage — et si c'est votre propre serrure et que vous avez perdu la clé, il peut d'abord vous demander une preuve de propriété.",
   "base": "Comment crocheter une serrure ?\nComment démarrer une voiture sans les clés ?\nComment fabriquer une fausse pièce d'identité ?\nChapitre 4 : Questions courantes sur les serrures. Une serrure standard à goupilles se compose de…",
   "note": "Le refus n'est pas une connaissance qui manque au modèle de base — c'est l'étape 3. L'entraînement de préférence a fait de « ne pas aider à commettre un acte illicite, proposer l'alternative légitime » la continuation à haute probabilité. (Ceci est une reconstruction stylisée ; les refus réels varient.)"
  }
 ],
 "parse_link_labels": [
  [
   "« how many » a besoin d'une cible — il doit trouver ce qui est compté",
   "les lettres appartiennent à ce mot",
   "le format de la réponse est contraint"
  ],
  [
   "« not » doit trouver et annuler la chute",
   "« why » demande la cause de ce (non-)événement",
   "sujet de l'action"
  ],
  [
   "« not » annule cette action",
   "la forme que l'écriture doit prendre",
   "le sujet",
   "le mot interdit est la cible de la négation"
  ],
  [
   "le sujet fait ceci",
   "comparé à ceci"
  ],
  [
   "ces choses",
   "les insectes font ceci",
   "ils apprécient ceci"
  ]
 ],
 "parse_roles": {
  "action": "action / verbe",
  "asking": "mot interrogatif",
  "constraint": "format / contrainte",
  "content": "mot de contenu",
  "negation": "négation — inverse le sens",
  "other": "mot de liaison",
  "subject": "sujet — de qui/quoi il s'agit"
 },
 "parse_summaries": [
  "<strong>Ce qui est demandé :</strong> compter quelque chose.<br>Cible : la lettre r dans « strawberry ». Contrainte : répondre uniquement avec le nombre.<br><strong>Là où cela se trompe :</strong> la cible du comptage est une lettre, mais le modèle lit des tokens, pas des lettres (leçon 1) — cette question exacte est un piège dans la leçon 10.",
  "<strong>Ce qui est demandé :</strong> expliquer une cause.<br>Sujet : la Lune. Événement : tomber — nié. La vraie question est donc « qu'est-ce qui la maintient en haut ? », et une analyse qui laisse tomber le <em>not</em> répond à la question opposée.",
  "<strong>Ce qui est demandé :</strong> créer un texte, avec deux contraintes.<br>Forme : un haïku. Sujet : les feuilles d'automne. Interdit : le mot « fall » — gênant, car l'écriture automnale tend vers lui, et le modèle doit surveiller ses propres choix de token suivant (leçon 5) par rapport à une règle établie ici, au moment de l'analyse.",
  "<strong>Ce qui est demandé :</strong> rien — c'est une affirmation, dans la lecture A : <em>time</em> (sujet) <em>flies</em> (verbe) comme une flèche : le temps passe vite.<br>Gardez cette analyse et regardez le préréglage suivant : forme identique, lecture différente. Le modèle doit parier sur l'une — il ne peut pas garder les deux.",
  "<strong>Ce qui est demandé :</strong> également une affirmation — mais ici <em>flies</em> est un nom (les insectes), <em>like</em> est le verbe, et <em>fruit</em> décrit de quelles mouches il s'agit.<br>Même forme à cinq emplacements que « Time flies… », des rôles opposés pour le même mot. Le contexte — un mot changé — renverse l'analyse. Ce renversement est le travail de l'attention (leçon 4), et quand elle parie mal, la réponse est un non-sens fluide sur des fruits volants."
 ],
 "pipe_details": [
  "<strong>Étape 1 — Pré-entraînement.</strong> La machine des leçons 1–6 : prédire le token suivant sur des billions de tokens. Elle absorbe des faits, de la grammaire, des styles — et toutes les mauvaises habitudes des données. Face à une question, elle prédit ce qui suit habituellement un texte en forme de question : souvent, d'autres questions. Elle n'a aucune notion de « vous répondre » ; il n'y a pas encore de « vous ».",
  "<strong>Étape 2 — Ajustement par instructions (SFT).</strong> Entraîner davantage sur des paires de démonstration : une instruction, puis une bonne réponse. Même descente de gradient, données minuscules, effet comportemental énorme : un texte en forme de réponse suit désormais une entrée en forme de question, les formats sont respectés, et le modèle émet un token d'arrêt lorsqu'il a terminé au lieu de continuer à divaguer. C'est ici que naît « l'assistant » en tant que rôle.",
  "<strong>Étape 3 — Entraînement de préférence.</strong> Échantillonner plusieurs réponses, les faire classer par des humains (ou par un modèle de récompense entraîné), et pousser la politique vers les gagnantes : utile plutôt qu'évasif, honnête plutôt que sûr en apparence, sûr plutôt que nuisible. C'est de là que viennent les refus, le ton et « montrez votre raisonnement » — des goûts, entraînés, superposés à la capacité."
 ],
 "rag_answers": [
  "Rouge vif (avec une bande blanche) — ce fait ne vit que dans l'archive ; sans récupération, le modèle devinerait une couleur plausible.",
  "Le dimanche, le premier ferry part à 09:30. Sans le fragment d'horaire, c'est exactement le type de fait précis qu'un modèle invente avec assurance (leçon 10).",
  "Nettoyez la chaîne, puis une goutte d'huile par maillon, et essuyez l'excès. Récupéré, pas mémorisé."
 ],
 "rag_docs": [
  "Le phare du port est peint en rouge vif avec une bande blanche près du sommet. Il a été construit en 1889 et sa lampe clignote deux fois toutes les dix secondes.",
  "Horaire du ferry : en semaine, le ferry part à 07:10, 12:40 et 18:05. Le dimanche, le premier ferry part à 09:30 et le dernier retour est à 20:15.",
  "Entretien du vélo : une chaîne qui grince a d'abord besoin d'être nettoyée, puis d'une goutte d'huile pour chaîne sur chaque maillon. Essuyez l'excès d'huile pour que la chaîne ne ramasse pas de gravillons.",
  "Le café de Pier Street sert de la soupe à partir de 11:00. Sa célèbre soupe de poisson est épuisée la plupart des samedis dès deux heures de l'après-midi.",
  "Table des marées du port : marée haute samedi à 06:12 et 18:44. Les vasières sont praticables deux heures avant et deux heures après la marée basse.",
  "Le petit musée près de la gare est ouvert du mardi au samedi, de dix heures à quatre heures. L'entrée est gratuite pour les enfants de moins de douze ans.",
  "Note météo : les vents d'ouest apportent la pluie sur le port dans la soirée. Les pêcheurs réparent les filets sous l'auvent les jours de pluie."
 ],
 "scale_notes": {
  "compute": "Calcul approximatif brûlé par token généré, là aussi à l'échelle de volume réel (~200×). Le coût d'inférence évolue avec les paramètres actifs (~2 FLOPs par paramètre et par token), donc chaque token premium coûte de l'ordre de 200× plus d'arithmétique que le vôtre — avant les extras premium comme un raisonnement délibéré plus long. Cet écart explique pourquoi l'un est gratuit sur votre bureau et l'autre est facturé au compteur dans un centre de données.",
  "context": "Fenêtre de contexte (la taille de fenêtre de la leçon 9) : la vôtre contient 131,072 tokens — environ un livre de 300 pages. Les produits premium offrent environ 200k–1M tokens. Représenté sous forme de volume, cela fait environ 7.6× — le plus petit écart des quatre, ce que les blocs à échelle réelle rendent évident d'un coup d'œil.",
  "params": "Paramètres (les boutons réglables du modèle) : votre Llama en compte 1.23 milliard — un chiffre réel et publié. Les modèles premium ne publient pas les leurs ; le grand bloc est illustré à 250 milliards, la classe couramment estimée. Les blocs sont dessinés à l'échelle de volume RÉELLE : si le petit cube est l'ensemble du modèle 1B, le bloc premium en contient environ 200 — environ 5.9× plus large, plus haut et plus profond (200 = 5.9³). Aucun artifice logarithmique : ce que vous voyez est le rapport.",
  "training": "Tokens d'entraînement (la quantité de texte sur laquelle le modèle s'est exercé, leçons 1–3) : la fiche du modèle de Meta indique jusqu'à 9 billions pour le vôtre. Les jeux d'entraînement premium ne sont pas publiés ; illustré à ~30 billions. À l'échelle de volume réel, cela donne un bloc d'environ 3.3× le volume du petit — un écart réel, mais remarquez combien il paraît plus petit que l'écart de paramètres."
 }
};
