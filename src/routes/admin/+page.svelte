<script>
  import Loading from '../Loading.svelte';
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  import fileChunksToURL from '$lib/fileChunksToURL';
  import { base } from '$app/paths';
	const startTime = Date.now();
	$: elapsed = Date.now() - startTime;
	const interval = setInterval(() => {
		elapsed = Date.now() - startTime;
	}, 1000);
	const reset = () => {
		clearInterval(interval);
	};
  export let data;

  let loading = false;
  let fileURL; // URL for displaying the uploaded file
  let jsonData; // Variable to store and display JSON data

  // Function to handle user logout
  async function logout() {
    loading = true;

    try {
      const response = await fetch("/api/logout", {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        goto("/");
      }
    } finally {
      loading = false;
    }
  }

  // Function to fetch raw file data from the server
  async function fetchFileRawData() {
    const res = await fetch("/api/fetchFile", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId: data.user.file })
    });

    if (res.ok) {
      const { data, type } = await res.json();
      return fileChunksToURL(data, type);
    } else {
      throw new Error(await res.text());
    }
  }
  async function loadJsonData() {
    try {
      const jsonUrl = await fetchFileRawData();
      const response = await fetch(jsonUrl);
      reset()
      return await response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }
    const createAndResolvePromises = async () => {
		return reset();
	}

  // Function to handle file upload
  const handleFileUpload = (submitData) => {
    loading = true;

    return async ({result, update}) => {
      await update();
      if (result.type === "success") {
        // Once the image is uploaded successfully,
        // we want to show it immediately to the user.
        // Use an `onChange` event listener on the file input
        // to handle that as soon as an image is imported if you want a better preview.
        const file = submitData.formData.get("file");
        if (file) {
          fileURL = URL.createObjectURL(file);
          const response = await fetch(fileURL);
          jsonData = await response.json();
        }
      } else {
        console.error(result);
      }
      loading = false;
    };
  };
  
</script>
{#await createAndResolvePromises()}
	<Loading {elapsed} />
{:then}
<div>
  You're at Admin
  <br />
  <p><a href="{base}/">Go to Home</a></p>
  <p><a href="{base}/profile">Go to Profile</a></p>
  <p>Email {data.user.email}</p>
  <button on:click={logout} disabled={loading}>{loading ? "Loading..." : "Log out"}</button>
  <hr />
  <form method="POST" action="/admin?/upload" enctype="multipart/form-data" use:enhance={handleFileUpload}>
    <fieldset>
      <legend>Upload JSON File</legend>
      <input name="file" type="file" accept=".json" />
      <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload"}</button>
    </fieldset>
  </form>

  <div class="container-file">
    {#if fileURL !== undefined}
    <pre>{JSON.stringify(jsonData, null, 4)}</pre>
    {:else if data.user.file !== undefined}
    {#await loadJsonData()}
    <Loading {elapsed} />
    {:then jsonData}
    <pre>{JSON.stringify(jsonData, null, 4)}</pre>
  {:catch loadError}
    <span>{loadError.message}</span>
  {/await}
    {:else}
      <span>No file</span>
    {/if}
  </div>
</div>
{/await}
<style>
  .container-file {
    border: 1px solid grey;
    padding: 1em;
    margin-top: 1em;
  }
</style>
