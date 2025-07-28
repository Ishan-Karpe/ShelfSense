<script lang="ts">
	import Button from './Button.svelte';
	import heroImage from '/src/assets/hero.png';
</script>

<section class="default-margin hero">
	<div class="hero-text">
		<!--div acts as a container for an image-->
		<h1>ShelfSense</h1>
		<h3>Your personal book libary.</h3>
		<h4 class="mt-l">
			Create your very own digital library where you can keep track of every book you own, read, and
			love.
		</h4>
		<h4 class="mb-s">
			This app offers a beautifully designed, easy-to-use interface that allows you to manage your
			book collection with ease. Whether you're a bookworm, a casual reader, or just looking to keep
			track of your books, ShelfSense has you covered.
		</h4>
		<Button href="/register">Sign Up</Button>
	</div>
	<img class="hero-image" src={heroImage} alt="" />
</section>

<style>
	.hero {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 100px;
		margin-bottom: 100px;
	}

	.hero-text {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 55%;
		padding-right: 50px;
	}
</style>
