import {
	writable
} from 'svelte/store';

export const show = writable(false);
export const markdownSource = writable(decodeURI(`---
maxWidth: 600
---

# myMarkmap

## Un outil libre \\\\  et gratuit

### [Sources](https://forge.apps.education.fr/myMarkmap/myMarkmap.forge.apps.education.fr) sur la Forge des\\\\Communs Numériques Éducatifs
### _Auteur_ : [Cédric Eyssette](https://eyssette.forge.apps.education.fr/)
### Créé à partir du \\\\  logiciel [markmap](https://markmap.js.org/)

## Pour faire des \\\\  cartes mentales

- Clic sur ✒️ en haut à gauche pour **éditer** \\\\ sa carte mentale (_raccourci clavier : \`e\`_) \\\\ On utilise le **Markdown** pour créer des branches
  - \`# Titre\`  pour le niveau 1
  - \`## Sous-titre\`  pour le niveau 2
  - \`### Niveau 3\`,  \`#### Niveau 4\` …
  - Ou bien, on fait une liste à puces \\\\ \`- Niveau 3\` \\\\ 　\`  - Niveau 4\` \\\\ \`- Niveau 3\` \\\\ (on ajoute 2 espaces avant  \\\\ pour  passer à un autre niveau)
- Clic sur 👓   pour **cacher** la fenêtre d'édition \\\\et **voir** seulement la carte mentale \\\\ (_raccourci clavier : \`Escape\`_)
- **Enregistrer** et \\\\**partager** sa \\\\carte mentale
  - Clic sur 💾 pour **enregistrer**  la carte au format _svg_ \\\\[image fixe]  (_raccourci clavier : \`s\`_)
  - Clic sur 🌐 pour **enregistrer** au format HTML \\\\[interactivité possible] (_raccourci clavier : \`h\`_)
  - Clic sur 🔗 pour copier un **lien** de **partage** \\\\de la carte mentale (_raccourci clavier : \`l\`_)
    - Ajouter \`?m=0\` dans l'URL pour cacher le menu
  - Il est recommandé d'enregistrer le texte \\\\de sa carte mentale quelque part pour \\\\pouvoir modifier plus tard sa carte mentale
    - On peut mettre son texte \\\\ **sur une forge** ou sur [CodiMD](https://codimd.apps.education.fr)  \\\\ et l'afficher avec myMarkmap <!--fold-->
      - \\\\ \`https://mymarkmap.vercel.app/#URL\`
      - En cas de problème : \\\\ \`https://mymarkmap.vercel.app/#https://corsproxy.io/%3FURL\`
      - Sur une instance Gitlab, il faut utiliser un fichier \`.gitlab-ci.yml\` pour publier le fichier md sur une page publique et utiliser cette adresse comme URL

## Comment naviguer \\\\dans la carte ?
- \\\\\\\\Clic sur les **cercles** à l'intersection \\\\ des différentes branches pour \\\\ **afficher ou masquer la suite**
  - \\\\**Alt+clic** sur un cercle pour afficher \\\\\ seulement la branche en question
- **Autres raccourcis**
  - **Alt+clic** sur le texte d'une branche pour la masquer
  - \`m\` pour masquer ou réafficher la barre de menu
  - \`r\` pour désactiver ou réactiver le redimensionnement automatique

## Usages plus \\\\  avancés  <!--fold-->

### Des balises pour \\\\ **contrôler l'affichage** \\\\ de la carte

#### **Markdown**  <!--fold-->

- \`**texte**\` : pour mettre en **gras**
- \`_texte_\` : pour mettre en _italiques_
- \`[lien](URL)\` : pour insérer un [lien](https://eyssette.forge.apps.education.fr/)
- \`![](URL)\` : pour insérer une image
	- \`![h​-25](URL)\` : pour spécifier \\\\la hauteur de l'image (en pixels)
- \`\`\` \`code\` \`\`\` : Pour insérer du \`code\` 
- \`==texte==\`: Pour surligner du ==texte==
- \`++texte++\`: Pour souligner du ++texte++

#### **HTML** <!--fold-->

- \`<br>\` ou \`\\\\\` pour forcer le passage à la ligne
- \`<span style="...">texte</span>\` \\\\ pour changer le style d'un élément
  
#### **Autres \\\\ balises** <!--fold-->

- \`<!--fold-->\` en fin de ligne pour que les \\\\ sous-branches soient cachées par défaut : \\\\ il faut cliquer sur le cercle pour afficher la suite<!-- fold-->
    - Cette branche est cachée par défaut !
    - Cette branche aussi !
- \`:code_emoji:\` : pour insérer un code pour un emoji [:link:](https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json)
- \`{{partie masquée}}\` pour masquer une partie \\\\ d'un texte :  voici par exemple un {{passage}} masqué \\\\ (cliquer dessus pour afficher / masquer à nouveau)

### Un **en-tête** (YAML) \\\\ pour des options de \\\\configuration plus avancées <!--fold-->

- Pour spécifier la largeur \\\\ maximale d'une branche
	- \`\`\`maxWidth: 300\`\`\`
- Pour empêcher le changement de \\\\couleur des sous-branches à partir \\\\d'un certain niveau
	- \`\`\`colorFreezeLevel: 2\`\`\`  \\\\ (pour que chaque branche \\\\ait sa propre couleur)
- Pour ajouter des styles \\\\CSS spécifiques
	- \`\`\`style: strong{color:red}\`\`\`
- Pour ajouter un \\\\thème spécifique
	- \`\`\`theme: focus\`\`\`
  - Thèmes disponibles : \\\\ \`focus\` et \`nolines\`
- Pour ajouter un titre
	- \`\`\`title: Mon titre\`\`\`
- Pour masquer par défaut \\\\les sous-branches à partir\\\\ d'un certain niveau
	- \`\`\`initialExpandLevel: 1\`\`\`
- Pour forcer l'ouverture des \\\\liens dans un nouvel onglet
  - \`\`\`openLinksInNewTab: true\`\`\`
`));
export const baseURL = writable('');
export const mindmapSaveAsSvg = writable(false);
export const mindmapSaveAsHtml = writable(false);
export const wValue = writable();
export const hValue = writable();
