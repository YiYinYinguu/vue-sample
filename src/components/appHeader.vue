<template>
    <div v-if="menu" class="menu">
        <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand href="http://web-candy.com"
                ><img
                    :src="require('../assets/img/logo_senceive.svg')"
                    alt="web-candy logo"
                    width=auto
                    height="50px"
            /></b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>

                    <router-link to="/geo-data" class="nav-link"
                        >geo-data</router-link
                    >
                    
                    <router-link to="/contact" class="nav-link">contact</router-link>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name: "appHeader",
    data: function () {
        return {

        };
    },
    props: ["menu"],
    components: {},
    methods: {},
};
</script>

<style>

</style>
