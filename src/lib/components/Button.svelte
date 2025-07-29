<script lang="ts">
	import type { Snippet } from 'svelte';
    // these interfaces make sure you can't accidentally mix button and link properties

	// Basic props interface for shared properties
	interface BasicProps {
		children: Snippet;
		isSecondary?: boolean;
		isDanger?: boolean;
		isMenu?: boolean;
	}

	// Button-specific props with onclick handler
	interface ButtonProps extends BasicProps {
		onclick?: (e: MouseEvent) => void;
		href?: never;
		type?: 'submit' | 'button'; 
	}

	// Link-specific props with href attribute
	interface LinkProps extends BasicProps {
		href: string;
		onclick?: never;
	}

	type ComponentProps = ButtonProps | LinkProps;

	// Extract props with children and spread remaining attributes
	let { children, href, onclick, isSecondary, isDanger, isMenu, ...props }: ComponentProps =
		$props();
</script>

{#if href}
	<!--if the href prop is given then render a link-->
	<a
		{href}
		class="btn"
		class:btn-secondary={isSecondary}
		class:btn-danger={isDanger}
		class:btn-menu={isMenu}
	>
		{@render children()}
		<!--display the children on screen-->
	</a>
{:else}
	<!--if the href prop is given then render a button-->
	<button
		{...props}
		{onclick}
		class="btn"
		class:btn-secondary={isSecondary}
		class:btn-danger={isDanger}
		class:btn-menu={isMenu}
	>
		{@render children()}
		<!--display the children on screen-->
	</button>
{/if}

<style>

	a {
		display: block;
		text-decoration: none;
	}

	a:hover {
		text-decoration: none;
	}

    .btn {
        padding: 12px 24px;
        min-width: 230px;
        text-align: center;
        background-color: black;
        border-radius: 12px;
        color: white;
        border: 1px solid white;
        font-weight: normal;
        font-size: 22px;
    }

    .btn-secondary {
        background-color: white;
        color: black;
        border: 1px solid black;
    }

    .btn-danger {
        background-color: rgb(136,4,4);
    }

    .btn-menu {
        min-width: 150px;
        padding: 8px 20px;
    }
</style>
