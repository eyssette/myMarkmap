<script context="module">
    import hljs from "highlight.js/lib/core";
    import markdown from "highlight.js/lib/languages/markdown";
    import xml from "highlight.js/lib/languages/xml";
    import 'highlight.js/styles/github.css';

    hljs.registerLanguage("markdown", markdown);
    hljs.registerLanguage("xml", xml);
</script>

<script>
	import {
		onMount,
	} from 'svelte';

	import {
		show,
		markdownSource
	} from './stores.js'
	import url from './url.js';

	let textArea;
	let editor;

	const my = editor => {
		let code = editor.textContent;
		// code = code.replace(/\n##\s/g,'\n@hash@hash ')
		code = code.replace(/:(.*)_(.*?):/g,':$1@underscore$2:')
		code = code.replace(/:(.*)_(.*?):/g,':$1@underscore$2:')
		code = code.replace(/:(.*)_(.*?):/g,':$1@underscore$2:')
		code = hljs.highlight(code, {
			language: 'markdown',
			ignoreUnescapedHTML: false
		}).value;
		code = code.replace(/\\\\/g, '<span class="language-xml"><span class="hljs-tag">\\\\</span></span>').replace(/&lt;!--(.*?)--&gt;/g,'<span class="hljs-comment">&lt;!--$1--&gt;</span>').replace(/&lt;!--(\s*?)fold(\s*?)--&gt;/g, '<span class="language-xml"><span class="hljs-special-tag">&lt;!--$1fold$2--&gt;</span></span>');
		// .replace(/@hash@hash\s(.*?)\n/g,'<span class="hljs-section hljs-header-2">## $1</span>\n')
		code = code.replace(/@underscore/g,'_')
		editor.innerHTML = code;
	};

	let jar;


	let hidden
	$: $show ? hidden = "" : hidden = "hidden";


	let CodeJar;

	onMount(async () => {
		({
			CodeJar
		} = await import("codejar"))
		jar = await CodeJar(editor, my, {history:true});
	})

	$: if ($show == true) {		
		setTimeout(function () {
			textArea.firstChild.focus();
		}, 0);
	}
 
	$: if(jar) {jar.onUpdate(code=>
		{if (jar.toString() != $markdownSource) {markdownSource.update(n=>code)}}
	)}

</script>

<div bind:this={textArea}>
	{#await CodeJar}
		<div>Éditeur en cours de chargement</div>
	{:then}
		<pre bind:this={editor} contenteditable="true" bind:textContent={$markdownSource} class:hidden={!$show} class="editor"></pre>
	{:catch error}
		<textarea bind:value={$markdownSource} rows="20" cols="50" class:hidden={!$show}></textarea>
	{/await}
</div>

<style>
	textarea,
	:global(.editor) {
		font-size: 14px;
		margin-top: 5em;
		margin-left: 1em;
		width: 420px;
		height: 50vh;
		position: absolute;
		z-index: 1;
		background-color: white;
	}
	@media screen and (max-width:500px) {
		textarea,:global(.editor) {
			width:75vw;
		}
	}

	textarea,
	:global(.hidden) {
		visibility: hidden;
	}

	:global(.editor) {
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-radius: 6px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
		font-family: 'Lucida Grande', 'Arial', 'Source Code Pro', monospace;
		font-size: 14px;
		letter-spacing: normal;
		line-height: 20px;
		padding: 10px;
		tab-size: 2;
		resize: both!important;
	}

	:global(.language-xml *) {
		color: green !important;
		font-weight: 300 !important;
	}

	:global(.hljs-strong) {
		font-size: 0.95em
	}



	:global(.hljs-section .hljs-strong) {
		color:#032f62;
	}

	:global(.hljs-link),
	:global(.hljs-string) {
		color: #032f62;
		font-style: italic;
		font-size: 0.98em;
	}

	:global(.hljs-bullet) {
		color: #990000;
		font-weight: 700 !important;
	}

	:global(.hljs-emphasis) {
		color: inherit;
	}

	:global(.hljs-special-tag) {
		color:#A52A2A!important;
	}

	:global(.hljs-code) {
		color: #333!important;
		background-color: #EDEDED;
	}
	:global(.hljs-code *) {
		color: #333!important;
	}

	:global(.hljs-comment) {
		color: #777!important;
		font-weight:100;
		font-size:0.96em;
		
	}

	/* :global(.hljs-header-2) {
		display:inline-block;
		width:100%;
		background-color:#F8F8FF;
	}

	:global(.hljs-header-3) {
		display:inline-block;
		width:100%;
		background-color:#F8F8FF;
	} */

</style>