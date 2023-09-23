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
    .outerRadius(props.outerRadius);
  const colors = d3.scaleOrdinal(["#173C6A","#1154A6","#428FEC","#E2EFFE","#8DBBF2","#425061","#C5C5C5"]);
  const format = d3.format(".2f");

  useEffect(
    () => {
      // console.log("props.data", props.data)

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

  return (
    <div className="ethinicity_chart_svg">
      <svg width={props.width} height={props.height} style={{justifySelf:"center"}}>
        <g
          ref={ref}
          transform={`translate(${props.outerRadius} ${props.outerRadius})`}
        />
      </svg>

      <div className="ethinicity_l_div" style={{width: "402px"}}>

        <ul style={{paddingLeft:"0"}} className="mt-2">
          <li style={{padding:"10px 10px 10px 0px", fontSize: "18px", "listStyle": "square", color: "#173C6A", marginLeft: "28px"}} ><span style={{fontWeight:"400",fontSize:"14px", color:"black"}}>Native American</span><span style={{marginLeft:"166px"}}></span><span style={{fontWeight:"500", fontSize:"12px" , color:"black"}}>{ props.data.length==0?<></>: props.data[0].total} Users</span></li>
          <li style={{padding:"10px 10px 10px 0px", fontSize: "18px", "listStyle": "square", color: "#1154A6", marginLeft: "28px"}}><span style={{fontWeight:"400",fontSize:"14px", color:"black"}}>African</span><span style={{marginLeft:"228px"}}></span><span style={{fontWeight:"500", fontSize:"12px" , color:"black"}}>{props.data.length==0 || props.data.length <2?<></>: props.data[1].total} Users</span></li>
          <li style={{padding:"10px 10px 10px 0px", fontSize: "18px", "listStyle": "square", color: "#428FEC", marginLeft: "28px"}}><span style={{fontWeight:"400",fontSize:"14px", color:"black"}}>Asian</span><span style={{marginLeft:"240px"}}></span><span style={{fontWeight:"500", fontSize:"12px" , color:"black"}}>{props.data.length==0 || props.data.length<3?<></>: props.data[2].total} Users</span></li>
          <li style={{padding:"10px 10px 10px 0px", fontSize: "18px", "listStyle": "square", color: "#E2EFFE", marginLeft: "28px"}}><span style={{fontWeight:"400",fontSize:"14px", color:"black"}}>Latino</span><span style={{marginLeft:"235px"}}></span><span style={{fontWeight:"500", fontSize:"12px" , color:"black"}}>{props.data.length==0 || props.data.length<4?<></>:props.data[3].total} Users</span></li>
          <li style={{padding:"10px 10px 10px 0px", fontSize: "18px", "listStyle": "square", color: "#8DBBF2", marginLeft: "28px"}}><span style={{fontWeight:"400",fontSize:"14px", color:"black"}}>Pacific Islander</span><span style={{marginLeft:"174px"}}></span><span style={{fontWeight:"500", fontSize:"12px" , color:"black"}}>{props.data.length==0 || props.data.length<5?<></>:props.data[4].total} Users</span></li>
          <li style={{padding:"10px 10px 10px 0px", fontSize: "18px", "listStyle": "square", color: "#425061", marginLeft: "28px"}}><span style={{fontWeight:"400",fontSize:"14px", color:"black"}}>White</span><span style={{marginLeft:"236px"}}></span><span style={{fontWeight:"500", fontSize:"12px" , color:"black"}}>{props.data.length==0 || props.data.length<6?<></>:props.data[5].total} Users</span></li>
          <li style={{padding:"10px 10px 10px 0px", fontSize: "18px", "listStyle": "square", color: "#C5C5C5", marginLeft: "28px"}}><span style={{fontWeight:"400",fontSize:"14px", color:"black"}}>Others</span><span style={{marginLeft:"229px"}}></span><span style={{fontWeight:"500", fontSize:"12px" , color:"black"}}>{props.data.length==0 || props.data.length<7?<></>:props.data[6].total} Users</span></li>
        </ul>

      </div>

    </div>
  );
};

export default Pie;
