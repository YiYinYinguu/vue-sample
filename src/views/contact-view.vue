<template>
    <div class="page row">
        <div class="col-sm-4 col-md-4 col-lg-4"></div>
        <div class="col-sm-4 col-md-4 col-lg-4">
            <h1 class="grey">contact</h1>
            <div class="grey">
                <p>Roland Alderson - Front End Developer - Designer</p>
                <div class="row">
                    <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <p>
                            <font-awesome-icon
                                class="orange fa-inverse"
                                icon="envelope"
                            />
                            :
                            <a
                                class="email"
                                href="mailto:&#105;&#110;&#102;&#111;&#064;&#119;&#101;&#098;&#045;&#099;&#097;&#110;&#100;&#121;&#046;&#099;&#111;&#109;"
                                >&#105;&#110;&#102;&#111;&#064;&#119;&#101;&#098;&#045;&#099;&#097;&#110;&#100;&#121;&#046;&#099;&#111;&#109;</a
                            >
                        </p>
                        <p>
                            <font-awesome-icon
                                class="orange fa-inverse"
                                icon="phone-alt"
                            />
                            : +44(0)7871 088608
                        </p>
                    </div>
                </div>

                <p class="orange">Web Candy</p>
                
            </div>
        </div>
        <div class="col-sm-4 col-md-4 col-lg-4"></div>
    </div>
</template>

<script>
export default {
    name: "contactView",
        metaInfo: {
            title: "Contact Roland Alderson",

            // override the parent template and just use the above title only
            titleTemplate: "%s | geo data",
            meta: [
                {
                    name: "description",
                    content:
                        "Roland Alderson - Front End Developer - Designer - Vue.js Developer",
                },
                {
                    name: "keywords",
                    content:
                        "code-sample,  Web Candy, contact",
                },
            ],
    },

    data: function () {
        return {};
    },
};
</script>
<style scoped>

.grey {
    text-align: center;
    color: #fff;
}
.fa-inverse, .orange {
    color: #f58320;
}
/* X X X X DESKTOP  (last)  X X X  */

@media only screen and (min-device-width: 992px) {
    .grey {
        color: #35495e;
    }
}
</style>
