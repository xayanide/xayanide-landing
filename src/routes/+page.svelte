<script>
  	import Loading from './Loading.svelte';
    import logo from '$lib/images/logo.png';
    import { base } from '$app/paths';
    import { invalidateAll, goto } from "$app/navigation";
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
    let loading = false;
    async function gotoAdmin() {
      goto('/admin')
    }
    async function logout() {
    loading = true;

    const response = await fetch("/api/logout", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    loading = false;

    if (response.status === 200) {
      invalidateAll()
    }
  }

  </script>
  
<svelte:head>
    <title>Xayanide - Home</title>
    <meta name="description" content="Xayanide's Home" />
</svelte:head>
{#await createAndResolvePromises()}
	<Loading {elapsed} />
{:then}
  <div>
    <div>
      <div>
        <div>
          <div>
            <div>
              <a href="https://imgur.com/rHpy1VZ" target="_blank">
                <img src="{logo}" alt="Xayanide Logo" />
              </a>
            </div>
            <h1>Xayanide</h1>
            <p>
              <a href="https://discord.com/invite/8SevbgGrar" target="_blank">
                my personal discord server here
              </a>
            </p>
            <p>
              <a href="{base}/findme">
                find me here :)
              </a>
            </p>
            <div>
              <a href="https://mynickname.com/xayanide">
                <img src="https://mynickname.com/forum6t8/xayanide.gif" alt="Certificate for nickname xayanide, is registered to: https://xayanide.pages.dev" />
              </a>
            </div>
            <hr />
            <div>
              {#if (data.userId === undefined)}
              <a href="{base}/login">Login</a>
              {:else} 
              <button on:click={logout} disabled={loading}>{loading ? "Loading..." : "Log out"}</button>
              <br />
              <button on:click={gotoAdmin}>Admin</button>

            {/if}
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/await}
