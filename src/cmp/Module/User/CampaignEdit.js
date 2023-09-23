//// ---------------- Campaign Edit Component ------------------ ////
//Import files//
import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import moment from 'moment';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { getUserData, getData, dateDifference, showLoader, hideLoader } from '../../../service/Common';
import { LIMIT_ARRAY } from '../../../constant/constantValue';
import { getEmpListForCampaign, campaignDetails, getOnboardingDataOfCampaign, upSertCampaign, upSertRepetCampaign, repetCampaignEmpList, publishCampaign } from '../../../service/CampaignService';
import { useNavigate, useParams } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import LoggedLayout from './LoggedLayout';
//Require Images//
const closeicon = require('../../../assets/images/close-icon.png');
const iicon = require('../../../assets/images/i-icon.png');
//Stateless Functional Component named campaign edit//
function CampaignEdit() {
    /* Variables */
    let navigate = useNavigate();
    // ------------- Tab Change Variable ----------------//
    const [detailsTabChange, setDetailsTabChange] = React.useState({ showTab: true })
    const [audiencetabChange, setAudienceTabChange] = React.useState({ showTab: false })
    const [overviewtabChange, setOverviewTabChange] = React.useState({ showTab: false })
    ///For Details Edit
    const [campaignNameEdit, setCampaignNameEdit] = useState("")
    const [subjectNameEdit, setSubjectNameEdit] = useState("")
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [startDateEdit, setStartDateEdit] = useState("")
    const [endDateEdit, setEndDateEdit] = useState("")
    //Details eidt Error 
    const [campaignNameEditErr, setCampaignNameEditErr] = useState(false)
    const [subjectNameEditErr, setSubjectNameEditErr] = useState(false)
    const [desEditErr, setDesEditErr] = useState(false)
    const [desLengthEditErr, setDesLengthEditErr] = useState(false)
    const [startDateEditErr, setStartDateEditErr] = useState(false)
    const [endDateEditErr, setEndDateEditErr] = useState(false)
    const [validDateErrr, setvalidDateErrr] = useState(false)
    const [validDateEditErr, setValidDateEditErr] = useState(false)
    const [dateMinEditErr, setDateMinEditErr] = useState(false)
    const [dateMaxEditErr, setDateMaxEditErr] = useState(false)
    var todayDate = new Date().toISOString().slice(0, 10);
    const [totalPage, setTotalPage] = useState(0);
    const [selectCount, setSelectCount] = useState(0);
    const [tempEmpList, setTempEmpList] = useState([])
    const [limit, setLimit] = useState("10");
    const [offset, setOffset] = useState("0");
    const [search, setSearch] = React.useState("");
    const [searchDate, setSearchDate] = React.useState("");
    const [limitArr, setLimitArr] = useState([]);
    const [licenseCount, setLicenseCount] = React.useState(0);
    const [licenseCountRemaining, setLicenseCountRemaining] = React.useState(0);
    const [licenseValidity, setLicenseValidity] = React.useState("");
    const [myArrayErr, setMyArrayErr] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [campDetails, setCampDetails] = useState({})
    const [cid, setCid] = useState("")
    const [isRepet, setIsRepet] = useState("")
    const [myArray, setMyArray] = useState([]);
    const [id, setId] = useState("")
    const [subComNameError, setSubComNameError] = useState(false)
    const [desComNameError, setDesComNameError] = useState(false)
    const [sortTypeAud, setSortTypeAud] = useState("")
    const [licenseCountRemainingCount, setLicenseCountRemainingCount] = React.useState(0);
    const [isSuccess, setIsSuccess] = useState(false)

    // Request variable //
    var reqData = {
        "campaignDtlId": cid,
        "campaignId": id,
        "userId": getUserData().response.userId,
        "orgId": getUserData().response.orgn_id,
        "limit": limit,
        "offset": offset + "",
        "searchUserName": search,
        "searchCreatedAt": searchDate,
        "sortType": sortTypeAud
    }
    /* Functions */
    //------------------UseEffect-----------------//
    useEffect(() => {
        if (!getData().campaigndtlid) {
            navigate("/users/campaign")
        } else {
            campaignDetailsFun(getData().campaigndtlid)
            setCid(getData().campaigndtlid)
            setIsRepet(getData().isRepet)
            setId(getData().id)
            getOnboardingDataOfCampaignFun()
        }
    }, [])
    //for employee
    useEffect(() => {
        if (getData().isRepet == 0) {
            getEmpListForCampaignFun(reqData)
            setLimitArr(LIMIT_ARRAY)
        }
        if (getData().isRepet == 1) {
            repetCampaignEmpListFun(reqData)
            setLimitArr(LIMIT_ARRAY)
        }
    }, [limit, offset, searchDate, sortTypeAud])
    //for MyArray
    useEffect(() => {
        setSelectCount(myArray.length)
    }, [myArray])
    //-------------- callback functions -------------//
    const campaignDetailsFun = (id) => {
        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "campaignDtlId": id
        }
        showLoader()
        campaignDetails(data).then(result => {
            hideLoader()
            if (result.data.success) {
                setCampDetails(result.data.response)
                setCampaignNameEdit(result.data.response.campaigndesc)
                setSubjectNameEdit(result.data.response.camp_subject)
                setStartDateEdit(moment(result.data.response.camp_start_datetime).format('yyyy-MM-DD'))
                setEndDateEdit(moment(result.data.response.camp_end_datetime).format('yyyy-MM-DD'))
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
            }

        })
    }
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
                setLicenseCountRemainingCount(result.data.response.totalLicenceCount - result.data.response.remainingLicenceCount)
            }
        })
    }
    function pageLimitChange(e) {
        setLimit(e.target.value);
    }
    const handleKeyPress = () => {
        if (isRepet == 0) {
            if (search.length >= '2') {
                getEmpListForCampaignFun(reqData)
            }
            if (search.length == '0') {
                getEmpListForCampaignFun(reqData)
            }
        }
        if (isRepet == 1) {
            if (search.length >= '2') {
                repetCampaignEmpListFun(reqData)
            }
            if (search.length == '0') {
                repetCampaignEmpListFun(reqData)
            }

        }
    }
    const getEmpListForCampaignFun = (reqData) => {
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
                if (campDetails.empList) {
                    for (let obj of result.data.response.empList) {
                        for (let val of campDetails.empList) {
                            if (obj.id == val) {

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
    const repetCampaignEmpListFun = (reqData) => {
        showLoader()
        repetCampaignEmpList(reqData).then(result => {
            hideLoader()
            if (result.data.success) {
                for (let obj of result.data.response.empList) {
                    for (let val of myArray) {
                        if (obj.id == val.empId) {
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
    const handleChange = (e) => {
        const { name, checked, value } = e.target;
        if (isRepet == 0) {
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
                        setMyArray([...myArray, { "empId": Number(value) }])
                    }
                }
                if (!checked) {
                    for (let i = 0; i < myArray.length; i++) {
                        if (myArray[i].empId == name) {
                            myArray.splice(i, 1);
                            i--;
                        }
                    }
                    setMyArray([...myArray]);
                }
            }
        }

        if (isRepet == 1) {
            if (name === "allSelect") {
                let tempUser = tempEmpList.map((user) => {
                    return { ...user, isChecked: checked };
                });
                setTempEmpList(tempUser)
                setMyArray([])
                if (checked) {
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
            }
            else {
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
                        setMyArray([...myArray, { "empId": Number(value), "emplicenceId": name !== null && name !== '' ? name : null }])
                    }
                }

                if (!checked) {
                    for (let i = 0; i < myArray.length; i++) {
                        if (myArray[i].empId == value) {
                            myArray.splice(i, 1);
                            i--;
                        }
                    }
                    setMyArray([...myArray]);
                }
            }
        }
    };
    const handleChangePage = (e, val) => {
        let offeset = (val - 1) * limit;
        setOffset(offeset);
    };
    const closeBtn = () => {
        navigate("/users/campaign")
    }
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    };
    // DETAILS TAB SAVE AND EXIT BUTTON FUNCTION
    const saveAndExitDetails = () => {
        setCampaignNameEditErr(false)
        setSubjectNameEditErr(false)
        setDesEditErr(false)
        setDesLengthEditErr(false)
        setStartDateEditErr(false)
        setEndDateEditErr(false)
        setvalidDateErrr(false)
        setValidDateEditErr(false)
        setDateMinEditErr(false)
        setDateMaxEditErr(false)
        setSubComNameError(false)
        setDesComNameError(false)
        const hasText = editorState.getCurrentContent().hasText()
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
        var err = 0
        if (campaignNameEdit.trim() == '') {
            setCampaignNameEditErr(true)
            err++
        }
        if (subjectNameEdit.trim() == '') {
            setSubjectNameEditErr(true)
            err++
        }
        // if (!subjectNameEdit.trim().includes(getUserData().response.organisation_name)) {
        //     setSubComNameError(true)
        //     err++
        // }
        if (!hasText) {
            setDesEditErr(true)
            err++
        } else if (value.length > 500) {
            setDesLengthEditErr(true)
            err++
        } else if (!value.includes(getUserData().response.organisation_name)) {
            setDesComNameError(true)
            err++
        }
        if (startDateEdit == '') {
            setStartDateEditErr(true)
            err++
        }
        if (endDateEdit == '') {
            setEndDateEditErr(true)
            err++
        }
        if (endDateEdit && startDateEdit > endDateEdit) {
            setvalidDateErrr(true)
            err++
        } else if (startDateEdit && endDateEdit && !validDateErrr && endDateEdit > licenseValidity) {
            setValidDateEditErr(true)
            err++
        } else if (startDateEdit && endDateEdit && startDateEdit == endDateEdit) {
            setDateMinEditErr(true)
            err++
        } else if (startDateEdit && endDateEdit && dateDifference(startDateEdit, endDateEdit, 60)) {
            setDateMaxEditErr(true)
            err++
        }
        if (err == 0) {
            if (isRepet == 0) {
                var data = {
                    "campaignId": campDetails.id,
                    "campaignDtlId": campDetails.campaigndtlid,
                    "userId": getUserData().response.userId + "",
                    "orgId": getUserData().response.orgn_id + "",
                    "campaignName": campaignNameEdit + "",
                    "campSubject": subjectNameEdit + "",
                    "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
                    "campStartDate": moment(startDateEdit).format('yyyy-MM-DD') + "",
                    "campEndDate": moment(endDateEdit).format('yyyy-MM-DD') + "",
                    "campAudience": myArray,
                    "createType": "1"
                }
                showLoader()
                upSertCampaign(data).then(result => {
                    hideLoader()
                    if (result.data.success) {
                        setTempEmpList([])
                        setDetailsTabChange({ ...detailsTabChange, showTab: true });
                        setAudienceTabChange({ ...audiencetabChange, showTab: false });
                        setOverviewTabChange({ ...overviewtabChange, showTab: false });
                        setMyArrayErr(false)
                        setTimeout(() => {
                            $("#details_t-tab").click();
                            setTempEmpList([])
                            setCampaignNameEdit("")
                            setSubjectNameEdit("")
                            setEditorState(EditorState.createEmpty())
                            setStartDateEdit("")
                            setEndDateEdit("")
                            setCampaignNameEditErr(false)
                            setSubjectNameEditErr(false)
                            setDesEditErr(false)
                            setDesLengthEditErr(false)
                            setStartDateEditErr(false)
                            setEndDateEditErr(false)
                            setvalidDateErrr(false)
                            setValidDateEditErr(false)
                            setDateMinEditErr(false)
                            setDateMaxEditErr(false)
                            $("#closeBtn").get(0).click()
                        }, 100);
                    } else {
                        NotificationManager.error(result.data.message);
                    }
                })
            }
            if (isRepet == 1) {
                var data = {
                    "campaignDtlId": campDetails.campaigndtlid,
                    "campaignId": campDetails.id,
                    "userId": getUserData().response.userId + "",
                    "orgId": getUserData().response.orgn_id + "",
                    "campaignName": campaignNameEdit + "",
                    "campSubject": subjectNameEdit + "",
                    "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
                    "campStartDate": moment(startDateEdit).format('yyyy-MM-DD') + "",
                    "campEndDate": moment(endDateEdit).format('yyyy-MM-DD') + "",
                    "campAudience": myArray,
                    "createType": "1"
                }
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
                            $("#details_t-tab").click();
                            setTempEmpList([])
                            setCampaignNameEdit("")
                            setSubjectNameEdit("")
                            setEditorState(EditorState.createEmpty())
                            setStartDateEdit("")
                            setEndDateEdit("")
                            setCampaignNameEditErr(false)
                            setSubjectNameEditErr(false)
                            setDesEditErr(false)
                            setDesLengthEditErr(false)
                            setStartDateEditErr(false)
                            setEndDateEditErr(false)
                            setvalidDateErrr(false)
                            setValidDateEditErr(false)
                            setDateMinEditErr(false)
                            setDateMaxEditErr(false)
                            $("#closeBtn").get(0).click()
                        }, 100);
                    } else {
                        NotificationManager.error(result.data.message);
                    }
                })

            }
        }
    }
    // DETAILS TAB NEXT BUTTON FUNCTION
    const detailsNextBtnFun = () => {
        setCampaignNameEditErr(false)
        setSubjectNameEditErr(false)
        setDesEditErr(false)
        setDesLengthEditErr(false)
        setStartDateEditErr(false)
        setEndDateEditErr(false)
        setvalidDateErrr(false)
        setValidDateEditErr(false)
        setDateMinEditErr(false)
        setDateMaxEditErr(false)
        setSubComNameError(false)
        setDesComNameError(false)
        const hasText = editorState.getCurrentContent().hasText()
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
        var err = 0
        if (campaignNameEdit.trim() == '') {
            setCampaignNameEditErr(true)
            err++
        }
        if (subjectNameEdit.trim() == '') {
            setSubjectNameEditErr(true)
            err++
        }
        // if (!subjectNameEdit.trim().includes(getUserData().response.organisation_name)) {
        //     setSubComNameError(true)
        //     err++
        // }
        if (!hasText) {
            setDesEditErr(true)
            err++
        } else if (value.length > 500) {
            setDesLengthEditErr(true)
            err++
        } else if (!value.includes(getUserData().response.organisation_name)) {
            setDesComNameError(true)
            err++
        }
        if (startDateEdit == '') {
            setStartDateEditErr(true)
            err++
        }
        if (endDateEdit == '') {
            setEndDateEditErr(true)
            err++
        }
        if (endDateEdit && startDateEdit > endDateEdit) {
            setvalidDateErrr(true)
            err++
        } else if (startDateEdit && endDateEdit && !validDateErrr && endDateEdit > licenseValidity) {
            setValidDateEditErr(true)
            err++
        } else if (startDateEdit && endDateEdit && startDateEdit == endDateEdit) {
            setDateMinEditErr(true)
            err++
        } else if (startDateEdit && endDateEdit && dateDifference(startDateEdit, endDateEdit, 60)) {
            setDateMaxEditErr(true)
            err++
        }
        if (err == 0) {
            if (isRepet == 0) {
                var data = {
                    "campaignId": campDetails.id,
                    "campaignDtlId": campDetails.campaigndtlid,
                    "userId": getUserData().response.userId + "",
                    "orgId": getUserData().response.orgn_id + "",
                    "campaignName": campaignNameEdit + "",
                    "campSubject": subjectNameEdit + "",
                    "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
                    "campStartDate": moment(startDateEdit).format('yyyy-MM-DD') + "",
                    "campEndDate": moment(endDateEdit).format('yyyy-MM-DD') + "",
                    "campAudience": myArray,
                    "createType": "1"
                }
                showLoader()
                upSertCampaign(data).then(result => {
                    hideLoader()
                    if (result.data.success) {
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
            if (isRepet == 1) {
                var data = {
                    "campaignDtlId": campDetails.campaigndtlid,
                    "campaignId": campDetails.id,
                    "userId": getUserData().response.userId + "",
                    "orgId": getUserData().response.orgn_id + "",
                    "campaignName": campaignNameEdit + "",
                    "campSubject": subjectNameEdit + "",
                    "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
                    "campStartDate": moment(startDateEdit).format('yyyy-MM-DD') + "",
                    "campEndDate": moment(endDateEdit).format('yyyy-MM-DD') + "",
                    "campAudience": myArray,
                    "createType": "1"
                }
                showLoader()
                upSertRepetCampaign(data).then(result => {
                    hideLoader()
                    if (result.data.success) {
                        setAudienceTabChange({ ...audiencetabChange, showTab: true });
                        repetCampaignEmpListFun(reqData)
                        setTimeout(() => {
                            $("#audience_t-tab").click();
                        }, 100);
                    } else {
                        NotificationManager.error(result.data.message);
                    }
                })
            }
        }
    }
    // AUDIENCE SAVE AND EXIT BUTTON FUNCTION
    const saveAndExitFun = () => {
        var err = 0
        if (myArray.length == 0) {
            setMyArrayErr(true)
            NotificationManager.error("Please select audience");
            err++
        }
        if (isRepet == 1) {
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
        }
        if (err == 0) {
            if (isRepet == 0) {
                var data = {
                    "campaignId": campDetails.id,
                    "campaignDtlId": campDetails.campaigndtlid,
                    "userId": getUserData().response.userId + "",
                    "orgId": getUserData().response.orgn_id + "",
                    "campaignName": campaignNameEdit + "",
                    "campSubject": subjectNameEdit + "",
                    "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
                    "campStartDate": moment(startDateEdit).format('yyyy-MM-DD') + "",
                    "campEndDate": moment(endDateEdit).format('yyyy-MM-DD') + "",
                    "campAudience": myArray,
                    "createType": "1"
                }

                showLoader()
                upSertCampaign(data).then(result => {
                    hideLoader()
                    if (result.data.success) {
                        setTempEmpList([])
                        setDetailsTabChange({ ...detailsTabChange, showTab: true });
                        setAudienceTabChange({ ...audiencetabChange, showTab: false });
                        setOverviewTabChange({ ...overviewtabChange, showTab: false });
                        setMyArrayErr(false)
                        setTimeout(() => {
                            $("#details_t-tab").click();
                            setTempEmpList([])
                            setCampaignNameEdit("")
                            setSubjectNameEdit("")
                            setEditorState(EditorState.createEmpty())
                            setStartDateEdit("")
                            setEndDateEdit("")
                            setCampaignNameEditErr(false)
                            setSubjectNameEditErr(false)
                            setDesEditErr(false)
                            setDesLengthEditErr(false)
                            setStartDateEditErr(false)
                            setEndDateEditErr(false)
                            setvalidDateErrr(false)
                            setValidDateEditErr(false)
                            setDateMinEditErr(false)
                            setDateMaxEditErr(false)
                            $("#closeBtn").get(0).click()
                        }, 100);
                    } else {
                        NotificationManager.error(result.data.message);
                    }

                })
            }


            if (isRepet == 1) {


                var data = {

                    "campaignDtlId": campDetails.campaigndtlid,
                    "campaignId": campDetails.id,
                    "userId": getUserData().response.userId + "",
                    "orgId": getUserData().response.orgn_id + "",
                    "campaignName": campaignNameEdit + "",
                    "campSubject": subjectNameEdit + "",
                    "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
                    "campStartDate": moment(startDateEdit).format('yyyy-MM-DD') + "",
                    "campEndDate": moment(endDateEdit).format('yyyy-MM-DD') + "",
                    "campAudience": myArray,
                    "createType": "1"
                }


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
                            $("#details_t-tab").click();
                            setTempEmpList([])
                            setCampaignNameEdit("")
                            setSubjectNameEdit("")
                            setEditorState(EditorState.createEmpty())
                            setStartDateEdit("")
                            setEndDateEdit("")
                            setCampaignNameEditErr(false)
                            setSubjectNameEditErr(false)
                            setDesEditErr(false)
                            setDesLengthEditErr(false)
                            setStartDateEditErr(false)
                            setEndDateEditErr(false)
                            setvalidDateErrr(false)
                            setValidDateEditErr(false)
                            setDateMinEditErr(false)
                            setDateMaxEditErr(false)
                            $("#closeBtn").get(0).click()
                        }, 100);
                    } else {
                        NotificationManager.error(result.data.message);
                    }

                })
            }
        }
    }
    // AUDIENCE TAB NEXT BUTTON FUNCTION
    const audienceNextBtnFun = () => {
        var err = 0
        if (myArray.length == 0) {
            setMyArrayErr(true)
            err++
        }
        if (isRepet == 1) {
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
        }
        if (err == 0) {
            if (isRepet == 0) {
                var data = {
                    "campaignId": campDetails.id,
                    "campaignDtlId": campDetails.campaigndtlid,
                    "userId": getUserData().response.userId + "",
                    "orgId": getUserData().response.orgn_id + "",
                    "campaignName": campaignNameEdit + "",
                    "campSubject": subjectNameEdit + "",
                    "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
                    "campStartDate": moment(startDateEdit).format('yyyy-MM-DD') + "",
                    "campEndDate": moment(endDateEdit).format('yyyy-MM-DD') + "",
                    "campAudience": myArray,
                    "createType": "1"
                }
                showLoader()
                upSertCampaign(data).then(result => {
                    hideLoader()
                    if (result.data.success) {
                        setSuccessMessage(result.data.message)
                        setDetailsTabChange({ ...detailsTabChange, showTab: false });
                        setAudienceTabChange({ ...audiencetabChange, showTab: false });
                        setOverviewTabChange({ ...overviewtabChange, showTab: true });
                        setOverviewTabChange({ ...overviewtabChange, showTab: true });
                        setTimeout(() => {
                            $("#overview_t-tab").click();
                        }, 1000);
                    } else {
                        NotificationManager.error(result.data.message);
                    }
                })
            }
            if (isRepet == 1) {
                var data = {
                    "campaignDtlId": campDetails.campaigndtlid,
                    "campaignId": campDetails.id,
                    "userId": getUserData().response.userId + "",
                    "orgId": getUserData().response.orgn_id + "",
                    "campaignName": campaignNameEdit + "",
                    "campSubject": subjectNameEdit + "",
                    "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
                    "campStartDate": moment(startDateEdit).format('yyyy-MM-DD') + "",
                    "campEndDate": moment(endDateEdit).format('yyyy-MM-DD') + "",
                    "campAudience": myArray,
                    "createType": "1"
                }
                showLoader()
                upSertRepetCampaign(data).then(result => {
                    hideLoader()
                    if (result.data.success) {
                        setSuccessMessage(result.data.message)
                        setDetailsTabChange({ ...detailsTabChange, showTab: false });
                        setAudienceTabChange({ ...audiencetabChange, showTab: false });
                        setOverviewTabChange({ ...overviewtabChange, showTab: true });
                        setOverviewTabChange({ ...overviewtabChange, showTab: true });
                        setTimeout(() => {
                            $("#overview_t-tab").click();
                        }, 100);
                    } else {
                        NotificationManager.error(result.data.message);
                    }
                })
            }
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


        if (isRepet == 0) {
            var data = {
                "campaignId": campDetails.id,
                "campaignDtlId": campDetails.campaigndtlid,
                "userId": getUserData().response.userId + "",
                "orgId": getUserData().response.orgn_id + "",
                "campaignName": campaignNameEdit + "",
                "campSubject": subjectNameEdit + "",
                "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
                "campStartDate": moment(startDateEdit).format('yyyy-MM-DD') + "",
                "campEndDate": moment(endDateEdit).format('yyyy-MM-DD') + "",
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
        if (isRepet == 1) {
            var data = {
                "campaignId": campDetails.id,
                "campaignDtlId": campDetails.campaigndtlid,
                "userId": getUserData().response.userId + "",
                "orgId": getUserData().response.orgn_id + "",
                "campaignName": campaignNameEdit + "",
                "campSubject": subjectNameEdit + "",
                "campDesc": draftToHtml(convertToRaw(editorState.getCurrentContent())) + "",
                "campStartDate": moment(startDateEdit).format('yyyy-MM-DD') + "",
                "campEndDate": moment(endDateEdit).format('yyyy-MM-DD') + "",
                "campAudience": myArray,
                "createType": "2"
            }

            if (err == 0) {
                showLoader()
                upSertRepetCampaign(data).then(result => {
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


    }
    // PUBLISH CAMPAIGN FUNCTION
    const publishCampaignFun = () => {
        var data = {
            "campaignId": campDetails.campaigndtlid,
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
        setTempEmpList([])
        setDetailsTabChange({ ...detailsTabChange, showTab: true });
        setAudienceTabChange({ ...audiencetabChange, showTab: false });
        setOverviewTabChange({ ...overviewtabChange, showTab: false });
        setMyArrayErr(false)
        setTimeout(() => {
            $("#details_t-tab").click();
            setTempEmpList([])
            setCampaignNameEdit("")
            setSubjectNameEdit("")
            setEditorState(EditorState.createEmpty())
            setStartDateEdit("")
            setEndDateEdit("")
            setCampaignNameEditErr(false)
            setSubjectNameEditErr(false)
            setDesEditErr(false)
            setDesLengthEditErr(false)
            setStartDateEditErr(false)
            setEndDateEditErr(false)
            setvalidDateErrr(false)
            setValidDateEditErr(false)
            setDateMinEditErr(false)
            setDateMaxEditErr(false)
            $("#closeBtn").get(0).click()
            hideLoader()
        }, 1000);

    }

    const editDetailsFun = () => {
        setDetailsTabChange({ ...detailsTabChange, showTab: true });
        setAudienceTabChange({ ...audiencetabChange, showTab: false });
        setOverviewTabChange({ ...overviewtabChange, showTab: false });
        setTimeout(() => {
        $("#details_t-tab").click();
        }, 100);

    }
    const editAudienceFun = () => {
        setDetailsTabChange({ ...detailsTabChange, showTab: false });
        setAudienceTabChange({ ...audiencetabChange, showTab: true });
        setOverviewTabChange({ ...overviewtabChange, showTab: false });
        setTimeout(() => {
            $("#audience_t-tab").click();
        }, 100);
    }
    const editMessageFun = () => {
        setDetailsTabChange({ ...detailsTabChange, showTab: true });
        setAudienceTabChange({ ...audiencetabChange, showTab: false });
        setOverviewTabChange({ ...overviewtabChange, showTab: false });
        setTimeout(() => {
            $("#details_t-tab").click();
        }, 100);
    }

    return (
        <>

            {/* EDIT CAMPAIGN */}
            <div className="bulk_upl_po campaign_edit_con" >
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
                    <h3>Edit Campaign</h3>
                    <div className="addcompny_tab addemploy_tab">

                        {/* TAB */}
                        <ul className="nav nav-tabs" id="myTab" role="tablist">

                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link active"
                                    id="details_t-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#details_t"
                                    role="tab"
                                    aria-controls="details_t"
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
                                    data-bs-target="#audience_t"
                                    role="tab"
                                    aria-controls="audience_t"
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
                                    data-bs-target="#overview_t"
                                    role="tab"
                                    aria-controls="overview_t"
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
                                    <div className="tab-pane fade show active"
                                        id="details_t"
                                        role="tabpanel"
                                        aria-labelledby="details_t-tab"

                                    >

                                        <div className="creat_camp_div">
                                            <div className="creat_camp_div_top">
                                                <span className="camp_div_nbm">1</span>
                                                <strong>Campaign Details</strong>
                                            </div>
                                            <div className="creat_camp_div_blo">
                                                <div>
                                                    <label>Campaign Name </label>
                                                    <input
                                                        className={`form-control ${campaignNameEditErr ? "error-fil" : ""}`}
                                                        type="text"
                                                        placeholder="Enter the campaign name"
                                                        value={campaignNameEdit}
                                                        onChange={(e) => { setCampaignNameEdit(e.target.value) }}
                                                        disabled={isRepet == 1}
                                                    />
                                                    {campaignNameEditErr ?
                                                        <span className='errorfiled'>Enter the campaign name</span>
                                                        : null
                                                    }
                                                </div>
                                                <div className="subjectCampaign mt-5">
                                                    <div className="creat_camp_div_top">
                                                        <label>Subject </label>
                                                        <a className='camp_a_tag'>
                                                            <img src={iicon} />
                                                            <div className="inf_hov_dv">
                                                                <p>Lorem Ipsum has been the industry's standard dummy
                                                                    text ever since the 1500s, when an unknown printer
                                                                    took a galley of type and scrambled it to make a
                                                                    type specimen book. </p>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <input
                                                        className={`form-control ${subjectNameEditErr || subComNameError ? "error-fil" : ""}`}
                                                        type="text"
                                                        placeholder="Enter the subject name"
                                                        value={subjectNameEdit}
                                                        onChange={(e) => { setSubjectNameEdit(e.target.value) }}
                                                    />
                                                    {
                                                        subjectNameEditErr ? <span className='errorfiled'>Enter the subject name</span> : null
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
                                                                <p>Lorem Ipsum has been the industry's standard dummy
                                                                    text ever since the 1500s, when an unknown printer
                                                                    took a galley of type and scrambled it to make a
                                                                    type specimen book. </p>
                                                            </div>
                                                        </a>
                                                    </div>
                                                    <div className={`border-1 p-4 edit_div ${desEditErr || desLengthEditErr ? "error-fil" : ""}`}>
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
                                                        desEditErr ? <span className='errorfiled'>Enter the description</span> : null
                                                    }
                                                    {
                                                        desLengthEditErr ? <span className='errorfiled'>Enter the maximum 500 characters</span> : null
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
                                                        <p>Lorem Ipsum has been the industry's standard dummy
                                                            text ever since the 1500s, when an unknown printer
                                                            took a galley of type and scrambled it to make a
                                                            type specimen book. </p>
                                                    </div>
                                                </a>
                                            </div>
                                            <div className="creat_camp_div_blo std_end">
                                                <div>
                                                    <label>Start Date </label>
                                                    <input
                                                        className={`form-control ${startDateEditErr ? "error-fil" : ""}`}
                                                        type="date"
                                                        min={todayDate}
                                                        value={startDateEdit}
                                                        onChange={(e) => { setStartDateEdit(e.target.value) }}
                                                    />
                                                    {startDateEditErr ?
                                                        <span className='errorfiled'>Enter the start date</span>
                                                        : null
                                                    }
                                                </div>
                                                <div>
                                                    <label>End Date </label>
                                                    <input
                                                        className={`form-control ${endDateEditErr || validDateErrr || validDateEditErr || dateMinEditErr || dateMaxEditErr ? "error-fil" : ""}`}
                                                        type="date"
                                                        min={startDateEdit}
                                                        value={endDateEdit}
                                                        onChange={(e) => { setEndDateEdit(e.target.value) }}
                                                    />
                                                    {endDateEditErr ?
                                                        <span className='errorfiled'>Enter the end date</span>
                                                        : null
                                                    }
                                                    {validDateErrr ?
                                                        <span className='errorfiled'>End date is greater than start date</span>
                                                        : null
                                                    }
                                                    {validDateEditErr ?
                                                        <span className='errorfiled'>End date is greater than licence validity date</span>
                                                        : null
                                                    }
                                                    {dateMinEditErr ?
                                                        <span className='errorfiled'>Campaign duration should be atleast 1 day</span>
                                                        : null
                                                    }
                                                    {dateMaxEditErr ?
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
                                                <button className="btn btn-primary" onClick={detailsNextBtnFun}>Next</button>
                                            </div>
                                        </div>

                                    </div>

                                    {/* AUDIENCE */}
                                    <div className="tab-pane fade"
                                        id="audience_t"
                                        role="tabpanel"
                                        aria-labelledby="audience_t-tab"
                                    >
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


                                                    {
                                                        tempEmpList.map((item, i) => (
                                                            <tbody key={i}>
                                                                <tr role="row">
                                                                    <td align="center">
                                                                        <div className="form-check">
                                                                            {
                                                                                isRepet == 0 ?
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className={`form-check-input ${myArrayErr ? "error-fil" : ""}`}
                                                                                        name={item.id}
                                                                                        checked={item?.isChecked || false}
                                                                                        value={item.id}
                                                                                        onChange={handleChange}
                                                                                    /> : null
                                                                            }

                                                                            {
                                                                                isRepet == 1 ?
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className={`form-check-input ${myArrayErr ? "error-fil" : ""}`}
                                                                                        name={item.emplicenceid}
                                                                                        checked={item?.isChecked || false}
                                                                                        value={item.empid}
                                                                                        onChange={handleChange}
                                                                                    /> : null
                                                                            }


                                                                        </div>
                                                                    </td>
                                                                    <td align="left">{item.first_name}</td>
                                                                    <td align="left">{item.last_name}</td>
                                                                    <td align="left">{moment(item.empinserted_datetime).format('DD-MM-YYYY')}</td>
                                                                </tr>
                                                            </tbody>
                                                        ))

                                                    }



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

                                    {/* OVERVIEW */}
                                    <div className="tab-pane fade"
                                        id="overview_t"
                                        role="tabpanel"
                                        aria-labelledby="overview_t-tab"
                                    >
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
                                                                        <strong>{campaignNameEdit}</strong>
                                                                    </li>
                                                                    <li>
                                                                        <span>Start Date : </span>
                                                                        <strong>{moment(startDateEdit).format('DD-MM-YYYY')}</strong>
                                                                    </li>
                                                                    <li>
                                                                        <span>End Date : </span>
                                                                        <strong>{moment(endDateEdit).format('DD-MM-YYYY')}</strong>
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
                                                                        <strong>{subjectNameEdit}</strong>
                                                                    </li>
                                                                    <li>
                                                                        <span>Description : </span>
                                                                        <div className="editor_div_camp" dangerouslySetInnerHTML={{ __html: draftToHtml(convertToRaw(editorState.getCurrentContent())) }} />

                                                                    </li>
                                                                </ul>

                                                            </div>
                                                        </div>

                                                        <div className="launch_dive">
                                                            <button
                                                                className="btn btn-primary"
                                                                onClick={launchCampaign}
                                                            >
                                                                Launch Campaign
                                                            </button>

                                                        </div>
                                                    </div>

                                                </>

                                        }
                                        {/* <div className="sucs_dive">
                                            <p>&nbsp;</p>
                                            <span>
                                                <i className="bi bi-check-circle-fill"></i>
                                            </span>
                                            <strong>Success!</strong>

                                            <p>{successMessage}</p>

                                            <button className="btn btn-primary" onClick={goDash}>Go to Dashboard</button>
                                            <p>&nbsp;</p>
                                            <p>&nbsp;</p>
                                        </div> */}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <nav className="navbar navbar-expand navbar-light navbar-bg d-block ">
                <div className="navbar-collapse collapse navright">
                    <LoggedLayout />
                </div>

            </nav>

            <NotificationContainer />
        </>
    )
}

export default CampaignEdit