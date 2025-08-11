<script lang="ts">
	import { Header } from '$components';
	import '../app.css'; //css styles
	import { invalidate } from '$app/navigation';
	import { createClient } from '@supabase/supabase-js';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { setUserState } from '$components/state/user-state.svelte';

	let { data, children } = $props();
	
	// Create supabase client
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	// Safely get session and user from data
	let session = $derived(data?.session || null);
	let user = $derived(session?.user || null);

	// svelte-ignore state_referenced_locally
	let userState = setUserState({ session, user, supabase });

	//effect rune runs once then anytime the session changes
	$effect(() => {
		const { data: authData } = supabase.auth.onAuthStateChange((event, newSession) => {
			console.log('Auth state changed:', event, newSession?.user?.email);
			
			// Always update the user state when auth changes
			userState.updateState({ session: newSession, user: newSession?.user || null, supabase });

			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => authData.subscription.unsubscribe();
	});

	// Update user state when server session changes
	$effect(() => {
		// Handle both null and non-null session changes
		const serverToken = session?.access_token;
		const stateToken = userState.session?.access_token;
		
		if (serverToken !== stateToken) {
			userState.updateState({ session, user, supabase });
		}
	});
</script>

<Header />
<!--make it always display in the site-->
{@render children()}
