### Syntaxe de base

`**texte**` : pour mettre en gras  
`_texte_` : pour mettre en italique  
`==texte==`: Pour surligner  
`++texte++`: Pour souligner


`[lien](URL)` : pour insérer un lien (voir les options plus avancées ci-dessous)  
`![](URL)` : pour insérer une image  
`![h​-25](URL)` : pour spécifier la hauteur de l'image (en pixels)

`code` : Pour insérer du code

`<br>` ou `\\` pour forcer le passage à la ligne  
`<span style="">texte</span>` pour changer le style d'un élément avec du style CSS


### Autres éléments utiles

`{{partie masquée}}` pour masquer une partie d'un texte

`<!--fold-->` en fin de ligne pour que les sous-branches soient cachées par défaut : il faut cliquer sur le cercle pour afficher la suite

`:code_emoji:` : pour insérer un code pour un emoji



### Options pour les liens

Dans l'en-tête YAML de son fichier Markdown, on peut ajouter des options pour les liens :

Pour forcer l'ouverture des liens dans un nouvel onglet, on ajoute la ligne : `openLinksInNewTab: true`  
Pour permettre l'ouverture automatique des liens et empêcher l'affichage du message de confirmation pour quitter la page, on ajoute la ligne : `disableWarningMessage: true`