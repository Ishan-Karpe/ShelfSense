<script lang="ts">
	import { Header } from '$components';
	import '../app.css'; //css styles
	import { invalidate } from '$app/navigation';
	import { createClient } from '@supabase/supabase-js';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { setUserState } from '$lib/state/user-state.svelte';

	let { data, children } = $props();
	let { session } = $derived(data);

	// Create supabase client
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	// Get user from session
	// svelte-ignore state_referenced_locally
		const user = session?.user || null;

	// svelte-ignore state_referenced_locally
		let userState = setUserState({ session, user, supabase });

	$effect(() => {
		userState.updateState({ session, user, supabase });
	})

	//effect rune runs once then anytime the session changes
	$effect(() => {
		const { data: authData } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => authData.subscription.unsubscribe();
	});
</script>

<Header />
<!--make it always display in the site-->
{@render children()}
