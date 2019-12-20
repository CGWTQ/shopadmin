<template>
  <div id="app" class="page-component__scroll">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
html {
  width: 100%;
  height: 100%;
  overflow-x: none;
}
body,
#app {
  overflow-x: none;
  width: 100%;
  height: 100%;
  #app {
    padding: 0;
    margin: 0;
  }
}
</style>
