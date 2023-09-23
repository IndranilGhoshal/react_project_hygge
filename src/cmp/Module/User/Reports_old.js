///-----------Import Files-----------///
import React, { useEffect, useState } from 'react'
import LoggedLayout from './LoggedLayout'
import '../../../devCss/devCss.css'
import { getUserData, getUserRole, deleteCommonItem, showLoader, hideLoader } from '../../../service/Common';
import { userEvent } from '../../../service/Services';
import { getHealthWellOMeterReport, getHealthAnalysisReport, getAnalysisReportHeader, getHealthAnalysisReportByHeader, getAnalysisReportFilters, getCampaignList, getCampaignReportList } from '../../../service/ReportsServices';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import $ from 'jquery'
import { IMAGE_URL_ASSETS } from '../../../config/app_url';
import AnimatedPieHooksParticipants from "./D3Chart/AnimatedPieHooksParticipants";
import AnimatedPieHooksParticipants2 from "./D3Chart/AnimatedPieHooksParticipants2";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { generateCampaignCompareReport, getAggregatedReport } from '../../../service/ReportServices';
import { COMPANY_REPORT_PDF_URL } from '../../../config/app_url';
import { saveAs } from 'file-saver'

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
///--------------Import Images-------------///
const hraqstnavicon1 = require('../../../assets/images/hra-qst-nav-icon1.png');
const progcirc1 = require('../../../assets/images/prog-circ1.png');
const progcirc2 = require('../../../assets/images/prog-circ2.png');
const progcirc3 = require('../../../assets/images/prog-circ3.png');
const hraqstnavicon3 = require('../../../assets/images/hra-qst-nav-icon3.png');
const hraqstnavicon2 = require('../../../assets/images/hra-qst-nav-icon2.png');
const progcirc5 = require('../../../assets/images/prog-circ5.png');
const progcirc4 = require('../../../assets/images/prog-circ4.png');
const progcirc6 = require('../../../assets/images/prog-circ6.png');
const progcirc7 = require('../../../assets/images/prog-circ7.png');
const chart8 = require('../../../assets/images/chart8.png');
const nextbtnicon = require('../../../assets/images/next-btn-icon.png');
const prevbtnicon = require('../../../assets/images/prev-btn-icon.png');
const headicn1 = require('../../../assets/images/head-icn1.png');
const chart9 = require('../../../assets/images/chart9.png');
const filtricon1 = require('../../../assets/images/filtr-icon1.png');
const gendrm = require('../../../assets/images/gendr-m.png');
const gendrf = require('../../../assets/images/gendr-f.png');
const filtricon2 = require('../../../assets/images/filtr-icon2.png');
const filtricon3 = require('../../../assets/images/filtr-icon3.png');
const filtricon8 = require('../../../assets/images/filtr-icon8.png');
const progcirc8 = require('../../../assets/images/prog-circ8.png');
const progcirc9 = require('../../../assets/images/prog-circ9.png');
const campicon1 = require('../../../assets/images/camp-icon1.png');
const campicon2 = require('../../../assets/images/camp-icon2.png');
const campicon3 = require('../../../assets/images/camp-icon3.png');
const campicon4 = require('../../../assets/images/camp-icon4.png');
const campicon5 = require('../../../assets/images/camp-icon5.png');
const campicon6 = require('../../../assets/images/camp-icon6.png');
const campicon7 = require('../../../assets/images/camp-icon7.png');
const campicon8 = require('../../../assets/images/camp-icon8.png');
const campicon9 = require('../../../assets/images/camp-icon9.png');
const campicon10 = require('../../../assets/images/camp-icon10.png');
const campicon11 = require('../../../assets/images/camp-icon11.png');
const campicon12 = require('../../../assets/images/camp-icon12.png');
const campicon13 = require('../../../assets/images/camp-icon13.png');
const campicon14 = require('../../../assets/images/camp-icon14.png');
const campicon15 = require('../../../assets/images/camp-icon15.png');
const campicon16 = require('../../../assets/images/camp-icon16.png');
const campicon17 = require('../../../assets/images/camp-icon17.png');
const campicon18 = require('../../../assets/images/camp-icon18.png');
const chart11 = require('../../../assets/images/chart11.png');
const chart12 = require('../../../assets/images/chart12.png');
const wellomtr = require('../../../assets/images/Group1022.png');
const wellomtr1 = require('../../../assets/images/groupprog.png');
//-----------Stateless Functional Component named Reports--------//
function Reports() {
    /* Variables */
    const [sideNav, setSideNav] = React.useState(false)
    const [userLevel, setUserLevel] = React.useState(1)
    const [totalHRA, setTotalHRA] = React.useState(0)
    const [myBodyTotal, setMyBodyTotal] = React.useState(0)
    const [myMindTotal, setMyMindTotal] = React.useState(0)
    const [myLifeStyleTotal, setMyLifeStyleTotal] = React.useState(0)
    const [bodyPersonal, setBodyPersonal] = React.useState(0)
    const [bodyBiometric, setBodyBiometric] = React.useState(0)
    const [bodyClinical, setBodyClinical] = React.useState(0)
    const [mindStress, setMindStress] = React.useState(0)
    const [dietLifestyle, setDietLifestyle] = React.useState(0)
    const [physicalLifestyle, setPhysicalLifestyle] = React.useState(0)
    const [sleepLifestyle, setSleepLifestyle] = React.useState(0)
    const [tobaccoLifestyle, setTobaccoLifestyle] = React.useState(0)
    const [alcoholLifestyle, setAlcoholLifestyle] = React.useState(0)
    const [healthAnalysisReport, setHealthAnalysisReport] = React.useState([])
    const [campaignList1, setCampaignList1] = React.useState([])
    const [campaignList2, setCampaignList2] = React.useState([])
    const [campaignReportList1, setCampaignReportList1] = React.useState({})
    const [campaignReportList2, setCampaignReportList2] = React.useState({})
    const [campDtlId1, setCampDtlId1] = React.useState('')
    const [campDtlId2, setCampDtlId2] = React.useState('')
    const [campHra, setCampHra] = React.useState("")
    const [campHra2, setCampHra2] = React.useState("")
    const [campEmp, setCampEmp] = React.useState({})
    const [campEmpArr, setCampEmpArr] = React.useState([])
    const [campEmp2, setCampEmp2] = React.useState({})
    const [campEmpArr2, setCampEmpArr2] = React.useState([])
    const [campAge, setCampAge] = React.useState({})
    const [campAge2, setCampAge2] = React.useState({})
    const [campGender, setCampGender] = React.useState({})
    const [campGender2, setCampGender2] = React.useState({})
    const [campResponse, setCampResponse] = React.useState({})
    const [campResponse2, setCampResponse2] = React.useState({})
    const [campMyBody, setCampMyBody] = React.useState({})
    const [campMyBody2, setCampMyBody2] = React.useState({})
    const [campMyLifeStyle, setCampMyLifeStyle] = React.useState({})
    const [campMyLifeStyle2, setCampMyLifeStyle2] = React.useState({})
    const [campMyMind, setCampMyMind] = React.useState({})
    const [campMyMind2, setCampMyMind2] = React.useState({})
    const [campPrevHealth, setCampPrevHealth] = React.useState({})
    const [campPrevHealth2, setCampPrevHealth2] = React.useState({})
    const [campSmoking, setCampSmoking] = React.useState({})
    const [campSmoking2, setCampSmoking2] = React.useState({})
    const [campAlcohol, setCampAlcohol] = React.useState({})
    const [campAlcohol2, setCampAlcohol2] = React.useState({})
    const [campDiet, setCampDiet] = React.useState({})
    const [campDiet2, setCampDiet2] = React.useState({})
    const [campActivity, setCampActivity] = React.useState({})
    const [campActivity2, setCampActivity2] = React.useState({})
    const [campSleep, setCampSleep] = React.useState({})
    const [campSleep2, setCampSleep2] = React.useState({})
    const [campDiabetes, setCampDiabetes] = React.useState({})
    const [campDiabetes2, setCampDiabetes2] = React.useState({})
    const [campHeart, setCampHeart] = React.useState({})
    const [campHeart2, setCampHeart2] = React.useState({})
    const [campBodyMass, setCampBodyMass] = React.useState({})
    const [campBodyMass2, setCampBodyMass2] = React.useState({})
    const [campFinSec, setCampFinSec] = React.useState({})
    const [campFinSec2, setCampFinSec2] = React.useState({})
    const [campMetaHealthRisk, setCampMetaHealthRisk] = React.useState({})
    const [campMetaHealthRisk2, setCampMetaHealthRisk2] = React.useState({})
    const [campMotivProd, setCampMotivProd] = React.useState({})
    const [campMotivProd2, setCampMotivProd2] = React.useState({})
    const [campPainErgo, setCampPainErgo] = React.useState({})
    const [campPainErgo2, setCampPainErgo2] = React.useState({})
    const [campStressIndex, setCampStressIndex] = React.useState({})
    const [campStressIndex2, setCampStressIndex2] = React.useState({})
    const [campaignList, setCampaignList] = React.useState([])
    const [campaign1, setCampaign1] = React.useState("")
    const [campaign2, setCampaign2] = React.useState("")
    const [hearder, setHeader] = React.useState([])
    const [hearderArr, setHeaderArr] = React.useState([])
    const [isActive, setIsActive] = React.useState('')
    const [reportLevel, setReportLevel] = React.useState('')
    const [pieData, setPieData] = React.useState({
        labels: [],
        datasets: [{
            label: '',
            data: [],
            backgroundColor: [
                '#1FA82D',
                '#FFBF3F',
                '#F24255'
            ],
            hoverOffset: 4,
            borderWidth: 5
        }]
    })
    const [recommendation, setRecommendation] = React.useState('')
    const [insights, setInsights] = React.useState('')
    const [analysis, setAnalysis] = React.useState([])
    const [genderArr, setGenderArr] = React.useState([])
    const [ageArr, setAgeArr] = React.useState([])
    const [bmiArr, setBmiArr] = React.useState([])
    const [gender, setGender] = React.useState('')
    const [age, setAge] = React.useState('')
    const [bmi, setBmi] = React.useState('')
    const [headerId, setHeaderId] = React.useState('')
    var labels = []
    const [data, setData] = React.useState({
        labels,
        datasets:
            [
                {
                    label: 'Dataset 1',
                    data: labels.map(() => 1550),
                    backgroundColor: '#069E15',
                    barThickness: 40,
                    borderRadius: 5
                },
                {
                    label: 'Dataset 2',
                    data: labels.map(() => 2360),
                    backgroundColor: '#FFBF3F',
                    barThickness: 40,
                    borderRadius: 5
                },
                {
                    label: 'Dataset 3',
                    data: labels.map(() => 3590),
                    backgroundColor: '#F24255',
                    barThickness: 40,
                    borderRadius: 5
                },
            ],
    })
    const [analysisDiv, SetAnalysisDiv] = React.useState(false)
    const [analysisDivShow, SetAnalysisDivShow] = React.useState(false)
    const [search, setSearch] = React.useState("");
    const [hraColor, setHraColor] = useState("")
    const [hraColor1, setHraColor1] = useState("")
    var reqData = {
        "userId": getUserData().response.userId,
        "orgId": getUserData().response.orgn_id,
        "userType": userLevel,
        "rephdrId": headerId,
        "gender": gender,
        "bmi": bmi,
        "age": age
    }
    var analysisData = {
        "userId": getUserData().response.userId,
        "userType": userLevel,
        "orgId": getUserData().response.orgn_id,
        "gender": gender,
        "bmi": bmi,
        "age": age
    }
    /* Functions */
    //------------------UseEffect-----------------//
    useEffect(() => {
        getHealthAnalysisReportByHeaderFun(reqData)
    }, [headerId, gender, bmi, age])
    useEffect(() => {
        getHealthAnalysis(analysisData)
    }, [gender, bmi, age])
    useEffect(() => {
        if (getUserData().response.parent_orgn_id == "0") {
            setUserLevel(1)
        } else {
            if (getUserData().response.is_child == "0") {
                setUserLevel(2)
            } else {
                setUserLevel(3)
            }
        }
        getHealthWellReport()
        getAnalysisReportHeaderFun()
        getAnalysisReportFiltersFun()
    }, [])
    //-------------- callback functions -------------//
    // Well-o-meter
    function clikwellometr() {
        showLoader()
        document.getElementById('down_rprt').style.display = 'none';
        setSideNav(false)
        setCampaignList1([]);
        setCampaignList2([]);
        setCampHra("")
        setCampHra2("")
        setCampEmp({})
        setCampEmpArr([])
        setCampEmp2({})
        setCampEmpArr2([])

        setCampAge({ "18-35": 0, "36-50": 0, "51-65": 0, "65+": 0 })
        setCampAge2({ "18-35": 0, "36-50": 0, "51-65": 0, "65+": 0 })

        setCampGender({ "Female": 0, "Male": 0 })
        setCampGender2({ "Female": 0, "Male": 0 })

        setCampResponse({
            "completed": 0,
            "notcompleted": 0,
            "notstarted": 0
        })
        setCampResponse2({
            "completed": 0,
            "notcompleted": 0,
            "notstarted": 0
        })

        setCampMyBody({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMyBody2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampMyLifeStyle({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMyLifeStyle2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampMyMind({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMyMind2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })


        setCampPrevHealth({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampPrevHealth2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampSmoking({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampSmoking2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampAlcohol({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampAlcohol2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampDiet({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampDiet2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampActivity({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampActivity2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampSleep({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampSleep2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampDiabetes({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampDiabetes2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampHeart({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampHeart2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampBodyMass({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampBodyMass2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampFinSec({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampFinSec2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMetaHealthRisk({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMetaHealthRisk2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMotivProd({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMotivProd2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampPainErgo({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampPainErgo2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampStressIndex({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampStressIndex2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setTimeout(() => {
            hideLoader()
        }, 1000);
    }
    // Health Categories
    function clikheltcatg() {
        showLoader()
        document.getElementById('down_rprt').style.display = 'none';
        setSideNav(true)
        getHealthAnalysisReport()
        setCampaignList1([]);
        setCampaignList2([]);
        setCampHra("")
        setCampHra2("")
        setCampEmp({})
        setCampEmpArr([])
        setCampEmp2({})
        setCampEmpArr2([])
        setCampAge({ "18-35": 0, "36-50": 0, "51-65": 0, "65+": 0 })
        setCampAge2({ "18-35": 0, "36-50": 0, "51-65": 0, "65+": 0 })

        setCampGender({ "Female": 0, "Male": 0 })
        setCampGender2({ "Female": 0, "Male": 0 })

        setCampResponse({
            "completed": 0,
            "notcompleted": 0,
            "notstarted": 0
        })
        setCampResponse2({
            "completed": 0,
            "notcompleted": 0,
            "notstarted": 0
        })

        setCampMyBody({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMyBody2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampMyLifeStyle({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMyLifeStyle2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampMyMind({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMyMind2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })


        setCampPrevHealth({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampPrevHealth2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampSmoking({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampSmoking2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampAlcohol({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampAlcohol2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampDiet({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampDiet2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampActivity({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampActivity2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampSleep({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampSleep2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })

        setCampDiabetes({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampDiabetes2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampHeart({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampHeart2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampBodyMass({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampBodyMass2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampFinSec({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampFinSec2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMetaHealthRisk({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMetaHealthRisk2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMotivProd({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMotivProd2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampPainErgo({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampPainErgo2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampStressIndex({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampStressIndex2({
            "doingWell": 0,
            "risk": 0,
            "sequence": 0,
            "takeAction": 0,
            "total": 0
        })
        setTimeout(() => {
            hideLoader()
        }, 1000);
    }
    // Compare
    function clikcomprr() {
        showLoader()
        document.getElementById('down_rprt').style.display = 'block';
        setSideNav(false)
        getCampaign();
        setTimeout(() => {
            hideLoader()
        }, 1000);
    }

    const options = {
        plugins: {
            title: {
                display: true,
            },
            legend: false,
        },
        responsive: true,
        elements: {
            point: {
                radius: 1
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false      // show/hide grid line in x-axis
                },
            },
            y: {
                stacked: true,
            },
        },
    };

    function getHealthWellReport() {
        var data = {
            "userId": getUserData().response.userId,
            "userType": userLevel,
            "orgId": getUserData().response.orgn_id
        }
        showLoader()
        getHealthWellOMeterReport(data).then(result => {
            hideLoader()
            setTotalHRA(Number(result.data.response.totalHraScore).toFixed(2))
            setMyBodyTotal(Math.round(result.data.response.subCatWiseScore.myBody.total.percent))
            setMyMindTotal(Math.round(result.data.response.subCatWiseScore.myMind.total.percent))
            setMyLifeStyleTotal(Math.round(result.data.response.subCatWiseScore.lifestyle.total.percent))
            setBodyPersonal(Math.round(result.data.response.subCatWiseScore.myBody.Personal.percent))
            setBodyBiometric(Math.round(result.data.response.subCatWiseScore.myBody.Biometrics.percent))
            setBodyClinical(Math.round(result.data.response.subCatWiseScore.myBody.Clinical.percent))
            setMindStress(Math.round(result.data.response.subCatWiseScore.myMind.stress.percent))
            setDietLifestyle(Math.round(result.data.response.subCatWiseScore.lifestyle.diet.percent))
            setPhysicalLifestyle(Math.round(result.data.response.subCatWiseScore.lifestyle.physicalActivity.percent))
            setSleepLifestyle(Math.round(result.data.response.subCatWiseScore.lifestyle.sleep.percent))
            setTobaccoLifestyle(Math.round(result.data.response.subCatWiseScore.lifestyle.tobacco.percent))
            setAlcoholLifestyle(Math.round(result.data.response.subCatWiseScore.lifestyle.alcohol.percent))
        })
    }
    function removeObjectWithId(arr, campaigndtlid) {
        const objWithIdIndex = arr.findIndex((obj) => obj.campaigndtlid == campaigndtlid);
        if (objWithIdIndex > -1) {
            arr.splice(objWithIdIndex, 1);
        }
        return arr;
    }
    function getCampaign() {
        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id
        }
        showLoader()
        getCampaignList(data).then(result => {
            hideLoader()
            setCampaignList1(result.data.response);
            setCampaignList2(result.data.response);
        })
    }
    function selectCampaign1(e) {
        getCampaignReport1(e.target.value);
    }
    function selectCampaign2(e) {
        getCampaignReport2(e.target.value);
    }
    function getCampaignReport1(val) {
        setHraColor("")
        setCampEmpArr([])
        setCampEmp({})
        setCampAge({ "18-35": 0, "36-50": 0, "51-65": 0, "65+": 0 })
        setCampGender({ "Female": 0, "Male": 0 })
        setCampResponse({
            "completed": 0,
            "notcompleted": 0,
            "notstarted": 0
        })
        setCampHra("")
        setCampMyBody({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMyLifeStyle({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMyMind({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampPrevHealth({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampSmoking({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampAlcohol({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampDiet({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampActivity({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampSleep({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampDiabetes({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampHeart({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampBodyMass({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampFinSec({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMetaHealthRisk({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMotivProd({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampPainErgo({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampStressIndex({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })

        var err = 0

        if (val == '') {
            err++
        }


        var data = {
            "userId": getUserData().response.userId,
            "campaignDtlId": val,
            "orgId": getUserData().response.orgn_id
        }

        if (err == 0) {
            showLoader()
            getCampaignReportList(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    if (result.data.response != 0) {
                        var partArr = [{ data: 0, value: result.data.response.employee.completed },
                        { data: 1, value: result.data.response.employee.notCompleted }]
                        setCampEmpArr(partArr)
                        setCampEmp(result.data.response.employee);
                        setCampAge(result.data.response.age);
                        setCampGender(result.data.response.gender);
                        setCampResponse(result.data.response.response);
                        setCampHra(result.data.response.totalHRA);
                        setCampMyBody(result.data.response.mybody);
                        setCampMyLifeStyle(result.data.response.myLifeStyle);
                        setCampMyMind(result.data.response.myMind);
                        setCampPrevHealth(result.data.response['Preventive health']);
                        setCampSmoking(result.data.response['Smoking']);
                        setCampAlcohol(result.data.response['Alcohol']);
                        setCampDiet(result.data.response['Diet']);
                        setCampActivity(result.data.response['physical activity']);
                        setCampSleep(result.data.response['Sleep']);
                        setCampDiabetes(result.data.response['Diabetes risk']);
                        setCampHeart(result.data.response['Heart risk']);
                        setCampBodyMass(result.data.response['Body mass index']);
                        setCampFinSec(result.data.response['Financial security']);
                        setCampMetaHealthRisk(result.data.response['Metabolic health risk']);
                        setCampMotivProd(result.data.response['Motivation & Productivity']);
                        setCampPainErgo(result.data.response['Pain & Ergonomics']);
                        setCampStressIndex(result.data.response['The stress index']);


                        if (result.data.response.totalHRA <= 40) {
                            // red
                            setHraColor('rgba(242, 66, 85, 1)')
                        } else if (result.data.response.totalHRA > 40 && result.data.response.totalHRA <= 70) {
                            // yellow
                            setHraColor('rgba(255, 191, 63, 1)')
                        } else {
                            //green
                            setHraColor('rgba(31, 168, 45, 1)')
                        }
                    } else {
                        NotificationManager.error(result.data.message);
                    }
                } else {
                    NotificationManager.error(result.data.message);
                }

            })
        }

    }
    function getCampaignReport2(val) {

        setCampEmpArr2([])
        setCampEmp2({})
        setCampAge2({ "18-35": 0, "36-50": 0, "51-65": 0, "65+": 0 })
        setCampGender2({ "Female": 0, "Male": 0 })
        setCampResponse2({
            "completed": 0,
            "notcompleted": 0,
            "notstarted": 0
        })
        setCampHra2("")
        setCampMyBody2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMyLifeStyle2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMyMind2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampPrevHealth2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampSmoking2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampAlcohol2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampDiet2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampActivity2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampSleep2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampDiabetes2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampHeart2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampBodyMass2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampFinSec2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMetaHealthRisk2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampMotivProd2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampPainErgo2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })
        setCampStressIndex2({
            "doingWell": 0,
            "risk": 0,
            "takeAction": 0,
            "total": 0
        })


        var err = 0

        if (val == '') {
            err++
        }

        var data = {
            "userId": getUserData().response.userId,
            "campaignDtlId": val,
            "orgId": getUserData().response.orgn_id
        }

        if (err == 0) {
            showLoader()
            getCampaignReportList(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    if (result.data.response != 0) {
                        var partArr2 = [{ data: 0, value: result.data.response.employee.completed },
                        { data: 1, value: result.data.response.employee.notCompleted }]
                        setCampEmpArr2(partArr2)
                        setCampEmp2(result.data.response.employee);
                        setCampAge2(result.data.response.age);
                        setCampGender2(result.data.response.gender);
                        setCampResponse2(result.data.response.response);
                        setCampHra2(result.data.response.totalHRA);
                        setCampMyBody2(result.data.response.mybody);
                        setCampMyLifeStyle2(result.data.response.myLifeStyle);
                        setCampMyMind2(result.data.response.myMind);
                        setCampPrevHealth2(result.data.response['Preventive health']);
                        setCampSmoking2(result.data.response['Smoking']);
                        setCampAlcohol2(result.data.response['Alcohol']);
                        setCampDiet2(result.data.response['Diet']);
                        setCampActivity2(result.data.response['physical activity']);
                        setCampSleep2(result.data.response['Sleep']);
                        setCampDiabetes2(result.data.response['Diabetes risk']);
                        setCampHeart2(result.data.response['Heart risk']);
                        setCampBodyMass2(result.data.response['Body mass index']);
                        setCampFinSec2(result.data.response['Financial security']);
                        setCampMetaHealthRisk2(result.data.response['Metabolic health risk']);
                        setCampMotivProd2(result.data.response['Motivation & Productivity']);
                        setCampPainErgo2(result.data.response['Pain & Ergonomics']);
                        setCampStressIndex2(result.data.response['The stress index']);

                        if (result.data.response.totalHRA <= 40) {
                            // red
                            setHraColor1('rgba(242, 66, 85, 1)')
                        } else if (result.data.response.totalHRA > 40 && result.data.response.totalHRA <= 70) {
                            // yellow
                            setHraColor1('rgba(255, 191, 63, 1)')
                        } else {
                            //green
                            setHraColor1('rgba(31, 168, 45, 1)')
                        }
                    } else {
                        NotificationManager.error(result.data.message);
                    }

                } else {
                    NotificationManager.error(result.data.message);
                }
            })
        }

    }
    const formatdate = (val) => {
        let months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"]
        let nd = new Date(val);
        let year = nd.getFullYear();
        let month = ("0" + (nd.getMonth() + 1)).slice(-2);
        let day = ("0" + nd.getDate()).slice(-2)
        let str = day + "/" + month + "/" + year;
        return str;
    }
    function getAnalysisReportHeaderFun() {
        var data = {
            "userId": getUserData().response.userId
        }
        showLoader()
        getAnalysisReportHeader(data).then(result => {
            hideLoader()
            setHeader(result.data.response)
            setHeaderArr(result.data.response)
            for (var i = 0; i < result.data.response.length; i++) {
                if (i == 0) {
                    setIsActive(result.data.response[i].headerName)
                    setHeaderId(result.data.response[i].id)
                }
            }
        })
    }
    function searchHeader(value) {
        if (value.length >= '2') {
            showLoader()
            let a = hearder;
            var term = value; // search term (regex pattern)
            var search = new RegExp(term, 'i'); // prepare a regex object
            let b = a.filter(item => search.test(item.headerName));
            setHeaderArr(b)
            for (var i = 0; i < b.length; i++) {
                if (i == 0) {
                    setIsActive(b[i].headerName)
                    setHeaderId(b[i].id)
                }
            }
            setTimeout(() => {
                hideLoader()
            }, 1000);
        }
        if (value.length == '0') {
            showLoader()
            setHeaderArr(hearder)
            for (var i = 0; i < hearder.length; i++) {
                if (i == 0) {
                    setIsActive(hearder[i].headerName)
                    setHeaderId(hearder[i].id)
                }
            }
            setTimeout(() => {
                hideLoader()
            }, 1000);
        }
    }
    function getHealthAnalysisReportByHeaderFun(reqData) {
        showLoader()
        getHealthAnalysisReportByHeader(reqData).then(result => {
            setTimeout(() => {
                hideLoader()
            }, 1000);
            if (result.data.success) {
                if (result.data.response.length == 0) {
                    setReportLevel("")
                    setPieData({
                        labels: [],
                        datasets: [{
                            label: "",
                            data: [],
                            backgroundColor: [
                                '#1FA82D',
                                '#FFBF3F',
                                '#F24255'
                            ],
                            hoverOffset: 4,
                            borderWidth: 5
                        }]
                    })
                    setRecommendation("")
                    setAnalysis([])
                } else if (result.data.response.length != 0) {
                    if (result.data.response[0].analysis.length == 0) {
                        setAnalysis([])
                    } else {
                        setAnalysis(result.data.response[0].analysis)
                    }
                    if (result.data.response[0].dataset.length == 0) {
                        setPieData({
                            labels: [],
                            datasets: [{
                                label: "",
                                data: [],
                                backgroundColor: [
                                    '#1FA82D',
                                    '#FFBF3F',
                                    '#F24255'
                                ],
                                hoverOffset: 4,
                                borderWidth: 5
                            }]
                        })
                    } else {
                        var tempArr = []
                        for (let data of result.data.response[0].dataset) {
                            tempArr.push(data.value)
                        }
                        setPieData({
                            labels: [],
                            datasets: [{
                                label: "",
                                data: tempArr,
                                backgroundColor: [
                                    '#1FA82D',
                                    '#FFBF3F',
                                    '#F24255'
                                ],
                                hoverOffset: 4,
                                borderWidth: 5
                            }]
                        })
                    }
                    if (result.data.response[0].label == '' || result.data.response[0].label == null) {
                        setReportLevel('')
                    } else {
                        setReportLevel(result.data.response[0].label)
                    }
                    if (result.data.response[0].recommendation == '' || result.data.response[0].recommendation == null) {
                        setRecommendation('')
                    } else {
                        setRecommendation(result.data.response[0].recommendation)
                    }
                    if (result.data.response[0].insight == '' || result.data.response[0].insight == null) {
                        setInsights('')
                    } else {
                        setInsights(result.data.response[0].insight)
                    }
                }
            }
        })
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
    function getHealthAnalysis(analysisData) {
        showLoader()
        getHealthAnalysisReport(analysisData).then(result => {
            hideLoader()
            if (result.data.success) {
                result.data.response.sort((a, b) => {
                    return a.sequence - b.sequence;
                })
                let lebels = [];
                let normal = [];
                let medium = [];
                let high = [];
                for (const obj of result.data.response) {

                    lebels.push(obj.label)
                    normal.push(obj.normal)
                    medium.push(obj.medium)
                    high.push(obj.high)
                }
                setData({
                    labels: lebels,
                    datasets: [{
                        label: 'Risk',
                        data: high,
                        backgroundColor: '#F24255',
                        barThickness: 40,
                        borderRadius: 5
                    },
                    {
                        label: 'Take Action',
                        data: medium,
                        backgroundColor: '#FFBF3F',
                        barThickness: 40,
                        borderRadius: 5
                    },
                    {
                        label: 'Doning Well',
                        data: normal,
                        backgroundColor: '#069E15',
                        barThickness: 40,
                        borderRadius: 5
                    }],
                })
            }
        })
    }
    const resetStateDataForClearAll = async () => {
        setGender('')
        setAge('')
        setBmi('')
    }
    const clearAll = async (event) => {
        await resetStateDataForClearAll();
        for (var i = 0; i < genderArr.length; i++) {
            $('#edit_gender' + i).removeClass('tick')
        }
        for (var i = 0; i < ageArr.length; i++) {
            $('#edit_age' + i).removeClass('tick')
        }
        for (var i = 0; i < bmiArr.length; i++) {
            $('#edit_bmi' + i).removeClass('tick')
        }
    }
    const genderClass = (index) => {
        for (var i = 0; i < genderArr.length; i++) {
            if (i == index) {
                console.log(i)
                $('#edit_gender' + i).addClass('tick')
            } else {
                $('#edit_gender' + i).removeClass('tick')
            }
        }
    }
    const ageClass = (index) => {
        for (var i = 0; i < ageArr.length; i++) {
            if (i == index) {
                console.log(i)
                $('#edit_age' + i).addClass('tick')
            } else {
                $('#edit_age' + i).removeClass('tick')
            }
        }
    }
    const bmiClass = (index) => {
        for (var i = 0; i < bmiArr.length; i++) {
            if (i == index) {
                console.log(i)
                $('#edit_bmi' + i).addClass('tick')
            } else {
                $('#edit_bmi' + i).removeClass('tick')
            }
        }
    }
    function getCampaign() {
        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id
        }
        getCampaignList(data).then(result => {
            let respData = result.data.response;
            setCampaignList(respData);
            setCampaignList1(respData);
            setCampaignList2(respData);
        })
    }
    function selectCampaign1(e) {
        showLoader()
        getCampaignReport1(e.target.value);
        setCampaignList2(deleteCommonItem(campaignList, parseInt(e.target.value), "campaigndtlid"));
        setTimeout(() => {
            hideLoader()
        }, 1000);
    }
    function selectCampaign2(e) {
        showLoader()
        getCampaignReport2(e.target.value);
        setCampaignList1(deleteCommonItem(campaignList, parseInt(e.target.value), "campaigndtlid"));
        setTimeout(() => {
            hideLoader()
        }, 1000);
    }
    const downloadReportCompare = () => {
        var err = 0
        var temp = campaignList
        var name1
        var name2
        if (campaign1) {
            for (let data of temp) {
                if (campaign1 == data.campaigndtlid) {
                    name1 = data.campaigndesc + ' - ' + formatdate(data.camp_start_datetime)
                }
            }
        } else {
            NotificationManager.error("Please select first campaign");
            return false
        }
        if (campaign2) {
            for (let data of temp) {
                if (campaign2 == data.campaigndtlid) {
                    name2 = data.campaigndesc + ' - ' + formatdate(data.camp_start_datetime)
                }
            }
        } else {
            NotificationManager.error("Please select second campaign");
            return false
        }
        var data = {
            "userId": getUserData().response.userId,
            "campaignDtlId": campaign1,
            "secondCampaignDtlId": campaign2,
            "orgId": getUserData().response.orgn_id,
            "firstCampaign": name1 + "",
            "secondCampaign": name2 + ""
        }
        showLoader()
        generateCampaignCompareReport(data).then(result => {
            if (result.data.success) {
                saveAs(COMPANY_REPORT_PDF_URL + result.data.response, result.data.response)
                userEvent("pdf download")
            } else {
                NotificationManager.error(result.data.message);
            }
            setTimeout(() => {
                hideLoader()
            }, 1000);
        })

    }
    const reportDownload = () => {
        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "campaignDtlId": "0"   // 0 if for organization else campaigndtlid
        }

        showLoader()
        getAggregatedReport(data).then(result => {
            if (result.data.success) {
                saveAs(COMPANY_REPORT_PDF_URL + result.data.response, result.data.response)
                userEvent("pdf download")
            } else {
                NotificationManager.error(result.data.message);
            }

            setTimeout(() => {
                hideLoader()
            }, 1000);
        })

    }





    return (

        <>
            <div className={`main ${sideNav ? "mainBodyOverflow" : ""}  `}>
                <main className="content">
                    <div className="container-fluid p-0">
                        <div className="row mb-2 mb-lg-4">
                            <div className="col-md-12 main-hdng">
                                <div className="hesd_ng">
                                    <h3 className="setngs">Reports </h3>
                                    <div className='layoutNav navbar-light'>
                                        {sideNav ? <LoggedLayout /> : null}
                                    </div>
                                </div>
                                <br className="clear" />

                                <div className="addcompny_tab mt-4 wit_downld">

                                    {/* TAB */}
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        {/* Well-o-meter */}
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link active"
                                                id="welmtr_t-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#welmtr_t"
                                                type="button"
                                                role="tab"
                                                aria-controls="welmtr_t"
                                                aria-selected="true"
                                                onClick={clikwellometr}
                                            >
                                                Well-o-meter
                                            </button>
                                        </li>
                                        {/* Health Categories */}
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="heltcatg_t-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#heltcatg_t"
                                                type="button"
                                                role="tab"
                                                aria-controls="heltcatg_t"
                                                aria-selected="false"
                                                onClick={clikheltcatg}
                                            >
                                                Health Categories
                                            </button>
                                        </li>
                                        {/* Compare */}
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="compr_t-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#compr_t"
                                                type="button"
                                                role="tab"
                                                aria-controls="compr_t"
                                                aria-selected="false"
                                                onClick={clikcomprr}
                                            >
                                                Compare
                                            </button>
                                        </li>
                                    </ul>

                                    <button
                                        id="down_rprt"
                                        className="btn down_btn"
                                        onClick={downloadReportCompare}
                                    >
                                        <i className="bi bi-download mx-2"></i>
                                        Download Report
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <div className="mb-4 setting_page">
                                    <div className="tab-content" id="myTabContent">

                                        {/* Well-o-meter */}
                                        <div className="tab-pane fade show active" id="welmtr_t" role="tabpanel"
                                            aria-labelledby="welmtr_dtlt-tab">
                                            <div className="row mb-2 mb-lg-4">
                                                <div className="col-lg-12">
                                                    <div className="bg-white shadow_d p-4 rounded-3 dashboard_bg_img">
                                                        <h2>Welcome to the health report!</h2>
                                                        <p>We are pleased to provide you with an update on the current health status.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-4">
                                                <div className="col-md-12">
                                                    <div className="bg-white shadow_d rounded-3 ttl_gra_scr">
                                                        <div className="ttl_gra_scr_list">
                                                            <div className='wellimg'>
                                                                <img src={wellomtr1}></img>
                                                                <div className='wellimg_cont'>
                                                                    <strong>{totalHRA}</strong>
                                                                    <p>Wellness Score</p>
                                                                </div>
                                                            </div>
                                                            {/* <p> This Tree of life represents the health of your people in the most holistic way </p>
                                                            <ul>
                                                                <li className="complte active">01/01/2023</li>
                                                                <li className="complte active">01/06/2023</li>
                                                                <li className="active">01/06/2023</li>
                                                                <li>01/06/2023</li>
                                                                <li>01/06/2023</li>
                                                                <li>01/06/2023</li>
                                                            </ul> */}
                                                        </div>
                                                        <div className="ttl_gra_scr_rit">
                                                            <h3>Total HRA Score</h3>
                                                            <p>
                                                                <strong>{totalHRA}<span>/100</span></strong>
                                                            </p>
                                                            <div className="ttl_gra_scr_rit_inr">
                                                                <strong>Insights</strong>
                                                                <p>{insights}</p>
                                                            </div>
                                                            <button
                                                                className="btn down_btn"
                                                                onClick={reportDownload}
                                                            >
                                                                <i className="bi bi-download"></i>
                                                                &nbsp;&nbsp;Download Report
                                                            </button>
                                                            <ul>
                                                                <li><span className="prmy"></span> Doing well</li>
                                                                <li><span className="infrm"></span> Take Action</li>
                                                                <li><span className="dngr"></span> Risk</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mt-4">
                                                <div className="col-md-4">
                                                    <div className="bg-white shadow_d rounded-4 h-100 progs_tre_dv bdy_prog">
                                                        <div className="progs_top">
                                                            <img src={hraqstnavicon1} />
                                                            <strong>Body</strong><span>{myBodyTotal + ' %'}</span>
                                                        </div>
                                                        <ul>
                                                            <li>
                                                                {/* <div><img src={progcirc1} /></div> */}
                                                                <CircularProgressbar value={bodyPersonal} text={`${bodyPersonal}%`} styles={{ path: { stroke: bodyPersonal < 50 ? '#E74C3C' : bodyPersonal < 80 ? '#F7DC6F' : '#229954' }, trail: { stroke: '#EAECEE' }, text: { fill: '#000000', fontSize: '15px' } }} />
                                                                <strong>Personal</strong>
                                                            </li>
                                                            <li>
                                                                {/* <div><img src={progcirc2} /></div> */}
                                                                <CircularProgressbar value={bodyBiometric} text={`${bodyBiometric}%`} styles={{ path: { stroke: bodyBiometric < 50 ? '#E74C3C' : bodyBiometric < 80 ? '#F7DC6F' : '#229954' }, trail: { stroke: '#EAECEE' }, text: { fill: '#000000', fontSize: '15px' } }} />
                                                                <strong>Biometric</strong>
                                                            </li>
                                                            <li>
                                                                {/* <div><img src={progcirc3} /></div> */}
                                                                <CircularProgressbar value={bodyClinical} text={`${bodyClinical}%`} styles={{ path: { stroke: bodyClinical < 50 ? '#E74C3C' : bodyClinical < 80 ? '#F7DC6F' : '#229954' }, trail: { stroke: '#EAECEE' }, text: { fill: '#000000', fontSize: '15px' } }} />
                                                                <strong>Clinical History </strong>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="bg-white shadow_d rounded-4 h-100 progs_tre_dv mnd_prog">
                                                        <div className="progs_top">
                                                            <img src={hraqstnavicon3} />
                                                            <strong>Mind</strong><span>{myMindTotal + ' %'}</span>
                                                        </div>
                                                        <ul>
                                                            <li>
                                                                {/* <div><img src={progcirc1} /></div> */}
                                                                <CircularProgressbar value={mindStress} text={`${mindStress}%`} styles={{ path: { stroke: mindStress < 50 ? '#E74C3C' : mindStress < 80 ? '#F7DC6F' : '#229954' }, trail: { stroke: '#EAECEE' }, text: { fill: '#000000', fontSize: '15px' } }} />
                                                                <strong>Stress</strong>
                                                            </li>

                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="bg-white shadow_d rounded-4 h-100 progs_tre_dv lfstyl_prog">
                                                        <div className="progs_top">
                                                            <img src={hraqstnavicon2} />
                                                            <strong>Lifestyle</strong><span>{myLifeStyleTotal + ' %'}</span>
                                                        </div>
                                                        <ul>
                                                            <li>
                                                                {/* <div><img src={progcirc5} /></div> */}
                                                                <CircularProgressbar value={dietLifestyle} text={`${dietLifestyle}%`} styles={{ path: { stroke: dietLifestyle < 50 ? '#E74C3C' : dietLifestyle < 80 ? '#F7DC6F' : '#229954' }, trail: { stroke: '#EAECEE' }, text: { fill: '#000000', fontSize: '15px' } }} />
                                                                <strong>Diet</strong>
                                                            </li>
                                                            <li>
                                                                {/* <div><img src={progcirc4} /></div> */}
                                                                <CircularProgressbar value={physicalLifestyle} text={`${physicalLifestyle}%`} styles={{ path: { stroke: physicalLifestyle < 50 ? '#E74C3C' : physicalLifestyle < 80 ? '#F7DC6F' : '#229954' }, trail: { stroke: '#EAECEE' }, text: { fill: '#000000', fontSize: '15px' } }} />
                                                                <strong>Physical Activity</strong>
                                                            </li>
                                                            <li>
                                                                {/* <div><img src={progcirc6} /></div> */}
                                                                <CircularProgressbar value={sleepLifestyle} text={`${sleepLifestyle}%`} styles={{ path: { stroke: sleepLifestyle < 50 ? '#E74C3C' : sleepLifestyle < 80 ? '#F7DC6F' : '#229954' }, trail: { stroke: '#EAECEE' }, text: { fill: '#000000', fontSize: '15px' } }} />
                                                                <strong>Sleep </strong>
                                                            </li>
                                                            <li>
                                                                {/* <div><img src={progcirc7} /></div> */}
                                                                <CircularProgressbar value={tobaccoLifestyle} text={`${tobaccoLifestyle}%`} styles={{ path: { stroke: tobaccoLifestyle < 50 ? '#E74C3C' : tobaccoLifestyle < 80 ? '#F7DC6F' : '#229954' }, trail: { stroke: '#EAECEE' }, text: { fill: '#000000', fontSize: '15px' } }} />
                                                                <strong>Smoking </strong>
                                                            </li>
                                                            <li>
                                                                {/* <div><img src={progcirc7} /></div> */}
                                                                <CircularProgressbar value={alcoholLifestyle} text={`${alcoholLifestyle}%`} styles={{ path: { stroke: alcoholLifestyle < 50 ? '#E74C3C' : alcoholLifestyle < 80 ? '#F7DC6F' : '#229954' }, trail: { stroke: '#EAECEE' }, text: { fill: '#000000', fontSize: '15px' } }} />
                                                                <strong>Alcohol </strong>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Health Categories */}
                                        <div className="tab-pane fade" id="heltcatg_t" role="tabpanel" aria-labelledby="heltcatg_t-tab">
                                            <div className="bg-white shadow_d rounded-3">
                                                <div id="recipeCarousel" className="carousel slide" data-bs-ride="carousel">
                                                    <div className="carousel-inner" role="listbox">
                                                        <Bar options={options} data={data} height={60} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white shadow_d rounded-3 py-5 mt-4">
                                                <div className="report_lists">
                                                    <div className="list_src_secn">
                                                        <strong>Search by Risk Factors </strong>
                                                        <div className="assects_src_dv position-relative">
                                                            <input
                                                                type="search"
                                                                className="form-control"
                                                                value={search}
                                                                onChange={(e) => { setSearch(e.target.value) }}
                                                                onKeyUp={(e) => { searchHeader(e.target.value) }}
                                                            />
                                                            <button className="btn no-bg">
                                                                <i className="bi bi-search"></i>
                                                            </button>
                                                        </div>
                                                        <div className="report_list_tab_r"></div>
                                                    </div>
                                                    <div className="report_list_tab">
                                                        <div className="report_list_tab_l">
                                                            <ul className="report_list_ul smootScrol" id="myTab" role="tablist">

                                                                {
                                                                    hearderArr.map((item, index) => (
                                                                        <li key={index}>
                                                                            <button
                                                                                className={`nav-link ${item.headerName == isActive ? "active" : ""} `}
                                                                                id={"report_list_ul1" + index}
                                                                                data-bs-toggle="tab"
                                                                                data-bs-target="#report_list_ul1_t"
                                                                                type="button"
                                                                                role="tab"
                                                                                aria-controls="report_list_ul1_t"
                                                                                aria-selected="true"
                                                                                onClick={() => { setIsActive(item.headerName); setHeaderId(item.id) }}
                                                                            >
                                                                                {item.headerName}
                                                                            </button>
                                                                        </li>
                                                                    ))
                                                                }

                                                            </ul>
                                                        </div>

                                                        <div className="report_list_tab_m">
                                                            <div className="tab-content" id="myTabContent">
                                                                <div className="tab-pane fade show active" id="report_list_ul1_t" role="tabpanel" aria-labelledby="report_list_ul1">
                                                                    <div className="phy_mn_dv">
                                                                        <div className="phycl_hlth_top">
                                                                            <div className="phycl_hlth_l">
                                                                                <h3><img src={headicn1} /> {reportLevel}</h3>
                                                                                <div className="physl_chart">
                                                                                    <div style={{ width: '70%' }}>
                                                                                        <Pie data={pieData} />
                                                                                    </div>

                                                                                    <ul>
                                                                                        <li><span className="prmy"></span> Doing well</li>
                                                                                        <li><span className="infrm"></span> Take Action</li>
                                                                                        <li><span className="dngr"></span> Risk</li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                            <div className="phycl_hlth_r">
                                                                                <div className="phycl_hlth_r_con">
                                                                                    <h4>Insights</h4>
                                                                                    <p>{insights}</p>
                                                                                </div>

                                                                                <div className="accordion" id="accordionExample">
                                                                                    <div className="accordion-item">
                                                                                        <h4 className="accordion-header" id="headingEight">
                                                                                            <button className="accordion-button collapsed" type="button"
                                                                                                data-bs-toggle="collapse" data-bs-target="#collapseEight"
                                                                                                aria-expanded="false" aria-controls="collapseEight">
                                                                                                Recommendation</button>
                                                                                        </h4>

                                                                                        <div id="collapseEight" className="accordion-collapse collapse"
                                                                                            aria-labelledby="headingEight"
                                                                                            data-bs-parent="#accordionExample">
                                                                                            <div className="accordion-body">

                                                                                                <p>{recommendation}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {
                                                                                    <div className="accordion" id="accordionExample">
                                                                                        <div className="accordion-item">
                                                                                            {
                                                                                                analysisDiv ? <></> :
                                                                                                    <>
                                                                                                        <h4 className="accordion-header" id="headingNine">
                                                                                                            <button className="accordion-button collapsed" type="button"
                                                                                                                data-bs-toggle="collapse" data-bs-target="#collapseNine"
                                                                                                                aria-expanded="false" aria-controls="collapseNine" onClick={() => { SetAnalysisDiv(true); SetAnalysisDivShow(true) }}>
                                                                                                                Analysis</button>
                                                                                                        </h4>

                                                                                                        <div id="collapsenine" className="accordion-collapse collapse"
                                                                                                            aria-labelledby="headingnine"
                                                                                                            data-bs-parent="#accordionExample">
                                                                                                            <div className="accordion-body">

                                                                                                                <div className="phycl_hlth_r_con">

                                                                                                                    {
                                                                                                                        analysis.map((item, index) => (
                                                                                                                            <div key={index}>
                                                                                                                                <strong >{item.analysislabel}</strong>
                                                                                                                                <p>{item.analysisdesc}</p>
                                                                                                                            </div>

                                                                                                                        ))
                                                                                                                    }

                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </>
                                                                                            }

                                                                                        </div>
                                                                                    </div>

                                                                                }



                                                                            </div>
                                                                        </div>


                                                                        {
                                                                            analysisDiv ? analysisDivShow ?

                                                                                <>
                                                                                    <div className="accordion" id="accordionExample">
                                                                                        <div className="accordion-item">
                                                                                            <div className="phycl_hlth_btn analysis analysis_arrow">
                                                                                                <h4 className="accordion-header" id="headingNine">
                                                                                                    <button className="accordion-button collapsed" type="button"
                                                                                                        data-bs-toggle="collapse" data-bs-target="#collapseNine"
                                                                                                        aria-expanded="false" aria-controls="collapseNine" onClick={() => { SetAnalysisDiv(false); SetAnalysisDivShow(false) }}>
                                                                                                        Analysis</button>
                                                                                                </h4>
                                                                                                <div className="phycl_hlth_r_con">
                                                                                                    {
                                                                                                        analysis.map((item, index) => (
                                                                                                            <div key={index}>
                                                                                                                <strong >{item.analysislabel}</strong>
                                                                                                                <ul>
                                                                                                                    {
                                                                                                                        item.analysisdesc.split('\n').map((val) => (
                                                                                                                            val.trim() ? <><li>{val}</li></> : null
                                                                                                                        ))
                                                                                                                    }
                                                                                                                </ul>
                                                                                                            </div>
                                                                                                        ))
                                                                                                    }

                                                                                                </div>
                                                                                            </div>
                                                                                        </div></div>
                                                                                </>
                                                                                :
                                                                                <></>

                                                                                : <></>
                                                                        }


                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="report_list_tab_r">
                                                            <div className="filter_secn">
                                                                <div className="filtr_top">
                                                                    <strong>Filters</strong>
                                                                    <button onClick={clearAll}>Clear all</button>
                                                                </div>
                                                                <div className="filter_accrod">
                                                                    <div className="accordion" id="accordionExample">
                                                                        <div className="filter_accrod_sec"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample1" aria-expanded="false" aria-controls="multiCollapseExample1"> <img src={filtricon1} />Gender</button>
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
                                                                                                        onChange={(e) => { setGender(e.target.value); genderClass(index); }}
                                                                                                    />
                                                                                                    <label htmlFor={"gender" + item.id}>
                                                                                                        <img src={IMAGE_URL_ASSETS + item.iconurl} />
                                                                                                        <div className="tick_container">
                                                                                                            <div id={"edit_gender" + index} >&nbsp;</div>
                                                                                                        </div>
                                                                                                    </label>
                                                                                                </div>
                                                                                            ))
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="filter_accrod_sec"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2"><img src={filtricon2} />Age</button>
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
                                                                                                        onChange={(e) => { setAge(e.target.value); ageClass(index) }}
                                                                                                    />
                                                                                                    <label htmlFor={"age" + item.id}>
                                                                                                        <strong>{item.option_text}</strong>
                                                                                                        <div className="tick_container">
                                                                                                            <div id={"edit_age" + index} >&nbsp;</div>
                                                                                                        </div>
                                                                                                    </label>
                                                                                                </div>
                                                                                            ))
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="filter_accrod_sec"><button className="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample3" aria-expanded="false" aria-controls="multiCollapseExample3"><img src={filtricon3} />BMI</button>

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
                                                                                                        onChange={(e) => { setBmi(e.target.value); bmiClass(index) }}
                                                                                                    />

                                                                                                    <label htmlFor={"bmi" + item.id}>
                                                                                                        <strong>{item.option_text}</strong>
                                                                                                        <div className="tick_container">
                                                                                                            <div id={"edit_bmi" + index} >&nbsp;</div>
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
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Compare */}
                                        {/* <div className="tab-pane fade" id="compr_t" role="tabpanel" aria-labelledby="compr_t-tab">
                                            <div className="row mb-2 mb-lg-4">
                                                <div className="col-lg-12">
                                                    <div className="bg-white shadow_d p-4 rounded-3 dashboard_bg_img">
                                                        <h2>Compare your reports</h2>
                                                        <p>We are pleased to provide you with an update on the health status.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-4">
                                                <div className="col-md-12">
                                                    <div className="bg-white shadow_d rounded-3 campng_dv">

                                                        
                                                        <div className="campng_dv_in head_ngs">
                                                            <div className="campng_dv_l">
                                                                <h4>{getUserData().response.organisation_name}</h4>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <select 
                                                                className="form-select" 
                                                                value={campaign1} 
                                                                onChange={(e) => { selectCampaign1(e); setCampaign1(e.target.value); }}
                                                                
                                                                >
                                                                    <option value=''>Select</option>
                                                                    {
                                                                        campaignList1.map((item, index) =>
                                                                            <option key={index} value={item.campaigndtlid}>{item.campaigndesc + ' - ' + formatdate(item.camp_start_datetime)}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                            
                                                            <div className="campng_dv_r" >
                                                                <select 
                                                                className="form-select" 
                                                                value={campaign2} 
                                                                onChange={(e) => { selectCampaign2(e); setCampaign2(e.target.value); }}
                                                                
                                                                >
                                                                    <option value=''>Select</option>
                                                                    {
                                                                        campaignList2.map((item, index) =>
                                                                            <option key={index} value={item.campaigndtlid}>{item.campaigndesc + ' - ' + formatdate(item.camp_start_datetime)}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>

                                                        
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <strong>Total HRA score</strong>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog">
                                                                    <CircularProgressbar
                                                                        value={!campHra ? 0 : campHra}
                                                                        text={`${!campHra ? 0 : campHra}/${100}`}
                                                                        styles={buildStyles({
                                                                            strokeLinecap: 'butt',
                                                                            textSize: '16px',
                                                                            pathTransitionDuration: 0.5,
                                                                            pathColor: hraColor,
                                                                            textColor: '#000000',
                                                                            trailColor: '#E1E1E1',
                                                                            backgroundColor: '#FFFFFF',
                                                                        })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog">
                                                                    <CircularProgressbar
                                                                        value={!campHra2 ? 0 : campHra2}
                                                                        text={`${!campHra2 ? 0 : campHra2}/${100}`}
                                                                        styles={buildStyles({
                                                                            strokeLinecap: 'butt',
                                                                            textSize: '16px',
                                                                            pathTransitionDuration: 0.5,
                                                                            pathColor: hraColor1,
                                                                            textColor: '#000000',
                                                                            trailColor: '#E1E1E1',
                                                                            backgroundColor: '#FFFFFF',
                                                                        })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <strong>No of Participants</strong>
                                                            </div>


                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog">

                                                                    <AnimatedPieHooksParticipants
                                                                        data={campEmpArr}
                                                                        width={170}
                                                                        height={165}
                                                                        innerRadius={0}
                                                                        outerRadius={80}
                                                                    />
                                                                    <div className="chart_data">
                                                                        <strong>Participants -
                                                                            {!campEmp.total ? <span className='mx-2'>0</span> : <span className='mx-2'>{campEmp.total}</span>}
                                                                        </strong>
                                                                        <ul>
                                                                            <li><span className="blu_ro"></span> Completed <strong>
                                                                                {!campEmp.completed ? <>0</> : campEmp.completed}
                                                                            </strong></li>
                                                                            <li><span className="ylo_ro"></span> Not completed
                                                                                <strong>
                                                                                    {!campEmp.notCompleted ? <>0</> : campEmp.notCompleted}
                                                                                </strong>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog">
                                                                    <AnimatedPieHooksParticipants2
                                                                        data={campEmpArr2}
                                                                        width={170}
                                                                        height={165}
                                                                        innerRadius={0}
                                                                        outerRadius={80}
                                                                    />
                                                                    <div className="chart_data">
                                                                        <strong>Participants -
                                                                            {!campEmp2.total ? <span className='mx-2'>0</span> : <span className='mx-2'>{campEmp2.total}</span>}
                                                                        </strong>
                                                                        <ul>
                                                                            <li><span className="blu_ro"></span> Completed <strong>
                                                                                {!campEmp2.completed ? <>0</> : campEmp2.completed}
                                                                            </strong></li>
                                                                            <li><span className="ylo_ro"></span> Not completed
                                                                                <strong>
                                                                                    {!campEmp2.notCompleted ? <>0</> : campEmp2.notCompleted}
                                                                                </strong>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                       
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon1} />
                                                                <span>Age Distribution</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campAge['18-35'] ? <>0</> : campAge['18-35']}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>18 - 35</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="75"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAge ? 0 + "%" : campAge['18-35'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campAge['36-50'] ? <>0</> : campAge['36-50']}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>36 - 50</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="20"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAge ? 0 + "%" : campAge['36-50'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campAge['51-65'] ? <>0</> : campAge['51-65']}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>51 - 65</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAge ? 0 + "%" : campAge['51-65'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campAge['65+'] ? <>0</> : campAge['65+']}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>65+</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="5"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAge ? 0 + "%" : campAge['65+'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campAge2['18-35'] ? <>0</> : campAge2['18-35']}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>18 - 35</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAge2 ? 0 + "%" : campAge2['18-35'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campAge2['36-50'] ? <>0</> : campAge2['36-50']}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>36 - 50</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="30"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAge2 ? 0 + "%" : campAge2['36-50'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campAge2['51-65'] ? <>0</> : campAge2['51-65']}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>51 - 65</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="10"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAge2 ? 0 + "%" : campAge2['51-65'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campAge2['65+'] ? <>0</> : campAge2['65+']}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>65+</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="10"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAge2 ? 0 + "%" : campAge2['65+'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>

                                                       
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon2} />
                                                                <span>Gender Distribution</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campGender['Male'] ? <>0</> : campGender['Male']}% <i className="bi bi-arrow-up-short"></i></span> <strong>Male </strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="62"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campGender ? 0 + "%" : campGender['Male'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campGender['Female'] ? <>0</> : campGender['Female']}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Female</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="20"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campGender ? 0 + "%" : campGender['Female'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campGender2['Male'] ? <>0</> : campGender2['Male']}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Male</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="60"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campGender2 ? 0 + "%" : campGender2['Male'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campGender2['Female'] ? <>0</> : campGender2['Female']}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Female</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="20"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campGender2 ? 0 + "%" : campGender2['Female'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>

                                                    
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon3} />
                                                                <span>Response</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar  ">
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campResponse['completed'] ? <>0</> : campResponse['completed']}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Completed</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="62"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campResponse ? 0 + "%" : campResponse['completed'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campResponse['notcompleted'] ? <>0</> : campResponse['notcompleted']}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Not completed</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="20"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campResponse ? 0 + "%" : campResponse['notcompleted'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campResponse['notstarted'] ? <>0</> : campResponse['notstarted']}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Not started</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="20"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campResponse ? 0 + "%" : campResponse['notstarted'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campResponse2['completed'] ? <>0</> : campResponse2['completed']}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Completed</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="60"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campResponse2 ? 0 + "%" : campResponse2['completed'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campResponse2['notcompleted'] ? <>0</> : campResponse2['notcompleted']}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Not completed</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="20"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campResponse2 ? 0 + "%" : campResponse2['notcompleted'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress blu_bar">
                                                                        <span>{!campResponse2['notstarted'] ? <>0</> : campResponse2['notstarted']}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Not started</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="20"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campResponse2 ? 0 + "%" : campResponse2['notstarted'] + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>

                                                        
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon4} />
                                                                <span>My Body</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <h4>{!campMyBody.total ? null : <>{Number(campMyBody.total).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campMyBody['doingWell'] ? <>0</> : Number(campMyBody['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyBody ? 0 + "%" : Number(campMyBody['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campMyBody['takeAction'] ? <>0</> : Number(campMyBody['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyBody ? 0 + "%" : Number(campMyBody['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campMyBody['risk'] ? <>0</> : Number(campMyBody['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyBody ? 0 + "%" : Number(campMyBody['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <h4>{!campMyBody2['total'] ? null : <>{Number(campMyBody2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campMyBody2['doingWell'] ? <>0</> : Number(campMyBody2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyBody2 ? 0 + "%" : Number(campMyBody2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campMyBody2['takeAction'] ? <>0</> : Number(campMyBody2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyBody2 ? 0 + "%" : Number(campMyBody2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campMyBody2['risk'] ? <>0</> : Number(campMyBody2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyBody2 ? 0 + "%" : Number(campMyBody2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                      
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon5} />
                                                                <span>My Lifestyle</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <h4>{!campMyLifeStyle['total'] ? null : <>{Number(campMyLifeStyle['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campMyLifeStyle['doingWell'] ? <>0</> : Number(campMyLifeStyle['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyLifeStyle ? 0 + "%" : Number(campMyLifeStyle['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campMyLifeStyle['takeAction'] ? <>0</> : Number(campMyLifeStyle['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyLifeStyle ? 0 + "%" : Number(campMyLifeStyle['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campMyLifeStyle['risk'] ? <>0</> : Number(campMyLifeStyle['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyLifeStyle ? 0 + "%" : Number(campMyLifeStyle['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <h4>{!campMyLifeStyle2['total'] ? null : <>{Number(campMyLifeStyle2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campMyLifeStyle2['doingWell'] ? <>0</> : Number(campMyLifeStyle2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyLifeStyle2 ? 0 + "%" : Number(campMyLifeStyle2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campMyLifeStyle2['takeAction'] ? <>0</> : Number(campMyLifeStyle2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyLifeStyle2 ? 0 + "%" : Number(campMyLifeStyle2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campMyLifeStyle2['risk'] ? <>0</> : Number(campMyLifeStyle2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyLifeStyle2 ? 0 + "%" : Number(campMyLifeStyle2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                      
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon6} />
                                                                <span>My Mind</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <h4>{!campMyMind['total'] ? null : <>{Number(campMyMind['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campMyMind['doingWell'] ? <>0</> : Number(campMyMind['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyMind ? 0 + "%" : Number(campMyMind['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campMyMind['takeAction'] ? <>0</> : Number(campMyMind['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyMind ? 0 + "%" : Number(campMyMind['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campMyMind['risk'] ? <>0</> : Number(campMyMind['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyMind ? 0 + "%" : Number(campMyMind['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <h4>{!campMyMind2['total'] ? null : <>{Number(campMyMind2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campMyMind2['doingWell'] ? <>0</> : Number(campMyMind2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyMind2 ? 0 + "%" : Number(campMyMind2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campMyMind2['takeAction'] ? <>0</> : Number(campMyMind2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyMind2 ? 0 + "%" : Number(campMyMind2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campMyMind2['risk'] ? <>0</> : Number(campMyMind2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyMind2 ? 0 + "%" : Number(campMyMind2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                       
                                                        <div className="campng_dv_in">


                                                            <div className="campng_dv_l">
                                                                <img src={campicon7} />
                                                                <span>Preventive Health</span>
                                                            </div>


                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">

                                                                    <div className="progress grn_bar">
                                                                        <span>{!campPrevHealth['doingWell'] ? <>0</> : Number(campPrevHealth['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPrevHealth ? 0 + "%" : Number(campPrevHealth['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campPrevHealth['takeAction'] ? <>0</> : Number(campPrevHealth['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPrevHealth ? 0 + "%" : Number(campPrevHealth['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campPrevHealth['risk'] ? <>0</> : Number(campPrevHealth['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPrevHealth ? 0 + "%" : Number(campPrevHealth['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campPrevHealth2['doingWell'] ? <>0</> : Number(campPrevHealth2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPrevHealth2 ? 0 + "%" : Number(campPrevHealth2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campPrevHealth2['takeAction'] ? <>0</> : Number(campPrevHealth2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPrevHealth2 ? 0 + "%" : Number(campPrevHealth2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campPrevHealth2['risk'] ? <>0</> : Number(campPrevHealth2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPrevHealth2 ? 0 + "%" : Number(campPrevHealth2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>



                                                                </div>
                                                            </div>
                                                        </div>

                                                       
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon9} />
                                                                <span>Smoking</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">

                                                                    <div className="progress grn_bar">
                                                                        <span>{!campSmoking['doingWell'] ? <>0</> : Number(campSmoking['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSmoking ? 0 + "%" : Number(campSmoking['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campSmoking['takeAction'] ? <>0</> : Number(campSmoking['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSmoking ? 0 + "%" : Number(campSmoking['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campSmoking['risk'] ? <>0</> : Number(campSmoking['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSmoking ? 0 + "%" : Number(campSmoking['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campSmoking2['doingWell'] ? <>0</> : Number(campSmoking2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSmoking2 ? 0 + "%" : Number(campSmoking2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campSmoking2['takeAction'] ? <>0</> : Number(campSmoking2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSmoking2 ? 0 + "%" : Number(campSmoking2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campSmoking2['risk'] ? <>0</> : Number(campSmoking2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSmoking2 ? 0 + "%" : Number(campSmoking2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                  
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon10} />
                                                                <span>Alcohol</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">

                                                                    <div className="progress grn_bar">
                                                                        <span>{!campAlcohol['doingWell'] ? <>0</> : Number(campAlcohol['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAlcohol ? 0 + "%" : Number(campAlcohol['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campAlcohol['takeAction'] ? <>0</> : Number(campAlcohol['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAlcohol ? 0 + "%" : Number(campAlcohol['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campAlcohol['risk'] ? <>0</> : Number(campAlcohol['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAlcohol ? 0 + "%" : Number(campAlcohol['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>



                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campAlcohol2['doingWell'] ? <>0</> : Number(campAlcohol2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAlcohol2 ? 0 + "%" : Number(campAlcohol2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campAlcohol2['takeAction'] ? <>0</> : Number(campAlcohol2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAlcohol2 ? 0 + "%" : Number(campAlcohol2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campAlcohol2['risk'] ? <>0</> : Number(campAlcohol2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAlcohol2 ? 0 + "%" : Number(campAlcohol2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                      
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon11} />
                                                                <span>Diet</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campDiet['doingWell'] ? <>0</> : Number(campDiet['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiet ? 0 + "%" : Number(campDiet['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campDiet['takeAction'] ? <>0</> : Number(campDiet['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiet ? 0 + "%" : Number(campDiet['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campDiet['risk'] ? <>0</> : Number(campDiet['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiet ? 0 + "%" : Number(campDiet['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campDiet2['doingWell'] ? <>0</> : Number(campDiet2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiet2 ? 0 + "%" : Number(campDiet2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campDiet2['takeAction'] ? <>0</> : Number(campDiet2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiet2 ? 0 + "%" : Number(campDiet2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campDiet2['risk'] ? <>0</> : Number(campDiet2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiet2 ? 0 + "%" : Number(campDiet2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                       
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon12} />
                                                                <span>Activity</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">

                                                                    <div className="progress grn_bar">
                                                                        <span>{!campActivity['doingWell'] ? <>0</> : Number(campActivity['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campActivity ? 0 + "%" : Number(campActivity['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campActivity['takeAction'] ? <>0</> : Number(campActivity['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campActivity ? 0 + "%" : Number(campActivity['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campActivity['risk'] ? <>0</> : Number(campActivity['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campActivity ? 0 + "%" : Number(campActivity['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campActivity2['doingWell'] ? <>0</> : Number(campActivity2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campActivity2 ? 0 + "%" : Number(campActivity2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campActivity2['takeAction'] ? <>0</> : Number(campActivity2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campActivity2 ? 0 + "%" : Number(campActivity2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campActivity2['risk'] ? <>0</> : Number(campActivity2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campActivity2 ? 0 + "%" : Number(campActivity2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                       
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon13} />
                                                                <span>sleep</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">

                                                                    <div className="progress grn_bar">
                                                                        <span>{!campSleep['doingWell'] ? <>0</> : Number(campSleep['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSleep ? 0 + "%" : Number(campSleep['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campSleep['takeAction'] ? <>0</> : Number(campSleep['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSleep ? 0 + "%" : Number(campSleep['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campSleep['risk'] ? <>0</> : Number(campSleep['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSleep ? 0 + "%" : Number(campSleep['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campSleep2['doingWell'] ? <>0</> : Number(campSleep2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSleep2 ? 0 + "%" : Number(campSleep2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campSleep2['takeAction'] ? <>0</> : Number(campSleep2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSleep2 ? 0 + "%" : Number(campSleep2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campSleep2['risk'] ? <>0</> : Number(campSleep2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSleep2 ? 0 + "%" : Number(campSleep2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon14} />
                                                                <span>Diabetes</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campDiabetes['doingWell'] ? <>0</> : Number(campDiabetes['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiabetes ? 0 + "%" : Number(campDiabetes['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campDiabetes['takeAction'] ? <>0</> : Number(campDiabetes['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiabetes ? 0 + "%" : Number(campDiabetes['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campDiabetes['risk'] ? <>0</> : Number(campDiabetes['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiabetes ? 0 + "%" : Number(campDiabetes['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campDiabetes2['doingWell'] ? <>0</> : Number(campDiabetes2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiabetes2 ? 0 + "%" : Number(campDiabetes2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campDiabetes2['takeAction'] ? <>0</> : Number(campDiabetes2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiabetes2 ? 0 + "%" : Number(campDiabetes2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campDiabetes2['risk'] ? <>0</> : Number(campDiabetes2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiabetes2 ? 0 + "%" : Number(campDiabetes2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                       
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon15} />
                                                                <span>Heart</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">

                                                                    <div className="progress grn_bar">
                                                                        <span>{!campHeart['doingWell'] ? <>0</> : Number(campHeart['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campHeart ? 0 + "%" : Number(campHeart['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campHeart['takeAction'] ? <>0</> : Number(campHeart['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campHeart ? 0 + "%" : Number(campHeart['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campHeart['risk'] ? <>0</> : Number(campHeart['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campHeart ? 0 + "%" : Number(campHeart['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campHeart2['doingWell'] ? <>0</> : Number(campHeart2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campHeart2 ? 0 + "%" : Number(campHeart2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campHeart2['takeAction'] ? <>0</> : Number(campHeart2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campHeart2 ? 0 + "%" : Number(campHeart2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campHeart2['risk'] ? <>0</> : Number(campHeart2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campHeart2 ? 0 + "%" : Number(campHeart2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>

                                                        
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon16} />
                                                                <span>Body Mass Index</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">

                                                                    <div className="progress grn_bar">
                                                                        <span>{!campBodyMass['doingWell'] ? <>0</> : Number(campBodyMass['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campBodyMass ? 0 + "%" : Number(campBodyMass['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campBodyMass['takeAction'] ? <>0</> : Number(campBodyMass['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campBodyMass ? 0 + "%" : Number(campBodyMass['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campBodyMass['risk'] ? <>0</> : Number(campBodyMass['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campBodyMass ? 0 + "%" : Number(campBodyMass['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campBodyMass2['doingWell'] ? <>0</> : Number(campBodyMass2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campBodyMass2 ? 0 + "%" : Number(campBodyMass2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campBodyMass2['takeAction'] ? <>0</> : Number(campBodyMass2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campBodyMass2 ? 0 + "%" : Number(campBodyMass2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campBodyMass2['risk'] ? <>0</> : Number(campBodyMass2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campBodyMass2 ? 0 + "%" : Number(campBodyMass2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon16} />
                                                                <span>Financial Security</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campFinSec['doingWell'] ? <>0</> : Number(campFinSec['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campFinSec ? 0 + "%" : Number(campFinSec['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campFinSec['takeAction'] ? <>0</> : Number(campFinSec['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campFinSec ? 0 + "%" : Number(campFinSec['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campFinSec['risk'] ? <>0</> : Number(campFinSec['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campFinSec ? 0 + "%" : Number(campFinSec['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campFinSec2['doingWell'] ? <>0</> : Number(campFinSec2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campFinSec2 ? 0 + "%" : Number(campFinSec2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campFinSec2['takeAction'] ? <>0</> : Number(campFinSec2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campFinSec2 ? 0 + "%" : Number(campFinSec2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campFinSec2['risk'] ? <>0</> : Number(campFinSec2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campFinSec2 ? 0 + "%" : Number(campFinSec2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon16} />
                                                                <span>Metabolic Health Risk</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campMetaHealthRisk['doingWell'] ? <>0</> : Number(campMetaHealthRisk['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMetaHealthRisk ? 0 + "%" : Number(campMetaHealthRisk['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campMetaHealthRisk['takeAction'] ? <>0</> : Number(campMetaHealthRisk['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMetaHealthRisk ? 0 + "%" : Number(campMetaHealthRisk['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campMetaHealthRisk['risk'] ? <>0</> : Number(campMetaHealthRisk['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMetaHealthRisk ? 0 + "%" : Number(campMetaHealthRisk['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campMetaHealthRisk2['doingWell'] ? <>0</> : Number(campMetaHealthRisk2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMetaHealthRisk2 ? 0 + "%" : Number(campMetaHealthRisk2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campMetaHealthRisk2['takeAction'] ? <>0</> : Number(campMetaHealthRisk2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMetaHealthRisk2 ? 0 + "%" : Number(campMetaHealthRisk2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campMetaHealthRisk2['risk'] ? <>0</> : Number(campMetaHealthRisk2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMetaHealthRisk2 ? 0 + "%" : Number(campMetaHealthRisk2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon16} />
                                                                <span>Motivation & Productivity</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">

                                                                    <div className="progress grn_bar">
                                                                        <span>{!campMotivProd['doingWell'] ? <>0</> : Number(campMotivProd['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMotivProd ? 0 + "%" : Number(campMotivProd['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campMotivProd['takeAction'] ? <>0</> : Number(campMotivProd['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMotivProd ? 0 + "%" : Number(campMotivProd['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campMotivProd['risk'] ? <>0</> : Number(campMotivProd['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMotivProd ? 0 + "%" : Number(campMotivProd['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campMotivProd2['doingWell'] ? <>0</> : Number(campMotivProd2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMotivProd2 ? 0 + "%" : Number(campMotivProd2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campMotivProd2['takeAction'] ? <>0</> : Number(campMotivProd2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMotivProd2 ? 0 + "%" : Number(campMotivProd2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campMotivProd2['risk'] ? <>0</> : Number(campMotivProd2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMotivProd2 ? 0 + "%" : Number(campMotivProd2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        
                                                        <div className="campng_dv_in">

                                                            <div className="campng_dv_l">
                                                                <img src={campicon16} />
                                                                <span>Pain & Ergonomics</span>
                                                            </div>

                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">

                                                                    <div className="progress grn_bar">
                                                                        <span>{!campPainErgo['doingWell'] ? <>0</> : Number(campPainErgo['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPainErgo ? 0 + "%" : Number(campPainErgo['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campPainErgo['takeAction'] ? <>0</> : Number(campPainErgo['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPainErgo ? 0 + "%" : Number(campPainErgo['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campPainErgo['risk'] ? <>0</> : Number(campPainErgo['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPainErgo ? 0 + "%" : Number(campPainErgo['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campPainErgo2['doingWell'] ? <>0</> : Number(campPainErgo2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPainErgo2 ? 0 + "%" : Number(campPainErgo2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campPainErgo2['takeAction'] ? <>0</> : Number(campPainErgo2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPainErgo2 ? 0 + "%" : Number(campPainErgo2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campPainErgo2['risk'] ? <>0</> : Number(campPainErgo2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPainErgo2 ? 0 + "%" : Number(campPainErgo2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>

                                                        
                                                        <div className="campng_dv_in">


                                                            <div className="campng_dv_l">
                                                                <img src={campicon16} />
                                                                <span>The stress index</span>
                                                            </div>


                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">

                                                                    <div className="progress grn_bar">
                                                                        <span>{!campStressIndex['doingWell'] ? <>0</> : Number(campStressIndex['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="65"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campStressIndex ? 0 + "%" : Number(campStressIndex['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campStressIndex['takeAction'] ? <>0</> : Number(campStressIndex['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="33"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campStressIndex ? 0 + "%" : Number(campStressIndex['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campStressIndex['risk'] ? <>0</> : Number(campStressIndex['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="2"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campStressIndex ? 0 + "%" : Number(campStressIndex['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="progress grn_bar">
                                                                        <span>{!campStressIndex2['doingWell'] ? <>0</> : Number(campStressIndex2['doingWell']).toFixed(0)}% <i className="bi bi-arrow-up-short"></i></span>
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="50"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campStressIndex2 ? 0 + "%" : Number(campStressIndex2['doingWell']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress ylo_bar">
                                                                        <span>{!campStressIndex2['takeAction'] ? <>0</> : Number(campStressIndex2['takeAction']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Take Action</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="35"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campStressIndex2 ? 0 + "%" : Number(campStressIndex2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                    <div className="progress red_bar">
                                                                        <span>{!campStressIndex2['risk'] ? <>0</> : Number(campStressIndex2['risk']).toFixed(0)}% <i className="bi bi-arrow-down-short"></i></span>
                                                                        <strong>Risk</strong>
                                                                        <div className="progress-bar" role="progressbar" aria-valuenow="15"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campStressIndex2 ? 0 + "%" : Number(campStressIndex2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>



                                                    </div>
                                                </div>
                                            </div>

                                        </div> */}

                                        <div className="tab-pane fade" id="compr_t" role="tabpanel" aria-labelledby="compr_t-tab">
                                            <div className="row mb-2 mb-lg-4">
                                                <div className="col-lg-12">
                                                    <div className="bg-white shadow_d p-4 rounded-3 dashboard_bg_img">
                                                        <h2>Compare your reports</h2>
                                                        <p>We are pleased to provide you with an update on the health status.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-4">
                                                <div className="col-md-12">
                                                    <div className="bg-white shadow_d rounded-3 campng_dv">

                                                        {/* company */}
                                                        <div className="campng_dv_in head_ngs">
                                                            <div className="campng_dv_l">
                                                                <h4>{getUserData().response.organisation_name}</h4>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <select
                                                                    className="form-select"
                                                                    value={campaign1}
                                                                    onChange={(e) => { selectCampaign1(e); setCampaign1(e.target.value); }}
                                                                >
                                                                    <option value=''>Select</option>
                                                                    {
                                                                        campaignList1.map((item, index) =>
                                                                            <option key={index} value={item.campaigndtlid}>{item.campaigndesc + ' - ' + formatdate(item.camp_start_datetime)}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <select
                                                                    className="form-select"
                                                                    value={campaign2}
                                                                    onChange={(e) => { selectCampaign2(e); setCampaign2(e.target.value); }}
                                                                >
                                                                    <option value=''>Select</option>
                                                                    {
                                                                        campaignList2.map((item, index) =>
                                                                            <option key={index} value={item.campaigndtlid}>{item.campaigndesc + ' - ' + formatdate(item.camp_start_datetime)}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Total HRA score */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <strong>Total HRA score</strong>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog">
                                                                    <CircularProgressbar
                                                                        value={!campHra ? 0 : campHra}
                                                                        text={`${!campHra ? 0 : campHra}/${100}`}
                                                                        styles={buildStyles({
                                                                            strokeLinecap: 'butt',
                                                                            textSize: '16px',
                                                                            pathTransitionDuration: 0.5,
                                                                            pathColor: hraColor,
                                                                            textColor: '#000000',
                                                                            trailColor: '#E1E1E1',
                                                                            backgroundColor: '#FFFFFF',
                                                                        })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog">
                                                                    <CircularProgressbar
                                                                        value={!campHra2 ? 0 : campHra2}
                                                                        text={`${!campHra2 ? 0 : campHra2}/${100}`}
                                                                        styles={buildStyles({
                                                                            strokeLinecap: 'butt',
                                                                            textSize: '16px',
                                                                            pathTransitionDuration: 0.5,
                                                                            pathColor: hraColor1,
                                                                            textColor: '#000000',
                                                                            trailColor: '#E1E1E1',
                                                                            backgroundColor: '#FFFFFF',
                                                                        })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* No of Participants */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <strong>No of Participants</strong>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Participants </strong>
                                                                        <p>{!campEmp.total ? <span className='mx-2'>0</span> : <span className='mx-2'>{campEmp.total}</span>} users</p>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Completed</strong>
                                                                            <div className="progress-bar grn_bar" role="progressbar"
                                                                                aria-valuemin="0" aria-valuemax="100" style={{ width: campEmp.completed && campEmp.total ? (campEmp.completed / campEmp.total) * 100 + '%' : 0 }}>
                                                                            </div>
                                                                        <span>{!campEmp.completed ? 0 : (campEmp.completed / campEmp.total) * 100} % </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Not completed</strong>
                                                                        <div className="progress-bar none_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: campEmp.notCompleted && campEmp.total  ?  (campEmp.notCompleted / campEmp.total) * 100 + '%' : 0}}>
                                                                        </div>
                                                                        <span>{!campEmp.notCompleted ? 0 : (campEmp.notCompleted / campEmp.total) * 100}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Participants </strong>
                                                                        <p>{!campEmp2.total ? <span className='mx-2'>0</span> : <span className='mx-2'>{campEmp2.total}</span>} users</p>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Completed</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: campEmp2.completed && campEmp2.total  ?  (campEmp2.completed / campEmp2.total) * 100 + '%' : 0 }}>
                                                                        </div>
                                                                        <span>{!campEmp2.completed ? <>0</> : (campEmp2.completed / campEmp2.total) * 100} % </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Not completed</strong>
                                                                        <div className="progress-bar none_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: campEmp2.notCompleted && campEmp2.total ?  (campEmp2.notCompleted / campEmp2.total) * 100 + '%' : 0 }}>
                                                                        </div>
                                                                        <span>{!campEmp2.notCompleted ? <>0</> : (campEmp2.notCompleted / campEmp2.total) * 100}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Age Distribution */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon1} />
                                                                <span>Age Distribution</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>18 - 35</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar blu_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAge ? 0 + "%" : campAge['18-35'] + "%" }}></div>
                                                                        <span>{!campAge['18-35'] ? <>0</> : campAge['18-35']}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>35 - 50</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar blu_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAge ? 0 + "%" : campAge['36-50'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campAge['36-50'] ? <>0</> : campAge['36-50']}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>45 - 60</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar blu_bar" role="progressbar"
                                                                            aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campAge ? 0 + "%" : campAge['51-65'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campAge['51-65'] ? <>0</> : campAge['51-65']}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>60+</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>

                                                                        <div className="progress-bar blu_bar" role="progressbar"
                                                                            aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campAge ? 0 + "%" : campAge['65+'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campAge['65+'] ? <>0</> : campAge['65+']}% </span>
                                                                    </div>


                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>18 - 35</strong>
                                                                        <div className="progress-bar blu_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAge2 ? 0 + "%" : campAge2['18-35'] + "%" }}></div>
                                                                        <span>{!campAge2['18-35'] ? <>0</> : campAge2['18-35']}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>35 - 50</strong>
                                                                        <div className="progress-bar blu_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAge2 ? 0 + "%" : campAge2['36-50'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campAge2['36-50'] ? <>0</> : campAge2['36-50']}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>45 - 60</strong>
                                                                        <div className="progress-bar blu_bar" role="progressbar"
                                                                            aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campAge2 ? 0 + "%" : campAge2['51-65'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campAge2['51-65'] ? <>0</> : campAge2['51-65']}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>60+</strong>
                                                                        <div className="progress-bar blu_bar" role="progressbar"
                                                                            aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campAge2 ? 0 + "%" : campAge2['65+'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campAge2['65+'] ? <>0</> : campAge2['65+']}% </span>
                                                                    </div>


                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Gender Distribution */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon2} />
                                                                <span>Gender Distribution</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Male</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar blu_bar" role="progressbar"
                                                                            aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campGender ? 0 + "%" : campGender['Male'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campGender['Male'] ? <>0</> : campGender['Male']}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Female</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar blu_bar" role="progressbar"
                                                                            aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campGender ? 0 + "%" : campGender['Female'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campGender['Female'] ? <>0</> : campGender['Female']}% </span>
                                                                    </div>



                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar ">
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Male</strong>
                                                                        <div className="progress-bar blu_bar" role="progressbar"
                                                                            aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campGender2 ? 0 + "%" : campGender2['Male'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campGender2['Male'] ? <>0</> : campGender2['Male']}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Female</strong>
                                                                        <div className="progress-bar blu_bar" role="progressbar"
                                                                            aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campGender2 ? 0 + "%" : campGender2['Female'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campGender2['Female'] ? <>0</> : campGender2['Female']}% </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Response */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon3} />
                                                                <span>Response</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Completed</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campResponse ? 0 + "%" : campResponse['completed'] + "%" }}></div>
                                                                        <span>{!campResponse['completed'] ? <>0</> : campResponse['completed']}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Not completed</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar none_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campResponse ? 0 + "%" : campResponse['notcompleted'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campResponse['notcompleted'] ? <>0</> : campResponse['notcompleted']}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Not completed</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar none_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campResponse ? 0 + "%" : campResponse['notstarted'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campResponse['notstarted'] ? <>0</> : campResponse['notstarted']}% </span>
                                                                    </div>

                                                                </div>



                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Completed</strong>

                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campResponse2 ? 0 + "%" : campResponse2['completed'] + "%" }}></div>
                                                                        <span>{!campResponse2['completed'] ? <>0</> : campResponse2['completed']}%  </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Not completed</strong>

                                                                        <div className="progress-bar none_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campResponse2 ? 0 + "%" : campResponse2['notcompleted'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campResponse2['notcompleted'] ? <>0</> : campResponse2['notcompleted']}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Not completed</strong>
                                                                        <div className="progress-bar none_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campResponse2 ? 0 + "%" : campResponse2['notstarted'] + "%" }}>
                                                                        </div>
                                                                        <span>{!campResponse2['notstarted'] ? <>0</> : campResponse2['notstarted']}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* My Body */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon4} />
                                                                <span>My Body</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campMyBody.total ? null : <>{Number(campMyBody.total).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyBody ? 0 + "%" : Number(campMyBody['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campMyBody['doingWell'] ? <>0</> : Number(campMyBody['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyBody ? 0 + "%" : Number(campMyBody['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMyBody['takeAction'] ? <>0</> : Number(campMyBody['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campMyBody ? 0 + "%" : Number(campMyBody['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMyBody['risk'] ? <>0</> : Number(campMyBody['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campMyBody2['total'] ? null : <>{Number(campMyBody2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyBody2 ? 0 + "%" : Number(campMyBody2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campMyBody2['doingWell'] ? <>0</> : Number(campMyBody2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyBody2 ? 0 + "%" : Number(campMyBody2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMyBody2['takeAction'] ? <>0</> : Number(campMyBody2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campMyBody2 ? 0 + "%" : Number(campMyBody2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMyBody2['risk'] ? <>0</> : Number(campMyBody2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* My Lifestyle */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon5} />
                                                                <span>My Lifestyle</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campMyLifeStyle['total'] ? null : <>{Number(campMyLifeStyle['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyLifeStyle ? 0 + "%" : Number(campMyLifeStyle['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campMyLifeStyle['doingWell'] ? <>0</> : Number(campMyLifeStyle['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyLifeStyle ? 0 + "%" : Number(campMyLifeStyle['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMyLifeStyle['takeAction'] ? <>0</> : Number(campMyLifeStyle['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campMyLifeStyle ? 0 + "%" : Number(campMyLifeStyle['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMyLifeStyle['risk'] ? <>0</> : Number(campMyLifeStyle['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campMyLifeStyle2['total'] ? null : <>{Number(campMyLifeStyle2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyLifeStyle2 ? 0 + "%" : Number(campMyLifeStyle2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campMyLifeStyle2['doingWell'] ? <>0</> : Number(campMyLifeStyle2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyLifeStyle2 ? 0 + "%" : Number(campMyLifeStyle2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMyLifeStyle2['takeAction'] ? <>0</> : Number(campMyLifeStyle2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campMyLifeStyle2 ? 0 + "%" : Number(campMyLifeStyle2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMyLifeStyle2['risk'] ? <>0</> : Number(campMyLifeStyle2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* My Mind */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon6} />
                                                                <span>My Mind</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campMyMind['total'] ? null : <>{Number(campMyMind['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyMind ? 0 + "%" : Number(campMyMind['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campMyMind['doingWell'] ? <>0</> : Number(campMyMind['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyMind ? 0 + "%" : Number(campMyMind['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMyMind['takeAction'] ? <>0</> : Number(campMyMind['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campMyMind ? 0 + "%" : Number(campMyMind['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMyMind['risk'] ? <>0</> : Number(campMyMind['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campMyMind2['total'] ? null : <>{Number(campMyMind2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyMind2 ? 0 + "%" : Number(campMyMind2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campMyMind2['doingWell'] ? <>0</> : Number(campMyMind2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMyMind2 ? 0 + "%" : Number(campMyMind2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMyMind2['takeAction'] ? <>0</> : Number(campMyMind2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campMyMind2 ? 0 + "%" : Number(campMyMind2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMyMind2['risk'] ? <>0</> : Number(campMyMind2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Preventive Health */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon7} />
                                                                <span>Preventive Health</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campPrevHealth['total'] ? null : <>{Number(campPrevHealth['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPrevHealth ? 0 + "%" : Number(campPrevHealth['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campPrevHealth['doingWell'] ? <>0</> : Number(campPrevHealth['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPrevHealth ? 0 + "%" : Number(campPrevHealth['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campPrevHealth['takeAction'] ? <>0</> : Number(campPrevHealth['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campPrevHealth ? 0 + "%" : Number(campPrevHealth['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campPrevHealth['risk'] ? <>0</> : Number(campPrevHealth['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campPrevHealth2['total'] ? null : <>{Number(campPrevHealth2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPrevHealth2 ? 0 + "%" : Number(campPrevHealth2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campPrevHealth2['doingWell'] ? <>0</> : Number(campPrevHealth2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPrevHealth2 ? 0 + "%" : Number(campPrevHealth2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campPrevHealth2['takeAction'] ? <>0</> : Number(campPrevHealth2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campPrevHealth2 ? 0 + "%" : Number(campPrevHealth2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campPrevHealth2['risk'] ? <>0</> : Number(campPrevHealth2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Smoking */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon9} />
                                                                <span>Smoking</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campSmoking['total'] ? null : <>{Number(campSmoking['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSmoking ? 0 + "%" : Number(campSmoking['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campSmoking['doingWell'] ? <>0</> : Number(campSmoking['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSmoking ? 0 + "%" : Number(campSmoking['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campSmoking['takeAction'] ? <>0</> : Number(campSmoking['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campSmoking ? 0 + "%" : Number(campSmoking['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campSmoking['risk'] ? <>0</> : Number(campSmoking['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campSmoking2['total'] ? null : <>{Number(campSmoking2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSmoking2 ? 0 + "%" : Number(campSmoking2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campSmoking2['doingWell'] ? <>0</> : Number(campSmoking2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSmoking2 ? 0 + "%" : Number(campSmoking2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campSmoking2['takeAction'] ? <>0</> : Number(campSmoking2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campSmoking2 ? 0 + "%" : Number(campSmoking2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campSmoking2['risk'] ? <>0</> : Number(campSmoking2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Alcohol */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon10} />
                                                                <span>Alcohol</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campAlcohol['total'] ? null : <>{Number(campAlcohol['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAlcohol ? 0 + "%" : Number(campAlcohol['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campAlcohol['doingWell'] ? <>0</> : Number(campAlcohol['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAlcohol ? 0 + "%" : Number(campAlcohol['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campAlcohol['takeAction'] ? <>0</> : Number(campAlcohol['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campAlcohol ? 0 + "%" : Number(campAlcohol['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campAlcohol['risk'] ? <>0</> : Number(campAlcohol['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campAlcohol2['total'] ? null : <>{Number(campAlcohol2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAlcohol2 ? 0 + "%" : Number(campAlcohol2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campAlcohol2['doingWell'] ? <>0</> : Number(campAlcohol2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campAlcohol2 ? 0 + "%" : Number(campAlcohol2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campAlcohol2['takeAction'] ? <>0</> : Number(campAlcohol2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campAlcohol2 ? 0 + "%" : Number(campAlcohol2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campAlcohol2['risk'] ? <>0</> : Number(campAlcohol2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Diet */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon11} />
                                                                <span>Diet</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campDiet['total'] ? null : <>{Number(campDiet['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiet ? 0 + "%" : Number(campDiet['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campDiet['doingWell'] ? <>0</> : Number(campDiet['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiet ? 0 + "%" : Number(campDiet['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campDiet['takeAction'] ? <>0</> : Number(campDiet['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campDiet ? 0 + "%" : Number(campDiet['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campDiet['risk'] ? <>0</> : Number(campDiet['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campDiet2['total'] ? null : <>{Number(campDiet2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiet2 ? 0 + "%" : Number(campDiet2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campDiet2['doingWell'] ? <>0</> : Number(campDiet2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiet2 ? 0 + "%" : Number(campDiet2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campDiet2['takeAction'] ? <>0</> : Number(campDiet2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campDiet2 ? 0 + "%" : Number(campDiet2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campDiet2['risk'] ? <>0</> : Number(campDiet2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Activity */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon12} />
                                                                <span>Activity</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campActivity['total'] ? null : <>{Number(campActivity['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campActivity ? 0 + "%" : Number(campActivity['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campActivity['doingWell'] ? <>0</> : Number(campActivity['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campActivity ? 0 + "%" : Number(campActivity['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campActivity['takeAction'] ? <>0</> : Number(campActivity['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campActivity ? 0 + "%" : Number(campActivity['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campActivity['risk'] ? <>0</> : Number(campActivity['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campActivity2['total'] ? null : <>{Number(campActivity2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campActivity2 ? 0 + "%" : Number(campActivity2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campActivity2['doingWell'] ? <>0</> : Number(campActivity2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campActivity2 ? 0 + "%" : Number(campActivity2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campActivity2['takeAction'] ? <>0</> : Number(campActivity2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campActivity2 ? 0 + "%" : Number(campActivity2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campActivity2['risk'] ? <>0</> : Number(campActivity2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Sleep */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon13} />
                                                                <span>Sleep</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campSleep['total'] ? null : <>{Number(campSleep['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSleep ? 0 + "%" : Number(campSleep['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campSleep['doingWell'] ? <>0</> : Number(campSleep['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSleep ? 0 + "%" : Number(campSleep['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campSleep['takeAction'] ? <>0</> : Number(campSleep['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campSleep ? 0 + "%" : Number(campSleep['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campSleep['risk'] ? <>0</> : Number(campSleep['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campSleep2['total'] ? null : <>{Number(campSleep2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSleep2 ? 0 + "%" : Number(campSleep2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campSleep2['doingWell'] ? <>0</> : Number(campSleep2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campSleep2 ? 0 + "%" : Number(campSleep2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campSleep2['takeAction'] ? <>0</> : Number(campSleep2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campSleep2 ? 0 + "%" : Number(campSleep2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campSleep2['risk'] ? <>0</> : Number(campSleep2['risk']).toFixed(0)}%  </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Diabetes */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon14} />
                                                                <span>Diabetes</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campDiabetes['total'] ? null : <>{Number(campDiabetes['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiabetes ? 0 + "%" : Number(campDiabetes['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campDiabetes['doingWell'] ? <>0</> : Number(campDiabetes['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiabetes ? 0 + "%" : Number(campDiabetes['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campDiabetes['takeAction'] ? <>0</> : Number(campDiabetes['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campDiabetes ? 0 + "%" : Number(campDiabetes['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campDiabetes['risk'] ? <>0</> : Number(campDiabetes['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campDiabetes2['total'] ? null : <>{Number(campDiabetes2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiabetes2 ? 0 + "%" : Number(campDiabetes2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campDiabetes2['doingWell'] ? <>0</> : Number(campDiabetes2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campDiabetes2 ? 0 + "%" : Number(campDiabetes2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campDiabetes2['takeAction'] ? <>0</> : Number(campDiabetes2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campDiabetes2 ? 0 + "%" : Number(campDiabetes2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campDiabetes2['risk'] ? <>0</> : Number(campDiabetes2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Heart */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon15} />
                                                                <span>Heart</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campHeart['total'] ? null : <>{Number(campHeart['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campHeart ? 0 + "%" : Number(campHeart['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campHeart['doingWell'] ? <>0</> : Number(campHeart['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campHeart ? 0 + "%" : Number(campHeart['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campHeart['takeAction'] ? <>0</> : Number(campHeart['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campHeart ? 0 + "%" : Number(campHeart['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campHeart['risk'] ? <>0</> : Number(campHeart['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campHeart2['total'] ? null : <>{Number(campHeart2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campHeart2 ? 0 + "%" : Number(campHeart2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campHeart2['doingWell'] ? <>0</> : Number(campHeart2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campHeart2 ? 0 + "%" : Number(campHeart2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campHeart2['takeAction'] ? <>0</> : Number(campHeart2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campHeart2 ? 0 + "%" : Number(campHeart2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campHeart2['risk'] ? <>0</> : Number(campHeart2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Body Mass Index */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon16} />
                                                                <span>Body Mass Index</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campBodyMass['total'] ? null : <>{Number(campBodyMass['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campBodyMass ? 0 + "%" : Number(campBodyMass['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campBodyMass['doingWell'] ? <>0</> : Number(campBodyMass['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campBodyMass ? 0 + "%" : Number(campBodyMass['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campBodyMass['takeAction'] ? <>0</> : Number(campBodyMass['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campBodyMass ? 0 + "%" : Number(campBodyMass['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campBodyMass['risk'] ? <>0</> : Number(campBodyMass['risk']).toFixed(0)}%  </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campBodyMass2['total'] ? null : <>{Number(campBodyMass2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campBodyMass2 ? 0 + "%" : Number(campBodyMass2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campBodyMass2['doingWell'] ? <>0</> : Number(campBodyMass2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campBodyMass2 ? 0 + "%" : Number(campBodyMass2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campBodyMass2['takeAction'] ? <>0</> : Number(campBodyMass2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campBodyMass2 ? 0 + "%" : Number(campBodyMass2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campBodyMass2['risk'] ? <>0</> : Number(campBodyMass2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Financial Security */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon17} />
                                                                <span>Financial Security</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campFinSec['total'] ? null : <>{Number(campFinSec['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campFinSec ? 0 + "%" : Number(campFinSec['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campFinSec['doingWell'] ? <>0</> : Number(campFinSec['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campFinSec ? 0 + "%" : Number(campFinSec['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campFinSec['takeAction'] ? <>0</> : Number(campFinSec['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campFinSec ? 0 + "%" : Number(campFinSec['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campFinSec['risk'] ? <>0</> : Number(campFinSec['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campFinSec2['total'] ? null : <>{Number(campFinSec2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campFinSec2 ? 0 + "%" : Number(campFinSec2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campFinSec2['doingWell'] ? <>0</> : Number(campFinSec2['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campFinSec2 ? 0 + "%" : Number(campFinSec2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campFinSec2['takeAction'] ? <>0</> : Number(campFinSec2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campFinSec2 ? 0 + "%" : Number(campFinSec2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campFinSec2['risk'] ? <>0</> : Number(campFinSec2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Metabolic Health Risk */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon18} />
                                                                <span>Metabolic Health Risk</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campMetaHealthRisk['total'] ? null : <>{Number(campMetaHealthRisk['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMetaHealthRisk ? 0 + "%" : Number(campMetaHealthRisk['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campMetaHealthRisk['doingWell'] ? <>0</> : Number(campMetaHealthRisk['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMetaHealthRisk ? 0 + "%" : Number(campMetaHealthRisk['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMetaHealthRisk['takeAction'] ? <>0</> : Number(campMetaHealthRisk['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campMetaHealthRisk ? 0 + "%" : Number(campMetaHealthRisk['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMetaHealthRisk['risk'] ? <>0</> : Number(campMetaHealthRisk['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campMetaHealthRisk2['total'] ? null : <>{Number(campMetaHealthRisk2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMetaHealthRisk2 ? 0 + "%" : Number(campMetaHealthRisk2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campMetaHealthRisk2['doingWell'] ? <>0</> : Number(campMetaHealthRisk2['doingWell']).toFixed(0)}%  </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMetaHealthRisk2 ? 0 + "%" : Number(campMetaHealthRisk2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMetaHealthRisk2['takeAction'] ? <>0</> : Number(campMetaHealthRisk2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campMetaHealthRisk2 ? 0 + "%" : Number(campMetaHealthRisk2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMetaHealthRisk2['risk'] ? <>0</> : Number(campMetaHealthRisk2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Motivation & Productivity */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon18} />
                                                                <span>Motivation & Productivity</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campMotivProd['total'] ? null : <>{Number(campMotivProd['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMotivProd ? 0 + "%" : Number(campMotivProd['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campMotivProd['doingWell'] ? <>0</> : Number(campMotivProd['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMotivProd ? 0 + "%" : Number(campMotivProd['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMotivProd['takeAction'] ? <>0</> : Number(campMotivProd['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campMotivProd ? 0 + "%" : Number(campMotivProd['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMotivProd['risk'] ? <>0</> : Number(campMotivProd['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campMotivProd2['total'] ? null : <>{Number(campMotivProd2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMotivProd2 ? 0 + "%" : Number(campMotivProd2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campMotivProd2['doingWell'] ? <>0</> : Number(campMotivProd2['doingWell']).toFixed(0)}%  </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campMotivProd2 ? 0 + "%" : Number(campMotivProd2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMotivProd2['takeAction'] ? <>0</> : Number(campMotivProd2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campMotivProd2 ? 0 + "%" : Number(campMotivProd2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campMotivProd2['risk'] ? <>0</> : Number(campMotivProd2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Pain & Ergonomics */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon18} />
                                                                <span>Pain & Ergonomics</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campPainErgo['total'] ? null : <>{Number(campPainErgo['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPainErgo ? 0 + "%" : Number(campPainErgo['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campPainErgo['doingWell'] ? <>0</> : Number(campPainErgo['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPainErgo ? 0 + "%" : Number(campPainErgo['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campPainErgo['takeAction'] ? <>0</> : Number(campPainErgo['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campPainErgo ? 0 + "%" : Number(campPainErgo['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campPainErgo['risk'] ? <>0</> : Number(campPainErgo['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campPainErgo2['total'] ? null : <>{Number(campPainErgo2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPainErgo2 ? 0 + "%" : Number(campPainErgo2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campPainErgo2['doingWell'] ? <>0</> : Number(campPainErgo2['doingWell']).toFixed(0)}%  </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campPainErgo2 ? 0 + "%" : Number(campPainErgo2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campPainErgo2['takeAction'] ? <>0</> : Number(campPainErgo2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campPainErgo2 ? 0 + "%" : Number(campPainErgo2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campPainErgo2['risk'] ? <>0</> : Number(campPainErgo2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* The stress index */}
                                                        <div className="campng_dv_in">
                                                            <div className="campng_dv_l">
                                                                <img src={campicon18} />
                                                                <span>The stress index</span>
                                                            </div>
                                                            <div className="campng_dv_m">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campStressIndex['total'] ? null : <>{Number(campStressIndex['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campStressIndex ? 0 + "%" : Number(campStressIndex['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campStressIndex['doingWell'] ? <>0</> : Number(campStressIndex['doingWell']).toFixed(0)}% </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <i className="bi bi-arrow-down-short"></i>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campStressIndex ? 0 + "%" : Number(campStressIndex['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campStressIndex['takeAction'] ? <>0</> : Number(campStressIndex['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <i className="bi bi-arrow-up-short"></i>

                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campStressIndex ? 0 + "%" : Number(campStressIndex['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campStressIndex['risk'] ? <>0</> : Number(campStressIndex['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="campng_dv_r">
                                                                <div className="camp_prog_bar">
                                                                    <span>Score</span>
                                                                    <h4>{!campStressIndex2['total'] ? null : <>{Number(campStressIndex2['total']).toFixed(2) + " %"}</>}</h4>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Doing well</strong>
                                                                        <div className="progress-bar grn_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campStressIndex2 ? 0 + "%" : Number(campStressIndex2['doingWell']).toFixed(0) + "%" }}></div>
                                                                        <span>{!campStressIndex2['doingWell'] ? <>0</> : Number(campStressIndex2['doingWell']).toFixed(0)}%  </span>
                                                                    </div>

                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>Take action</strong>
                                                                        <div className="progress-bar ylo_bar" role="progressbar"
                                                                            aria-valuemin="0" aria-valuemax="100" style={{ width: !campStressIndex2 ? 0 + "%" : Number(campStressIndex2['takeAction']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campStressIndex2['takeAction'] ? <>0</> : Number(campStressIndex2['takeAction']).toFixed(0)}% </span>
                                                                    </div>
                                                                    <div className="camp_prog_bar_inr">
                                                                        <strong>High risk</strong>
                                                                        <div className="progress-bar red_bar" role="progressbar"
                                                                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                                                                            style={{ width: !campStressIndex2 ? 0 + "%" : Number(campStressIndex2['risk']).toFixed(0) + "%" }}>
                                                                        </div>
                                                                        <span>{!campStressIndex2['risk'] ? <>0</> : Number(campStressIndex2['risk']).toFixed(0)}% </span>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>



                                                    </div>
                                                </div>
                                            </div>

                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>



            {
                sideNav ? null :
                    <nav className="navbar navbar-expand navbar-light navbar-bg d-block">
                        <div className="navbar-collapse collapse navright">
                            <LoggedLayout />
                        </div>
                    </nav>
            }


            <NotificationContainer />
        </>

    )
}

export default Reports