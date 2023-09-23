import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Pie = props => {

  // console.log(props.data)

  const ref = useRef(null);
  const cache = useRef(props.data);


  const createPie = d3
    .pie()
    .value(d => d.value)
    .sort(null);
  const createArc = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius);
  const colors = d3.scaleOrdinal(["#1154A6", "#428FEC", "#E2EFFE"]);
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
        .merge(groupWithData.select("path.arc"));

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


  // console.log("props",props.data)

  return (
    <div className="hra_chart_svg">
      <svg width={props.width} height={props.height} >
        <g
          ref={ref}
          transform={`translate(${props.outerRadius} ${props.outerRadius})`}
        />
      </svg>
      <div className="hra_l_div mx-4">

        <ul>
          {
            props.data.map((item, index) => (
              <li key={index}>
                <span style={{ fontSize: "12px", color: "black" }}> {item.name}</span>
                <p>{props.data.length == 0 ? <></> : <>{item.total}</>} users</p>
                </li>
              // <li>
              //   {props.data.length == 0 ? <></> : <>{props.data[1].name}</>}<p>{props.data.length == 0 ? <></> : <>{props.data[1].total}</>}  users</p>
              // </li>
            ))
          }
          
          {/* <li>
            <span style={{ fontSize: "12px", color: "black" }}>{props.data.length == 0 ? <></> : <>{props.data[2].name}</>}</span>
            <p>{props.data.length == 0 ? <></> : <>{props.data[2].total}</>}  users</p>
          </li> */}


        </ul>
      </div>
    </div>
  );
};

export default Pie;
