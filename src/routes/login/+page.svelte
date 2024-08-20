<script>
	import Loading from '../Loading.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	const startTime = Date.now();
	let elapsed = 0;
	const interval = setInterval(() => {
		elapsed = Date.now() - startTime;
	}, 1000);

	const reset = () => {
		clearInterval(interval);
	};

	export let data;
	let isConnected = false;
	let loading = true;
	export let form;

	const handleLogin = () => {
		loading = true;
		if (isConnected) {
			goto('/');
		}
		loading = false;
	};

	const handleSubmit = () => {
		loading = true;
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				goto('/');
				isConnected = true;
			}
			loading = false;
		};
	};

	onMount(() => {
		if (data.userId) {
			goto('/');
		}
		loading = false;
		reset();
	});

	const isRegisterEnabled = import.meta.env.VITE_REGISTER_ENABLED === 'true';
</script>

<svelte:head>
	<title>auth</title>
</svelte:head>

{#if loading}
	<Loading {elapsed} />
{:else if data.userId && !isConnected}
	<div class="text-center text-white">
		<p>You're already logged in!</p>
	</div>
{:else}
	<main class="flex items-center justify-center min-h-screen bg-gray-900 text-black">
		<div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
			{#if form?.error}
				<div class="mb-4 p-4 bg-red-600 rounded text-white">
					<p>{form.error}</p>
				</div>
			{/if}
			{#if !isConnected}
				<p class="mb-4 text-center">
					<a href="{base}/" class="text-blue-400 underline">Go to Home</a>
				</p>
				<form method="POST" use:enhance={handleSubmit} class="space-y-4">
					<input
						type="email"
						name="email"
						placeholder="Email"
						required
						class="input input-bordered w-full"
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						required
						class="input input-bordered w-full"
					/>
					<button
						formaction="?/login"
						type="submit"
						class="text-white btn btn-primary w-full"
						disabled={loading}
					>
						{loading ? 'Logging in...' : 'Log in'}
					</button>
					{#if isRegisterEnabled}
						<button
							formaction="?/register"
							class="text-white btn btn-secondary w-full"
							disabled={loading}
						>
							{loading ? 'Registering...' : 'Register'}
						</button>
					{/if}
				</form>
			{/if}
		</div>
	</main>
{/if}
