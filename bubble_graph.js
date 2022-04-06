d3.json("neat_data/yearly_clocks.json").then((yearly_hours) => {

  // compute total hours clocked per year
  // console.log(d3.rollup(yearly_hours, v => d3.sum(v, d => d.hours), d => d.year))

  const width = window.innerWidth - 100,
        height = window.innerHeight - 100,
        marginLR = 50
        marginBT = 50

  const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `-20 -20 ${width} ${height}`)


  const x_scale = d3.scaleLinear()
    .domain(d3.extent(yearly_hours, d => d.year))
    .range([0, width - marginLR])

  const y_scale = d3.scaleLinear()
    .domain(d3.extent(yearly_hours, d => d.clck_hour))
    .range([0, height - marginBT])

  const r_scale = d3.scaleLinear()
    .domain(d3.extent(yearly_hours, d => d.hours))
    .range([2, 50])

  const xAxis = d3.axisBottom(x_scale).ticks(x_scale.domain()[1] - x_scale.domain()[0]).tickFormat(d3.format("c"))
  const yAxis = d3.axisLeft(y_scale)

  svg.append("g")
    .attr("transform", `translate(0, 0)`)
    .call(xAxis);

  svg.append("g")
    .attr("transform", `translate(0, 0)`)
    .call(yAxis);

  const g = svg.append("g")
     // .attr("fill", "none")
     // .attr("stroke-linecap", "round");

  g.selectAll("circle")
      .data(yearly_hours)
      .join("circle")
        .attr("cx", (d) => x_scale(+d.year))
        .attr("cy", (d) => y_scale(+d.clck_hour))
        .attr("r", (d) => r_scale(d.hours))
        .attr("fill", "steelblue")
        .attr("fill-opacity", "0.6")

  g.selectAll("text")
    .data(yearly_hours)
    .join("text")
    .attr("x", (d) => x_scale(+d.year))
    .attr("y", (d) => y_scale(+d.clck_hour))
    .attr("dy", ".35em")
    .text((d) => d.hours)

})

/**
 * {2014 => 376}
 * {2015 => 418}
 * {2016 => 263}
 * {2017 => 340}
 * {2018 => 279}
 * {2019 => 298}
 * {2020 => 270}
 */
