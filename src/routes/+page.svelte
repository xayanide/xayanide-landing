<script>
	import Loading from './Loading.svelte';
	import logo from '../lib/images/logo.png';
	import { base } from '$app/paths';
	import { invalidateAll, goto } from '$app/navigation';

	const startTime = Date.now();
	let elapsed = 0;
	const interval = setInterval(() => {
		elapsed = Date.now() - startTime;
	}, 1000);

	const reset = () => {
		clearInterval(interval);
	};

	const preloadImage = (src) => {
		return new Promise((resolve) => {
			let img = new Image();
			img.onload = resolve;
			img.src = src;
		});
	};

	// Add the URL of the image to preload
	const imagesToLoad = [logo, 'https://mynickname.com/forum6t8/xayanide.gif'];

	const createAndResolvePromises = async () => {
		await Promise.all(imagesToLoad.map(preloadImage));
		reset();
	};

	export let data;
	let loading = false;

	async function gotoDashboard() {
		goto('/dashboard');
	}

	async function logout() {
		loading = true;

		const response = await fetch('/api/logout', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		loading = false;

		if (response.status === 200) {
			invalidateAll();
		}
	}
</script>

<svelte:head>
	<title>xayanide</title>
	<meta name="description" content="xayanide's Home" />
</svelte:head>

{#await createAndResolvePromises()}
	<Loading {elapsed} />
{:then}
	<div class="min-h-screen flex flex-col items-center justify-center bg-black text-white">
		<div class="bg-gray-800 p-6 rounded-lg shadow-lg">
			<div class="text-center">
				<a href="https://imgur.com/rHpy1VZ" target="_blank" class="block mb-4">
					<img src={logo} alt="xayanide Logo" class="mx-auto max-w-xs" />
				</a>
				<h1 class="text-4xl font-light mb-4">xayanide</h1>
				<p class="text-gray-400 mb-4">
					<a href="https://discord.com/invite/8SevbgGrar" target="_blank">
						my personal discord server here
					</a>
				</p>
				<p class="text-gray-400 mb-4">
					<a href="{base}/findme"> find me here :) </a>
				</p>
				<div class="mb-4">
					<a href="https://mynickname.com/xayanide">
						<img
							src="https://mynickname.com/forum6t8/xayanide.gif"
							alt="Certificate for nickname xayanide"
							class="max-w-xs mx-auto"
						/>
					</a>
				</div>
				<hr class="my-4 border-gray-600" />
				<div class="flex justify-center space-x-4">
					{#if data.userId === undefined}
						<a href="{base}/login" class="btn btn-primary">Login</a>
					{:else}
						<button on:click={logout} class="btn btn-secondary" disabled={loading}>
							{loading ? 'Loading...' : 'Log out'}
						</button>
						<button on:click={gotoDashboard} class="btn btn-accent"> Dashboard </button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/await}
