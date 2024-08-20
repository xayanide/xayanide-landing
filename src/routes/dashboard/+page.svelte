<script>
	import Loading from '../Loading.svelte';
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

	let loading = true;
	export let data;
	let file = null;
	let uploadedData = null;
	let insertedId = null;
	let errorMessage = null;
	let password = '';
	let showPasswordPrompt = false;

	const correctPassword = import.meta.env.VITE_JSON_UPLOAD_PASSWORD;

	const handleFileChange = (event) => {
		file = event.target.files[0];
	};

	const validatePassword = () => {
		if (password === correctPassword) {
			return true;
		} else {
			errorMessage = "Invalid upload password";
			return false;
		}
	};

	const uploadFile = () => {
		if (!file) {
			errorMessage = "No file selected";
			return;
		}

		if (!showPasswordPrompt) {
			// Show the password prompt
			showPasswordPrompt = true;
			return;
		}

		if (!validatePassword()) {
			return;
		}

		const formData = new FormData();
		formData.append('jsonfile', file);

		// Clear previous error message before starting upload
		errorMessage = null;

		uploadAndFetchData(formData);
	};

	const uploadAndFetchData = async (formData) => {
		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				const result = await response.json();
				insertedId = result.insertedId;
				await fetchData(insertedId);
			} else {
				throw new Error('Failed to upload the file');
			}
		} catch (error) {
			errorMessage = error.message;
		}
	};

	const fetchData = async (id) => {
		try {
			const response = await fetch(`/api/document/${id}`);

			if (response.ok) {
				uploadedData = await response.json();
			} else {
				throw new Error('Failed to fetch the data');
			}
		} catch (error) {
			errorMessage = error.message;
		}
	};

	const logout = async () => {
		loading = true;
		try {
			const response = await fetch('/api/logout', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' }
			});

			if (response.ok) {
				goto('/');
			}
		} finally {
			loading = false;
		}
	};

	onMount(() => {
		loading = false;
		reset();
	});
</script>
<svelte:head>
	<title>xayanide - dashboard</title>
</svelte:head>
{#if loading}
	<Loading {elapsed} />
{:else}
	<div>
		<p>You're at Dashboard</p>
		<p><a href="{base}/">Go to Home</a></p>
		<p><a href="{base}/profile">Go to Profile</a></p>
		<p>Email: {data.user.email}</p>
		<button on:click={logout} disabled={loading}>{loading ? 'Loading...' : 'Log out'}</button>
		<hr />
		<h2>Upload JSON File</h2>

		<input type="file" accept=".json" on:change={handleFileChange} />
		{#if showPasswordPrompt}
			<input type="password" placeholder="Enter password" bind:value={password} />
		{/if}
		<button on:click={uploadFile} disabled={loading}>
			{showPasswordPrompt ? 'Submit Password' : 'Upload'}
		</button>

		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}

		{#if uploadedData}
			<h3>Uploaded Data</h3>
			<pre>{JSON.stringify(uploadedData, null, 2)}</pre>
		{/if}
	</div>
{/if}
