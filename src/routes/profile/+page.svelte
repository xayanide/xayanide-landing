<script>
	import { enhance } from '$app/forms';
	import fileChunksToURL from '../../lib/fileChunksToURL.js';
	import Loading from '../Loading.svelte';
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
	let loading = true;
	let pictureURL;

	const handleSubmit = (submitData) => {
		loading = true;

		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				const file = submitData.formData.get('picture');
				if (file) {
					pictureURL = URL.createObjectURL(file);
				}
			} else {
				console.error(result);
			}
			loading = false;
		};
	};

	async function fetchPictureRawData() {
		try {
			console.log(data.user.picture);
			const res = await fetch('/api/fetchFile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ fileId: data.user.picture })
			});

			if (res.ok) {
				const { data, type } = await res.json();
				pictureURL = fileChunksToURL(data, type);
				loading = false;
				reset();
				return pictureURL;
			} else {
				throw new Error(await res.text());
			}
		} catch (error) {
			console.error('Error fetching picture data:', error);
			loading = false;
		}
	}

	async function deletePicture() {
		loading = true;
		try {
			const res = await fetch('/api/deleteFile', { method: 'DELETE' });

			if (res.ok) {
				pictureURL = undefined;
				data.user.picture = undefined;
			} else {
				const { error } = await res.json();
				console.error('Error deleting picture:', error);
			}
		} catch (error) {
			console.error('Error deleting picture:', error);
		}
		loading = false;
	}

	onMount(async () => {
		try {
			if (data.user.picture) {
				await fetchPictureRawData();
			}
		} catch (error) {
			console.error('Error on mount:', error);
		} finally {
			loading = false;
			reset();
		}
	});
</script>

<svelte:head>
	<title>xayanide - profile</title>
</svelte:head>

{#if loading}
	<Loading {elapsed} />
{:else}
	<main class="p-6 bg-gray-900 text-white min-h-screen max-w-4xl mx-auto">
		<h1 class="text-3xl mb-4">Your Profile</h1>
		<p><a href="{base}/" class="text-blue-400 underline">Go to Home</a></p>
		<p><a href="{base}/dashboard" class="text-blue-400 underline">Go to Dashboard</a></p>
		<p class="text-lg mb-4">Email: {data.user.email}</p>

		<div class="flex justify-center items-center mb-6">
			{#if pictureURL}
				<img
					src={pictureURL}
					alt="Profile"
					class="w-24 h-24 rounded-full border-2 border-gray-600 object-cover"
				/>
			{:else if data.user.picture}
				<img
					src={pictureURL}
					alt="Profile"
					class="w-24 h-24 rounded-full border-2 border-gray-600 object-cover"
				/>
			{:else}
				<span class="text-gray-400 text-xl">No Picture</span>
			{/if}
		</div>

		<hr class="my-6 border-gray-700" />

		<form
			method="POST"
			enctype="multipart/form-data"
			action="/profile?/upload"
			use:enhance={handleSubmit}
			class="space-y-4"
		>
			<fieldset>
				<legend class="text-xl mb-2">Upload Your Profile Picture</legend>
				<input
					name="picture"
					type="file"
					accept="image/png, image/jpeg, image/webp"
					class="file:border file:border-gray-600 file:bg-gray-800 file:text-white file:rounded file:py-2 file:px-4"
				/>
				<button
					type="submit"
					class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					disabled={loading}
				>
					{loading ? 'Loading...' : 'Submit'}
				</button>
			</fieldset>
		</form>

		{#if data.user.picture !== undefined}
			<button
				on:click={deletePicture}
				class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
				disabled={loading}
			>
				{loading ? 'Loading...' : 'Delete Picture'}
			</button>
		{/if}
	</main>
{/if}
