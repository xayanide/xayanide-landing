<script>
	import { enhance } from '$app/forms';
	import fileChunksToURL from '../../lib/fileChunksToURL.js';
	import Loading from '../Loading.svelte';
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

	export let data; // the data returned by the `load` function of `./+page.server.ts`

	let loading = true; // sending the data can take a few seconds with slow internet connection
	let pictureURL; // the generated URL for the preview of the imported file, once the form submitted.

	const handleSubmit = (submitData) => {
		loading = true;

		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				// Once the image is uploaded successfully,
				// we want to show it immediately to the user.
				// Use an `onChange` event listener on the file input
				// to handle that as soon as an image is imported if you want a better preview.
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

	// Send the raw data of big pictures can slow down your website.
	// Therefore, we're only received the Object ID so that we know where to find.
	// Fetching the data on the client side is great for performance.
	// Indeed, displaying a loading animation for a big file is no big deal.
	async function fetchPictureRawData() {
		const res = await fetch('/api/fetchFile', {
			method: 'POST',
			body: JSON.stringify({
				fileId: data.user.picture
			})
		});

		if (res.ok) {
			const { data, type } = await res.json();
			const fileURL = fileChunksToURL(data, type);
			pictureURL = fileURL;
			loading = false;
			reset();
			return fileURL;
		} else {
			throw new Error(await res.text());
		}
	}
	async function deletePicture() {
		loading = true;
		try {
			const res = await fetch('/api/deleteFile', {
				method: 'DELETE'
			});

			if (res.ok) {
				pictureURL = undefined;
				data.user.picture = undefined;
			} else {
				const { error } = await res.json();
				console.error(error);
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
			console.error(error);
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
	<main>
		You're viewing your profile.
		<br />
		<a href="{base}/">Go to Home</a>
		<br />
		<a href="{base}/dashboard">Go to Dashboard</a>
		<p>Email {data.user.email}</p>
		<div class="container-picture">
			{#if pictureURL}
				<img src={pictureURL} alt="avatar" />
			{:else if data.user.picture}
				<img src={pictureURL} alt="avatar" />
			{:else}
				<span>No picture</span>
			{/if}
		</div>
	</main>
	<hr />
	<form
		method="POST"
		enctype="multipart/form-data"
		action="/profile?/upload"
		use:enhance={handleSubmit}
	>
		<fieldset>
			<legend>Upload your profile picture</legend>
			<input name="picture" type="file" accept="image/png, image/jpeg, image/webp" />
			<br />
			<button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button>
		</fieldset>
	</form>
	{#if data.user.picture !== undefined}
		<button on:click={deletePicture} disabled={loading}
			>{loading ? 'Loading...' : 'Delete Picture'}</button
		>
	{/if}
{/if}

<style>
	main .container-picture {
		border: 1px solid grey;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		display: flex;
		overflow: hidden;
	}

	main .container-picture > span {
		margin: auto;
	}

	main img {
		width: 100%;
		object-fit: cover;
	}
</style>
