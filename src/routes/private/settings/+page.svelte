<script lang="ts">
	import Button from '$components/Button.svelte';
	import { getUserState } from '$lib/state/user-state.svelte';

	let userContext = getUserState();
	let userName = $state(userContext.userName || '');
	let isEditMode = $state(false);
	let email = $state(userContext.user?.email || '');
	let validationErrors = $state({
		userName: '',
		email: ''
	});
	let availableGenres = $derived(userContext.getAllUniqueGenres());
	let selectedGenre = $derived(userContext.getSelectedFavoriteGenre());
	let averageRating = $derived.by(() => {
		const booksWithRating = userContext.allBooks.filter((book) => Boolean(book.rating));

		if (booksWithRating.length === 0) {
			return 0;
		}

		const sumOfAllRatings = booksWithRating.reduce((acc, book) => acc + book.rating!, 0);

		const averageRating = Math.round(100 * (sumOfAllRatings / booksWithRating.length)) / 100;
		return averageRating;
	});

	$effect(() => {
		if (userContext.userName) {
			userName = userContext.userName;
		}
	});

	function validateFields() {
		let hasErrors = false;

		// Reset errors
		validationErrors.userName = '';
		validationErrors.email = '';

		// Validate required fields
		if (!userName?.trim()) {
			validationErrors.userName = 'Please fill out this field';
			hasErrors = true;
		}

		if (!email?.trim()) {
			validationErrors.email = 'Please fill out this field';
			hasErrors = true;
		}

		return !hasErrors;
	}

	async function toggleEditModeDB() {
		if (isEditMode) {
			if (validateFields()) {
				await userContext.updateAccountData(email, userName);
				isEditMode = false;
			}
			// If validation fails, stay in edit mode
		} else {
			isEditMode = true;
		}
	}

	async function deleteAccount() {
		const confirmDelete = window.confirm(
			'Are you sure you want to delete your account? This action cannot be undone and deletes all of your data!'
		);

		if (confirmDelete) {
			await userContext.deleteAccount();
		}
	}

	function selectFavoriteGenre(genre: string) {
		userContext.setSelectedFavoriteGenre(genre);
	}

	function clearFavoriteGenre() {
		userContext.setSelectedFavoriteGenre(null);
	}
</script>

<div class="settings-page">
	<div class="setings-container">
		<h2>Settings</h2>

		<h5 class="mt-m mb-xs semi-bold">Username</h5>
		{#if isEditMode}
			<input
				type="text"
				name="userName"
				bind:value={userName}
				class={validationErrors.userName ? 'error' : ''}
				placeholder="Enter username"
			/>
			{#if validationErrors.userName}
				<p class="error-message">{validationErrors.userName}</p>
			{/if}
		{:else}
			<h3>{userName}</h3>
		{/if}
		<h5 class="mt-m mb-xs semi-bold">Email Address</h5>
		{#if isEditMode}
			<input
				type="email"
				name="email"
				bind:value={email}
				class={validationErrors.email ? 'error' : ''}
				placeholder="Enter email address"
			/>
			{#if validationErrors.email}
				<p class="error-message">{validationErrors.email}</p>
			{/if}
		{:else}
			<h3>{email}</h3>
		{/if}

		{#if availableGenres.length > 0}
			<h5 class="mt-l mb-xs semi-bold">Favorite Genre</h5>
			<p class="mb-m small-text">
				Choose your favorite genre to see personalized book recommendations on your dashboard.
			</p>
			<div class="genre-selection">
				{#each availableGenres as genre}
					<button
						class="genre-card {selectedGenre === genre ? 'selected' : ''}"
						onclick={() => selectFavoriteGenre(genre)}
					>
						{genre}
					</button>
				{/each}
				{#if selectedGenre}
					<button class="genre-card clear-selection" onclick={clearFavoriteGenre}>
						Clear Selection
					</button>
				{/if}
			</div>
		{/if}

		<div class="buttons-container mt-l">
			<Button isSecondary={true} onclick={toggleEditModeDB}>
				{isEditMode ? 'Save Changes' : 'Edit'}
			</Button>
			<Button isDanger={true} onclick={deleteAccount}>Delete Account</Button>
		</div>
	</div>
	<div class="stats-container">
		<h5 class="semi-bold">Books in library</h5>
		<h3>{userContext.allBooks.length}</h3>
		<h5 class="semi-bold mt-m">Finished Books</h5>
		<h3>{userContext.allBooks.filter((book) => Boolean(book.finished_reading_on)).length}</h3>
		<h5 class="semi-bold mt-m">Average Rating Given</h5>
		<h3>{averageRating}</h3>
	</div>
</div>

<style>
	.settings-page {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
	}

	.setings-container {
		margin-right: 80px;
	}

	.setings-container input {
		width: 100%;
	}

	.stats-container {
		min-width: 25%;
		border-radius: 12px;
		padding: 8px 24px;
		background-color: rgba(255, 255, 255, 0.5);
		margin-bottom: 40px;
	}

	.setings-container input.error {
		border: 2px solid #dc3545;
		background-color: #ffeaea;
	}

	.error-message {
		color: #dc3545;
		font-size: 14px;
		margin: 4px 0 8px 0;
		font-weight: 500;
	}

	.small-text {
		font-size: 20px;
		line-height: 1.4;
		color: #666;
	}

	.genre-selection {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 16px;
	}

	.genre-card {
		font-family: 'Poppins', sans-serif;
		padding: 12px 24px;
		min-height: 48px;
		border: 1px solid black;
		border-radius: 12px;
		background: white;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 20px;
		font-weight: 400;
		color: black;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.genre-card:hover {
		background: rgba(0, 0, 0, 0.035);
	}

	.genre-card.selected {
		background: black;
		color: white;
	}

	.genre-card.clear-selection {
		border-color: rgb(136, 4, 4);
		color: rgb(136, 4, 4);
	}

	.genre-card.clear-selection:hover {
		background: rgb(136, 4, 4);
		color: white;
	}
</style>
