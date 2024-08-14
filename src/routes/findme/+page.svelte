<script>
  import { onMount } from 'svelte';
  import handles from '$lib/data/links.json';
  import { base } from '$app/paths';

  let httpsLinks = [];
  let httpLinks = [];
  let httpsSearch = '';
  let httpSearch = '';
  let lastAddedLinkDate = "Loading...";

  const defaultFaviconUrl = `${base}/no-favicon.ico`; // Path to your default favicon

  const getFaviconUrl = (hostname) => `https://favicone.com/${hostname}?s=32`;

  // Function to fetch favicon and fallback to default
  const fetchFavicon = async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = () => resolve(defaultFaviconUrl);
    });
  };

  const fetchSiteData = async () => {
    const promises = handles.links.map(async (linkData) => {
      const linkUrl = linkData.url;
      const url = new URL(linkUrl);
      const faviconUrl = getFaviconUrl(url.hostname);
      const actualFaviconUrl = await fetchFavicon(faviconUrl);
      return {
        protocol: url.protocol,
        link: linkUrl,
        hostname: url.hostname.replace(/^www\./, ''),
        metadata: linkData.metadata,
        faviconUrl: actualFaviconUrl
      };
    });
    const websites = await Promise.all(promises);
    console.log(websites)
    httpsLinks = websites.filter(website => website.protocol.startsWith("https"));
    httpLinks = websites.filter(website => website.protocol.startsWith("http") && !website.protocol.startsWith('https'));
    httpsLinks.sort((a, b) => a.hostname.localeCompare(b.hostname));
    httpLinks.sort((a, b) => a.hostname.localeCompare(b.hostname));
    lastAddedLinkDate = handles.links
      .map(link => link.metadata['link-date-added'])
      .sort((a, b) => new Date(b) - new Date(a))[0];
  };

  let httpsCount = 0;
  let httpCount = 0;
  let totalCount = 0;
  let httpsResultsCount = 0;
  let httpResultsCount = 0;

  const searchResults = (links, search) =>
    links.filter(link => link.hostname.toLowerCase().includes(search.toLowerCase()));

  const formatResultText = (count) => count > 1 ? 'results' : 'result';
  const formatHostNameText = (count) => count > 1 ? 'hostnames' : 'hostname';

  onMount(async () => {
    await fetchSiteData();

    httpsCount = httpsLinks.length;
    httpCount = httpLinks.length;
    totalCount = httpsCount + httpCount;
    httpsResultsCount = searchResults(httpsLinks, httpsSearch).length;
    httpResultsCount = searchResults(httpLinks, httpSearch).length;
  });

  $: httpsHostNamesResults = searchResults(httpsLinks, httpsSearch);
  $: httpHostNamesResults = searchResults(httpLinks, httpSearch);
</script>
<svelte:head>
  <title>Xayanide - Find Me</title>
  <meta name="description" content="Find Xayanide here" />
</svelte:head>

<div class="container mx-auto p-4 space-y-4">
  <p class="text-gray-700">Hi, feel free to visit me on the following links provided. You can also search for the hostname of your choice and find me there. :^)</p>
  <p class="text-gray-500">This website is still under development; things may look janky as I continue to learn.</p>
  <a href="{base}/" class="btn btn-secondary no-animation">
    <span class="text-green-500">Go back</span>
  </a>
  <div class="mb-4">
    <h2 class="text-2xl font-semibold mb-2 text-gray-500">Link Statistics</h2>
    <p class="text-gray-600">Last link was added on {lastAddedLinkDate}</p>
    <p class="text-gray-600">Total link count: {totalCount}</p>
  </div>

  <div class="flex flex-col lg:flex-row gap-4">
    <!-- HTTPS Column -->
    <div class="flex-1 bg-white shadow rounded-md flex flex-col">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold mb-2">HTTPS</h2>
        <input 
          type="text" 
          placeholder="Search for {formatHostNameText(httpsHostNamesResults.length)}..." 
          bind:value={httpsSearch} 
          class="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <p class="text-gray-600">
          Found {httpsHostNamesResults.length} {formatResultText(httpsHostNamesResults.length)}
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
          placeholder="Search for {formatHostNameText(httpHostNamesResults.length)}..." 
          bind:value={httpSearch} 
          class="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <p class="text-gray-600">
          Found {httpHostNamesResults.length} {formatResultText(httpHostNamesResults.length)}
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
