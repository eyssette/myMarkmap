<script>
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";

	export let open = false;
	let activeTab = "basics";
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
						<button class="tab-button" on:click={() => (activeTab = "basics")} aria-selected={activeTab === "basics"} role="tab">Pour faire des cartes mentales</button>
						<button class="tab-button" on:click={() => (activeTab = "nav")} aria-selected={activeTab === "nav"} role="tab">Comment naviguer</button>
						<button class="tab-button" on:click={() => (activeTab = "advanced")} aria-selected={activeTab === "advanced"} role="tab">Usages avancés</button>
					</div>
				</header>
			<div class="modal-body">
				<div class="tab-content">
						{#if activeTab === "basics"}
							<section>
								<h3>Pour faire des cartes mentales</h3>
								<ul>
									<li>
										Clic sur ✒️ en haut à gauche pour <strong>éditer</strong> sa
										carte mentale (<em>raccourci clavier : <code>e</code></em>).
										On utilise le Markdown pour créer des branches
										<ul>
											<li><code># Titre</code> pour le niveau 1</li>
											<li><code>## Sous-titre</code> pour le niveau 2</li>
											<li>
												<code>### Niveau 3</code>, <code>#### Niveau 4</code> …
											</li>
											<li>
												Ou bien, on fait une liste à puces <code
													>- Niveau 3</code>
												&nbsp;&nbsp;<code>- Niveau 4</code> (on ajoute 2 espaces
												avant pour passer à un autre niveau)
											</li>
										</ul>
									</li>
									<li>
										Clic sur 👓 pour <strong>cacher</strong> la fenêtre
										d'édition et voir seulement la carte mentale (<em
											>raccourci clavier : <code>Escape</code></em
										>)
									</li>
									<li>
										<strong>Enregistrer</strong> et partager sa carte mentale
										<ul>
											<li>
												Clic sur 💾 pour <strong>enregistrer</strong> la carte
												au format <em>svg</em> [image fixe] (<em
													>raccourci clavier : <code>s</code></em
												>)
											</li>
											<li>
												Clic sur 🌐 pour <strong>enregistrer</strong> au format
												HTML [interactivité possible] (<em
													>raccourci clavier : <code>h</code></em
												>)
											</li>
											<li>
												Clic sur 🔗 pour copier un <strong
													>lien de partage</strong>
												de la carte mentale (<em
													>raccourci clavier : <code>l</code></em
												>)
												<ul>
													<li>
														Ajouter <code>?m=0</code> dans l'URL pour cacher le menu
													</li>
												</ul>
											</li>
											<li>
												Il est recommandé d'enregistrer le texte de sa carte
												mentale quelque part pour pouvoir modifier plus tard sa
												carte mentale
												<ul>
													<li>
														On peut mettre son texte <strong
															>sur une forge</strong>
														ou sur
														<a
															href="https://codimd.apps.education.fr"
															target="_blank"
															rel="noreferrer">CodiMD</a> et l'afficher avec myMarkmap
													</li>
													<li>
														Format d'URL d'exemple : <code
															>https://mymarkmap.vercel.app/#URL</code>
													</li>
													<li>
														En cas de problème : <code
															>https://mymarkmap.vercel.app/#https://corsproxy.io/%3FURL</code>
													</li>
													<li>
														Sur une instance Gitlab, il faut utiliser un fichier <code
															>.gitlab-ci.yml</code> pour publier le fichier md sur
														une page publique et utiliser cette adresse comme URL
													</li>
												</ul>
											</li>
										</ul>
									</li>
								</ul>
							</section>
						{/if}

						{#if activeTab === "nav"}
							<section>
								<h3>Comment naviguer dans la carte ?</h3>
								<ul>
									<li>
										Clic sur les <strong>cercles</strong> à l'intersection des
										différentes branches pour afficher ou masquer la suite
										<ul>
											<li>
												<strong>Alt+clic</strong> sur un cercle pour afficher seulement
												la branche en question
											</li>
										</ul>
									</li>
									<li>
										<strong>Autres raccourcis</strong>
										<ul>
											<li>
												<strong>Alt+clic</strong> sur le texte d'une branche pour
												la masquer
											</li>
											<li>
												<code>m</code> pour masquer ou réafficher la barre de menu
											</li>
											<li>
												<code>r</code> pour désactiver ou réactiver le redimensionnement
												automatique
											</li>
										</ul>
									</li>
								</ul>
							</section>
						{/if}

						{#if activeTab === "advanced"}
							<section>
								<h3>Usages plus avancés</h3>
								<details open>
									<summary
										><strong
											>Des balises pour contrôler l'affichage de la carte</strong
										></summary>
									<details>
										<summary><em>Markdown</em></summary>
										<ul>
											<li>
												<code>**texte**</code> : pour mettre en
												<strong>gras</strong>
											</li>
											<li>
												<code>_texte_</code> : pour mettre en <em>italiques</em>
											</li>
											<li>
												<code>[lien](URL)</code> : pour insérer un
												<a
													href="https://eyssette.forge.apps.education.fr"
													target="_blank"
													rel="noreferrer">lien</a>
											</li>
											<li><code>![](URL)</code> : pour insérer une image</li>
											<li>
												<code>![h-25](URL)</code> : pour spécifier la hauteur de
												l'image (en pixels)
											</li>
											<li>
												<code>&lt;code&gt;</code> : pour insérer du
												<code>code</code>
											</li>
											<li>
												<code>==texte==</code> : pour surligner du ==texte==
											</li>
											<li>
												<code>++texte++</code> : pour souligner du ++texte++
											</li>
										</ul>
									</details>

									<details>
										<summary><em>HTML</em></summary>
										<ul>
											<li>
												<code>&lt;br&gt;</code> pour forcer le passage à la ligne
											</li>
											<li>
												<code>&lt;span style="..."&gt;texte&lt;/span&gt;</code> pour
												changer le style d'un élément
											</li>
										</ul>
									</details>

									<details>
										<summary><em>Autres balises</em></summary>
										<ul>
											<li>
												<code>&lt;!--fold--&gt;</code> en fin de ligne pour que
												les sous-branches soient cachées par défaut : il faut
												cliquer sur le cercle pour afficher la suite
												<ul>
													<li>Cette branche est cachée par défaut !</li>
													<li>Cette branche aussi !</li>
												</ul>
											</li>
											<li>
												<code>:code_emoji:</code> : pour insérer un code pour un
												emoji (voir la liste sur
												<a
													href="https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json"
													target="_blank"
													rel="noreferrer">emoji.json</a
												>)
											</li>
											<li>
												<code>{"{{partie masquée}}"}</code> pour masquer une
												partie d'un texte : voici par exemple un
												<code>{"{{passage}}"}</code> masqué (cliquer dessus pour
												afficher / masquer à nouveau)
											</li>
										</ul>
									</details>
								</details>

								<details>
									<summary
										><strong
											>Un en-tête (YAML) pour des options de configuration plus
											avancées</strong
										></summary>
									<ul>
										<li>
											Pour spécifier la largeur maximale d'une branche :
											<pre><code>maxWidth: 300</code></pre>
										</li>
										<li>
											Pour empêcher le changement de couleur des sous-branches à
											partir d'un certain niveau :
											<pre><code>colorFreezeLevel: 2</code></pre>
										</li>
										<li>
											Pour ajouter des styles CSS spécifiques :
											<pre><code>style: strong&#123;color:red&#125;</code></pre>
										</li>
										<li>
											Pour ajouter un thème spécifique :
											<pre><code>theme: focus</code></pre>
											<div>
												Thèmes disponibles : <code>focus</code>,
												<code>nolines</code>
												et <code>black</code>
											</div>
										</li>
										<li>
											Pour avoir des lignes droites plutôt que des courbes :
											<pre><code>curves: false</code></pre>
										</li>
										<li>
											Pour ajouter un titre :
											<pre><code>title: Mon titre</code></pre>
										</li>
										<li>
											Pour masquer par défaut les sous-branches à partir d'un
											certain niveau :
											<pre><code>initialExpandLevel: 1</code></pre>
										</li>
										<li>
											Pour forcer l'ouverture des liens dans un nouvel onglet :
											<pre><code>openLinksInNewTab: true</code></pre>
										</li>
										<li>
											Pour permettre l'ouverture automatique des liens et
											empêcher l'affichage du message de confirmation pour
											quitter la page :
											<pre><code>disableWarningMessage: true</code></pre>
										</li>
										<li>
											Pour contrôler l'interactivité :
											<pre><code>automaticResize: false</code></pre>
											<div>
												Autres options : <code>focusOnBranch: true</code>,
												<code>showMenu: false</code>
											</div>
										</li>
									</ul>
								</details>
							</section>
						{/if}
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

	.modal-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #eee;
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

	.tab-content section h3 {
		margin-top: 0;
	}

	.modal-body {
		padding: 1rem 2rem;
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
</style>
