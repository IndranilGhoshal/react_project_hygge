
//// ---------------- Dashborad Component ------------------ ////
//Import files//
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import $ from 'jquery'
import AnimatedPieHooksHra from "./D3Chart/AnimatedPieHooksHra";
import AnimatedPieHooksGender from "./D3Chart/AnimatedPieHooksGender";
import AnimatedPieHooksEthinicity from "./D3Chart/AnimatedPieHooksEthinicity";
import Bar from './D3Chart/Bar.js';
import LoggedLayout from './LoggedLayout.js';
import Area from './D3Chart/Area'
import Line from './D3Chart/Line'
import { getCompanyDashBoard, getVisitTrends, getTraffic } from '../../../service/DashboardService'
import { getAnalysisReportFilters } from '../../../service/ReportsServices';
import { getUserData, getUserRole } from '../../../service/Common.js';
import { checkActiveOrNot } from '../../../service/Services.js';
import { IMAGE_URL_ASSETS } from '../../../config/app_url';
//Require Images//
const codesandbox = require('../../../assets/images/codesandbox.png');
const bodyscan = require('../../../assets/images/body-scan 1.png');
const meditation = require('../../../assets/images/meditation 1.png');
const healthylife = require('../../../assets/images/healthy-life 1.png');
const chart1 = require('../../../assets/images/chart1.png');
const chart2 = require('../../../assets/images/chart2.png');
const ArrowRise = require('../../../assets/images/ArrowRise.png');
const chart3 = require('../../../assets/images/chart3.png');
const chart4 = require('../../../assets/images/chart4.png');
const mavtar = require('../../../assets/images/m-avtar.png');
const mavtaf = require('../../../assets/images/f-avtar.png');
const mavtat = require('../../../assets/images/t-avtar.png');
const mavtad = require('../../../assets/images/d-avtar.png');
const chart5 = require('../../../assets/images/chart5.png');
const chart10 = require('../../../assets/images/chart10.png');
const filtricon = require('../../../assets/images/filtr-icon1.png');
const gendrm = require('../../../assets/images/gendr-m.png');
const gendrf = require('../../../assets/images/gendr-f.png');
const filtr2icon = require('../../../assets/images/filtr-icon2.png');
const filtr3icon = require('../../../assets/images/filtr-icon3.png');
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

   
    const [genderArr, setGenderArr] = React.useState([])
    const [ageArr, setAgeArr] = React.useState([])
    const [bmiArr, setBmiArr] = React.useState([])


    const [gender, setGender] = React.useState('')
    const [age, setAge] = React.useState('')
    const [bmi, setBmi] = React.useState('')

    const [body, setBody] = React.useState(0)
    const [mind, setMind] = React.useState(0)
    const [lifestyle, setLifestyle] = React.useState(0)

    const [pageLoad, setPageLoad] = React.useState(false)



    /* Functions */
    //------------------UseEffect-----------------// 
    useEffect(() => {
        loginCkeck()
        userCheck()
        userRoleAssess()
        getCompanyDashBoardData()
        // visitDay()
        // getTrafficFun("day")
        getAnalysisReportFiltersFun()
    }, []);
    //-------------- callback functions -------------//
    function loginCkeck() {
        if (!localStorage.getItem('user')) {
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
    function userRoleAssess() {
        // var role = getUserRole("Dashboard")

        // console.log("role", role)
        // if(role){
        //     if(role.can_edit==1){
        //         SetCanEdit(true)
        //     }
        // }
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
    function getCompanyDashBoardData() {
        var data = {
            "userId": getUserData().response.userId,
            "userType": userType(),
            "orgId": getUserData().response.orgn_id,
            "gender": gender,
            "bmi": bmi,
            "age": age
        }
        getCompanyDashBoard(data).then(result => {
            // console.log(result.data)
            //------------ for totalHraScore -----------//
            setTotalHraScore(Math.round(result.data.response.totalHraScore))
            setBody(Math.round(result.data.response.catScoreAvg['My Body'] ))
            setMind(Math.round(result.data.response.catScoreAvg['My Lifestyle']))
            setLifestyle(Math.round(result.data.response.catScoreAvg['My Mind']))
            //------------ for catScoreAvg -----------//
            setCatScoreAvg(result.data.response.catScoreAvg)
            //------------ for getMaritalStatusAvg -----------//
            setGetMaritalStatusAvg(result.data.response.getMaritalStatusAvg)
            //------------ for getHRAResponseAvg -----------//
            var hraArr = []
            var getHRAResponseAvg = result.data.response.getHRAResponseAvg
            for (var i = 0; i < getHRAResponseAvg.length; i++) {
                hraArr.push({ data: i, value: getHRAResponseAvg[i].percent, name: getHRAResponseAvg[i].name, total: getHRAResponseAvg[i].total })
            }
            setHraDataArray(hraArr)
            // console.log("mainArray---------",mainArray)
            //----------- for getGenderDataAvg ----------- //
            var genArr = []
            for (var i = 0; i < result.data.response.getGenderDataAvg.length; i++) {
                genArr.push({ data: i, value: result.data.response.getGenderDataAvg[i].value })
            }
            setGenderDataArray(genArr)
            //-----------for ethinicityArr------------//
            var ethinicityArr = []
            for (var i = 0; i < result.data.response.getEthnicityAvg.length; i++) {
                ethinicityArr.push({ data: i, value: result.data.response.getEthnicityAvg[i].value, total: result.data.response.getEthnicityAvg[i].total })
            }
            setEthinicityDataArray(ethinicityArr)
            //-----------for dependanceArr------------//
            var dependanceArr = {
                labels: [],
                datasets: [
                    {
                        data: [],
                        backgroundColor: [
                            "#FFD786",
                            "#FFBF3F",
                            "#FFE5B1",
                            "#FFEFD0"
                        ],
                        borderColor: [
                            "#FFD786",
                            "#FFBF3F",
                            "#FFE5B1",
                            "#FFEFD0"
                        ],
                        borderWidth: 1,
                        barThickness: 30
                    }
                ]
            }
            var getDependanceAvg = result.data.response.getDependanceAvg
            getDependanceAvg.sort(dynamicSort('label'))
            for (var i = 0; i < getDependanceAvg.length; i++) {
                var label = ''
                if (getDependanceAvg[i].label != 0) {
                    if (getDependanceAvg[i].label == 1) {
                        label = 'One'
                    } else if (getDependanceAvg[i].label == 2) {
                        label = 'Two'
                    } else if (getDependanceAvg[i].label == 3) {
                        label = 'Three'
                    } else if (getDependanceAvg[i].label == '>3') {
                        label = 'More than Three'
                    }
                    dependanceArr.labels.push(label)
                    dependanceArr.datasets[0].data.push(getDependanceAvg[i].total)
                }

                // dependanceArr.push({ index: i, date: i, value: Math.round(result.data.response.getDependanceAvg[i].value) })
            }
            setDependanceDataArray(dependanceArr)

        })
    }

    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            /* next line works with strings and numbers, 
             * and you may want to customize it to your needs
             */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    
    // function getVisitTrendsFun(visitType) {
    //     var data = {
    //         "userId": getUserData().response.userId,
    //         "userType": userType(),
    //         "orgId": getUserData().response.orgn_id,
    //         "dataType": visitType
    //     }
    //     getVisitTrends(data).then(result => {
    //         var areaData = {
    //             labels: result.data.response.labels,
    //             datasets: [{
    //                 data: [], // Specify the data values array
    //                 fill: true,
    //                 borderColor: 'rgba(255, 191, 63, 1)', // Add custom color border (Line)
    //                 // backgroundColor: 'rgba(255, 191, 63, 1)', // Add custom color background (Points and Fill)
    //                 borderWidth: 1 // Specify bar border width
    //             }]
    //         }
    //         for(let val of result.data.response.labels){
    //             areaData.datasets[0].data.push(0)
    //         }
    //         for(let [i,val] of result.data.response.labels.entries()){
    //             for (let arr of result.data.response.result) {
               
    //                 if(val==arr.date){
    //                     areaData.datasets[0].data[i]=arr.value
    //                 }
    //             }
                
    //         }
    //         setgetVisitTrendsData(areaData)
    //         console.log(areaData)
    //     })
    // }
   
    function getAnalysisReportFiltersFun() {

        var data = {
            "userId": getUserData().response.userId
        }

        getAnalysisReportFilters(data).then(result => {
            console.log(result.data.response)
            setGenderArr(result.data.response.Gender)
            setBmiArr(result.data.response['BMI'])
            setAgeArr(result.data.response.Age)
        })

    }
    
    useEffect(() => {

        getCompanyDashBoardData()

    }, [gender, bmi, age])
    
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
                <div className="content">
                    <div className="container-fluid p-0">
                        <div className="row mb-2 mb-lg-4">
                            <div className="col-md-12 d-lg-flex align-items-center main-hdng">
                                <div className="col-md-6">
                                    <h3 className="dashbrd">Dashboard</h3>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2 mb-lg-4">
                            <div className="col-lg-12">
                                <div className="bg-white shadow_d p-4 rounded-3 dashboard_bg_img ">
                                    <h2>Good Morning {getUserData().response.organisation_name}</h2>
                                    <p>Have a nice day at work</p>
                                </div>
                            </div>
                        </div>
                        <div className="row hra_scor_dv">
                            <div className="col-lg-12">
                                <div className="txt-hdng">
                                    <h3>HRA Scores</h3>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="bg-white shadow_d py-4 px-3 rounded-3 dashboard_top_box">
                                    <div className="hra_scor">
                                        <div className="mr-1"> <img src={codesandbox} alt="menu-vertical" />
                                        </div>
                                        <div className="col-auto d-block"><strong className="text-hra">{totalHraScore}<sub >/100</sub></strong>
                                            <p> Total HRA score</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="bg-white shadow_d py-4 px-3 rounded-3 dashboard_top_box">
                                    <div className="hra_scor">
                                        <div className="mr-1"> <img src={bodyscan} alt="menu-vertical" />
                                        </div>
                                        <div className="col-auto d-block"><strong className="text-bdy">{body}<sub>/51</sub></strong>
                                            <p> Body</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="bg-white shadow_d py-4 px-3 rounded-3 dashboard_top_box">
                                    <div className="hra_scor">
                                        <div className="mr-1"> <img src={meditation} alt="menu-vertical" />
                                        </div>
                                        <div className="col-auto d-block"><strong className="text-mnd">{mind}<sub>/19</sub></strong>
                                            <p> Mind</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="bg-white shadow_d py-4 px-3 rounded-3 dashboard_top_box">
                                    <div className="hra_scor">
                                        <div className="mr-1"> <img src={healthylife} alt="menu-vertical" />
                                        </div>
                                        <div className="col-auto d-block"><strong className="text-lsty">{lifestyle}<sub>/30</sub></strong>
                                            <p> Lifestyle</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-5 col-sm-5">
                                <div className="bg-white shadow_d py-3 px-3 rounded-3 dashboard_body_box">
                                    <div className="dashboard_body d-flex align-items-center">
                                        <div className="col-auto d-block">
                                            <h3>HRA response</h3>
                                        </div>
                                    </div>
                                    {/* CHART 1 */}
                                    <div className="card chart-container">
                                        {/* <img src={chart1} /> */}
                                        <AnimatedPieHooksHra
                                            data={hraDataArray}
                                            width={170}
                                            height={165}
                                            innerRadius={40}
                                            outerRadius={80}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7 col-sm-7">
                                <Area  />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-5 col-sm-5">
                                <div className="bg-white shadow_d py-3 px-3 rounded-3 dashboard_body_box">
                                    <div className="dashboard_body d-flex align-items-center mb-2">
                                        <div className="col-auto d-block">
                                            <strong className='bo_hed'>Gender</strong>
                                        </div>
                                    </div>
                                    {/* CHART 3 */}
                                    <div className="card chart-container">
                                        {/* <img src={chart3} />
                                         */}
                                        <AnimatedPieHooksGender
                                            data={genderDataArray}
                                            width={170}
                                            height={165}
                                            innerRadius={0}
                                            outerRadius={80}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7 col-sm-7">
                                <Line data={getTrafficData} />
                                
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-6 col-sm-6">
                                <div className="bg-white shadow_d py-4 px-4 rounded-3">
                                    <div className="marital_status">
                                        <strong className='bo_hed'>Marital Status</strong>
                                        <ul>
                                            {
                                                getMaritalStatusAvg.Single ?
                                                    <>
                                                        <li>
                                                            <div className="marital_status_in">
                                                                <img src={mavtar} />
                                                                <span>{getMaritalStatusAvg.Single.label}</span>

                                                                <strong>{getMaritalStatusAvg.Single.total} users</strong>
                                                            </div>
                                                        </li>
                                                    </>
                                                    :
                                                    null
                                            }
                                            {
                                                getMaritalStatusAvg.Married ?
                                                    <>
                                                        <li>
                                                            <div className="marital_status_in">
                                                                <img src={mavtat} />
                                                                <span>{getMaritalStatusAvg.Married.label}</span>

                                                                <strong>{getMaritalStatusAvg.Married.total} users</strong>
                                                            </div>
                                                        </li>
                                                    </>
                                                    :
                                                    null
                                            }
                                            {
                                                getMaritalStatusAvg.Separated ?
                                                    <>
                                                        <li>
                                                            <div className="marital_status_in">
                                                                <img src={mavtaf} />
                                                                <span>{getMaritalStatusAvg.Separated.label}</span>

                                                                <strong>{getMaritalStatusAvg.Separated.total} users</strong>
                                                            </div>
                                                        </li>
                                                    </>
                                                    :
                                                    null
                                            }
                                            {
                                                getMaritalStatusAvg.Divorced ?
                                                    <>
                                                        <li>
                                                            <div className="marital_status_in">
                                                                <img src={mavtad} />
                                                                <span>{getMaritalStatusAvg.Divorced.label}</span>

                                                                <strong>{getMaritalStatusAvg.Divorced.total} users</strong>
                                                            </div>
                                                        </li>
                                                    </>
                                                    :
                                                    null
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-white shadow_d py-3 px-3 mt-3 rounded-3 dashboard_body_box dep_bar">

                                    <div className="col-auto d-block">
                                        <strong className='bo_hed'>Dependance</strong>
                                    </div>
                                    {/* CHART 6 */}
                                    <div className="card chart-container">
                                        {/* <img className="d-block mx-auto" src={chart10} /> */}
                                        <Bar data={dependanceDataArray} />

                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-sm-6">
                                <div className="bg-white shadow_d py-3 px-3 rounded-3 dashboard_body_box">

                                    <div className="col-auto d-block">
                                        <strong className='bo_hed'>Ethinicity</strong>
                                    </div>

                                    {/* CHART 7 */}

                                    <div className="card chart-container">
                                        {/* <img className="d-block mx-auto" src={chart5} />
                                         */}

                                        <AnimatedPieHooksEthinicity
                                            data={ethinicityDataArray}
                                            width={170}
                                            height={173}
                                            innerRadius={40}
                                            outerRadius={80}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                        <div className="accordion" id="accordionExample">
                            <div className="accordion-item">
                                <h4 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        <img src={filtricon} />Gender</button>
                                </h4>

                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne"
                                    data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
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
                                                            <div className="tick_container">
                                                                <div className="tick">&nbsp;</div>
                                                            </div>
                                                        </label>

                                                    </div>

                                                ))
                                            }

                                            {/* <div className='col text-center'>
                                                <input type="radio" name="imgbackground" id="img1" className="d-none imgbgchk"
                                                    value="" />
                                                <label htmlFor="img1">
                                                    <img src={gendrm} />
                                                    <div className="tick_container">
                                                        <div className="tick">&nbsp;</div>
                                                    </div>
                                                </label>
                                            </div> */}
                                            {/* <div className='col text-center'>
                                                <input type="radio" name="imgbackground" id="img2" className="d-none imgbgchk"
                                                    value="" />
                                                <label htmlFor="img2">
                                                    <img src={gendrf} />
                                                    <div className="tick_container">
                                                        <div className="tick">&nbsp;</div>
                                                    </div>
                                                </label>
                                            </div> */}
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h4 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        <img src={filtr2icon} />Age</button>
                                </h4>

                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
                                    data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <div className="age">

                                            {
                                                ageArr.map((item, index) => (

                                                    <div className='col text-center'>

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
                                                            <div className="tick_container">
                                                                <div className="tick">&nbsp;</div>
                                                            </div>
                                                        </label>

                                                    </div>
                                                ))
                                            }

                                            {/* <div className='col text-center'>
                                                <input type="radio" name="imgbackground" id="img3" className="d-none imgbgchk"
                                                    value="" />
                                                <label htmlFor="img3">
                                                    <strong>18-35</strong>
                                                    <div className="tick_container">
                                                        <div className="tick">&nbsp;</div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className='col text-center'>
                                                <input type="radio" name="imgbackground" id="img4" className="d-none imgbgchk"
                                                    value="" />
                                                <label htmlFor="img4">
                                                    <strong>35-50</strong>
                                                    <div className="tick_container">
                                                        <div className="tick">&nbsp;</div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className='col text-center'>
                                                <input type="radio" name="imgbackground" id="img5" className="d-none imgbgchk"
                                                    value="" />
                                                <label htmlFor="img5">
                                                    <strong>51-65</strong>
                                                    <div className="tick_container">
                                                        <div className="tick">&nbsp;</div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className='col text-center'>
                                                <input type="radio" name="imgbackground" id="img6" className="d-none imgbgchk"
                                                    value="" />
                                                <label htmlFor="img6">
                                                    <strong>65+</strong>
                                                    <div className="tick_container">
                                                        <div className="tick">&nbsp;</div>
                                                    </div>
                                                </label>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h4 className="accordion-header" id="headingThree">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        <img src={filtr3icon} />BMI</button>
                                </h4>

                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree"
                                    data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <div className="age bmi">
                                            {
                                                bmiArr.map((item, index) => (

                                                    <div className='col text-center'>
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
                                                            <div className="tick_container">
                                                                <div className="tick">&nbsp;</div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                            {/* <div className='col text-center'>
                                                <input type="radio" name="imgbackground" id="img7" className="d-none imgbgchk"
                                                    value="" />
                                                <label htmlFor="img7">
                                                    <strong>Underweight</strong>
                                                    <div className="tick_container">
                                                        <div className="tick">&nbsp;</div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className='col text-center'>
                                                <input type="radio" name="imgbackground" id="img8" className="d-none imgbgchk"
                                                    value="" />
                                                <label htmlFor="img8">
                                                    <strong>Normal</strong>
                                                    <div className="tick_container">
                                                        <div className="tick">&nbsp;</div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className='col text-center'>
                                                <input type="radio" name="imgbackground" id="img9" className="d-none imgbgchk"
                                                    value="" />
                                                <label htmlFor="img9">
                                                    <strong>Overweight</strong>
                                                    <div className="tick_container">
                                                        <div className="tick">&nbsp;</div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className='col text-center'>
                                                <input type="radio" name="imgbackground" id="img10" className="d-none imgbgchk"
                                                    value="" />
                                                <label htmlFor="img10">
                                                    <strong>Obesse</strong>
                                                    <div className="tick_container">
                                                        <div className="tick">&nbsp;</div>
                                                    </div>
                                                </label>
                                            </div> */}
                                        </div>

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