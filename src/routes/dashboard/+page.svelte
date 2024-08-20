<script>
	import Loading from '../Loading.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	export let data;
	let loading = true;
	let jsonData = '';
	let errorMessage = null;
	let successMessage = null; // New state for success messages
	let fileId = '';
	let fileUploadDate = '';

	// State for adding/editing a link
	let newLink = '';
	let linkError = null;
	let editingLink = null;

	// State for file upload
	let file = null;
	let uploadError = null;

	// Fetch the latest JSON file data
	async function fetchLatestJson() {
		try {
			const res = await fetch('/api/latest-json');
			if (!res.ok) throw new Error('Failed to fetch latest JSON ID');
			const { insertedId, upload_date } = await res.json();
			const dataRes = await fetch(`/api/document/${insertedId}`);
			fileId = insertedId;
			fileUploadDate = upload_date;
			if (!dataRes.ok) throw new Error('Failed to fetch latest document');
			const json = await dataRes.json();
			let fetchedJson = JSON.stringify(json, null, 2);
			let updatedJson = removeProperties(JSON.parse(fetchedJson), ['_id', 'upload_date']);
			jsonData = JSON.stringify(updatedJson, null, 2);
		} catch (error) {
			errorMessage = error.message;
		}
	}

	const removeProperties = (obj, props) => {
		const newObj = { ...obj };
		props.forEach((prop) => delete newObj[prop]);
		return newObj;
	};

	const saveChanges = async () => {
		try {
			const formData = new FormData();
			formData.append('jsonfile', new Blob([jsonData], { type: 'application/json' }));

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				await fetchLatestJson(); // Refresh the data after saving
				newLink = ''; // Clear the input field
				editingLink = null; // Clear editing state
				successMessage = 'Changes saved successfully!';
				setTimeout(() => (successMessage = null), 5000); // Clear success message after 5 seconds
			} else {
				throw new Error('Failed to upload the updated JSON');
			}
		} catch (error) {
			errorMessage = error.message;
		}
	};

	const addOrUpdateLink = () => {
		if (!newLink.trim()) {
			linkError = 'Please enter a valid link.';
			return;
		}

		linkError = null;

		try {
			const updatedJson = JSON.parse(jsonData);
			const newEntry = {
				url: newLink,
				metadata: {
					'link-date-added': new Date(
		new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
	).toString(),
					'link-index': updatedJson.links.length > 0 ? updatedJson.links.length + 1 : 1
				}
			};

			if (editingLink !== null) {
				updatedJson.links[editingLink] = newEntry; // Update existing link
			} else {
				updatedJson.links = [...(updatedJson.links || []), newEntry]; // Add new link
			}

			jsonData = JSON.stringify(updatedJson, null, 2);
			saveChanges();
		} catch (error) {
			errorMessage = error.message;
		}
	};

	const editLink = (index) => {
		const linkToEdit = JSON.parse(jsonData).links[index];
		newLink = linkToEdit.url;
		editingLink = index;
	};

	const deleteLink = (index) => {
		try {
			const updatedJson = JSON.parse(jsonData);
			updatedJson.links.splice(index, 1); // Remove the link at the specified index
			jsonData = JSON.stringify(updatedJson, null, 2);
			saveChanges();
		} catch (error) {
			errorMessage = error.message;
		}
	};

	const uploadFile = async () => {
		if (!file) {
			uploadError = 'Please select a file to upload.';
			return;
		}

		uploadError = null;

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/upload-file', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				await fetchLatestJson(); // Refresh the data after uploading
				successMessage = 'File uploaded successfully!';
				setTimeout(() => (successMessage = null), 5000); // Clear success message after 5 seconds
			} else {
				throw new Error('Failed to upload the file.');
			}
		} catch (error) {
			uploadError = error.message;
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

	onMount(async () => {
		try {
			await fetchLatestJson();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>xayanide - dashboard</title>
</svelte:head>

{#if loading}
	<Loading />
{:else}
	<div class="p-6 bg-gray-900 text-white min-h-screen">
		<div class="container mx-auto max-w-4xl">
			<p class="text-xl mb-4">You're at the Dashboard</p>
			<p class="mb-2"><a href="{base}/" class="text-blue-400 underline">Go to Home</a></p>
			<p class="mb-4"><a href="{base}/profile" class="text-blue-400 underline">Go to Profile</a></p>
			<p class="mb-4">Email: {data.user.email}</p>

			<button on:click={logout} class="btn btn-error w-full mb-4" disabled={loading}>
				{loading ? 'Loading...' : 'Log out'}
			</button>

			<hr class="my-6 border-gray-700" />

			<h2 class="text-2xl mb-4">Manage Links</h2>
			<p class="mb-4">File ID: {fileId}</p>
			<p class="mb-4">File Upload Date: {fileUploadDate}</p>

			{#if errorMessage}
				<p class="text-red-500 mt-4">{errorMessage}</p>
			{/if}

			{#if successMessage}
				<p class="text-green-500 mt-4">{successMessage}</p>
			{/if}

			<div class="mb-6">
				<h3 class="text-xl mb-2">Add/Edit Link</h3>
				<input
					type="text"
					placeholder="Enter link"
					bind:value={newLink}
					class="text-black input input-bordered w-full mb-2"
				/>
				{#if linkError}
					<p class="text-red-500 mb-4">{linkError}</p>
				{/if}
				<button on:click={addOrUpdateLink} class="btn btn-primary w-full">
					{editingLink !== null ? 'Update Link' : 'Add Link'}
				</button>
			</div>

			<div>
				<h3 class="text-xl mb-2">Existing Links</h3>
				{#if JSON.parse(jsonData).links && JSON.parse(jsonData).links.length > 0}
					<ul class="list-disc list-inside mb-4">
						{#each JSON.parse(jsonData).links as link, index}
							<li class="flex items-center mb-2">
								<a href={link.url} class="text-blue-400 underline mr-4" target="_blank"
									>{link.url}</a
								>
								<button on:click={() => editLink(index)} class="btn btn-warning btn-sm mr-2"
									>Edit</button
								>
								<button on:click={() => deleteLink(index)} class="btn btn-error btn-sm"
									>Delete</button
								>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-gray-400">No links available.</p>
				{/if}
			</div>

			<div class="mb-6">
				<h3 class="text-xl mb-2">Upload New JSON File</h3>
				<input
					type="file"
					accept=".json"
					on:change={(e) => (file = e.target.files[0])}
					class="mb-2"
				/>
				{#if uploadError}
					<p class="text-red-500 mb-4">{uploadError}</p>
				{/if}
				<button on:click={uploadFile} class="btn btn-primary w-full"> Upload File </button>
			</div>

			<button on:click={saveChanges} class="btn btn-success w-full mb-4"> Save Changes </button>

			<textarea
				bind:value={jsonData}
				rows="20"
				class="textarea textarea-bordered w-full p-2 bg-gray-800 text-white border border-gray-600 rounded mb-4"
			></textarea>
		</div>
	</div>
{/if}
