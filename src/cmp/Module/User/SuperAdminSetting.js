///-----------Import Files-----------///
import React, { useState, useEffect } from 'react'
import LoggedLayout from './LoggedLayout'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IMAGE_URL, IMAGE_URL_ASSETS, IMPORT_FILE, PAYLOAD_ENCRYCT } from '../../../config/app_url';
import { getUserData, showLoader, hideLoader, getUserRole, GetDecrypt } from '../../../service/Common';
import { changePass, fetchPrivacyPolicy, getHRACover, updateHRACover, getIndustryType, getCountry, getCity, uploadLogo, getCompanyInfo, userEvent, editLicense, editSMTPDetails, editProfileCompany, fetchcompany, addFAQContent, updateFAQContent, updatePolicy, fetchFAQContent, deleteFAQContent, checkSmtp, uploadLicence } from '../../../service/Services';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import moment from 'moment';
import { FileUploader } from "react-drag-drop-files";
import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import $ from 'jquery'
///------------Images urls------------///
var imgUrlAsset = IMAGE_URL_ASSETS;
var imgUrl = IMAGE_URL
///--------------Import Images-------------///
const profileImage = require('../../../assets/images/company-profile.png');
const imageicon = require('../../../assets/images/image-icon.png');
const hraCover1 = require('../../../assets/images/hra-cover1.png');
const hraCover2 = require('../../../assets/images/hra-cover2.png');
///--------------Import File upload format-------------///
const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];

