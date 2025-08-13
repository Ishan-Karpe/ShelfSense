<script lang="ts">
	import shelfSenseLogo from '$assets/app-logo.svg';
	import { Button } from '$components';
	import { getUserState } from '$lib/state/user-state.svelte';

	let userContext = getUserState();
	let {user, userName} = $derived(userContext);
	
	// Debug logging
	$effect(() => {
		console.log('Header - user state changed:', {
			user: user?.email || 'no user',
			userExists: !!user,
			showingLoginButtons: !user
		});
	});
</script>

<header>
	<a href="/"> <img class="logo" src={shelfSenseLogo} alt="Go to Home" /></a>
	<nav>
		{#if !user}
		<ul>
			<li>
				<Button isMenu={true} href="/register">Create Account</Button>
			</li>
			<li>
				<Button isMenu={true} isSecondary={true} href="/login">Login</Button>
			</li>
		</ul>
		{:else}
		<ul>
			<li>
				{userName}
			</li>
			<li>
				<Button isMenu={true} isSecondary={true} onclick={() => {
					console.log('Header - Logout button clicked, calling userContext.logout()');
					userContext.logout();
				}}>Logout</Button>
			</li>
		</ul>
		{/if}
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 4vw;
	}

	ul {
		display: flex;
		align-items: center;
		column-gap: 24px;
	}

	.logo {
		height: 72px;
	}
</style>
