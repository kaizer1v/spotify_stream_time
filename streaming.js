// d3.csv('streaming_data_all.csv').then((data) => {
d3.json('neat_data/trail_2014-04-30.json').then((data) => {

  // sort by date time
  data = data.sort((a, b) => {
    return new Date(a['ts']) - new Date(b['ts'])
  }).filter((d) => d['reason_end'] === "trackdone")

  const max_occur = d3.least(d3.rollup(data, v => v.length, d => d['master_metadata_album_artist_name']), ([, count]) => -count)
  const total_hours = d3.rollup
  const marginLeft = 50
  const marginRight = 20
  const marginTop = 80
  const buffer = 50
  const width = window.innerWidth
  const height = window.innerHeight
  const fixed_date = "2020-01-01"
  console.log('total hours streamed =', d3.sum(data, d => d['ms_played']) / (60 * 60 * 1000))

  const scale_time = d3.scaleTime()
    .domain([Date.parse(fixed_date + " 00:00:00 GMT+05:30"), Date.parse(fixed_date + " 23:59:59 GMT+05:30")])
    // .domain(d3.extent(data, (d) => d.ts))
    .range([0, width - (marginLeft + marginRight)])
    .nice()

  const scale_date = d3.scaleTime()
    .domain(d3.extent(data, (d) => d.ts))
    .range([0, height - marginTop])

  const rect_height = 20

  const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const xAxis = d3.axisTop(scale_time).ticks(24).tickFormat(d3.timeFormat("%H:%M"))
  const yAxis = d3.axisLeft(scale_date).ticks(2).tickFormat(d3.timeFormat("%b %d, %Y"));

  // ------- x & y axes
  svg.append("g")
    .attr("transform", `translate(${marginLeft}, ${marginTop + buffer})`)
    .call(yAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").clone()
      .attr("x2", width)
      .attr("stroke-opacity", 0.1))
    // .call(g => g.append("text")
    //   .attr("x", -marginLeft)
    //   .attr("y", 10)
    //   .attr("fill", "currentColor")
    //   .attr("text-anchor", "start")
    // );

  svg.append("g")
    .attr("transform", `translate(${marginLeft}, ${marginTop})`)
    .call(xAxis)


  // ------- rect
  const bars = svg.append("g")
    .selectAll("g")
    .data(data)
    .join("rect")
      // .attr("x", (d) => scale_time(d['ts'] - d['ms_played']))
      .attr("x", (d) => {
        let start_time_dt = new Date(d['ts'] - d['ms_played'])
        let start_hhmmss = [start_time_dt.getHours(), start_time_dt.getMinutes(), start_time_dt.getSeconds()].join(":")
        let start_time_to_scale = new Date(Date.parse(fixed_date +' '+ start_hhmmss + ' GMT+05:30'))
        return scale_time(start_time_to_scale)
      })
      .attr("y", marginTop + buffer)
      .attr("width", (d) => scale_time(d['ts']) - scale_time(d['ts'] - d['ms_played']))
      .attr("height", rect_height)
      .attr("stroke", "red")
      .attr("stroke-width", 1)
      .attr("data-artist", d => d['master_metadata_album_artist_name'])
      .attr("data-datetime", d => new Date(d['ts']))
      .attr("fill", (d) => {
        console.log(max_occur)
        if(d['master_metadata_album_artist_name'] === max_occur[0]) return '#2ca02c'
        return '#e3e3e3'
      })
      .attr("opacity", 0.8)

    bars.attr("transform", `translate(${marginLeft}, 0)`)

  const labels = svg.append("g")
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("x", 60)
    .attr("y", (d) => {
      let start_time_dt = new Date(d['ts'] - d['ms_played'])
      let start_hhmmss = [start_time_dt.getHours(), start_time_dt.getMinutes(), start_time_dt.getSeconds()].join(":")
      let start_time_to_scale = new Date(Date.parse(fixed_date +' '+ start_hhmmss + ' GMT+05:30'))
      return scale_time(start_time_to_scale)
    })
    .attr("text-anchor", "end")
    .attr("transform", "translate("+ (marginLeft ) +", " + (height / 2) + ") rotate(-90)")
    .text((d) => d['master_metadata_album_artist_name'])
    .attr("font-size", "0.5rem")
})
