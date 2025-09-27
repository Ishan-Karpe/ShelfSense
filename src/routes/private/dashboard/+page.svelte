<script lang="ts">
	import { BookCard } from '$components';
	import BookCategory from '$components/BookCategory.svelte';
	import StarRating from '$components/StarRating.svelte';
	import { getUserState, type Book } from '$lib/state/user-state.svelte';
	import Icon from '@iconify/svelte';

	let userContext = getUserState();
	let { userName, allBooks } = $derived(userContext);
</script>

<div class="dashboard">
	<div class="dashboard-header">
		<a href="/private/scan-shelf" class="add-book">
			<Icon icon="icons8:plus" width={'72'} height={'72'} />
			<p>Add Books</p></a
		>
		<div class="headline">
			<h3 class="bold mb-xs">Welcome Back, {userName}</h3>
			<p>
				There's nothing quite like the journey a good book can take you on. Have you discovered any
				new favorites recently?
			</p>
		</div>
	</div>
	{#if allBooks.length > 0}
		{#if userContext.getHighestRatedBooks().length}
			<BookCategory
				booksToDisplay={userContext.getHighestRatedBooks()}
				categoryName={'Your Favorite books'}
			/>
		{/if}
		<BookCategory
			booksToDisplay={userContext.getUnreadBooks()}
			categoryName={'Recently added, unread books'}
		/>
		{#if userContext.getFavoriteGenre()}
			<BookCategory
				booksToDisplay={userContext.getBooksFromFavoriteGenre()}
				categoryName={`Books from your favorite genre: ${userContext.getFavoriteGenre()}`}
			/>
		{/if}
	{:else}
		<a href='/private/scan-shelf' class='upload-hint mt-l'>
			<h3>You have no books in your library in this moment. Click here to get started!</h3>
			<div class='mt-m'>
				<Icon icon='icons8:plus' width={'72'} height={'72'} />
				<p>Add Books</p>
			</div>
		</a>
	{/if}
</div>

<style>
	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
	}

	.add-book {
		display: flex;
		align-items: center;
		text-decoration: none;
	}

	.add-book p {
		margin-left: 8px;
	}

	.headline {
		text-align: right;
		max-width: 30%;
		min-width: 300px;
	}

	.upload-hint {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		width: 100%;
		flex-direction: column;
	}

	.upload-hint div {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