function SuperAdminSetting() {

    /* Variables */
    var mediumRegex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])([a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]{6,})$");
    var veryStrongRegex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])([a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]{8,})$");
    const [show, setShow] = useState(false);
    const [currPass, setCurrPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [cnfPass, setCnfPass] = useState('');
    const [currPassNotify, setCurrPassNotify] = useState(false);
    const [newPassNotify, setNewPassNotify] = useState(false);
    const [cnfPassNotify, setCnfPassNotify] = useState(false);
    const [matchPassNotify, setMatchPassNotify] = useState(false);
    const [passMatchError, setPassMatchError] = useState(false);
    const [currvalues, setcurrValues] = useState({
        password: "",
        showPassword: false,
    });
    const [newvalues, setnewValues] = useState({
        password: "",
        showPassword: false,
    });
    const [cnfvalues, setcnfValues] = useState({
        password: "",
        showPassword: false,
    });
    //Edit button variables 
    const [profileEdit, setProfileEdit] = useState(false)
    const [contactEdit, setContactEdit] = useState(false)
    const [accessEdit, setAccessEdit] = useState(false)
    const [smtpEdit, setSmtpEdit] = useState(false)
    //Profile Details
    const [comLogoImg, setComLogoImg] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [parentcompanyName, setParentCompanyName] = useState("")
    const [companyType, setCompanyType] = useState("")
    const [industryType, setIndustryType] = useState("")
    const [noOfEmployee, setNoOfEmployee] = useState("")
    const [establishedYear, setEstablishedYear] = useState("")
    const [website, setWebsite] = useState("")
    const [comEmailID, setComEmailID] = useState("")
    const [counrtyCode, setCounrtyCode] = useState("")
    const [comContactNumber, setComContactNumber] = useState("")
    const [comAddress, setComAddress] = useState("")
    const [country, setCountry] = useState("")
    const [countryCity, setCountryCity] = useState("")
    const [location, setLocation] = useState("")
    // Profile Details Error Variable
    const [comLogoError, setComLogoError] = useState(false)
    const [comLogoSizeError, setComLogoSizeError] = useState(false)
    const [comLogoResError, setComLogoResError] = useState('')
    const [comNameError, setComNameError] = useState(false)
    const [parcomNameError, setParComNameError] = useState(false)
    const [comTypeError, setComtypeError] = useState(false)
    const [indTypeError, setIndTypeError] = useState(false)
    const [noOfEmpError, setnoOfEmpError] = useState(false)
    const [estYrError, setestYrError] = useState(false)
    const [webError, setWebError] = useState(false)
    const [comEmailIdError, setComEmailIdError] = useState(false)
    const [comAddressError, setComAddressError] = useState(false)
    const [comConNoError, setComConNoError] = useState(false)
    const [conCityError, setconCityError] = useState(false)
    const [locError, setlocError] = useState(false)
    const [webUrlError, setWebUrlError] = useState(false)
    const [validEmailError, setValidEmailError] = useState(false)
    const [validContactError, setValidContactError] = useState(false)
    const [logoImg, setLogoImg] = useState({
        showTab: false,
    })
    //Smtp Details
    const [serverAddress, setServerAddress] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [encryptionType, setEncryptionType] = useState("")
    const [portNumber, setPortNumber] = useState("")
    const [defaultSender, setDefaultSender] = useState("")
    const [defaultSenderName, setDefaultSenderName] = useState("")
    // SMTP Settings Error variable
    const [serverAddressError, setServerAddressError] = useState(false)
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [encryptionTypeError, setEncryptionTypeError] = useState(false)
    const [portNumberError, setPortNumberError] = useState(false)
    const [defaultSenderError, setDefaultSenderError] = useState(false)
    const [defaultSenderNameError, setDefaultSenderNameError] = useState(false)
    //Access & License
    const [typeOfAccess, setTypeOfAccess] = useState("")
    const [noOfLicenses, setNoOfLicenses] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    //Access & License Error Variable
    const [typeOfAccessError, setTypeOfAccessError] = useState(false)
    const [noOfLicensesError, setNoOfLicensesError] = useState(false)
    const [startDateError, setStartDateError] = useState(false)
    const [endDateError, setEndDateError] = useState(false)
    const [startEndDateError, setstartEndDateError] = useState(false)
    const [indTypeArray, setIndTypeArray] = useState([])
    const [countryArray, setCountryArray] = useState([])
    const [cityArray, setCityArray] = useState([])
    const [companyData, setCompanyData] = useState({})
    const [smtpData, setSmtpData] = useState({})
    //Mail Format Regex//
    var mailformat = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$";
    //Contact No. Regex//
    var z1 = /^[0-9]*\d$/
    //Website url Regex//
    var httpRegex = /^(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    const numberInputInvalidChars = ['-', '+', 'e', '.', ' '];
    const [userLevel, setUserLevel] = React.useState(0)
    //FAQ
    const [faqData, setfaqData] = useState([]);
    const [search, setSearch] = React.useState("");
    //HRA COVER//
    const [hraCover, setHraCover] = useState([]);
    const [selectedCover, setSelectedCover] = useState([]);
    //privacy policy//
    const [policyData, setPolicyData] = useState("");
    const [canEdit, SetCanEdit] = React.useState(false)
    //setting
    const [addFAQFormShow, setAddFAQFormShow] = useState(false);
    const [faqQueError, SetFaqQueError] = React.useState(false)
    const [faqAnsError, SetFaqAnsError] = React.useState(false)
    const [addFAQ, setAddFAQ] = useState('');
    const [faqAnsLengthError, SetFaqAnsLengthError] = React.useState(false)
    const [editorStateFAQ, setEditorStateFAQ] = useState(EditorState.createEmpty());
    const [editorStateFAQOther, setEditorStateFAQOther] = useState(EditorState.createEmpty());
    const [addFAQAns, setAddFAQAns] = useState('');
    const [faqQueEditError, SetFaqQueEditError] = React.useState(false)
    const [editQue, setEditQue] = useState("");
    const [isIndex, setIsIndex] = React.useState("")
    const [editAns, setEditAns] = useState("");
    const [isUpdate, setIsUpdate] = React.useState("")
    const [faqId, setFaqId] = useState("");
    const [showDeleteFAQ, setShowDeleteFAQ] = useState(false);
    const [faqAnsEditError, SetFaqAnsEditError] = React.useState(false)
    const [faqAnsEditLengthError, SetFaqAnsEditLengthError] = React.useState(false)
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [editorStateOther, setEditorStateOther] = useState(EditorState.createEmpty());
    const [otherpolicyData, setotherPolicyData] = useState("");

    /* Functions */
    //------------------UseEffect-----------------//  
    useEffect(() => {
        var role = getUserRole("Settings")
        if (role) {
            if (role.can_edit == 1) {
                SetCanEdit(true)
            }
        }
        getCompanyInfoFun()

        getCountryFun()
        if (getUserData().response.parent_orgn_id == "0") {
            setUserLevel(1)
        } else {
            if (getUserData().response.is_child == "0") {
                setUserLevel(2)
            } else {
                setUserLevel(3)
            }
        }
    }, [])
    //-------------- callback functions -------------//
    const handleClickShowCurrPassword = () => {
        setcurrValues({ ...currvalues, showPassword: !currvalues.showPassword });
    };
    const handleClickShowNewPassword = () => {
        setnewValues({ ...newvalues, showPassword: !newvalues.showPassword });
    };
    const handleClickShowCnfPassword = () => {
        setcnfValues({ ...cnfvalues, showPassword: !cnfvalues.showPassword });
    };
    //Profile//
    function getCompanyInfoFun() {
        let data = {
            "orgn_id": getUserData().response.orgn_id
        }
        showLoader()
        getCompanyInfo(data).then(result => {
            hideLoader()

            setCompanyData(result.data.response)
            setSmtpData(result.data.response.smtp_setting)
            setCompanyName(result.data.response.organisation_name)
            setComLogoImg(result.data.response.organisation_logo)
            setCompanyName(result.data.response.organisation_name)
            setLogoImg({ ...logoImg, showTab: true })
            setParentCompanyName(result.data.response.parent_organisation_name)
            setCompanyType(result.data.response.organisation_type)
            getIndustryTypeFun(result.data.response.organisation_type)
            setIndustryType(result.data.response.industry_type)
            setEstablishedYear(result.data.response.organisation_established_yr)
            setWebsite(result.data.response.organisation_website)
            setComEmailID(result.data.response.organisation_email)
            setCounrtyCode(result.data.response.organisation_countryCode)
            setComContactNumber(result.data.response.organisation_phone)
            setComAddress(result.data.response.organisation_address)
            setCountry(result.data.response.organisation_country)
            setCountryCity(result.data.response.organisation_city)
            setLocation(result.data.response.organisation_location)
            setNoOfEmployee(result.data.response.total_emp)
            setServerAddress(result.data.response.smtp_setting.smtp_server_address)
            setUsername(result.data.response.smtp_setting.username)
            setPassword(result.data.response.smtp_setting.password)
            setEncryptionType(result.data.response.smtp_setting.enp_type)
            setPortNumber(result.data.response.smtp_setting.port_no)
            setDefaultSender(result.data.response.smtp_setting.sender)
            setDefaultSenderName(result.data.response.smtp_setting.sender_name)
            setTypeOfAccess(result.data.response.organisation_flag)
            setNoOfLicenses(result.data.response.number_of_license)
            setStartDate(result.data.response.license_start_datetime.toLocaleString("lookup").substring(0, 10))
            setEndDate(result.data.response.license_end_datetime.toLocaleString("lookup").substring(0, 10))
            let data3 = {
                "userId": getUserData().response.userId,
                "country": result.data.response.organisation_country

            }
            getCity(data3).then(result => {
                setCityArray(result.data.response)
            })
        })
    }
    function getIndustryTypeFun(val) {
        let data1 = {
            "userId": getUserData().response.userId,
            "type": val
        }
        getIndustryType(data1).then(result => {
            setIndTypeArray(result.data.response)
        })
    }
    function getCountryFun() {
        let data2 = {
            "userId": getUserData().response.userId
        }
        getCountry(data2).then(result => {
            setCountryArray(result.data.response)
        })
    }
    const handleShow = () => {
        showLoader()
        setShow(true)
        setTimeout(() => {
            hideLoader()
        }, 1000);
    };
    const handleClose = () => {
        showLoader()
        setShow(false);
        setCurrPass('')
        setNewPass('')
        setCnfPass('')
        setCurrPassNotify(false)
        setNewPassNotify(false)
        setCnfPassNotify(false)
        setMatchPassNotify(false)
        setPassMatchError(false)
        setcurrValues({ ...currvalues, showPassword: false });
        setnewValues({ ...newvalues, showPassword: false });
        setcnfValues({ ...cnfvalues, showPassword: false });
        setTimeout(() => {
            hideLoader()
        }, 1000);
    }
    function passwordChanged() {
        document.getElementById("strong").style.backgroundColor = "";
        document.getElementById("normal").style.backgroundColor = "";
        document.getElementById("week").style.backgroundColor = "";
        var pwd = document.getElementById("txtPassword1");
        if (pwd.value) {
            if (veryStrongRegex.test(pwd.value)) {
                document.getElementById("strong").style.backgroundColor = "green";
            }
            if (mediumRegex.test(pwd.value)) {
                document.getElementById("normal").style.backgroundColor = "orange";
            }
            if (pwd.value.length > 0) {
                document.getElementById("week").style.backgroundColor = "red";
            }
        }
    }
    const onSubmit = () => {
        setPassMatchError(false)
        setCurrPassNotify(false)
        setNewPassNotify(false)
        setCnfPassNotify(false)
        setMatchPassNotify(false)
        var err = 0
        if (PAYLOAD_ENCRYCT) {
            if (!veryStrongRegex.test(newPass)) {
                setPassMatchError(true);
                err++
            }
        }
        if (currPass == '') {
            setCurrPassNotify(true)
            err++
        }
        if (newPass == '') {
            setNewPassNotify(true)
            err++
        }
        if (cnfPass == '') {
            setCnfPassNotify(true)
            err++
        }
        if (newPass && cnfPass && newPass != cnfPass) {
            setMatchPassNotify(true)
            err++
        }
        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "cpassword": currPass,
            "password": cnfPass
        }
        if (err == 0) {
            showLoader()
            changePass(data).then(res => {
                if (res.data.success) {
                    handleClose()
                    if (res.data.status == 1005) {
                        NotificationManager.error(res.data.message);
                    } else if (res.data.status == 404) {
                        NotificationManager.error(res.data.message);
                    } else {
                        hideLoader()
                        NotificationManager.success(res.data.message);
                        userEvent("Change password")
                    }
                } else {
                    NotificationManager.error(res.data.message);
                }
            })
        }
    }
    const profileEditFun = () => {
        setProfileEdit(!profileEdit)
    }
    const accessEditFun = () => {
        setAccessEdit(!accessEdit)
    }
    const smtpEditFun = () => {
        setSmtpEdit(!smtpEdit)
    }
    const callCity = (e) => {
        let data = {
            "userId": getUserData().response.userId,
            "country": e
        }
        showLoader()
        getCity(data).then(result => {
            hideLoader()
            setCityArray(result.data.response)
        })
    }
    const openURL = (url) => {
        var link = url
        window.open(link);
    }
    function dateChange(e) {
        var date = new Date(e);
        var dateValue = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate(), 0)
        setEndDate(moment(dateValue).format('yyyy-MM-DD'))
    }
    const stack = (
        <>
            <div className={`add_drg conp_prof_edts set_edit ${comLogoError || comLogoSizeError || comLogoResError ? "error-fil" : ""}`}>
                <button className="btn btn-nobg btn-lg">Browse</button>
                <p>or drag and drop the logo of the company (max 800*400 px)</p>
                <span>
                    {
                        logoImg.showTab ? <img style={{ width: "70px", height: "48px" }} src={imgUrl + comLogoImg} /> : <img src={imageicon} />
                    }
                </span>
            </div>
            {
                comLogoError ? <span className='errorfiled'>Upload the company logo</span> : null
            }
            {
                comLogoSizeError ? <span className='errorfiled'>Height and Width must not exceed 800*400 px</span> : null
            }
            {
                comLogoResError ? <span className='errorfiled'>{comLogoResError}</span> : null
            }
        </>
    );
    const onSave = () => {
        setComLogoError(false)
        setParComNameError(false)
        setComtypeError(false)
        setIndTypeError(false)
        setnoOfEmpError(false)
        setestYrError(false)
        setWebError(false)
        setComEmailIdError(false)
        setComConNoError(false)
        setComAddressError(false)
        setconCityError(false)
        setlocError(false)
        setWebUrlError(false)
        setValidEmailError(false)
        setValidContactError(false)
        var err = 0
        if (comLogoImg == '') {
            setComLogoError(true)
            err++
        }
        if (companyType == '') {
            setComtypeError(true)
            err++
        }
        if (industryType == '') {
            setIndTypeError(true)
            err++
        }
        if (noOfEmployee == '') {
            setnoOfEmpError(true)
            err++
        }
        if (establishedYear == '') {
            setestYrError(true)
            err++
        }
        if (website == '') {
            setWebError(true)
            err++
        } else {
            if (!httpRegex.test(website)) {
                setWebUrlError(true)
                err++
            }
        }
        if (comEmailID == '') {
            setComEmailIdError(true)
            err++
        } else {
            if (!comEmailID.match(mailformat)) {
                setValidEmailError(true)
                err++
            }
        }
        if (comContactNumber == '') {
            setComConNoError(true)
            err++
        } else {
            if (!z1.test(comContactNumber)) {
                setValidContactError(true)
                err++;
            } else if (comContactNumber.length < 7) {
                setValidContactError(true)
                err++;
            } else if (comContactNumber.length > 15) {
                setValidContactError(true)
                err++;

            } else {
                setValidContactError(false)
            }
        }
        if (comAddress.trim() == '') {
            setComAddressError(true)
            err++
        }
        if (country == '') {
            setconCityError(true)
            err++
        }
        if (countryCity == '') {
            setconCityError(true)
            err++

        }
        if (location.trim() == '') {
            setlocError(true)
            err++

        }
        if (err == 0) {
            var data = {
                "organisation_logo": comLogoImg,
                "organisation_name": companyName.trim(),
                "organisation_email": comEmailID,
                "organisation_website": website,
                "organisation_type": companyType,
                "industry_type": industryType,
                "organisation_established_yr": establishedYear,
                "organisation_countryCode": counrtyCode,
                "organisation_phone": comContactNumber,
                "total_emp": noOfEmployee,
                "organisation_address": comAddress.trim(),
                "organisation_country": country,
                "organisation_city": countryCity,
                "organisation_location": location.trim(),
                "orgn_id": getUserData().response.orgn_id
            }
            showLoader()
            editProfileCompany(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    userEvent("update company profile details")
                    NotificationManager.success(result.data.message);
                    setProfileEdit(!profileEdit)
                    getCompanyInfoFun()
                } else {
                    NotificationManager.error(result.data.message);
                }
            })
        }
    }
    const onSave3 = () => {
        setTypeOfAccessError(false)
        setNoOfLicensesError(false)
        setStartDateError(false)
        setEndDateError(false)
        var err = 0
        if (typeOfAccess == '') {
            setTypeOfAccessError(true)
            err++
        }
        if (noOfLicenses == '') {
            setNoOfLicensesError(true)
            err++
        }
        if (startDate == '') {
            setStartDateError(true)
            err++
        }
        if (endDate == '') {
            setEndDateError(true)
            err++
        }
        if (err == 0) {
            var data = {
                "number_of_license": noOfLicenses,
                "license_start_datetime": startDate,
                "license_end_datetime": endDate,
                "orgn_id": getUserData().response.orgn_id
            }
            showLoader()
            editLicense(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    userEvent("update company license details")
                    NotificationManager.success(result.data.message);
                    setAccessEdit(!accessEdit)
                    getCompanyInfoFun()
                } else {
                    NotificationManager.error(result.data.message);
                }
            })
        }
    }
    const onSave4 = () => {
        setServerAddressError(false)
        setUsernameError(false)
        setPasswordError(false)
        setPortNumberError(false)
        setDefaultSenderError(false)
        setEncryptionTypeError(false)
        setDefaultSenderNameError(false)
        var err = 0
        if (serverAddress.trim() == '') {
            setServerAddressError(true)
            err++
        }
        if (username.trim() == '') {
            setUsernameError(true)
            err++
        }
        if (password.trim() == '') {
            setPasswordError(true)
            err++
        }
        if (encryptionType == '') {
            setEncryptionTypeError(true)
            err++
        }
        if (portNumber.trim() == '') {
            setPortNumberError(true)
            err++
        }
        if (defaultSender.trim() == '') {
            setDefaultSenderError(true)
            err++
        }
        if (defaultSenderName.trim() == '') {
            setDefaultSenderNameError(true)
            err++
        }
        if (err == 0) {
            var data = {
                "smtp_server_address": serverAddress.trim(),
                "username": username.trim(),
                "password": password.trim(),
                "enp_type": encryptionType,
                "port_no": portNumber.trim(),
                "sender": defaultSender.trim(),
                "sender_name": defaultSenderName.trim(),
                "orgn_id": getUserData().response.orgn_id
            }
            showLoader()
            editSMTPDetails(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    userEvent("update company smtp details")
                    NotificationManager.success(result.data.message);
                    setSmtpEdit(!smtpEdit)
                    setSmtpBtn(false)
                    getCompanyInfoFun()
                }
            })
        }
    }
    const handleChange = (file) => {
        setComLogoSizeError(false)
        setComLogoResError("")
        var err = 0
        setComLogoImg("")
        setLogoImg({ ...logoImg, showTab: false });
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const fileName = new FormData();
            fileName.append("file", file);
            const image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                var height = this.height;
                var width = this.width;
                if (height > 800 || width > 400) {
                    setComLogoSizeError(true);
                    return false
                } else {
                    showLoader()
                    uploadLogo(fileName).then(result => {
                        result = GetDecrypt(result)
                        hideLoader()
                        if (result.success) {
                            setComLogoImg(result.response.fileName)
                            setLogoImg({ ...logoImg, showTab: true });
                        } else {
                            setComLogoResError(result.message)
                        }
                    })
                }
            };
        }
    };
    //FAQ//
    function fetchFAQ() {
        let data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "searchText": search
        }
        showLoader()
        fetchFAQContent(data).then(result => {
            hideLoader()
            var tempArr = []
            for (let [i, data] of result.data.response.entries()) {
                var isDisabled
                var isActive
                if (data.id == isUpdate) {
                    isDisabled = false
                    isActive = true
                } else {
                    isDisabled = true
                    isActive = false
                }
                var value = {
                    id: data.id,
                    question: data.question,
                    ans: data.ans,
                    isDisabled: isDisabled,
                    isActive: isActive,
                    editorState: EditorState.createEmpty()
                }
                tempArr.push(value)
            }
            setfaqData(tempArr)
        })
    }
    const faqBtnClick = () => {
        fetchFAQ()
    }
    const handleKeyPress = () => {
        if (search.length >= '2') {
            fetchFAQ()
        }
        if (search.length == '0') {
            fetchFAQ()
        }
    }
    function editpol() {
        document.getElementById('addpl_dv').style.display = 'block';
        document.getElementById('edit_dv').style.display = 'none';
    }
    const adfaq = () => {
        setAddFAQFormShow(true)
    }
    const onEditorStateChangeFaq = (editorState) => {
        setEditorStateFAQ(editorState)
    };
    const onEditorStateChangeFaqOther = (editorState) => {
        setEditorStateFAQOther(editorState)
    };
    const onEditorStateChange3 = (editorState) => {
        var tempArr = []
        for (var i = 0; i < faqData.length; i++) {
            if (i == isIndex) {
                faqData[i].editorState = editorState
            } else {
                faqData[i].editorState = EditorState.createEmpty()
            }
            var value = {
                id: faqData[i].id,
                question: faqData[i].question,
                ans: faqData[i].ans,
                isDisabled: faqData[i].isDisabled,
                isActive: faqData[i].isActive,
                editorState: faqData[i].editorState
            }
            tempArr.push(value)
        }
        setfaqData(tempArr)
    };
    const addFAQFun = () => {
        var err = 0
        SetFaqQueError(false)
        SetFaqAnsError(false)
        SetFaqAnsLengthError(false)
        if (addFAQ.trim() == '') {
            SetFaqQueError(true)
            err++
        }
        const hasText = editorStateFAQ.getCurrentContent().hasText()
        const blocks = convertToRaw(editorStateFAQ.getCurrentContent()).blocks;
        const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
        if (!hasText) {
            SetFaqAnsError(true)
            err++
        } else if (value.length > 500) {
            SetFaqAnsLengthError(true)
            err++
        }
        var faqObj = {
            "qtn": addFAQ,
            "ans": draftToHtml(convertToRaw(editorStateFAQ.getCurrentContent()))
        }
        let data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "faqList": [faqObj]
        }
        if (err == 0) {
            showLoader()
            addFAQContent(data).then(res => {
                hideLoader()
                if (res.data.success) {
                    userEvent("Add FAQ")
                    NotificationManager.success(res.data.message);
                    fetchFAQ()
                    setAddFAQFormShow(false)
                    setAddFAQ("")
                    setAddFAQAns("")
                    setEditorStateFAQ(EditorState.createEmpty())
                } else {
                    NotificationManager.error(res.data.message);
                }
            })
        }


    }
    const addFAQOtherFun = () => {
        var err = 0
        SetFaqQueError(false)
        SetFaqAnsError(false)
        SetFaqAnsLengthError(false)
        if (addFAQ.trim() == '') {
            SetFaqQueError(true)
            err++
        }
        const hasText = editorStateFAQOther.getCurrentContent().hasText()
        const blocks = convertToRaw(editorStateFAQOther.getCurrentContent()).blocks;
        const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
        if (!hasText) {
            SetFaqAnsError(true)
            err++
        } else if (value.length > 500) {
            SetFaqAnsLengthError(true)
            err++
        }
        var faqObj = {
            "qtn": addFAQ,
            "ans": draftToHtml(convertToRaw(editorStateFAQOther.getCurrentContent()))
        }
        let data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "faqList": [faqObj]
        }
        if (err == 0) {
            showLoader()
            addFAQContent(data).then(res => {
                hideLoader()
                if (res.data.success) {
                    userEvent("Add FAQ")
                    NotificationManager.success(res.data.message);
                    fetchFAQ()
                    setAddFAQFormShow(false)
                    setAddFAQ("")
                    setAddFAQAns("")
                    setEditorStateFAQOther(EditorState.createEmpty())
                } else {
                    NotificationManager.error(res.data.message);
                }
            })
        }

    }
    const faqCancel = () => {
        setAddFAQFormShow(false)
        SetFaqQueError(false)
        SetFaqAnsError(false)
        SetFaqAnsLengthError(false)
    }
    function editCancelFaq(index) {
        setEditQue("")
        setEditAns("")
        setIsUpdate("")
        document.getElementById('editfaq_e' + index).style.display = 'none';
        document.getElementById('editfaq_v' + index).style.display = 'block';
        document.getElementById('edit_qst' + index).style.display = 'none';
        document.getElementById('edit_qst_v' + index).style.display = 'block';
        for (var i = 0; i < faqData.length; i++) {
            if (i == index) {
                console.log(i)
                $('#edit_btn' + i).removeClass('div_display_none')
                $('#edit_btn' + i).addClass('d-inline')
                $('#cancel_btn' + i).removeClass('div_display_none')
                $('#cancel_btn' + i).addClass('d-inline')
                $('#col_arrow' + i).removeClass('div_display_none')
            } else {
                $('#edit_btn' + i).removeClass('div_display_none')
                $('#cancel_btn' + i).removeClass('div_display_none')
                $('#col_arrow' + i).removeClass('div_display_none')

            }
        }
    }
    const updateFaqFun = (index) => {
        var err = 0
        SetFaqQueEditError(false)
        SetFaqAnsEditError(false)
        SetFaqAnsEditLengthError(false)
        if (editQue.trim() == '') {
            SetFaqQueEditError(true)
            err++
        }
        for (let [i, data] of faqData.entries()) {
            const hasText = data.editorState.getCurrentContent().hasText()
            const blocks = convertToRaw(data.editorState.getCurrentContent()).blocks;
            const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
            if (i == index) {
                if (!hasText) {
                    $("#editfiled" + i).addClass('error-fill')
                    $("#ansErr" + i).show()
                    err++
                    return false
                } else {
                    $("#editfiled" + i).removeClass('error-fill')
                    $("#ansErr" + i).hide()
                }
                if (value.length > 500) {
                    $("#editfiled" + i).addClass('error-fill')
                    $("#ansvalidErr" + i).show()
                    err++
                } else {
                    $("#editfiled" + i).removeClass('error-fill')
                    $("#ansvalidErr" + i).hide()
                }
            }
        }
        let data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "id": faqId,
            "qtn": editQue,
            "ans": draftToHtml(convertToRaw(faqData[index].editorState.getCurrentContent()))
        }
        if (err == 0) {
            showLoader()
            updateFAQContent(data).then(res => {
                hideLoader()
                if (res.data.success) {
                    editCancelFaq(index)
                    fetchFAQ()
                    userEvent("Update FAQ")
                    NotificationManager.success(res.data.message);
                } else {
                    NotificationManager.error(res.data.message);
                }
            })
        }
    }
    function editfaq(que, ans, index) {
        for (var i = 0; i < faqData.length; i++) {
            if (i == index) {
                console.log(i)
                $('#edit_btn' + i).addClass('div_display_none')
                $('#edit_btn' + i).removeClass('d-inline')
                $('#cancel_btn' + i).addClass('div_display_none')
                $('#cancel_btn' + i).removeClass('d-inline')
                $('#col_arrow' + i).addClass('div_display_none')
            } else {
                $('#edit_btn' + i).removeClass('div_display_none')
                $('#cancel_btn' + i).removeClass('div_display_none')
                $('#col_arrow' + i).removeClass('div_display_none')
            }
        }
        for (var i = 0; i < faqData.length; i++) {
            if (i == index) {
            } else {
                document.getElementById('editfaq_e' + i).style.display = 'none';
                document.getElementById('editfaq_v' + i).style.display = 'block';
                document.getElementById('edit_qst' + i).style.display = 'none';
                document.getElementById('edit_qst_v' + i).style.display = 'block';
            }
        }
        setEditQue(que)
        var html
        if (ans) {
            html = ans
        } else {
            html = "<p></p>"
        }
        const contentBlock = htmlToDraft(html);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorStates = EditorState.createWithContent(contentState);
        var tempArr = []
        for (var i = 0; i < faqData.length; i++) {
            if (i == isIndex) {
                faqData[i].editorState = editorStates
                setIsUpdate(faqData[i].id)
            } else {
                faqData[i].editorState = EditorState.createEmpty()
            }
            var value = {
                id: faqData[i].id,
                question: faqData[i].question,
                ans: faqData[i].ans,
                isDisabled: faqData[i].isDisabled,
                isActive: faqData[i].isActive,
                editorState: faqData[i].editorState
            }
            tempArr.push(value)
        }
        setfaqData(tempArr)
        document.getElementById('editfaq_e' + index).style.display = 'block';
        document.getElementById('editfaq_v' + index).style.display = 'none';
        document.getElementById('edit_qst' + index).style.display = 'block';
        document.getElementById('edit_qst_v' + index).style.display = 'none';
    }
    const handleFAQShow = () => {
        setShowDeleteFAQ(true)
    };
    const cancelEditCom = () => {
        document.getElementById('addpl_dv_com').style.display = 'none';
        document.getElementById('edit_dv_com1').style.display = 'block';
    }
    const handleFAQShowCancel = () => {
        setShowDeleteFAQ(false)
    };
    const onDeleteFaq = () => {
        let data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "id": faqId
        }
        showLoader()
        deleteFAQContent(data).then(res => {
            hideLoader()
            if (res.data.success) {
                fetchFAQ()
                handleFAQShowCancel()
                NotificationManager.success(res.data.message);
                userEvent("Delete FAQ")
            } else {
                NotificationManager.error(res.data.message);
            }
        })
    }
    const setFaqRow = (index, data) => {
        setIsIndex(index)
        var tempArr = []
        for (var i = 0; i < faqData.length; i++) {
            document.getElementById('editfaq_e' + i).style.display = 'none';
            document.getElementById('editfaq_v' + i).style.display = 'block';
            document.getElementById('edit_qst' + i).style.display = 'none';
            document.getElementById('edit_qst_v' + i).style.display = 'block';
            if (faqData[i].isActive == false) {
                if (i == index) {
                    $('#tr_row_faq' + i).addClass('faqRow')
                    $('#collapseExample' + i).addClass('show')
                    $('#collapseExample' + i).removeClass('hide')
                    $('#arrow_img' + i).addClass('bi bi-chevron-up')
                    $('#arrow_img' + i).removeClass('bi bi-chevron-down')
                    faqData[i].isDisabled = false
                    faqData[i].isActive = true
                } else {
                    $('#tr_row_faq' + i).removeClass('faqRow')
                    $('#collapseExample' + i).addClass('hide')
                    $('#collapseExample' + i).removeClass('show')
                    $('#arrow_img' + i).addClass('bi bi-chevron-down')
                    $('#arrow_img' + i).removeClass('bi bi-chevron-up')
                    faqData[i].isDisabled = true
                    faqData[i].isActive = false
                }
                var value = {
                    id: faqData[i].id,
                    question: faqData[i].question,
                    ans: faqData[i].ans,
                    isDisabled: faqData[i].isDisabled,
                    isActive: faqData[i].isActive,
                    editorState: faqData[i].editorState
                }
                tempArr.push(value)
            } else if (faqData[i].isActive == true) {
                if (i == index) {
                    $('#tr_row_faq' + i).removeClass('faqRow')
                    $('#collapseExample' + i).addClass('hide')
                    $('#collapseExample' + i).removeClass('show')
                    $('#arrow_img' + i).addClass('bi bi-chevron-down')
                    $('#arrow_img' + i).removeClass('bi bi-chevron-up')
                    faqData[i].isDisabled = true
                    faqData[i].isActive = false
                } else {
                    $('#tr_row_faq' + i).removeClass('faqRow')
                    $('#collapseExample' + i).addClass('hide')
                    $('#collapseExample' + i).removeClass('show')
                    $('#arrow_img' + i).addClass('bi bi-chevron-down')
                    $('#arrow_img' + i).removeClass('bi bi-chevron-up')
                    faqData[i].isDisabled = true
                    faqData[i].isActive = false
                }
                var value = {
                    id: faqData[i].id,
                    question: faqData[i].question,
                    ans: faqData[i].ans,
                    isDisabled: faqData[i].isDisabled,
                    isActive: faqData[i].isActive,
                    editorState: faqData[i].editorState
                }
                tempArr.push(value)
            }
        }
        setfaqData(tempArr)
    }
    //HRA COVER//
    const getHraCover = () => {
        let data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
        }
        showLoader()
        getHRACover(data).then(result => {
            hideLoader()
            setHraCover(result.data.response.result);
            setSelectedCover(result.data.response.selectedId);
        })
    }
    const updHRACover = (imgId) => {
        let data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "img_id": imgId
        }
        showLoader()
        updateHRACover(data).then(res => {
            hideLoader()
            if (res.data.success) {
                NotificationManager.success(res.data.message);
                userEvent("Update hra cover")
                getHraCover();
            } else {
                NotificationManager.error(res.data.message);
            }
        })
    }
    //privacy policy//
    function createMarkup() {
        return { __html: policyData };
    }
    const fetchPolicy = () => {
        let data = {
            'userId': getUserData().response.userId,
            'orgId': getUserData().response.orgn_id,
            'type': userLevel + ""
        }
        showLoader()
        fetchPrivacyPolicy(data).then(result => {
            hideLoader()
            if (result.data.success) {
                if (!result.data.response.company || !result.data.response.company.policydesc && result.data.response.hygge || !result.data.response.hygge || !result.data.response.hygge.policydesc) {
                    setPolicyData(result.data.response.hygge.policydesc)
                    const html = "<p></p>";
                    const contentBlock = htmlToDraft(html);
                    if (contentBlock) {
                        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                        const editorState = EditorState.createWithContent(contentState);
                        setEditorStateOther(editorState)
                    }
                } else {
                    setPolicyData(result.data.response.hygge.policydesc)
                    setotherPolicyData(result.data.response.company.policydesc)
                    const html = result.data.response.company.policydesc;
                    const contentBlock = htmlToDraft(html);
                    if (contentBlock) {
                        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                        const editorState = EditorState.createWithContent(contentState);
                        setEditorStateOther(editorState)
                    }
                }
            }
        })
    }
    const onSavePolicy = () => {
        let data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "policydesc": draftToHtml(convertToRaw(editorState.getCurrentContent()))
        }
        showLoader()
        updatePolicy(data).then(res => {
            hideLoader()
            if (res.data.success) {
                fetchPolicy()
                $('#cancelBtn').click()
                NotificationManager.success(res.data.message);
                userEvent("Save privacy policy")
            } else {
                NotificationManager.error(res.data.message);
            }
        })
    }
    function cancelAddPol() {
        document.getElementById('addpl_dv').style.display = 'none';
        document.getElementById('edit_dv').style.display = 'block';
    }
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    };
    const onEditorStateChangeOther = (editorState) => {
        setEditorStateOther(editorState)
    };
    const editpolCom = () => {
        document.getElementById('addpl_dv_com').style.display = 'block';
        document.getElementById('edit_dv_com1').style.display = 'none';
    }
    function createMarkupCom() {
        return { __html: otherpolicyData };
    }
    const onSaveComPolicy = () => {
        let data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "policydesc": draftToHtml(convertToRaw(editorStateOther.getCurrentContent()))
        }
        showLoader()
        updatePolicy(data).then(res => {
            hideLoader()
            if (res.data.success) {
                fetchPolicy()
                $('#cancelBtn').click()
                NotificationManager.success(res.data.message);
                userEvent("Save privacy policy")
            } else {
                NotificationManager.error(res.data.message);
            }
        })
    }

    const [smtpBtn, setSmtpBtn] = useState(false)


    const smtpCheckFun = () => {
        setServerAddressError(false)
        setUsernameError(false)
        setPasswordError(false)
        setPortNumberError(false)
        setDefaultSenderError(false)
        setDefaultSenderNameError(false)

        var err = 0


        if (serverAddress.trim() == '') {
            setServerAddressError(true)
            err++
        }

        if (username.trim() == '') {
            setUsernameError(true)
            err++
        }

        if (password == '') {
            setPasswordError(true)
            err++
        }


        if (portNumber == '') {
            setPortNumberError(true)
            err++
        }

        if (defaultSender.trim() == '') {
            setDefaultSenderError(true)
            err++
        }

        if (defaultSenderName.trim() == '') {
            setDefaultSenderNameError(true)
            err++
        }


        if (err == 0) {

            var data = {
                "smtp_server_address": serverAddress.trim(),
                "username": username.trim(),
                "password": password,
                "enp_type": encryptionType,
                "port_no": portNumber,
                "sender": defaultSender.trim(),
                "sender_name": defaultSenderName.trim()
            }

            showLoader()
            checkSmtp(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    setSmtpBtn(true)
                    NotificationManager.success(result.data.message);
                } else {
                    setSmtpBtn(false)
                    NotificationManager.error(result.data.message);
                }
            })
        }
    }

    function showUpload() {
        const image = document.getElementById('file');
        image.click();
    }

    function uploadLic() {
        console.log(".......")
        const image = document.getElementById('file');
        const file = image.files;
        console.log(file)
        if (file) {
            const fileData = new FormData();
            fileData.append('file', file[0])

            uploadLicence(fileData).then(result => {
                if(result.success){
                    NotificationManager.success(result.message);
                    getCompanyInfoFun()
                }else{
                    NotificationManager.error(result.message);
                }
                
            })


        }

    }

    return (
        <>
            <div className="main">
                <main className="content">
                    <div className="container-fluid p-0">
                        <div className="row mb-2 mb-lg-4">
                            <div className="col-md-12 main-hdng">
                                <div className="hesd_ng">
                                    <h3 className="setngs">Settings</h3>
                                </div>

                                <br className="clear" />
                                <div className="addcompny_tab mt-4">

                                    {/* TAB */}
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">

                                        {/* PROFILE TAB */}
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link active"
                                                id="prof_t-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#prof_t"
                                                type="button"
                                                role="tab"
                                                aria-controls="prof_t"
                                                aria-selected="true"
                                                onClick={getCompanyInfoFun}
                                            >
                                                Profile
                                            </button>
                                        </li>

                                        {/* FAQ TAB */}
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="faq_t-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#faq_t"
                                                type="button"
                                                role="tab"
                                                aria-controls="faq_t"
                                                aria-selected="false"
                                                onClick={faqBtnClick}
                                            >
                                                FAQ
                                            </button>
                                        </li>

                                        {/* PRICACY POLICY */}
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="ppol_t-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#ppol_t"
                                                type="button"
                                                role="tab"
                                                aria-controls="ppol_t"
                                                aria-selected="false"
                                                onClick={fetchPolicy}
                                            >
                                                Privacy Policy
                                            </button>
                                        </li>

                                        {/* HRA COVER */}
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="hracov_t-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#hracov_t"
                                                type="button"
                                                role="tab"
                                                aria-controls="hracov_t"
                                                aria-selected="false"
                                                onClick={getHraCover}
                                            >
                                                HRA Cover
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <div className="mb-4">

                                    <div className="tab-content" id="myTabContent">

                                        {/* PROFILE */}
                                        <div className="tab-pane fade show active bg-white shadow_d rounded-3" id="prof_t"
                                            role="tabpanel" aria-labelledby="prof_dtlt-tab">

                                            <div className="pt-4 pb-5 px-5 dashboard_body_box">

                                                <div className="conpnay_detail_top d-flex justify-content-lg-start align-items-center mb-4">
                                                    <span className="comp_prf_rou"><img className="me-3" src={imgUrl + companyData.organisation_logo} /></span>
                                                    <div className="comp-pro_chnge">
                                                        <h3>{companyData.organisation_name}</h3>
                                                        <button
                                                            disabled={!canEdit}
                                                            className="btn btn-nobg btn-lg"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#changepass"
                                                            onClick={handleShow}
                                                        >
                                                            Change Password
                                                        </button>
                                                    </div>

                                                </div>

                                                <div className="conpnay_detail_cont">

                                                    {/* Profile Details */}
                                                    <div className="comp_dtPhed">
                                                        <strong>Profile Details</strong>
                                                        <div className="btn_edit">
                                                            {
                                                                profileEdit ?
                                                                    <div>
                                                                        <button className="btn btn-nobg btn-witbord" disabled={!canEdit} onClick={profileEditFun}>Cancel</button>
                                                                        <button className="btn btn-primary" disabled={!canEdit} onClick={onSave}>Save</button>

                                                                    </div>
                                                                    :
                                                                    <div>
                                                                        <button className="btn btn-primary" disabled={!canEdit} onClick={profileEditFun}>Edit</button>
                                                                    </div>
                                                            }
                                                        </div>
                                                    </div>

                                                    {
                                                        profileEdit ?
                                                            <div className="conpnay_detail_in comp_edit">
                                                                <div className="comp_list">
                                                                    <span>Company Logo :</span>
                                                                    <FileUploader
                                                                        handleChange={handleChange}
                                                                        name="file"
                                                                        types={fileTypes}
                                                                        children={stack}
                                                                    />
                                                                </div>

                                                                <div className="comp_list">
                                                                    <span>Company Type :</span>
                                                                    <div className={`add_fild_com ${comTypeError ? "error-fil" : ""}`}>
                                                                        <select
                                                                            className="form-select"
                                                                            value={companyType}
                                                                            onChange={(e) => setCompanyType(e.target.value)}
                                                                            required
                                                                            disabled
                                                                        >
                                                                            <option value="">Select</option>
                                                                            <option value="Healthcare">Healthcare</option>
                                                                            <option value="Non-Healthcare">Non-Healthcare</option>
                                                                        </select>
                                                                        {
                                                                            comTypeError ?
                                                                                <span className='errorfiled'>Select company type</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Industry Type :</span>
                                                                    <div className={`add_fild_com ${indTypeError ? "error-fil" : ""}`}>

                                                                        <select
                                                                            className="form-select"
                                                                            value={industryType}
                                                                            onChange={(e) => setIndustryType(e.target.value)}
                                                                            required
                                                                        >
                                                                            <option value="">Select</option>
                                                                            {
                                                                                indTypeArray.map((item) => (
                                                                                    <option key={item.id} value={item.id}>{item.typedesc}</option>
                                                                                ))
                                                                            }

                                                                        </select>
                                                                        {
                                                                            indTypeError ?
                                                                                <span className='errorfiled'>Select industry type</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className="comp_list">
                                                                    <span>No. of Employees :</span>
                                                                    <div className={`add_fild_com ${noOfEmpError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={noOfEmployee}
                                                                            onChange={(e) => setNoOfEmployee(e.target.value)}
                                                                            required
                                                                        />
                                                                        {
                                                                            noOfEmpError ?
                                                                                <span className='errorfiled'>Enter the no. of employees</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>


                                                                <div className="comp_list">
                                                                    <span>Established Year :</span>
                                                                    <div className={`add_fild_com ${estYrError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="date"
                                                                            className="form-control"
                                                                            value={establishedYear}
                                                                            onChange={(e) => setEstablishedYear(e.target.value)}
                                                                            required
                                                                            max={establishedYear}
                                                                        />
                                                                        <i className="bi bi-calendar4"></i>
                                                                        {
                                                                            estYrError ?
                                                                                <span className='errorfiled'>Select the established year</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className="comp_list">
                                                                    <span>Website :</span>
                                                                    <div className={`add_fild_com ${webError || webUrlError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={website}
                                                                            onChange={(e) => setWebsite(e.target.value)}
                                                                            required
                                                                        />
                                                                        {
                                                                            webError ?
                                                                                <span className='errorfiled'>Enter the website url</span>
                                                                                : null
                                                                        }
                                                                        {
                                                                            webUrlError ?
                                                                                <span className='errorfiled'>Enter valid url</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className="comp_list">
                                                                    <span>Email ID :</span>
                                                                    <div className={`add_fild_com ${comEmailIdError || validEmailError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={comEmailID}
                                                                            onChange={(e) => setComEmailID(e.target.value)}
                                                                            required
                                                                        />
                                                                        {
                                                                            comEmailIdError ?
                                                                                <span className='errorfiled'>Enter the email id</span>
                                                                                : null
                                                                        }
                                                                        {
                                                                            validEmailError ?
                                                                                <span className='errorfiled'>Enter valid email id</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Contact Number :</span>
                                                                    <div className={`add_fild_com ${comConNoError || validContactError ? "error-fil" : ""}`}>

                                                                        <div className="contct_no">

                                                                            <select className="form-select"
                                                                                value={counrtyCode}
                                                                                onChange={(e) => setCounrtyCode(e.target.value)}
                                                                                required
                                                                            >
                                                                                <option value="">Select</option>
                                                                                <option data-countrycode="DZ" value="+213">DZ</option>
                                                                                <option data-countrycode="AD" value="+376">AD</option>
                                                                                <option data-countrycode="AO" value="+244">AO</option>
                                                                                <option data-countrycode="AI" value="+1264">AI</option>
                                                                                <option data-countrycode="AG" value="+1268">AG</option>
                                                                                <option data-countrycode="AR" value="+54">AR</option>
                                                                                <option data-countrycode="AM" value="+374">AM</option>
                                                                                <option data-countrycode="AW" value="+297">AW</option>
                                                                                <option data-countrycode="AU" value="+61">AU</option>
                                                                                <option data-countrycode="AT" value="+43">AT</option>
                                                                                <option data-countrycode="AZ" value="+994">AZ</option>
                                                                                <option data-countrycode="BS" value="+1242">BS</option>
                                                                                <option data-countrycode="BH" value="+973">BH</option>
                                                                                <option data-countrycode="BD" value="+880">BD</option>
                                                                                <option data-countrycode="BB" value="+1246">BB</option>
                                                                                <option data-countrycode="BY" value="+375">BY</option>
                                                                                <option data-countrycode="BE" value="+32">BE</option>
                                                                                <option data-countrycode="BZ" value="+501">BZ</option>
                                                                                <option data-countrycode="BJ" value="+229">BJ</option>
                                                                                <option data-countrycode="BM" value="+1441">BM</option>
                                                                                <option data-countrycode="BT" value="+975">BT</option>
                                                                                <option data-countrycode="BO" value="+591">BO</option>
                                                                                <option data-countrycode="BA" value="+387">BA</option>
                                                                                <option data-countrycode="BW" value="+267">BW</option>
                                                                                <option data-countrycode="BR" value="+55">BR</option>
                                                                                <option data-countrycode="BN" value="+673">BN</option>
                                                                                <option data-countrycode="BG" value="+359">BG</option>
                                                                                <option data-countrycode="BF" value="+226">BF</option>
                                                                                <option data-countrycode="BI" value="+257">BI</option>
                                                                                <option data-countrycode="KH" value="+855">KH</option>
                                                                                <option data-countrycode="CM" value="+237">CM</option>
                                                                                <option data-countrycode="CA" value="+124">CA</option>
                                                                                <option data-countrycode="CV" value="+238">CV</option>
                                                                                <option data-countrycode="KY" value="+1345">KY</option>
                                                                                <option data-countrycode="CF" value="+236">CF</option>
                                                                                <option data-countrycode="CL" value="+56">CL</option>
                                                                                <option data-countrycode="CN" value="+86">CN</option>
                                                                                <option data-countrycode="CO" value="+57">CO</option>
                                                                                <option data-countrycode="KM" value="+269">KM</option>
                                                                                <option data-countrycode="CG" value="+242">CG</option>
                                                                                <option data-countrycode="CK" value="+682">CK</option>
                                                                                <option data-countrycode="CR" value="+506">CR</option>
                                                                                <option data-countrycode="HR" value="+385">HR</option>
                                                                                <option data-countrycode="CU" value="+53">CU</option>
                                                                                <option data-countrycode="CY" value="+90392">CY</option>
                                                                                <option data-countrycode="CY" value="+357">CY</option>
                                                                                <option data-countrycode="CZ" value="+42">CZ</option>
                                                                                <option data-countrycode="DK" value="+45">DK</option>
                                                                                <option data-countrycode="DJ" value="+253">DJ</option>
                                                                                <option data-countrycode="DM" value="+1809">DM</option>
                                                                                <option data-countrycode="DO" value="+1809">DO</option>
                                                                                <option data-countrycode="EC" value="+593">EC</option>
                                                                                <option data-countrycode="EG" value="+20">EG</option>
                                                                                <option data-countrycode="SV" value="+503">SV</option>
                                                                                <option data-countrycode="GQ" value="+240">GQ</option>
                                                                                <option data-countrycode="ER" value="+291">ER</option>
                                                                                <option data-countrycode="EE" value="+372">EE</option>
                                                                                <option data-countrycode="ET" value="+251">ET</option>
                                                                                <option data-countrycode="FK" value="+500">FK</option>
                                                                                <option data-countrycode="FO" value="+298">FO</option>
                                                                                <option data-countrycode="FJ" value="+679">FJ</option>
                                                                                <option data-countrycode="FI" value="+358">FI</option>
                                                                                <option data-countrycode="FR" value="+33">FR</option>
                                                                                <option data-countrycode="GF" value="+594">GF</option>
                                                                                <option data-countrycode="PF" value="+689">PF</option>
                                                                                <option data-countrycode="GA" value="+241">GA</option>
                                                                                <option data-countrycode="GM" value="+220">GM</option>
                                                                                <option data-countrycode="GE" value="+7880">GE</option>
                                                                                <option data-countrycode="DE" value="+49">DE</option>
                                                                                <option data-countrycode="GH" value="+233">GH</option>
                                                                                <option data-countrycode="GI" value="+350">GI</option>
                                                                                <option data-countrycode="GR" value="+30">GR</option>
                                                                                <option data-countrycode="GL" value="+299">GL</option>
                                                                                <option data-countrycode="GD" value="+1473">GD</option>
                                                                                <option data-countrycode="GP" value="+590">GP</option>
                                                                                <option data-countrycode="GU" value="+671">GU</option>
                                                                                <option data-countrycode="GT" value="+502">GT</option>
                                                                                <option data-countrycode="GN" value="+224">GN</option>
                                                                                <option data-countrycode="GW" value="+245">GW</option>
                                                                                <option data-countrycode="GY" value="+592">GY</option>
                                                                                <option data-countrycode="HT" value="+509">HT</option>
                                                                                <option data-countrycode="HN" value="+504">HN</option>
                                                                                <option data-countrycode="HK" value="+852">HK</option>
                                                                                <option data-countrycode="HU" value="+36">HU</option>
                                                                                <option data-countrycode="IS" value="+354">IS</option>
                                                                                <option data-countrycode="IN" value="+91">IN</option>
                                                                                <option data-countrycode="ID" value="+62">ID</option>
                                                                                <option data-countrycode="IR" value="+98">IR</option>
                                                                                <option data-countrycode="IQ" value="+964">IQ</option>
                                                                                <option data-countrycode="IE" value="+353">IE</option>
                                                                                <option data-countrycode="IL" value="+972">IL</option>
                                                                                <option data-countrycode="IT" value="+39">IT</option>
                                                                                <option data-countrycode="JM" value="+1876">JM</option>
                                                                                <option data-countrycode="JP" value="+81">JP</option>
                                                                                <option data-countrycode="JO" value="+962">JO</option>
                                                                                <option data-countrycode="KZ" value="+7">KZ</option>
                                                                                <option data-countrycode="KE" value="+254">KE</option>
                                                                                <option data-countrycode="KI" value="+686">KI</option>
                                                                                <option data-countrycode="KP" value="+850">KP</option>
                                                                                <option data-countrycode="KR" value="+82">KR</option>
                                                                                <option data-countrycode="KW" value="+965">KW</option>
                                                                                <option data-countrycode="KG" value="+996">KG</option>
                                                                                <option data-countrycode="LA" value="+856">LA</option>
                                                                                <option data-countrycode="LV" value="+371">LV</option>
                                                                                <option data-countrycode="LB" value="+961">LB</option>
                                                                                <option data-countrycode="LS" value="+266">LS</option>
                                                                                <option data-countrycode="LR" value="+231">LR</option>
                                                                                <option data-countrycode="LY" value="+218">LY</option>
                                                                                <option data-countrycode="LI" value="+417">LI</option>
                                                                                <option data-countrycode="LT" value="+370">LT</option>
                                                                                <option data-countrycode="LU" value="+352">LU</option>
                                                                                <option data-countrycode="MO" value="+853">MO</option>
                                                                                <option data-countrycode="MK" value="+389">MK</option>
                                                                                <option data-countrycode="MG" value="+261">MG</option>
                                                                                <option data-countrycode="MW" value="+265">MW</option>
                                                                                <option data-countrycode="MY" value="+60">MY</option>
                                                                                <option data-countrycode="MV" value="+960">MV</option>
                                                                                <option data-countrycode="ML" value="+223">ML</option>
                                                                                <option data-countrycode="MT" value="+356">MT</option>
                                                                                <option data-countrycode="MH" value="+692">MH</option>
                                                                                <option data-countrycode="MQ" value="+596">MQ</option>
                                                                                <option data-countrycode="MR" value="+222">MR</option>
                                                                                <option data-countrycode="MUS" value="+230">MUS</option>
                                                                                <option data-countrycode="YT" value="+269">YT</option>
                                                                                <option data-countrycode="MX" value="+52">MX</option>
                                                                                <option data-countrycode="FM" value="+691">FM</option>
                                                                                <option data-countrycode="MD" value="+373">MD</option>
                                                                                <option data-countrycode="MC" value="+377">MC</option>
                                                                                <option data-countrycode="MN" value="+976">MN</option>
                                                                                <option data-countrycode="MS" value="+1664">MS</option>
                                                                                <option data-countrycode="MA" value="+212">MA</option>
                                                                                <option data-countrycode="MZ" value="+258">MZ</option>
                                                                                <option data-countrycode="MN" value="+95">MN</option>
                                                                                <option data-countrycode="NA" value="+264">NA</option>
                                                                                <option data-countrycode="NR" value="+674">NR</option>
                                                                                <option data-countrycode="NP" value="+977">NP</option>
                                                                                <option data-countrycode="NL" value="+31">NL</option>
                                                                                <option data-countrycode="NC" value="+687">NC</option>
                                                                                <option data-countrycode="NZ" value="+64">NZ</option>
                                                                                <option data-countrycode="NI" value="+505">NI</option>
                                                                                <option data-countrycode="NE" value="+227">NE</option>
                                                                                <option data-countrycode="NG" value="+234">NG</option>
                                                                                <option data-countrycode="NU" value="+683">NU</option>
                                                                                <option data-countrycode="NF" value="+672">NF</option>
                                                                                <option data-countrycode="NP" value="+670">NP</option>
                                                                                <option data-countrycode="NO" value="+47">NO</option>
                                                                                <option data-countrycode="OM" value="+968">OM</option>
                                                                                <option data-countrycode="PW" value="+680">PW</option>
                                                                                <option data-countrycode="PA" value="+507">PA</option>
                                                                                <option data-countrycode="PG" value="+675">PG</option>
                                                                                <option data-countrycode="PY" value="+595">PY</option>
                                                                                <option data-countrycode="PE" value="+51">PE</option>
                                                                                <option data-countrycode="PH" value="+63">PH</option>
                                                                                <option data-countrycode="PL" value="+48">PL</option>
                                                                                <option data-countrycode="PT" value="+351">PT</option>
                                                                                <option data-countrycode="PR" value="+1787">PR</option>
                                                                                <option data-countrycode="QA" value="+974">QA</option>
                                                                                <option data-countrycode="RE" value="+262">RE</option>
                                                                                <option data-countrycode="RO" value="+40">RO</option>
                                                                                <option data-countrycode="RU" value="+7">RU</option>
                                                                                <option data-countrycode="RW" value="+250">RW</option>
                                                                                <option data-countrycode="SM" value="+378">SM</option>
                                                                                <option data-countrycode="ST" value="+239">ST</option>
                                                                                <option data-countrycode="SA" value="+966">SA</option>
                                                                                <option data-countrycode="SN" value="+221">SN</option>
                                                                                <option data-countrycode="CS" value="+381">CS</option>
                                                                                <option data-countrycode="SC" value="+248">SC</option>
                                                                                <option data-countrycode="SL" value="+232">SL</option>
                                                                                <option data-countrycode="SG" value="+65">SG</option>
                                                                                <option data-countrycode="SK" value="+421">SK</option>
                                                                                <option data-countrycode="SI" value="+386">SI</option>
                                                                                <option data-countrycode="SB" value="+677">SB</option>
                                                                                <option data-countrycode="SO" value="+252">SO</option>
                                                                                <option data-countrycode="ZA" value="+27">ZA</option>
                                                                                <option data-countrycode="ES" value="+34">ES</option>
                                                                                <option data-countrycode="LK" value="+94">LK</option>
                                                                                <option data-countrycode="SH" value="+290">SH</option>
                                                                                <option data-countrycode="KN" value="+1869">KN</option>
                                                                                <option data-countrycode="SC" value="+1758">SC</option>
                                                                                <option data-countrycode="SD" value="+249">SD</option>
                                                                                <option data-countrycode="SR" value="+597">SR</option>
                                                                                <option data-countrycode="SZ" value="+268">SZ</option>
                                                                                <option data-countrycode="SE" value="+46">SE</option>
                                                                                <option data-countrycode="CH" value="+41">CH</option>
                                                                                <option data-countrycode="SI" value="+963">SI</option>
                                                                                <option data-countrycode="TW" value="+886">TW</option>
                                                                                <option data-countrycode="TJ" value="+7">TJ</option>
                                                                                <option data-countrycode="TH" value="+66">TH</option>
                                                                                <option data-countrycode="TG" value="+228">TG</option>
                                                                                <option data-countrycode="TO" value="+676">TO</option>
                                                                                <option data-countrycode="TT" value="+1868">TT</option>
                                                                                <option data-countrycode="TN" value="+216">TN</option>
                                                                                <option data-countrycode="TR" value="+90">TR</option>
                                                                                <option data-countrycode="TM" value="+7">TM</option>
                                                                                <option data-countrycode="TM" value="+993">TM</option>
                                                                                <option data-countrycode="TC" value="+1649">TC</option>
                                                                                <option data-countrycode="TV" value="+688">TV</option>
                                                                                <option data-countrycode="UG" value="+256">UG</option>
                                                                                <option data-countrycode="GB" value="+44">GB</option>
                                                                                <option data-countrycode="UA" value="+380">UA</option>
                                                                                <option data-countrycode="AE" value="+971">AE</option>
                                                                                <option data-countrycode="UY" value="+598">UY</option>
                                                                                <option data-countrycode="US" value="+1">US</option>
                                                                                <option data-countrycode="UZ" value="+7">UZ</option>
                                                                                <option data-countrycode="VU" value="+678">VU</option>
                                                                                <option data-countrycode="VA" value="+379">VA</option>
                                                                                <option data-countrycode="VE" value="+58">VE</option>
                                                                                <option data-countrycode="VN" value="+84">VN</option>
                                                                                <option data-countrycode="VG" value="+84">VG</option>
                                                                                <option data-countrycode="VI" value="+84">VI</option>
                                                                                <option data-countrycode="WF" value="+681">WF</option>
                                                                                <option data-countrycode="YE" value="+969">YE</option>
                                                                                <option data-countrycode="YE" value="+967">YE</option>
                                                                                <option data-countrycode="ZM" value="+260">ZM</option>
                                                                                <option data-countrycode="ZW" value="+263">ZW</option>
                                                                                <option data-countrycode="TZ" value="+255">TZ</option>
                                                                            </select>

                                                                            <input
                                                                                type="number"
                                                                                className="form-control"
                                                                                placeholder=""
                                                                                value={comContactNumber}
                                                                                onChange={(e) => setComContactNumber(e.target.value)}
                                                                                required
                                                                            />
                                                                        </div>
                                                                        {
                                                                            comConNoError ?
                                                                                <span className='errorfiled'>Enter the contact number</span>
                                                                                : null
                                                                        }
                                                                        {
                                                                            validContactError ?
                                                                                <span className='errorfiled'>Enter valid contact number</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className="comp_list">
                                                                    <span>Address :</span>
                                                                    <div className={`add_fild_com ${comAddressError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={comAddress}
                                                                            onChange={(e) => setComAddress(e.target.value)}
                                                                            required
                                                                        />
                                                                        {
                                                                            comAddressError ?
                                                                                <span className='errorfiled'>Enter the address</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className="comp_list">
                                                                    <span>Country &amp; City :</span>
                                                                    <div className={`add_fild_com ${conCityError ? "error-fil" : ""}`}>
                                                                        <div className="contct_no coun_cit">

                                                                            <select
                                                                                className="form-select"
                                                                                value={country}
                                                                                onChange={(e) => { setCountry(e.target.value); callCity(e.target.value); }}
                                                                                required
                                                                            >
                                                                                <option value="">Select</option>
                                                                                {
                                                                                    countryArray.map((item, index) => (
                                                                                        <option key={index} value={item.country}>{item.country}</option>
                                                                                    ))
                                                                                }
                                                                            </select>




                                                                            <select
                                                                                className="form-select"
                                                                                value={countryCity}
                                                                                onChange={(e) => setCountryCity(e.target.value)}
                                                                                required
                                                                            >

                                                                                <option value="">Select</option>
                                                                                {
                                                                                    cityArray.map((item, index) => (
                                                                                        <option key={index} value={item.city}>{item.city}</option>
                                                                                    ))
                                                                                }



                                                                            </select>




                                                                        </div>
                                                                        {
                                                                            conCityError ?
                                                                                <span className='errorfiled'>Select the country and city</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className="comp_list">
                                                                    <span> Location:</span>
                                                                    <div className={`add_fild_com ${locError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={location}
                                                                            onChange={(e) => setLocation(e.target.value)}
                                                                            required
                                                                        />
                                                                        {
                                                                            locError ?
                                                                                <span className='errorfiled'>Enter the location</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            :
                                                            <div className="conpnay_detail_in">
                                                                <div className="comp_list">
                                                                    <span>Company Type :</span>
                                                                    <strong>{companyData.organisation_type}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Industry Type :</span>
                                                                    <strong>{companyData.industry_name}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>No of Employees :</span>
                                                                    <strong>{companyData.total_emp}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Established Year :</span>
                                                                    <strong>{moment(companyData.organisation_established_yr).format('DD-MM-YYYY')}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Website :</span>
                                                                    <strong><a className='webcss' onClick={() => openURL(companyData.organisation_website)}>{companyData.organisation_website}</a></strong>
                                                                </div>
                                                                <div className="two_div_con d-flex">
                                                                    <div className="comp_list">
                                                                        <span>Email ID :</span>
                                                                        <strong><a className='a-tag'>{companyData.organisation_email}</a></strong>
                                                                    </div>
                                                                    <div className="comp_list">
                                                                        <span>Contact Number :</span>
                                                                        <strong>{companyData.organisation_countryCode} {companyData.organisation_phone}</strong>
                                                                    </div>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Address :</span>
                                                                    <strong>{companyData.organisation_address}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Country, City &amp; Location:</span>
                                                                    <strong>{companyData.organisation_country}, {companyData.organisation_city}, {companyData.organisation_location} </strong>
                                                                </div>

                                                            </div>
                                                    }

                                                    {/* Access & License Details */}
                                                    <div className="comp_dtPhed bt-1">
                                                        <strong>Access &amp; License Details</strong>
                                                        <div className="btn_edit">
                                                            {
                                                                accessEdit ?
                                                                    <div>
                                                                        <button className="btn btn-nobg btn-witbord" disabled={!canEdit} onClick={accessEditFun}>Cancel</button>
                                                                        <button className="btn btn-primary" disabled={!canEdit} onClick={onSave3}>Save</button>

                                                                    </div>
                                                                    :
                                                                    <div>
                                                                        {/* <button className="btn btn-primary" disabled={!canEdit} onClick={accessEditFun}>Edit</button> */}

                                                                    </div>

                                                            }
                                                        </div>
                                                    </div>


                                                    {
                                                        accessEdit ?
                                                            <div className="conpnay_detail_in comp_edit">
                                                                <div className="comp_list">
                                                                    <span>Type of Access :</span>
                                                                    <div className={`add_fild_com ${typeOfAccessError ? "error-fil" : ""}`}>
                                                                        <select
                                                                            className="form-select"
                                                                            value={typeOfAccess}
                                                                            onChange={(e) => setTypeOfAccess(e.target.value)}
                                                                            disabled
                                                                            required
                                                                        >
                                                                            <option value="">Select</option>
                                                                            <option value="1">Group</option>
                                                                            <option value="0">Company</option>
                                                                        </select>
                                                                        {
                                                                            typeOfAccessError ?
                                                                                <span className='errorfiled'>Select type of access</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>No of Licenses :</span>
                                                                    <div className={`add_fild_com ${noOfLicensesError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={noOfLicenses}
                                                                            onChange={(e) => setNoOfLicenses(e.target.value)}
                                                                            required
                                                                            disabled
                                                                            onKeyDown={(e) => {
                                                                                if (numberInputInvalidChars.includes(e.key)) {
                                                                                    e.preventDefault();
                                                                                }
                                                                            }}
                                                                        />
                                                                        {
                                                                            noOfLicensesError ?
                                                                                <span className='errorfiled'>Enter the no of licenses</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Start Date :</span>
                                                                    <div className={`add_fild_com ${startDateError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="date"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={startDate}
                                                                            onChange={(e) => { setStartDate(e.target.value); dateChange(e.target.value) }}
                                                                            required
                                                                            disabled
                                                                            min={startDate}
                                                                        />
                                                                        <i className="bi bi-calendar-minus"></i>
                                                                        {
                                                                            startDateError ?
                                                                                <span className='errorfiled'>Select the start date</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>End Date :</span>
                                                                    <div className={`add_fild_com ${endDateError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="date"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            max={startDate}
                                                                            value={endDate}
                                                                            onChange={(e) => setEndDate(e.target.value)}
                                                                            required
                                                                            disabled
                                                                        />
                                                                        <i className="bi bi-calendar-minus"></i>
                                                                        {
                                                                            endDateError ?
                                                                                <span className='errorfiled'>Select the end date</span>
                                                                                : null
                                                                        }
                                                                        {
                                                                            startEndDateError ?
                                                                                <span className='errorfiled'>Start date should be less than End date</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                {/* <div className="comp_list">
                                                                    <span>License Key :</span>
                                                                    <strong className="lic_key">{companyData.license_key}</strong>
                                                                </div> */}
                                                            </div>
                                                            :
                                                            <div className="conpnay_detail_in">
                                                                <div className="comp_list">
                                                                    <span>Type of Access :</span>
                                                                    <strong>{companyData.organisation_flag == "1" ? "Group" : "Company"}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>No of Licenses :</span>
                                                                    <strong>{companyData.number_of_license}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>No of Used Licenses :</span>
                                                                    <strong>{companyData.license_use}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Start Date :</span>
                                                                    <strong>{moment(companyData.license_start_datetime).format('DD-MM-YYYY')}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>End Date :</span>
                                                                    <strong>{moment(companyData.license_end_datetime).format('DD-MM-YYYY')}</strong>
                                                                </div>
                                                                {
                                                                    IMPORT_FILE ?
                                                                        <div className="comp_list">
                                                                            <span>Import :</span>
                                                                            <strong>
                                                                                <input type="file" id="file" onChange={uploadLic} style={{ display: 'none' }}  />
                                                                                <button class="btn btn-primary" onClick={showUpload}>Upload</button>
                                                                            </strong>
                                                                        </div>
                                                                        :
                                                                         null
                                                                }

                                                            </div>

                                                    }

                                                    {/* SMTP Settings */}
                                                    <div className="comp_dtPhed bt-1">
                                                        <strong>SMTP Settings</strong>
                                                        <div className="btn_edit">
                                                            {
                                                                smtpEdit ?
                                                                    <div>
                                                                        {
                                                                            smtpBtn ?
                                                                                <>
                                                                                    <button className="btn btn-nobg btn-witbord" onClick={smtpEditFun}>Cancel</button>
                                                                                    <button className="btn btn-primary" onClick={onSave4}>Save</button>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <button className="btn btn-nobg btn-witbord" onClick={smtpEditFun}>Cancel</button>
                                                                                    <button className="btn check btn-primary" onClick={smtpCheckFun}>Check Connection</button>
                                                                                </>
                                                                        }
                                                                    </div>
                                                                    :
                                                                    <div>
                                                                        <button className="btn btn-primary" onClick={smtpEditFun}>Edit</button>
                                                                    </div>

                                                            }
                                                        </div>
                                                    </div>


                                                    {
                                                        smtpEdit ?
                                                            <div class="conpnay_detail_in comp_edit">
                                                                <div class="comp_list">
                                                                    <span>SMTP Server :</span>
                                                                    <div className={`add_fild_com ${serverAddressError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={serverAddress}
                                                                            onChange={(e) => setServerAddress(e.target.value)}
                                                                            required
                                                                        />
                                                                        {
                                                                            serverAddressError ?
                                                                                <span className='errorfiled'>Enter the smtp server address</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div class="comp_list">
                                                                    <span>Username :</span>
                                                                    <div className={`add_fild_com ${usernameError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={username}
                                                                            onChange={(e) => setUsername(e.target.value)}
                                                                            required
                                                                        />
                                                                        {
                                                                            usernameError ?
                                                                                <span className='errorfiled'>Enter the username</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div class="comp_list">
                                                                    <span>Password :</span>
                                                                    <div className={`add_fild_com ${passwordError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={password}
                                                                            onChange={(e) => setPassword(e.target.value)}
                                                                            required
                                                                        />
                                                                        {
                                                                            passwordError ?
                                                                                <span className='errorfiled'>Enter the password</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div class="comp_list">
                                                                    <span>Encryption Type : </span>
                                                                    <div className={`add_fild_com ${encryptionTypeError ? "error-fil" : ""}`}>
                                                                        <select
                                                                            className="form-select"
                                                                            value={encryptionType}
                                                                            onChange={(e) => setEncryptionType(e.target.value)}
                                                                            required
                                                                        >
                                                                            <option value="0">None</option>
                                                                            <option value="1">SSL</option>
                                                                        </select>
                                                                        {
                                                                            encryptionTypeError ?
                                                                                <span className='errorfiled'>Select the encryption type</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div class="comp_list">
                                                                    <span>Port Number :</span>
                                                                    <div className={`add_fild_com ${portNumberError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={portNumber}
                                                                            onChange={(e) => setPortNumber(e.target.value)}
                                                                            required
                                                                        />
                                                                        {
                                                                            portNumberError ?
                                                                                <span className='errorfiled'>Enter the port number</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div class="comp_list">
                                                                    <span>Default Sender :</span>
                                                                    <div className={`add_fild_com ${defaultSenderError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={defaultSender}
                                                                            onChange={(e) => setDefaultSender(e.target.value)}
                                                                            required
                                                                        />
                                                                        {
                                                                            defaultSenderError ?
                                                                                <span className='errorfiled'>Enter the default sender</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div class="comp_list">
                                                                    <span>Default Sender Name :</span>
                                                                    <div className={`add_fild_com ${defaultSenderNameError ? "error-fil" : ""}`}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder=""
                                                                            value={defaultSenderName}
                                                                            onChange={(e) => setDefaultSenderName(e.target.value)}
                                                                            required
                                                                        />
                                                                        {
                                                                            defaultSenderNameError ?
                                                                                <span className='errorfiled'>Enter the default sender name</span>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="conpnay_detail_in">
                                                                <div className="comp_list">
                                                                    <span>SMTP Server :</span>
                                                                    <strong>{smtpData.smtp_server_address}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Username :</span>
                                                                    <strong>{smtpData.username}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Password :</span>
                                                                    <strong><input type="password" disabled value={smtpData.password} /></strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Encryption Type : </span>
                                                                    <strong>{smtpData.enp_type == "1" ? "SSL" : "None"}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Port Number :</span>
                                                                    <strong>{smtpData.port_no}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Default Sender :</span>
                                                                    <strong>{smtpData.sender}</strong>
                                                                </div>
                                                                <div className="comp_list">
                                                                    <span>Default Sender Name :</span>
                                                                    <strong>{smtpData.sender_name}</strong>
                                                                </div>
                                                            </div>
                                                    }

                                                </div>
                                            </div>
                                        </div>

                                        {/* FAQ */}
                                        <div className="tab-pane fade" id="faq_t" role="tabpanel" aria-labelledby="faq_t-tab">
                                            <div className="fq_src">
                                                <label>Search</label>
                                                <button><i className="bi bi-search"></i></button>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={search}
                                                    onChange={(e) => { setSearch(e.target.value) }}
                                                    onKeyUp={handleKeyPress}
                                                />
                                            </div>
                                            <div id="add_faq_dv" className="add_faq_dv bg-white shadow_d rounded-3 mt-4">
                                                <div className="add_faq_dv_hd"><strong>FAQs</strong> </div>
                                                {
                                                    faqData.length == 0 ?
                                                        <>
                                                            {
                                                                addFAQFormShow ?
                                                                    null :
                                                                    <div className="add_faq_dv_hd_blow">
                                                                        <div id="add_faq_ad_btn" className="add_faq_ad_btn">
                                                                            <button className="btn btn-nobg btn-lg addnewcn" disabled={!canEdit} onClick={adfaq}><i
                                                                                className="bi bi-plus-circle"></i> Add New FAQ</button>
                                                                        </div>
                                                                    </div>
                                                            }
                                                            {
                                                                addFAQFormShow ?
                                                                    <div>
                                                                        <div className="add_faq_ent">
                                                                            <div className={`add_faq_ent_in mt-3 ${faqQueError ? "error-fil" : ""}`}>
                                                                                <strong>Question</strong>
                                                                                <textarea
                                                                                    className="form-control"
                                                                                    value={addFAQ}
                                                                                    onChange={(e) => { setAddFAQ(e.target.value) }}
                                                                                >
                                                                                </textarea>
                                                                                {
                                                                                    faqQueError ? <><span className='errorfiled'>Enter the question</span></> : <></>
                                                                                }
                                                                                <strong className='mt-4'>Ans:</strong>
                                                                                <div className={`faq_ans_box ${faqAnsError || faqAnsLengthError ? "error-fil" : ""}`}>
                                                                                    <Editor
                                                                                        wrapperClassName="wrapper-class"
                                                                                        editorClassName="editor-class"
                                                                                        editorState={editorStateFAQ}
                                                                                        onEditorStateChange={onEditorStateChangeFaq}
                                                                                        toolbar={{
                                                                                            options: ['inline', 'list'],
                                                                                            inline: { inDropdown: false },
                                                                                            list: { inDropdown: true },
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                {
                                                                                    faqAnsError ? <><span className='errorfiled'>Enter the answer</span></> : null
                                                                                }
                                                                                {
                                                                                    faqAnsLengthError ? <><span className='errorfiled'>Enter the maximum 500 characters</span></> : null
                                                                                }

                                                                                <div className="btn_edit mt-5">
                                                                                    <button disabled={!canEdit} className="btn btn-primary" onClick={addFAQFun}>Save</button>
                                                                                    <button disabled={!canEdit} className="btn btn-nobg btn-witbord" onClick={faqCancel}>Cancel</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    : null
                                                            }
                                                        </>
                                                        :
                                                        <>
                                                            <div className="faq_q_a">
                                                                <div className="table-responsive">
                                                                    <table className="table table-hover">
                                                                        <thead>
                                                                            <tr role="row">
                                                                                <th width="9%" style={{ textAlign: "left", paddingLeft: "20px" }} align="left">S.No</th>
                                                                                <th width="80%" align="left">FAQs</th>
                                                                                <th width="10%" align="left">Actions</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                faqData.map((item, index) =>
                                                                                    <tr id={"tr_row_faq" + index} role="row" key={index}>
                                                                                        <td style={{ textAlign: "left", paddingLeft: "20px" }} align="left">{index + 1}.</td>
                                                                                        <td align="left">
                                                                                            <div className="edt_qs_dv d-flex align-items-center">
                                                                                                <span id={"edit_qst_v" + index}>{item.question}</span>
                                                                                                <span id={"edit_qst" + index} className="hide editInput">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className={`form-control ${faqQueEditError ? "error-fil" : ""}`}
                                                                                                        value={editQue}
                                                                                                        onChange={(e) => { setEditQue(e.target.value) }}

                                                                                                    />
                                                                                                    {
                                                                                                        faqQueEditError ? <><span className='errorfiled'>Enter the question</span></> : null
                                                                                                    }

                                                                                                </span>
                                                                                                {/* TOGGEL BUTTON */}
                                                                                                <a
                                                                                                    disabled={!canEdit}
                                                                                                    id={"col_arrow" + index}
                                                                                                    onClick={() => { setFaqRow(index) }}
                                                                                                    className="coll_aro collapsed "
                                                                                                    data-bs-toggle="collapse"
                                                                                                    href={"#collapseExample" + index}
                                                                                                    role="button" aria-expanded="false"
                                                                                                    aria-controls={"collapseExample" + index}>
                                                                                                    <i id={"arrow_img" + index} className='bi bi-chevron-down'></i>
                                                                                                </a>
                                                                                            </div>
                                                                                            <div className="answ_dv collapse " id={"collapseExample" + index}>
                                                                                                <div id={"editfaq_v" + index}>
                                                                                                    <strong>Ans:</strong>
                                                                                                    <div className="editor_div_camp editor_cls" dangerouslySetInnerHTML={{ __html: item.ans }} />
                                                                                                </div>
                                                                                                <div id={"editfaq_e" + index} className="hide mb-3">
                                                                                                    <strong>Ans:</strong>
                                                                                                    <div id={"editfiled" + index} className="edit-fill">
                                                                                                        <Editor
                                                                                                            wrapperClassName="wrapper-class"
                                                                                                            editorClassName="editor-class"
                                                                                                            editorState={item.editorState}
                                                                                                            onEditorStateChange={onEditorStateChange3}
                                                                                                            toolbar={{
                                                                                                                options: ['inline', 'list'],
                                                                                                                inline: { inDropdown: false },
                                                                                                                list: { inDropdown: true },
                                                                                                            }}
                                                                                                        />
                                                                                                    </div>
                                                                                                    <span className='errorfiled' id={"ansErr" + index} style={{ display: "none" }}>Enter the answer</span>
                                                                                                    <span className='errorfiled' id={"ansvalidErr" + index} style={{ display: "none" }}>Enter the maximum 500 characters</span>
                                                                                                    <div className="btn_edit mt-3">
                                                                                                        <button
                                                                                                            disabled={!canEdit}
                                                                                                            id="canEditBtn"
                                                                                                            onClick={() => { editCancelFaq(index) }}
                                                                                                            className="btn btn-nobg btn-witbord"
                                                                                                        >
                                                                                                            Cancel
                                                                                                        </button>


                                                                                                        <button
                                                                                                            disabled={!canEdit}
                                                                                                            className="btn btn-primary"
                                                                                                            onClick={() => { updateFaqFun(index) }}
                                                                                                        >
                                                                                                            Save
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </div>


                                                                                            </div>
                                                                                        </td>
                                                                                        <td align="left">

                                                                                            {/* EDIT BUTTON */}

                                                                                            <button id={"edit_btn" + index} disabled={item.isDisabled} className="d-inline" onClick={() => { editfaq(item.question, item.ans, index); setFaqId(item.id) }}><svg
                                                                                                xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                                                                fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                                                                <path
                                                                                                    d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z">
                                                                                                </path>
                                                                                            </svg>
                                                                                            </button>



                                                                                            {/* DELETE BUTTON */}
                                                                                            <button id={"cancel_btn" + index} disabled={!canEdit} onClick={() => { handleFAQShow(); setFaqId(item.id) }} className="d-inline ms-3"><svg xmlns="http://www.w3.org/2000/svg"
                                                                                                width="16" height="16" fill="currentColor"
                                                                                                className="bi bi-trash-fill" viewBox="0 0 16 16">
                                                                                                <path
                                                                                                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z">
                                                                                                </path>
                                                                                            </svg>
                                                                                            </button>


                                                                                        </td>
                                                                                    </tr>

                                                                                )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>

                                                            {
                                                                addFAQFormShow ?
                                                                    null :
                                                                    <div className="add_faq_dv_hd_blow">
                                                                        <div id="add_faq_ad_btn" className="add_faq_ad_btn">
                                                                            <button disabled={!canEdit} className="btn btn-nobg btn-lg addnewcn" onClick={adfaq}><i
                                                                                className="bi bi-plus-circle"></i> Add New FAQ</button>
                                                                        </div>
                                                                    </div>
                                                            }
                                                            {
                                                                addFAQFormShow ?
                                                                    <div>
                                                                        <div className="add_faq_ent">
                                                                            <div className={`add_faq_ent_in ${faqQueError ? "error-fil" : ""}  `}>
                                                                                <strong>Question</strong>
                                                                                <textarea
                                                                                    className="form-control"
                                                                                    value={addFAQ}
                                                                                    onChange={(e) => { setAddFAQ(e.target.value) }}
                                                                                >
                                                                                </textarea>
                                                                                {
                                                                                    faqQueError ? <><span className='errorfiled'>Enter the question</span></> : null
                                                                                }
                                                                                <strong className='mt-4'>Ans:</strong>
                                                                                <div className={`faq_ans_box ${faqAnsError || faqAnsLengthError ? "error-fil" : ""}`}>
                                                                                    <Editor
                                                                                        wrapperClassName="wrapper-class"
                                                                                        editorClassName="editor-class"
                                                                                        editorState={editorStateFAQOther}
                                                                                        onEditorStateChange={onEditorStateChangeFaqOther}
                                                                                        toolbar={{
                                                                                            options: ['inline', 'list'],
                                                                                            inline: { inDropdown: false },
                                                                                            list: { inDropdown: true },
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                {
                                                                                    faqAnsError ? <><span className='errorfiled'>Enter the answer</span></> : null
                                                                                }
                                                                                {
                                                                                    faqAnsLengthError ? <><span className='errorfiled'>Enter the maximum 500 characters</span></> : null
                                                                                }
                                                                                <div className="btn_edit mt-5">
                                                                                    <button disabled={!canEdit} className="btn btn-primary" onClick={addFAQOtherFun}>Save</button>
                                                                                    <button disabled={!canEdit} className="btn btn-nobg btn-witbord" onClick={faqCancel}>Cancel</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    : null
                                                            }
                                                        </>
                                                }
                                            </div>
                                        </div>

                                        {/* Privacy Policy */}
                                        <div className="tab-pane fade bg-white shadow_d rounded-3 p-5" id="ppol_t" role="tabpanel"
                                            aria-labelledby="ppol_t-tab">
                                            {
                                                userLevel == 2 ?
                                                    <>
                                                        <div id="" className="edit_dv">
                                                            <div className="ppolcy_hed">

                                                                <div className="ppolcy_hed_tab ppborder">
                                                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                                                        <li className="nav-item" role="presentation">
                                                                            <button className="nav-link" id="hppolcy_t-tab" data-bs-toggle="tab"
                                                                                data-bs-target="#hppolcy_t" type="button" role="tab" aria-controls="hppolcy_t"
                                                                                aria-selected="true">Hygge Privacy Policy </button>
                                                                        </li>
                                                                        <li className="nav-item" role="presentation">
                                                                            <button className="nav-link active" id="rppolcy_t-tab" data-bs-toggle="tab" data-bs-target="#rppolcy_t"
                                                                                type="button" role="tab" aria-controls="rppolcy_t" aria-selected="false">{getUserData().response.organisation_name} Privacy Policy</button>
                                                                        </li>

                                                                    </ul>
                                                                </div>

                                                            </div>

                                                            <div className="tab-content" id="myTabContent">

                                                                <div className="tab-pane fade show bg-white shadow_d rounded-3" id="hppolcy_t" role="tabpanel" aria-labelledby="hppolcy_t-tab">
                                                                    <div id="edit_dv_com">

                                                                        <div className="ed_min border-1 p-4 mt-4">
                                                                            {
                                                                                policyData ? <div className="editor_div_camp editor_cls" dangerouslySetInnerHTML={createMarkup()} /> : null
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="tab-pane fade show active" id="rppolcy_t" role="tabpanel" aria-labelledby="rppolcy_t-tab">


                                                                    <div id="edit_dv_com1" className='mt-3'>
                                                                        <div className="ppolcy_hed ppbtn">
                                                                            <strong>&nbsp;</strong>
                                                                            <button
                                                                                disabled={!canEdit}
                                                                                className="btn btn-primary btn-lg com"
                                                                                onClick={editpolCom}>
                                                                                {
                                                                                    otherpolicyData ? "Edit Policy" : "Add Policy"
                                                                                }
                                                                            </button>
                                                                        </div>

                                                                        <div className="ed_min border-1 p-4 mt-4">
                                                                            {
                                                                                otherpolicyData ?
                                                                                    <div className="editor_div_camp editor_cls" dangerouslySetInnerHTML={createMarkupCom()} /> : null
                                                                            }

                                                                        </div>
                                                                    </div>


                                                                    <div id="addpl_dv_com" className="hide mt-3">
                                                                        <div className="ppolcy_hed">
                                                                            <div className="btn_edit com">
                                                                                <button disabled={!canEdit} className="btn btn-primary" onClick={onSaveComPolicy} style={{ width: "90px", height: "40px" }}>Save</button>
                                                                                <button disabled={!canEdit} id="cancelBtn" className="btn btn-nobg btn-witbord" onClick={cancelEditCom} style={{ width: "100px", height: "40px" }}>Cancel</button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ed_min border-1 p-4 mt-4" id="editparent">
                                                                            <div id="editControls">

                                                                                {
                                                                                    otherpolicyData ?
                                                                                        <>
                                                                                            <Editor
                                                                                                wrapperClassName="wrapper-class"
                                                                                                editorClassName="editor-class"
                                                                                                editorState={editorStateOther}
                                                                                                onEditorStateChange={onEditorStateChangeOther}
                                                                                                toolbar={{
                                                                                                    options: ['inline', 'list'],
                                                                                                    inline: { inDropdown: false },
                                                                                                    list: { inDropdown: true },
                                                                                                }}
                                                                                            />
                                                                                        </> :
                                                                                        <>
                                                                                            <Editor
                                                                                                wrapperClassName="wrapper-class"
                                                                                                editorClassName="editor-class"
                                                                                                editorState={editorStateOther}
                                                                                                onEditorStateChange={onEditorStateChangeOther}
                                                                                                toolbar={{
                                                                                                    options: ['inline', 'list'],
                                                                                                    inline: { inDropdown: false },
                                                                                                    list: { inDropdown: true },
                                                                                                }}
                                                                                            />
                                                                                        </>
                                                                                }

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </> : null
                                            }
                                        </div>

                                        {/* HRA COVER */}
                                        <div className="tab-pane fade" id="hracov_t" role="tabpanel">
                                            <div className="hra_sec_tm">
                                                {
                                                    hraCover.map((item, index) =>
                                                        <div key={index} className={selectedCover == item.img_id ? "hra_sec_tm_in is_hra_sec_active bg-white shadow_d rounded-3 p-3" : "hra_sec_tm_in bg-white shadow_d rounded-3 p-3"}>
                                                            <img src={imgUrlAsset + item.image_name} />
                                                            <button className="btn btn-primary" disabled={!canEdit} onClick={() => updHRACover(item.img_id)}>Set as HRA Cover</button>
                                                        </div>
                                                    )}

                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div >
            <nav className="navbar navbar-expand navbar-light navbar-bg d-block">
                <div className="navbar-collapse collapse navright">
                    <LoggedLayout />
                </div>
            </nav>


            <Modal show={show} onHide={handleClose}>
                <div className="addrole">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mod_body">
                            <h5 className="modal-title text-center">Change Password</h5>
                            <div className="frm_modl">

                                <div className={`add_fild_com ${currPassNotify ? "error-fil" : ""}`}>
                                    <label>Current password</label>
                                    <input type={currvalues.showPassword ? "text" : "password"} id="txtPassword2" className="form-control mb-0" name="txtPassword2" placeholder="Enter your password" value={currPass}
                                        onChange={(e) => setCurrPass(e.target.value)} required />
                                    <button type="button" id="btnToggle" className="toggle">
                                        {

                                            currvalues.showPassword ? <i onClick={handleClickShowCurrPassword} id="eyeIcon" className="fa fa-fw fa-eye field-icon toggle-password"></i> : <i onClick={handleClickShowCurrPassword} id="eyeIcon" className="fa fa-fw field-icon toggle-password fa-eye-slash"></i>

                                        }
                                    </button>
                                    {
                                        currPassNotify ? <><span className='errorfiled'>Enter current password</span></> : <></>
                                    }


                                </div>
                                <div className={`add_fild_com ${newPassNotify ? "error-fil" : ""}`}>
                                    <label>New password </label>


                                    <input
                                        type={newvalues.showPassword ? "text" : "password"}
                                        id="txtPassword1"
                                        className="form-control mb-0"
                                        name="txtPassword1"
                                        placeholder="Enter your password"
                                        value={newPass}
                                        onKeyUp={passwordChanged}
                                        onChange={(e) => { setNewPass(e.target.value); }}
                                        required
                                    />
                                    {
                                        newPassNotify ? <><span className='errorfiled'>Enter new password</span></> : <></>
                                    }


                                    {
                                        newPass ? <div className="pass_mat" style={{ marginTop: "20px" }}>
                                            <p id="pass_text">At least 8 characters, with uppercase and lowercase case, a number, and a special
                                                character</p>
                                            <ul style={{ paddingLeft: '0' }}>
                                                <li id="week">&nbsp;</li>
                                                <li id="normal">&nbsp;</li>
                                                <li id="strong">&nbsp;</li>
                                            </ul>
                                        </div> : null
                                    }



                                    <button type="button" id="btnToggle2" className="toggle">
                                        {

                                            newvalues.showPassword ? <i onClick={handleClickShowNewPassword} id="eyeIcon" className="fa fa-fw fa-eye field-icon toggle-password"></i> : <i onClick={handleClickShowNewPassword} id="eyeIcon" className="fa fa-fw field-icon toggle-password fa-eye-slash"></i>

                                        }
                                    </button>

                                </div>
                                <div className={`add_fild_com ${cnfPassNotify ? "error-fil" : ""}`}>
                                    <label>Confirm your new password </label>
                                    <input type={cnfvalues.showPassword ? "text" : "password"} id="txtPassword3" className="form-control mb-0" name="txtPassword3" placeholder="Enter your password" value={cnfPass}
                                        onChange={(e) => setCnfPass(e.target.value)} required />
                                    <button type="button" id="btnToggle3" className="toggle">
                                        {

                                            cnfvalues.showPassword ? <i onClick={handleClickShowCnfPassword} id="eyeIcon" className="fa fa-fw fa-eye field-icon toggle-password"></i> : <i onClick={handleClickShowCnfPassword} id="eyeIcon" className="fa fa-fw field-icon toggle-password fa-eye-slash"></i>

                                        }
                                    </button>

                                    {
                                        cnfPassNotify ? <><span className='errorfiled'>Enter confirm password</span></> : <></>
                                    }
                                    {
                                        matchPassNotify ? <><span className='errorfiled'>New and confirm password should be same</span></> : <></>
                                    }
                                    {
                                        passMatchError ? <><span className='errorfiled mt-4' style={{ lineHeight: "16px" }}>At least 8 characters, with uppercase and lowercase case, a number, and a special character</span></> : <></>
                                    }
                                </div>


                                <div className="add_btn">
                                    <button type="button" className="btn btn-primary w-100 mt-5 ms-0" onClick={onSubmit}>Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal show={showDeleteFAQ} onHide={handleFAQShowCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete FAQ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ paddingLeft: "16px" }}>Are you want to delete this FAQ?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleFAQShowCancel}>
                        No
                    </Button>
                    <Button variant="primary" onClick={() => { onDeleteFaq() }}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>


            <NotificationContainer />
        </>
    )
}

export default SuperAdminSetting