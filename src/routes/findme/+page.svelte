<script>
  import { onMount } from 'svelte';
  import handles from '$lib/data/links.json';
  import { base } from '$app/paths';

  let httpsLinks = [];
  let httpLinks = [];
  let httpsSearch = '';
  let httpSearch = '';
  let lastAddedLinkDate = "Loading...";

  const getFaviconUrl = (hostname) => `https://favicone.com/${hostname}?s=32`;

  const fetchSiteData = async () => {
    const promises = handles.links.map(async (linkData) => {
      const url = linkData.url;
      const hostname = new URL(url).hostname;
      return {
        link: url,
        hostname: hostname.replace(/^www\./, ''),
        metadata: linkData.metadata,
        faviconUrl: getFaviconUrl(hostname)
      };
    });

    const websites = await Promise.all(promises);

    httpsLinks = websites.filter(website => website.link.startsWith('https'));
    httpLinks = websites.filter(website => website.link.startsWith('http') && !website.link.startsWith('https'));

    httpsLinks.sort((a, b) => a.hostname.localeCompare(b.hostname));
    httpLinks.sort((a, b) => a.hostname.localeCompare(b.hostname));

    lastAddedLinkDate = handles.links
      .map(link => link.metadata['link-date-added'])
      .sort((a, b) => new Date(b) - new Date(a))[0];
  };

  let httpsCount = "Loading...";
  let httpCount = "Loading...";
  let totalCount = "Loading...";
  let httpsResultsCount = "Loading...";
  let httpResultsCount = "Loading...";

  const filteredLinks = (links, search) =>
    links.filter(link => link.hostname.toLowerCase().includes(search.toLowerCase()));

  const formatResultText = (count) => count === 1 ? 'result' : 'results';
  const formatHostNameText = (count) => count === 1 ? 'hostname' : 'hostnames';


  onMount(async () => {
    await fetchSiteData();

    httpsCount = httpsLinks.length;
    httpCount = httpLinks.length;
    totalCount = httpsCount + httpCount;
    httpsResultsCount = filteredLinks(httpsLinks, httpsSearch).length;
    httpResultsCount = filteredLinks(httpLinks, httpSearch).length;
  });

  $: filteredHttpsLinks = filteredLinks(httpsLinks, httpsSearch);
  $: filteredHttpLinks = filteredLinks(httpLinks, httpSearch);
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
          placeholder="Search for {formatHostNameText(filteredHttpsLinks.length)}..." 
          bind:value={httpsSearch} 
          class="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <p class="text-gray-600">
          Found {filteredHttpsLinks.length} {formatResultText(filteredHttpsLinks.length)}
        </p>
      </div>
      <div class="flex-1 overflow-y-auto p-2">
        {#each filteredHttpsLinks as { link, hostname, faviconUrl }}
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
          placeholder="Search for {formatHostNameText(filteredHttpLinks.length)}..." 
          bind:value={httpSearch} 
          class="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <p class="text-gray-600">
          Found {filteredHttpLinks.length} {formatResultText(filteredHttpLinks.length)}
        </p>
      </div>
      <div class="flex-1 overflow-y-auto p-2">
        {#each filteredHttpLinks as { link, hostname, faviconUrl }}
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
