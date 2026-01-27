<script>
	import {
		onMount
	} from 'svelte';
	import emoji from 'node-emoji';
	import url from '../lib/url.js';
	import yaml from 'js-yaml';
	import Menu from '../lib/Menu.svelte';
	import Editor from '../lib/Editor.svelte';
	import Mindmap from '../lib/Mindmap.svelte';
	import {
		markdownSource,
		baseURL
	} from '../lib/stores.js'

	let showMenu = true;
	let encodageHash;
	let yamlData;
	let mindmapData;
	let maxWidthFromYAML = 500;
	let style = '';
	let title = 'Mindmap'
	let mindmapFromURL = false;
	let colorFreezeLevel = 0;
	let initialExpandLevel = -1;
	let openLinksInNewTab = false;
	let disableWarningMessage = false;
	let theme = '';
	let curves = true;
	const corsProxy = "https://corsproxy.io/?url="
	const focusStyle = 'line, path, circle{stroke-width:3} g[data-depth="1"] circle, g[data-depth="2"] circle{r:7} g[data-depth="3"] circle{r:3} circle {r:1} g[data-depth="1"] line, g[data-depth="2"] line, path[data-depth="2"], circle{stroke-width:10} g[data-depth="1"] circle {fill:rgb(31, 119, 180)} g[data-depth="3"] line,  path[data-depth="3"], g[data-depth="2"] circle{stroke-width:6} div{padding-bottom:0.2em!important; padding-top:0.2em; font-family:Arial} g[data-depth="1"] div div{border:2px solid rgb(31, 119, 180);border-radius:5px; padding-left:0.5em; margin-left:-1.3em; padding-top:0.35em;padding-right:0.75em}  g[data-depth="2"] span {background-color:#EEE; padding:0.3em 0.5em; margin-top:-0.35em; margin-left:-1em; border-radius:5px; ;} div{font-family:Arial, sans-serif;} g[data-depth="3"] div{margin-left:-0.25em;} svg div{margin-top:-4px}'
	const nolinesStyle = 'line {stroke:transparent} g[data-depth="1"] line{stroke:#002D62; stroke-width:4} g div div {margin-top:12px;} g[data-depth="1"] div div{border:#002D62 2px solid; margin-left:-1.4em; background-color:white; margin-top:12px; padding:0.5em; text-align:center; border-radius:7px} g[data-depth="1"] span {display:inline!important;} circle{r:4} g[data-depth="1"]:not(.markmap-fold) circle{r:0} path{stroke-width:2.5;} path[data-depth="2"],path[data-depth="2"]{stroke-width:4;}'
	const blackStyle = 'line, path, circle{stroke:black} g[data-depth="1"] line{stroke-width:8} g[data-depth="2"] line, path[data-depth="2"]{stroke-width:4} g[data-depth="3"] line, path[data-depth="3"]{stroke-width:2} circle{r:4} g[data-depth="1"] circle{r:6} circle:not([fill="var(--markmap-circle-open-bg)"]){fill:black; stroke:transparent;}'
	let focusOnBranch = false;
	let automaticResize = true;

	
	// Permet d'éviter d'afficher la mindmap initiale lorsque l'on charge une mindmap depuis une URL
	if($url && $url.hash) {
		markdownSource.update(n => '');
	}
	

	onMount(async () => {
		if ($url) {
			encodageHash = $url.hash.slice(1);
			baseURL.update(n => $url.protocol + '//' + $url.host);
			baseURL.update(n => $baseURL.replace("#", ""));
			if ($baseURL.includes('github') || $baseURL.includes('eyssette.forge')) {
				baseURL.update(n =>$baseURL + '/myMarkmap');
			}
		}
		let addCorsProxy = true;
		if (encodageHash.startsWith('http')) {
			// Gestion des fichiers hébergés sur github
			if (encodageHash.startsWith('https://github.com')) {
				addCorsProxy = false;
				encodageHash = encodageHash.replace('https://github.com', 'https://raw.githubusercontent.com');
				encodageHash = encodageHash.replace('/blob/', '/');
			}
			// gestion des fichiers hébergés sur codiMD / hedgedoc / digipage
			if (encodageHash.startsWith('https://codimd') || encodageHash.startsWith("https://pad.numerique.gouv.fr/") || encodageHash.includes("hedgedoc") || encodageHash.includes("digipage")) {
				addCorsProxy = false;
				encodageHash = encodageHash.replace('?edit','').replace('?both','').replace('?view','').replace(/#$/,'').replace(/\/$/,'');
				encodageHash = encodageHash.indexOf("download") === -1 ? encodageHash + "/download" : encodageHash;
			}
			// gestion des fichiers hébergés sur framapad
			if (encodageHash.includes('framapad') && !encodageHash.endsWith('/export/txt')) {
				addCorsProxy = false;
				encodageHash = encodageHash.replace(/\?.*/,'') + '/export/txt';
			}
			encodageHash = addCorsProxy ? corsProxy + encodageHash : encodageHash;
			const response = await fetch(encodageHash);
			mindmapData = await response.text();
			markdownSource.update(n => mindmapData);
			mindmapFromURL=true;
		} else {
			if (encodageHash != '') {
				mindmapData = decodeURI(encodageHash);
				markdownSource.update(n => mindmapData);
				history.pushState(null, null, $baseURL);	
				mindmapFromURL=true;
			}
		}
	})

	function replaceMarkdown(md) {
		// Gestion du markdown dans les balises codes
		md = md.replace(/`####/g, '`@hash@hash@hash@hash')
		md = md.replace(/`###/g, '`@hash@hash@hash')
		md = md.replace(/`##/g, '`@hash@hash')
		md = md.replace(/`#/g, '`@hash')
		// Gestion Titre niveau 3 et plus
		md = md.replace(/\n\n###### /g, '\n\n@hash@hash@hash@hash@hash@hash <br>');
		md = md.replace(/\n###### /g, '\n\n@hash@hash@hash@hash@hash@hash ');
		md = md.replace(/\n\n##### /g, '\n\n@hash@hash@hash@hash@hash <br>');
		md = md.replace(/\n##### /g, '\n\n@hash@hash@hash@hash@hash ');
		md = md.replace(/\n\n#### /g, '\n\n@hash@hash@hash@hash <br>');
		md = md.replace(/\n#### /g, '\n\n@hash@hash@hash@hash ');
		md = md.replace(/\n\n### /g, '\n\n@hash@hash@hash <br>');
		md = md.replace(/\n### /g, '\n\n@hash@hash@hash ');
		// Gestion Titre niveau 2
		md = md.replace(/## (\\\\+)*(.*)$/g, '@hash@hash $1<span style="font-weight:bold; font-size:1em; display:block; padding-bottom:0.3em">$2</span>\n');
		md = md.replace(/## (\\\\+)*(.*)\n/g, '@hash@hash $1<span style="font-weight:bold; font-size:1em; display:block; padding-bottom:0.3em">$2</span>\n');
		// Gestion Titre niveau 1
		md = md.replace(/# (.*)$/g, '@hash <span style="font-weight:bold; font-size:1.3em; display:block; padding-bottom:0.6em">$1</span>\n');
		md = md.replace(/# (.*)\n/g, '@hash <span style="font-weight:bold; font-size:1.3em; display:block; padding-bottom:0.6em">$1</span>\n');
		// Gestion Listes à puces
		md = md.replace(/\n\n- /g, '\n\n- <br>');
		md = md.replace(/\n\n\* /g, '\n\n\* <br>');
		// Gestion des lignes qui se terminent par une balise code
		md = md.replace(/`\n/g, '`\n<span style="display:block; height:0.2em!important"><br></span>\n');
		// Remplacement de @hash par #
		md = md.replace(/@hash/g, '#');
		// Raccourci \\ pour les sauts de ligne <br>
		md = md.replace(/`\\\\`/g, '`@anti_slash@anti_slash`');
		md = md.replace(/\\\\/g, '<br>');
		md = md.replace(/@anti_slash/g, '\\');
		// Fonction afficher / masquer
		md = md.replace(/`{{/g, '`@accolade_G@accolade_G');
		md = md.replace(/}}`/g, '@accolade_D@accolade_D`');
		md = md.replace(/{{(.*?)}}/g, '<span class="hide">$1</span>');
		md = md.replace(/class="hide"/g, 'class="hide" onclick="event.preventDefault(); this.classList.toggle(\'hide\');"');
		md = md.replace(/@accolade_G/g, '{');
		md = md.replace(/@accolade_D/g, '}');
		// Espaces insécables
		md = md.replace(/ /g, '&nbsp;');
		// Gestion des images : définition possible de la hauteur dans le alt
		md = md.replace(/\!\[h-(.*?)\]\((.*?)\)/g, '<img src="$2" height=$1 />')
		// Gestion de la nouvelle syntaxe pour les Magic comments "fold"
		md = md.replace(/([^`])<!--fold-->(<\/span>)?/g, "$1$2<!-- markmap: fold -->")
		return md;
	}

	$: if ($markdownSource.split("---").length > 2) {
		try {
			yamlData = yaml.load($markdownSource.split("---")[1]);
			style = yamlData.hasOwnProperty('style') ? yamlData.style : '';
			openLinksInNewTab = yamlData.hasOwnProperty('openLinksInNewTab') ? yamlData.openLinksInNewTab : false;
			focusOnBranch = yamlData.hasOwnProperty('focusOnBranch') ? yamlData.focusOnBranch : false;
			automaticResize = yamlData.hasOwnProperty('automaticResize') ? yamlData.automaticResize : true;
			showMenu = yamlData.hasOwnProperty('showMenu')? yamlData.showMenu : true;
			curves = yamlData.hasOwnProperty('curves') ? yamlData.curves : true;
			theme = yamlData.hasOwnProperty('theme') ? yamlData.theme : '';
			disableWarningMessage = yamlData.hasOwnProperty('disableWarningMessage') ? yamlData.disableWarningMessage : false;
			initialExpandLevel = yamlData.hasOwnProperty('initialExpandLevel') ? yamlData.initialExpandLevel : -1;
			if(theme == 'focus' || theme == 'nolines' || theme == 'black') {
				if(theme == 'focus' || theme == 'nolines') {
					maxWidthFromYAML = yamlData.hasOwnProperty('maxWidth') ? yamlData.maxWidth : 250;
					colorFreezeLevel = yamlData.hasOwnProperty('colorFreezeLevel') ? yamlData.colorFreezeLevel : 2;
				}
				if(theme == 'focus') {
					style = focusStyle + ' ' + style;
				}
				if(theme == 'nolines') {
					style = nolinesStyle + ' ' + style;
				}
				if(theme =='black') {
					style = blackStyle + ' ' + style;
					curves = yamlData.hasOwnProperty('curves') ? yamlData.curves : false;
				}
			} else {
				maxWidthFromYAML = yamlData.hasOwnProperty('maxWidth') ? yamlData.maxWidth : 500;
				colorFreezeLevel = yamlData.hasOwnProperty('colorFreezeLevel') ? yamlData.colorFreezeLevel : 100;
				curves = yamlData.hasOwnProperty('curves') ? yamlData.curves : true;
				style = style;
			}
		} catch (e) {

		}
	}

	$: mindmapSource = replaceMarkdown(emoji.emojify($markdownSource))

</script>


<Menu source={$markdownSource} {showMenu} {disableWarningMessage}/>

<main>

	<Editor />

	<Mindmap source={mindmapSource} maxWidth={maxWidthFromYAML} style={style} title={title} colorFreezeLevel={colorFreezeLevel} initialExpandLevel={initialExpandLevel} {openLinksInNewTab} {curves} {focusOnBranch} {automaticResize} />

</main>

<style>
	:global(body) {
		overflow:hidden;
	}
</style>
