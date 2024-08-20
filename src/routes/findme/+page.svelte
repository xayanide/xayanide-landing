<script>
	import Loading from '../Loading.svelte';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	let loading = true;
	let jsonFileId = '';
	let jsonUploadDate = '';
	let httpsLinks = [];
	let httpLinks = [];
	let httpsSearch = '';
	let httpSearch = '';
	let lastAddedLinkDate = 'Unknown';
	const defaultFaviconUrl = `${base}/no-favicon.ico`;

	// Fetch and prepare data
	async function fetchSitesData() {
		const idRes = await fetch(`/api/latest-json`);
		if (!idRes.ok) throw new Error('Failed to fetch JSON ID');
		const { insertedId, upload_date } = await idRes.json();
		jsonFileId = insertedId;
		jsonUploadDate = upload_date;

		const res = await fetch(`/api/document/${insertedId}`);
		if (!res.ok) throw new Error('Failed to fetch document');

		const json = await res.json();
		return json.links.map(async (linkData) => {
			const url = new URL(linkData.url);
			const faviconUrl = await fetchFavicon(`https://favicone.com/${url.hostname}?s=32`);
			return {
				protocol: url.protocol,
				link: linkData.url,
				hostname: url.hostname.replace(/^www\./, ''),
				metadata: linkData.metadata,
				faviconUrl
			};
		});
	}

	// Handle favicon fetching with fallback
	const fetchFavicon = async (url) => {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = url;
			img.onload = () => resolve(url);
			img.onerror = () => resolve(defaultFaviconUrl);
		});
	};

	onMount(async () => {
		try {
			const websites = await Promise.all(await fetchSitesData());
			httpsLinks = websites.filter(({ protocol }) => protocol.startsWith('https'));
			httpLinks = websites.filter(
				({ protocol }) => protocol.startsWith('http') && !protocol.startsWith('https')
			);
			httpsLinks.sort((a, b) => a.hostname.localeCompare(b.hostname));
			httpLinks.sort((a, b) => a.hostname.localeCompare(b.hostname));
			lastAddedLinkDate = websites
				.map(({ metadata }) => metadata['link-date-added'])
				.sort((a, b) => new Date(b) - new Date(a))[0];
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	});

	$: httpsHostNamesResults = httpsLinks.filter(({ hostname }) =>
		hostname.toLowerCase().includes(httpsSearch.toLowerCase())
	);
	$: httpHostNamesResults = httpLinks.filter(({ hostname }) =>
		hostname.toLowerCase().includes(httpSearch.toLowerCase())
	);
</script>

<svelte:head>
	<title>xayanide - find me</title>
	<meta name="description" content="Try to find xayanide here" />
</svelte:head>

{#if loading}
	<Loading />
{:else}
	<div class="container bg-black mx-auto p-4 space-y-4">
		<p class="text-gray-500">
			Hi, you may visit me on the following links provided. You can also look for the hostname of
			your choice and see if I'm there. :^)
		</p>
		<p class="text-gray-500">
			My website is still under heavy development; the code and its look may look janky as I
			continue to learn.
		</p>
		<a href="{base}/" class="btn btn-secondary no-animation">
			<span class="text-green-500">Go back</span>
		</a>
		<div class="mb-4">
			<h2 class="text-2xl font-semibold mb-2 text-gray-500">Link Statistics</h2>
			<p class="text-gray-600">File ID: {jsonFileId}</p>
			<p class="text-gray-600">File Upload Date: {jsonUploadDate}</p>
			<p class="text-gray-600">Most Recent Added Link: {lastAddedLinkDate}</p>
			<p class="text-gray-600">Total link count: {httpsLinks.length + httpLinks.length}</p>
		</div>

		<div class="flex flex-col lg:flex-row gap-4">
			<!-- HTTPS Column -->
			<div class="flex-1 bg-white shadow rounded-md flex flex-col">
				<div class="p-4 border-b border-gray-200">
					<h2 class="text-xl font-semibold mb-2">HTTPS</h2>
					<input
						type="text"
						placeholder="Search for {httpsHostNamesResults.length > 1
							? 'hostnames'
							: 'hostname'}..."
						bind:value={httpsSearch}
						class="w-full p-2 border border-gray-300 rounded-md mb-4"
					/>
					<p class="text-gray-600">
						Found {httpsHostNamesResults.length}
						{httpsHostNamesResults.length > 1 ? 'results' : 'result'}
					</p>
				</div>
				<!-- Fixed Height Result Container -->
				<div class="flex-1 overflow-y-auto p-2" style="max-height: 400px;">
					{#each httpsHostNamesResults as { link, hostname, faviconUrl }}
						<a
							href={link}
							class="block p-4 mb-2 text-blue-600 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
							target="_blank"
						>
							<img src={faviconUrl} alt="Favicon" class="inline-block w-5 h-5 mr-2" />
							<span class="font-medium">{hostname}</span>
						</a>
					{/each}
				</div>
			</div>

			<!-- HTTP Column -->
			<div class="flex-1 bg-white shadow rounded-md flex flex-col">
				<div class="p-4 border-b border-gray-200">
					<h2 class="text-xl font-semibold mb-2">HTTP</h2>
					<input
						type="text"
						placeholder="Search for {httpHostNamesResults.length > 1 ? 'hostnames' : 'hostname'}..."
						bind:value={httpSearch}
						class="w-full p-2 border border-gray-300 rounded-md mb-4"
					/>
					<p class="text-gray-600">
						Found {httpHostNamesResults.length}
						{httpHostNamesResults.length > 1 ? 'results' : 'result'}
					</p>
				</div>
				<!-- Fixed Height Result Container -->
				<div class="flex-1 overflow-y-auto p-2" style="max-height: 400px;">
					{#each httpHostNamesResults as { link, hostname, faviconUrl }}
						<a
							href={link}
							class="block p-4 mb-2 text-blue-600 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
							target="_blank"
						>
							<img src={faviconUrl} alt="Favicon" class="inline-block w-5 h-5 mr-2" />
							<span class="font-medium">{hostname}</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
