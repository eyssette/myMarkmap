<script>
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";
	import docs from './docs.js';

	export let open = false;
	let activeTab = "create";
	const dispatch = createEventDispatcher();

	function close() {
		open = false;
		dispatch("close");
	}

	function onBackdropClick(e) {
		if (e.target === e.currentTarget) close();
	}

	function handleWindowKeydown(event) {
		if (event.key === "Escape" && open) close();
	}

	function handleBackdropKeydown(event) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			close();
		}
	}
</script>

<svelte:window on:keydown={handleWindowKeydown} />

{#if open}
	<div
		class="modal-backdrop"
		on:click={onBackdropClick}
		on:keydown={handleBackdropKeydown}
		tabindex="-1"
		transition:fade>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="help-modal-title">
				<header class="modal-header">
					<div class="header-row">
						<h2 id="help-modal-title">Tutoriel</h2>
						<button class="close-btn" on:click={close} aria-label="Fermer">✖</button>
					</div>

						<div role="tablist" class="tab-buttons">
							<button class="tab-button" on:click={() => (activeTab = "create")} aria-selected={activeTab === "create"} role="tab">Créer une carte</button>
							<button class="tab-button" on:click={() => (activeTab = "share")} aria-selected={activeTab === "share"} role="tab">Partager une carte</button>
							<button class="tab-button" on:click={() => (activeTab = "nav")} aria-selected={activeTab === "nav"} role="tab">Naviguer dans la carte</button>
							<button class="tab-button" on:click={() => (activeTab = "appearance")} aria-selected={activeTab === "appearance"} role="tab">Configurer l'apparence</button>
							<button class="tab-button" on:click={() => (activeTab = "markdown")} aria-selected={activeTab === "markdown"} role="tab">La syntaxe markdown</button>
							
					</div>
				</header>
			<div class="modal-body">
				<div class="tab-content">

							<section>
								{#if activeTab === "create"}
  									<div class="doc-html">{@html docs.create}</div>
								{/if}
							</section>

							<section>
								{#if activeTab === "share"}
  									<div class="doc-html">{@html docs.share}</div>
								{/if}
							</section>

							<section>
								{#if activeTab === "markdown"}
  									<div class="doc-html">{@html docs.markdown}</div>
								{/if}
							</section>

							<section>
								{#if activeTab === "nav"}
  									<div class="doc-html">{@html docs.nav}</div>
								{/if}
							</section>

							<section>
								{#if activeTab === "appearance"}
  									<div class="doc-html">{@html docs.appearance}</div>
								{/if}
							</section>

					</div>
				</div>
			<footer class="modal-footer">
				<button class="primary" on:click={close}>Fermer</button>
			</footer>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		padding: 1rem;
	}

	.modal {
		background: white;
		max-width: 1400px;
		font-size:24px;
		width: 100%;
		height: 90vh;
		display: flex;
		flex-direction: column;
		border-radius: 8px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}
	@media (max-width: 600px) or (max-height: 700px) {
		.modal {
			font-size:18px;
		}
	}
	@media screen and (min-width: 601px) and (max-width: 1000px) and (min-height: 701px) {
		.modal {
			font-size:20px;
		}
	}

	.modal-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #eee;
	}
	@media (max-height: 700px){
		#help-modal-title {
			font-size: 1em;
		}
	}

	.header-row {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 0.25rem;
	}

	.header-row h2 {
		margin: 0;
		font-size: 2rem;
		padding-bottom:0.75rem;
	}

	.header-row .close-btn {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.tab-buttons {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		overflow-x: auto;
	}
	@media (max-height: 700px){
		.tab-buttons {
			margin-bottom: 0;
		}
	}

	.tab-button {
		background: transparent;
		border: none;
		padding: 0.5rem 0.75rem;
		cursor: pointer;
		font: inherit;
		border-bottom: 2px solid transparent;
	}

	.tab-button[aria-selected="true"] {
		border-bottom-color: #007bff;
		font-weight: 600;
	}

	

	.modal-body {
		padding: 0rem 2rem;
		flex: 1 1 auto;
		overflow: auto;
	}

	.modal-footer {
		padding: 0.75rem 1rem;
		border-top: 1px solid #eee;
		text-align: right;
	}

	.close-btn {
		background: transparent;
		border: none;
		font-size: 1.1rem;
		cursor: pointer;
	}

	.primary {
		background: #007bff;
		color: white;
		border: none;
		padding: 0.5rem 0.75rem;
		border-radius: 4px;
		cursor: pointer;
	}

	:global(.tab-content section code){
		font-size:0.8em!important;
	}
	:global(p > code, li > code){
		background: #efefee;
	}
	:global(pre){
		background: antiquewhite;
    	padding: 1em;
    	width: fit-content;	
	}
</style>
