//// ---------------- Campaign Component ------------------ ////
//Import files//
import React, { useEffect, useState } from 'react'
import LoggedLayout from './LoggedLayout'
import $ from 'jquery'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { getEmpListForCampaign, getOnboardingDataOfCampaign, campaignList, upSertCampaign, publishCampaign, deleteCampaign, getCampaignInitialSubDesc, checkLicence } from '../../../service/CampaignService';
import { getUserData, dateDifference, setData, showLoader, hideLoader, getUserRole } from '../../../service/Common';
import { LIMIT_ARRAY } from '../../../constant/constantValue';
import moment from 'moment';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
//Require Images//
const campemty = require('../../../assets/images/camp-emty.png');
const closeicon = require('../../../assets/images/close-icon.png');
const iicon = require('../../../assets/images/i-icon.png');
//Stateless Functional Component named campaign//
function Campaign() {
    /* Variables */
    let navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showPopup, setShowPopup] = useState(false);
    const handlePopupClose = () => setShowPopup(false);
    const handlePopupShow = () => setShowPopup(true);
    // ------------- Tab Change Variable ----------------//
    const [detailsTabChange, setDetailsTabChange] = React.useState({ showTab: true })
    const [audiencetabChange, setAudienceTabChange] = React.useState({ showTab: false })
    const [overviewtabChange, setOverviewTabChange] = React.useState({ showTab: false })
    ///For Details 
    const [campaignName, setCampaignName] = useState("")
    const [subjectName, setSubjectName] = useState("")
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [editorStateEdit, setEditorStateEdit] = useState(EditorState.createEmpty());
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    //Details Error 
    const [campaignNameErr, setCampaignNameErr] = useState(false)
    const [subjectNameErr, setSubjectNameErr] = useState(false)
    const [desErr, setDesErr] = useState(false)
    const [desLengthErr, setDesLengthErr] = useState(false)
    const [startDateErr, setStartDateErr] = useState(false)
    const [endDateErr, setEndDateErr] = useState(false)
    const [validDateErr, setValidDateErr] = useState(false)
    const [dateMinErr, setDateMinErr] = useState(false)
    const [dateMaxErr, setDateMaxErr] = useState(false)
    const [tempEmpList, setTempEmpList] = useState([])
    const [limit, setLimit] = useState("10");
    const [offset, setOffset] = useState("0");
    const [search, setSearch] = React.useState("");
    const [searchDate, setSearchDate] = React.useState("");
    const [limitArr, setLimitArr] = useState([]);
    const [limitArrCamp, setLimitArrcamp] = useState([]);
    const [licenseCount, setLicenseCount] = React.useState(0);
    const [licenseCountRemainingCount, setLicenseCountRemainingCount] = React.useState(0);
    const [licenseCountRemaining, setLicenseCountRemaining] = React.useState(0);
    const [licenseValidity, setLicenseValidity] = React.useState("");
    const [totalPage, setTotalPage] = useState(0);
    const [selectCount, setSelectCount] = useState(0);
    const [sortTypeAud, setSortTypeAud] = useState("")
    const [campEmpList, setCampEmpList] = useState([])
    const [limitCamp, setLimitCamp] = useState("10");
    const [offsetCamp, setOffsetCamp] = useState("0");
    const [searchCamp, setSearchCamp] = React.useState("");
    const [sortCamp, setSortCamp] = React.useState("");
    const [totalPageCamp, setTotalPageCamp] = useState(0);
    const [successMessage, setSuccessMessage] = useState("")
    const [validDate, setvalidDate] = useState(false)
    const [campaignId, setCampaignId] = React.useState("");
    const [myArray, setMyArray] = useState([]);
    const [myArrayErr, setMyArrayErr] = useState(false)
    const [campaignDtlId, setCampaignDtlId] = useState("")
    const [campDetailsId, setCampDetailsId] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [startDtSort, setStartDtSort] = useState("")
    const [endDtSort, setEndDtSort] = useState("")
    const [statusSort, setStatusSort] = useState("")
    const [totalCount, setTotalCount] = useState(0);
    const [isexpired, setIsexpired] = useState(0)
    const [canEdit, SetCanEdit] = React.useState(false)
    const [subComNameError, setSubComNameError] = useState(false)
    const [desComNameError, setDesComNameError] = useState(false)
    // Request variable //
    var reqData = {
        "userId": getUserData().response.userId,
        "orgId": getUserData().response.orgn_id,
        "limit": limit,
        "offset": offset + "",
        "searchUserName": search,
        "searchCreatedAt": searchDate,
        "sortType": sortTypeAud
    }
    // Date variable //
    var todayDate = new Date().toISOString().slice(0, 10);
    // Request variable //
    var listData = {
        "userId": getUserData().response.userId,
        "orgId": getUserData().response.orgn_id,
        "limit": limitCamp,
        "offset": offsetCamp + "",
        "searchCampName": searchCamp,
        "sort": sortCamp
    }
    /* Functions */
    //------------------UseEffect-----------------//
    // For Employee
    useEffect(() => {
        getEmpListForCampaignFun(reqData)
        setLimitArr(LIMIT_ARRAY)
    }, [limit, offset, searchDate, sortTypeAud])
    // For Campaign
    useEffect(() => {
        campaignListFun(listData)
        setLimitArrcamp(LIMIT_ARRAY)
    }, [limitCamp, offsetCamp, sortCamp])
    // For All
    useEffect(() => {
        var role = getUserRole("Campaign")
        if (role) {
            if (role.can_edit == 1) {
                SetCanEdit(true)
            }
        }
        checkLicenceFun()
    }, [])
    // For MyArray
    useEffect(() => {
        setSelectCount(myArray.length)
    }, [myArray])
    //-------------- callback functions -------------//
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

    var firstTimeLoad = true

    const campaignListFun = (listData) => {
        showLoader()
        campaignList(listData).then(result => {


            hideLoader()
            setCampEmpList(result.data.response.campList)
            setTotalCount(result.data.response.campCount)
            if (result.data.response.campCount) {
                let totalPage = Math.ceil(result.data.response.campCount / limitCamp);
                setTotalPageCamp(totalPage);

            }
        })
    }
    const getOnboardingDataOfCampaignFun = () => {

        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
        }
        showLoader()
        getOnboardingDataOfCampaign(data).then(result => {
            hideLoader()
            if (result.data.success) {
                // console.log("Boring", result.data.response)
                setLicenseValidity(result.data.response.licenceData.validityenddate)
                setLicenseCount(result.data.response.totalLicenceCount)
                setLicenseCountRemainingCount(result.data.response.totalLicenceCount - result.data.response.remainingLicenceCount)
                setLicenseCountRemaining(result.data.response.remainingLicenceCount)
            }
        })


    }
    const getCampaignInitialSubDescFun = () => {
        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
        }
        setMyArray([])
        setTempEmpList([])
        showLoader()
        getCampaignInitialSubDesc(data).then(result => {
            hideLoader()
            if (result.data.success) {
                console.log("result", result)
                setSubjectName(result.data.response.subject)
                const contentBlock = htmlToDraft(result.data.response.description);
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorStates = EditorState.createWithContent(contentState);
                setEditorState(editorStates)
            }
        })
    }
    const closeBtn = () => {
        showLoader()
        campaignListFun(listData)
        setTempEmpList([])

        setDetailsTabChange({ ...detailsTabChange, showTab: true });
        setAudienceTabChange({ ...audiencetabChange, showTab: false });
        setOverviewTabChange({ ...overviewtabChange, showTab: false });

        // setSelectIdErr(false)
        setMyArrayErr(false)

        setCampaignName("")
        setSubjectName("")
        setEditorState(EditorState.createEmpty())
        setStartDate("")
        setEndDate("")
        setCampaignNameErr(false)
        setSubjectNameErr(false)
        setDesErr(false)
        setDesLengthErr(false)
        setStartDateErr(false)
        setEndDateErr(false)


        setTimeout(() => {
            hideLoader()
            $("#details_t-tab").click();
        }, 1000);


    }
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    };
    const editDetailsFun = () => {
        $("#details_t-tab").click();
        setDetailsTabChange({ ...detailsTabChange, showTab: true });
        setAudienceTabChange({ ...audiencetabChange, showTab: false });
        setOverviewTabChange({ ...overviewtabChange, showTab: false });
    }
    const editAudienceFun = () => {
        $("#audience_t-tab").click();
        setDetailsTabChange({ ...detailsTabChange, showTab: false });
        setAudienceTabChange({ ...audiencetabChange, showTab: true });
        setOverviewTabChange({ ...overviewtabChange, showTab: false });
    }
    const editMessageFun = () => {
        $("#details_t-tab").click();
        setDetailsTabChange({ ...detailsTabChange, showTab: true });
        setAudienceTabChange({ ...audiencetabChange, showTab: false });
        setOverviewTabChange({ ...overviewtabChange, showTab: false });
    }
    const getEmpListForCampaignFun = (reqData) => {
        if (campDetailsId !== '' && campDetailsId !== null) {
            reqData["campaignDtlId"] = campDetailsId;
            reqData["campaignId"] = campaignId;
        }
        showLoader()
        getEmpListForCampaign(reqData).then(result => {
            hideLoader()
            if (result.data.success) {
                for (let obj of result.data.response.empList) {
                    for (let val of myArray) {
                        if (obj.id == val.empId) {
                            obj.isChecked = true
                        }
                    }
                }
                setTempEmpList(result.data.response.empList)
                if (offset == 0) {
                    let totalPage = Math.ceil(result.data.response.empCount / limit);
                    setTotalPage(totalPage);
                }
            }
        })
    }
    function pageLimitChange(e) {
        setLimit(e.target.value);
    }
    function pageLimitChangeCamp(e) {
        setLimitCamp(e.target.value);
    }
    const handleChange = (e) => {
        const { name, checked, value } = e.target;
        if (name === "allSelect") {
            let tempUser = tempEmpList.map((user) => {
                return { ...user, isChecked: checked };
            });
            setTempEmpList(tempUser)
            if (checked) {
                for (let val of tempUser) {
                    var flag = 0
                    for (let data of myArray) {
                        if (data.empId == val.id) {
                            flag = 1
                        }
                    }
                    if (flag == 0) {
                        setMyArray(myArray => [...myArray, { "empId": Number(val.id) }])
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
                user.id == name ? { ...user, isChecked: checked } : user
            );
            setTempEmpList(tempUser)
            if (checked) {
                var flag = 0
                for (let data of myArray) {
                    if (data.empId == name) {
                        flag = 1
                    }
                }
                if (flag == 0) {
                    setMyArray(myArray => [...myArray, { "empId": Number(value) }])
                }
            }
            if (!checked) {
                for (let i = 0; i < myArray.length; i++) {
                    if (myArray[i].empId == name) {
                        myArray.splice(i, 1);
                        i--;
                    }
                }
                setMyArray(myArray => [...myArray]);
            }
        }
    };
    const handleKeyPress = () => {
        if (search.length >= '2') {
            getEmpListForCampaignFun(reqData)
        }
        if (search.length == '0') {
            getEmpListForCampaignFun(reqData)
        }
    }
    const handleChangePage = (e, val) => {
        let offeset = (val - 1) * limit;
        setOffset(offeset);
    };
    const handleChangePageCamp = (e, val) => {
        let offeset = (val - 1) * limitCamp;
        setOffsetCamp(offeset);
    };
    // DETAILS TAB SAVE AND EXIT BUTTON FUNCTION
    const saveAndExitDetails = () => {
        setCampaignNameErr(false)
        setSubjectNameErr(false)
        setDesErr(false)
        setDesLengthErr(false)
        setStartDateErr(false)
        setEndDateErr(false)
        setvalidDate(false)
        setValidDateErr(false)
        setDateMinErr(false)
        setDateMaxErr(false)
        setMyArrayErr(false)
        setSubComNameError(false)
        setDesComNameError(false)

        const hasText = editorState.getCurrentContent().hasText()
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');



        var err = 0

        if (campaignName.trim() == '') {
            setCampaignNameErr(true)
            err++
        }

        if (subjectName.trim() == '') {
            setSubjectNameErr(true)
            err++
        }

        // if (!subjectName.trim().includes(getUserData().response.organisation_name)) {
        //     setSubComNameError(true)
        //     err++
        // }

        if (!hasText) {
            setDesErr(true)
            err++
        } else if (value.length > 2000) {
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
            "userId": getUserData().response.userId + "",
            "orgId": getUserData().response.orgn_id + "",
            "campaignName": campaignName + "",
            "campSubject": subjectName + "",
            "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
            "campStartDate": moment(startDate).format('yyyy-MM-DD') + "",
            "campEndDate": moment(endDate).format('yyyy-MM-DD') + "",
            "campAudience": myArray,
            "createType": "1"
        }


        if (err == 0) {
            console.log(data)
            showLoader()
            upSertCampaign(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    campaignListFun(listData)
                    setTempEmpList([])
                    setDetailsTabChange({ ...detailsTabChange, showTab: true });
                    setAudienceTabChange({ ...audiencetabChange, showTab: false });
                    setOverviewTabChange({ ...overviewtabChange, showTab: false });
                    setMyArrayErr(false)
                    setTimeout(() => {
                        $("#closeBtn").get(0).click()
                        $("#details_t-tab").click();
                        setTempEmpList([])
                        setCampaignName("")
                        setSubjectName("")
                        setEditorState(EditorState.createEmpty())
                        setStartDate("")
                        setEndDate("")
                        setCampaignNameErr(false)
                        setSubjectNameErr(false)
                        setDesErr(false)
                        setDesLengthErr(false)
                        setStartDateErr(false)
                        setEndDateErr(false)
                        setvalidDate(false)
                        setValidDateErr(false)
                        setDateMinErr(false)
                        setDateMaxErr(false)
                    }, 100);
                } else {
                    NotificationManager.error(result.data.message);
                }
            })
        }
    }
    // DETAILS TAB NEXT BUTTON FUNCTION
    const detailsNextBtnFun = () => {
        setCampaignNameErr(false)
        setSubjectNameErr(false)
        setDesErr(false)
        setDesLengthErr(false)
        setStartDateErr(false)
        setEndDateErr(false)
        setvalidDate(false)
        setValidDateErr(false)
        setDateMinErr(false)
        setDateMaxErr(false)
        setMyArrayErr(false)
        setSubComNameError(false)
        setDesComNameError(false)

        var err = 0

        if (campaignName.trim() == '') {
            setCampaignNameErr(true)
            err++
        }

        if (subjectName.trim() == '') {
            setSubjectNameErr(true)
            err++
        }

        // if (!subjectName.trim().includes(getUserData().response.organisation_name)) {
        //     setSubComNameError(true)
        //     err++
        // }

        const hasText = editorState.getCurrentContent().hasText()
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');


        if (!hasText) {
            setDesErr(true)
            err++
        } else if (value.length > 2000) {
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
            "userId": getUserData().response.userId + "",
            "orgId": getUserData().response.orgn_id + "",
            "campaignName": campaignName + "",
            "campSubject": subjectName + "",
            "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
            "campStartDate": moment(startDate).format('yyyy-MM-DD') + "",
            "campEndDate": moment(endDate).format('yyyy-MM-DD') + "",
            "campAudience": myArray,
            "createType": "1",
            "campaignDtlId": campDetailsId
        }

        if (campDetailsId !== '' && campDetailsId !== null) {
            data["campaignDtlId"] = campDetailsId;
            data["campaignId"] = campaignId;

        }

        if (err == 0) {

            console.log("data", data)
            showLoader()
            upSertCampaign(data).then(result => {
                hideLoader()
                if (result.data.success) {

                    setCampaignId(result.data.response.campaignId)
                    setCampDetailsId(result.data.response.campaignDtlId)

                    setAudienceTabChange({ ...audiencetabChange, showTab: true });
                    getEmpListForCampaignFun(reqData)
                    setTimeout(() => {
                        $("#audience_t-tab").click();
                    }, 100);
                } else {
                    NotificationManager.error(result.data.message);
                }
            })
        }

    }
    // AUDIENCE SAVE AND EXIT BUTTON FUNCTION
    const saveAndExitFun = () => {
        setMyArrayErr(false)
        var err = 0
        if (myArray.length == 0) {
            setMyArrayErr(true)
            NotificationManager.error("Please select audience");
            err++
        }
        if (licenseCountRemaining < myArray.length) {
            NotificationManager.error("Sufficient license not available");
            err++
        }
        var data = {
            "campaignId": campaignId,
            "campaignDtlId": campDetailsId,
            "userId": getUserData().response.userId + "",
            "orgId": getUserData().response.orgn_id + "",
            "campaignName": campaignName + "",
            "campSubject": subjectName + "",
            "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
            "campStartDate": moment(startDate).format('yyyy-MM-DD') + "",
            "campEndDate": moment(endDate).format('yyyy-MM-DD') + "",
            "campAudience": myArray,
            "createType": "1"
        }

        console.log("data", data)




        if (err == 0) {

            showLoader()
            upSertCampaign(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    campaignListFun(listData)
                    setTempEmpList([])
                    setDetailsTabChange({ ...detailsTabChange, showTab: true });
                    setAudienceTabChange({ ...audiencetabChange, showTab: false });
                    setOverviewTabChange({ ...overviewtabChange, showTab: false });
                    setMyArrayErr(false)
                    setTimeout(() => {
                        $("#closeBtn").get(0).click()
                        $("#details_t-tab").click();
                        setTempEmpList([])
                        setCampaignName("")
                        setSubjectName("")
                        setEditorState(EditorState.createEmpty())
                        setStartDate("")
                        setEndDate("")
                        setCampaignNameErr(false)
                        setSubjectNameErr(false)
                        setDesErr(false)
                        setDesLengthErr(false)
                        setStartDateErr(false)
                        setEndDateErr(false)
                    }, 100);
                } else {
                    NotificationManager.error(result.data.message);
                }

            })
        }


    }
    // AUDIENCE TAB NEXT BUTTON FUNCTION
    const audienceNextBtnFun = () => {
        var err = 0
        if (myArray.length == 0) {
            setMyArrayErr(true)
            NotificationManager.error("Please select audience");
            err++
        }
        if (licenseCountRemaining < myArray.length) {
            NotificationManager.error("Sufficient license not available");
            err++
        }
        if (err == 0) {
            showLoader()
            setOverviewTabChange({ ...overviewtabChange, showTab: true });
            setTimeout(() => {
                hideLoader()
                $("#overview_t-tab").click();
            }, 100);
        }
    }
    // LAUNCH CAPMAIGN BUTTON FUNCTION
    const launchCampaign = () => {
        var err = 0
        if (myArray.length == 0) {
            setMyArrayErr(false)
            err++
        }
        if (licenseCountRemaining < myArray.length) {
            NotificationManager.error("Succsifient license not avaliable");
            err++
        }
        var data = {
            "campaignId": campaignId,
            "campaignDtlId": campDetailsId,
            "userId": getUserData().response.userId + "",
            "orgId": getUserData().response.orgn_id + "",
            "campaignName": campaignName + "",
            "campSubject": subjectName + "",
            "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
            "campStartDate": moment(startDate).format('yyyy-MM-DD') + "",
            "campEndDate": moment(endDate).format('yyyy-MM-DD') + "",
            "campAudience": myArray,
            "createType": "2"
        }

        if (err == 0) {
            showLoader()
            upSertCampaign(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    setSuccessMessage(result.data.message)
                    setDetailsTabChange({ ...detailsTabChange, showTab: false });
                    setAudienceTabChange({ ...audiencetabChange, showTab: false });
                    setOverviewTabChange({ ...overviewtabChange, showTab: true });
                    setIsSuccess(true)
                    publishCampaignFun()
                } else {
                    setIsSuccess(false)
                    NotificationManager.error(result.data.message);
                }

            })
        }
    }
    // PUBLISH CAMPAIGN FUNCTION
    const publishCampaignFun = () => {
        var data = {
            "campaignId": campDetailsId,
            "userId": getUserData().response.userId + "",
            "orgId": getUserData().response.orgn_id + "",
        }

        publishCampaign(data).then(result => {
            if (result.data.success) {
                NotificationManager.success(result.data.message);
            }
        })

    }
    // GO TO DASHBOARD FUNCTION
    const goDash = () => {
        showLoader()
        campaignListFun(listData)
        setTempEmpList([])
        setDetailsTabChange({ ...detailsTabChange, showTab: true });
        setAudienceTabChange({ ...audiencetabChange, showTab: false });
        setOverviewTabChange({ ...overviewtabChange, showTab: false });

        // setSelectIdErr(false)
        setMyArrayErr(false)
        setIsSuccess(false)
        setTimeout(() => {
            $("#closeBtn").get(0).click()
            $("#details_t-tab").click();
            setTempEmpList([])
            setCampaignName("")
            setSubjectName("")
            setEditorState(EditorState.createEmpty())
            setStartDate("")
            setEndDate("")
            setCampaignNameErr(false)
            setSubjectNameErr(false)
            setDesErr(false)
            setDesLengthErr(false)
            setStartDateErr(false)
            setEndDateErr(false)
            setCampDetailsId("")
            setCampaignId("")
            hideLoader()
        }, 100);

    }
    const gotoCampaignDetails = (data) => {
        console.log(data)
        navigate("/users/campaigndetails/" + data.campaigndtlid)
    }
    const handleKeyPressCamp = () => {
        if (searchCamp.length >= '2') {
            campaignListFun(listData)
        }
        if (searchCamp.length == '0') {
            campaignListFun(listData)
        }
    }
    const onCampDelete = () => {
        var data = {
            "campaignDtlId": campaignDtlId,
            "userId": getUserData().response.userId + "",
            "orgId": getUserData().response.orgn_id + "",
        }
        showLoader()
        deleteCampaign(data).then(result => {
            hideLoader()
            if (result.data.success) {
                NotificationManager.success(result.data.message);
                campaignListFun(listData)
                handleClose()
                setCampaignDtlId("")
            }
        })

    }
    const gotoDetailsEdit = (data) => {
        navigate("/users/campaignedit")
        setData(data)
    }
    const onChangeFilter = (type) => {
        console.log("type", type)
        if (type == "start_date") {
            if (startDtSort == "desc") {
                campEmpList.sort((a, b) => {
                    return a.campStartDate > b.campStartDate ? 1 : -1
                })
                setCampEmpList(campEmpList)
                setStartDtSort("asc")
            } else {
                campEmpList.sort((a, b) => {
                    return a.campStartDate < b.campStartDate ? 1 : -1
                })
                setCampEmpList(campEmpList)
                setStartDtSort("desc")
            }

        } else if (type == "end_date") {
            if (endDtSort == "desc") {
                campEmpList.sort((a, b) => {
                    return a.campEndDate > b.campEndDate ? 1 : -1
                })
                setCampEmpList(campEmpList)
                setEndDtSort("asc")
            } else {
                campEmpList.sort((a, b) => {
                    return a.campEndDate < b.campEndDate ? 1 : -1
                })
                setCampEmpList(campEmpList)
                setEndDtSort("desc")
            }
        } else if (type == "status") {
            if (statusSort == "desc") {
                campEmpList.sort((a, b) => {
                    return a.status > b.status ? 1 : -1
                })
                setCampEmpList(campEmpList)
                setStatusSort("asc")
            } else {
                campEmpList.sort((a, b) => {
                    return a.status < b.status ? 1 : -1
                })
                setCampEmpList(campEmpList)
                setStatusSort("desc")
            }
        }
    }

    const onChangeCampaignName = (val) => {
        if (val.trim() == '') {
            setCampaignNameErr(true)
        } else {
            setCampaignNameErr(false)
        }
    }

    const onChangeCampaignSubject = (val) => {
        if (val.trim() == '') {
            setSubjectNameErr(true)
        } else {
            setSubjectNameErr(false)
        }
    }


    const onChangeCampaignStartDate = (val) => {

        if (val == '') {
            setStartDateErr(true)
        } else {
            setStartDateErr(false)
        }

    }

    const onChangeCampaignEndDate = (val) => {
        if (val == '') {
            setEndDateErr(true)
        } else {
            setEndDateErr(false)
        }

        if (val && startDate > val) {
            setvalidDate(true)
        } else if (startDate && val && !validDate && val > licenseValidity) {
            setValidDateErr(true)
        } else if (startDate && val && startDate == val) {
            setDateMinErr(true)
        } else if (startDate && val && dateDifference(startDate, val, 60)) {
            setDateMaxErr(true)
        } else {
            setvalidDate(false)
            setValidDateErr(false)
            setDateMinErr(false)
            setDateMaxErr(false)
        }
    }


    return (
        <>
            <div className="main">

                <main className="content">

                    <div className="container-fluid p-0 position-relative">

                        {/* CREATE CAMPAIGN */}
                        <div className="bulk_upl_po collapse" id="myCollapse">
                            <a
                                onClick={closeBtn}
                                id="closeBtn"
                                href="#myCollapse"
                                data-bs-toggle="collapse"
                                className="close_btn_addemp">
                                <img src={closeicon}
                                />
                            </a>
                            <div className="bulk_upl_po_bd">
                                <h3>Create New Campaign</h3>
                                <div className="addcompny_tab addemploy_tab">

                                    {/* TAB */}
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
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

                                                {/* DETAILS */}
                                                <div className="tab-pane fade show active" id="uplodfile_t" role="tabpanel"
                                                    aria-labelledby="uplodfile_t-tab">

                                                    <div className="creat_camp_div">
                                                        <div className="creat_camp_div_top">
                                                            <span className="camp_div_nbm">1</span>
                                                            <strong>Campaign Details</strong>
                                                        </div>
                                                        <div className="creat_camp_div_blo">
                                                            <div className="subjectCampaign">
                                                                <div className="creat_camp_div_top">
                                                                    <label>Campaign Name </label>
                                                                    <a className='camp_a_tag'>
                                                                        <img src={iicon} />
                                                                        <div className="inf_hov_dv">
                                                                            <p>The name of the campaign is important. You can select a unique
                                                                                name every time. Name it by the department and/or date to make it stand out.
                                                                            </p>
                                                                        </div>
                                                                    </a>

                                                                </div>
                                                                <input
                                                                    className={`form-control ${campaignNameErr ? "error-fil" : ""}`}
                                                                    type="text"
                                                                    placeholder="Enter the campaign name"
                                                                    value={campaignName}
                                                                    onChange={(e) => { setCampaignName(e.target.value); onChangeCampaignName(e.target.value) }}

                                                                />
                                                                {campaignNameErr ? <span className='errorfiled'>Enter the campaign name</span> : null}
                                                            </div>
                                                            <div className="subjectCampaign mt-5">
                                                                <div className="creat_camp_div_top">
                                                                    <label>Subject </label>
                                                                    <a className='camp_a_tag'>
                                                                        <img src={iicon} />
                                                                        <div className="inf_hov_dv">
                                                                            <p>You can use a catchy phrase to grab the participant's attention. Highlight any
                                                                                incentive that may be redeemed upon completion. For e.g. ‘Complete this health
                                                                                campaign for a chance to get a day off from work!’
                                                                            </p>
                                                                        </div>
                                                                    </a>
                                                                </div>
                                                                <input
                                                                    className={`form-control ${subjectNameErr || subComNameError ? "error-fil" : ""}`}
                                                                    type="text"
                                                                    placeholder="Enter the subject name"
                                                                    value={subjectName}
                                                                    onChange={(e) => { setSubjectName(e.target.value); onChangeCampaignSubject(e.target.value) }}
                                                                />
                                                                {
                                                                    subjectNameErr ? <span className='errorfiled'>Enter the subject name</span> : null
                                                                }
                                                                {
                                                                    subComNameError ? <span className='errorfiled'>Enter the company name</span> : null
                                                                }
                                                            </div>

                                                            <div className="descriptionCampaign mt-5">
                                                                <div className="creat_camp_div_top">
                                                                    <label>Description </label>
                                                                    <a className='camp_a_tag'>
                                                                        <img src={iicon} />
                                                                        <div className="inf_hov_dv">
                                                                            <p>A standard description is given below. You may edit based on your
                                                                                preference for the formal/informal tone of the message and add any information as
                                                                                needed. </p>
                                                                        </div>
                                                                    </a>
                                                                </div>
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
                                                            <a >
                                                                <img src={iicon} />
                                                                <div className="inf_hov_dv">
                                                                    <p>The start & end date will decide the total number of days the campaign shall remain active. We suggest you keep it for at least a month to let most people participate
                                                                        in the campaign at their own pace. </p>
                                                                </div>
                                                            </a>
                                                        </div>
                                                        <div className="creat_camp_div_blo std_end">
                                                            <div>
                                                                <label>Start Date </label>
                                                                <input
                                                                    className={`form-control ${startDateErr ? "error-fil" : ""}`}
                                                                    type="date"
                                                                    min={todayDate}
                                                                    value={startDate}
                                                                    onChange={(e) => { setStartDate(e.target.value); onChangeCampaignStartDate(e.target.value) }}
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
                                                                    min={todayDate}
                                                                    value={endDate}
                                                                    onChange={(e) => { setEndDate(e.target.value); onChangeCampaignEndDate(e.target.value) }}
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

                                                    <div className="suprt_btne mt-4">
                                                        <span className="support_btn"></span>
                                                        <div className="btn_edit">
                                                            <button className="btn btn-nobg btn-witbord" onClick={saveAndExitDetails}>Save and Exit</button>
                                                            <button className="btn btn-primary" disabled={!canEdit} onClick={detailsNextBtnFun}>Next</button>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* AUDIENCE */}
                                                <div className="tab-pane fade" id="repir_t" role="tabpanel"
                                                    aria-labelledby="repir_t-tab">
                                                    <div className="creat_camp_div creat_camp_pgn">
                                                        <div className="creat_camp_div_top">
                                                            <span className="camp_div_nbm">3</span>
                                                            <strong>Select Participants</strong>
                                                        </div>
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
                                                                <span> per page</span>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="actvt_cams">{selectCount} active participants selected | {licenseCountRemainingCount} License used
                                                        out of {licenseCount} </p>

                                                    <div className="list_of_tabl camp_tabl">
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
                                                                    <button className="btn"><i
                                                                        className="bi bi-search"></i></button>
                                                                </div>

                                                                <div className="d-inline-block src_fld">
                                                                    <label>Sort by Import Date</label>
                                                                    <div className="form-group">
                                                                        <select
                                                                            id="selectinput1"
                                                                            className="form-select"
                                                                            value={sortTypeAud}
                                                                            onChange={(e) => setSortTypeAud(e.target.value)}
                                                                        >
                                                                            <option value="">Select</option>
                                                                            <option value="dateasc">Date by Ascending</option>
                                                                            <option value="datedesc">Date by Descending</option>
                                                                        </select>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="table-responsive">
                                                            <table className="table">
                                                                <thead>
                                                                    <tr role="row">
                                                                        <th align="center" style={{ textAlign: "center" }}>
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
                                                                        <th align="left">Import Date</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody >
                                                                    {tempEmpList.length > 0 ?
                                                                        <>
                                                                            {
                                                                                tempEmpList.map((item, i) => (

                                                                                    <tr role="row" key={i}>
                                                                                        <td align="center">
                                                                                            <div className="form-check">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className={`form-check-input ${myArrayErr ? "error-fil" : ""}`}
                                                                                                    name={item.id}
                                                                                                    checked={item?.isChecked || false}
                                                                                                    value={item.id}
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
                                                                                    <div className="camp_empty_st">
                                                                                        <img src={campemty} />
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
                                                            <button className="btn btn-nobg btn-witbord" onClick={saveAndExitFun} disabled={licenseCountRemaining == 0 || licenseCount == 0}>Save and Exit</button>
                                                            <button className="btn btn-primary" onClick={audienceNextBtnFun} disabled={licenseCountRemaining == 0 || licenseCount == 0 || !canEdit} >Next</button>
                                                        </div>
                                                    </div>

                                                    <div className="bulk_pagi paginati">
                                                        <Stack spacing={2}>
                                                            <Pagination count={totalPage} shape="rounded" onChange={(e, value) => handleChangePage(e, value)} />
                                                        </Stack>
                                                    </div>

                                                </div>

                                                {/* OVERVIEW */}
                                                <div className="tab-pane fade" id="privcyimpo_t" role="tabpanel"
                                                    aria-labelledby="privcyimpo_t-tab">
                                                    {
                                                        isSuccess ?
                                                            <>
                                                                <div className="sucs_dive">
                                                                    <p>&nbsp;</p>
                                                                    <span>
                                                                        <i
                                                                            className="bi bi-check-circle-fill">
                                                                        </i>
                                                                    </span>
                                                                    <strong>Success!</strong>
                                                                    <p>{successMessage}</p>
                                                                    <button className="btn btn-primary" onClick={goDash}>Go to Dashboard</button>
                                                                    <p>&nbsp;</p>
                                                                    <p>&nbsp;</p>
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                                <div className="comprese_div_main">
                                                                    <div className="comprese_div">
                                                                        <div className="comprese_div_top">
                                                                            <strong>Your campaign is ready to be launched !</strong>
                                                                            <p>Review the details below before launching the campaign
                                                                            </p>
                                                                        </div>
                                                                        <div className="comprese_div_mid">
                                                                            <p>
                                                                                <span>Campaign Info</span>
                                                                                <a className='a_tag' onClick={editDetailsFun}>Edit Info Details</a>
                                                                            </p>


                                                                            <ul>
                                                                                <li>
                                                                                    <span>Campaign Name: </span>
                                                                                    <strong>{campaignName}</strong>
                                                                                </li>
                                                                                <li>
                                                                                    <span>Start Date : </span>
                                                                                    <strong>{moment(startDate).format('DD-MM-YYYY')}</strong>
                                                                                </li>
                                                                                <li>
                                                                                    <span>End Date : </span>
                                                                                    <strong>{moment(endDate).format('DD-MM-YYYY')}</strong>
                                                                                </li>
                                                                            </ul>

                                                                        </div>
                                                                        <div className="comprese_div_mid">
                                                                            <p>
                                                                                <span>Audience</span>
                                                                                <a className='a_tag' onClick={editAudienceFun}>Edit Audience Details</a>
                                                                            </p>

                                                                            <ul>
                                                                                <li>
                                                                                    <span>No of audience : </span>
                                                                                    <strong>{selectCount}</strong>
                                                                                </li>
                                                                                <li>
                                                                                    <span>Types of audience : </span>
                                                                                    <strong></strong>
                                                                                </li>
                                                                            </ul>

                                                                        </div>
                                                                        <div className="comprese_div_mid">
                                                                            <p>
                                                                                <span>Message</span>
                                                                                <a className='a_tag' onClick={editMessageFun}>Edit Message</a>
                                                                            </p>

                                                                            <ul>
                                                                                <li>
                                                                                    <span>Subject : </span>
                                                                                    <strong>{subjectName}</strong>
                                                                                </li>
                                                                                <li>
                                                                                    <span>Description : </span>
                                                                                    <div className="editor_div_camp editor_cls" dangerouslySetInnerHTML={{ __html: draftToHtml(convertToRaw(editorState.getCurrentContent())) }} />

                                                                                </li>
                                                                            </ul>

                                                                        </div>
                                                                    </div>

                                                                    <div className="launch_dive">
                                                                        <button
                                                                            className="btn btn-primary"
                                                                            // data-bs-toggle="collapse"
                                                                            // data-bs-target="#collapseExample"
                                                                            // aria-controls="collapseExample"
                                                                            onClick={launchCampaign}
                                                                        >
                                                                            Launch Campaign
                                                                        </button>

                                                                    </div>
                                                                </div>

                                                            </>

                                                    }





                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>


                        {/* CAMPAIGN */}
                        <div className="addemplo collapse show" id="myCollapse">
                            <div className="row mb-2 mb-lg-4">
                                <div className="col-md-12 d-lg-flex align-items-center main-hdng">
                                    <div className="col-md-6">
                                        <h3 className="compaign-add">Campaign</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4 mb-4">
                                <div className="col-md-12 d-lg-flex align-items-center hdng-btm campng_pge">
                                    <div className="d-inline-block src_dv">
                                        <label>Search</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder=""
                                            onChange={(e) => {
                                                setSearchCamp(e.target.value)
                                            }}
                                            onKeyUp={handleKeyPressCamp}
                                        />
                                        <button className="btn"><i className="bi bi-search"></i></button>
                                    </div>
                                    <div className="d-inline-block src_fld">
                                        <label>Sort</label>
                                        <div className="form-group">
                                            <select
                                                id="selectinput1"
                                                className="form-select"
                                                value={sortCamp}
                                                onChange={(e) => { setSortCamp(e.target.value) }}
                                            >
                                                <option value="">All</option>
                                                <option value="alpha">Alphabet</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="d-inline-block add_btn">
                                        <label>&nbsp;</label>
                                        <button
                                            onClick={() => { getOnboardingDataOfCampaignFun(); getCampaignInitialSubDescFun() }}
                                            className="btn down_btn"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#myCollapse"
                                            disabled={isexpired == 1 || !canEdit}
                                        >
                                            <i className="bi bi-plus"></i>
                                            Create a Campaign
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="bg-white shadow_d pt-4 px-0 rounded-3 table_employee">
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr role="row">
                                                        <th align="center">Sl.No.</th>
                                                        <th align="left">Campaign Name</th>
                                                        <th className={`sortable ${startDtSort == "desc" ? "desc" : "asc"}`} align="left" style={{ cursor: "pointer" }} onClick={() => { onChangeFilter("start_date") }}>Start Date</th>
                                                        <th className={`sortable ${endDtSort == "desc" ? "desc" : "asc"}`} align="left" style={{ cursor: "pointer" }} onClick={() => { onChangeFilter("end_date") }}>End Date</th>
                                                        <th className={`sortable ${statusSort == "desc" ? "desc" : "asc"}`} align="center" style={{ textAlign: "center", cursor: "pointer" }} onClick={() => { onChangeFilter("status") }}>
                                                            Status</th>
                                                        <th align="center" style={{ textAlign: "center" }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {campEmpList.length > 0 ?
                                                        <>
                                                            {
                                                                campEmpList.map((item, i) => (

                                                                    <tr key={i} role="row">
                                                                        <td align="left">{i + 1}.</td>
                                                                        <td align="left" width="30%"><a onClick={() => { gotoCampaignDetails(item) }}>{item.campName}</a></td>
                                                                        <td align="left">{moment(item.campStartDate).format('DD-MM-YYYY')}</td>
                                                                        <td align="left">{moment(item.campEndDate).format('DD-MM-YYYY')}</td>

                                                                        <td align="center">
                                                                            {
                                                                                item.status == 0 ?
                                                                                    <>
                                                                                        <span className="spntxt text-pndng">Pending</span>
                                                                                    </>
                                                                                    :
                                                                                    <>

                                                                                    </>
                                                                            }
                                                                            {
                                                                                item.status == 1 ?
                                                                                    <>
                                                                                        <span className="spntxt text-scdul">Scheduled</span>
                                                                                    </>
                                                                                    :
                                                                                    <>

                                                                                    </>
                                                                            }
                                                                            {
                                                                                item.status == 2 ?
                                                                                    <>
                                                                                        <span className="spntxt text-inprocss">In Progress</span>
                                                                                    </>
                                                                                    :
                                                                                    <>

                                                                                    </>
                                                                            }
                                                                            {
                                                                                item.status == 3 ?
                                                                                    <>
                                                                                        <span className="spntxt text-cmplt">Completed</span>
                                                                                    </>
                                                                                    :
                                                                                    <>

                                                                                    </>
                                                                            }
                                                                        </td>
                                                                        <td align="center">
                                                                            {
                                                                                item.status == 0 || item.status == 1 ?
                                                                                    <>
                                                                                        <button
                                                                                            disabled={!canEdit}
                                                                                            onClick={() => gotoDetailsEdit(item)}
                                                                                            className="d-inline">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                                width="16" height="16" fill="currentColor"
                                                                                                className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                                                                <path
                                                                                                    d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                                                                            </svg>
                                                                                        </button>

                                                                                        <button
                                                                                            disabled={!canEdit}
                                                                                            onClick={() => { handleShow(); setCampaignDtlId(item.campaigndtlid) }}
                                                                                            className="d-inline ms-3"
                                                                                        >
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg" width="16"
                                                                                                height="16" fill="currentColor" className="bi bi-trash-fill"
                                                                                                viewBox="0 0 16 16">
                                                                                                <path
                                                                                                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    </>
                                                                                    :
                                                                                    null
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </>
                                                        :
                                                        <>
                                                            <tr role="row">
                                                                <td align="center" colSpan="6" style={{ border: "0" }}>
                                                                    <div className="camp_empty_st">
                                                                        <img src={campemty} />
                                                                        <strong>There are no data available here!</strong>
                                                                        <p>Start a new campaign now</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    }

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <p>&nbsp;</p>
                                    <div className="paginati">
                                        <div className="paginati_l">
                                            <div className="dataTables_length d-flex align-items-center"
                                                id="datatables-reponsive_length">
                                                <label>View </label>
                                                <select name="datatables-reponsive_length"
                                                    aria-controls="datatables-reponsive"
                                                    className="form-select form-select-sm" value={limitCamp} onChange={(e) => pageLimitChangeCamp(e)}>
                                                    {limitArrCamp.map((item, i) =>
                                                        <option value={item.value} key={i}>{item.label}</option>
                                                    )}
                                                </select>
                                                <span>Campaign <strong>per page</strong></span>
                                                <span style={{ paddingLeft: "20px" }}> Total Campaign <strong>{totalCount}</strong></span>
                                            </div>
                                        </div>
                                        <div className="paginati_r">
                                            <Stack spacing={2}>
                                                <Pagination count={totalPageCamp} shape="rounded" onChange={(e, value) => handleChangePageCamp(e, value)} />
                                            </Stack>
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
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Campaign</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ paddingLeft: "16px" }}>Are you want to delete this campaign?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={!canEdit} onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="primary" disabled={!canEdit} onClick={onCampDelete}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPopup} onHide={handlePopupClose}>
                <Modal.Header closeButton>
                    <Modal.Title>License expired</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ paddingLeft: "16px" }}>Your license is expire.</p>
                </Modal.Body>
            </Modal>
        </>


    )
}

export default Campaign