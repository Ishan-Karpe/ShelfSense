<script lang="ts">
	import { Header } from '$components';
	import '../app.css'; //css styles

	let { children } = $props();
</script>

<Header /> <!--make it always display in the site-->
{@render children()}
