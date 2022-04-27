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

	let value = '# Title\n\n## Subtitle\n### Idea\n### Idea\n\n## Subtitle\n\n- Idea\n- Idea';
	let markdown;
	let mindmap;
	let show = false;
	let w;
	let h;
	let encodageHash;
	let mindmapData;
	let baseURL;
	let urlToShare;
	let textArea;

	onMount(async () => {
		if ($url) {
			encodageHash = $url.hash.slice(1);
			baseURL = $url.protocol + '//' + $url.host;
			baseURL = baseURL.replace("#", "");
		}
		if (encodageHash.startsWith('http')) {
			const response = await fetch(encodageHash);
			mindmapData = await response.text();
			value = mindmapData;
		} else {
			if (encodageHash != '') {
				mindmapData = decodeURI(encodageHash);
				value = mindmapData;
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
		md = md.replace(/\\\\/g, '<br>');
		// Fonction afficher / masquer
		md = md.replace(/{{(.*?)}}/g,'<span class="hide">$1</span>')
		md = md.replace (/class="hide"/g,'class="hide" onclick="event.preventDefault(); this.classList.toggle(\'hide\');"');
		return md;
	}

	$: markdown = replaceMarkdown(emoji.emojify(value))

	afterUpdate(() => {
		const transformer = new Transformer();

		const {
			root,
			features
		} = transformer.transform(markdown);
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
			style: id => 'div{padding-bottom:0.12em!important} a {text-decoration:none} foreignObject {overflow:visible} strong{color:#333; font-size:0.98em} .ml-20{margin-left:-20px} .hide, .hide *{color:transparent!important} .hide {background-color:#FFFFEC}', 
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
			textArea.focus();
		}, 0);
	}

	function menuView() {
		show = false;
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
		encodageHash = encodeURI(value);
		urlToShare = baseURL + '#' + encodageHash
		history.replaceState(null, null, urlToShare);
		navigator.clipboard.writeText(urlToShare);
	}

	function handleKeydown(event) {
		if (!show) {
			if (event.key === 'e') {
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
	
<textarea bind:this={textArea} bind:value={value} rows="20" cols="50" class:hidden={!show}></textarea>
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

textarea {
	font-size: 14px;
	z-index: 1;
	margin-top: 5em;
	margin-left: 1em;
	width: 400px;
	height: 50vh;
	position:absolute;
}

.hidden {
	visibility: hidden;
}

svg {
	z-index: 0;
	position:absolute;
	top:0;
}
</style>