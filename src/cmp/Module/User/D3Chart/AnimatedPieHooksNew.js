import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Pie = props => {
  const ref = useRef(null);
  const cache = useRef(props.data);


  const createPie = d3
    .pie()
    .padAngle(.09)
    .value(d => d.value)
    .sort(null);
  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius)
    .cornerRadius(0)
    
  const colors = d3.scaleOrdinal(["#428FEC","#FFC727"]);
  const format = d3.format(".2f");

  useEffect(
    () => {
      const data = createPie(props.data);

      const prevData = createPie(cache.current);
      const group = d3.select(ref.current);
      const groupWithData = group.selectAll("g.arc").data(data);

      groupWithData.exit().remove();

      const groupWithUpdate = groupWithData
        .enter()
        .append("g")
        .attr("class", "arc");

      const path = groupWithUpdate
        .append("path")
        .merge(groupWithData.select("path.arc"))
        .on('mouseover', function(d, i) {
          // console.log("mouseover on", this);
          d3.select(this)
        .transition()
        .duration('100')
               .attr('opacity', '.50');
        })
        .on('mouseout', function(d, i) {
          // console.log("mouseout", this);
          // return the mouseover'd element
          // to being smaller and black
          d3.select(this)
            .transition()
            .duration('100')
               .attr('opacity', '1');
        })
      const arcTween = (d, i) => {
        const interpolator = d3.interpolate(prevData[i], d);

        return t => createArc(interpolator(t));
      };

      path
        .attr("class", "arc")
        .attr("fill", (d, i) => colors(i))
        .transition()
        .attrTween("d", arcTween);

      cache.current = props.data;
    },
    [props.data]
  );

  return (
    <div className="chart_svg">
      <svg width={props.width} height={props.height}>
        <g
          ref={ref}
          transform={`translate(${props.outerRadius} ${props.outerRadius})`}
        />
      </svg>
    </div>
  );
};

export default Pie;
