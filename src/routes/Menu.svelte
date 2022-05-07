<script>
	import {
		show,
		baseURL,
		mindmapSave,
		wValue,
		hValue
	} from './stores.js'
	export let source;
	import url from './url.js';
	import {
		saveAs
	} from 'file-saver-es';
	let urlToShare;
	let encodageHash;
	let file

	function menuEdit() {
		show.update(n=>true);
	}

	function menuView() {
		show.update(n=>false);
	}

	function menuSave() {
		mindmapSave.update(n=>true)
	}

	function menuShare() {
		encodageHash = encodeURI(source);
		urlToShare = $baseURL + '/#' + encodageHash
		history.replaceState(null, null, urlToShare);
		navigator.clipboard.writeText(urlToShare);
	}

	function handleKeydown(event) {
		if (!$show) {
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

	function beforeunload(event) {
        event.preventDefault();
        return event.returnValue = '';
    }

	let showNotification=true;

</script>

<svelte:window on:keydown={handleKeydown} on:beforeunload={beforeunload}/>

<nav id="menu">
	{#if $show}<a href="view" on:click|preventDefault={menuView}>👓</a>{:else}<a href="edit" on:click|preventDefault={menuEdit}>✒️</a>{/if}
		<a href="save" on:click|preventDefault={menuSave}>💾</a>
		<a href="#share" on:click|preventDefault={menuShare}>🔗</a>
		<a href="{$baseURL}#https://raw.githubusercontent.com/eyssette/mindmap/main/mindmap-default-mymarkmap.md" target="_blank">❓</a>
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

</style>