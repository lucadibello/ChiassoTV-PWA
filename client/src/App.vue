<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  metaInfo: {
    meta: [
        { property: 'og:locale', content: "it_CH"},
        { property: 'og:locale:alternate', content: "it_IT"},
        { property: 'og:title', content: "ChiassoTV - la web tv Ticinese"},
        { property: 'og:site_name', content: 'ChiassoTV'},
        { property: 'og:type', content: 'website'},    
        { name: 'robots', content: 'index,follow'} 
    ],
    htmlAttrs: {
      lang: 'it',
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>