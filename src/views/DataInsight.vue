<template>
    <vegaSVG />
    <!-- <testSVG /> -->
</template>

<script>
import { getDataInsights } from '@antv/lite-insight';
import { SVG } from '@svgdotjs/svg.js'
import { pid } from 'process';
import vegaSVG from '../../public/svg/2.svg';
import testSVG from '../../public/svg/test.svg';
export default {
    name: "DataInsight",
    data: function () {
        return {
            data: this.$store.state.spec.data.values,
            column: this.$store.state.spec.column,
            insights: [],
            svg: null,
            common_insights: []
        };
    },
    mounted() {
        // MeasureMethod = 'SUM' | 'COUNT' | 'MAX' | 'MIN' | 'MEAN' | 'COUNT_DISTINCT';
        const all_insights =  getDataInsights(this.data, {
            limit: 30,
            homogeneous: true,
            visualization: true
        })
        this.$store.commit("updateInsights", all_insights)
        if(all_insights.homogeneousInsights.length > 2){
            this.common_insights = all_insights.homogeneousInsights.slice(0, 2)
        }
        else {
            this.common_insights = all_insights.homogeneousInsights
        }
        if(this.common_insights.length < 2){
            for(const insight of all_insights.insights){
                if(this.common_insights.length + this.insights.length === 2){
                    break
                }
                if(insight.subspace.length > 0){
                    insight.description = this.generateDescription(insight)
                    this.insights.push(insight)
                }
                else if(this.$store.state.insightType.includes(insight.measures[0].method)){
                    insight.description = this.generateDescription(insight)
                    this.insights.push(insight)
                }
            }
        }
        console.log(this.insights, this.common_insights)
        this.svg = SVG('#app svg')
        for(const insight of this.insights){
            insight.patterns.forEach(pattern => {
                if(pattern.type === 'trend')
                    this.addTrendAnno(this.svg, insight, false)
                else if(pattern.type === 'time_series_outlier')
                    this.addCircleLineAnno(this.svg, insight, pattern, false)
                    // this.addArrowAnno(this.svg, insight, pattern, false)
            })
        }
        
        // commonset
        // {type: 'commonness', significance: 1, insightType: 'trend', childPatterns: Array(3), commSet: Array(3)}
        // {trend: 'increasing', significance: 0.9991633728688807, regression: {…}, type: 'trend', dimension: 'x', …}
        
        
    },
    methods: {
        addAnnotation(insights) {
            const svg = SVG('#app svg')
            const g_point = svg.find('.point')
            const last_point = g_point.find('path')[0]
            // const last_point_center = [last_point]

            let anno_circle_radius = 100
            let anno_dy = 200
            let anno_center = [last_point.cx(), last_point.cy() - anno_dy]

            let arrow_marker = svg.marker(5, 4, function (add) {
                add.path('M0,0 V4 L5,2 Z').fill({ color: '#f06', opacity: 0.5 })
            }).ref(0.1, 2)

            // let choice = 'arrow'
            // let choice = 'trend'
            let choice = 'circle'

            if (choice === 'arrow') {
                const anno_arrow = svg.line(anno_center[0], anno_center[1] + anno_circle_radius * 0.4, last_point.cx(), last_point.cy() - anno_circle_radius)
                    .stroke({ color: '#f06', width: 5, opacity: 0.5 })
                anno_arrow.marker('end', arrow_marker)
                const anno_text = svg.text("0.5").font({ size: 50, opacity: 0.5, fill: '#f06', family: 'Inconsolata' })
                    .move(anno_center[0] - anno_circle_radius * 0.32, anno_center[1] - anno_circle_radius * 0.32)
            }
            else if (choice === 'trend') {
                const first_point = point[point.length - 1]
                const anno_trend_arrow = svg.line(first_point.cx(), first_point.cy() - anno_circle_radius, last_point.cx(), last_point.cy() - anno_circle_radius)
                    .stroke({ color: '#f06', width: 5, opacity: 0.5 })
                anno_trend_arrow.marker('end', arrow_marker)
            }
            else {
                const anno_circle = svg.circle(anno_circle_radius).stroke({ color: '#f06', opacity: 0.5, width: 5 }).fill('none')
                    .cx(anno_center[0]).cy(anno_center[1])
                const anno_text = svg.text("0.5").font({ size: 50, opacity: 0.5, fill: '#f06', family: 'Inconsolata' })
                    .move(anno_center[0] - anno_circle_radius * 0.32, anno_center[1] - anno_circle_radius * 0.32)
                const anno_line = svg.line(last_point.cx(), last_point.cy() - anno_circle_radius * 0.3, anno_center[0], anno_center[1] + anno_circle_radius * 0.6).stroke({ color: '#f06', opacity: 0.5, width: 5, linecap: 'round' })
            }
        },
        addTrendAnno(svg, insight, isCom) {
            let point_r = 0
            let first_idx = this.getInsightPointIdx(insight)
            const line_1 = svg.find(`.line_${insight.subspace[0].value.split(' ')[0]}`)
            line_1.remove()
            const point = svg.find('.point path')
            const first_point = point[first_idx]
            if(point.length > 0 ){
                point_r = first_point.bbox().width/2
            }
            let anno_circle_radius = 0
            let anno_dy = 200
            let arrow_marker = svg.marker(5, 4, function (add) {
                add.path('M0,0 V4 L5,2 Z').fill({ color: line_1.attr('stroke')[0] })
            }).ref(4.5, 2)
            
            const last_point = point[first_idx + this.column]
            for(s of this.segmentPath(line_1, point_r, svg, arrow_marker)){
                console.log(s)
                s.marker('end', arrow_marker)
            }
        },
        addCircleLineAnno(svg, insight, pattern, isCom) {
            const point = svg.find('.point path')
            const title = svg.find('.titled')
            console.log(title.attr()[0]['font-size'])
            const anno_point = point[pattern.index]
            let anno_circle_radius = svg.height()*0.2
            
            let anno_center = [anno_point.bbox().cx, anno_point.bbox().cy]
            console.log(anno_center)
            let anno_dy = svg.height()*0.2
            let direction = 1

            // direction
            if(anno_center[1]-svg.height()/2 > 0){
                direction = -1
            }

            const anno_circle = svg.circle(anno_circle_radius).stroke({ color: '#f06', opacity: 0.5, width: 5 }).fill('none')
                    .cx(anno_center[0]).cy(anno_center[1]+anno_dy*direction)
            const anno_text = svg.text("0.5").x(anno_center[0]).y(anno_center[1]+anno_dy*direction)
                    .font({ size: title.attr()[0]['font-size'], opacity: 0.5, fill: '#f06', family: title.attr()[0]['font'], anchor: 'middle' })
            const anno_line = svg.line(anno_center[0], anno_center[1] + (anno_dy -anno_circle_radius*0.5)*direction, anno_center[0], anno_center[1] )
                    .stroke({ color: '#f06', opacity: 0.5, width: 5, linecap: 'round' })
        },
        addArrowAnno(svg, insight, pattern, isCom) {
            const point = svg.find('.point path')
            const anno_point = point[pattern.index]
            let anno_circle_radius = 100
            let anno_center = [anno_point.bbox().cx, anno_point.bbox().cy]

            let anno_dy = -svg.height()*0.15

            // direction
            if(anno_center[1]-svg.height()/2 > 0){
                anno_dy = -anno_dy
            }

            let arrow_marker = svg.marker(5, 4, function (add) {
                add.path('M0,0 V4 L5,2 Z').fill({ color: '#f06', opacity: 0.5 })
            }).ref(0.1, 2)
            const anno_arrow = svg.line(anno_center[0], anno_center[1] - anno_dy*2, anno_center[0], anno_center[1] - anno_dy)
                    .stroke({ color: '#f06', width: 5, opacity: 0.5 })
            anno_arrow.marker('end', arrow_marker)
            // const anno_text = svg.text("0.5").font({ size: 50, opacity: 0.5, fill: '#f06', family: 'Inconsolata' })
            //     .move(anno_center[0] - anno_circle_radius * 0.32, anno_center[1] - anno_circle_radius * 0.32)
            
        },
        getInsightPointIdx(insight) {
            const type = insight.subspace[0].value
            // console.log(this.data)
            for(let i = 0; i < this.data.length; i++){
                if(this.data[i].type === type){
                    return i
                }
            }
            return -1
        },
        segmentPath(path, point_r, svg, arrow_marker){
            let pathSet = []
            const array = path.array()[0]
            // console.log(path)
            for(let i = 0; i < array.length-1; i++){
                svg.line(array[i][1]+point_r, array[i][2], array[i+1][1]-point_r*1.2, array[i+1][2])
                .stroke({ color: path.attr('stroke')[0], width: path.attr('stroke-width')[0]})
                .marker('end', arrow_marker)
            }
            return pathSet
        },
        generateDescription(insight) {
            // one pattern
            let des = ''
            if(insight.patterns.length === 1){
                if(insight.patterns[0].type === 'trend') {
                    des = `The ${insight.patterns[0].measure} of ${insight.subspace[0].value} goes ${insight.patterns[0].trend} from ${insight.data[0][insight.patterns[0].measure]} to ${insight.data[insight.data.length-1][insight.patterns[0].measure]}.`
                    // console.log(des)
                }
            }
            if(insight.patterns.length === 2){
                let trend_idx = -1, outlier_idx = -1
                insight.patterns.forEach((pattern, idx) => {
                    if(pattern.type === 'trend') trend_idx = idx
                    else if(pattern.type === 'time_series_outlier') outlier_idx = idx
                })
                if(trend_idx >= 0 && outlier_idx >= 0){
                    des = `The ${insight.patterns[trend_idx].measure} of ${insight.subspace[0].value}'s overall trend`
                        +` goes ${insight.patterns[trend_idx].trend} from ${insight.data[0][insight.patterns[trend_idx].measure]} to ${insight.data[insight.data.length-1][insight.patterns[trend_idx].measure]}`
                        +` except ${insight.patterns[outlier_idx].x}.`
                }
            }
            return des
        },
    },
    components: {
        vegaSVG, testSVG
  }
};
</script>

<style>

</style>
