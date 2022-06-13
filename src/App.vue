<template>
  <div id="app">
  <app-header :menu="xmenu"></app-header>
    <router-view/>
  </div>
</template>
<script>

import appHeader from "./components/appHeader.vue";

export default {
    name: "appView",
    head() {
        return {
            title: "default",
            // override the parent template and just use the above title only
            titleTemplate: "%s | vue sample",
        };
    },
    data() {
        return {
            xmenu: false,
        };
    },
    mounted() {
        this.$store.watch(
            () => {
                this.xmenu =  this.$store.state.menu; 
            },    
        );
    },

    components: {
        "app-header": appHeader,
    },
    methods: {
        getMenu() {
            this.menu = this.$store.state.menu;
        },
    },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.button--green {
    display: inline-block;
    border-radius: 15px;
    border: 2px solid #fff;
    background-color: #f90;
    color: #fff;
    text-decoration: none;
    padding: 10px 30px;
}

.button--green:hover {
        border: 2px solid #f90;
    color: #f90;
    background-color: #000F;
}

.button--grey {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #35495e;
    color: #35495e;
    text-decoration: none;
    padding: 10px 30px;
    margin-left: 15px;
}

.button--grey:hover {
    color: #fff;
    background-color: #35495e;
}
</style>
