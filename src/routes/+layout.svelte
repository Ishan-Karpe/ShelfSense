<script lang="ts">
	import { Header } from '$components';
	import './../app.css';
	import { invalidate } from '$app/navigation';
	import { setUserState } from '$lib/state/user-state.svelte';

	let { children, data } = $props();
	let { session, supabase } = $derived(data);

	console.log('🚀 Layout - Initial data:', {
		hasSession: !!data.session,
		hasSupabase: !!data.supabase,
		hasUser: !!data.user,
		userEmail: data.user?.email || 'no user'
	});

	let userState = setUserState({
		session: data.session,
		supabase: data.supabase,
		user: data.user
	});

	$effect(() => {
		const { data: authData } = supabase.auth.onAuthStateChange((event, newSession) => {
			console.log('🔄 Auth state changed:', event, newSession?.user?.email || 'no user');

			userState.updateState({
				session: newSession,
				supabase,
				user: newSession?.user || null
			});

			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => authData.subscription.unsubscribe();
	});
</script>

<Header />
{@render children()}
