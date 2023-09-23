import React, { useState, useEffect, useRef } from "react";
import Chart from 'chart.js/auto'
import { getVisitTrends } from '../../../../service/DashboardService'
import { getUserData, getUserRole } from '../../../../service/Common.js';

import $ from 'jquery'
var predata = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
        data: [500, 50, 2424, 14040, 18141, 4111, 4544], // Specify the data values array
        fill: true,
        borderColor: '#FFBF3F', // Add custom color border (Line)
        backgroundColor: '#FDF7C3', // Add custom color background (Points and Fill)
        borderWidth: 1 // Specify bar border width
    }]
}

const nodata2 = require('../../../../assets/images/no-data2.png');



function Area() {
    const [getVisitTrendsData, setgetVisitTrendsData] = useState({});
    const [getVisitTrendsValue, setgetVisitTrendsValue] = useState(0);
    const [isShow, setisShow] = useState(false);
    const ArrowRise = require('../../../../assets/images/ArrowRise.png');
   
    function userType() {
        if (getUserData().response.parent_orgn_id == "0") {
            return 1
        } else {

            if (getUserData().response.is_child == "0") {
                return 2
            } else {
                return 3
            }
        }
    }

    useEffect(() => {
        draw()
    }, [getVisitTrendsData])

    useEffect(() => {
        visitYear()
        draw()
    }, [])
    
    function getVisitTrendsFun(visitType) {
        var data = {
            "userId": getUserData().response.userId,
            "userType": userType(),
            "orgId": getUserData().response.orgn_id,
            "dataType": visitType
        }
        getVisitTrends(data).then(result => {
            var areaData = {
                labels: result.data.response.labels,
                datasets: [{
                    data: [],
                    fill: true,
                    borderColor: 'rgba(66, 143, 236, 1)', 
                    borderWidth: 1 
                }]
            }
            for (let val of result.data.response.labels) {
                areaData.datasets[0].data.push(0)
            }
            if(result.data.response.result.length>0){
                setisShow(true)
                for (let [i, val] of result.data.response.labels.entries()) {
                    for (let arr of result.data.response.result) {
                        if (val == arr.date) {
                            areaData.datasets[0].data[i] = arr.value
                        }
                    }
    
                }
            }else{
                setisShow(false)
            }
            
            setgetVisitTrendsData(areaData)
            setgetVisitTrendsValue(result.data.response.growth)
        })
    }

    function visitYear() {
        $('#12Months').addClass('active')
        $('#6Months').removeClass('active')
        $('#30Days').removeClass('active')
        $('#7Days').removeClass('active')
        getVisitTrendsFun('month')
    }

    function visitHalfYear() {
        $('#12Months').removeClass('active')
        $('#6Months').addClass('active')
        $('#30Days').removeClass('active')
        $('#7Days').removeClass('active')
        getVisitTrendsFun('halfyear')
    }

    function visitMonth() {
        $('#12Months').removeClass('active')
        $('#6Months').removeClass('active')
        $('#30Days').addClass('active')
        $('#7Days').removeClass('active')
        getVisitTrendsFun('week')
    }

    function visitWeek() {
        $('#12Months').removeClass('active')
        $('#6Months').removeClass('active')
        $('#30Days').removeClass('active')
        $('#7Days').addClass('active')
        getVisitTrendsFun('day')
    }

     function draw() {
        if (getVisitTrendsData.datasets != undefined && isShow) {
        document.getElementById("emptChat1").style.display= "none"
        document.getElementById("myChart").style.display= "block"
        $("canvas#myChart").remove();
        $("div.chartreport").append('<canvas id="myChart" ></canvas>');
        var ctx = document.getElementById("myChart").getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(66, 143, 236, 0.2)');
        gradient.addColorStop(1, 'rgba(66, 143, 236, 0)');
        var mayData = getVisitTrendsData
        if(mayData){
            if(mayData.datasets){
                if(mayData.datasets.length>0){
                    mayData.datasets[0].backgroundColor = gradient
                }
            }
            setgetVisitTrendsData(mayData)
        }
        new Chart(ctx, {
            type: 'line',
            data: getVisitTrendsData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                elements: {
                    point: {
                        radius: 2
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }else{
        const img = document.createElement("img");
        img.src = nodata2;
        document.getElementById("myChart").style.display= "none"
        document.getElementById("emptChat1").style.display= "block"
        document.getElementById("emptChat1").innerHTML=''
        document.getElementById("emptChat1").appendChild(img);
    }
    }
    return (
        
            <div className="bg-white shadow_d py-3 px-3 rounded-4 dashboard_body_box tra_dev h-100">

                <div className="dashboard_body d-flex align-items-center mb-2">
                    <div className="col-sm-12 d-flex justify-content-between align-items-center visit_trn">
                        <h3>Visit Trends <span>Total users</span></h3>
                        
                        <ul className="visit_trn_li text-left">
                            <li role="button" id="12Months" onClick={visitYear}>12 Months</li>
                            <li role="button" id="6Months" onClick={visitHalfYear}>6 Months</li>
                            <li role="button" id="30Days" onClick={visitMonth}>30 Days</li>
                            <li role="button" id="7Days" onClick={visitWeek}>7 Days</li>
                        </ul>
                    </div>
                </div>
                {/* CHART 2 */}
                <div className="card chart-container">
                    <div className={`chartreport areacht `}>
                        <canvas id="myChart"></canvas>
                        <div id="emptChat1" className="imgmid"></div>
                    </div>

                </div>
            </div>
            

      

    )
}

export default Area