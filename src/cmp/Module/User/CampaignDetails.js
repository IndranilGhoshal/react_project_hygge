import React, { useState, useEffect } from 'react'
import LoggedLayout from './LoggedLayout'
import { useParams, useNavigate } from 'react-router-dom'
import { campaignDetails, endCampaign, getOnboardingDataOfCampaign, repetCampaignEmpList, upSertRepetCampaign, sendRemindersForCampaign, checkLicence } from '../../../service/CampaignService';
import { getUserData, dateDifference, setData, showLoader, hideLoader } from '../../../service/Common';
import moment from 'moment';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import $ from 'jquery'
import { LIMIT_ARRAY } from '../../../constant/constantValue';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { getAggregatedReport } from '../../../service/ReportServices';
import { userEvent } from '../../../service/Services';
import { saveAs } from 'file-saver';
import { COMPANY_REPORT_PDF_URL, IMAGE_URL } from '../../../config/app_url';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


const closeicon = require('../../../assets/images/close-icon.png');
const iicon = require('../../../assets/images/i-icon.png');
const campdtlcpmp = require('../../../assets/images/camp-dtl-cpmp.png');


const campemty = require('../../../assets/images/camp-emty.png');




function CampaignDetails() {

    let { id } = useParams();
    let navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);
    const handlePopupClose = () => setShowPopup(false);
    const handlePopupShow = () => setShowPopup(true);

    // ------------- Tab Change Variable ----------------//
    const [detailsTabChange, setDetailsTabChange] = React.useState({ showTab: true })
    const [audiencetabChange, setAudienceTabChange] = React.useState({ showTab: false })
    const [overviewtabChange, setOverviewTabChange] = React.useState({ showTab: false })

    const [campDetails, setCampDetails] = useState({})
    const [isDisable, setIsDisable] = useState(false)

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const [desErr, setDesErr] = useState(false)
    const [desLengthErr, setDesLengthErr] = useState(false)
    const [startDateErr, setStartDateErr] = useState(false)
    const [endDateErr, setEndDateErr] = useState(false)
    const [validDateErr, setValidDateErr] = useState(false)
    const [dateMinErr, setDateMinErr] = useState(false)
    const [dateMaxErr, setDateMaxErr] = useState(false)

    const [validDate, setvalidDate] = useState(false)
    const [licenseCount, setLicenseCount] = React.useState("");
    const [licenseCountRemaining, setLicenseCountRemaining] = React.useState("");
    const [licenseValidity, setLicenseValidity] = React.useState("");
    const [selectId, setSelectId] = useState([]);

    var todayDate = new Date().toISOString().slice(0, 10);

    const [tempEmpList, setTempEmpList] = useState([])
    const [limit, setLimit] = useState("10");
    const [offset, setOffset] = useState("0");
    const [search, setSearch] = React.useState("");
    const [searchDate, setSearchDate] = React.useState("");


    const [limitArr, setLimitArr] = useState([]);

    const [totalPage, setTotalPage] = useState(0);

    const [successMessage, setSuccessMessage] = useState("")

    const [selectCount, setSelectCount] = useState(0);

    const [selectIdErr, setSelectIdErr] = useState(false)

    const [campaignDtlId, setCampaignDtlId] = React.useState("");


    const [myArray, setMyArray] = useState([]);
    const [myArrayErr, setMyArrayErr] = useState(false)

    const [isexpired, setIsexpired] = useState(0)


    var reqData = {
        "userId": getUserData().response.userId,
        "orgId": getUserData().response.orgn_id,
        "campaignDtlId": campaignDtlId + "",
        "campaignId": campDetails.id,
        "limit": limit,
        "offset": offset + "",
        "searchUserName": search,
        "searchCreatedAt": searchDate
    }

    useEffect(() => {
        if (campaignDtlId !== null && campaignDtlId !== '') {
            repetCampaignEmpListFun(reqData)
            setLimitArr(LIMIT_ARRAY)
        }

    }, [limit, offset, searchDate])

    useEffect(() => {
        campaignDetailsFun()
    }, [])

    useEffect(() => {
        checkLicenceFun()
    }, [])

    const checkLicenceFun = () => {
        var data = {

        }
        checkLicence(data).then(result => {
            if (result.data.success) {
                setIsexpired(result.data.response.isexpired)
                if (result.data.response.isexpired == 1) {
                    handlePopupShow()
                }

            } else {
                NotificationManager.error(result.data.message);
            }
        })
    }

    const repetCampaignEmpListFun = (reqData) => {
        showLoader()
        repetCampaignEmpList(reqData).then(result => {
            hideLoader()
            if (result.data.success) {

                for (let obj of result.data.response.empList) {
                    for (let val of myArray) {
                        if (obj.empid == val.empId) {
                            obj.isChecked = true
                        }
                    }
                }

                if (campDetails.empList) {
                    for (let obj of result.data.response.empList) {
                        for (let val of campDetails.empList) {
                            if (obj.empid == val.empid) {

                                obj.isChecked = true
                                break;

                            }
                        }
                    }

                }

                setTempEmpList(result.data.response.empList)
                if (result.data.response.empCount) {
                    let totalPage = Math.ceil(result.data.response.empCount / limit);
                    setTotalPage(totalPage);
                }
            }
        })

    }

    const campaignDetailsFun = () => {
        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "campaignDtlId": id
        }
        showLoader()
        campaignDetails(data).then(result => {
            hideLoader()
            if (result.data.success) {
                console.log("response", result.data.response)
                setCampDetails(result.data.response)

                const html = result.data.response.camp_desc;
                const contentBlock = htmlToDraft(html);

                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                setEditorState(editorState)


                var tempArr = [...myArray]
                for (let data of result.data.response.empList) {
                    tempArr.push({ "empId": data.empid, "emplicenceId": data.emplicenceid })
                }
                setMyArray(tempArr)


                var dateDiff = dateDifference(new Date(), result.data.response.camp_end_datetime, 90)

                if (dateDiff) {
                    setIsDisable(true)
                } else {
                    setIsDisable(false)
                }
            }

        })
    }

    const seeParticipants = () => {
        navigate("/users/campaignDetailsParticipants/" + id)
    }

    const returnCampaign = () => {
        navigate("/users/campaign")
    }

    const endCampaignFun = () => {
        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "campaignId": id + ""
        }
        showLoader()
        endCampaign(data).then(result => {
            hideLoader()
            if (result.data.success) {
                campaignDetailsFun()
            } else {
                NotificationManager.error(result.data.message);
            }
        })
    }

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    };

    const getOnboardingDataOfCampaignFun = () => {
        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
        }
        getOnboardingDataOfCampaign(data).then(result => {
            if (result.data.success) {
                setLicenseValidity(result.data.response.licenceData.validityenddate)
                setLicenseCount(result.data.response.totalLicenceCount)
                setLicenseCountRemaining(result.data.response.remainingLicenceCount)
            }
        })
    }

    function pageLimitChange(e) {
        setLimit(e.target.value);
    }

    const handleKeyPress = () => {
        if (search.length >= '2') {
            repetCampaignEmpListFun(reqData)
        }
        if (search.length == '0') {
            repetCampaignEmpListFun(reqData)
        }
    }

    const handleChange = (e) => {

        const { name, checked, value } = e.target;

        if (name === "allSelect") {

            console.log(name, checked, value)

            let tempUser = tempEmpList.map((user) => {
                return { ...user, isChecked: checked };
            });

            setTempEmpList(tempUser)


            // setMyArray([])

            if (checked) {
                // for (let data of tempEmpList) {
                //     setMyArray(myArray => [...myArray, { "empId": data.empid , "emplicenceid":data.emplicenceid }]);
                // }
                for (let val of tempUser) {
                    var flag = 0
                    for (let data of myArray) {
                        if (data.empId == val.id) {
                            flag = 1
                        }
                    }

                    if (flag == 0) {
                        setMyArray(myArray => [...myArray, { "empId": Number(val.id), "emplicenceId": val.emplicenceid }])
                    }
                }
            } else {
                for (let val of tempUser) {
                    for (let i = 0; i < myArray.length; i++) {
                        if (myArray[i].empId == val.id) {
                            myArray.splice(i, 1);
                            i--;
                        }
                    }
                }
                setMyArray(myArray => [...myArray]);
            }


            setSelectCount(myArray.length)

        } else {
            let tempUser = tempEmpList.map((user, index) =>

                user.empid == value ? { ...user, isChecked: checked } : user

            );
            setTempEmpList(tempUser)

            if (checked) {
                var flag = 0
                for (let data of myArray) {
                    if (data.empId == value) {
                        flag = 1
                    }
                }

                if (flag == 0) {
                    setMyArray(myArray => [...myArray, { "empId": Number(value), "emplicenceid": name !== null && name !== '' ? name : null }])
                }
            }

            if (!checked) {
                for (let i = 0; i < myArray.length; i++) {
                    if (myArray[i].empId == value) {
                        myArray.splice(i, 1);
                        i--;
                    }
                }
                setMyArray(myArray => [...myArray]);
            }





        }
    };

    useEffect(() => {
        setSelectCount(myArray.length);
    }, [myArray])

    const handleChangePage = (e, val) => {
        let offeset = (val - 1) * limit;
        setOffset(offeset);
    };

    const [desComNameError, setDesComNameError] = useState(false)


    // DETAILS TAB SAVE AND EXIT BUTTON FUNCTION
    const saveAndExitDetails = () => {
        setDesErr(false)
        setDesLengthErr(false)
        setStartDateErr(false)
        setEndDateErr(false)
        setvalidDate(false)
        setValidDateErr(false)
        setDateMinErr(false)
        setDateMaxErr(false)
        setDesComNameError(false)


        const hasText = editorState.getCurrentContent().hasText()
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');

        var err = 0

        if (!hasText) {
            setDesErr(true)
            err++
        } else if (value.length > 500) {
            setDesLengthErr(true)
            err++
        } else if (!value.includes(getUserData().response.organisation_name)) {
            setDesComNameError(true)
            err++
        }

        if (startDate == '') {
            setStartDateErr(true)
            err++
        }

        if (endDate == '') {
            setEndDateErr(true)
            err++
        }

        if (endDate && startDate > endDate) {
            setvalidDate(true)
            err++
        } else if (startDate && endDate && !validDate && endDate > licenseValidity) {
            setValidDateErr(true)
            err++
        } else if (startDate && endDate && startDate == endDate) {
            setDateMinErr(true)
            err++
        } else if (startDate && endDate && dateDifference(startDate, endDate, 60)) {
            setDateMaxErr(true)
            err++
        }


        var data = {
            "campaignId": campDetails.id + "",
            "userId": getUserData().response.userId + "",
            "orgId": getUserData().response.orgn_id + "",
            "campaignName": campDetails.campaigndesc + "",
            "campSubject": campDetails.camp_subject + "",
            "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
            "campStartDate": moment(startDate).format('yyyy-MM-DD') + "",
            "campEndDate": moment(endDate).format('yyyy-MM-DD') + "",
            "campAudience": myArray,
            "createType": "1"
        }


        if (err == 0) {
            // console.log("data", data)
            showLoader()
            upSertRepetCampaign(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    setTempEmpList([])
                    setDetailsTabChange({ ...detailsTabChange, showTab: true });
                    setAudienceTabChange({ ...audiencetabChange, showTab: false });
                    setOverviewTabChange({ ...overviewtabChange, showTab: false });

                    setMyArrayErr(false)

                    setTimeout(() => {
                        $("#closeBtn").get(0).click()
                        $("#details_t-tab").click();
                        setTempEmpList([])
                        setEditorState(EditorState.createEmpty())
                        setStartDate("")
                        setEndDate("")
                        setDesErr(false)
                        setDesLengthErr(false)
                        setStartDateErr(false)
                        setEndDateErr(false)
                        setvalidDate(false)
                        setValidDateErr(false)
                        setDateMinErr(false)
                        setDateMaxErr(false)
                    }, 1000);
                } else {
                    NotificationManager.error(result.data.message);
                }
            })
        }


    }

    // DETAILS TAB NEXT BUTTON FUNCTION
    const detailsNextBtnFun = () => {

        setDesErr(false)
        setDesLengthErr(false)
        setStartDateErr(false)
        setEndDateErr(false)
        setvalidDate(false)
        setValidDateErr(false)
        setDateMinErr(false)
        setDateMaxErr(false)
        setDesComNameError(false)
        var err = 0

        const hasText = editorState.getCurrentContent().hasText()
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');


        if (!hasText) {
            setDesErr(true)
            err++
        } else if (value.length > 500) {
            setDesLengthErr(true)
            err++
        } else if (!value.includes(getUserData().response.organisation_name)) {
            setDesComNameError(true)
            err++
        }


        if (startDate == '') {
            setStartDateErr(true)
            err++
        }

        if (endDate == '') {
            setEndDateErr(true)
            err++
        }

        if (endDate && startDate > endDate) {
            setvalidDate(true)
            err++
        } else if (startDate && endDate && !validDate && endDate > licenseValidity) {
            setValidDateErr(true)
            err++
        } else if (startDate && endDate && startDate == endDate) {
            setDateMinErr(true)
            err++
        } else if (startDate && endDate && dateDifference(startDate, endDate, 60)) {
            setDateMaxErr(true)
            err++
        }

        var data = {
            "campaignId": campDetails.id + "",
            "userId": getUserData().response.userId + "",
            "orgId": getUserData().response.orgn_id + "",
            "campaignName": campDetails.campaigndesc + "",
            "campSubject": campDetails.camp_subject + "",
            "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
            "campStartDate": moment(startDate).format('yyyy-MM-DD') + "",
            "campEndDate": moment(endDate).format('yyyy-MM-DD') + "",
            "campAudience": myArray,
            "createType": "1"
        }

        if (err == 0) {

            console.log("data", data)
            showLoader()
            upSertRepetCampaign(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    setCampaignDtlId(result.data.response.campaignDtlId)
                    setAudienceTabChange({ ...audiencetabChange, showTab: true });
                    setTimeout(() => {
                        $("#audience_t-tab").click();
                    }, 1000);
                } else {
                    NotificationManager.error(result.data.message);
                }
            })

        }

    }

    useEffect(() => {
        if (campaignDtlId !== null && campaignDtlId !== '') {
            repetCampaignEmpListFun(reqData)
        }
    }, [campaignDtlId])

    // AUDIENCE SAVE AND EXIT BUTTON FUNCTION
    const saveAndExitFun = () => {

        var err = 0

        if (myArray.length == 0) {
            setMyArrayErr(true)
            NotificationManager.error("Please select audience");
            err++
        }

        let newCount = 0

        for (let data of myArray) {
            if (data.emplicenceid == null) {
                newCount++
            }
        }


        if (licenseCountRemaining < newCount) {
            NotificationManager.error("Sufficient license not available");
            err++
        }

        var data = {
            "campaignDtlId": campaignDtlId + "",
            "campaignId": campDetails.id + "",
            "userId": getUserData().response.userId + "",
            "orgId": getUserData().response.orgn_id + "",
            "campaignName": campDetails.campaigndesc + "",
            "campSubject": campDetails.camp_subject + "",
            "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
            "campStartDate": moment(startDate).format('yyyy-MM-DD') + "",
            "campEndDate": moment(endDate).format('yyyy-MM-DD') + "",
            "campAudience": myArray,
            "createType": "1"
        }

        if (err == 0) {

            console.log("data", data)
            showLoader()
            upSertRepetCampaign(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    setDetailsTabChange({ ...detailsTabChange, showTab: true });
                    setAudienceTabChange({ ...audiencetabChange, showTab: false });
                    setOverviewTabChange({ ...overviewtabChange, showTab: false });

                    setMyArrayErr(false)
                    setTimeout(() => {
                        $("#closeBtn").get(0).click()
                        $("#details_t-tab").click();
                        setTempEmpList([])
                        setStartDate("")
                        setEndDate("")
                        setDesErr(false)
                        setDesLengthErr(false)
                        setStartDateErr(false)
                        setEndDateErr(false)
                        setvalidDate(false)
                        setValidDateErr(false)
                        setDateMinErr(false)
                        setDateMaxErr(false)
                    }, 1000);

                } else {
                    NotificationManager.error(result.data.message);
                }
            })
        }


    }

    const [msg, setMsg] = React.useState("")

    // AUDIENCE TAB NEXT BUTTON FUNCTION
    const audienceNextBtnFun = () => {

        var err = 0

        if (myArray.length == 0) {
            setMyArrayErr(true)
            NotificationManager.error("Please select audience");
            err++
        }

        let newCount = 0

        for (let data of myArray) {
            if (data.emplicenceid == null) {
                newCount++
            }
        }


        if (licenseCountRemaining < newCount) {
            NotificationManager.error("Sufficient license not available");
            err++
        }



        var data = {
            "campaignDtlId": campaignDtlId + "",
            "campaignId": campDetails.id + "",
            "userId": getUserData().response.userId + "",
            "orgId": getUserData().response.orgn_id + "",
            "campaignName": campDetails.campaigndesc + "",
            "campSubject": campDetails.camp_subject + "",
            "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
            "campStartDate": moment(startDate).format('yyyy-MM-DD') + "",
            "campEndDate": moment(endDate).format('yyyy-MM-DD') + "",
            "campAudience": myArray,
            "createType": "2"
        }


        if (err == 0) {
            console.log("data", data)
            showLoader()
            upSertRepetCampaign(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    setMsg(result.data.message)
                    setDetailsTabChange({ ...detailsTabChange, showTab: false });
                    setAudienceTabChange({ ...audiencetabChange, showTab: false });
                    setOverviewTabChange({ ...overviewtabChange, showTab: true });

                    setTimeout(() => {
                        $("#overview_t-tab").click();
                    }, 1000);
                } else {
                    NotificationManager.error(result.data.message);
                }
            })
        }
    }

    // GO TO DASHBOARD FUNCTION
    const goDash = () => {
        showLoader()
        setDetailsTabChange({ ...detailsTabChange, showTab: true });
        setAudienceTabChange({ ...audiencetabChange, showTab: false });
        setOverviewTabChange({ ...overviewtabChange, showTab: false });

        setMyArrayErr(false)
        setTimeout(() => {
            $("#closeBtn").get(0).click()
            $("#details_t-tab").click();
            hideLoader()
            setTempEmpList([])
            setStartDate("")
            setEndDate("")
            setDesErr(false)
            setDesLengthErr(false)
            setStartDateErr(false)
            setEndDateErr(false)
            setvalidDate(false)
            setValidDateErr(false)
            setDateMinErr(false)
            setDateMaxErr(false)
            navigate("/users/campaign")
        }, 1000);

    }

    const closeBtn = () => {
        showLoader()
        setTempEmpList([])
        setDetailsTabChange({ ...detailsTabChange, showTab: true });
        setAudienceTabChange({ ...audiencetabChange, showTab: false });
        setOverviewTabChange({ ...overviewtabChange, showTab: false });

        // setSelectIdErr(false)
        setMyArrayErr(false)
        setStartDate("")
        setEndDate("")
        setDesErr(false)
        setDesLengthErr(false)
        setStartDateErr(false)
        setEndDateErr(false)
        setvalidDate(false)
        setValidDateErr(false)
        setDateMinErr(false)
        setDateMaxErr(false)


        setTimeout(() => {
            hideLoader()
            $("#details_t-tab").click();

        }, 1000);


    }

    const sendReminderAllFun = () => {
        var data = {
            "campaignDtlId": campDetails.campaigndtlid + "",
            "orgId": getUserData().response.orgn_id + "",
            "userId": getUserData().response.userId + ""
        }
        showLoader()
        sendRemindersForCampaign(data).then(result => {
            hideLoader()
            if (result.data.success) {
                NotificationManager.success(result.data.message);
                campaignDetailsFun()
            }
        })
    }

    const gotoDetailsEdit = (data) => {
        navigate("/users/campaignedit")
        setData(data)
    }



    const reportDownload = () => {
        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "campaignDtlId": id,   // 0 if for organization else campaigndtlid
            "industryType": [],
            "companyList": [],
            "size": [],
            "gender": '',
            "age": ''
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
            <div className="main">

                <main className="content">

                    <div className="container-fluid p-0 position-relative">

                        {/* REPEAT CAMPAIGN */}
                        <div className="bulk_upl_po collapse" id="myCollapse">
                            <a
                                onClick={closeBtn}
                                id="closeBtn"
                                href="#myCollapse"
                                data-bs-toggle="collapse"
                                className="close_btn_addemp">
                                <img src={closeicon} />
                            </a>

                            <div className="bulk_upl_po_bd">
                                <h3>Repeat Campaign</h3>

                                {/* TAB */}
                                <div className="addcompny_tab addemploy_tab">
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        {/* Details */}
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link active"
                                                id="details_t-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#uplodfile_t"
                                                type="button"
                                                role="tab"
                                                aria-controls="uplodfile_t"
                                                aria-selected="true"
                                                disabled={!detailsTabChange.showTab}
                                            >
                                                Details
                                            </button>
                                        </li>
                                        {/* Audience */}
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="audience_t-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#repir_t"
                                                type="button"
                                                role="tab"
                                                aria-controls="repir_t"
                                                aria-selected="false"
                                                disabled={!audiencetabChange.showTab}
                                            >
                                                Audience
                                            </button>
                                        </li>
                                        {/* Overview */}
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="overview_t-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#privcyimpo_t"
                                                type="button"
                                                role="tab"
                                                aria-controls="privcyimpo_t"
                                                aria-selected="false"
                                                disabled={!overviewtabChange.showTab}
                                            >
                                                Overview
                                            </button>
                                        </li>

                                    </ul>

                                </div>

                                <div className="row">
                                    <div className="col-md-12 col-sm-12">
                                        <div className="mb-4 add_employ_page">
                                            <div className="tab-content" id="myTabContent">

                                                {/* Details */}
                                                <div className="tab-pane fade show active" id="uplodfile_t" role="tabpanel"
                                                    aria-labelledby="uplodfile_t-tab">
                                                    <div className="creat_camp_div">
                                                        <div className="creat_camp_div_top">
                                                            <span className="camp_div_nbm">1</span>
                                                            <strong>Campaign Details</strong>
                                                        </div>
                                                        <div className="creat_camp_div_blo">
                                                            <div className="creat_camp_div_blo_list">
                                                                <ul>
                                                                    <li>
                                                                        <label>Campaign Name :</label>
                                                                        <strong>{campDetails.campaigndesc}</strong>
                                                                    </li>
                                                                </ul>

                                                            </div>
                                                            <div className="creat_camp_div_blo_list">
                                                                <ul>
                                                                    <li>
                                                                        <label>Subject :</label>
                                                                        <strong>{campDetails.camp_subject}</strong>
                                                                    </li>
                                                                </ul>

                                                            </div>

                                                            <div>
                                                                <label>Description</label>
                                                                <div className={`border-1 p-4 edit_div ${desErr || desLengthErr || desComNameError ? "error-fil" : ""}`}>
                                                                    <Editor
                                                                        editorState={editorState}
                                                                        wrapperClassName="demo-wrapper"
                                                                        editorClassName="demo-editor"
                                                                        onEditorStateChange={onEditorStateChange}
                                                                        toolbar={{
                                                                            options: ['inline', 'fontSize', 'list', 'textAlign'],
                                                                            inline: { inDropdown: false },
                                                                            list: { inDropdown: true },
                                                                            textAlign: { inDropdown: true },
                                                                        }}
                                                                    />

                                                                </div>
                                                                {
                                                                    desErr ? <span className='errorfiled'>Enter the description</span> : null
                                                                }
                                                                {
                                                                    desLengthErr ? <span className='errorfiled'>Enter the maximum 500 characters</span> : null
                                                                }
                                                                {
                                                                    desComNameError ? <span className='errorfiled'>Enter the company name</span> : null
                                                                }
                                                            </div>

                                                        </div>

                                                    </div>
                                                    <div className="creat_camp_div">
                                                        <div className="creat_camp_div_top">
                                                            <span className="camp_div_nbm">2</span>
                                                            <strong>Time Manage</strong>
                                                            <a ><img src={iicon} />
                                                                <div className="inf_hov_dv">
                                                                    <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>
                                                                </div></a>
                                                        </div>
                                                        <div className="creat_camp_div_blo std_end">
                                                            <div>
                                                                <label>Start Date  </label>
                                                                <input
                                                                    className={`form-control ${startDateErr ? "error-fil" : ""}`}
                                                                    type="date"
                                                                    min={todayDate}
                                                                    value={startDate}
                                                                    onChange={(e) => { setStartDate(e.target.value) }}
                                                                />
                                                                {startDateErr ?
                                                                    <span className='errorfiled'>Enter the start date</span>
                                                                    : null
                                                                }
                                                            </div>
                                                            <div>
                                                                <label>End Date </label>
                                                                <input
                                                                    className={`form-control ${endDateErr || validDate || validDateErr || dateMinErr || dateMaxErr ? "error-fil" : ""}`}
                                                                    type="date"
                                                                    min={startDate}
                                                                    value={endDate}
                                                                    onChange={(e) => { setEndDate(e.target.value) }}
                                                                />
                                                                {endDateErr ?
                                                                    <span className='errorfiled'>Enter the end date</span>
                                                                    : null
                                                                }
                                                                {validDate ?
                                                                    <span className='errorfiled'>End date is greater than start date</span>
                                                                    : null
                                                                }
                                                                {validDateErr ?
                                                                    <span className='errorfiled'>End date is greater than licence validity date</span>
                                                                    : null
                                                                }
                                                                {dateMinErr ?
                                                                    <span className='errorfiled'>Campaign duration should be atleast 1 day</span>
                                                                    : null
                                                                }
                                                                {dateMaxErr ?
                                                                    <span className='errorfiled'>Campaign duration should be within 60 days</span>
                                                                    : null
                                                                }
                                                            </div>


                                                        </div>

                                                    </div>

                                                    <div className="suprt_btne">
                                                        <span className="support_btn"></span>
                                                        <div className="btn_edit">
                                                            <button className="btn btn-nobg btn-witbord" onClick={saveAndExitDetails}>Save and Exit</button>
                                                            <button className="btn btn-primary" onClick={detailsNextBtnFun}>Next</button>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Audience */}
                                                <div className="tab-pane fade" id="repir_t" role="tabpanel"
                                                    aria-labelledby="repir_t-tab">
                                                    <div className="creat_camp_div creat_camp_pgn">
                                                        <div className="creat_camp_div_top">
                                                            <span className="camp_div_nbm">3</span>
                                                            <strong>Select Participants</strong>
                                                        </div>
                                                        <div className="paginati_l">
                                                            <div className="dataTables_length d-flex align-items-center" id="datatables-reponsive_length">
                                                                <label>View </label>
                                                                <select name="datatables-reponsive_length"
                                                                    aria-controls="datatables-reponsive"
                                                                    className="form-select form-select-sm" value={limit} onChange={(e) => pageLimitChange(e)}>
                                                                    {limitArr.map((item, i) =>
                                                                        <option value={item.value} key={i}>{item.label}</option>
                                                                    )}
                                                                </select>
                                                                <span> per page</span>

                                                            </div></div> </div>
                                                    <p className="actvt_cams">{selectCount} active participants selected | {licenseCountRemaining} License used out of {licenseCount}   </p>

                                                    <div className="list_of_tabl  camp_tabl">
                                                        <div className="list_of_tabl_dv">
                                                            <div className="creat_camp_div_blo">
                                                                <div className="d-inline-block src_dv">
                                                                    <label>Search</label>
                                                                    <input
                                                                        className="form-control"
                                                                        type="search"
                                                                        placeholder=""
                                                                        onChange={(e) => {
                                                                            setSearch(e.target.value)
                                                                        }}
                                                                        onKeyUp={handleKeyPress}
                                                                    />
                                                                    <button className="btn"><i className="bi bi-search"></i></button>
                                                                </div>

                                                                <div className="d-inline-block src_fld">
                                                                    <label>Sort</label>
                                                                    <div className="form-group">
                                                                        <select id="selectinput1" className="form-select">
                                                                            <option value="1">All</option>
                                                                        </select>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="table-responsive">
                                                            <table className="table">
                                                                <thead>
                                                                    <tr role="row">
                                                                        <th align="center" style={{ textAlign: 'center' }}>
                                                                            <div className="form-check">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-check-input"
                                                                                    name="allSelect"
                                                                                    checked={!tempEmpList.some((user) => user?.isChecked !== true)}
                                                                                    onChange={handleChange}
                                                                                />
                                                                            </div>
                                                                        </th>
                                                                        <th align="left">First Name</th>
                                                                        <th align="left">Last Name</th>
                                                                        <th align="left">Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {tempEmpList.length > 0 ?
                                                                        <>
                                                                            {
                                                                                tempEmpList.map((item, i) => (

                                                                                    <tr role="row">
                                                                                        <td align="center">
                                                                                            <div className="form-check">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className={`form-check-input ${selectIdErr ? "error-fil" : ""}`}
                                                                                                    name={item.emplicenceid}
                                                                                                    checked={item?.isChecked || false}
                                                                                                    value={item.empid}
                                                                                                    onChange={handleChange}
                                                                                                />

                                                                                            </div>
                                                                                        </td>
                                                                                        <td align="left">{item.first_name}</td>
                                                                                        <td align="left">{item.last_name}</td>
                                                                                        <td align="left">{moment(item.empinserted_datetime).format('DD-MM-YYYY')}</td>
                                                                                    </tr>

                                                                                ))

                                                                            }
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <tr role="row">
                                                                                <td align="center" colSpan="6" style={{ border: "0" }}>
                                                                                    <div className="camp_empty_st ">
                                                                                        <img src={campemty} className='mt-5' />
                                                                                        <strong>There are no data available here!</strong>
                                                                                        <p>Start a new employee now</p>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </>
                                                                    }

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div className="suprt_btne">
                                                        <span></span>
                                                        <div className="btn_edit">
                                                            <button className="btn btn-nobg btn-witbord" onClick={saveAndExitFun}>Save and Exit</button>
                                                            <button className="btn btn-primary" onClick={audienceNextBtnFun}>Next</button>
                                                        </div>
                                                    </div>

                                                    <div className="bulk_pagi paginati">
                                                        <Stack spacing={2}>
                                                            <Pagination count={totalPage} shape="rounded" onChange={(e, value) => handleChangePage(e, value)} />
                                                        </Stack>
                                                    </div>
                                                </div>

                                                {/* Overview */}
                                                <div className="tab-pane fade" id="privcyimpo_t" role="tabpanel"
                                                    aria-labelledby="privcyimpo_t-tab">
                                                    <div className="sucs_dive">
                                                        <p>&nbsp;</p>
                                                        <span>
                                                            <i className="bi bi-check-circle-fill"></i>
                                                        </span>
                                                        <strong>Success!</strong>

                                                        <p>{msg}</p>

                                                        <button className="btn btn-primary" onClick={goDash}>Go to Dashboard</button>
                                                        <p>&nbsp;</p>
                                                        <p>&nbsp;</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* CAMPAIGN DETAILS */}
                        <div className="addemplo collapse show" id="myCollapse">
                            <div className="row mb-2 mb-lg-4">
                                <div className="col-md-12 d-lg-flex align-items-center main-hdng">
                                    <div className="col-md-6">
                                        <h3 className="compny-add">Campaign</h3>
                                    </div>

                                </div>
                                <div className="breadcum">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><a onClick={returnCampaign}>Campaign </a></li>
                                            <li className="breadcrumb-item active" aria-current="page">{campDetails.campaigndesc}</li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="bg-white shadow_d p-5 rounded-3">
                                        <div className="camp_dtl_pge">
                                            <div className="camp_dtl_hed">
                                                <span><img src={IMAGE_URL + getUserData().response.organisation_logo} /></span>
                                                <strong>{campDetails.campaigndesc}</strong>
                                                {
                                                    campDetails.status == 0 || campDetails.status == 1 ?
                                                        <>
                                                            <a className='a_tag mx-5' onClick={() => gotoDetailsEdit(campDetails)}>Edit</a>
                                                        </>
                                                        :
                                                        <>

                                                        </>
                                                }
                                            </div>
                                            <div className="camp_dtl_con">
                                                <div className="camp_dtl_con_in">
                                                    <span>Status:</span>
                                                    {
                                                        campDetails.status == 0 ?
                                                            <>
                                                                <span className="spntxt text-pndng">Pending</span>

                                                            </>
                                                            :
                                                            <>

                                                            </>
                                                    }
                                                    {
                                                        campDetails.status == 1 ?
                                                            <>
                                                                <span className="spntxt text-scdul">Scheduled</span>

                                                            </>
                                                            :
                                                            <>

                                                            </>
                                                    }
                                                    {
                                                        campDetails.status == 2 ?
                                                            <>
                                                                <span className="spntxt text-inprocss">In Progress</span>
                                                            </>
                                                            :
                                                            <>

                                                            </>
                                                    }

                                                    {
                                                        campDetails.status == 3 ?
                                                            <>
                                                                <span className="spntxt text-cmplt">Completed</span>
                                                            </>
                                                            :
                                                            <>

                                                            </>
                                                    }
                                                </div>
                                                <div className="camp_dtl_con_in">
                                                    <span>Start Date :</span>
                                                    <strong>{moment(campDetails.camp_start_datetime).format('DD-MM-YYYY')}</strong>
                                                </div>
                                                <div className="camp_dtl_con_in">
                                                    <span>End  Date :</span>
                                                    <strong>{moment(campDetails.camp_end_datetime).format('DD-MM-YYYY')}</strong>
                                                </div>
                                                <div className="camp_dtl_con_in">
                                                    <span>Created :</span>
                                                    <strong>{moment(campDetails.camp_create_datetime).format('DD-MM-YYYY')}</strong>
                                                </div>
                                                <div className="camp_dtl_con_in">
                                                    <span>Participants Invited :</span>
                                                    <strong>{campDetails.camp_user_no_for}</strong>
                                                </div>
                                                <div className="camp_dtl_con_in">
                                                    <span>Participants Completed :</span>
                                                    <strong>{campDetails.completedCount}</strong>
                                                </div>
                                                <div className="camp_dtl_con_in">
                                                    <span>Not initiated :</span>
                                                    <strong>{campDetails.notInitiatedCount}</strong>
                                                </div>
                                                <div className="camp_dtl_con_in">
                                                    <span>Participants Initiated :</span>
                                                    <strong>{campDetails.initiatedCount}</strong>
                                                </div>

                                            </div>

                                            {
                                                campDetails.status == 0 ?
                                                    <>
                                                        <div className="camp_dtl_btns">
                                                            <button className="btn btn-nobgtxt" onClick={seeParticipants}>See Participants</button>
                                                        </div>
                                                    </>
                                                    :
                                                    <>

                                                    </>
                                            }
                                            {
                                                campDetails.status == 1 ?
                                                    <>
                                                        <div className="camp_dtl_btns">
                                                            <button className="btn btn-primary" disabled>Download Report</button>
                                                            <button className="btn btn-repet_btn" disabled>Repeat Campaign</button>
                                                            <button className="btn btn-nobgtxt" onClick={seeParticipants}>See Participants</button>
                                                        </div>
                                                    </>
                                                    :
                                                    <>

                                                    </>
                                            }
                                            {
                                                campDetails.status == 2 ?
                                                    <>
                                                        <div className="camp_dtl_btns">
                                                            <button className="btn btn-primary" onClick={sendReminderAllFun} disabled={campDetails.camp_user_no_for == campDetails.completedCount}>Send Reminder to all</button>
                                                            <button className="btn btn-repet_btn_end" onClick={endCampaignFun}>End Campaign</button>
                                                            <button className="btn btn-nobgtxt" onClick={seeParticipants}>See Participants</button>
                                                        </div>
                                                    </>
                                                    :
                                                    <>

                                                    </>
                                            }

                                            {
                                                campDetails.status == 3 ?
                                                    <>
                                                        <div className="camp_dtl_btns">
                                                            {
                                                                campDetails.camp_user_no_for == campDetails.completedCount ?
                                                                    <button className="btn btn-primary" onClick={reportDownload}>Download Report</button>
                                                                    : null

                                                            }

                                                            <button className="btn btn-repet_btn" data-bs-toggle="collapse" data-bs-target="#myCollapse" disabled={!isDisable || isexpired == 1} onClick={getOnboardingDataOfCampaignFun} >Repeat Campaign</button>
                                                            <button className="btn btn-nobgtxt" onClick={seeParticipants}>See Participants</button>
                                                        </div>
                                                    </>
                                                    :
                                                    <>

                                                    </>
                                            }


                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </main>

            </div>
            <nav className="navbar navbar-expand navbar-light navbar-bg d-block">
                <div className="navbar-collapse collapse navright">
                    <LoggedLayout />
                </div>

            </nav>

            <NotificationContainer />

            <Modal show={showPopup} onHide={handlePopupClose}>
                <Modal.Header closeButton>
                    <Modal.Title>License expired</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ paddingLeft: "16px" }}>Your license is expire.</p>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={handlePopupClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={onCampDelete}>
                        Yes
                    </Button>
                </Modal.Footer> */}
            </Modal>
        </>
    )
}

export default CampaignDetails