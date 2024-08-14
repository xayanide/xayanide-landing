<script>
  import { onMount } from 'svelte';
  import handles from '$lib/data/links.json';

  let httpsLinks = [];
  let httpLinks = [];
  let httpsSearch = '';
  let httpSearch = '';

  const fetchSiteData = async () => {
    const promises = handles.links.map(async (link) => {
      const hostname = new URL(link).hostname;
      return { link, hostname: hostname.replace(/^www\./, '') };
    });

    const favicons = await Promise.all(promises);

    // Separate into http and https
    httpsLinks = favicons.filter(favicon => favicon.link.startsWith('https'));
    httpLinks = favicons.filter(favicon => favicon.link.startsWith('http') && !favicon.link.startsWith('https'));

    // Sort both arrays alphabetically by hostname
    httpsLinks.sort((a, b) => a.hostname.localeCompare(b.hostname));
    httpLinks.sort((a, b) => a.hostname.localeCompare(b.hostname));
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

<div class="bg-white p-4 space-y-4">
  <p>Hi, feel free to visit me on the following links provided, you can also search the hostname of your choice and find me there. :^)</p>
  <p>This website is still heavy on development, things may look janky as I continue to learn.</p>
  <div class="mb-4">
    <h2 class="text-xl font-bold">Link Statistics</h2>
    <p>Last link was added on 8/14/2024</p>
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
      {#each filteredLinks(httpsLinks, httpsSearch) as { link, hostname }}
        <a 
          href={link} 
          class="block p-4 mb-2 text-blue-500 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
          target="_blank"
        >
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
      {#each filteredLinks(httpLinks, httpSearch) as { link, hostname }}
        <a 
          href={link} 
          class="block p-4 mb-2 text-blue-500 hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
          target="_blank"
        >
          <span class="font-semibold">{hostname}</span>
        </a>
      {/each}
    </div>
  </div>
</div>
