<script>
  import Loading from '../Loading.svelte';
  import { enhance } from '$app/forms';
  import { goto } from "$app/navigation";
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
  const createAndResolvePromises = async () => {
		return reset();
	}
  export let data;

  let isConnected = false;
  let loading = false;
  export let form;
  const handleLogin = () => {
    if (isConnected) goto('/');
  }
  // Handle form submission
  const handleSubmit = () => {
    loading = true;

    return async ({ result, update }) => {
      await update();
      if (result.type === "success") {
        goto('/');

        isConnected = true;
      }
      loading = false;
    };
  };

  onMount(() => {
    if (data.userId) {
      goto('/');
    }
  });
</script>
{#await createAndResolvePromises()}
	<Loading {elapsed} />
{:then}
{#if data.userId && !isConnected}
  <p>You're already logged in!</p>
{:else}
  <main>
    <div>
      {#if loading}
      <Loading {elapsed} />
      {:else}
        {#if form?.error}
          <p>{form.error}</p>
        {/if}
        {#if !isConnected}
          <p><a href="{base}/">Go to Home</a></p>
          <br />
          <form method="POST" use:enhance={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <button on:submit={handleLogin}
              formaction="?/login"
              disabled={loading}
            >
              Log in
            </button>
            <button
              formaction="?/register"
              disabled={loading}
            >
              Register
            </button>
          </form>
        {/if}
      {/if}
    </div>
  </main>
{/if}
{/await}
