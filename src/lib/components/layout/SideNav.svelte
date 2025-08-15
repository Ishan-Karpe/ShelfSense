<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<nav class="side-nav">
	<ul>
		<li>
			<a href="/private/dashboard"> <Icon icon="ion:library-outline" width={'40'} /></a>
		</li>
		<li>
			<a href="/private/scan-shelf"> <Icon icon="solar:eye-scan-linear" width={'40'} /></a>
		</li>
		<li>
			<a href="/private/settings">
				<Icon icon="ion:settings-outline" width={'40'} />
			</a>
		</li>
	</ul>
</nav>

<style>
	.side-nav {
		display: flex;
		height: 100vh;
		border-right: 1px solid grey;
		padding-left: 24px;
		padding-right: 40px;
		flex: 0 0 auto;
		position: sticky;
		top: 0;
	}

	.side-nav ul {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	ul li:not(:last-of-type) {
		margin-bottom: 16px;
	}
</style>
