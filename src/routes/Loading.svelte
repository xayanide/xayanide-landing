<script>
	import { fade, fly } from 'svelte/transition';
	import { base } from '$app/paths';

	export let elapsed = 0;
</script>

<div
	class="transition-enforcement bg-black min-w-screen min-h-screen flex justify-center items-center font-mono text-2xl text-white *:justify-self-center *:animate-pulse"
>
	{#if elapsed > 12000}
		<p in:fade={{ delay: 250 }} out:fade>(4) something's wrong...</p>
		{#if elapsed > 15000}
			<div
				class="absolute bottom-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center gap-2 !animate-none text-xl"
			>
				<a href="{base}/" class="transition hover:text-white" in:fly={{ y: '20%' }} out:fade
					>go back home</a
				>
			</div>
		{/if}
	{:else if elapsed > 7000}
		<p in:fade={{ delay: 250 }} out:fade>(3) taking longer than expected...</p>
	{:else if elapsed > 3000}
		<p in:fade={{ delay: 250 }} out:fade>(2) meh...</p>
	{:else}
		<p in:fade={{ delay: 100 }} out:fade>(1) please wait...</p>
	{/if}
</div>

<style>
	.transition-enforcement {
		display: grid;
	}
	.transition-enforcement > * {
		grid-column: 1/2;
		grid-row: 1/2;
	}
</style>
