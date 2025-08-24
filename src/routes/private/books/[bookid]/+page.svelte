<script lang="ts">
	import StarRating from '$components/StarRating.svelte';
	import type { Book } from '$lib/state/user-state.svelte';

	interface BookPageProps {
		data: {
			book: Book;
		};
	}

	let { data }: BookPageProps = $props();
	let book = $derived(data.book);
</script>

<h2 class="book-title mt-m">{book.title}</h2>
<p class="book-author">by {book.author}</p>
<h4 class="mt-m mb-xs semi-bold">Your rating</h4>
<StarRating value={book.rating || 0} />
<p class="small-font">
	Click to {book.rating ? 'change' : 'give'} rating
</p>
{#if book.description}
	<h4 class="mt-m mb-xs semi-bold">Description</h4>
	<p class="mb-m">{book.description}</p>
{:else}
	<h4 class="mt-m mb-xs semi-bold">No description</h4>
	<button class="mb-m block" onclick={() => console.log('toggle on the edit mode')}>
		<p>Click to add one.</p>
	</button>
{/if}
