<script>
  import logo from '$lib/images/logo.png';
  import { enhance } from '$app/forms';

  let isConnected = false;
  let loading = false;
  export let form;

  // Handle form submission
  const handleSubmit = () => {
    loading = true;

    return async ({ result, update }) => {
      await update();
      if (result.type === "success") {
        isConnected = true;
      }
      loading = false;
    };
  };
</script>

<main style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f4f4;">
  <div style="width: 100%; max-width: 400px; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); text-align: center;">
    {#if loading}
      <div style="display: flex; justify-content: center; align-items: center; height: 100px;">
        <img src="{logo}" alt="Loading" style="width: 50px; height: 50px; animation: spin 1s linear infinite;" />
      </div>
    {:else}
      {#if form?.error}
        <p style="color: #f44336; margin-bottom: 16px;">{form.error}</p>
      {/if}
      {#if !isConnected}
        <form method="POST" use:enhance={handleSubmit} style="display: flex; flex-direction: column; gap: 16px;">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            style="padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            style="padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;"
          />
          <button
            formaction="?/login"
            disabled={loading}
            style="padding: 12px; background-color: #007BFF; color: #fff; border: none; border-radius: 4px; cursor: pointer;"
          >
            Log in
          </button>
          <button
            formaction="?/register"
            disabled={loading}
            style="padding: 12px; background-color: #6c757d; color: #fff; border: none; border-radius: 4px; cursor: pointer;"
          >
            Register
          </button>
        </form>
      {:else}
        <p style="margin-top: 16px;">
          Go look at the <a href="/admin" style="color: #007BFF; text-decoration: none;">admin</a>
        </p>
      {/if}
    {/if}
  </div>
</main>

<style>
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
