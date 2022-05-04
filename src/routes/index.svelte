<script context="module">

    import hljs from "highlight.js/lib/core";
    import markdown from "highlight.js/lib/languages/markdown";
	import xml from "highlight.js/lib/languages/xml";
	import 'highlight.js/styles/github.css';

    hljs.registerLanguage("markdown", markdown);
	hljs.registerLanguage("xml", xml);

    // `highlight` takes the input code and returns the highlighted HTML markup
    const highlight = (code, syntax) =>
        hljs.highlight(code, {
            language: syntax,
        }).value.replace(/\\\\/g,'<span class="language-xml"><span class="hljs-tag">\\\\</span></span>').replace(/&lt;!--fold--&gt;/g,'<span class="language-xml"><span class="hljs-tag">&lt;!--fold--&gt;</span></span>');
</script>


<script>
	import {
		Transformer
	} from 'markmap-lib';
	import * as markmap from 'markmap-view';
	import {
		onMount,
		afterUpdate
	} from 'svelte';
	import {
		saveAs
	} from 'file-saver-es';
	import url from './url.js';
	import emoji from 'node-emoji';
	import yaml from 'js-yaml';
	let yamlData;
	let maxWidthFromYAML = 500;

	let CodeJar;

	let markdownSource = decodeURI("#%20myMarkmap%0A%0A##%20Un%20outil%20libre%20%5C%5C%20%20et%20gratuit%0A%0A###%20<span%20class=\"ml-2\">%5BSources%5D(https://github.com/eyssette/myMarkmap/)%20sur%20Github</span>%0A###%20_Auteur_%20:%20%5BCédric%20Eyssette%5D(https://eyssette.github.io/)%0A###%20Créé%20à%20partir%20du%20%5C%5C%20%20logiciel%20%5Bmarkmap%5D(https://markmap.js.org/)%0A%0A##%20Pour%20faire%20des%20%5C%5C%20%20cartes%20mentales%0A%0A-%20Clic%20sur%20🖊%EF%B8%8F%20(en%20haut%20à%20gauche)%20%5C%5C%20pour%20**éditer**%20sa%20carte%20mentale.%20%20%5C%5C%20On%20utilise%20la%20syntaxe%20**Markdown**%20%5C%5C%20pour%20créer%20des%20branches%0A%20%20-%20%60#%20Titre%60%20%20%5C%5C%20pour%20le%20niveau%201%0A%20%20-%20%60##%20Sous-titre%60%20%5C%5C%20%20pour%20le%20niveau%202%0A%20%20-%20%60###%20Niveau%203%60,%20%5C%5C%20%20%60####%20Niveau%204%60%20%5C%5C%20…%20ensuite%0A%20%20-%20Ou%20bien,%20on%20fait%20une%20liste%20à%20puces%20%5C%5C%20%60-%20Niveau%203%60%20%5C%5C%20%E3%80%80%60%20%20-%20Niveau%204%60%20%5C%5C%20%60-%20Niveau%203%60%20%5C%5C%20(on%20ajoute%202%20espaces%20avant%20%20%5C%5C%20pour%20%20passer%20à%20un%20autre%20niveau)%0A-%20Clic%20sur%20👓%20pour%20**cacher**%20la%20%5C%5C%20%20fenêtre%20d'édition%20et%20**voir**%20%20%5C%5C%20seulement%20la%20carte%20mentale%0A-%20Clic%20sur%20💾%20pour%20**enregistrer**%20%20%5C%5C%20la%20carte%20au%20format%20_svg_%0A-%20Clic%20sur%20🔗%20pour%20copier%20un%20**lien**%20%5C%5C%20%20de%20**partage**%20de%20la%20carte%20mentale%20%5C%5C%20dans%20le%20presse-papier%0A-%20Clic%20sur%20les%20**cercles**%20à%20l'intersection%20%5C%5C%20des%20différentes%20branches%20pour%20%5C%5C%20**afficher%20ou%20masquer%20la%20suite**%0A%0A##%20Usages%20plus%20%5C%5C%20%20avancés<!--fold-->%0A%0A-%20On%20peut%20utiliser%20d'autres%20%5C%5C%20%20**balises%20markdown**%0A%20%20-%20%60**texte**%60%20:%20pour%20mettre%20en%20**gras**%0A%20%20-%20%60_texte_%60%20:%20pour%20mettre%20en%20_italiques_%0A%20%20-%20%60%5Blien%5D(URL)%60%20:%20pour%20insérer%20un%20%5Blien%5D(https://eyssette.github.io/)%0A%20%20-%20%60!%5B%5D(URL)%60%20:%20pour%20insérer%20une%20image%0A%20%20-%20%60%60%60%20%60code%60%20%60%60%60%20:%20Pour%20insérer%20du%20%60code%60%20%0A-%20On%20peut%20utiliser%20certaines%20**balises%20HTML**%20%5C%5C%20pour%20contrôler%20plus%20précisément%20%5C%5C%20l'affichage%20de%20sa%20carte%20mentale%0A%20%20-%20%60%20%5C%5C%20%60%20pour%20forcer%20le%20passage%20à%20la%20ligne%0A%20%20-%20%60<!--fold-->%60%20pour%20que%20les%20sous-branches%20%5C%5C%20soient%20cachées%20par%20défaut%20:%20il%20faut%20cliquer%20%5C%5C%20sur%20le%20cercle%20pour%20afficher%20la%20suite<!--%20fold-->%0A%20%20%20%20-%20Cette%20branche%20est%20cachée%20par%20défaut%20!%0A%20%20%20%20-%20Cette%20branche%20aussi%20!%0A%20%20-%20%60<span%20style=\"...\">texte</span>%60%20%5C%5C%20pour%20changer%20le%20style%20d'un%20élément%0A-%20On%20peut%20utiliser%20%5C%5C%20**d'autres%20balises**%0A%20%20-%20Des%20codes%20pour%20les%20emojis%20:+1:%0A%20%20-%20%60%5C%5C%60%20pour%20le%20passage%20à%20la%20ligne%0A%20%20-%20%60%7B%7Bpartie%20masquée%7D%7D%60%20pour%20masquer%20une%20partie%20d'un%20texte%0A%20%20-%20%60!%5Bh-25%5D(URL)%60%20:%20pour%20spécifier%20la%20hauteur%20%20%5C%5Cde%20l'image%20(de%20h-25,%20h-50%20…%20à%20h-200)%0A-%20**Raccourcis**%20clavier%0A%20%20-%20%60e%60%20pour%20ouvrir%20la%20fenêtre%20d'édition%0A%20%20-%20%60Escape%60%20pour%20la%20fermer%0A%20%20-%20%60s%60%20pour%20sauvegarder%20la%20carte%20au%20format%20_svg_%0A%20%20-%20%60l%60%20pour%20copier%20le%20lien%20vers%20la%20carte%0A-%20On%20peut%20mettre%20son%20texte%20**sur%20une%20forge**%20%5C%5C%20%20et%20l'afficher%20avec%20myMarkmap%20ainsi%20:%0A%60https://mymarkmap.vercel.app/#URL%60%0A");
	let mindmapSource;
	let mindmap;
	let show = false;
	let hidden;
	$: show ? hidden = "" : hidden = "hidden";
	let w;
	let h;
	let encodageHash;
	let mindmapData;
	let baseURL;
	let urlToShare;
	let textArea;


	$: if (markdownSource.split("---").length == 3){
		try {
		yamlData = yaml.load(markdownSource.split("---")[1]);
		for (const property in yamlData) {
			if (property=='maxWidth') {maxWidthFromYAML = yamlData[property]}
		}
		} catch(e) {
			
		}
	}

	onMount(async () => {
		({CodeJar} = await import("@novacbn/svelte-codejar"))
		if ($url) {
			encodageHash = $url.hash.slice(1);
			baseURL = $url.protocol + '//' + $url.host;
			baseURL = baseURL.replace("#", "");
		}
		if (encodageHash.startsWith('http')) {
			const response = await fetch(encodageHash);
			mindmapData = await response.text();
			markdownSource = mindmapData;
		} else {
			if (encodageHash != '') {
				mindmapData = decodeURI(encodageHash);
				markdownSource = mindmapData;
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
		md = md.replace(/## (.*)$/g, '@hash@hash <span style="font-weight:bold; font-size:1em; display:block; padding-bottom:0.4em">$1</span>\n');
		md = md.replace(/## (.*)\n/g, '@hash@hash <span style="font-weight:bold; font-size:1em; display:block; padding-bottom:0.4em">$1</span>\n');
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
		md = md.replace(/`\\\\`/g,'`@anti_slash@anti_slash`');
		md = md.replace(/\\\\/g, '<br>');
		md = md.replace(/@anti_slash/g,'\\');
		// Fonction afficher / masquer
		md = md.replace(/`{{/g,'`@accolade_G@accolade_G');
		md = md.replace(/}}`/g,'@accolade_D@accolade_D`');
		md = md.replace(/{{(.*?)}}/g,'<span class="hide">$1</span>');
		md = md.replace (/class="hide"/g,'class="hide" onclick="event.preventDefault(); this.classList.toggle(\'hide\');"');
		md = md.replace(/@accolade_G/g,'{');
		md = md.replace(/@accolade_D/g,'}');
		return md;
	}

	$: mindmapSource = replaceMarkdown(emoji.emojify(markdownSource))

	afterUpdate(() => {
		const transformer = new Transformer();

		const {
			root,
			features
		} = transformer.transform(mindmapSource);
		const {
			styles,
			scripts
		} = transformer.getUsedAssets(features);
		const {
			Markmap,
			loadCSS,
			loadJS
		} = markmap;

		if (styles) loadCSS(styles);
		if (scripts) loadJS(scripts, {
			getMarkmap: () => markmap
		});

		const options = {
			duration: 0,
			style: id => 'div{padding-bottom:0.12em!important} a {text-decoration:none} foreignObject {overflow:visible} strong{color:#333; font-size:0.98em} .ml-20{margin-left:-20px} .hide, .hide *{color:transparent!important} .hide {background-color:#FFFFEC} .hide img {opacity:0} img[alt=h-25]{height:25px} img[alt=h-50]{height:50px} img[alt=h-75]{height:75px} img[alt=h-100]{height:100px} img[alt=h-125]{height:125px} img[alt=h-150]{height:150px} img[alt=h-175]{height:175px} img[alt=h-200]{height:200px} blockquote {width:250px!important; white-space: normal; text-align:justify; font-size:0.8em; line-height:1em; border:1px solid #aaa; padding:10px; border-radius:4px}', 
			maxWidth: maxWidthFromYAML,
			// Quelques classes supplémentaires :
			// .ml-20 pour raccourcir une branche quand le texte est court
			// .hide pour masquer (afficher avec un clic)
			spacingVertical: 8, // 5			
			//spacingHorizontal: 100,
			paddingX: 15, // 8
			autoFit: true,
		}
		mindmap.innerHTML = "";
		Markmap.create('#markmap', options, root);
	})

	function menuEdit() {
		show = true;
		setTimeout(function() {
			textArea.firstChild.focus();
		}, 0);
	}

	function menuView() {
		show = false;
		textArea.focus();
	}

	function createSVG(mm) {
		mm = mm.replace(/<br>/g, '<br/>')
		mm = mm.replace(/\n/g, ' ')
		mm = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"><svg id="markmap" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="' + mindmap.className['baseVal'] + '" style="width:100%; height:100%;" viewBox="0 0 ' + w + ' ' + h + '">' + mm + '</svg>'
		return mm;
	}

	function menuSave() {
		const file = new File([createSVG(mindmap.innerHTML)], "mindmap.svg", {
			type: "text/plain;charset=utf-8"
		});
		saveAs(file);
	}

	function menuShare() {
		encodageHash = encodeURI(markdownSource);
		urlToShare = baseURL + '/#' + encodageHash
		history.replaceState(null, null, urlToShare);
		navigator.clipboard.writeText(urlToShare);
	}

	function handleKeydown(event) {
		if (!show) {
			if (event.key === 'e') {
				event.preventDefault();
				menuEdit();
			}
			if (event.key === 's') {
				menuSave();
			}
			if (event.key === 'l') {
				menuShare();
			}
		} else {
			if (event.key === 'Escape') {
				menuView();
			}
		}
	}

</script>

<svelte:window on:keydown={handleKeydown}/>

<div id="menu">
	{#if show}<a href="view" on:click|preventDefault={menuView}>👓</a>{:else}<a href="edit" on:click|preventDefault={menuEdit}>🖊️</a>{/if}
		<a href="save" on:click|preventDefault={menuSave}>💾</a>
		<a href="#share" on:click|preventDefault={menuShare}>🔗</a>
		<a href="{baseURL}#https://raw.githubusercontent.com/eyssette/mindmap/main/mindmap-default-mymarkmap.md" target="_blank">❓</a>
	</div>
<div>
	
<div bind:this={textArea}>
{#if CodeJar}
<svelte:component this={CodeJar} class="hljs editor {hidden}" syntax="markdown" {highlight} bind:value={markdownSource}/>
{:else}
<textarea bind:value={markdownSource} rows="20" cols="50" class:hidden={!show}></textarea>
{/if}
</div>

<div bind:clientWidth={w} bind:clientHeight={h} style="width:98vw; height:98vh"><svg id="markmap" bind:this={mindmap}  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="width:100%; height:100%"></svg></div>
</div>

<style>
#menu {
	z-index: 1;
	margin: 1em;
	position: absolute;
	font-size: 1.4em
}

#menu a {
	margin-left: 1em;
	text-decoration: none;
}

:global(.hidden) {
	visibility: hidden;
}

textarea, :global(.editor) {
	font-size: 14px;
	z-index: 1;
	margin-top: 5em;
	margin-left: 1em;
	width: 420px;
	height: 50vh;
	position:absolute;
}

:global(.editor) {
	border:1px solid rgba(0, 0, 0, 0.2);
	resize:both;
}

:global(.editor) {
    border-radius: 6px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
    font-family: 'Lucida Grande', 'Arial', 'Source Code Pro', monospace;
    font-size: 14px;
    letter-spacing: normal;
    line-height: 20px;
    padding: 10px;
    tab-size: 2;
}

:global(.language-xml *) {
	color:green!important;
	font-weight: 300!important;
}

:global(.hljs-strong) {
	font-size:0.95em
}

:global(.hljs-code) {
	color:#555;
}

:global(.hljs-link), :global(.hljs-string) {
	color:#032f62;
	font-style: italic;
	font-size:0.98em;
}

:global(.hljs-bullet) {
	color:#990000;
	font-weight:700!important;
}

:global(.hljs-emphasis) {
	color:inherit;
}

svg {
	z-index: 0;
	position:absolute;
	top:0;
}
</style>