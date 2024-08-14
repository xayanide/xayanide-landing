<script>
	import { fly } from 'svelte/transition';
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	export let logo;
	$: menuOpen = false;
</script>

<header class="py-8 bg-zptx-dark">
	<nav class="navbar px-32 relative">
		<div class="navbar-start"></div>
		<div class="navbar-center">
			<a href="{base}/" class="btn btn-ghost no-animation max-w-32" in:fly={{ y: '-20%' }}>
				<img src={logo} alt="ZPTX Logo" class="min-w-full h-auto" />
			</a>
			<button class="btn btn-ghost btn-circle no-animation text-lg{menuOpen ? ' rotate-180' : ''}" in:fly={{ y: '-20%' }} on:click={() => (menuOpen = !menuOpen)}>
			</button>
		</div>
		<div class="navbar-end"></div>
		{#if menuOpen}
			<div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center text-center gap-2 mt-8 text-md font-mono shrink-0 w-full" transition:fly={{ y: '-20%', duration: 100 }}>
				<a href="{base}/team" class="transition {$page.url.pathname === '/team' ? 'text-white' : 'hover:text-white'}">the team</a>
				<p class="text-slate-600">/</p>
				<a href="{base}/projects" class="transition {$page.url.pathname === '/projects' ? 'text-white' : 'hover:text-white'}">our projects</a>
				<p class="text-slate-600">/</p>
				<a href="{base}/contact" class="transition {$page.url.pathname === '/contact' ? 'text-white' : 'hover:text-white'}">contact us</a>
			</div>
		{/if}
	</nav>
</header>
