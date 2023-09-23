import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Pie = props => {
  const ref = useRef(null);
  const cache = useRef(props.data);


  const createPie = d3
    .pie()
    .value(d => d.value)
    .sort(null);
  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius)
    // .on("mouseover", function (d) {
    //   d3.select("#tooltip")
    //       .style("left", d3.event.pageX + "px")
    //       .style("top", d3.event.pageY + "px")
    //       .style("opacity", 1)
    //       .select("#value")
    //       .text(d.value);
    //     })
    // .on("mouseout", function () {
    //   // Hide the tooltip
    //   d3.select("#tooltip")
    //       .style("opacity", 0);;
    //  });
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
        .attr("class", "arc")
        
      const path = groupWithUpdate
        .append("path")
        .merge(groupWithData.select("path.arc"));

      const arcTween = (d, i) => {
        const interpolator = d3.interpolate(prevData[i], d);

        return t => createArc(interpolator(t));
      };

      path
        .attr("class", "arc")
        .attr("fill", (d, i) => colors(i))
        .transition()
        .attrTween("d", arcTween)
        
      
     cache.current = props.data;
    },
    [props.data],
    
  );

  return (
    <div className="gender_chart_svg mt-4">
      <svg width={props.width} height={props.height} >
        <g
          ref={ref}
          transform={`translate(${props.outerRadius} ${props.outerRadius})`}
        />
      </svg>

      {/* <div className="gender_d_div">

        <ul style={{display:"flex", paddingLeft:"0"}} className="mt-4">
          <li style={{fontSize: "26px", "listStyle": "square", color: "#428FEC", marginLeft: "16px"}}><span style={{fontSize: "20px",padding:"10px 10px 10px 0px", color:"#242424"}}>Male</span></li>
          <li style={{fontSize: "26px","listStyle": "square", color: "#FFC727", marginLeft: "46px"}}><span style={{fontSize: "20px", padding:"10px 10px 10px 0px", color:"#242424"}}>Female</span></li>
        </ul>

      </div> */}
      
    </div>
    
  );
};

export default Pie;
