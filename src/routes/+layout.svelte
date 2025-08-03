<script lang="ts">
	import { Header } from '$components';
	import '../app.css'; //css styles
	import { invalidate } from '$app/navigation';
	import { createClient } from '@supabase/supabase-js';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

	let { data, children } = $props();
	let { session } = $derived(data);

	// Create supabase client
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

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
