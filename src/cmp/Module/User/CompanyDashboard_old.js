import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getUserRole, getUserData, showLoader, hideLoader } from '../../../service/Common';
import { getAllCompanies, companyActivate, getIndustryType, totalCmpCount, reInviteComp, deleteComp, userEvent } from '../../../service/Services';
import LoggedLayout from './LoggedLayout';

import AnimatedPieHooks from "./D3Chart/AnimatedPieHooks";
import AnimatedPieHooksNew from "./D3Chart/AnimatedPieHooksNew";
import { NotificationContainer, NotificationManager } from 'react-notifications';

import { IMAGE_URL } from '../../../config/app_url';

import { getCompanyPDFFileToDownload, getCompanyCSVFileToDownload, getCompanyEXCELFileToDownload } from '../../../service/ReportServices';

import { COMPANY_REPORT_PDF_URL, COMPANY_REPORT_CSV_URL, COMPANY_REPORT_EXCEL_URL } from '../../../config/app_url';

import { saveAs } from 'file-saver'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { LIMIT_ARRAY } from '../../../constant/constantValue';


const ArrowRise = require('../../../assets/images/ArrowRise.png');
const chart6 = require('../../../assets/images/chart6.png');
const chart7 = require('../../../assets/images/chart7.png');
const listview = require('../../../assets/images/list-view.png');
const gridview = require('../../../assets/images/grid-view.png');
const downloadicon = require('../../../assets/images/download-icon.png');
const compnylog = require('../../../assets/images/compny-log.png');



const filtr4icon = require('../../../assets/images/filtr-icon4.png');
const filtr5icon = require('../../../assets/images/filtr-icon5.png');
const filtr6icon = require('../../../assets/images/filtr-icon6.png');
const filtr7icon = require('../../../assets/images/filtr-icon7.png');



const downloadicon1 = require('../../../assets/images/download-icon1.png');
const downloadicon2 = require('../../../assets/images/download-icon2.png');
const downloadicon3 = require('../../../assets/images/download-icon3.png');

const campemty = require('../../../assets/images/camp-emty.png');


var imgUrl = IMAGE_URL



