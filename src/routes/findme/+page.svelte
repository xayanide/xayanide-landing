<script>
  import { onMount } from 'svelte';
  import handles from '$lib/data/links.json';

  let httpsLinks = [];
  let httpLinks = [];
  let httpsSearch = '';
  let httpSearch = '';
  let lastAddedLinkDate = '';

  // Function to generate a favicon URL based on the hostname
  const getFaviconUrl = (hostname) => `https://icons.favicone.com/i/${hostname}/favicon.ico`;

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

    // Separate into http and https
    httpsLinks = websites.filter(website => website.link.startsWith('https'));
    httpLinks = websites.filter(website => website.link.startsWith('http') && !website.link.startsWith('https'));

    // Sort both arrays alphabetically by hostname
    httpsLinks.sort((a, b) => a.hostname.localeCompare(b.hostname));
    httpLinks.sort((a, b) => a.hostname.localeCompare(b.hostname));

    // Find the latest link date
    lastAddedLinkDate = handles.links
      .map(link => link.metadata['link-date-added'])
      .sort((a, b) => new Date(b) - new Date(a))[0]; // Get the most recent date
  };

  let httpsCount;
  let httpCount;
  let totalCount;
  let httpsResultsCount;
  let httpResultsCount;

  // Function to filter links based on search input
  const filteredLinks = (links, search) =>
    links.filter(link => link.hostname.toLowerCase().includes(search.toLowerCase()));

  onMount(async () => {
    await fetchSiteData();

    // Counts
    httpsCount = httpsLinks.length;
    httpCount = httpLinks.length;
    totalCount = httpsCount + httpCount;
    httpsResultsCount = filteredLinks(httpsLinks, httpsSearch).length;
    httpResultsCount = filteredLinks(httpLinks, httpSearch).length;
  });
</script>

<svelte:head>
  <title>Xayanide - Find Me</title>
  <meta name="description" content="Find Xayanide here" />
</svelte:head>

<div class="bg-white p-4 space-y-4">
  <p>Hi, feel free to visit me on the following links provided, you can also search the hostname of your choice and find me there. :^)</p>
  <p>This website is still heavy on development, things may look janky as I continue to learn.</p>
  <div class="mb-4">
    <h2 class="text-xl font-bold">Link Statistics</h2>
    <p>Last link was added on {lastAddedLinkDate}</p>
    <p>Total HTTPS links: {httpsCount}</p>
    <p>Total HTTP links: {httpCount}</p>
    <p>Total links: {totalCount}</p>
  </div>

  <div class="flex space-x-4">
    <!-- HTTPS Column -->
    <div class="w-1/2 max-h-[80vh] overflow-y-auto p-2">
      <h2 class="text-2xl font-bold mb-4">HTTPS Link(s)</h2>
      <input 
        type="text" 
        placeholder="Search HTTPS hostname(s)..." 
        bind:value={httpsSearch} 
        class="input input-bordered w-full mb-4"
      />
      <p class="mb-4">Found {httpsResultsCount} result(s)</p>
      {#each filteredLinks(httpsLinks, httpsSearch) as { link, hostname, faviconUrl }}
        <a 
          href={link} 
          class="block p-4 mb-2 text-blue-500 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
          target="_blank"
        >
          <img src={faviconUrl} alt="Favicon" class="inline-block w-5 h-5 mr-2" />
          <span class="font-semibold">{hostname}</span>
        </a>
      {/each}
    </div>

    <!-- HTTP Column -->
    <div class="w-1/2 max-h-[80vh] overflow-y-auto p-2">
      <h2 class="text-2xl font-bold mb-4">HTTP Link(s)</h2>
      <input 
        type="text" 
        placeholder="Search HTTP hostname(s)..." 
        bind:value={httpSearch} 
        class="input input-bordered w-full mb-4"
      />
      <p class="mb-4">Found {httpResultsCount} result(s)</p>
      {#each filteredLinks(httpLinks, httpSearch) as { link, hostname, faviconUrl }}
        <a 
          href={link} 
          class="block p-4 mb-2 text-blue-500 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
          target="_blank"
        >
          <img src={faviconUrl} alt="Favicon" class="inline-block w-5 h-5 mr-2" />
          <span class="font-semibold">{hostname}</span>
        </a>
      {/each}
    </div>
  </div>
</div>
