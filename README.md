# myMarkmap

Translations :

[![](https://img.shields.io/badge/%F0%9F%87%AC%F0%9F%87%A7_README-EN-A1C)](https://github.com/eyssette/myMarkmap/blob/main/README.en.md)

[myMarkmap](https://mymarkmap.forge.apps.education.fr/) est un outil libre et gratuit qui permet de créer et partager facilement des cartes mentales interactives, à partir d'un texte en Markdown.

[![](https://raw.githubusercontent.com/eyssette/myMarkmap/main/myMarkmap-explications.png)](https://mymarkmap.forge.apps.education.fr/)

## ⚙️ Pourquoi utiliser le markdown ?

L'utilisation du Markdown pour créer des cartes mentales présente plusieurs avantages :
1. **Simplicité :** le Markdown est une syntaxe simple et intuitive qui ne nécessite pas de compétences techniques avancées, on peut rapidement [apprendre les bases](https://docs.forge.apps.education.fr/modeles/tutoriels/tutomd/).
2. **Focalisation sur le contenu :** contrairement aux outils graphiques traditionnels où l'on peut passer du temps à ajuster visuellement les éléments, on écrit ici simplement ses idées et la hiérarchie de la carte mentale se forme naturellement avec les niveaux de titre
3. **Efficacité et rapidité :** si on est à l'aise avec la saisie au clavier, créer une carte mentale en Markdown est beaucoup plus rapide qu'avec une interface graphique traditionnelle, et on peut facilement la modifier, la reconfigurer avec des copier-coller. On peut aussi facilement créer une carte mentale à partir d'un document texte qu'on a déjà à disposition (les IA peuvent d'ailleurs faciliter la conversion).
4. **Format léger et ouvert :** votre carte mentale est simplement du texte, ce qui signifie qu'elle sera très légère, qu'elle restera toujours lisible, sans dépendre d'un logiciel spécifique et que vous pourrez aussi convertir votre carte mentale pour l'utiliser dans d'autres contextes.

## ✨ Fonctionnalités principales

### Éditeur intégré
- Éditez votre carte en cliquant sur ✒️ en haut à gauche (ou avec la touche "e")
- Visualisez uniquement la carte en cliquant sur 👓 (ou avec la touche "Escape")

### Organisation des idées
- Utilisez les titres Markdown pour créer des niveaux
  - `# Titre` (niveau 1)
  - `## Sous-titre` (niveau 2)
- Ou des listes à puces pour organiser votre carte
  - Pour les sous-niveaux, ajoutez deux espaces avant le tiret

### Enregistrement et partage
- Enregistrement au format SVG ou HTML, ou création d'un lien de partage
- Partage possible d'une carte mentale à partir d'un fichier en Markdown sur [CodiMD](codimd.apps.education.fr) ou un autre service, en mettant l'URL de votre fichier dans le `hash` : `https://mymarkmap.forge.apps.education.fr/#URL_DU_FICHIER_MARKDOWN`

### Navigation dans la carte
- Possibilité d'afficher ou de masquer des branches
- Possibilité d'afficher ou de masquer des parties du texte
- Redimensionnement automatique

### Options de configuration plus avancées
- Personnalisation de l'affichage avec des thèmes : `focus`, `nolines`, ou avec des styles CSS
- Contrôle de l'interactivité : focalisation automatique sur la branche actuelle, suppression du redimensionnement …


Pour plus d'informations, voir la [carte mentale affichée par défaut](https://mymarkmap.forge.apps.education.fr/) sur l'application.

## 🙋‍♀️ Contribuer

Si vous souhaitez contribuer ou tout simplement discuter de ce projet pour participer à l'améliorer, merci de lire le fichier [CONTRIBUTING.md](https://forge.apps.education.fr/myMarkmap/myMarkmap.forge.apps.education.fr/-/blob/main/CONTRIBUTING.md?ref_type=heads).


## 👩‍⚖️ Licence

[myMarkmap](https://mymarkmap.forge.apps.education.fr/) est distribué sous licence MIT.

Les sources sont disponibles sur la [Forge des Communs Numériques Éducatifs](https://forge.apps.education.fr/myMarkmap/myMarkmap.forge.apps.education.fr).


## 🙏 Crédits

[myMarkmap](https://mymarkmap.forge.apps.education.fr/) est avant tout fondé sur le logiciel [markmap](https://markmap.js.org/).

Le développement repose sur le framework [SvelteKit](https://svelte.dev/).

D'autres packages sont mobilisés : voir la [liste des dépendances](https://forge.apps.education.fr/myMarkmap/myMarkmap.forge.apps.education.fr/-/blob/main/package.json?ref_type=heads).