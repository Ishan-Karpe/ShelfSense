<script lang="ts">
	import { getUserState } from '$lib/state/user-state.svelte';

	let userContext = getUserState();
	let allBooks = $derived(userContext.allBooks);
	
	// Debug logging
	$effect(() => {
		console.log('📚 Dashboard - Books updated:', {
			count: allBooks?.length || 0,
			books: allBooks
		});
	});
</script>

<div>
	<h1>My Books</h1>
	<p>Total books: {allBooks?.length || 0}</p>
	
	{#if allBooks && allBooks.length > 0}
		<ul>
			{#each allBooks as book}
				<li>
					<strong>{book.title}</strong>
					{#if book.author}
						by {book.author}
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<p>No books found. Add some books to your library!</p>
	{/if}
</div>
