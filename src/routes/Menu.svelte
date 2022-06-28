<script>
	import {
		show,
		baseURL,
		mindmapSaveAsSvg,
		mindmapSaveAsHtml
	} from './stores.js'
	export let source;
	import url from './url.js';
	
	import { fade, fly } from 'svelte/transition';

	let urlToShare;
	let encodageHash;
	import {
		saveAs
	} from 'file-saver-es';

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

	function menuShare() {
		toastNotification();
		encodageHash = encodeURI(source);
		urlToShare = $baseURL + '/#' + encodageHash
		navigator.clipboard.writeText(urlToShare);
	}

	function handleKeydown(event) {
		if (!$show) {
			if (event.key === 'e') {
				event.preventDefault();
				menuEdit();
			}
			if (event.key === 's') {
				menuSaveAsSvg();
			}
			if (event.key === 'h') {
				menuSaveAsHtml();
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

	function beforeunload(event) {
		event.preventDefault();
		return event.returnValue = '';
	}

	let showNotification = false;

	function toastNotification() {
		showNotification= true
		setTimeout(function () {
			showNotification= false;
		}, 3000);
	}

</script>

<svelte:window on:keydown={handleKeydown} on:beforeunload={beforeunload} />

<nav id="menu">
	{#if $show}<a href="#view" on:click|preventDefault={menuView}>👓</a>{:else}<a href="#edit" on:click|preventDefault={menuEdit}>✒️</a>{/if}
		<a href="#saveHTML" on:click|preventDefault={menuSaveAsHtml}>🌐</a>
		<a href="#saveSVG" on:click|preventDefault={menuSaveAsSvg}>💾</a>
		<a href="#share" on:click|preventDefault={menuShare}>🔗</a>
		{#if showNotification}
		<div id="shareNotification" in:fly="{{ y: 50, duration: 3000 }}" out:fade on:click={()=>(showNotification=false)}>Lien copié dans le presse-papier !</div>
		{/if}
		<a href="{$baseURL}" target="_blank">❓</a>
</nav>

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