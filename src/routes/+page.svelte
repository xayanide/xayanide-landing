<script>
  import logo from '$lib/images/logo.png';
  import { base } from '$app/paths';
</script>
<style>
    
@font-face{
    font-family:Assistant;
    font-style:normal;
    font-weight:300;
    font-display:swap;
    src:url(https://fonts.gstatic.com/s/assistant/v19/2sDPZGJYnIjSi6H75xkZZE1I0yCmYzzQtrhnEGE.ttf) format('truetype')
}

:root{
    --background-height:100vh;
    --site-language-alignment:left;
    --site-language-direction:ltr;
    --site-language-flex-alignment:flex-start;
    --site-language-indent-left:1;
    --site-language-indent-right:0;
    --site-language-margin-left:0;
    --site-language-margin-right:auto;
    --viewport-height:100vh
}
a{
    color:inherit;
    text-decoration:underline;
    transition:none
}
a[onclick]:not([href]){
    cursor:pointer
}
#wrapper{
    -webkit-overflow-scrolling:touch;
    align-items:center;
    display:flex;
    flex-direction:column;
    justify-content:center;
    min-height:var(--viewport-height);
    overflow:hidden;
    position:relative;
    z-index:2
}
#main{
    --alignment:center;
    --flex-alignment:center;
    --indent-left:1;
    --indent-right:1;
    --margin-left:auto;
    --margin-right:auto;
    --border-radius-tl:0;
    --border-radius-tr:0;
    --border-radius-br:0;
    --border-radius-bl:0;
    align-items:center;
    display:flex;
    flex-grow:0;
    flex-shrink:0;
    justify-content:center;
    max-width:100%;
    position:relative;
    text-align:var(--alignment);
    z-index:1
}
#main>.inner{
    --padding-horizontal:0.5rem;
    --padding-vertical:0.5rem;
    --spacing:0rem;
    --width:44rem;
    border-radius:var(--border-radius-tl) var(--border-radius-tr) var(--border-radius-br) var(--border-radius-bl);
    max-width:100%;
    position:relative;
    width:var(--width);
    z-index:1;
    padding:var(--padding-vertical) var(--padding-horizontal)
}
#main>.inner>*{
    margin-top:var(--spacing);
    margin-bottom:var(--spacing)
}
#main>.inner>:first-child{
    margin-top:0!important
}
#main>.inner>:last-child{
    margin-bottom:0!important
}
.image{
    display:block;
    line-height:0;
    max-width:100%;
    position:relative
}
.image .frame{
    -webkit-backface-visibility:hidden;
    -webkit-transform:translate3d(0,0,0);
    display:inline-block;
    max-width:100%;
    overflow:hidden;
    vertical-align:top;
    width:100%
}
.image .frame img{
    border-radius:0!important;
    max-width:100%;
    vertical-align:top;
    width:inherit
}
#image04 .frame{
    width:6rem;
    border-radius:100%;
    transition:none
}
#image04 .frame img{
    transition:none
}
p{
    direction:var(--site-language-direction);
    position:relative
}
#text01:not(:first-child){
    margin-top:.875rem!important
}
#text01:not(:last-child){
    margin-bottom:.875rem!important
}
#text01{
    color:#fff;
    font-family:Assistant,sans-serif;
    letter-spacing:.1rem;
    width:calc(100% + .1rem);
    font-size:1em;
    line-height:1;
    font-weight:300
}
#text02{
    color:#a19999;
    font-family:Arial,sans-serif;
    font-size:.625em;
    line-height:2;
    font-weight:400
}
#text02 a:hover{
    color:#fff
}
#text02 a{
    text-decoration:none
}
#text02 span.p:nth-child(n+2){
    margin-top:1rem
}
#divider04{
    align-items:center;
    border:0;
    display:flex;
    justify-content:var(--flex-alignment);
    min-height:1rem;
    padding:0;
    position:relative;
    width:100%
}

