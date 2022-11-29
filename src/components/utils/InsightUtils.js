function addTrendAnno(svg, insight, spec, isCom) {
  let point_r = 0
  let first_idx = getInsightPointIdx(insight, spec.data.values)
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

  const last_point = point[first_idx + spec.column]
  for(s of segmentPath(line_1, point_r, svg, arrow_marker)){
      s.marker('end', arrow_marker)
  }
}

function getInsightPointIdx(insight, data) {
  const type = insight.subspace[0].value
  // console.log(this.data)
  for(let i = 0; i < data.length; i++){
      if(data[i].type === type){
          return i
      }
  }
  return -1
}

function addCircleLineAnno(svg, insight, pattern, isCom) {
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
}

function addArrowAnno(svg, insight, pattern, isCom) {
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

}

function segmentPath(path, point_r, svg, arrow_marker){
  let pathSet = []
  const array = path.array()[0]
  // console.log(path)
  for(let i = 0; i < array.length-1; i++){
      svg.line(array[i][1]+point_r, array[i][2], array[i+1][1]-point_r*1.2, array[i+1][2])
      .stroke({ color: path.attr('stroke')[0], width: path.attr('stroke-width')[0]})
      .marker('end', arrow_marker)
  }
  return pathSet
}

function generateL3Description(insight) {
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
}

function generateL1Description(spec) {
  const title_desc = `This is a line chart entitled ${spec.title}. `
  const x_axis_desc = `Horizon y-axis is plotted from ${spec.data.values[0].x} to ${spec.data.values[spec.column-1].x}. `
  const y_axis_desc = `${spec.title} is plotted on the y-axis. `
  return title_desc+x_axis_desc+y_axis_desc
}

function addAnnotation(insights) {
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
}

export const InsightUtils = {
  generateL1Description,
  generateL3Description,
  addArrowAnno,
  addTrendAnno,
  addCircleLineAnno,
}