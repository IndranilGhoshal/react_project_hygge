import React, { useState, useEffect } from 'react'
import { hideLoader, showLoader } from '../../../../service/Common'
import ApexCharts from 'apexcharts'

function SpiderChart(props) {

  // const [series, setSeries] = useState([70, 50, 30])
  // const [label, setLabel] = useState(['a', 'b', 'c'])

  const [series, setSeries] = useState([])
  const [label, setLabel] = useState([])

  useEffect(() => {
    
    showLoader()
    draw()

   

    
    setTimeout(() => {
      console.log("props", props.data)
      countData()
      hideLoader()
    }, 1000);
  }, [])

  const countData = () =>{
    var temSeries = [...series]
    var temLabel = [...label]
    for (let obj of props.data){

      temSeries.push(Number(obj.value.toFixed()))
      temLabel.push(obj.name)

    }

    console.log("temSeries", temSeries)
    console.log("temLabel", temLabel)


    setSeries(temSeries)
    setLabel(temLabel)

  }



  var options = {
    series: series,
    chart: {
      height: 180,
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
          inverseOrder: false,
          startAngle: 0,
          endAngle: 360,
          offsetX: 0,
          offsetY: 0,
          hollow: {
              margin: 5,
              size: '50%',
            },
          track: {
              show: true,
              startAngle: undefined,
              endAngle: undefined,
              background: '#f2f2f2',
              strokeWidth: '97%',
              opacity: 1,
              margin: 5, 
          },
          dataLabels: {
              show: false
          }
      }
  },
    labels: label,
    colors: ['#428FEC', '#90C1FC', '#D1E6FF'],
  };


  function draw() {
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    setTimeout(() => {
      chart.render();
    }, 1000);
  }




  return (
    <>

      <div className='row'>

        <div className='col-sm-6 mt-5'>
          <div className='eng_txt'><span className='eng_val'>67%</span> response rate</div>
          <div className='eng_oth_txt'>6.2% more response than last month.</div>
        </div>

        <div className='col-sm-6'>
          <div id="chart"></div>
        </div>

      </div>
    </>
  )
}

export default SpiderChart