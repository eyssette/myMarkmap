<script>
	import { Transformer } from 'markmap-lib';
	import * as markmap from 'markmap-view';
	import {onMount, afterUpdate } from 'svelte';
	import {saveAs} from 'file-saver-es';
	import url from './url.js';


	let value='# Title\n\n## Subtitle\n### Idea\n### Idea\n\n## Subtitle\n\n- Idea\n- Idea';
	//let value="# Les arguments<br>en faveur du<br>format texte\n\n## Un format<br>léger\n- Edition<br>plus rapide\n- Sauvegarde<br>plus rapide\n  - Synchronisation<br>facilitée\n  - Versionnage<br>facilité\n- Sauvegarde <br>plus économe<br> et plus écologique\n- Recherche<br>plus rapide dans<br>ses fichiers\n\n## Un format<br>ouvert\n- <br><br>On peut utiliser <br>n'importe quelle machine\n- On peut utiliser <br>n'importe quel logiciel<br> d'édition de texte\n- On peut collaborer<br>plus facilement<br>sur un même fichier\n\n## Un format<br>polyvalent\n- <br><br>On peut créer des<br>documents texte<br>complexes ...\n  - en Markdown\n    - conversion facile <br>en d'autres formats<br>avec Pandoc\n  - en Latex\n- On peut créer <br>un diaporama\n  - en Markdown\n    - avec Marp\n    - avec Remark\n    - avec Reveal\n- On peut s'organiser<br>facilement\n  - avec de simples<br>listes à puces\n  - avec une syntaxe<br>particulière\n    - todo.txt\n    - org-mode\n- On peut créer<br>des schémas,<br>des graphiques\n  - <br>avec Markmap\n  - avec Graphviz\n  - avec R\n- On peut créer<br>un site web\n  - <br><br>avec un générateur<br>de site statique\n    - Jekyll\n    - mdBook\n    - MkDocs";	
	let markdown;
	let mindmap;
	let show=false;
	let w;
	let h;
	let encodageHash;
	let mindmapData;
	let baseURL;
	
	onMount(async () => {
		if ($url) {
			encodageHash = $url.hash.slice(1);
			baseURL = $url.protocol + '//' + $url.host;
			baseURL = baseURL.replace("#","");
		}
		if (encodageHash.startsWith('http')) {
				const response = await fetch(encodageHash);
				mindmapData = await response.text();
				//mindmapData = encodeURI(data);
				value = mindmapData;
				// mindmapData = mindmapData.replace(/%0A$/,'');
				history.replaceState(null, null, baseURL+'#' + encodageHash);
			} else {
				if (encodageHash!='') {
				mindmapData = decodeURI(encodageHash);
				value = mindmapData;
				}
			}
	}
	)


	function replaceMarkdown(md) {
		md = md.replace(/(?<!#)# (.*)\n/g,'# <span style="font-weight:bold; font-size:1.3em; display:block; padding-bottom:0.6em">$1</span>\n');
		md = md.replace(/(?<!#)## (.*)\n/g,'## <span style="font-weight:bold; font-size:1em; display:block; padding-bottom:0.4em">$1</span>\n');
		md = md.replace(/\n\n- /g, '\n\n- <br>');
		md = md.replace(/\n\n(?<!#)### /g, '\n\n### <br>');
		md = md.replace(/`\n/g, '`<span style="display:block; height:0.2em!important"><br></span>');
		//md = md.replace(/(?<!#)## (.*)\n- /g,'## $1\n- <br>');
		//md = md.replace(/\n- /g,'\n- <br>');
		return md;
	}
	
	$:markdown=replaceMarkdown(value)
	
	afterUpdate(() => {
	const transformer = new Transformer();
	
	const { root, features } = transformer.transform(markdown);
const { styles, scripts } = transformer.getUsedAssets(features);
	const { Markmap, loadCSS, loadJS } = markmap;
		
if (styles) loadCSS(styles);
if (scripts) loadJS(scripts, { getMarkmap: () => markmap });
		
		const options={
  //style: id => 'div{padding-bottom:0.25em!important} g g:last-of-type div{font-weight:bold; font-size:18px} foreignObject{overflow:visible!important; transform:translateX(-1%)} g g:last-of-type rect {transform:scaleX(125%) translateX(-3%)}',
		//style: id => 'div{padding-bottom:0.3em!important} g g:last-of-type div{font-weight:bold;} foreignObject{overflow:visible!important; transform:translateX(-1%)}',
			duration:0,
			style: id => 'div{padding-bottom:0.12em!important}',
		spacingVertical: 8, // 5			
		//spacingHorizontal: 100,
	paddingX:15, // 8
	autoFit: true,
}
		mindmap.innerHTML = "";
	Markmap.create('#markmap', options, root);
	})

	function menuEdit() {
		show=true;
	}
	function menuView() {
		show=false;
	}
	function createSVG(mm) {
		mm = mm.replace(/<br>/g,'<br/>')
		mm = mm.replace(/\n/g,' ')
		//mm = '<svg id="markmap" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="'+mindmap.className['baseVal']+'" style="width:'+w+'px; height: '+h+'px">'+mm+'</svg>'
		mm = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"><svg id="markmap" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="'+mindmap.className['baseVal']+'" style="width:'+w+'px; height: '+h+'px" viewBox="0 0 '+w+' '+h+'">'+mm+'</svg>'
		mm = mm.replace(/translate\(-*\d*\.*\d*,\d*\.*\d*\) scale\(\d*\.*\d*\)/, 'translate(0,482) scale(1)')
		return mm;
	}
	
	function menuSave() {
			const file = new File([createSVG(mindmap.innerHTML)], "mindmap.svg", {type: "text/plain;charset=utf-8"});
	saveAs(file);
	}
	
	function menuShare() {
		encodageHash = encodeURI(value);
		history.replaceState(null, null, baseURL+'#' + encodageHash);
	}

</script>

	<div id="menu">
		{#if show}<a href="view" on:click|preventDefault={menuView}>👓</a>{:else}<a href="edit" on:click|preventDefault={menuEdit}>🖊️</a>{/if}
		<a href="save" on:click|preventDefault={menuSave}>💾</a>
		<a href="#share" on:click|preventDefault={menuShare}>🔗</a>
	</div>
<div>
	
<textarea bind:value={value} rows="20" cols="50" class:hidden={!show}></textarea>
<div bind:clientWidth={w} bind:clientHeight={h}><svg id="markmap" bind:this={mindmap} style="width: 98vw; height: 98vh" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg></div>
</div>

<style>
	div{display:flex}
	#menu {z-index:1;
		margin:1em;
		position:absolute;}
	#menu a{margin-left:1em; text-decoration:none;}
	textarea {
		font-size:14px;
		z-index:1;
		margin-top:4em;
		margin-left:1em;
  		min-width: 20vw!important;
  		height: 50vh;
	}
	.hidden{
		visibility: hidden;
	}
	svg {
		z-index:0;
		margin-left:-20vw;
		
	}
</style>