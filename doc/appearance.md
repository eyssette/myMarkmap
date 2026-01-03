On peut dans l'en-tête YAML de son fichier Markdown configurer l'apparence de sa carte mentale avec différentes options.

### Thèmes et styles

Plusieurs thèmes sont disponibles : `focus`, `nolines`, `black`.
On active un thème avec l'option `theme: nom_du_thème`.

On peut aussi ajouter des styles CSS spécifiques avec l'option `style: code_CSS`, ou en multilignes avec le bloc `style: |` suivi du code CSS indenté à partir de la ligne suivante.

```
style: |
  /* code CSS ici */
```

### Branches

Pour définir le niveau de profondeur des branches affichée au départ, on utilise l'option `initialExpandLevel: n` (n correspond au niveau de profondeur).

Pour que chaque ligne ne dépasse pas une certaine largeur, on ajoute `maxWidth: nombre_de_pixels`
Pour que chaque sous-branche ait la même couleur à partir d'un certain niveau, on utilise `colorFreezeLevel: niveau_de_début_du_gel_des_couleurs`.

Si on veut des lignes droites plutôt que des courbes entre les nœuds, on peut ajouter l'option `curves: false`.