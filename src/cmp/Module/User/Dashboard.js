
//// ---------------- Dashborad Component ------------------ ////
//Import files//
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import $ from 'jquery'
import Bar from './D3Chart/Bar.js';
import LoggedLayout from './LoggedLayout.js';
import Area from './D3Chart/Area'
import Line from './D3Chart/Line'
import { getCompanyDashBoard} from '../../../service/DashboardService'
import { getAnalysisReportFilters } from '../../../service/ReportsServices';
import { getUserData, showLoader, hideLoader } from '../../../service/Common.js';
import { checkActiveOrNot } from '../../../service/Services.js';
import { IMAGE_URL_ASSETS } from '../../../config/app_url';
import ApexCharts from 'apexcharts'
//Require Images//
const bodyscan = require('../../../assets/images/body-scan 1.png');
const meditation = require('../../../assets/images/meditation 1.png');
const healthylife = require('../../../assets/images/healthy-life 1.png');
const icn1 = require('../../../assets/images/m-sttus-icn1.png');
const icn2 = require('../../../assets/images/m-sttus-icn2.png');
const icn3 = require('../../../assets/images/m-sttus-icn3.png');
const icn4 = require('../../../assets/images/m-sttus-icn4.png');
const icn5 = require('../../../assets/images/m-sttus-icn5.png');
const icn6 = require('../../../assets/images/m-sttus-icn6.png');
const filtricon = require('../../../assets/images/filtr-icon1.png');
const filtr2icon = require('../../../assets/images/filtr-icon2.png');
const filtr3icon = require('../../../assets/images/filtr-icon3.png');
const nodata4 = require('../../../assets/images/no-data4.png');
const nodata3 = require('../../../assets/images/no-data3.png');
const dowelws = require('../../../assets/images/set-g-icn.png');
const tkakws = require('../../../assets/images/set-y-icn.png');
const hirskws = require('../../../assets/images/set-r-icn.png');
const rickaro = require('../../../assets/images/rick-aro.png');
const dngwllaro = require('../../../assets/images/dng-wll-icon.png');
//Stateless Functional Component named Dashboard//
const Dashboard = () => {
    /* Variables */
    const navigate = useNavigate();
    // const [canEdit,SetCanEdit]= React.useState(false)
    const [hraDataArray, setHraDataArray] = useState([]);
    const [genderDataArray, setGenderDataArray] = useState([]);
    const [ethinicityDataArray, setEthinicityDataArray] = useState([]);
    const [dependanceDataArray, setDependanceDataArray] = useState([]);
    const [totalHraScore, setTotalHraScore] = useState(0);
    const [catScoreAvg, setCatScoreAvg] = useState({});
    const [getMaritalStatusAvg, setGetMaritalStatusAvg] = useState({});
    const [getTrafficData, setgetTrafficData] = useState({});
    const [getVisitTrendsData, setgetVisitTrendsData] = useState({});
    //1= Master Admin, 2= Super Admin, 3= Admin
    const [userLevel, setUserLevel] = useState(0)
    const [genderArr, setGenderArr] = useState([])
    const [ageArr, setAgeArr] = useState([])
    const [bmiArr, setBmiArr] = useState([])
    const [gender, setGender] = useState('')
    const [age, setAge] = useState('')
    const [bmi, setBmi] = useState('')
    const [body, setBody] = useState(0)
    const [mind, setMind] = useState(0)
    const [lifestyle, setLifestyle] = useState(0)
    const [pageLoad, setPageLoad] = useState(false)
    const [bodyGroth, setBodyGroth] = useState(0)
    const [mindGroth, setMindGroth] = useState(0)
    const [lifeGroth, setLifeGroth] = useState(0)
    const [getEngPer, setGetEngPer] = useState(0)
    const [resGroth, setResGroth] = useState(0)
    const [maleGroth, setMaleGroth] = useState(0)
    const [femaleGroth, setFemaleGroth] = useState(0)
    const [genderCount, setGenderCount] = useState(0)
    //HRA Response (Engagement) Options
    const hraRes = (arrValue) => {
        var options = {
            // series: series,
            series: arrValue,
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
            colors: ['#428FEC', '#90C1FC', '#D1E6FF'],
        };
        document.querySelector("#chart").innerHTML = '';
        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
    }
    //Gender Options
    const genderRes = (arrValue,is_gender) => {
        if (arrValue.length != 0 && is_gender==1) {
            document.getElementById("chartGen").style.display= "block"
            document.getElementById("genderimg").style.display= "none"
        var optionsGen = {
            series: arrValue,
            chart: {
                width: 300,
                height: 300,
                type: 'donut'
            },
            plotOptions: {
                pie: {
                    expandOnClick: false,
                    donut: {
                        size: '65%',
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        show: false
                    }
                }
            }],
            legend: {
                show: false
            },
            stroke: {
                show: true,
                width: 10
            },
            tooltip: {
                y: {
                  formatter: function(value, opts) {
                      return value+'%'
                  },
                },
            },
            labels: ['Male', 'Female'],
            colors: ['#428FEC', '#FFBF3F'],
        };
        document.querySelector("#chartGen").innerHTML = '';
        var chartGen = new ApexCharts(document.querySelector("#chartGen"), optionsGen);
        chartGen.render();

    } else {
        const img = document.createElement("img");
        img.src = nodata3;
        document.getElementById("chartGen").style.display= "none"
        document.getElementById("genderimg").style.display= "block"
        $("#genderimg").html('')
        document.getElementById("genderimg").appendChild(img);
    }
    }
    //List Data
    var reqData = {
        "userId": getUserData().response.userId,
        "userType": userType(),
        "orgId": getUserData().response.orgn_id,
        "gender": gender,
        "bmi": bmi,
        "age": age
    }
    /* Functions */
    //------------------UseEffect-----------------// 
    useEffect(() => {
        loginCkeck()
        userCheck()
        getAnalysisReportFiltersFun()
    }, []);
    useEffect(() => {
        getCompanyDashBoardData(reqData)
    }, [gender, bmi, age])
    //-------------- callback functions -------------//
    function getCompanyDashBoardData(reqData) {
        showLoader()
        getCompanyDashBoard(reqData).then(result => {
            hideLoader()
            if (result.data.response) {
                setBodyGroth(result.data.response.bodyGroth.toFixed(2))
                setMindGroth(result.data.response.mindGroth.toFixed(2))
                setLifeGroth(result.data.response.lifeGroth.toFixed(2))
                setGetEngPer(result.data.response.getEngagementPercentage.toFixed())
                setResGroth(result.data.response.responseGroth.toFixed())
                setMaleGroth(result.data.response.maleGroth.toFixed())
                setFemaleGroth(result.data.response.femaleGroth.toFixed())
                setGenderCount(result.data.response.getGenderCount)
                //------------ for totalHraScore -----------//
                if (result.data.response.totalHraScore) {
                    setTotalHraScore(result.data.response.totalHraScore.toFixed())
                } else {
                    setTotalHraScore(result.data.response.totalHraScore)
                }

                if (result.data.response.catScoreAvg['My Body']) {
                    setBody((result.data.response.catScoreAvg['My Body'] / 51 * 100).toFixed())

                } else {
                    setBody(result.data.response.catScoreAvg['My Body'])
                }

                if (result.data.response.catScoreAvg['My Lifestyle']) {
                    setLifestyle(((result.data.response.catScoreAvg['My Lifestyle'] / 30) * 100).toFixed())

                } else {
                    setLifestyle(result.data.response.catScoreAvg['My Lifestyle'])
                }

                if (result.data.response.catScoreAvg['My Mind']) {
                    setMind((result.data.response.catScoreAvg['My Mind'] / 19 * 100).toFixed())

                } else {
                    setMind(result.data.response.catScoreAvg['My Mind'])
                }

                //------------ for catScoreAvg -----------//
                setCatScoreAvg(result.data.response.catScoreAvg)

                //------------ for getMaritalStatusAvg -----------//
                setGetMaritalStatusAvg(result.data.response.getMaritalStatusAvg)

                //------------ for getHRAResponseAvg -----------//
                var hraArr = []
                var hraArr1 = []
                for (var i = 0; i < result.data.response.getHRAResponseAvg.length; i++) {
                    hraArr.push({ data: i, name: result.data.response.getHRAResponseAvg[i].name, value: Number(result.data.response.getHRAResponseAvg[i].percent.toFixed()), total: result.data.response.getHRAResponseAvg[i].total })
                    hraArr1.push(Number(result.data.response.getHRAResponseAvg[i].percent.toFixed()))

                }
                hraRes(hraArr1)
                setHraDataArray(hraArr)
                //----------- for getGenderDataAvg ----------- //
                var genArr = []
                var is_gender= 0
                for (var i = 0; i < result.data.response.getGenderDataAvg.length; i++) {
                    if(result.data.response.getGenderDataAvg[i].value>1){
                        is_gender= 1
                    }
                    genArr.push(Number(result.data.response.getGenderDataAvg[i].value.toFixed()))
                }
                genderRes(genArr,is_gender)

                //-----------for ethinicityArr------------//
                var ethinicityArr = []
                for (var i = 0; i < result.data.response.getEthnicityAvg.length; i++) {
                    ethinicityArr.push({ data: i, label: result.data.response.getEthnicityAvg[i].label, value: result.data.response.getEthnicityAvg[i].value, total: result.data.response.getEthnicityAvg[i].total })
                }
                setEthinicityDataArray(ethinicityArr)
                //-----------for dependanceArr------------//
                var dependanceArr = {
                    labels: [],
                    datasets: [
                        {
                            data: [],
                            backgroundColor: [
                                "#FFBF3F",
                                "#FFBF3F",
                                "#FFBF3F",
                                "#FFBF3F"
                            ],
                            borderColor: [
                                "#FFBF3F",
                                "#FFBF3F",
                                "#FFBF3F",
                                "#FFBF3F"
                            ],
                            borderWidth: 1,
                            barThickness: 30
                        }
                    ]
                }
                var getDependanceAvg = result.data.response.getDependanceAvg
                if (result.data.response.getDependanceAvg.length != 0) {
                    var isDependance = 0
                    for (var i = 0; i < getDependanceAvg.length; i++) {
                        var label = ''
                            if(getDependanceAvg[i].total>0){
                                isDependance = 1
                            }
                            dependanceArr.labels.push(getDependanceAvg[i].label)
                            dependanceArr.datasets[0].borderRadius = 20
                            dependanceArr.datasets[0].data.push(getDependanceAvg[i].total)
                    }
                    if(isDependance==1){
                        setDependanceDataArray(dependanceArr)
                    }else{
                        setDependanceDataArray([])
                    }
                    
                } else {
                    setDependanceDataArray([])
                }

            } else {
                //------------ for getHRAResponseAvg -----------//
                var hraArr1 = ['0', '0', '0']
                hraRes(hraArr1)
                genderRes([])

            }
        })
    }
    function loginCkeck() {
        if (!sessionStorage.getItem('user')) {
            navigate("/")
        }
    }
    function userCheck() {
        var data = {
            "orgn_id": getUserData().response.orgn_id + "",
            "userId": getUserData().response.userId + ""
        }
        checkActiveOrNot(data).then(result => {
            if (!result.data.success) {
                localStorage.removeItem("user")
                navigate("/")
            }
        })
    }
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
    function getAnalysisReportFiltersFun() {
        var data = {
            "userId": getUserData().response.userId
        }
        getAnalysisReportFilters(data).then(result => {
            setGenderArr(result.data.response.Gender)
            setBmiArr(result.data.response['BMI'])
            setAgeArr(result.data.response.Age)
        })
    }
    const loaderStatusChange = async (type) => {
        setPageLoad(type)
    }
    const resetStateDataForClearAll = async () => {
        setGender('')
        setAge('')
        setBmi('')
    }
    const clearAll = async (event) => {
        await loaderStatusChange(true);
        await resetStateDataForClearAll();
        await loaderStatusChange(false);
    }

    return (
        <React.Fragment>
            {pageLoad ?
                null :
                <>
                    <div className="main">
                        <main className="content">
                            <div className="container-fluid p-0">
                                <div className="row mb-2 mb-lg-0">
                                    <div className="col-md-12 d-lg-flex align-items-center main-hdng">
                                        <div className="col-md-6">
                                            <strong className="hipriy">Hey {getUserData().response.full_name} 👋</strong>
                                            <p>Hope you are having a great day!</p>
                                        </div>

                                    </div>
                                </div>
                                <div className="row mb-2 mb-lg-4">
                                    <div className="col-md-5">
                                        <div className="bg-white shadow_d rounded-4 h-100">
                                            <div className={`ttl_wlns p-4 h-100 ${totalHraScore == 0 ? "zro" : ""} ${totalHraScore > 0 && totalHraScore <= 40 ? "hi_rsk" : ""} ${totalHraScore > 40 && totalHraScore < 70 ? "tk_acnt" : ""} ${totalHraScore >= 70 ? "dng_wll" : ""}`}>
                                                <h3>Total wellness score</h3>
                                                {totalHraScore?<p>You have a {totalHraScore > 0 && totalHraScore <= 40 ? "poor":null}{totalHraScore > 40 && totalHraScore < 70 ? "moderate":null}{totalHraScore >= 70 ?"good":null} wellness score</p>:null}
                                                <strong>{totalHraScore==0?<>00</>:totalHraScore}</strong>
                                                    {
                                                        totalHraScore == 0 ? <p className='emttxt'>Track your company's overall wellness score right here and take the first step towards a healthier and happier workplace</p> : null
                                                    }
                                                    {
                                                        totalHraScore > 0 && totalHraScore <= 40 ? <strong className='valtxt'><img src={hirskws} /> High Risk</strong> : null
                                                    }
                                                    {
                                                        totalHraScore > 40 && totalHraScore < 70 ? <strong className='valtxt'><img src={tkakws} /> Take Action</strong> : null
                                                    }
                                                    {
                                                        totalHraScore >= 70 ? <strong className='valtxt'><img src={dowelws} /> Doing well</strong> : null

                                                    }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="dash_catg">
                                            <div className={`bg-white shadow_d p-4 rounded-4 h-100 dash_catg_in ${body == 0 ? "zro" : ""} ${body > 0 && body <= 40 ? "hi_rsk" : ""} ${body > 40 && body < 70 ? "tk_acnt" : ""} ${body >= 70 ? "dng_wll" : ""}`}>
                                                <div className="dash_catg_top">
                                                    <img src={bodyscan} alt="menu-vertical" />
                                                    <strong>Body</strong>
                                                </div>
                                                <div className={`dash_catg_blo ${body == 0 ? "zro" : ""} ${body > 0 && body <= 40 ? "hi_rsk" : ""} ${body > 40 && body < 70 ? "tk_acnt" : ""} ${body >= 70 ? "dng_wll" : ""}`}>
                                                    <p className="d-flex"> {bodyGroth?bodyGroth+'%':null} 
                                                    {
                                                       bodyGroth? bodyGroth > 0 ? <img className="whte_ris" src={dngwllaro} /> : <img className="whte_ris" src={rickaro} /> : null
                                                    }
                                                    
                                                    </p>
                                                    {
                                                        body == 0 ? <strong>&nbsp;</strong> : null
                                                    }
                                                    {
                                                        body > 0 && body <= 40 ? <strong>High Risk</strong> : null
                                                    }
                                                    {
                                                        body > 40 && body < 70 ? <strong>Take Action</strong> : null
                                                    }
                                                    {
                                                        body >= 70 ? <strong>Doing well</strong> : null

                                                    }
                                                    <span>{body?body+"%":<p className='emttxt'>Understand your body score and take steps towards a better, healthier life.</p>}</span>

                                                </div>
                                            </div>
                                            <div className={`bg-white shadow_d p-4 rounded-4 h-100 dash_catg_in ${mind == 0 ? "zro" : ""} ${mind > 0 && mind <= 40 ? "hi_rsk" : ""} ${mind > 40 && mind < 70 ? "tk_acnt" : ""} ${mind >= 70 ? "dng_wll" : ""}`}>
                                                <div className="dash_catg_top">
                                                    <img src={meditation} alt="menu-vertical" />
                                                    <strong>Mind</strong>
                                                </div>
                                                <div className={`dash_catg_blo ${mind == 0 ? "zro" : ""} ${mind > 0 && mind <= 40 ? "hi_rsk" : ""} ${mind > 40 && mind < 70 ? "tk_acnt" : ""} ${mind >= 70 ? "dng_wll" : ""}`}>
                                                    <p className="d-flex"> {mindGroth?mindGroth+"%":null} 
                                                   
                                                    {
                                                        mindGroth? mindGroth > 0 ? <img className="whte_ris" src={dngwllaro} /> : <img className="whte_ris" src={rickaro} /> : null
                                                    }
                                                    
                                                    </p>
                                                    {
                                                        mind == 0 ? <strong>&nbsp;</strong> : null
                                                    }
                                                    {
                                                        mind > 0 && mind <= 40 ? <strong>High Risk</strong> : null
                                                    }
                                                    {
                                                        mind > 40 && mind < 70 ? <strong>Take Action</strong> : null
                                                    }
                                                    {
                                                        mind >= 70 ? <strong>Doing well</strong> : null
                                                    }
                                                    <span>{mind?mind+"%":<p className='emttxt'>Unlock the power of your mind and discover your company's potential.</p>}</span>
                                                </div>
                                            </div>
                                            <div className={`bg-white shadow_d p-4 rounded-4 h-100 dash_catg_in ${lifestyle == 0 ? "zro" : ""} ${lifestyle > 0 && lifestyle <= 40 ? "hi_rsk" : ""} ${lifestyle > 40 && lifestyle < 70 ? "tk_acnt" : ""} ${lifestyle >= 70 ? "dng_wll" : ""}`}>
                                                <div className="dash_catg_top">
                                                    <img src={healthylife} alt="menu-vertical" />
                                                    <strong>Lifestyle</strong>
                                                </div>
                                                <div className={`dash_catg_blo ${lifestyle == 0 ? "zro" : ""} ${lifestyle > 0 && lifestyle <= 40 ? "hi_rsk" : ""} ${lifestyle > 40 && lifestyle < 70 ? "tk_acnt" : ""} ${lifestyle >= 70 ? "dng_wll" : ""}`}>
                                                    <p className="d-flex"> {lifeGroth?lifeGroth+"%":null} 
                                                    
                                                    {
                                                       lifeGroth? lifeGroth > 0 ? <img className="whte_ris" src={dngwllaro} /> : <img className="whte_ris" src={rickaro} /> : null
                                                    }
                                                    
                                                    </p>
                                                    {
                                                        lifestyle == 0 ? <strong>&nbsp;</strong> : null
                                                    }
                                                    {
                                                        lifestyle > 0 && lifestyle <= 40 ? <strong >High Risk</strong> : null
                                                    }
                                                    {
                                                        lifestyle > 40 && lifestyle < 70 ? <strong>Take Action</strong> : null
                                                    }
                                                    {
                                                        lifestyle >= 70 ? <strong>Doing well</strong > : null
                                                    }
                                                    <span>{lifestyle?lifestyle+"%":<p className='emttxt'>Discover the potential for a healthier and happier workplace with your company's score.</p>}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2 mb-lg-4">
                                    <div className="col-md-5">
                                        <div className="bg-white shadow_d p-4 rounded-4 h-100">
                                            <div className="engmnt_crt">
                                                <h3>Engagement</h3>
                                                <div className='row'>

                                                    <div className='col-sm-6 mt-5'>
                                                        <div className='eng_txt'><span className='eng_val'>{getEngPer}%</span> response rate</div>
                                                        {getEngPer?<div className='eng_oth_txt'>{resGroth}% more response than last month.</div>:null}
                                                    </div>

                                                    <div className='col-sm-6'>
                                                        <div id="chart"></div>
                                                    </div>

                                                </div>

                                                <div className="chart_data_dv">
                                                    <ul>
                                                        {
                                                            hraDataArray.length != 0 ?
                                                                hraDataArray.map((item, i) => (
                                                                    <li key={i}>
                                                                        <div>&nbsp;</div>
                                                                        <div><span>{item.name}</span>
                                                                            <strong>{item.total} users</strong>
                                                                        </div>
                                                                    </li>
                                                                ))
                                                                :
                                                                <>
                                                                    <li>
                                                                        <div>&nbsp;</div>
                                                                        <div><span>Completed</span>
                                                                            <strong>00 users</strong>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div>&nbsp;</div>
                                                                        <div><span>Incomplete</span>
                                                                            <strong>00 users</strong>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div>&nbsp;</div>
                                                                        <div><span>Not started</span>
                                                                            <strong>00 users</strong>
                                                                        </div>
                                                                    </li>
                                                                </>
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <Line data={getTrafficData} />
                                    </div>
                                </div>
                                <div className="row mb-2 mb-lg-4">
                                    <div className="col-md-12">
                                        <Area />
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-md-5">
                                        <div className="bg-white shadow_d p-4 rounded-4 mb-3 h-100" style={{ textAlign: '-webkit-center' }}>
                                            <div className="engmnt_crt">
                                                <div className='gndtit'>
                                                <h4>Gender</h4>
                                                {genderCount?
                                                <p>
                                                <strong>{genderCount}</strong>
                                                <span>Total users</span>
                                                </p>:null
                                                }
                                                
                                                </div>
                                                        <div>
                                                            <div style={{ marginLeft: "-15px" }} id="chartGen"></div>
                                                            <div style={{ marginLeft: "-15px" }} id="genderimg" className='imgmid'></div>
                                                        </div>


                                                <div className='engmnt_crt_gndr'>
                                                    {femaleGroth?<span className='engmnt_crt_gndr_f'>Female {femaleGroth}% {femaleGroth>0?<img src={dngwllaro} />: <img src={rickaro} />} </span>:null}
                                                    {maleGroth?<span className='engmnt_crt_gndr_m'>Male {maleGroth}% {maleGroth>0?<img src={dngwllaro} />: <img src={rickaro} />}</span>:null}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="bg-white shadow_d p-4 rounded-4 h-100">
                                            <div className="etrntic_dvc">
                                                <h4>Ethnicity</h4>
                                                <div className="prog_etct">
                                                    <ul>
                                                        {
                                                            ethinicityDataArray != 0 ?
                                                                ethinicityDataArray.map((item, i) => (
                                                                    <li key={i}>
                                                                        <div className="prog_etct_dta">
                                                                            <strong>{item.label}</strong>
                                                                            <span>{item.total}</span>
                                                                        </div>
                                                                        <div className="prog_etct_line">
                                                                            <span style={{ width: item.value }}></span>
                                                                        </div>
                                                                    </li>
                                                                ))
                                                                :
                                                                <>
                                                                    <li>
                                                                        <div className="prog_etct_dta">
                                                                            <strong>Arabic</strong>
                                                                            <span>0</span>
                                                                        </div>
                                                                        <div className="prog_etct_line">
                                                                            <span style={{ width: '0%' }}></span>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="prog_etct_dta">
                                                                            <strong>African</strong>
                                                                            <span>0</span>
                                                                        </div>
                                                                        <div className="prog_etct_line">
                                                                            <span style={{ width: '0%' }}></span>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="prog_etct_dta">
                                                                            <strong>Latino</strong>
                                                                            <span>0</span>
                                                                        </div>
                                                                        <div className="prog_etct_line">
                                                                            <span style={{ width: '0%' }}></span>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="prog_etct_dta">
                                                                            <strong>Asians</strong>
                                                                            <span>0</span>
                                                                        </div>
                                                                        <div className="prog_etct_line">
                                                                            <span style={{ width: '0%' }}></span>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="prog_etct_dta">
                                                                            <strong>White</strong>
                                                                            <span>0</span>
                                                                        </div>
                                                                        <div className="prog_etct_line">
                                                                            <span style={{ width: '0%' }}></span>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="prog_etct_dta">
                                                                            <strong>Others</strong>
                                                                            <span>0</span>
                                                                        </div>
                                                                        <div className="prog_etct_line">
                                                                            <span style={{ width: '0%' }}></span>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="prog_etct_dta">
                                                                            <strong>Prefer not to indicate</strong>
                                                                            <span>0</span>
                                                                        </div>
                                                                        <div className="prog_etct_line">
                                                                            <span style={{ width: '0%' }}></span>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="prog_etct_dta">
                                                                            <strong>Not Sure</strong>
                                                                            <span>0</span>
                                                                        </div>
                                                                        <div className="prog_etct_line">
                                                                            <span style={{ width: '0%' }}></span>
                                                                        </div>
                                                                    </li>
                                                                </>
                                                        }


                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-md-5">
                                        <div className="bg-white shadow_d p-4 rounded-4 mb-3 ">
                                            <div className="merit_sttus_dv">
                                                <div className="d-flex justify-content-between"><h4>Marital Status</h4><strong>Users</strong></div>
                                                <div className="merit_sttus">
                                                    <ul>
                                                        <li>
                                                            <div><img src={icn1} /><strong>Married</strong></div>
                                                            <span>{getMaritalStatusAvg.Married ? getMaritalStatusAvg.Married.total : <>00</>}</span>
                                                        </li>
                                                        <li>
                                                            <div><img src={icn2} /><strong>Single</strong></div>
                                                            <span>{getMaritalStatusAvg.Single ? getMaritalStatusAvg.Single.total : <>00</>}</span>
                                                        </li>
                                                        <li>
                                                            <div><img src={icn3} /><strong>Divorced</strong></div>
                                                            <span>{getMaritalStatusAvg.Divorced ? getMaritalStatusAvg.Divorced.total : <>00</>}</span>
                                                        </li>
                                                        <li>
                                                            <div><img src={icn4} /><strong>Separated</strong></div>
                                                            <span>{getMaritalStatusAvg.Separated ? getMaritalStatusAvg.Separated.total : <>00</>}</span>
                                                        </li>
                                                        <li>
                                                            <div><img src={icn5} /><strong>Single with Kids</strong></div>
                                                            <span>{getMaritalStatusAvg["Single With Kids"] ? getMaritalStatusAvg["Single With Kids"].total : <>00</>}</span>
                                                        </li>
                                                        <li>
                                                            <div><img src={icn6} /><strong>Married with Kids</strong></div>
                                                            <span>{getMaritalStatusAvg["Married With Kids"] ? getMaritalStatusAvg["Married With Kids"].total : <>00</>}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="bg-white shadow_d p-4 rounded-4" style={{height: '97%'}}>
                                            <div className="etrntic_dvc">
                                                <h4>Dependance</h4>
                                                {/* <img src={chart5} alt="menu-vertical" /> */}
                                                {
                                                    dependanceDataArray.length != 0 ?
                                                        <Bar data={dependanceDataArray} />
                                                        : <div id='depimg' className='imgmid'><img style={{height: '212px',width:'250px'}} src={nodata4} /></div>
                                                }


                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </main>
                    </div>



                    {/* RIGHT SIDEBAR */}
                    <nav className="navbar navbar-expand navbar-light navbar-bg d-block">
                        <div className="navbar-collapse collapse navright">

                            <LoggedLayout />
                        </div>


                        <div className="filter_secn">
                            <div className="filtr_top">
                                <strong>Filters</strong>
                                <button onClick={clearAll}>Clear all</button>
                            </div>
                            <div className="filter_accrod">
                                <div className="filter_accrod_sec"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample1" aria-expanded="false" aria-controls="multiCollapseExample1"><img src={filtricon} />Gender</button>
                                    <div className="collapse multi-collapse" id="multiCollapseExample1">
                                        <div className="card card-body">
                                            <div className="gndr">

                                                {
                                                    genderArr.map((item, index) => (

                                                        <div key={index} className='col text-center'>
                                                            <input
                                                                type="radio"
                                                                name="imgbackground"
                                                                id={"gender" + item.id}
                                                                className="d-none imgbgchk"
                                                                value={item.id}
                                                                onChange={(e) => { setGender(e.target.value) }}
                                                            />

                                                            <label htmlFor={"gender" + item.id}>
                                                                <img src={IMAGE_URL_ASSETS + item.iconurl} />
                                                                <div className="tick_container" style={{ opacity: item.id == gender ? '1' : '0' }}>
                                                                    <div className="tick">&nbsp;</div>
                                                                </div>
                                                            </label>

                                                        </div>

                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter_accrod_sec"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2"><img src={filtr2icon} />Age</button>

                                    <div className="collapse multi-collapse" id="multiCollapseExample2">
                                        <div className="card card-body">
                                            <div className="age">

                                                {
                                                    ageArr.map((item, index) => (

                                                        <div key={index} className='col text-center'>

                                                            <input
                                                                type="radio"
                                                                name="imgbackground"
                                                                id={"age" + item.id}
                                                                className="d-none imgbgchk"
                                                                value={item.id}
                                                                onChange={(e) => { setAge(e.target.value) }}
                                                            />

                                                            <label htmlFor={"age" + item.id}>
                                                                <strong>{item.option_text}</strong>
                                                                <div className="tick_container" style={{ opacity: item.id == age ? '1' : '0' }}>
                                                                    {/* <div className="tick" style={{ background: item.id == age ? 'rgba(66, 143, 236, 0.5)' : '0' }}>&nbsp;</div> */}
                                                                    <div className="tick">&nbsp;</div>
                                                                </div>
                                                            </label>

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter_accrod_sec"><button className="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample3" aria-expanded="false" aria-controls="multiCollapseExample3"><img src={filtr3icon} />BMI</button>

                                    <div className="collapse multi-collapse" id="multiCollapseExample3">
                                        <div className="card card-body">
                                            <div className="age bmi">
                                                {
                                                    bmiArr.map((item, index) => (

                                                        <div key={index} className='col text-center'>
                                                            <input
                                                                type="radio"
                                                                name="imgbackground"
                                                                id={"bmi" + item.id}
                                                                className="d-none imgbgchk"
                                                                value={item.id}
                                                                onChange={(e) => { setBmi(e.target.value) }}
                                                            />

                                                            <label htmlFor={"bmi" + item.id}>
                                                                <strong>{item.option_text}</strong>
                                                                <div className="tick_container" style={{ opacity: item.id == bmi ? '1' : '0' }}>
                                                                    {/* <div className="tick" style={{ background: item.id == bmi ? 'rgba(66, 143, 236, 0.5)' : '0' }}>&nbsp;</div> */}
                                                                    <div className="tick">&nbsp;</div>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                    </nav>





                </>
            }
        </React.Fragment>
    )
}
//Export Dashboard 
export default Dashboard