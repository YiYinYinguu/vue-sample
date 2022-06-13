<template>
    <div class="container">
        <div>
            <big-logo></big-logo>
            <h1 class="title">vue sample</h1>
            <div class="links">
                <div @click="getMenu()" class="button--green">welcome</div>
            </div>
        </div>
    </div>
</template>

<script>
import bigLogo from "./../components/bigLogo.vue";
export default {
    name: "welcomeView",
        metaInfo: {
            title: "Welcome",

            // override the parent template and just use the above title only
            titleTemplate: "%s | vue-sample",
            meta: [
                {
                    name: "description",
                    content:
                        "Front End Developer - Vue.js Developer, building Single Page Applications (SPA) in Vuejs, responsive websites on Desktop, Tablet and Mobile.",
                },
                {
                    name: "keywords",
                    content:
                        "web-candy, ",
                },
            ],
    },
    data: function () {
        return {

        };
    },
        components: {
        "big-logo": bigLogo,
    },
    mounted() {
       this.$store.commit("updateMenu",false);
    },
    methods: {
        getMenu() {  
            this.$store.commit("updateMenu",true);    
            this.$router.push("/vue-sample")
        },
    },
};
</script>

<style>
.container {
    margin: 0 auto;
    min-height: 95vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.title {
    font-family: "Quicksand", "Source Sans Pro", -apple-system,
        BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
        sans-serif;
    display: block;
    font-weight: 300;
    font-size: 50px;
    color: #fff;
    letter-spacing: 1px;
    width: 100%;
}
.subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
}

.links {
    padding-top: 15px;
}
/* X X X X DESKTOP  (last)  X X X  */

@media only screen and (min-device-width: 992px) {
    .title {
        font-size: 100px;
        color: #35495e;
    }
}
</style>
