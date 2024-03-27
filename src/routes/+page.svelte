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
	let encodageHash;
	let yamlData;
	let mindmapData;
	let maxWidthFromYAML = 500;
	let style = '';
	let title = 'Mindmap'
	let mindmapFromURL = false;
	let colorFreezeLevel = 0;
	let initialExpandLevel = -1;

	onMount(async () => {
		if ($url) {
			encodageHash = $url.hash.slice(1);
			baseURL.update(n => $url.protocol + '//' + $url.host);
			baseURL.update(n => $baseURL.replace("#", ""));
			if ($baseURL.includes('github') || $baseURL.includes('forge')) {
				baseURL.update(n =>$baseURL + '/myMarkmap');
			}
		}
		if (encodageHash.startsWith('http')) {
			if (encodageHash.startsWith('https://github.com')) {
				encodageHash = encodageHash.replace('https://github.com', 'https://raw.githubusercontent.com');
				encodageHash = encodageHash.replace('/blob/', '/');
			}
			if (encodageHash.startsWith('https://codimd') && encodageHash.indexOf('download')=== -1 ) {
				encodageHash = encodageHash.replace('?edit','').replace('?both','').replace('?view','').replace(/#$/,'')+'/download';
			}
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
		md = md.replace(/## (.*)$/g, '@hash@hash <span style="font-weight:bold; font-size:1em; display:block; padding-bottom:0.3em">$1</span>\n');
		md = md.replace(/## (.*)\n/g, '@hash@hash <span style="font-weight:bold; font-size:1em; display:block; padding-bottom:0.3em">$1</span>\n');
		// Gestion Titre niveau 1
		md = md.replace(/# (.*)$/g, '@hash <span style="font-weight:bold; font-size:1.3em; display:block; padding-bottom:0.6em">$1</span>\n');
		md = md.replace(/# (.*)\n/g, '@hash <span style="font-weight:bold; font-size:1.3em; display:block; padding-bottom:0.6em">$1</span>\n');
		// Gestion Listes à puces
		md = md.replace(/\n\n- /g, '\n\n- <br>');
		md = md.replace(/\n\n\* /g, '\n\n\* <br>');
		// Gestion des lignes qui se terminent par une balise code
		md = md.replace(/`\n/g, '`<span style="display:block; height:0.2em!important"><br></span>\n');
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
		return md;
	}

	$: if ($markdownSource.split("---").length > 2) {
		try {
			yamlData = yaml.load($markdownSource.split("---")[1]);
			maxWidthFromYAML = yamlData.hasOwnProperty('maxWidth') ? yamlData.maxWidth : 500;
			style = yamlData.hasOwnProperty('style') ? yamlData.style : '';
			colorFreezeLevel = yamlData.hasOwnProperty('colorFreezeLevel') ? yamlData.colorFreezeLevel : 0;
			initialExpandLevel = yamlData.hasOwnProperty('initialExpandLevel') ? yamlData.initialExpandLevel : -1;
		} catch (e) {

		}
	}

	$: mindmapSource = replaceMarkdown(emoji.emojify($markdownSource))

</script>


<Menu source={$markdownSource} />

<main>

	<Editor />

	{#if mindmapFromURL}
		<Mindmap source={mindmapSource} maxWidth={maxWidthFromYAML} style={style} title={title} colorFreezeLevel={colorFreezeLevel} initialExpandLevel={initialExpandLevel} />
	{:else}
		<Mindmap source={mindmapSource} maxWidth={maxWidthFromYAML} style={style} title={title} colorFreezeLevel={colorFreezeLevel} initialExpandLevel={initialExpandLevel} />
	{/if}

</main>
