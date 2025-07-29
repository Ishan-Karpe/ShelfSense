<script lang="ts">
	import Button from './Button.svelte';

	interface ComponentProps {
		isRegistration: boolean;
	}

	let { isRegistration }: ComponentProps = $props();
</script>

<div class="default-margin auth-container">
	<h1 class="mb-l">{isRegistration ? 'Register' : 'Login'}</h1>
	<div class="form-and-social-login">
		<form class="auth-form">
			{#if isRegistration}
				<input placeholder="Name" type="text" name="name" />
			{/if}
			<input placeholder="Email" type="email" name="email" />
			<input placeholder="Password" type="password" name="password" />
			<input placeholder="Confirm Password" type="password" name="passwordConfirmation" />
			<Button type="submit">{isRegistration ? 'Register' : 'Login'}</Button>
			<!--will trigger the action that attaches to the auth form, posts the data to an endpoint-->
			{#if isRegistration}
				<p class="auth-hint mt-s">
					Already have an account?
					<a href="/login">Login</a>
				</p>
			{:else}
				<p class="auth-hint mt-s">
					No account?
					<a href="/register">Register</a>
				</p>
			{/if}
		</form>
		<div class="social-login">
			<!--TODO: Add a button here later-->
		</div>
	</div>
</div>

<style>
	.auth-container {
		margin-top: 80px;
	}

	.form-and-social-login {
		display: flex;
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		align-items: start;
		border-right: 1px solid grey;
		padding-right: 80px;
		width: 40%;
	}

	.auth-form input {
		margin-bottom: 12px;
		width: 100;
	}

	.auth-form input:last-of-type {
		margin-bottom: 30px;
	}

	.social-login {
		padding-left: 80px;
		width: 40%;
	}

	.auth-hint {
		font-size: 16px;
		color: grey;
	}

	.auth-error {
		background-color: rgb(122, 35, 35);
		color: white;
		font-size: 18px;
		border-radius: 12px;
		padding: 12px;
		width: 100%;
		margin-bottom: 8px;
	}

	.auth-error:last-of-type {
		margin-bottom: 16px;
	}
</style>
