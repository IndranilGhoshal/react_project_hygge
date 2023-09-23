import React, { useState, useEffect, useRef } from "react";
import Chart from 'chart.js/auto'
import $ from 'jquery'
import { getUserData, getUserRole } from '../../../../service/Common.js';
import { getTraffic } from '../../../../service/DashboardService'
var myChart = ""
var predata = {
    "labels": [
        "13",
        "14",
        "15",
        "16",
        "17",
        "18"
    ],
    "datasets": [
        {
            "label": "mobile",
            "data": [
                {
                    "x": "17",
                    "y": 1
                },
                {
                    "x": "18",
                    "y": 1
                }
            ],
            "backgroundColor": "#428FEC",
            "borderColor": "#428FEC",
            "fill": false,
            "lineTension": 0
        },
        {
            "label": "web",
            "data": [
                {
                    "x": "13",
                    "y": 3
                },
                {
                    "x": "14",
                    "y": 1
                },
                {
                    "x": "15",
                    "y": 1
                },
                {
                    "x": "16",
                    "y": 2
                },
                {
                    "x": "17",
                    "y": 6
                },
                {
                    "x": "18",
                    "y": 1
                }
            ],
            "backgroundColor": "#FFC727",
            "borderColor": "#FFC727",
            "fill": false,
            "lineTension": 0
        }
    ]
}

const nodata1 = require('../../../../assets/images/no-data1.png');

function Line(props) {
    const [getTrafficData, setgetTrafficData] = useState({});
    const [isShow, setisShow] = useState(false);

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

    function draw() {
        if (getTrafficData.datasets != 0 && getTrafficData.labels != 0 && isShow == true) {
            document.getElementById("lineChart").style.display = "block"
            document.getElementById("emptChat").style.display = "none"
            $("canvas#lineChart").remove();
            $("div.lineChart").append('<canvas id="lineChart" ></canvas>');
            var ctx = document.getElementById("lineChart").getContext('2d');
            var data = getTrafficData;
            var options = {
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                elements: {
                    point: {
                        radius: 2
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            precision: 1
                        },
                    }],
                    xAxes: [{
                        barPercentage: 0.1,
                        gridLines: {
                            display: false
                        }
                    }], x: {
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
                plugins: {
                    legend: {
                        display: false
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
            myChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options,
            });
        } else {
            const img = document.createElement("img");
            img.src = nodata1;
            $("#emptChat").html('')
            document.getElementById("lineChart").style.display = "none"
            document.getElementById("emptChat").style.display = "block"
            document.getElementById("emptChat").appendChild(img);
        }
    }
    function getTrafficFun(trafficType) {
        var data = {
            "userId": getUserData().response.userId,
            "userType": userType(),
            "orgId": getUserData().response.orgn_id,
            "dataType": trafficType
        }
        setisShow(true)
        getTraffic(data).then(result1 => {
            var result = result1.data.response.result
            if (result1.data.response) {
                var data = {
                    labels: result1.data.response.labels,
                    datasets: [
                        {
                            label: '',
                            data: [],
                            showLine: true,
                            backgroundColor: '#FFC727',
                            borderColor: '#FFC727',
                            fill: false,
                        },
                        {
                            label: '',
                            data: [],
                            showLine: true,
                            backgroundColor: '#428FEC',
                            borderColor: '#428FEC',
                            fill: false,
                        },
                    ]
                }
                if (result.mobile) {
                    setisShow(true)
                    for (let val of result1.data.response.labels) {
                        data.datasets[0].data.push({ x: val, y: 0 + '' })
                    }
                    for (let [i, val] of result1.data.response.labels.entries()) {
                        for (let arr of result.mobile) {
                            if (val == arr.date) {
                                data.datasets[0].data[i] = { x: val, y: arr.total + '' }
                            }
                            data.datasets[0].label = arr.device_type
                        }
                    }
                }
                if (result.web) {
                    setisShow(true)
                    for (let val of result1.data.response.labels) {
                        data.datasets[1].data.push({ x: val, y: 0 + '' })
                    }
                    for (let [i, val] of result1.data.response.labels.entries()) {
                        for (let arr of result.web) {
                            if (val == arr.date) {
                                data.datasets[1].data[i] = { x: val, y: arr.total + '' }
                            }
                            data.datasets[1].label = arr.device_type
                        }
                    }

                }
                setgetTrafficData(data)
            } else {
                setisShow(false)
            }


        })
    }
    useEffect(() => {
        draw()
    }, [getTrafficData])

    useEffect(() => {
        getTrafficFun("day")
        draw()
    }, [])



    return (
        <div className="bg-white shadow_d py-3 px-3 rounded-3 line_chrt_box h-100">
            <div className="dashboard_body d-flex align-items-center mb-2">
                <div className="col-sm-12 d-flex justify-content-between align-items-center visit_trn">
                    <strong className='bo_hed'>Traffic by Device</strong>

                    <ul>
                        <li><span className="webtnd"></span>Web</li>
                        <li><span className="mobtnd"></span>Mobile</li>
                    </ul>

                    <ul className="visit_trn_li">
                        <li>
                            <select style={{ border: "1px solid #428FEC" }} onChange={(e) => { getTrafficFun(e.target.value) }}>
                                <option value="day">This Week</option>
                                <option value="week">This Month</option>
                                <option value="month">This Year</option>
                            </select>
                        </li>
                    </ul>
                </div>
            </div>

            {/* CHART 4 */}
            <div className="card chart-container" style={{ border: 0 }}>
                <div className="lineChart" style={{ height: "270px" }}>
                    <canvas id="lineChart"></canvas>
                    <div id="emptChat" className="imgmid"></div>
                </div>
            </div>

        </div>

    )
}

export default Line