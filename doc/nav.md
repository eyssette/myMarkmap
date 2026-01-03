### Navigation de base

On peut cliquer sur les cercles à l'intersection des différentes branches pour afficher ou masquer la suite.

On peut se déplacer dans la carte mentale en cliquant-glissant avec la souris.

On peut aussi zoomer en utilisant la molette de la souris ou le pincement sur un écran tactile.

### Expansion et repli des branches

On peut définir dans l'en-tête YAML le niveau initial d'expansion des branches avec `initialExpandLevel: n` (n correspond au niveau de profondeur).

On peut aussi choisir de masquer les sous-branches d'un nœud en ajoutant `<!--fold-->` à la fin de la ligne correspondante dans le texte Markdown.

Par défaut, la carte mentale est automatiquement redimensionnée pour s'adapter à la taille de la fenêtre.

On peut désactiver cette fonctionnalité en ajoutant dans l'en-tête YAML la ligne suivante : `automaticResize: false`, ou en appuyant sur la touche `r` du clavier pour activer ou désactiver le redimensionnement automatique.

### Focalisation sur une branche

_Alt+clic_ sur un cercle permet d'afficher seulement les sous-branches de ce cercle.

On peut aussi activer cette fonctionnalité par défaut en ajoutant dans l'en-tête YAML la ligne suivante : `focusOnBranch: true`.

### Masquage du texte d'une branche

On peut cacher le texte d'une branche en cliquant dessus avec _Alt+clic_, ou en utilisant la syntaxe `{{texte masqué}}` dans le Markdown.