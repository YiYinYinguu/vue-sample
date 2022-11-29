<template>
    <vegaSVG />
    <!-- <testSVG /> -->
</template>

<script>
import { getDataInsights } from '@antv/lite-insight';
import { SVG } from '@svgdotjs/svg.js'
import vegaSVG from '../../public/svg/2.svg';
import testSVG from '../../public/svg/test.svg';
import {AudioUtils} from "../components/utils/AudioUtils";
import {InsightUtils} from "../components/utils/InsightUtils";
export default {
    name: "DataInsight",
    data: function () {
        return {
            data: this.$store.state.spec.data.values,
            column: this.$store.state.spec.column,
            insights: [],
            svg: null,
            common_insights: [],
            timing: [],
            audioSrc: null,
            description: [],
        };
    },
    mounted() {
        // MeasureMethod = 'SUM' | 'COUNT' | 'MAX' | 'MIN' | 'MEAN' | 'COUNT_DISTINCT';
        const all_insights =  getDataInsights(this.data, {
            limit: 30,
            homogeneous: true,
            visualization: true
        })
        const L1_description = InsightUtils.generateL1Description(this.$store.state.spec)
        this.description.push(L1_description)
        this.insights.push({description: L1_description})
        // this.getEndTime(L1_description).then(a => {
        //     this.timing += a;
        //     this.insights.push({timing: this.timing})
        // })


        this.$store.commit("updateInsights", all_insights)
        if(all_insights.homogeneousInsights.length > 2){
            this.common_insights = all_insights.homogeneousInsights.slice(0, 2)
        }
        else {
            this.common_insights = all_insights.homogeneousInsights
        }

        if(this.common_insights.length < 2){
            for(const insight of all_insights.insights){
                if(this.common_insights.length + this.insights.length === 3){
                    break
                }
                if(insight.subspace.length > 0 || this.$store.state.insightType.includes(insight.measures[0].method)){
                    console.log("1")
                    insight.description = InsightUtils.generateL3Description(insight)
                    this.description.push(insight.description)
                    this.insights.push(insight)
                    // this.getEndTime(insight.description).then(a => {
                    //     this.timing += a;
                    //     insight.timing = this.timing
                    //     this.insights.push(insight)
                    // })
                }
            }
        }
        console.log(this.insights)
        this.getTimeList(this.description).then(
            (time)=>{
                let old = 0
                time.map((t, i)=>{
                    this.insights[i].timing = old+t
                    old += t
                })
            })
        console.log(this.insights)
        this.svg = SVG('#app svg')
        for(const insight of this.insights){
            if(insight.patterns){
                insight.patterns.forEach(pattern => {
                    // console.log(pattern)
                    if(pattern.type === 'trend')
                        InsightUtils.addTrendAnno(this.svg, insight, this.$store.state.spec, false)
                    else if(pattern.type === 'time_series_outlier')
                        // this.addCircleLineAnno(this.svg, insight, pattern, false)
                        InsightUtils.addArrowAnno(this.svg, insight, pattern, false)
                })
            }

        }

        // commonset
        // {type: 'commonness', significance: 1, insightType: 'trend', childPatterns: Array(3), commSet: Array(3)}
        // {trend: 'increasing', significance: 0.9991633728688807, regression: {…}, type: 'trend', dimension: 'x', …}


    },
    methods: {
        async getTimeList(description_list)  {
            const time_list = await Promise.all(
                description_list.map(async (des) => {
                    const cur_time =  await AudioUtils.getEndTime(des)
                    return cur_time
            }))
            // console.log(time_list)
            return time_list
        }
    },
    components: {
        vegaSVG, testSVG
  }
};
</script>

<style>

</style>
