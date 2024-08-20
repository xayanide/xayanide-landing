<script>
	import Loading from '../Loading.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	const startTime = Date.now();
	$: elapsed = Date.now() - startTime;
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
	// Handle form submission
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

	// Access the VITE_REGISTER_ENABLED environment variable
	const isRegisterEnabled = import.meta.env.VITE_REGISTER_ENABLED === 'true';
</script>
<svelte:head>
	<title>xayanide - auth</title>
</svelte:head>
{#if loading}
	<Loading {elapsed} />
{:else if data.userId && !isConnected}
	<p>You're already logged in!</p>
{:else}
	<main>
		<div>
			{#if loading}
				<Loading {elapsed} />
			{:else}
				{#if form?.error}
					<p>{form.error}</p>
				{/if}
				{#if !isConnected}
					<p><a href="{base}/">Go to Home</a></p>
					<br />
					<form method="POST" use:enhance={handleSubmit}>
						<input type="email" name="email" placeholder="Email" required />
						<input type="password" name="password" placeholder="Password" required />
						<button on:submit={handleLogin} formaction="?/login" disabled={loading}>
							Log in
						</button>
						{#if isRegisterEnabled}
							<button formaction="?/register" disabled={loading}> Register </button>
						{/if}
					</form>
				{/if}
			{/if}
		</div>
	</main>
{/if}