#divider04:before{
	content:"";
    width:7rem;
    background-color:#fff;
    height:1px;
    border-radius:0
}
.container{
    position:relative
}
.container>.wrapper{
    vertical-align:top;
    position:relative;
    max-width:100%;
    border-radius:inherit
}
.container>.wrapper>.inner{
    vertical-align:top;
    position:relative;
    max-width:100%;
    border-radius:inherit;
    text-align:var(--alignment)
}
#container01{
    --alignment:center;
    --flex-alignment:center;
    --indent-left:1;
    --indent-right:1;
    --margin-left:auto;
    --margin-right:auto
}
#container01>.wrapper{
    display:block;
    margin:0 auto 0 auto;
    width:15rem;
    background-color:transparent
}
#container01>.wrapper>.inner{
    --gutters:0rem;
    --padding-horizontal:0.5rem;
    --padding-vertical:0.75rem;
    --spacing:0rem;
    padding:var(--padding-vertical) var(--padding-horizontal)
}
#container01.default>.wrapper>.inner>*{
    margin-bottom:var(--spacing);
    margin-top:var(--spacing)
}
#container01.default>.wrapper>.inner>:first-child{
    margin-top:0!important
}
#container01.default>.wrapper>.inner>:last-child{
    margin-bottom:0!important
}

.icc-credits{
    display:block;
    opacity:1!important;
    position:relative;
    transition-delay:0s!important
}
.icc-credits span{
    border-radius:24px;
    cursor:pointer;
    display:inline-block;
    font-family:Arial,sans-serif;
    font-size:12px;
    letter-spacing:0;
    line-height:1;
    position:relative;
    text-decoration:none;
    width:auto
}
.icc-credits span a{
    display:inline-block;
    padding:.5em .375em;
    position:relative;
    text-decoration:none;
    transition:color .25s ease,transform .25s ease;
    z-index:1
}
.icc-credits span a:before{
    content:"( ";
    opacity:1;
    transition:opacity .25s ease
}
.icc-credits span a:after{
    content:" )";
    opacity:1;
    transition:opacity .25s ease
}
.icc-credits span::after{
    background-image:linear-gradient(30deg,#a464a1 15%,#3b5dad 85%);
    border-radius:inherit;
    box-shadow:0 .25em 1.25em 0 rgba(0,0,0,.25);
    content:"";
    display:block;
    height:calc(100% + 2px);
    left:-1px;
    opacity:0;
    pointer-events:none;
    position:absolute;
    top:-1px;
    transition:opacity .25s ease,box-shadow .25s ease,transform .25s ease;
    width:calc(100% + 2px)
}
.icc-credits span:hover{
    text-transform:none!important
}
.icc-credits span:hover a{
    color:#fff!important;
    transform:scale(1.1) translateY(-.05rem)
}
.icc-credits span:hover a:before{
    opacity:0
}
.icc-credits span:hover a:after{
    opacity:0
}
.icc-credits span:hover::after{
    opacity:1;
    transform:scale(1.1) translateY(-.05rem)
}
#credits span{
    color:rgba(255,255,255,.498);
    margin-top:.5rem!important
}

</style>
<svelte:head>
	<title>Xayanide - Home</title>
	<meta name="description" content="Xayanide's Home" />
</svelte:head>
<div id="wrapper" class="bg-black">
  <div id="main">
      <div class="inner">
          <div id="container01" class="container default">
              <div class="wrapper">
                  <div class="inner">
                      <div id="image04" class="image">
                          <a id="logo" href="https://imgur.com/rHpy1VZ" target="_blank" class="frame">
                              <img src="{logo}" alt="Xayanide Logo">
                          </a>
                      </div>
                      <h1 id="text01">Xayanide</h1>
                      <p id="text02">
                          <a id="discord-invite" href="https://discord.com/invite/8SevbgGrar" target="_blank">
                                my personal discord server here
                          </a>
                          <p id="text02">
                            <a id="discord-invite" href="{base}/findme">
                                find me here :)
                            </a>
                      </p>
                      <hr id="divider04">
                  </div>
              </div>
          </div>
          <div id="credits" class="icc-credits">
            <span><a href="https://carrd.co/dashboard/add">Was Made with Carrd</a></span>
          <br>
            <span><a href="https://kit.svelte.dev">Now Built with SvelteKit</a></span>
        </div>
      </div>
  </div>
</div>
