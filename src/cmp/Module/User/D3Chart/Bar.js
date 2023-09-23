import React, { useState,useEffect, useRef } from "react";
import Chart from 'chart.js/auto'
import $ from 'jquery'
var myChart ="";

var predata = {
  "labels": [
      "1",
      "300",
      "277",
      ">3",
      "0"
  ],
  "datasets": [
      {
          "data": [
              4,
              6,
              2,
              2,
              1
          ],
          "backgroundColor": [
              "#FFD786",
              "#FFBF3F",
              "#FFE5B1",
              "#FFEFD0"
          ],
          "borderColor": [
            "#FFD786",
            "#FFBF3F",
            "#FFE5B1",
            "#FFEFD0"
          ],
          "borderWidth": 1,
          borderWidth: 2,
      }
  ]
}

function Bar(props) {
  const [dependanceDataArray, setDependanceDataArray] = useState(predata);
  const ref = useRef(null)
  function draw() {
    $("canvas#barChart").remove();
    $("div.barChart").append('<canvas id="barChart" ></canvas>');
    var ctx = document.getElementById("barChart").getContext('2d');
  
    setDependanceDataArray(props.data)

    var data = dependanceDataArray,
      options = {
        scales: {
          x: {
            grid: {
              display: false,
            }
          },
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ],
          xAxes: [{
            maxBarThickness: 10
        }]
        },
        plugins: {
          legend: {
            display: false
          }
        },
        responsive: true,
        maintainAspectRatio: false,
      }

      myChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });
  }


  useEffect(() => {
    predata =props.data
    draw()
  })



  return (
    <div  className="barChart" style={{height: "370px"}}>
      <canvas id="barChart"></canvas>
      </div>
  )
}

export default Bar