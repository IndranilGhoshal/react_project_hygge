import React from 'react'
import LoggedLayout from './LoggedLayout';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { useParams, useNavigate } from 'react-router-dom'
import { getUserRole, getUserData } from '../../../service/Common';
import { getCompanyInfo, getIndustryType, getCity, getCountry, editProfileDetails, editSMTPDetails, editLicense, editContactDetails, userEvent } from '../../../service/Services'
import moment from 'moment';
import { IMAGE_URL } from '../../../config/app_url';
import $ from 'jquery'
import ReactFlagsSelect from "react-flags-select";
import { COUNTRY_LIST } from '../../../constant/constantValue';


var imgUrl = IMAGE_URL


function CompanyDetails() {
    let navigate = useNavigate();

    let { id } = useParams();

    const [indTypeArray, setIndTypeArray] = React.useState([])

    const [countryArray, setCountryArray] = React.useState([])

    const [cityArray, setCityArray] = React.useState([])



    const [companyData, setCompanyData] = React.useState({})

    const [smtpData, setSmtpData] = React.useState({})



    //Edit button variables 
    const [profileEdit, setProfileEdit] = React.useState(false)
    const [contactEdit, setContactEdit] = React.useState(false)
    const [accessEdit, setAccessEdit] = React.useState(false)
    const [smtpEdit, setSmtpEdit] = React.useState(false)




    //Profile Details
    const [comLogoImg, setComLogoImg] = React.useState("")
    const [companyName, setCompanyName] = React.useState("")
    const [parentcompanyName, setParentCompanyName] = React.useState("")
    const [companyType, setCompanyType] = React.useState("")
    const [industryType, setIndustryType] = React.useState("")
    const [noOfEmployee, setNoOfEmployee] = React.useState("")
    const [establishedYear, setEstablishedYear] = React.useState("")
    const [website, setWebsite] = React.useState("")
    const [comEmailID, setComEmailID] = React.useState("")
    const [counrtyCode, setCounrtyCode] = React.useState("")
    const [comContactNumber, setComContactNumber] = React.useState("")
    const [comAddress, setComAddress] = React.useState("")
    const [country, setCountry] = React.useState("")
    const [countryCity, setCountryCity] = React.useState("")
    const [location, setLocation] = React.useState("")

    // Profile Details Error Variable
    const [comNameError, setComNameError] = React.useState(false)
    const [parcomNameError, setParComNameError] = React.useState(false)
    const [comTypeError, setComtypeError] = React.useState(false)
    const [indTypeError, setIndTypeError] = React.useState(false)
    const [noOfEmpError, setnoOfEmpError] = React.useState(false)
    const [estYrError, setestYrError] = React.useState(false)
    const [webError, setWebError] = React.useState(false)
    const [comEmailIdError, setComEmailIdError] = React.useState(false)
    const [comAddressError, setComAddressError] = React.useState(false)
    const [comConNoError, setComConNoError] = React.useState(false)
    const [conCityError, setconCityError] = React.useState(false)
    const [locError, setlocError] = React.useState(false)

    const [webUrlError, setWebUrlError] = React.useState(false)
    const [validEmailError, setValidEmailError] = React.useState(false)
    const [validContactError, setValidContactError] = React.useState(false)

    //Smtp Details
    const [serverAddress, setServerAddress] = React.useState("")
    const [username, setUsername] = React.useState("")
    const [encryptionType, setEncryptionType] = React.useState("")
    const [portNumber, setPortNumber] = React.useState("")
    const [defaultSender, setDefaultSender] = React.useState("")
    const [defaultSenderName, setDefaultSenderName] = React.useState("")

    // SMTP Settings Error variable
    const [serverAddressError, setServerAddressError] = React.useState(false)
    const [usernameError, setUsernameError] = React.useState(false)
    const [passwordError, setPasswordError] = React.useState(false)
    const [encryptionTypeError, setEncryptionTypeError] = React.useState(false)
    const [portNumberError, setPortNumberError] = React.useState(false)
    const [defaultSenderError, setDefaultSenderError] = React.useState(false)
    const [defaultSenderNameError, setDefaultSenderNameError] = React.useState(false)

    //Access & License
    const [typeOfAccess, setTypeOfAccess] = React.useState("")
    const [noOfLicenses, setNoOfLicenses] = React.useState("")
    const [startDate, setStartDate] = React.useState("")
    const [endDate, setEndDate] = React.useState("")

    //Access & License Error Variable
    const [typeOfAccessError, setTypeOfAccessError] = React.useState(false)
    const [noOfLicensesError, setNoOfLicensesError] = React.useState(false)
    const [startDateError, setStartDateError] = React.useState(false)
    const [endDateError, setEndDateError] = React.useState(false)
    const [startEndDateError, setstartEndDateError] = React.useState(false)

    //contact 
    const [contactDetails, setContactDetails] = React.useState([])
    const [contactDetailsMore, setContactDetailsMore] = React.useState([])



    const [divShow, setDivShow] = React.useState(true)

    const [canEdit, SetCanEdit] = React.useState(false)


    //Mail Format Regex//
    var mailformat = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$";

    //Contact No. Regex//
    var z1 = /^[0-9]*\d$/

    //Website url Regex//
    var httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    var regspecial = /^[A-Za-z\s]+$/;

    var todayDate = new Date().toISOString().slice(0, 10);

    const inputInvalidChars = [' '];

    React.useEffect(() => {

        window.scrollTo(0, 0)

        var role = getUserRole("Companies")
        if (role) {
            if (role.can_edit == 1) {
                SetCanEdit(true)
            }
        }


        getCompanyInfoFun();
        getIndustryTypeFun()
        getCountryFun()

    }, [])

    function getCompanyInfoFun() {

        let data = {
            "orgn_id": id
        }

        getCompanyInfo(data).then(result => {

            setCompanyData(result.data.response)
            setSmtpData(result.data.response.smtp_setting)

            setCompanyName(result.data.response.organisation_name)
            setComLogoImg(result.data.response.organisation_logo)
            setParentCompanyName(result.data.response.parent_organisation_name)
            setCompanyType(result.data.response.organisation_type)
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
            setEncryptionType(result.data.response.smtp_setting.enp_type)
            setPortNumber(result.data.response.smtp_setting.port_no)
            setDefaultSender(result.data.response.smtp_setting.sender)
            setDefaultSenderName(result.data.response.smtp_setting.sender_name)


            setTypeOfAccess(result.data.response.organisation_flag)
            setNoOfLicenses(result.data.response.number_of_license)
            setStartDate(result.data.response.license_start_datetime.toLocaleString("lookup").substring(0, 10))
            setEndDate(result.data.response.license_end_datetime.toLocaleString("lookup").substring(0, 10))

            var contactDetails = []

            var contactDetailsmore = []

            if (result.data.response.contact_details.length <= 2) {

                // setDivShow(true)

                console.log("contactDetails array---->", result.data.response.contact_details.length)

                for (let data of result.data.response.contact_details) {
                    contactDetails.push({
                        country_code: data.country_code,
                        contact_number: data.contact_number,
                        designation: data.designation,
                        email_id: data.email_id,
                        full_name: data.full_name,
                        is_primary: data.is_primary + ""
                    })
                }

                for (let i = 0; i < result.data.response.contact_details.length; i++) {

                    if (i <= 1) {
                        var data = result.data.response.contact_details[i]

                        contactDetailsmore.push({
                            country_code: data.country_code,
                            contact_number: data.contact_number,
                            designation: data.designation,
                            email_id: data.email_id,
                            full_name: data.full_name,
                            is_primary: data.is_primary + ""
                        })
                    }
                }

                setContactDetails(contactDetails)
                setContactDetailsMore(contactDetailsmore)

            }

            if (result.data.response.contact_details.length >= 3) {

                setDivShow(true)

                console.log("contactDetailsmore array---->", result.data.response.contact_details.length)

                for (let data of result.data.response.contact_details) {

                    contactDetailsmore.push({
                        country_code: data.country_code,
                        contact_number: data.contact_number,
                        designation: data.designation,
                        email_id: data.email_id,
                        full_name: data.full_name,
                        is_primary: data.is_primary + ""
                    })
                }

                for (let i = 0; i < result.data.response.contact_details.length; i++) {

                    if (i <= 1) {
                        var data = result.data.response.contact_details[i]

                        contactDetails.push({
                            country_code: data.country_code,
                            contact_number: data.contact_number,
                            designation: data.designation,
                            email_id: data.email_id,
                            full_name: data.full_name,
                            is_primary: data.is_primary + ""
                        })
                    }
                }

                setContactDetails(contactDetails)
                setContactDetailsMore(contactDetailsmore)
            }

            let data3 = {
                "userId": getUserData().response.userId,
                "country": result.data.response.organisation_country

            }

            getCity(data3).then(result => {
                setCityArray(result.data.response)
            })

        })

    }

    function getIndustryTypeFun() {
        let data1 = {
            "userId": getUserData().response.userId
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

    const routeChangeCom = () => {
        let path = `/users/companydashboard`;
        navigate(path);
    }

    const profileEditFun = () => {
        setProfileEdit(!profileEdit)
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
    }

    const contactEditFun = () => {
        setDivShow(false)
        setContactEdit(!contactEdit)
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

        getCity(data).then(result => {

            setCityArray(result.data.response)

        })
    }

    const openURL = (url) => {
        var link = url
        window.open(link);
        console.log(link);
    }

    const onSave = () => {

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

        if (parentcompanyName.trim() == '') {
            setParComNameError(true)
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
        if (noOfEmployee.trim() == '') {
            setnoOfEmpError(true)
            err++
        }

        if (establishedYear == '') {
            setestYrError(true)
            err++
        }
        if (website.trim() == '') {
            setWebError(true)
            err++
        } else {
            if (!httpRegex.test(website.trim())) {
                setWebUrlError(true)
                err++
            }
        }
        if (comEmailID.trim() == '') {
            setComEmailIdError(true)
            err++
        } else {
            if (!comEmailID.trim().match(mailformat)) {
                setValidEmailError(true)
                err++
            }
        }

        if (comContactNumber.trim() == '') {
            setComConNoError(true)
            err++
        } else {
            if (!z1.test(comContactNumber.trim())) {
                setValidContactError(true)
                err++;
            } else if (comContactNumber.trim().length < 7) {
                setValidContactError(true)
                err++;
            } else if (comContactNumber.trim().length > 15) {
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
                "organisation_name": companyName.trim(),
                "organisation_email": comEmailID.trim(),
                "parent_organisation_name": parentcompanyName.trim(),
                "organisation_website": website.trim(),
                "organisation_type": companyType,
                "industry_type": industryType,
                "organisation_established_yr": establishedYear,
                "organisation_countryCode": counrtyCode,
                "organisation_phone": comContactNumber.trim(),
                "total_emp": noOfEmployee.trim(),
                "organisation_address": comAddress.trim(),
                "organisation_country": country,
                "organisation_city": countryCity,
                "organisation_location": location.trim(),
                "orgn_id": id

            }

            // console.log(data)

            editProfileDetails(data).then(result => {
                if (result.data.success) {
                    userEvent("update company profile details")
                    NotificationManager.success(result.data.message, 'Success', 2000);
                    setProfileEdit(!profileEdit)
                    getCompanyInfoFun()
                }
            })
        }
    }

    const onSave2 = () => {

        var data = {}

        if (divShow) {

            var err = 0;


            for (let [i, data] of contactDetails.entries()) {

                if (data.full_name.trim() == '') {
                    $("#fName" + i).addClass('error-fil')
                    $("#fNameErr" + i).show()
                    err++

                } else {
                    $("#fName" + i).removeClass('error-fil')
                    $("#fNameErr" + i).hide()
                 }

                 if (data.designation == '') {

                    $("#dName" + i).addClass('error-fil')
                    $("#dNameErr" + i).show()
                    err++
        
                 } else {
                    $("#dName" + i).removeClass('error-fil')
                    $("#dNameErr" + i).hide()
                 }
        
                 if (data.email_id.trim() == '') {
        
                    $("#eName" + i).addClass('error-fil')
                    $("#eNameErr" + i).show()
                    err++
        
                 } else {
                    $("#eName" + i).removeClass('error-fil')
                    $("#eNameErr" + i).hide()
                 }
        
                 if (data.email_id.trim()) {
                    if (!data.email_id.trim().match(mailformat)) {
        
                       $("#eName" + i).addClass('error-fil')
                       $("#eNamevalidErr" + i).show()
                       err++
        
                    } else {
        
                       $("#eName" + i).removeClass('error-fil')
                       $("#eNamevalidErr" + i).hide()
        
                    }
                 } else {
                    $("#eNamevalidErr" + i).hide()
        
                 }
        
        
                 // if (data.country_code == '') {
        
                 //    NotificationManager.error('Please enter country code','Error', 2000);
                 //    return false;
        
                 // } else {
        
                 // }
        
                 if (data.contact_number.trim() == '') {
                    $("#conNo" + i).addClass('error-fil')
                    $("#conNoErr" + i).show()
                    $("#conNoValidErr" + i).hide()
                    err++
                 } else {
                    $("#conNo" + i).removeClass('error-fil')
                    $("#conNoErr" + i).hide()
                 }
        
                 if (data.contact_number.trim()) {
        
                    if (!z1.test(data.contact_number.trim())) {
                       $("#conNo" + i).addClass('error-fil')
                       $("#conNoValidErr" + i).show()
                       err++
                    } else if (data.contact_number.trim().length < 7) {
                       $("#conNo" + i).addClass('error-fil')
                       $("#conNoValidErr" + i).show()
                       err++
                    } else if (data.contact_number.trim().length > 15) {
                       $("#conNo" + i).addClass('error-fil')
                       $("#conNoValidErr" + i).show()
                       err++
                    } else {
                       $("#conNo" + i).removeClass('error-fil')
                       $("#conNoValidErr" + i).hide()
                    }
        
                 }
            }

            data = {
                "contact_details": contactDetails,
                "orgn_id": id
            }

        } else {

            for (let [i, data] of contactDetailsMore.entries()) {

                if (data.full_name.trim() == '') {
                    $("#fName" + i).addClass('error-fil')
                    $("#fNameErr" + i).show()
                    err++

                } else {
                    $("#fName" + i).removeClass('error-fil')
                    $("#fNameErr" + i).hide()
                 }
        
                
                
                 if (data.designation == '') {

                    $("#dName" + i).addClass('error-fil')
                    $("#dNameErr" + i).show()
                    err++
        
                 } else {
                    $("#dName" + i).removeClass('error-fil')
                    $("#dNameErr" + i).hide()
                 }
        
                 if (data.email_id.trim() == '') {
        
                    $("#eName" + i).addClass('error-fil')
                    $("#eNameErr" + i).show()
                    err++
        
                 } else {
                    $("#eName" + i).removeClass('error-fil')
                    $("#eNameErr" + i).hide()
                 }
        
                 if (data.email_id.trim()) {
                    if (!data.email_id.trim().match(mailformat)) {
        
                       $("#eName" + i).addClass('error-fil')
                       $("#eNamevalidErr" + i).show()
                       err++
        
                    } else {
        
                       $("#eName" + i).removeClass('error-fil')
                       $("#eNamevalidErr" + i).hide()
        
                    }
                 } else {
                    $("#eNamevalidErr" + i).hide()
        
                 }
        
        
                 // if (data.country_code == '') {
        
                 //    NotificationManager.error('Please enter country code','Error', 2000);
                 //    return false;
        
                 // } else {
        
                 // }
        
                 if (data.contact_number.trim() == '') {
                    $("#conNo" + i).addClass('error-fil')
                    $("#conNoErr" + i).show()
                    $("#conNoValidErr" + i).hide()
                    err++
                 } else {
                    $("#conNo" + i).removeClass('error-fil')
                    $("#conNoErr" + i).hide()
                 }
        
                 if (data.contact_number.trim()) {
        
                    if (!z1.test(data.contact_number.trim())) {
                       $("#conNo" + i).addClass('error-fil')
                       $("#conNoValidErr" + i).show()
                       err++
                    } else if (data.contact_number.trim().length < 7) {
                       $("#conNo" + i).addClass('error-fil')
                       $("#conNoValidErr" + i).show()
                       err++
                    } else if (data.contact_number.trim().length > 15) {
                       $("#conNo" + i).addClass('error-fil')
                       $("#conNoValidErr" + i).show()
                       err++
                    } else {
                       $("#conNo" + i).removeClass('error-fil')
                       $("#conNoValidErr" + i).hide()
                    }
        
                 }
            }
            data = {
                "contact_details": contactDetailsMore,
                "orgn_id": id
            }
        }

        // console.log("err", err)
        // console.log("Data", data);

        if(err==undefined){

            editContactDetails(data).then(result => {
                if (result.data.success) {
                    userEvent("update company contact details")
                    NotificationManager.success(result.data.message, 'Success', 2000);
                    setContactEdit(!contactEdit)
                    getCompanyInfoFun()
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

        if (noOfLicenses.trim() == '') {
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

        if(Date.parse(startDate) >= Date.parse(endDate)){
            setstartEndDateError(true)
            err++
        }

        if (err == 0) {

            var data = {
                "number_of_license": noOfLicenses.trim(),
                "license_start_datetime": startDate,
                "license_end_datetime": endDate,
                "orgn_id": id
            }


            editLicense(data).then(result => {
                if (result.data.success) {
                    userEvent("update company license details")
                    NotificationManager.success(result.data.message, 'Success', 2000);
                    setAccessEdit(!accessEdit)
                    getCompanyInfoFun()
                }

            })

        }


    }

    const onSave4 = () => {


        setServerAddressError(false)
        setUsernameError(false)
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
                "enp_type": encryptionType,
                "port_no": portNumber.trim(),
                "sender": defaultSender.trim(),
                "sender_name": defaultSenderName.trim(),
                "orgn_id": id
            }

            editSMTPDetails(data).then(result => {
                if (result.data.success) {
                    userEvent("update company smtp details")
                    NotificationManager.success(result.data.message, 'Success', 2000);
                    setSmtpEdit(!smtpEdit)
                    getCompanyInfoFun()
                }
            })
        }
    }

    const updateFieldChanged = index => e => {

        if (divShow) {

            const newArray = contactDetails.map((item, i) => {
                if (index === i) {
                    return { ...item, [e.target.name]: e.target.value };
                } else {
                    return item;
                }
            });
            setContactDetails(newArray);

        } else {

            const newArray = contactDetailsMore.map((item, i) => {
                if (index === i) {
                    return { ...item, [e.target.name]: e.target.value };
                } else {
                    return item;
                }
            });
            setContactDetailsMore(newArray);

        }


    }

    function morcontc() {

        if (divShow) {
            setContactDetails([

                ...contactDetails, {
                    "full_name": '',
                    "designation": '',
                    "email_id": '',
                    "contact_number": '',
                    "country_code": '+91',
                    "is_primary": "0"
                }

            ])
        } else {
            setContactDetailsMore([

                ...contactDetailsMore, {
                    "full_name": '',
                    "designation": '',
                    "email_id": '',
                    "contact_number": '',
                    "country_code": '+91',
                    "is_primary": "0"
                }

            ])

        }
    }

    const morcontcclose = index => e => {

        if (divShow) {

            var src = [...contactDetails]
            src.splice(index, 1)
            setContactDetails(src)

        } else {


            var src = [...contactDetailsMore]
            src.splice(index, 1)
            setContactDetailsMore(src)

        }




    }
    function dateChange(e) {

        var date = new Date(e);
  
        var dateValue = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate(), 0)
  
        setEndDate(moment(dateValue).format('yyyy-MM-DD'))
  
     }
    const viewMore = () => {
        console.log("viewMore")
        setDivShow(!divShow)
    }

    const viewMorecontact=()=>{
        console.log("viewMorecontact")
        setDivShow(!divShow)
    }


    return (
        <>
            <div className="main">
                <main className="content">

                    <div className="container-fluid p-0">
                        <div className="row mb-2 mb-lg-4">
                            <div className="col-md-12 main-hdng">
                                <div className="hesd_ng">
                                    <h3 className="dashbrd-compny">Company Details</h3>
                                </div>
                                <div className="breadcum">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><a onClick={routeChangeCom}>Company</a></li>
                                            <li className="breadcrumb-item active" aria-current="page">{companyData.organisation_name}</li>
                                        </ol>
                                    </nav>
                                </div>

                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-md-12 col-sm-12">
                                <div className="bg-white shadow_d pt-4 pb-5 px-5 rounded-3 dashboard_body_box">
                                    <div className="conpnay_detail_top d-flex justify-content-lg-start align-items-center mb-3">
                                        <span className='com_logo'><img className="me-3" width="100" src={imgUrl + companyData.organisation_logo} /></span>
                                        <h3>{companyData.organisation_name}</h3>
                                    </div>


                                    <div className="conpnay_detail_cont">

                                        {/* profile details */}
                                        <div className="comp_dtPhed">
                                            <strong>Profile Details</strong>
                                            <div className="btn_edit">
                                                {
                                                    profileEdit ?
                                                        <div>
                                                            <button className="btn btn-nobg btn-witbord" onClick={profileEditFun}>Cancel</button>
                                                            <button className="btn btn-primary" onClick={onSave}>Save</button>

                                                        </div>
                                                        :
                                                        <div>
                                                            <button className="btn btn-primary" onClick={profileEditFun} disabled={!canEdit}>Edit</button>

                                                        </div>

                                                }

                                            </div>
                                        </div>

                                        {
                                            profileEdit ?
                                                <div className="conpnay_detail_in comp_edit">
                                                    {/* Parent Company */}
                                                    <div className="comp_list">
                                                        <span>Parent Company :</span>
                                                        <div className={`add_fild_com ${parcomNameError ? "error-fil" : ""}`}>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                value={parentcompanyName}
                                                                onChange={(e) => setParentCompanyName(e.target.value)}
                                                                required
                                                                // onKeyDown={(e) => {
                                                                //     if (inputInvalidChars.includes(e.key)) {
                                                                //        e.preventDefault();
                                                                //     }
                                                                //  }}
                                                            />
                                                            {
                                                                parcomNameError ?
                                                                    <span className='errorfiled'>Enter parent company name</span>
                                                                    : null
                                                            }
                                                        </div>
                                                    </div>
                                                    {/* Company Type */}
                                                    <div className="comp_list">
                                                        <span>Company Type :</span>
                                                        <div className={`add_fild_com ${comTypeError ? "error-fil" : ""}`}>
                                                            <select
                                                                className="form-select"
                                                                value={companyType}
                                                                onChange={(e) => setCompanyType(e.target.value)}
                                                                required
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
                                                    {/* Industry Type */}
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
                                                            <i className="bi bi-calendar-minus"></i>
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
                                                        <span>Email Id :</span>
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
                                                        <span>Country & City :</span>
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
                                                        <span>Parent Company :</span>
                                                        <strong>{companyData.parent_organisation_name}</strong>
                                                    </div>
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
                                                        <strong>{companyData.organisation_established_yr}</strong>
                                                    </div>
                                                    <div className="comp_list">
                                                        <span>Website :</span>
                                                        <strong><a onClick={() => openURL(companyData.organisation_website)}>{companyData.organisation_website}</a></strong>
                                                    </div>
                                                    <div className="two_div_con d-flex">
                                                        <div className="comp_list">
                                                            <span>Email ID :</span>
                                                            {/* <strong>{companyData.organisation_email}</strong> */}
                                                            <strong><a href="">{companyData.organisation_email}</a></strong>
                                                        </div>
                                                        <div className="comp_list">
                                                            <span>Contact Number :</span>
                                                            <strong>{companyData.organisation_countryCode}{companyData.organisation_phone}</strong>
                                                        </div>
                                                    </div>
                                                    <div className="comp_list">
                                                        <span>Address :</span>
                                                        <strong>{companyData.organisation_address}</strong>
                                                    </div>
                                                    <div className="comp_list">
                                                        <span>Country, City & Location:</span>
                                                        <strong>{companyData.organisation_country}, {companyData.organisation_city}, {companyData.organisation_location} </strong>
                                                    </div>

                                                </div>
                                        }


                                        {/* contact details */}
                                        <div className="comp_dtPhed bt-1">
                                            <strong>Contact Details</strong>
                                            <div className="btn_edit">
                                                {
                                                    contactEdit ?
                                                        <div>
                                                            <button className="btn btn-nobg btn-witbord" onClick={contactEditFun}>Cancel</button>
                                                            <button className="btn btn-primary" onClick={onSave2}>Save</button>

                                                        </div>
                                                        :
                                                        <div>
                                                            <button className="btn btn-primary" onClick={contactEditFun} disabled={!canEdit}>Edit</button>

                                                        </div>

                                                }
                                            </div>
                                        </div>
                                        {
                                            contactEdit ?
                                                <>
                                                    <div className="conpnay_detail_in side-by comp_edit">
                                                        {

                                                            divShow ?

                                                                <>
                                                                    {

                                                                        contactDetails.map((item, index) => (

                                                                            item.is_primary == 1 ?
                                                                                <div key={index} className="conpnay_detail_l">
                                                                                    <p>Primary Contact Details</p>
                                                                                    <div className="comp_list">
                                                                                        <span>Full Name :</span>
                                                                                        <div className={`add_fild_com`} id={"fName" + index}>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control"
                                                                                                placeholder="Enter your full name"
                                                                                                value={item.full_name}
                                                                                                id={index}
                                                                                                name="full_name"
                                                                                                onChange={updateFieldChanged(index)}
                                                                                                required
                                                                                                onKeyDown={(e) => {
                                                                                                    if (!regspecial.test(e.key)) {
                                                                                                       e.preventDefault();
                                                                                                    }
                                                                                                 }}
                                                                                            />
                                                                                            <span className='errorfiled' id={"fNameErr" + index} style={{ display: "none" }}>Enter the full name</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Designation :</span>
                                                                                        <div className={`add_fild_com`} id={"dName" + index}>
                                                                                            <select
                                                                                                className="form-select"
                                                                                                value={item.designation}
                                                                                                id={index}
                                                                                                name="designation"
                                                                                                onChange={updateFieldChanged(index)}
                                                                                                required
                                                                                            >
                                                                                                <option value="">Select</option>
                                                                                                <option value="CEO">CEO</option>
                                                                                                <option value="HR">HR</option>
                                                                                                <option value="Manager">Manager</option>

                                                                                            </select>
                                                                                            <span className='errorfiled' id={"dNameErr" + index} style={{ display: "none" }}>Select the designation</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Email ID :</span>
                                                                                        <div className={`add_fild_com`} id={"eName" + index}>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control"
                                                                                                placeholder="Enter the email id"
                                                                                                value={item.email_id}
                                                                                                id={index}
                                                                                                name="email_id"
                                                                                                disabled
                                                                                                onChange={updateFieldChanged(index)}
                                                                                                required
                                                                                            />
                                                                                            <span className='errorfiled' id={"eNameErr" + index} style={{ display: "none" }}>Enter the email id</span>
                                                                                            <span className='errorfiled' id={"eNamevalidErr" + index} style={{ display: "none" }}>Enter the valid email id</span>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Contact Number :</span>
                                                                                        <div className={`add_fild_com`} id={"conNo" + index}>
                                                                                            <div className="contct_no">
                                                                                                <select
                                                                                                    className="form-select"
                                                                                                    value={item.country_code}
                                                                                                    id={index}
                                                                                                    name="country_code"
                                                                                                    onChange={updateFieldChanged(index)}
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
                                                                                                    placeholder="Mobile No."
                                                                                                    value={item.contact_number}
                                                                                                    id={index}
                                                                                                    name="contact_number"
                                                                                                    onChange={updateFieldChanged(index)}
                                                                                                    required
                                                                                                />
                                                                                            </div>
                                                                                            <span className='errorfiled' id={"conNoErr" + index} style={{ display: "none" }}>Enter the contact no.</span>
                                                                                            <span className='errorfiled' id={"conNoValidErr" + index} style={{ display: "none" }}>Enter the valid contact no.</span>

                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                                :
                                                                                <div className="conpnay_detail_r">
                                                                                    <p>
                                                                                        Other Contact Details
                                                                                        <button
                                                                                            type='button'
                                                                                            className="btn btn-nobg btn-lg remov_con"
                                                                                            onClick={morcontcclose(index)}>
                                                                                            <i className="bi bi-plus-circle"></i> Delete Contact</button>
                                                                                    </p>

                                                                                    <div className="comp_list">
                                                                                        <span>Full Name :</span>
                                                                                        <div className={`add_fild_com`} id={"fName" + index}>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control"
                                                                                                placeholder="Enter your full name"
                                                                                                value={item.full_name}
                                                                                                id={index}
                                                                                                name="full_name"
                                                                                                onChange={updateFieldChanged(index)}
                                                                                                required
                                                                                                onKeyDown={(e) => {
                                                                                                    if (!regspecial.test(e.key)) {
                                                                                                       e.preventDefault();
                                                                                                    }
                                                                                                 }}
                                                                                            />
                                                                                            <span className='errorfiled' id={"fNameErr" + index} style={{ display: "none" }}>Enter the full name</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Designation :</span>
                                                                                        <div className={`add_fild_com`} id={"dName" + index}>
                                                                                            <select
                                                                                                className="form-select"
                                                                                                value={item.designation}
                                                                                                id={index}
                                                                                                name="designation"
                                                                                                onChange={updateFieldChanged(index)}
                                                                                                required
                                                                                            >
                                                                                                <option value="">Select</option>
                                                                                                <option value="CEO">CEO</option>
                                                                                                <option value="HR">HR</option>
                                                                                                <option value="Manager">Manager</option>

                                                                                            </select>
                                                                                            <span className='errorfiled' id={"dNameErr" + index} style={{ display: "none" }}>Select the designation</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Email ID :</span>
                                                                                        <div className={`add_fild_com`} id={"eName" + index}>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control"
                                                                                                placeholder="Enter the email id"
                                                                                                value={item.email_id}
                                                                                                id={index}
                                                                                                name="email_id"
                                                                                                onChange={updateFieldChanged(index)}
                                                                                                required
                                                                                            />
                                                                                            <span className='errorfiled' id={"eNameErr" + index} style={{ display: "none" }}>Enter the email id</span>
                                                                                            <span className='errorfiled' id={"eNamevalidErr" + index} style={{ display: "none" }}>Enter the valid email id</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Contact Number :</span>
                                                                                        <div className={`add_fild_com`} id={"conNo" + index}>
                                                                                            <div className="contct_no">
                                                                                                <select
                                                                                                    className="form-select"
                                                                                                    value={item.country_code}
                                                                                                    id={index}
                                                                                                    name="country_code"
                                                                                                    onChange={updateFieldChanged(index)}
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
                                                                                                    placeholder="Mobile No."
                                                                                                    value={item.contact_number}
                                                                                                    id={index}
                                                                                                    name="contact_number"
                                                                                                    onChange={updateFieldChanged(index)}
                                                                                                    required
                                                                                                />
                                                                                            </div>
                                                                                            <span className='errorfiled' id={"conNoErr" + index} style={{ display: "none" }}>Enter the contact no.</span>
                                                                                            <span className='errorfiled' id={"conNoValidErr" + index} style={{ display: "none" }}>Enter the valid contact no.</span>

                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                        ))
                                                                    }

                                                                </>
                                                                :
                                                                <>

                                                                    {

                                                                        contactDetailsMore.map((item, index) => (

                                                                            item.is_primary == 1 ?
                                                                                <div key={index} className="conpnay_detail_l">
                                                                                    <p>Primary Contact Details</p>
                                                                                    <div className="comp_list">
                                                                                        <span>Full Name :</span>
                                                                                        <div className={`add_fild_com`} id={"fName" + index}>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control"
                                                                                                placeholder="Enter your full name"
                                                                                                value={item.full_name}
                                                                                                id={index}
                                                                                                name="full_name"
                                                                                                onChange={updateFieldChanged(index)}
                                                                                                required
                                                                                                onKeyDown={(e) => {
                                                                                                    if (!regspecial.test(e.key)) {
                                                                                                       e.preventDefault();
                                                                                                    }
                                                                                                 }}
                                                                                            />
                                                                                            <span className='errorfiled' id={"fNameErr" + index} style={{ display: "none" }}>Enter the full name</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Designation :</span>
                                                                                        <div className={`add_fild_com`} id={"dName" + index}>
                                                                                            <select
                                                                                                className="form-select"
                                                                                                value={item.designation}
                                                                                                id={index}
                                                                                                name="designation"
                                                                                                onChange={updateFieldChanged(index)}
                                                                                                required
                                                                                            >
                                                                                                <option value="">Select</option>
                                                                                                <option value="CEO">CEO</option>
                                                                                                <option value="HR">HR</option>
                                                                                                <option value="Manager">Manager</option>

                                                                                            </select>
                                                                                            <span className='errorfiled' id={"dNameErr" + index} style={{ display: "none" }}>Select the designation</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Email ID :</span>
                                                                                        <div className={`add_fild_com`} id={"eName" + index}>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control"
                                                                                                placeholder="Enter the email id"
                                                                                                value={item.email_id}
                                                                                                id={index}
                                                                                                name="email_id"
                                                                                                disabled
                                                                                                onChange={updateFieldChanged(index)}
                                                                                                required
                                                                                            />
                                                                                            <span className='errorfiled' id={"eNameErr" + index} style={{ display: "none" }}>Enter the email id</span>
                                                                                            <span className='errorfiled' id={"eNamevalidErr" + index} style={{ display: "none" }}>Enter the valid email id</span>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Contact Number :</span>
                                                                                        <div className={`add_fild_com`} id={"conNo" + index}>
                                                                                            <div className="contct_no">
                                                                                                <select
                                                                                                    className="form-select"
                                                                                                    value={item.country_code}
                                                                                                    id={index}
                                                                                                    name="country_code"
                                                                                                    onChange={updateFieldChanged(index)}
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
                                                                                                    placeholder="Mobile No."
                                                                                                    value={item.contact_number}
                                                                                                    id={index}
                                                                                                    name="contact_number"
                                                                                                    onChange={updateFieldChanged(index)}
                                                                                                    required
                                                                                                />
                                                                                            </div>
                                                                                            <span className='errorfiled' id={"conNoErr" + index} style={{ display: "none" }}>Enter the contact no.</span>
                                                                                            <span className='errorfiled' id={"conNoValidErr" + index} style={{ display: "none" }}>Enter the valid contact no.</span>

                                                                                        </div>

                                                                                    </div>


                                                                                </div>
                                                                                :
                                                                                <div className="conpnay_detail_r">
                                                                                    <p>
                                                                                        Other Contact Details
                                                                                        <button
                                                                                            type='button'
                                                                                            className="btn btn-nobg btn-lg remov_con"
                                                                                            onClick={morcontcclose(index)}>
                                                                                            <i className="bi bi-plus-circle"></i> Delete Contact</button>
                                                                                    </p>

                                                                                    <div className="comp_list">
                                                                                        <span>Full Name :</span>
                                                                                        <div className={`add_fild_com`} id={"fName" + index}>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control"
                                                                                                placeholder="Enter your full name"
                                                                                                value={item.full_name}
                                                                                                id={index}
                                                                                                name="full_name"
                                                                                                onChange={updateFieldChanged(index)}
                                                                                                required
                                                                                                onKeyDown={(e) => {
                                                                                                    if (!regspecial.test(e.key)) {
                                                                                                       e.preventDefault();
                                                                                                    }
                                                                                                 }}
                                                                                            />
                                                                                            <span className='errorfiled' id={"fNameErr" + index} style={{ display: "none" }}>Enter the full name</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Designation :</span>
                                                                                        <div  className={`add_fild_com`} id={"dName" + index}>
                                                                                            <select
                                                                                                className="form-select"
                                                                                                value={item.designation}
                                                                                                id={index}
                                                                                                name="designation"
                                                                                                onChange={updateFieldChanged(index)}
                                                                                                required
                                                                                            >
                                                                                                <option value="">Select</option>
                                                                                                <option value="CEO">CEO</option>
                                                                                                <option value="HR">HR</option>
                                                                                                <option value="Manager">Manager</option>

                                                                                            </select>
                                                                                            <span className='errorfiled' id={"dNameErr" + index} style={{ display: "none" }}>Select the designation</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Email ID :</span>
                                                                                        <div className={`add_fild_com`} id={"eName" + index}>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control"
                                                                                                placeholder="Enter the email id"
                                                                                                value={item.email_id}
                                                                                                id={index}
                                                                                                name="email_id"
                                                                                                onChange={updateFieldChanged(index)}
                                                                                                required
                                                                                            />
                                                                                            <span className='errorfiled' id={"eNameErr" + index} style={{ display: "none" }}>Enter the email id</span>
                                                                                            <span className='errorfiled' id={"eNamevalidErr" + index} style={{ display: "none" }}>Enter the valid email id</span>
                                                                                        
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Contact Number :</span>
                                                                                        <div className={`add_fild_com`} id={"conNo" + index}>
                                                                                            <div className="contct_no">
                                                                                                <select
                                                                                                    className="form-select"
                                                                                                    value={item.country_code}
                                                                                                    id={index}
                                                                                                    name="country_code"
                                                                                                    onChange={updateFieldChanged(index)}
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
                                                                                                    placeholder="Mobile No."
                                                                                                    value={item.contact_number}
                                                                                                    id={index}
                                                                                                    name="contact_number"
                                                                                                    onChange={updateFieldChanged(index)}
                                                                                                    required
                                                                                                />
                                                                                            </div>
                                                                                            <span className='errorfiled' id={"conNoErr" + index} style={{ display: "none" }}>Enter the contact no.</span>
                                                                                            <span className='errorfiled' id={"conNoValidErr" + index} style={{ display: "none" }}>Enter the valid contact no.</span>


                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                        ))
                                                                    }

                                                                </>
                                                        }

                                                    </div>
                                                    <div className="mor_contct comp_edit">
                                                        <button className="btn btn-nobg btn-lg addnewcn" onClick={morcontc}><i className="bi bi-plus-circle"></i> Add another contact</button>
                                                    </div>
                                                </>
                                                :

                                                <div className="conpnay_detail_in side-by">
                                                    {

                                                        divShow ?

                                                            <>
                                                                {
                                                                    contactDetails.map((item, index) => (
                                                                        item.is_primary == 1 ?

                                                                            <div key={index} className="conpnay_detail_l">

                                                                                <p>Primary Contact Details</p>

                                                                                <div className="comp_list">
                                                                                    <span>Full Name :</span>
                                                                                    <strong>{item.full_name}</strong>
                                                                                </div>
                                                                                <div className="comp_list">
                                                                                    <span>Designation :</span>
                                                                                    <strong>{item.designation}</strong>
                                                                                </div>
                                                                                <div className="comp_list">
                                                                                    <span>Email ID :</span>
                                                                                    <strong><a href="">{item.email_id}</a></strong>
                                                                                </div>
                                                                                <div className="comp_list">
                                                                                    <span>Contact Number :</span>
                                                                                    <strong>{item.country_code}{item.contact_number}</strong>
                                                                                </div>
                                                                                {
                                                                                    contactDetailsMore ? contactDetailsMore.length > 2?
                                                                                    <>
                                                                                     <button onClick={viewMore} className='btn btn-viewmore'>View More <i className="bi bi-chevron-down"></i></button>

                                                                                    </>
                                                                                    :
                                                                                    <></>
                                                                                    :
                                                                                    <></>

                                                                                }

                                                                            </div>

                                                                            :
                                                                            <>
                                                                                <div className="conpnay_detail_r">
                                                                                    <p>Other Contact Details</p>
                                                                                    <div className="comp_list">
                                                                                        <span>Full Name :</span>
                                                                                        <strong>{item.full_name}</strong>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Designation :</span>
                                                                                        <strong>{item.designation}</strong>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Email ID :</span>
                                                                                        <strong><a href="">{item.email_id}</a></strong>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Contact Number :</span>
                                                                                        <strong>{item.country_code}{item.contact_number}</strong>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                    ))
                                                                }

                                                            </>
                                                            :
                                                            <>

                                                                {
                                                                    contactDetailsMore.map((item, index) => (
                                                                        item.is_primary == 1 ?

                                                                            <div key={index} className="conpnay_detail_l">

                                                                                <p>Primary Contact Details</p>

                                                                                <div className="comp_list">
                                                                                    <span>Full Name :</span>
                                                                                    <strong>{item.full_name}</strong>
                                                                                </div>
                                                                                <div className="comp_list">
                                                                                    <span>Designation :</span>
                                                                                    <strong>{item.designation}</strong>
                                                                                </div>
                                                                                <div className="comp_list">
                                                                                    <span>Email ID :</span>
                                                                                    <strong><a href="">{item.email_id}</a></strong>
                                                                                </div>
                                                                                <div className="comp_list">
                                                                                    <span>Contact Number :</span>
                                                                                    <strong>{item.country_code}{item.contact_number}</strong>
                                                                                </div>
                                                                                <button onClick={viewMorecontact} className='btn btn-viewmore'>View More <i className="bi bi-chevron-down"></i></button>
                                                                                

                                                                            </div>

                                                                            :
                                                                            <>
                                                                                <div className="conpnay_detail_r">
                                                                                    <p>Other Contact Details</p>
                                                                                    <div className="comp_list">
                                                                                        <span>Full Name :</span>
                                                                                        <strong>{item.full_name}</strong>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Designation :</span>
                                                                                        <strong>{item.designation}</strong>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Email ID :</span>
                                                                                        <strong><a href="">{item.email_id}</a></strong>
                                                                                    </div>
                                                                                    <div className="comp_list">
                                                                                        <span>Contact Number :</span>
                                                                                        <strong>{item.country_code}{item.contact_number}</strong>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                    ))
                                                                }


                                                            </>



                                                    }
                                                </div>
                                        }

                                        {/* Access & License Details */}
                                        <div className="comp_dtPhed">
                                            <strong>Access & License Details</strong>
                                            <div className="btn_edit">
                                                {
                                                    accessEdit ?
                                                        <div>
                                                            <button className="btn btn-nobg btn-witbord" onClick={accessEditFun}>Cancel</button>
                                                            <button className="btn btn-primary" onClick={onSave3}>Save</button>

                                                        </div>
                                                        :
                                                        <div>
                                                            <button className="btn btn-primary" onClick={accessEditFun} disabled={!canEdit}>Edit</button>

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
                                                    <div className="comp_list">
                                                        <span>License Key :</span>
                                                        <strong className="lic_key">{companyData.license_key}</strong>
                                                    </div>
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
                                                        <span>Start Date :</span>
                                                        <strong>{new Date(companyData.license_start_datetime).toLocaleString("lookup").substring(0, 10)}</strong>
                                                    </div>
                                                    <div className="comp_list">
                                                        <span>End Date :</span>
                                                        <strong>{new Date(companyData.license_end_datetime).toLocaleString("lookup").substring(0, 10)}</strong>
                                                    </div>
                                                    <div className="comp_list">
                                                        <span>License Key :</span>
                                                        <strong className="bg-prime lic_key">{companyData.license_key}</strong>
                                                    </div>
                                                </div>

                                        }


                                        {/* SMTP Settings */}
                                        <div className="comp_dtPhed bt-1">
                                            <strong>SMTP Settings</strong>
                                            <div className="btn_edit">
                                                {
                                                    smtpEdit ?
                                                        <div>
                                                            <button className="btn btn-nobg btn-witbord" onClick={smtpEditFun}>Cancel</button>
                                                            <button className="btn btn-primary" onClick={onSave4}>Save</button>

                                                        </div>
                                                        :
                                                        <div>
                                                            <button className="btn btn-primary" onClick={smtpEditFun} disabled={!canEdit}>Edit</button>

                                                        </div>

                                                }
                                            </div>
                                        </div>
                                        {
                                            smtpEdit ?
                                                <div className="conpnay_detail_in comp_edit">
                                                    <div className="comp_list">
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
                                                    <div className="comp_list">
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
                                                    <div className="comp_list">
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
                                                    <div className="comp_list">
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
                                                    <div className="comp_list">
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
                                                    <div className="comp_list">
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
                        </div>

                    </div>
                </main>
            </div>
            <nav className="navbar navbar-expand navbar-light navbar-bg d-block">
                <div className="navbar-collapse collapse navright">

                    <LoggedLayout />
                </div>
                <NotificationContainer />
            </nav>
        </>
    )
}

export default CompanyDetails