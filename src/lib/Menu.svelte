<script>
	import {
		show,
		baseURL,
		mindmapSaveAsSvg,
		mindmapSaveAsHtml,
		markdownSource,
		defaultTemplate,
	} from './stores.js'
	export let source;
	export let disableWarningMessage;
	import url from './url.js';
	
	import { fade, fly } from 'svelte/transition';
	import {
		saveAs
	} from 'file-saver-es';
	import HelpModal from './HelpModal.svelte';

	export let showMenu;

	const disableMenu = !showMenu; 

	let urlToShare;
	let encodageHash;
	let menu;

	function menuEdit() {
		showNotification = false;
		show.update(n => true);
	}

	function menuView() {
		show.update(n => false);
	}

	function menuSaveAsSvg() {
		mindmapSaveAsSvg.update(n => true)
	}

	function menuSaveAsHtml() {
		mindmapSaveAsHtml.update(n => true)
	}

	function menuHide() {
		showMenu = showMenu ? false : true;
	}
	if($url && $url.searchParams && $url.searchParams.get('m')==0) {
		showMenu = false;
	}

	function menuShare() {
		toastNotification();
		encodageHash = encodeURI(source);
		urlToShare = $baseURL + '/#' + encodageHash
		navigator.clipboard.writeText(urlToShare);
	}

	function menuReset() {
		markdownSource.update(content => defaultTemplate)
	}

	function handleKeydown(event) {
		if (!$show) {
			if (event.key === 'e') {
				event.preventDefault();
				menu.style.display = 'block';
				menuEdit();
			}
			if (event.key === 's') {
				menu.style.display = 'block';
				menuSaveAsSvg();
			}
			if (event.key === 'h') {
				menu.style.display = 'block';
				menuSaveAsHtml();
			}
			if (event.key === 'l') {
				menu.style.display = 'block';
				menuShare();
			}
			if (event.key == 'm') {
				menuHide();
			}
		} else {
			if (event.key === 'Escape') {
				menu.style.display = 'block';
				menuView();
			}
		}
	}

	function beforeunload(event) {
		// Si on a le paramètre disableWarningMessage à "true" ou le paramètre showMenu à "false" dans le YAML ou le paramètre m=0 dans l'URL, on n'affiche pas de message de confirmation avant de quitter
		if(disableWarningMessage === true || disableMenu || ($url && $url.searchParams && $url.searchParams.get('m')==0)) return
		
		// Sinon on affiche un message de confirmation avant de quitter
		event.preventDefault();
		return event.returnValue = '';
	}

	let showNotification = false;
	let showHelp = false;

	function toastNotification() {
		showNotification= true
		setTimeout(function () {
			showNotification= false;
		}, 1500);
	}
</script>

<svelte:window on:keydown={handleKeydown} on:beforeunload={beforeunload} />

{#if showMenu}
	<nav id="menu" bind:this={menu}>
			{#if $show}<a href="#edit" on:click|preventDefault={menuView} title="Afficher seulement la carte">👓</a>{:else}<a href="#edit" on:click|preventDefault={menuEdit} title="Afficher l'éditeur">✒️</a>{/if}
			<a href="#saveHTML" on:click|preventDefault={menuSaveAsHtml} title="Sauvegarder au format HTML (interactif)">🌐</a>
			<a href="#saveSVG" on:click|preventDefault={menuSaveAsSvg} title="Sauvegarder au format SVG (image fixe)">💾</a>
			<a href="#share" on:click|preventDefault={menuShare} title="Créer un lien de partage rapide">🔗</a>
			{#if showNotification}
			<div id="shareNotification" in:fly="{{ y: 50, duration: 1000 }}" out:fade>Lien copié dans le presse-papier !</div>
			{/if}
			<button class="menu-button" on:click={() => showHelp = true} title="Afficher le tutoriel">❓</button>
			{#if $show}<a href="#reset" on:click|preventDefault={menuReset} title="Supprimer le contenu de cette carte">🧹</a>{/if}
	</nav>
{/if}
	<HelpModal bind:open={showHelp} />

<style>
	#menu {
		z-index: 1;
		margin: 1em;
		position: absolute;
		font-size: 1.4em
	}
	@media screen and (max-width:500px) {
		#menu {
			font-size:1.2em;
		}
	}

	#menu a {
		margin-left: 1em;
		text-decoration: none;
	}

	#menu .menu-button {
		margin-left: 1em;
		background: transparent;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		color: inherit;
	}

	#shareNotification {
		position:absolute;
		width:160px;
		margin-top:1em;
		margin-left:2em;
		background-color: #5cb85c;
		color:white;
		font-size:16px;
		text-align:center;
		padding:10px 2px!important;
		display:table-cell;
		font-family: 'Roboto', 'sans-serif';
		border-radius:5px;
		
	}
</style>