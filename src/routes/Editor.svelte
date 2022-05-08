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
		markdownSource,
		undoEvent,
		redoEvent
	} from './stores.js'
	import url from './url.js';

	let textArea;
	let editor;
	// import {
	// 	createStack
	// } from 'svelte-undo';
	// let value = {
	// 	source: $markdownSource
	// };
	// const stack = createStack(value);


	const my = editor => {
		let code = editor.textContent;
		code = hljs.highlight(code, {
			language: 'markdown',
			ignoreUnescapedHTML: false
		}).value;
		code = code.replace(/\\\\/g, '<span class="language-xml"><span class="hljs-tag">\\\\</span></span>').replace(/&lt;!--fold--&gt;/g, '<span class="language-xml"><span class="hljs-tag">&lt;!--fold--&gt;</span></span>');
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
	})


	$: if ($show == true) {
		jar = CodeJar(editor, my);

		setTimeout(function () {
			textArea.firstChild.focus();
		}, 0);
	}

	// let cursorPosition;

	$: if ($undoEvent && jar) {
		undoEvent.update(n => false);
		// cursorPosition = jar.save();
		// setTimeout(function () {
		// 	markdownSource.update(n => (value = stack.undo())['source']);
		// }, 0);
		// setTimeout(function () {
		// 	jar.restore(cursorPosition);
		// }, 0);
	}
	$: if ($redoEvent && jar) {
		redoEvent.update(n => false);
		// cursorPosition = jar.save();
		// setTimeout(function () {
		// 	markdownSource.update(n => (value = stack.redo())['source']);
		// }, 0);
		// setTimeout(function () {
		// 	jar.restore(cursorPosition);
		// }, 0);
	}

</script>

<div bind:this={textArea}>
	{#if CodeJar}
		<pre bind:this={editor} contenteditable="true" bind:textContent={$markdownSource} class:hidden={!$show} class="editor"></pre>
	{:else}
		<textarea bind:value={$markdownSource} rows="20" cols="50" class:hidden={!$show}></textarea>
	{/if}
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

	textarea,
	:global(.hidden) {
		visibility: hidden;
	}

	:global(.editor) {
		border: 1px solid rgba(0, 0, 0, 0.2);
		resize: both;
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
		color: green !important;
		font-weight: 300 !important;
	}

	:global(.hljs-strong) {
		font-size: 0.95em
	}

	:global(.hljs-code) {
		color: #555;
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
</style>