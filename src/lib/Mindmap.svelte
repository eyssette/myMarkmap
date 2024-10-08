<script>
	import {
		afterUpdate,
		onMount
	} from 'svelte';
	export let source;
	import {
		Transformer
	} from 'markmap-lib';
	import * as markmap from 'markmap-view';
	import {deriveOptions} from 'markmap-view';
	import {
		mindmapSaveAsSvg,
		mindmapSaveAsHtml,
		wValue,
		hValue,
		markdownSource,
		show
	} from './stores.js';
	export let maxWidth;
	export let style;
	export let title;
	export let colorFreezeLevel;
	export let initialExpandLevel;
	export let openLinksInNewTab;
	export let curves;

	let mindmap;
	let w;
	let h;
	let widthBlockquote;
	let marginLeftBlockquote='';
	let nodeTitle;
	let description;
	$: description = $markdownSource;
	let automaticResize = true;

	onMount(() => {
		const isMobile =
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
		);
		automaticResize = isMobile ? false : true;
	})
	let mm;

	$: if (maxWidth<250) {
		widthBlockquote = maxWidth;
		marginLeftBlockquote='margin-left:-10px;';
	} else {
		widthBlockquote= 250;
		marginLeftBlockquote='';
	}
	let mindmapRoot;

	$: wValue.update(n => w)
	$: hValue.update(n => h)

	// Fonction debounce pour gérer l'update de la carte avec un délai
	// fonction utilisée pour changer les lignes en courbe après affichage
	// et afin d'éviter un clignotement à chaque touche appuyée
	function debounce(func, wait) {
		let timeout;
		return function(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	function curvesToLines() {
		if(mindmap && !curves) {
			const paths = mindmap.querySelectorAll('path');
			paths.forEach(path => {
				const d = path.getAttribute('d');
				if (d && d.includes('C')) {
					const newD = d.replace('C','L')
					path.setAttribute('d', newD);
				}
			});
		}
	}
	const debouncedCurvesToLines = debounce(curvesToLines, 500);

	afterUpdate(() => {
		const transformer = new Transformer();

		const {
			root,
			features
		} = transformer.transform(source);
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
			maxWidth: maxWidth,
			spacingVertical: 15,
			paddingX: 20,
			autoFit: false,
			initialExpandLevel: initialExpandLevel,
		}
		const optionsJSON = deriveOptions({
			color: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#8c564b", "#e377c2", "#17becf", "#bcbd22"],
			colorFreezeLevel: colorFreezeLevel,
		})
		const optionsFull = colorFreezeLevel > 0 ? {...options, ...optionsJSON} : options
		mindmap.innerHTML = "";
		mindmapRoot = root;
		nodeTitle = document.createElement("title")
		nodeTitle.innerHTML=title;
		mindmap.appendChild(nodeTitle);
		const styleCSS = 'svg div{margin-top:-4px;} svg a {text-decoration:none} svg foreignObject {overflow:visible;} svg strong{color:#333; font-size:0.95em!important; font-weight:600!important;} svg .hide, svg .hide *{color:transparent!important} svg .hide {background-color:#FFFFEC} svg .hide img {opacity:0} svg img[alt=h-25]{height:25px} svg img[alt=h-50]{height:50px} svg img[alt=h-75]{height:75px} svg img[alt=h-100]{height:100px} svg img[alt=h-125]{height:125px} svg img[alt=h-150]{height:150px} svg img[alt=h-175]{height:175px} svg img[alt=h-200]{height:200px} svg blockquote {width:'+widthBlockquote+'px!important; white-space: normal; text-align:justify; font-size:0.8em; line-height:1em; border:1px solid #aaa; padding:10px; border-radius:4px;'+marginLeftBlockquote+'} svg aside{font-size: 0.8em; display: inline-block!important; font-weight:normal;vertical-align: top} svg cite {font-style:inherit; font-family:serif; font-size:0.97em}'+ style;
		const styleElement = document.createElement("style")
		styleElement.innerHTML=styleCSS;
		mindmap.appendChild(styleElement);

		mm=Markmap.create('#markmap', optionsFull, root);


		if (curves === false) {
			debouncedCurvesToLines();
			document.body.addEventListener("keyup", debouncedCurvesToLines);
		}

		if(openLinksInNewTab) { 
			const links = mindmap.querySelectorAll('a');
			links.forEach(link => {
				link.setAttribute('target', '_blank');
			});
		}

		

	})

	function handleHide(event) {
			let targetElement = event.target
			const elementType = targetElement.tagName
			let searchDivCount = 0;
			if (elementType == 'SVG') {
				return
			} else {
				if(elementType =='circle') {
					// On gère à nouveau la conversion en lignes droites si besoin
					if (curves === false) {
						debouncedCurvesToLines();
					}
				}
				if (elementType =='circle' && event.altKey) {
					const parentElement = targetElement.parentElement
					const depth = parentElement.getAttribute('data-depth');
					const unfoldedBranches = mindmap.querySelectorAll('g[data-depth="'+depth+'"]:not(.markmap-fold)')
					for (const branch of unfoldedBranches) {
						const circle = branch.querySelector('circle');
						if (circle) {circle.dispatchEvent(new MouseEvent("click"));}
					}
						targetElement.dispatchEvent(new MouseEvent("click"));
					return
				}
				while (targetElement && targetElement.tagName !== 'DIV' && searchDivCount < 5) {
					targetElement = targetElement.parentElement;
					searchDivCount++;
				}
			}
			if (targetElement.tagName == 'DIV') {
				if (event.altKey) {
					targetElement.classList.toggle('hide'); }
				else {
					targetElement.classList.remove('hide');
				}
			}
			if(automaticResize) {
				mm.fit();
			}
	}

	function getBBox(element) {
		const {x, y, width, height} = element.getBBox();
		return {x: x, y: y, w: width, h: height};
	}


	function createSVG(mm) {
		const boundingBox = getBBox(mindmap)
		mm = mm.replace(/<br>/g, '<br/>')
		mm = mm.replace(/\n/g, ' ')
		mm = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"><svg id="markmap" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="' + mindmap.className['baseVal'] + '" style="width:100%; height:100%;" viewBox="' + boundingBox.x + ' ' + (boundingBox.y-5) + ' ' + (boundingBox.w) + ' ' + (boundingBox.h+30) + '">'+'<use xlink:href=""><title>'+title+'</title></use>'+'<desc>'+description.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&lt;')+'</desc>'+ mm.replace(/<title>.*<\/title>/,'') + '</svg>'
		return mm;
	}

	function mindMapSaveAsSvgCreateFile() {
		const file = new File([createSVG(mindmap.innerHTML)], "mindmap.svg", {
			type: "text/plain;charset=utf-8"
		});
		saveAs(file);
	}

	function mindMapSaveAsHtmlCreateFile() {
		const root = JSON.stringify(mindmapRoot);
		let templateHtml ='<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>'+title+'</title><style>*{margin:0; padding:0}#markmap{display:block; width:100vw; height:100vh}</style></head><body><svg id="markmap"><use xlink:href=""><title>'+title+'</title></use><desc>'+description.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&lt;')+'</desc></svg><script src="https://cdn.jsdelivr.net/npm/d3"><\/script><script src="https://cdn.jsdelivr.net/npm/markmap-view"><\/script><script>const root='+root+'; const{Markmap, loadCSS, loadJS}=window.markmap; const maxWidth='+maxWidth+'; const styles="div{padding-bottom:0.12em!important} a {text-decoration:none} foreignObject {overflow:visible} strong{color:#333; font-size:0.95em!important; font-weight:600!important;} .hide, .hide *{color:transparent!important} .hide {background-color:#FFFFEC} .hide img {opacity:0} img[alt=h-25]{height:25px} img[alt=h-50]{height:50px} img[alt=h-75]{height:75px} img[alt=h-100]{height:100px} img[alt=h-125]{height:125px} img[alt=h-150]{height:150px} img[alt=h-175]{height:175px} img[alt=h-200]{height:200px} blockquote {width:'+widthBlockquote+'px!important;  white-space: normal;  text-align:justify;  font-size:0.8em;  line-height:1em;  border:1px solid #aaa;  padding:10px;  border-radius:4px; '+marginLeftBlockquote+'} aside{font-size: 0.8em;  display: inline-block!important;  font-weight:normal; vertical-align: top} cite {font-style:inherit;  font-family:serif;  font-size:0.97em}'+style.replaceAll('"','\\"')+'"; const options={duration:0, style:id=>styles, maxWidth:maxWidth, spacingVertical:8, paddingX:15, autoFit:true}; Markmap.create("#markmap", options, root); <\/script></body></html>';
		const file = new File([templateHtml], "mindmap.html", {
			type: "text/plain;charset=utf-8"
		});
		saveAs(file);
	}

	$: if ($mindmapSaveAsSvg) {
		mindMapSaveAsSvgCreateFile();
		mindmapSaveAsSvg.update(n => false)
	}

	$: if ($mindmapSaveAsHtml) {
		mindMapSaveAsHtmlCreateFile();
		mindmapSaveAsHtml.update(n => false)
	}

	function handleKeydown(event) {
		if (!$show && event.key === 'r') {
			automaticResize = automaticResize ? false : true;
			if(automaticResize) {
				mm.fit();
			}
		}
	}

</script>

<svelte:window on:keydown={handleKeydown} />

<div bind:clientWidth={w} bind:clientHeight={h} style="width:98vw; height:98vh">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<svg id="markmap" bind:this={mindmap} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
		style="width:100%; height:100%" on:click={handleHide}>
	</svg>
</div>
<style>

	svg {
		z-index: 0;
		position: absolute;
		top: 0;
	}

	@media print {
		:global(nav) {
			display: none;
		}

		:global(main) {
			width: 31.7cm;
			height: 20cm;
		}

		:global(main svg) {
			overflow: visible;
			zoom: 55% !important;
		}

	}

</style>