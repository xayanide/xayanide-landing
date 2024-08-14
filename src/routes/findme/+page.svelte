<script>
  import { onMount } from 'svelte';
  import handles from '$lib/data/links.json';

  let httpsLinks = [];
  let httpLinks = [];

  const fetchSiteData = async () => {
    const promises = handles.links.map(async (link) => {
      const hostname = new URL(link).hostname;
      return { link, hostname };
    });

    const favicons = await Promise.all(promises);

    // Separate into http and https
    httpsLinks = favicons.filter(favicon => favicon.link.startsWith('https'));
    httpLinks = favicons.filter(favicon => favicon.link.startsWith('http') && !favicon.link.startsWith('https'));

    // Sort both arrays alphabetically by hostname
    httpsLinks.sort((a, b) => a.hostname.localeCompare(b.hostname));
    httpLinks.sort((a, b) => a.hostname.localeCompare(b.hostname));
  };

  onMount(async () => {
    await fetchSiteData();
  });
</script>

<div class="bg-xayadark container mx-auto p-6 min-h-screen text-base-content">
  <h2 class="text-3xl font-extrabold mb-6">HTTPS Links</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {#each httpsLinks as { link, hostname }}
      <a href={link} class="btn btn-outline btn-accent flex items-center p-4 rounded-lg transition-all hover:bg-accent-focus hover:text-base-100"
        target="_blank">
        <div class="flex items-center gap-3">
          <span class="font-semibold">{hostname}</span>
        </div>
      </a>
    {/each}
  </div>

  <div class="my-8 border-t border-base-300"></div>

  <h2 class="text-3xl font-extrabold mb-6">HTTP Links</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {#each httpLinks as { link, hostname }}
      <a href={link} class="btn btn-outline btn-accent flex items-center p-4 rounded-lg transition-all hover:bg-accent-focus hover:text-base-100"
        target="_blank">
        <div class="flex items-center gap-3">
          <span class="font-semibold">{hostname}</span>
        </div>
      </a>
    {/each}
  </div>
</div>
