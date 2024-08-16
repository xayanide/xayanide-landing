<script>
    import logo from '$lib/images/logo.png';
    import { base } from '$app/paths';
  </script>
  
  <svelte:head>
    <title>Xayanide - Home</title>
    <meta name="description" content="Xayanide's Home" />
  </svelte:head>
  
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
              <a href="{base}/login">Login</a>
            </div>
          </div>
        </div>
        <div>
          <span>
            <a href="https://carrd.co/dashboard/add">( Was Made with Carrd )</a>
          </span>
          <br />
          <span>
            <a href="https://kit.svelte.dev">( Now Remade with SvelteKit )</a>
          </span>
        </div>
      </div>
    </div>
  </div>
  