function CompanyDashboard() {
    //1= Master Admin, 2= Super Admin, 3= Admin
    const [userLevel, setUserLevel] = React.useState(0)

    const [arrayList, setArrayList] = React.useState([]);

    const [indTypeArray, setIndTypeArray] = React.useState([])

    const [searchText, setSearchText] = React.useState([])

    const [cmpCount, setCmpCount] = React.useState({})

    const [indCmpCount, setIndCmpCount] = React.useState([])

    const [sizeArr, setSizeArr] = React.useState([])

    const [data, setData] = React.useState([]);

    const [data1, setData1] = React.useState([]);

    let navigate = useNavigate();

    const [value, setValue] = React.useState(true);

    const [show, setShow] = React.useState(false);

    const [deleteId, setDeleteId] = React.useState("");
    const [indType, setindType] = React.useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [businessType, setBusinessType] = React.useState("");
    const [industryType, setIndustryType] = React.useState("");
    const [search, setSearch] = React.useState("");
    const [sort, setSort] = React.useState("");


    const [canEdit, SetCanEdit] = React.useState(false)


    const [pageLoad, setPageLoad] = React.useState(false)

    const [report, setReport] = React.useState("PDF")

    const [totalPage, setTotalPage] = useState(0);
    const [limit, setLimit] = useState("10");
    const [offset, setOffset] = useState("0");



    const handleChangePage = (e, val) => {
        console.log("Pagination Value", val);
        let offeset = (val - 1) * limit;
        setOffset(offeset);
    };

    const reqData = {
        "orgn_id": getUserData().response.orgn_id + "",
        "parent_orgn_id": getUserData().response.parent_orgn_id + "",
        "businessType": businessType,
        "industryType": industryType,
        "size": sizeArr,
        "search": search,
        "sort": sort,
        "limit": limit,
        "offset": offset
    }
  
    const [limitArr, setLimitArr] = useState([]);

    const [totalCount, setTotalCount] = useState(0);

    const [growth, setGrowth] = useState(0)

    useEffect(() => {
        getAllCompaniesFun(reqData)
        setLimitArr(LIMIT_ARRAY)
    }, [industryType, sort, limit, offset])

    React.useEffect(() => {

        var role = getUserRole("Companies")
        if (role) {
            if (role.can_edit == 1) {
                SetCanEdit(true)
            }
        }


        getIndustryTypeFun()

        totalCmpCountFun()

        if (getUserData().response.parent_orgn_id == "0") {
            setUserLevel(1)
        } else {

            if (getUserData().response.is_child == "0") {
                setUserLevel(2)
            } else {
                setUserLevel(3)
            }
        }

        let comList = JSON.parse(sessionStorage.getItem("comList"))


        if(comList && comList=="grid"){
            document.getElementById('switchGrid').click()
        }

        if(comList && comList=="list"){
            document.getElementById('switchList').click()
        }

    }, [])

    const loaderStatusChange = async (type) => {
        setPageLoad(type)
    }

    function getAllCompaniesFun(data) {
        showLoader()
        getAllCompanies(data).then(result => {
            hideLoader()
            if (result.data.success) {
                setArrayList(result.data.response.resp)
                setTotalCount(result.data.response.count)
                let totalPage = Math.ceil(result.data.response.count / limit);
                setTotalPage(totalPage);
            }

        })
    }

    function getIndustryTypeFun() {
        let data = {
            "userId": getUserData().response.userId
        }
        getIndustryType(data).then(result => {
            setIndTypeArray(result.data.response)
        })
    }

    function totalCmpCountFun() {
        let data2 = {
            "orgn_id": getUserData().response.orgn_id + "",
            "parent_orgn_id": getUserData().response.parent_orgn_id + "",
        }
        totalCmpCount(data2).then(result => {
            setCmpCount(result.data.response)
            setIndCmpCount(result.data.response.totalInd)
            setGrowth(result.data.response.growth)
            var newArray = [{ data: 0, value: Math.round(result.data.response.totalHealthcarecount / result.data.response.totalCmp * 100) }, { data: 1, value: Math.round(result.data.response.totalNonHealthcarecount / result.data.response.totalCmp * 100) }]
            setData(newArray);


            var industryArr = []
            for (var i = 0; i < result.data.response.totalInd.length; i++) {
                industryArr.push({ data: i, value: result.data.response.totalInd[i].percent })
            }
            setData1(industryArr)
        })

    }

    const onDelete = () => {
        var data = {
            "orgn_id": deleteId
        }
        showLoader()
        deleteComp(data).then(result => {
            hideLoader()
            if (result.data.success) {
                userEvent("company deleted")
                NotificationManager.success(result.data.message);
                getAllCompaniesFun(reqData)
                handleClose()
                setDeleteId("")
            }
        })
    }

    const toggleBtnList = () => {
        setValue(false)
    }

    const toggleBtnGrid = () => {
        setValue(true)
    }

    const routeChangeDetails = (id, value) => {


        sessionStorage.setItem("comList", JSON.stringify(value));


        let path = `/users/companydetails/` + id
        navigate(path)
    }

    const routerChangeAddCom = () => {
        if (userLevel == "1") {
            let path = `/users/addcompany`
            navigate(path)
        } else if (userLevel == "2") {
            let path = `/users/newcompany`
            navigate(path)
        }
    }

    const onCheckbox = (e) => {
        const checked = e.target.checked;
        const checkedValue = e.target.value;
        let data = {
            "activated": checked,
            "orgn_id": checkedValue + ""
        }
        showLoader()
        companyActivate(data).then(result => {
            hideLoader()
            if (result.data.success) {
                getAllCompaniesFun(reqData)
                if (checked) {
                    NotificationManager.success(result.data.message);
                } else {
                    NotificationManager.error(result.data.message);
                }
            }
        })
        setTimeout(() => {
            totalCmpCountFun()
        }, 1000);
    }

    function setRadioChange(e) {
        setBusinessType(e.target.value);
        let obj = {
            businessType: e.target.value
        }
        let data = Object.assign(reqData, obj);
        getAllCompaniesFun(data);
    }

    const onIndustryFun = (e, index) => {
        var indArr = []
        const checked = e.target.checked;
        const checkedValue = e.target.value;
        indArr = indType
        if (checked) {
            indArr.push(checkedValue)
        } else {
            indArr = indArr.filter(item => item !== checkedValue)
        }
        setindType(indArr)
        let arr = indArr.toString()
        setIndustryType(arr)
    }

    const onSizeFun = (e) => {
        var sizeArray = []
        const checked = e.target.checked;
        const checkedValue = e.target.value;
        sizeArray = sizeArr

        // console.log("sizeArray----------", sizeArray)

        if (checked) {
            sizeArray.push(checkedValue)
        } else {
            sizeArray = sizeArray.filter(item => item !== checkedValue)
        }
        setSizeArr(sizeArray)
        const reqData = {
            "orgn_id": getUserData().response.orgn_id + "",
            "parent_orgn_id": getUserData().response.parent_orgn_id + "",
            "businessType": businessType,
            "industryType": industryType,
            "size": sizeArray,
            "search": search,
            "sort": sort
        }

        getAllCompanies(reqData).then(result => {

            if (result.data.success) {
                setArrayList(result.data.response)
            }

        })
    }

    const handleKeyPress = () => {
        if (search.length >= '2') {
            getAllCompaniesFun(reqData)
        }

        if (search.length == '0') {
            getAllCompaniesFun(reqData)
        }
    }

    const reInviteFun = (e) => {
        var data = {
            "parent_orgn_id": getUserData().response.parent_orgn_id + "",
            "orgn_id": e
        }
        showLoader()
        reInviteComp(data).then(result => {
            hideLoader()
            if (result.data.success) {
                userEvent("reinvited send")
                NotificationManager.success(result.data.message);
            } else {
                NotificationManager.error(result.data.message);
            }
        })



    }

    const resetStateDataForClearAll = async () => {
        setBusinessType("");
        setIndustryType("");
        setSearch("");
        setSort("");
        setSizeArr([]);
    }

    // for clear all data
    const clearAll = async (event) => {
        await loaderStatusChange(true);
        await resetStateDataForClearAll();
        await loaderStatusChange(false);
        reqData.businessType = "";
        reqData.industryType = "";
        reqData.size = "";
        reqData.search = "";
        reqData.sort = [];

        getAllCompanies(reqData).then(result => {
            if (result.data.success) {
                setArrayList(result.data.response);
            }

        });
    }

    const reportDownloadFun = () => {

        var userTypes
        if (userLevel == 1) {
            userTypes = 1
        } else if (userLevel == 2) {
            userTypes = 2
        } else {
            userTypes = 3
        }

        if (report == "PDF") {
            var data = {
                "userId": getUserData().response.userId,
                "userType": userTypes,  // 1=> master, 2=> Super
                "orgId": getUserData().response.orgn_id,
                "sort": sort

            }
            showLoader()
            getCompanyPDFFileToDownload(data).then(result => {

                saveAs(COMPANY_REPORT_PDF_URL + result.data.response, result.data.response)
                setTimeout(() => {
                    hideLoader()
                }, 1000);
            })
            userEvent("pdf download")
        }
        else if (report == "CSV") {
            var data = {
                "userId": getUserData().response.userId,
                "userType": userTypes,  // 1=> master, 2=> Super
                "orgId": getUserData().response.orgn_id,
                "sort": sort
            }
            showLoader()
            getCompanyCSVFileToDownload(data).then(result => {
                saveAs(COMPANY_REPORT_CSV_URL + result.data.response, result.data.response)
                setTimeout(() => {
                    hideLoader()
                }, 1000);
            })
            userEvent("csv download")
        }
        else if (report == "Excel") {
            var data = {
                "userId": getUserData().response.userId,
                "userType": userTypes,  // 1=> master, 2=> Super
                "orgId": getUserData().response.orgn_id,
                "sort": sort
            }
            showLoader()
            getCompanyEXCELFileToDownload(data).then(result => {
                saveAs(COMPANY_REPORT_EXCEL_URL + result.data.response, result.data.response)
                setTimeout(() => {
                    hideLoader()
                }, 1000);
            })
            userEvent("excel download")

        }

    }

    function pageLimitChange(e) {
        setLimit(e.target.value);
    }


    return (
        <React.Fragment>
            {pageLoad ?
                null :
                <>
                    <div className="main">

                        <main className="content">

                            <div className="container-fluid p-0">

                                {/* COMPANY CLUB TITLE HEADER */}

                                <div className="row mb-2 mb-lg-4">
                                    <div className="col-md-12 d-lg-flex align-items-center main-hdng">
                                        <div className="col-md-6">
                                            <h3 className="compny-dashbrd">Company Club</h3>
                                        </div>

                                    </div>
                                </div>

                                <div className="row hra_scor_dv">

                                    {/* COMPANY  */}

                                    <div className="col-lg-4 col-md-6">
                                        <div className="bg-white shadow_d py-4 px-3 rounded-3 dashboard_top_box comp_dashboard_box" style={{ minHeight: "40vh" }}>
                                            <div className="hra_scor">
                                                <div className="hra_scor_h">
                                                    <h6>Company</h6>
                                                </div>
                                                <div className="col-auto d-flex">
                                                    <strong className="text-bdy">{cmpCount.totalActiveCount} <span>Active</span></strong>
                                                    <strong className="text-bdy">{cmpCount.totalCmp} <span>Total</span></strong>
                                                </div>
                                                <p className="d-flex"> {growth==null?0:Number(growth).toFixed(2)}% <img className="whte_ris" src={ArrowRise} /></p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BUSINESS TYPE */}

                                    <div className="col-lg-4 col-md-6">
                                        <div className="bg-white shadow_d py-4 px-3 rounded-3 dashboard_top_box comp_dashboard_box" style={{ minHeight: "40vh" }}>
                                            <div className="hra_scor_h">
                                                <h6>Business Type</h6>
                                            </div>
                                            <div className="chart-container">
                                                <ul style={{ paddingLeft: "0" }}>
                                                    <li style={{ fontSize: "12px", "listStyle": "square", color: "#428FEC", marginLeft: "16px" }}><span style={{ color: "black" }}>Healthcare : {cmpCount.totalCmp == 0 ? "0%" : <span>{Math.round(cmpCount.totalHealthcarecount / cmpCount.totalCmp * 100)}%</span>}</span></li>
                                                    <li style={{ fontSize: "12px", "listStyle": "square", color: "#FFC727", marginLeft: "16px" }}><span style={{ color: "black" }}>Non-Healthcare : {cmpCount.totalCmp == 0 ? "0%" : <span>{Math.round(cmpCount.totalNonHealthcarecount / cmpCount.totalCmp * 100)}%</span>} </span></li>
                                                </ul>
                                                <AnimatedPieHooksNew
                                                    data={data}
                                                    width={170}
                                                    height={165}
                                                    innerRadius={65}
                                                    outerRadius={80}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* INDUSTRY */}

                                    <div className="col-lg-4 col-md-6">
                                        <div className="bg-white shadow_d py-4 px-3 rounded-3 dashboard_top_box comp_dashboard_box" style={{ minHeight: "40vh" }}>
                                            <div className="hra_scor_h">
                                                <h6>Industry</h6>
                                            </div>
                                            <div className="chart-container">
                                                
                                                <AnimatedPieHooks
                                                    data={data1}
                                                    width={195}
                                                    height={195}
                                                    innerRadius={40}
                                                    outerRadius={95}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="row mt-4 mb-4">

                                    {/* LABELS HEADER */}
                                    <div className="col-md-12 col-sm-12">
                                        <div className="labels_search">
                                            <h3>Labels</h3>
                                        </div>
                                    </div>

                                    <div className="col-md-12 d-lg-flex align-items-center hdng-btm">


                                        {/* SEARCH */}

                                        <div className="d-inline-block src_dv">
                                            <label>Search</label>
                                            <button className="btn" ><i className="bi bi-search" aria-hidden="true"></i> </button>

                                            <input
                                                className="form-control"
                                                type="text"
                                                value={searchText}
                                                onChange={(e) => {
                                                    setSearchText(e.target.value)
                                                    setSearch(e.target.value)
                                                }}
                                                onKeyUp={handleKeyPress}
                                            />
                                        </div>

                                        {/* SORT */}

                                        <div className="d-inline-block src_fld">
                                            <label>Sort</label>
                                            <select
                                                className="form-select"
                                                onChange={(e) => { setSort(e.target.value) }}>
                                                <option value="all">All</option>
                                                <option value="alphabet">Alphabet</option>
                                                <option value="size">Size</option>
                                            </select>
                                        </div>

                                        {/* TOGGLE BUTTON */}

                                        <div className="btn-group viebtn" role="group" aria-label="Large button group">
                                            <label>&nbsp;</label>
                                            <button id="switchList" onClick={toggleBtnList} type="button"
                                                className={`btn btn-outline-dark ${value ? "switchActiveList" : ""}`}>
                                                <img src={listview} alt="list-view" />
                                            </button>
                                            <button id="switchGrid" onClick={toggleBtnGrid} type="button"
                                                className={`btn btn-outline-dark ${!value ? "switchActiveList" : ""}`}>
                                                <img src={gridview} alt="list-view" />
                                            </button>
                                        </div>

                                        {/* DOWNLOAD BUTTON CSV, PDF, XLS */}

                                        <div className="d-inline-block dwnld_btn">
                                            <label>&nbsp;</label>

                                            <button className="down_btn dropdown-toggle no-dropdown-arrow" href="#"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                                <img src={downloadicon} />
                                            </button>

                                            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0"
                                                aria-labelledby="alertsDropdown">
                                                <div className="card card-body dwnld_btn_in">
                                                    <div className="form-check">

                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="exampleRadios"
                                                            id="exampleRadios1"
                                                            value="PDF"
                                                            onChange={(e) => { setReport(e.target.value) }}
                                                            defaultChecked={report == "PDF"}

                                                        />

                                                        <label className="form-check-label" htmlFor="exampleRadios1">
                                                            <img src={downloadicon1} />
                                                            PDF
                                                        </label>
                                                    </div>

                                                    <div className="form-check">

                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="exampleRadios"
                                                            id="exampleRadios2"
                                                            value="CSV"
                                                            onChange={(e) => { setReport(e.target.value) }}
                                                        />

                                                        <label className="form-check-label" htmlFor="exampleRadios2">
                                                            <img src={downloadicon2} />
                                                            CSV
                                                        </label>
                                                    </div>

                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="exampleRadios"
                                                            id="exampleRadios3"
                                                            value="Excel"
                                                            onChange={(e) => { setReport(e.target.value) }}
                                                        />

                                                        <label className="form-check-label" htmlFor="exampleRadios3">
                                                            <img src={downloadicon3} />
                                                            Excel
                                                        </label>
                                                    </div>

                                                    <button className="btn btn down_btn" onClick={reportDownloadFun}>Download</button>

                                                </div>

                                            </div>


                                        </div>

                                        {/* ADD COMPANY BUTTON */}

                                        <div className="d-inline-block add_btn">
                                            <label>&nbsp;</label>

                                            <button
                                                className="btn down_btn"
                                                onClick={routerChangeAddCom}
                                                disabled={!canEdit}
                                            >
                                                <i className="fa fa-plus mx-2" aria-hidden="true"></i>
                                                Add Company
                                            </button>
                                        </div>

                                    </div>

                                </div>

                            </div>
                            {
                                value ?
                                    <div className="row">

                                        {arrayList.length > 0 ?
                                            <>
                                                {
                                                    arrayList.map((company, index) => {
                                                        return (
                                                            <div key={index} className="col-lg-4 col-md-6 mb-4">

                                                                <div className="bg-white shadow-lg py-3 px-3 rounded-3 dashboard_top_box">

                                                                    <div className="hdr d-flex align-items-center mb-2">
                                                                        <div className="col-auto d-block img_com">
                                                                            <img
                                                                                height="40"
                                                                                width="40"
                                                                                src={imgUrl + company.organisation_logo}
                                                                                alt="menu-vertical"
                                                                                onClick={() => { routeChangeDetails(company.orgn_id, "grid") }}
                                                                                style={{ cursor: 'pointer' }}
                                                                            /></div>
                                                                        <div className="col-auto d-block ms-auto">
                                                                            <div className="appr_dive">
                                                                                <label className="switch">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        name="checkbox"
                                                                                        value={company.orgn_id}
                                                                                        onChange={(e) => { onCheckbox(e) }}
                                                                                        defaultChecked={company.activated == "1"}
                                                                                        disabled={!canEdit}
                                                                                    />
                                                                                    <small></small>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-auto d-block ">
                                                                            <a disabled={!canEdit} className="dropdown-toggle no-dropdown-arrow" href="#" data-bs-toggle="dropdown"
                                                                                aria-expanded="false">
                                                                                <img src={require('../../../assets/images/hdr-menu-vertical.svg').default} alt="menu-vertical" /></a>
                                                                            <div className="dropdown-menu dropdown-menu-end">
                                                                                <a className="dropdown-item" onClick={() => { routeChangeDetails(company.orgn_id, "grid") }}>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                                        width="16"
                                                                                        height="16"
                                                                                        fill="currentColor"
                                                                                        className="bi bi-pencil-fill"
                                                                                        viewBox="0 0 16 16">
                                                                                        <path
                                                                                            d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                                                                    </svg>
                                                                                    &nbsp; &nbsp;Edit</a>
                                                                                <div className="dropdown-divider"></div>
                                                                                <a className="dropdown-item" onClick={() => { handleShow(); setDeleteId(company.orgn_id) }}><svg xmlns="http://www.w3.org/2000/svg"
                                                                                    width="16" height="16" fill="currentColor" className="bi bi-trash-fill"
                                                                                    viewBox="0 0 16 16">
                                                                                    <path
                                                                                        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                                                                </svg> &nbsp; &nbsp;Delete</a>
                                                                                <div className="dropdown-divider"></div>
                                                                                <a className="dropdown-item" onClick={() => { reInviteFun(company.orgn_id) }}><svg xmlns="http://www.w3.org/2000/svg"
                                                                                    width="16" height="16" fill="currentColor"
                                                                                    className="bi bi-envelope-plus-fill" viewBox="0 0 16 16">
                                                                                    <path
                                                                                        d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 4.697v4.974A4.491 4.491 0 0 0 12.5 8a4.49 4.49 0 0 0-1.965.45l-.338-.207L16 4.697Z" />
                                                                                    <path
                                                                                        d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z" />
                                                                                </svg> &nbsp; &nbsp;Reinvite</a>

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-auto d-block comp_stat">
                                                                        <strong><span style={{ cursor: 'pointer' }} onClick={() => { routeChangeDetails(company.orgn_id, "grid") }}>{company.organisation_name}</span></strong>
                                                                        {
                                                                            company.activated == "1" ? <p>Active</p> : <p style={{ color: 'red' }}>Inactive</p>
                                                                        }



                                                                    </div>

                                                                    <div className="col-auto d-block lic_exp">
                                                                        <ul style={{ paddingLeft: '0' }}>
                                                                            <li>
                                                                                <strong>No of License</strong>
                                                                                <span>{company.number_of_license}</span>
                                                                            </li>
                                                                            <li>
                                                                                <strong>Expiry Date</strong>
                                                                                <span>{new Date(company.license_end_datetime).toLocaleString("lookup").substring(0, 10)}</span>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </>
                                            :
                                            <>
                                                <tr role="row">
                                                    <td align="center" colSpan="6" style={{ border: "0" }}>
                                                        <div className="camp_empty_st_comDash">
                                                            <img src={campemty} />
                                                            <strong>There are no data available here!</strong>
                                                            <p>Start a new company now</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </>
                                        }



                                    </div>
                                    :
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="bg-white shadow_d py-4 px-0 rounded-3 table_compny">
                                                <div className="table-responsive">
                                                    <table className="table table-hover">
                                                        <thead>
                                                            <tr >
                                                                <th style={{ textAlign: 'left' }}>Name</th>
                                                                <th style={{ textAlign: 'center' }}>Expiry Date</th>
                                                                <th style={{ textAlign: 'center' }}>No of Licenses</th>
                                                                <th style={{ textAlign: 'center' }}>Status</th>
                                                                <th style={{ textAlign: 'center' }}>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {arrayList.length > 0 ?
                                                                <>
                                                                    {
                                                                        arrayList.map((company, index) => {
                                                                            return (
                                                                                <tr key={index} role="row">
                                                                                    <td style={{ textAlign: 'left' }} onClick={() => { routeChangeDetails(company.orgn_id, "list") }}>
                                                                                        <img className='px-2 d-inline align-middle' height="40" width="40" src={imgUrl + company.organisation_logo}
                                                                                            alt="menu-vertical" />

                                                                                        <span style={{ cursor: 'pointer' }}>{company.organisation_name}</span></td>
                                                                                    <td style={{ textAlign: 'center' }}>{new Date(company.license_end_datetime).toLocaleString("lookup").substring(0, 10)}</td>
                                                                                    <td style={{ textAlign: 'center' }}>{company.number_of_license}</td>
                                                                                    <td style={{ textAlign: 'center' }}>
                                                                                        <div className="appr_dive">
                                                                                            <label className="switch">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    name="checkbox"
                                                                                                    value={company.orgn_id}
                                                                                                    onChange={(e) => { onCheckbox(e) }}
                                                                                                    defaultChecked={company.activated == "1"}
                                                                                                    disabled={!canEdit}
                                                                                                />
                                                                                                <small className='com'></small>
                                                                                            </label>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td style={{ textAlign: 'center' }}>
                                                                                        <button
                                                                                            disabled={!canEdit}
                                                                                            onClick={() => { routeChangeDetails(company.orgn_id, "list") }}
                                                                                            className="d-inline"><svg xmlns="http://www.w3.org/2000/svg"
                                                                                                width="16" height="16" fill="currentColor"
                                                                                                className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                                                                <path
                                                                                                    d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                                                                            </svg>
                                                                                        </button>

                                                                                        <button
                                                                                            disabled={!canEdit}
                                                                                            onClick={() => { handleShow(); setDeleteId(company.orgn_id) }}
                                                                                            className="d-inline mx-5"><svg xmlns="http://www.w3.org/2000/svg"
                                                                                                width="16" height="16" fill="currentColor"
                                                                                                className="bi bi-trash-fill" viewBox="0 0 16 16">
                                                                                                <path
                                                                                                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                                                                            </svg>
                                                                                        </button>

                                                                                        <button
                                                                                            disabled={!canEdit}
                                                                                            onClick={() => { reInviteFun(company.orgn_id) }}
                                                                                            className="d-inline"><svg xmlns="http://www.w3.org/2000/svg"
                                                                                                width="16" height="16" fill="currentColor"
                                                                                                className="bi bi-envelope-plus-fill" viewBox="0 0 16 16">
                                                                                                <path
                                                                                                    d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 4.697v4.974A4.491 4.491 0 0 0 12.5 8a4.49 4.49 0 0 0-1.965.45l-.338-.207L16 4.697Z" />
                                                                                                <path
                                                                                                    d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })
                                                                    }
                                                                </>
                                                                :
                                                                <>
                                                                    <tr role="row">
                                                                        <td align="center" colSpan="6" style={{ border: "0" }}>
                                                                            <div className="camp_empty_st">
                                                                                <img src={campemty} />
                                                                                <strong>There are no data available here!</strong>
                                                                                <p>Start a new company now</p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </>
                                                            }




                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                            }

                            <div className="paginati">
                                <div className="paginati_l">


                                    <div className="dataTables_length d-flex align-items-center"
                                        id="datatables-reponsive_length">
                                        <label>View </label>
                                        <select name="datatables-reponsive_length"
                                            aria-controls="datatables-reponsive"
                                            className="form-select form-select-sm" value={limit} onChange={(e) => pageLimitChange(e)}>
                                            {limitArr.map((item, i) =>
                                                <option value={item.value} key={i}>{item.label}</option>
                                            )}
                                        </select>
                                        <span> Company <strong>per page</strong></span>
                                        <span style={{paddingLeft:"20px"}}> Total Company <strong>{totalCount}</strong></span>
                                    </div>

                                </div>
                                <div className="paginati_r">

                                    <Stack spacing={2}>
                                        <Pagination count={totalPage} shape="rounded" onChange={(e, value) => handleChangePage(e, value)} />
                                    </Stack>
                                </div>
                            </div>

                        </main>
                    </div >

                    <nav className="navbar navbar-expand navbar-light navbar-bg d-block">
                        <div className="navbar-collapse collapse navright">
                            <LoggedLayout />
                        </div>

                        <div className="filter_secn">
                            <div className="filtr_top">
                                <strong>Filters</strong>
                                <button onClick={clearAll}>Clear all</button>
                            </div>
                            <div className="filter_accrod company_dash_bd">

                                <div class="filter_accrod_sec"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample1" aria-expanded="false" aria-controls="multiCollapseExample1"><img src={filtr4icon} />Business Type</button>
                                    <div class="collapse multi-collapse" id="multiCollapseExample1">
                                        <div class="card card-body">
                                            <div className="age bmi">
                                                <div className='col text-center'>

                                                    <input type="radio"
                                                        name="imgbackground"
                                                        id="img7"
                                                        className="d-none imgbgchk"
                                                        value="Healthcare"
                                                        onChange={(e) => { setRadioChange(e) }}
                                                    />

                                                    <label htmlFor="img7">
                                                        <strong>Healthcare</strong>
                                                        <div className="tick_container">
                                                            <div className="tick">&nbsp;</div>
                                                        </div>
                                                    </label>
                                                </div>
                                                <div className='col text-center'>
                                                    <input
                                                        type="radio"
                                                        name="imgbackground"
                                                        id="img8"
                                                        className="d-none imgbgchk"
                                                        value="Non-Healthcare"
                                                        onChange={(e) => { setRadioChange(e) }}
                                                    />

                                                    <label htmlFor="img8">
                                                        <strong>Non-Healthcare</strong>
                                                        <div className="tick_container">
                                                            <div className="tick">&nbsp;</div>
                                                        </div>
                                                    </label>
                                                </div>


                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div class="filter_accrod_sec"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2"><img src={filtr5icon} />Industry Type</button>

                                    <div class="collapse multi-collapse" id="multiCollapseExample2">
                                        <div class="card card-body">
                                            <div className="bus_typ">

                                                {
                                                    indTypeArray.map((item, index) => (
                                                        <p key={index}>
                                                            <input
                                                                type="checkbox"
                                                                id={index}
                                                                name={item.typedesc}
                                                                value={item.id}
                                                                onChange={(e) => { onIndustryFun(e) }}
                                                            />
                                                            <label htmlFor={index}>{item.typedesc}</label>
                                                        </p>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="accordion-item">
                                        <h4 className="accordion-header" id="headingThree">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                <img src={filtr6icon} />Product Type</button>
                                        </h4>

                                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree"
                                            data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                <div className="age bmi">
                                                <div className='col text-center'>
                                                        <input 
                                                        className="d-none imgbgchk"
                                                        type="radio" 
                                                        id="test100" 
                                                        name="radio-group" 
                                                        defaultChecked 
                                                        />
                                                        <label htmlFor="test100">
                                                            <strong>Hygge Lite</strong>
                                                            <div className="tick_container">
                                                                <div className="tick">&nbsp;</div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <div className='col text-center'>
                                                        <input 
                                                        className="d-none imgbgchk"
                                                        type="radio" 
                                                        id="test200" 
                                                        name="radio-group" 
                                                        disabled />
                                                        <label htmlFor="test200">
                                                            <strong>Hygge</strong>
                                                            <div className="tick_container">
                                                                <div className="tick">&nbsp;</div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div> */}
                                <div class="filter_accrod_sec"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample3" aria-expanded="false" aria-controls="multiCollapseExample3"><img src={filtr7icon} />Size</button>

                                    <div class="collapse multi-collapse" id="multiCollapseExample3">
                                        <div class="card card-body">
                                            <div className="bus_typ">
                                                {/* <p>
                                                        <input
                                                            type="checkbox"
                                                            id="test5"
                                                            name="checkbox-group"
                                                            value="11-25"
                                                            onChange={(e) => { onSizeFun(e) }}
                                                        />
                                                        <label htmlFor="test5">11-25</label>
                                                    </p>
                                                    <p>
                                                        <input
                                                            type="checkbox"
                                                            id="test6"
                                                            name="checkbox-group"
                                                            value="26-50"
                                                            onChange={(e) => { onSizeFun(e) }}
                                                        />
                                                        <label htmlFor="test6">26-50</label>
                                                    </p>
                                                    <p>
                                                        <input
                                                            type="checkbox"
                                                            id="test7"
                                                            name="checkbox-group"
                                                            value="51-100"
                                                            onChange={(e) => { onSizeFun(e) }}
                                                        />
                                                        <label htmlFor="test7">51-100</label>
                                                    </p> */}
                                                <p>
                                                    <input
                                                        type="checkbox"
                                                        id="test8"
                                                        name="checkbox-group"
                                                        value="101-250"
                                                        onChange={(e) => { onSizeFun(e) }}
                                                    />
                                                    <label htmlFor="test8">101-250</label>
                                                </p>
                                                <p>
                                                    <input
                                                        type="checkbox"
                                                        id="test9"
                                                        name="checkbox-group"
                                                        value="251-500"
                                                        onChange={(e) => { onSizeFun(e) }}
                                                    />
                                                    <label htmlFor="test9">251-500</label>
                                                </p>
                                                <p>
                                                    <input
                                                        type="checkbox"
                                                        id="test10"
                                                        name="checkbox-group"
                                                        value="500-1000000"
                                                        onChange={(e) => { onSizeFun(e) }}
                                                    />
                                                    <label htmlFor="test10">500+</label>
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <NotificationContainer />

                    </nav>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Company</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p style={{ paddingLeft: "16px" }}>Are you want to delete this company?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                No
                            </Button>
                            <Button variant="primary" onClick={onDelete}>
                                Yes
                            </Button>
                        </Modal.Footer>
                    </Modal>


                </>
            }
        </React.Fragment>
    )
}

export default CompanyDashboard