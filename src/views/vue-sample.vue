<template>
    <div class="page row justify-content-center">
        <div class="col-sm-8 col-md-6 col-lg-5">
            <h1>vue sample</h1>
            <div class="sorter">
                sort data :
                <select v-model="currentOrder">
                    <option value="raw">raw data</option>
                    <option value="last">Sort by Last Name</option>
                </select>
            </div>

            <div class="detail">
                <div class="v-collapse">
                    <v-collapse-group :onlyOneActive="true">
                        <v-collapse-wrapper
                            v-for="(user, index) in orderedUsers"
                            :key="index"
                        >
                            <div
                                @click="toggle(index)"
                                class="header"
                                v-collapse-toggle
                            >
                                <div
                                    class="col-12 col-sm-12 col-md-12 col-lg-12"
                                >
                                    <h4>
                                        {{ user.id }} - {{ user.first_name }}
                                        {{ user.last_name }}
                                    </h4>
                                </div>
                            </div>
                            <div class="content" v-collapse-content>
                                <div
                                    class="
                                        text-center
                                        row
                                        justify-content-md-center
                                    "
                                >
                                    <div
                                        class="
                                            avatar
                                            col-12 col-sm-12 col-md-12 col-lg-8
                                        "
                                    >
                                        <img
                                            :src="user.avatar"
                                            :alt="user.first_name"
                                            :title="user.first_name"
                                        />
                                    </div>
                                    <h4>{{ user.email }}</h4>

                                </div>
                            </div>
                        </v-collapse-wrapper>
                    </v-collapse-group>
                </div>
            </div>
        </div>

        <div class="col-sm-12 col-md-0 col-lg-5 welcome">
            <router-link to="/vue-sample">
                <img
                    :src="require('../../src/assets/img/el-camino.svg')"
                    alt="code-sample logo"
                />
            </router-link>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";

export default {
    name: "geoData",
        metaInfo: {
            title: "vue sample",

            // override the parent template and just use the above title only
            titleTemplate: "%s | vue sample",
            meta: [
                {
                    name: "description",
                    content: "| vue sample test",
                },
                {
                    name: "keywords",
                    content: "| vue sample",
                },
            ],

    },

    data: function () {
        return {
            currentOrder: "raw",
            geodataIn: {
                users: [],
            },
            tog: [true, true, true, true],
        };
    },
    computed: {
        orderedUsers: function () {
            if (this.currentOrder == "last") {
                return _.sortBy(this.geodataIn, "last_name");
            } else {
                return this.geodataIn;
            }
        },
    },

    mounted() {
        axios
            .get(this.$store.state.appURL + "page=1")
            .then((response) => {
                this.geodataIn = response.data.data;
            })
            .catch((error) => {
                for (let [value] of Object.entries(error.response.data)) {
                    this.errors.push(value[0]);
                }
            });
    },
    methods: {
        toggleOrder(name) {
            this.currentOrder = name;
        },

        togInit() {
            let i = 0;
            for (i = 0; i < this.tog.length; i++) {
                this.$set(this.tog, i, true);
            }
        },
        toggle(togInt) {
            this.togInit();
            this.$set(this.tog, togInt, !this.tog[togInt]);
        },
    },
};
</script>

<style scoped>
.welcome a img {
    position: relative;
    top: 0px;
    height: auto;
    width: 100%;
}
.sorter {
    font-size: 20px !important;
    color: #fff;
    background-color: #323f4b;
    padding-bottom: 2px;
    line-height: inherit;
    text-align: right;
}
.sorter select {
    position: relative;
    top: 1px;
    right: 1px;
    color: #fff;
    background-color: inherit;
    font-weight: 800;  
    border-left-color: #fff;
    border-top-color: #fff;
    border-right-color: #fff;
    border-bottom-color: #fff;
}
</style>
