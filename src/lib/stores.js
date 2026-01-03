import {
	writable
} from 'svelte/store';

export const show = writable(false);
export const defaultTemplate = `---
maxWidth: 300
---

# Titre
`;

export const markdownSource = writable(decodeURI(`---
theme: nolines
---

# myMarkmap

## Un outil libre \\\\  et gratuit

### [Sources](https://forge.apps.education.fr/myMarkmap/myMarkmap.forge.apps.education.fr) sur la Forge des\\\\Communs Numériques Éducatifs
### _Auteur_ : [Cédric Eyssette](https://eyssette.forge.apps.education.fr/)
### Créé à partir du \\\\  logiciel [markmap](https://markmap.js.org/)

## Pour faire des \\\\  cartes mentales
- en Markdown
- de manière \\\\ simple et rapide


## Cliquez sur ❓dans le menu \\\\ pour voir le tutoriel
`));
export const baseURL = writable('');
export const mindmapSaveAsSvg = writable(false);
export const mindmapSaveAsHtml = writable(false);
export const wValue = writable();
export const hValue = writable();
