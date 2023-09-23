// ----------------- Add Company Component ----------------- //
// ------------- Import Files ------------- //
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import LoggedLayout from './LoggedLayout'
import { axiosInstance, getIndustryType, addCompany, checkSmtp, checkUser, uploadLogo, generateLicence, getCountry, getCity, userEvent, smtpsetting } from '../../../service/Services';
import $ from 'jquery'
import { getUserData, hideLoader, showLoader, GetDecrypt } from '../../../service/Common';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { IMAGE_URL } from '../../../config/app_url';
import { FileUploader } from "react-drag-drop-files";
import moment from 'moment';
import ReactFlagsSelect from "react-flags-select";
import { COUNTRY_LIST } from '../../../constant/constantValue';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
//-------------- Import files variables --------------//
// const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];
// const contractFileType = ["PDF", "DOC", "DOCX", "XLS", "XLSX", "JPG", "PNG", "GIF", "JPEG", "CSV"];
const fileTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
const contractFileType = ["image/png", 
                          "image/jpg", 
                          "image/jpeg", 
                          "image/gif", 
                          "application/pdf", 
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                          "application/msword", 
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
                          "text/csv", 
                          'application/vnd.ms-powerpoint',
                          'text/plain'
                        ];
//--------------Import Images-----------//
const imageicon = require('../../../assets/images/image-icon.png');
//--------------Import Image Url--------------//
var imgUrl = IMAGE_URL
//Stateless Functional Component named AddCompany//
function AddCompany() {
   /* Variables */
   let navigate = useNavigate();
   const [indTypeArray, setIndTypeArray] = React.useState([])
   const [countryArray, setCountryArray] = React.useState([])
   const [cityArray, setCityArray] = React.useState([])
   // ----------------- Profile Details -------------------- //
   //-----Main Variable-----//
   const [comLogoImg, setComLogoImg] = React.useState("")
   const [logoImg, setLogoImg] = React.useState({
      showTab: false,
   })
   const [companyName, setCompanyName] = React.useState("")
   const [parentcompanyName, setParentCompanyName] = React.useState("")
   const [companyType, setCompanyType] = React.useState("")
   const [industryType, setIndustryType] = React.useState("")
   const [noOfEmployee, setNoOfEmployee] = React.useState("")
   const [establishedYear, setEstablishedYear] = React.useState("")
   const [website, setWebsite] = React.useState("")
   const [comEmailID, setComEmailID] = React.useState("")
   const [counrtyCode, setCounrtyCode] = React.useState("+971")
   const [comContactNumber, setComContactNumber] = React.useState("")
   const [comAddress, setComAddress] = React.useState("")
   const [country, setCountry] = React.useState("AE")
   const [selectedCountry, setSelectedCountry] = React.useState("AE")
   const [countryCity, setCountryCity] = React.useState("")
   const [location, setLocation] = React.useState("")
   //-----------Test variable-------//
   // const [companyName, setCompanyName] = React.useState("ABC Com")
   // const [parentcompanyName, setParentCompanyName] = React.useState("XYZ Com")
   // const [companyType, setCompanyType] = React.useState("Healthcare")
   // const [industryType, setIndustryType] = React.useState("News")
   // const [noOfEmployee, setNoOfEmployee] = React.useState("100")
   // const [establishedYear, setEstablishedYear] = React.useState("2023-01-01")
   // const [website, setWebsite] = React.useState("www.abc.com")
   // const [comEmailID, setComEmailID] = React.useState("abc@gmail.com")
   // const [counrtyCode, setCounrtyCode] = React.useState("+91")
   // const [comContactNumber, setComContactNumber] = React.useState("7908231967")
   // const [comAddress, setComAddress] = React.useState("Kolkata")
   // const [country, setCountry] = React.useState("India")
   // const [countryCity, setCountryCity] = React.useState("Kolkata")
   // const [location, setLocation] = React.useState("Kolkata")
   // ----------------- Profile Details Error Variable ----------------- //
   const [comLogoError, setComLogoError] = React.useState(false)
   const [comLogoSizeError, setComLogoSizeError] = React.useState(false)
   const [comLogoResError, setComLogoResError] = React.useState("")
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
   // ------------------ Contact Details ---------------///
   const [userContactArray, setUserContactArray] = React.useState([])
   const [contractFileName, setContractFileName] = React.useState({
      showTab: false,
   })
   // ----------------- Access & License ----------------//
   const [comContractImg, setComContractImg] = React.useState("")
   const [contractImg, setContractImg] = React.useState({
      showTab: false,
   })
   //----------Main Variable------------// 
   const [typeOfAccess, setTypeOfAccess] = React.useState("")
   const [noOfLicenses, setNoOfLicenses] = React.useState("")
   const [startDate, setStartDate] = React.useState(moment(new Date()).format('yyyy-MM-DD'))
   const [endDate, setEndDate] = React.useState("")
   const [genKey, setGenKey] = React.useState("")
   const [contractFile, setContractFile] = React.useState("")
   //-----------Test variable-----------//
   // const [typeOfAccess, setTypeOfAccess] = React.useState("Group")
   // const [noOfLicenses, setNoOfLicenses] = React.useState("10")
   // const [startDate, setStartDate] = React.useState("2023-01-01")
   // const [endDate, setEndDate] = React.useState("2024-01-01")
   // const [genKey, setGenKey] = React.useState("")
   // const [contractFile, setContractFile] = React.useState("")
   //--------------Access & LIcense Error Variable---------------//
   const [typeOfAccessError, setTypeOfAccessError] = React.useState(false)
   const [noOfLicensesError, setNoOfLicensesError] = React.useState(false)
   const [startDateError, setStartDateError] = React.useState(false)
   const [endDateError, setEndDateError] = React.useState(false)
   const [genKeyError, setGenKeyError] = React.useState(false)
   const [contractFileError, setContractFileError] = React.useState(false)
   const [contractResError, setContractResError] = React.useState("")
   //------------SMTP Settings-------------//
   // const [serverAddress, setServerAddress] = React.useState("smtpout.secureserver.net")
   // const [username, setUsername] = React.useState("hello@myhygge.io")
   // const [password, setPassword] = React.useState("Admin@123!")
   // const [encryptionType, setEncryptionType] = React.useState("1")
   // const [portNumber, setPortNumber] = React.useState("465")
   // const [defaultSender, setDefaultSender] = React.useState("hello@myhygge.io")
   // const [defaultSenderName, setDefaultSenderName] = React.useState("Hygge")

   const [serverAddress, setServerAddress] = React.useState("")
   const [username, setUsername] = React.useState("")
   const [password, setPassword] = React.useState("")
   const [encryptionType, setEncryptionType] = React.useState("")
   const [portNumber, setPortNumber] = React.useState("")
   const [defaultSender, setDefaultSender] = React.useState("")
   const [defaultSenderName, setDefaultSenderName] = React.useState("")
   // -------------- SMTP Settings Error variable --------------//
   const [serverAddressError, setServerAddressError] = React.useState(false)
   const [usernameError, setUsernameError] = React.useState(false)
   const [passwordError, setPasswordError] = React.useState(false)
   const [encryptionTypeError, setEncryptionTypeError] = React.useState(false)
   const [portNumberError, setPortNumberError] = React.useState(false)
   const [defaultSenderError, setDefaultSenderError] = React.useState(false)
   const [defaultSenderNameError, setDefaultSenderNameError] = React.useState(false)
   // ------------- Tab Change Variable ----------------//
   const [tabChange, setTabChange] = React.useState({ showTab: false })
   const [contabChange, setConTabChange] = React.useState({ showTab: false })
   const [acLitabChange, setAcLiTabChange] = React.useState({ showTab: false })
   //breadcrumbs//
   const [breadcrumbs, setBreadcrumbs] = React.useState("Profile Details")
   //Mail Format Regex//
   var mailformat = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$";
   //Contact No. Regex//
   var z1 = /^[0-9]*\d$/
   //Website url Regex//
   // var httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
   var httpRegex = /^(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

   // Special char regex
   var regspecial = /^[A-Za-z\s]+$/;

   const [isExist, setIsExist] = React.useState(false)

   var todayDate = new Date().toISOString().slice(0, 10);

   const numberInputInvalidChars = ['-', '+', 'e', '.', ' '];

   const inputInvalidChars = [' '];

   const myOptions = ["President",
   "Chairman",
   "Founder",
   "Co-Founder",
   "Principal",
   "Owner",
   "Partner",
   "Managing Partner",
   "Chief Executive Officer",
   "Managing Director",
   "General Manager",
   "Chief Operating Officer",
   "Director",
   "Executive",
   "Vice President",
   "Dupty General Manager",
   "Chief Financial Officer",
   "Chief Information Officer",
   "Chief Technology Officer",
   "Chief Marketing Officer",
   "Chief Human Resources Officer",
   "Chief Digital Officer",
   "Chief Product Officer",
   "Chief Customer Officer",
   "Chief People Officer",
   "Asst General Manager",
   "Asst Director",
   "Asst Vice President",
   "Group Finance Manager",
   "Finance Manager",
   "Group Purchasing Manager",
   "Purchasing Manager",
   "Group Operation Manager",
   "Operation Manager",
   "Group HR & Admin Manager",
   "HR & Admin Manager",
   "Benefits Manager",
   "Sales Manager",
   "Marketing Manager",
   "Business Development Manager",
   "Group Manager",
   "Account Manager",
   "Manager",
   "Insurance Manager",
   "Head of the Department",
   "Head of Insurance",
   "Team Leader",
   "Dupty Manager",
   "Asst Manager",
   "Asst Manager Finance",
   "Asst Manager HR & Admin",
   "Senior Engineer",
   "Accountant",
   "Senior Accountant",
   "HR & Admin Executive","Personal Assistant"];

   // useEffect(()=>{
   //    let el = document.getElementById('rfs-btn');
   //    el.ariaExpanded = false;
   //    console.log("EXPANDED")
   // })

   /* Functions */
   //---------------useEffect----------------//
   React.useEffect(() => {
      showLoader()

      setTimeout(() => {
         hideLoader()
      }, 1000);
      setUserContactArray([{
         "full_name": '',
         "designation": '',
         "email_id": '',
         "country_code": '+971',
         "contact_number": '',
         "is_primary": '1'
      }])
      
      getCountryFun()
      callCity(country)
      var date = new Date();
      var dateValue = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate(), 0)
      setEndDate(moment(dateValue).format('yyyy-MM-DD'))
   }, [])

   //-------------- callback functions -------------//
   const handleChange = (file) => {
      setComLogoError(false)
      setComLogoSizeError(false)
      setComLogoResError("")
      setComLogoImg("")
      setLogoImg({ ...logoImg, showTab: false });
      const includesTwenty = fileTypes.includes(file.type);
      if (!includesTwenty) {
         setComLogoResError('Only .jpeg,.jpg,.png files are allowed.');
         return false;
      }
      // console.log("file", file)
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
            // if (height > 800 || width > 400) {
            //    setComLogoSizeError(true);
            //    return false
            // } else {
               setComLogoSizeError(false)
               showLoader()
               uploadLogo(fileName).then(result => {
                  result = GetDecrypt(result)
                  hideLoader()
                  if (result.success) {
                     setComLogoImg(result.response.fileName)
                     setLogoImg({ ...logoImg, showTab: true });
                  } else {
                     setComLogoResError(result.message);
                  }
               })
            // }
         };

      }
   };

   function getExtension(filename) {
      return filename.split(".").pop();
   }

   const [contractArr, setContractArr] = useState([])


   const handleChangeCom = (file) => {
      // setUpFileName('')
      setContractFile("")
      setContractFileName({ ...contractFileName, showTab: false });

      setComContractImg("")
      setContractImg({ ...contractImg, showTab: false });
      setContractResError("")
      // const includesTwenty = contractFileType.includes(file.type);
      // if (!includesTwenty) {
      //    setContractResError('Only .jpeg,.jpg,.png, .xlsx, .csv and .pdf files are allowed.');
      //    return false;

      // }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
         const fileName = new FormData();
         fileName.append("file", file);
         showLoader()
         axiosInstance.post("/company/fileupload", fileName, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
            onUploadProgress: data => {
            },

         }).then(result => {
            result = GetDecrypt(result.data)
            // console.log(result.data)
            hideLoader()
            if (result.success) {
               var tempArr = [...contractArr]
               tempArr.push({ "file_name": result.response.fileName, "original_file_name": file.name })
               setContractArr(tempArr)
            } else {
               setContractResError(result.message)
            }
         })
      }
   }

   const removeConFile = (index) => {
      const temp = [...contractArr];
      temp.splice(index, 1)
      setContractArr(temp)
   }

   function morcontc() {

      setUserContactArray([

         ...userContactArray, {
            "full_name": '',
            "designation": '',
            "email_id": '',
            "contact_number": '',
            "country_code": '+971',
            "is_primary": '0'
         }

      ])
   }

   const morcontcclose = index => e => {
      var src = [...userContactArray]
      src.splice(index, 1)
      setUserContactArray(src)

   }

   {/* Profile Details */ }
   const continueFun = () => {
      setComLogoError(false)
      setComNameError(false)
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
      setComLogoSizeError(false)
      var err = 0


      if (comLogoImg == '') {
         setComLogoError(true)
         err++
      }

      if (companyName.trim() == '') {
         setComNameError(true)
         err++
      }

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



      if (err === 0) {
         showLoader()
         setTabChange({ ...tabChange, showTab: true });

         setTimeout(() => {
            var bre = "Contact Details"
            setBreadcrumbs(bre)
            hideLoader()
            $("#cont_dett-tab").click();
         }, 1000);
      }
   }

   {/* Contact Details */ }
   const backfun = () => {
      showLoader()
      var bre = "Profile Details"
      setBreadcrumbs(bre)
      setTimeout(() => {
         hideLoader()
         $("#prof_dtlt-tab").click();
      }, 1000);

   }

   const continuefun1 = () => {

      var err = 0;

      for (let [i, data] of userContactArray.entries()) {

         if (data.full_name.trim() == '') {
            $("#fName" + i).addClass('error-fil')
            $("#fNameErr" + i).show()
            err++

         } else {
            $("#fName" + i).removeClass('error-fil')
            $("#fNameErr" + i).hide()
         }


         if (data.designation.trim() == '') {

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

         if (data.email_id.toLowerCase().trim()) {
            if (!data.email_id.toLowerCase().match(mailformat)) {

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


      if (isExist) {
         $("#eName" + 0).addClass('error-fil')
         $("#eNameExistErr" + 0).show()
      }




      if (err == 0) {
         for (let data of userContactArray) {
            if (data.is_primary == "1") {

               let data1 = {
                  "email_id": data.email_id.trim()
               }

               showLoader()
               checkUser(data1).then(result => {
                  hideLoader()

                  if (result.data.success) {

                     if (result.data.response.isAvailable === 0) {
                        setIsExist(true)
                        $("#eName" + 0).addClass('error-fil')
                        $("#eNameExistErr" + 0).show()

                     } else {
                        setIsExist(false)
                        $("#eName" + 0).removeClass('error-fil')
                        $("#eNameExistErr" + 0).hide()
                        $("#acc_lict-tab").click();
                        setTimeout(() => {
                           setTimeout(() => {
                              setConTabChange({ ...contabChange, showTab: true });
                              setTimeout(() => {
                                 var bre = "Access & License"
                                 setBreadcrumbs(bre)
                                 $("#acc_lict-tab").click();
                              }, 100);
                           }, 100);
                        }, 1000);
                     }
                  }
               })
            }

         }
      }


   }

   {/* Access & License */ }
   const backfun1 = () => {
      showLoader()
      var bre = "Contact Details"
      setBreadcrumbs(bre)
      setTimeout(() => {
         hideLoader()
         $("#cont_dett-tab").click();
      }, 1000);

   }

   const continuefun2 = () => {
      // console.log("contractArr", contractArr)
      setTypeOfAccessError(false)
      setNoOfLicensesError(false)
      setStartDateError(false)
      setEndDateError(false)
      setGenKeyError(false)
      // setContractFileError(false)

      var err = 0
      if (typeOfAccess == '0') {
         genKeyFun()
      }

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


      if (genKey == '' && typeOfAccess == '1') {
         setGenKeyError(true)
         err++
      }

      // if (contractFile == '') {
      //    setContractFileError(true)
      //    err++
      // }


      if (err == 0) {

         showLoader()
         setAcLiTabChange({ ...acLitabChange, showTab: true });

         setTimeout(() => {
            var bre = "SMTP Settings"
            setBreadcrumbs(bre)
            hideLoader()
            $("#smtpt-tab").click();
         }, 1000);

      }

   }

   {/* SMTP Settings */ }
   const backfun3 = () => {
      showLoader()
      var bre = "Access & License"
      setBreadcrumbs(bre)
      setTimeout(() => {
         hideLoader()
         $("#acc_lict-tab").click();
      }, 1000);
   }

   const finalContinueFun = () => {
      setServerAddressError(false)
      setUsernameError(false)
      setPasswordError(false)
      setPortNumberError(false)
      setDefaultSenderError(false)
      setDefaultSenderNameError(false)

      var err = 0


      // if (serverAddress.trim() == '') {
      //    setServerAddressError(true)
      //    err++
      // }

      // if (username.trim() == '') {
      //    setUsernameError(true)
      //    err++
      // }

      // if (password == '') {
      //    setPasswordError(true)
      //    err++
      // }


      // if (portNumber == '') {
      //    setPortNumberError(true)
      //    err++
      // }

      // if (defaultSender.trim() == '') {
      //    setDefaultSenderError(true)
      //    err++
      // }

      // if (defaultSenderName.trim() == '') {
      //    setDefaultSenderNameError(true)
      //    err++
      // }

      var childData = "0"


      if (getUserData().response.parent_orgn_id == 0) {
         childData = "0"
      } else {
         childData = "1"
      }


      if (typeOfAccess == 0) {
         childData = "1"
      }



      if (err == 0) {

         var data = {

            "organisation_name": companyName.trim(),
            "organisation_email": comEmailID,
            "organisation_logo": comLogoImg,
            "parent_organisation_name": parentcompanyName.trim(),
            "organisation_website": website,
            "organisation_type": companyType,
            "organisation_flag": typeOfAccess,
            "industry_type": industryType,
            "contract": contractArr,
            "license_key": genKey,
            "number_of_license": noOfLicenses,
            "license_start_datetime": startDate,
            "license_end_datetime": endDate,
            "organisation_established_yr": establishedYear,
            "organisation_countryCode": counrtyCode,
            "organisation_phone": comContactNumber,
            "organisation_address": comAddress.trim(),
            "organisation_country": COUNTRY_LIST[selectedCountry],
            "organisation_city": countryCity,
            "organisation_location": location.trim(),
            "total_emp": noOfEmployee,
            "contact_details": userContactArray,
            "smtp_setting": {
               "smtp_server_address": serverAddress.trim(),
               "username": username.trim(),
               "password": password,
               "enp_type": encryptionType,
               "port_no": portNumber,
               "sender": defaultSender.trim(),
               "sender_name": defaultSenderName.trim()
            },
            "is_child": childData,
            "orgn_id": getUserData().response.orgn_id,
            "created_by": getUserData().response.organisation_name.trim(),
            "user_id": getUserData().response.userId
         }

         // console.log(data)

         showLoader()
         addCompany(data).then(result => {
            hideLoader()
            if (result.data.success) {
               userEvent("company added")
               NotificationManager.success(result.data.message,'', 900);
               setTimeout(() => {
                  let path = `/users/companydashboard`
                  navigate(path)
               }, 1000);
            }
         })
      }
   }


   const [smtpBtn, setSmtpBtn]= useState(false)


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
            }else{
               setSmtpBtn(false)
               NotificationManager.error(result.data.message);
            }
         })
      }
   }

   const routeChangeCom = () => {
      let path = `/users/companydashboard`;
      navigate(path);
   }

   const genKeyFun = () => {
      setGenKeyError(false)
      let data = {
         "userId": getUserData().response.userId
      }

      showLoader()
      generateLicence(data).then(result => {
         hideLoader()
         setGenKey(result.data.response)

      })

   }

   const callCity = (e) => {
      setCityArray([])

      var countryName = COUNTRY_LIST[e]

      let data = {
         "userId": getUserData().response.userId,
         "country": countryName

      }

      setCountry(COUNTRY_LIST[e])


      showLoader()
      getCity(data).then(result => {
         hideLoader()
         setCityArray(result.data.response)
      })


   }

   const updateFieldChanged = index => e => {
      const newArray = userContactArray.map((item, i) => {
         if (index === i) {
            return { ...item, [e.target.name]: e.target.value };
         } else {
            return item;
         }
      });
      setUserContactArray(newArray);
   }

   const updateFieldChangedDes = (e, index, newInputValue) => {
      const newArray = userContactArray.map((item, i) => {
         if (index === i) {
            return { ...item, ["designation"]: newInputValue };
         } else {
            return item;
         }
      });
      setUserContactArray(newArray);
   }

   const onClickValidationChangeName = (data, i) => {
      if (data != '') {
         $("#fNameErr" + i).hide()
         $("#fName" + i).removeClass('error-fil')
      }
   }

   const onClickValidationChangeDes = (data, i) => {
      if (data != '') {
         $("#dNameErr" + i).hide()
         $("#dName" + i).removeClass('error-fil')
      }
   }

   const onClickValidationChangeEmail = (data, i) => {
      if (data != '') {
         $("#eNameErr" + i).hide()
         $("#eName" + i).removeClass('error-fil')
      }

      if (data) {
         if (!data.toLowerCase().match(mailformat)) {
            $("#eName" + i).addClass('error-fil')
            $("#eNamevalidErr" + i).show()
         } else {
            $("#eName" + i).removeClass('error-fil')
            $("#eNamevalidErr" + i).hide()
         }
      } else {
         $("#eNamevalidErr" + i).hide()
         $("#eName" + i).removeClass('error-fil')
      }

   }

   const onClickValidationChangeCon = (data, i) => {
      if (data != '') {
         $("#conNoErr" + i).hide()
         $("#conNo" + i).removeClass('error-fil')
      }

      if (data) {

         if (!z1.test(data)) {
            $("#conNo" + i).addClass('error-fil')
            $("#conNoValidErr" + i).show()
         } else if (data.length < 7) {
            $("#conNo" + i).addClass('error-fil')
            $("#conNoValidErr" + i).show()
         } else if (data.length > 15) {
            $("#conNo" + i).addClass('error-fil')
            $("#conNoValidErr" + i).show()
         } else {
            $("#conNo" + i).removeClass('error-fil')
            $("#conNoValidErr" + i).hide()
         }

      }
   }

   const stack = (
      <>
         <div className={`add_drg ${comLogoError || comLogoSizeError || comLogoResError ? "error-fil" : ""}`}>
            <label className='btn btn-nobg btn-lg'>Browse</label>
            <p>or drag and drop the logo of the company (max 800*400 px)</p>
            <span>
               {
                  logoImg.showTab ? <img style={{ width: "70px", height: "48px" }} src={imgUrl + comLogoImg} /> : <img src={imageicon} />
               }
            </span>
         </div>
         {
            comLogoError ?
               <span className='errorfiled'>Upload the company logo</span>
               : null
         }

         {
            comLogoSizeError ?
               <span className='errorfiled'>Height and Width must not exceed 800*400 px</span>
               : null
         }
         {
            comLogoResError ? <span className='errorfiled'>{comLogoResError}</span>
               : null
         }


      </>
   );

   const stack1 = (
      <>
         <div className={`add_drg ${contractFileError || contractResError ? "error-fil" : ""}  `}>
            <label className='btn btn-nobg btn-lg'>Browse</label>
            {
               contractFileName.showTab ? <p>{contractFile}</p> : <p>or drag and drop the contract file of the company</p>
            }
            <span>
               {
                  contractImg.showTab ? <img style={{ width: "70px", height: "48px" }} src={imgUrl + comContractImg} /> : <img src={imageicon} />
               }
            </span>
         </div>
         {
            contractFileError ?
               <span className='errorfiled'>Upload the company contract file</span>
               : null
         }
         {
            contractResError ?
               <span className='errorfiled'>{contractResError}</span>
               : null
         }

      </>
   );

   function getIndustryTypeFun(val) {
      let data = {
         "userId": getUserData().response.userId,
         "type":val
      }
      getIndustryType(data).then(result => {
         setIndTypeArray(result.data.response)
      })
   }

   function getCountryFun() {
      let data1 = {
         "userId": getUserData().response.userId
      }
      getCountry(data1).then(result => {
         setCountryArray(result.data.response)
      })
   }

   function dateChange(e) {

      var date = new Date(e);

      var dateValue = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate(), 0)

      setEndDate(moment(dateValue).format('yyyy-MM-DD'))

   }

   const onComNameChange = () => {
      if (companyName.trim() == '') {
         setComNameError(true)
      } else {
         setComNameError(false)
      }
   }

   const onComParNameChange = () => {
      if (parentcompanyName.trim() == '') {
         setParComNameError(true)
      } else {
         setParComNameError(false)
      }
   }

   const onComTypeChange = (val) => {
      setIndustryType("")
      setIndTypeArray([])
      if (val == '') {
         setComtypeError(true)
         
      } else {
         setComtypeError(false)
         getIndustryTypeFun(val)
      }
   }

   const onComIndTypeChange = (val) => {
      if (val == '') {
         setIndTypeError(true)
      } else {
         setIndTypeError(false)
      }
   }

   const onNoOfEmpChange = () => {
      if (noOfEmployee == '') {
         setnoOfEmpError(true)
      } else {
         setnoOfEmpError(false)
      }
   }

   const onComEstYrChange = (val) => {
      if (val == '') {
         setestYrError(true)
      } else {
         setestYrError(false)
      }
   }

   const onComWebsiteChange = (val) => {
      if (val == '') {
         setWebError(true)
      } else {
         setWebError(false)
      }

      if (val) {
         if (!httpRegex.test(val)) {
            setWebUrlError(true)
         } else {
            setWebUrlError(false)
         }
      } else {
         setWebUrlError(false)
      }
   }

   const onComEmailChange = (val) => {
      if (val == '') {
         setComEmailIdError(true)
      } else {
         setComEmailIdError(false)
      }

      if (val) {
         if (!val.match(mailformat)) {
            setValidEmailError(true)
         } else {
            setValidEmailError(false)
         }
      } else {
         setValidEmailError(false)
      }
   }

   const onComConNoChange = (val) => {
      if (val == '') {
         setComConNoError(true)
      } else {
         setComConNoError(false)
      }

      if (val) {
         if (!z1.test(val)) {
            setValidContactError(true)
         } else if (val.length < 7) {
            setValidContactError(true)
         } else if (val.length > 15) {
            setValidContactError(true)
         } else {
            setValidContactError(false)
            setValidContactError(false)
         }
      } else {
         setValidContactError(false)
         setValidContactError(false)
      }
   }

   const onComAddChange = () => {
      if (comAddress.trim() == '') {
         setComAddressError(true)
      } else {
         setComAddressError(false)
      }
   }

   const onComConCityChange = (val) => {
      if (val == '') {
         setconCityError(true)
      } else {
         setconCityError(false)
      }
   }

   const onComLocChange = () => {
      if (location.trim() == '') {
         setlocError(true)
      } else {
         setlocError(false)
      }
   }

   const onTypeOfAccessChange = (val) => {
      if (val == '') {
         setTypeOfAccessError(true)
      } else {
         setTypeOfAccessError(false)
      }
   }

   const onNoOfLicChange = (val) => {
      if (val == '') {
         setNoOfLicensesError(true)
      } else {
         setNoOfLicensesError(false)
      }
   }

   const onStartDateChange = (val) => {
      if (val == '') {
         setStartDateError(true)
      } else {
         setStartDateError(false)
      }
   }

   const onServerAddChange = (val) => {
      if (val == '') {
         setSmtpBtn(true)
      } else {
         setSmtpBtn(false)
      }
      setServerAddressError(false)
      if(typeOfAccess==0)
         if (val == '') {
            setServerAddressError(true)
         } else {
            setServerAddressError(false)
         }
      
   }

   const onUserNameChange = (val) => {
      setUsernameError(false)
      if(typeOfAccess==0)
         if (val == '') {
            setUsernameError(true)
         } else {
            setUsernameError(false)
         }
   }

   const onPasswordChange = (val) => {
      setPasswordError(false)
      if(typeOfAccess==0)
         if (val == '') {
            setPasswordError(true)
         } else {
            setPasswordError(false)
         }
   }

   const onPortNumChange = (val) => {
      setPortNumberError(false)
      if(typeOfAccess==0)
         if (val == '') {
            setPortNumberError(true)
         } else {
            setPortNumberError(false)
         }
   }

   const onDefSenderChange = (val) => {
      setDefaultSenderError(false)
      if(typeOfAccess==0)
         if (val == '') {
            setDefaultSenderError(true)
         } else {
            setDefaultSenderError(false)
         }
   }

   const onDefSenderNameChange = (val) => {
      setDefaultSenderNameError(false)
      if(typeOfAccess==0)
         if (val == '') {
            setDefaultSenderNameError(true)
         } else {
            setDefaultSenderNameError(false)
         }
   }


   const onHide =()=>{
      document.getElementById('blankspan').click()
   }


   const callSmtpFun=(val)=>{
      if(val==''){
         setServerAddress('')
         setUsername('')
         setPassword('')
         setEncryptionType('')
         setPortNumber('')
         setDefaultSender('')
         setDefaultSenderName('')
         setSmtpBtn(false)
      }else if(val==0){
         var data ={

         }

         smtpsetting(data).then(result=>{
            setServerAddress(result.data.response.serverAddress)
            setUsername(result.data.response.username)
            setPassword(result.data.response.password)
            setEncryptionType(result.data.response.encryptionType)
            setPortNumber(result.data.response.portNumber)
            setDefaultSender(result.data.response.defaultSender)
            setDefaultSenderName(result.data.response.defaultSenderName)
         })
         setSmtpBtn(false)
         // var obj={
         //    "serverAddress":"smtpout.secureserver.net",
         //    "username":"hello@myhygge.io",
         //    "password":"Admin@123!",
         //    "encryptionType":"1",
         //    "portNumber":"465",
         //    "defaultSender":"hello@myhygge.io",
         //    "defaultSenderName":"Hygge"
         // }

      }else{
         setSmtpBtn(true)
         setServerAddress('')
         setUsername('')
         setPassword('')
         setEncryptionType('')
         setPortNumber('')
         setDefaultSender('')
         setDefaultSenderName('')

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
                           <h3 className="compny-add">Add Company</h3>
                        </div>
                        <div className="breadcum">
                           <nav aria-label="breadcrumb">
                              <ol className="breadcrumb">
                                 <li className="breadcrumb-item"><a onClick={routeChangeCom}>Company</a></li>
                                 <li className="breadcrumb-item"><a >Add company</a></li>
                                 <li className="breadcrumb-item active" aria-current="page">{breadcrumbs}</li>
                              </ol>
                           </nav>
                        </div>
                        <br className="clear" />
                        <div className="addcompny_tab mt-4">
                           {/* TAB */}
                           <ul className="nav nav-tabs" id="myTab" role="tablist">

                              {/* Profile Details Tab */}
                              <li className="nav-item" role="presentation">
                                 <button
                                    className="nav-link active"
                                    id="prof_dtlt-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#prof_dtlt"
                                    type="button" role="tab"
                                    aria-controls="prof_dtlt"
                                    aria-selected="true"
                                    name='Profile Details'
                                    onClick={(e) => { setBreadcrumbs(e.target.name) }}
                                 >
                                    Profile Details
                                 </button>
                              </li>

                              {/* Contact Details Tab */}
                              <li className="nav-item" role="presentation">
                                 <button
                                    className="nav-link"
                                    id="cont_dett-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#cont_dett"
                                    type="button"
                                    role="tab"
                                    aria-controls="cont_dett"
                                    aria-selected="false"
                                    name='Contact Details'
                                    onClick={(e) => { setBreadcrumbs(e.target.name) }}
                                    disabled={!tabChange.showTab}
                                 >
                                    Contact Details
                                 </button>
                              </li>

                              {/* Access & License Tab */}
                              <li className="nav-item" role="presentation">
                                 <button
                                    className="nav-link"
                                    id="acc_lict-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#acc_lict"
                                    type="button"
                                    role="tab"
                                    aria-controls="acc_lict"
                                    aria-selected="false"
                                    name='Access & License'
                                    onClick={(e) => { setBreadcrumbs(e.target.name) }}
                                    disabled={!contabChange.showTab}
                                 >
                                    Access & License
                                 </button>
                              </li>

                              {/* SMTP Settings Tab */}
                              <li className="nav-item" role="presentation">
                                 <button
                                    className="nav-link"
                                    id="smtpt-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#smtpt"
                                    type="button"
                                    role="tab"
                                    aria-controls="smtpt"
                                    aria-selected="false"
                                    name='SMTP Settings'
                                    onClick={(e) => { setBreadcrumbs(e.target.name) }}
                                    disabled={!acLitabChange.showTab}
                                 >SMTP Settings</button>
                              </li>

                           </ul>
                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-md-12 col-sm-12">
                        <div className="bg-white shadow_d rounded-3 mb-4 px-5 py-5 add_comp_page">
                           <div className="tab-content" id="myTabContent">



                              {/* Profile Details */}
                              <div className="tab-pane fade show active" id="prof_dtlt" role="tabpanel"
                                 aria-labelledby="prof_dtlt-tab">

                                 {/* Company Logo */}
                                 <div className="add_comp_fm sing">
                                    <div className="add_fild_com brows_fil">
                                       <strong className='mb-2'>Company Logo</strong>

                                       <FileUploader
                                          handleChange={handleChange}
                                          name="file"
                                          // types={fileTypes}
                                          children={stack}
                                       />
                                    </div>
                                 </div>

                                 <div className="add_comp_fm">

                                    {/* Company Name */}
                                    <div className={`add_fild_com ${comNameError ? "error-fil" : ""}`}>
                                       <label>Company Name</label>
                                       <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Enter the company name"
                                          value={companyName}
                                          onChange={(e) => { setCompanyName(e.target.value); onComNameChange(); }}
                                          required
                                          onKeyDown={(e) => {
                                             if (!regspecial.test(e.key)) {
                                                e.preventDefault();
                                             }
                                          }}
                                       />
                                       {
                                          comNameError ? <span className='errorfiled'>Enter the company name</span> : null
                                       }
                                    </div>

                                    {/* Parent Company */}
                                    <div className={`add_fild_com ${parcomNameError ? "error-fil" : ""}`}>
                                       <label>Parent Company</label>
                                       <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Enter the Parent company name"
                                          value={parentcompanyName}
                                          onChange={(e) => { setParentCompanyName(e.target.value); onComParNameChange() }}
                                          required
                                          onKeyDown={(e) => {
                                             if (!regspecial.test(e.key)) {
                                                e.preventDefault();
                                             }
                                          }}
                                       />
                                       {
                                          parcomNameError ? <span className='errorfiled'>Enter the parent company name</span> : null
                                       }
                                    </div>

                                 </div>


                                 <div className="add_comp_fm">
                                    {/* Company Type */}
                                    <div className={`add_fild_com ${comTypeError ? "error-fil" : ""}`}>
                                       <label>Company Type</label>
                                       <select
                                          className="form-select"
                                          value={companyType}
                                          onChange={(e) => { setCompanyType(e.target.value); onComTypeChange(e.target.value) }}
                                          required
                                       >
                                          <option value="">Select</option>
                                          <option value="Healthcare">Healthcare</option>
                                          <option value="Non-Healthcare">Non-Healthcare</option>
                                       </select>
                                       {
                                          comTypeError ? <span className='errorfiled'>Select company type</span> : null
                                       }

                                    </div>

                                    {/* Industry Type */}
                                    <div className={`add_fild_com ${indTypeError ? "error-fil" : ""}`}>
                                       <label>Industry Type</label>
                                       <select
                                          className="form-select"
                                          value={industryType}
                                          onChange={(e) => { setIndustryType(e.target.value); onComIndTypeChange(e.target.value) }}
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


                                 <div className="add_comp_fm">

                                    {/* No of Employees */}
                                    <div className={`add_fild_com ${noOfEmpError ? "error-fil" : ""}`}>
                                       <label>No of Employees</label>
                                       <input
                                          type="number"
                                          min={1}
                                          className="form-control"
                                          placeholder="Enter the no. of employee"
                                          value={noOfEmployee}
                                          onChange={(e) => { setNoOfEmployee(e.target.value); onNoOfEmpChange() }}
                                          required
                                          onKeyDown={(e) => {
                                             if (numberInputInvalidChars.includes(e.key)) {
                                                e.preventDefault();
                                             }
                                          }}
                                       />
                                       {
                                          noOfEmpError ?
                                             <span className='errorfiled'>Enter the no. of employees</span>
                                             : null
                                       }
                                    </div>

                                    {/* Established Year */}
                                    <div className={`add_fild_com ${estYrError ? "error-fil" : ""}`}>
                                       <label>Established Year</label>
                                       <input
                                          type="date"
                                          className="form-control"
                                          value={establishedYear}
                                          onChange={(e) => { setEstablishedYear(e.target.value); onComEstYrChange(e.target.value) }}
                                          required
                                          max={todayDate}
                                       />
                                       <i className="bi bi-calendar-minus"></i>
                                       {
                                          estYrError ?
                                             <span className='errorfiled'>Select the established year</span>
                                             : null
                                       }
                                    </div>

                                 </div>


                                 <div className="add_comp_fm sing">

                                    {/* Website */}
                                    <div className={`add_fild_com ${webError || webUrlError ? "error-fil" : ""}`}>
                                       <label>Website</label>
                                       <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Enter the website"
                                          value={website}
                                          onChange={(e) => { setWebsite(e.target.value); onComWebsiteChange(e.target.value) }}
                                          required
                                          onKeyDown={(e) => {
                                             if (inputInvalidChars.includes(e.key)) {
                                                e.preventDefault();
                                             }
                                          }}
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


                                 <div className="add_comp_fm">

                                    {/* Email ID */}
                                    <div className={`add_fild_com ${comEmailIdError || validEmailError ? "error-fil" : ""}`}>
                                       <label>Email ID </label>
                                       <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Enter the email id"
                                          value={comEmailID}
                                          onChange={(e) => { setComEmailID(e.target.value); onComEmailChange(e.target.value) }}
                                          required
                                          onKeyDown={(e) => {
                                             if (inputInvalidChars.includes(e.key)) {
                                                e.preventDefault();
                                             }
                                          }}
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

                                    {/* Contact Number */}
                                    <div className={`add_fild_com`}>
                                       <label>Contact Number</label>
                                       <div className="contct_no">

                                          <div className={`country_iso ${comConNoError || validContactError ? "error-fil" : ""}`}>

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

                                          </div>

                                          <div className={`contact_num ${comConNoError || validContactError ? "error-fil" : ""}`}>

                                             <input type="number"
                                                className="form-control"
                                                placeholder="Enter the contact number"
                                                value={comContactNumber}
                                                onChange={(e) => { setComContactNumber(e.target.value); onComConNoChange(e.target.value) }}
                                                required
                                                onKeyDown={(e) => {
                                                   if (numberInputInvalidChars.includes(e.key)) {
                                                      e.preventDefault();
                                                   }
                                                }}
                                             />

                                          </div>


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


                                 <div className="add_comp_fm sing">

                                    {/* Address */}
                                    <div className={`add_fild_com ${comAddressError ? "error-fil" : ""}`}>
                                       <label>Address</label>
                                       <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Enter the address"
                                          value={comAddress}
                                          onChange={(e) => { setComAddress(e.target.value); onComAddChange() }}
                                          required
                                       />
                                       {
                                          comAddressError ?
                                             <span className='errorfiled'>Enter the address</span>
                                             : null
                                       }
                                    </div>

                                 </div>



                                 <div className="add_comp_fm">

                                    {/* Country & City */}
                                    <div className={`add_fild_com ${conCityError ? "error-fil" : ""}`}>
                                       <label>Country & City</label>
                                       <div className="contct_no">

                                          <ReactFlagsSelect
                                             showSelectedLabel={false}
                                             selected={selectedCountry}
                                             value={country}
                                             onSelect={(e) => { setSelectedCountry(e); callCity(e); }}

                                          />

                                          <span id="blankspan"></span>
                                          <select
                                             style={{ width: "100%" }}
                                             className="form-select"
                                             value={countryCity}
                                             onChange={(e) => { setCountryCity(e.target.value); onComConCityChange(e.target.value) }}
                                             required
                                             onFocus={onHide}
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
                                             <span className='errorfiled'>Select the city</span>
                                             : null
                                       }
                                    </div>

                                    {/* Location */}
                                    <div className={`add_fild_com ${locError ? "error-fil" : ""}`}>
                                       <label>Location</label>
                                       <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Enter the location"
                                          value={location}
                                          onChange={(e) => { setLocation(e.target.value); onComLocChange() }}
                                          required
                                          onKeyDown={(e) => {
                                             if (!regspecial.test(e.key)) {
                                                e.preventDefault();
                                             }
                                          }}
                                       />
                                       {
                                          locError ?
                                             <span className='errorfiled'>Enter the location</span>
                                             : null
                                       }
                                    </div>

                                 </div>

                                 <div className="butn_dv">
                                    <button></button>
                                    <button className="btn btn-primary btn-lg" onClick={continueFun}>Continue</button>
                                 </div>
                              </div>

                              {/* Contact Details */}
                              <div className="tab-pane fade " id="cont_dett" role="tabpanel"
                                 aria-labelledby="cont_dett-tab">

                                 {

                                    userContactArray.map((item, index) =>

                                       <div key={index}>
                                          {
                                             item.is_primary == 1 ?

                                                <div className="add_contct">
                                                   <h4>Primary Contact Details</h4>

                                                   <div className="add_comp_fm">

                                                      <div className={`add_fild_com`} id={"fName" + index}>
                                                         <label >Full Name</label>
                                                         <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter your full name"
                                                            value={item.full_name}
                                                            id={index}
                                                            name="full_name"
                                                            onChange={updateFieldChanged(index)}
                                                            onKeyPress={onClickValidationChangeName(item.full_name, index)}
                                                            required
                                                            onKeyDown={(e) => {
                                                               if (!regspecial.test(e.key)) {
                                                                  e.preventDefault();
                                                               }
                                                            }}
                                                         />
                                                         <span className='errorfiled' id={"fNameErr" + index} style={{ display: "none" }}>Enter the full name</span>
                                                      </div>
                                                      <div className={`add_fild_com`} id={"dName" + index}>
                                                         <label>Designation</label>


                                                         {/* <select
                                                            className="form-select"
                                                            value={item.designation}
                                                            id={index}
                                                            name="designation"
                                                            onChange={updateFieldChanged(index)}
                                                            onKeyPress = { onClickValidationChangeDes(item.designation,index)}
                                                            required
                                                         >
                                                            <option value="">Select</option>
                                                            <option value="CEO">CEO</option>
                                                            <option value="HR">HR</option>
                                                            <option value="Manager">Manager</option>

                                                         </select> */}
                                                         <Autocomplete
                                                            name="designation"
                                                            inputValue={item.designation}
                                                            value={item.designation}
                                                            onInputChange={(e, newInputValue) => { updateFieldChangedDes(e, index, newInputValue) }}
                                                            onKeyPress={onClickValidationChangeDes(item.designation, index)}
                                                            id={index}
                                                            options={myOptions}
                                                            renderInput={(params) => <TextField {...params} placeholder="Enter or select your designation" />}
                                                         />

                                                         <span className='errorfiled' id={"dNameErr" + index} style={{ display: "none" }}>Select the designation</span>
                                                      </div>

                                                   </div>

                                                   <div className="add_comp_fm">

                                                      <div className={`add_fild_com`} id={"eName" + index}>
                                                         <label>Email ID </label>
                                                         <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter the email id"
                                                            value={item.email_id}
                                                            id={index}
                                                            name="email_id"
                                                            onChange={updateFieldChanged(index)}
                                                            onKeyPress={onClickValidationChangeEmail(item.email_id, index)}
                                                            required
                                                            onKeyDown={(e) => {
                                                               if (inputInvalidChars.includes(e.key)) {
                                                                  e.preventDefault();
                                                               }
                                                            }}
                                                         />
                                                         <span className='errorfiled' id={"eNameErr" + index} style={{ display: "none" }}>Enter the email id</span>
                                                         <span className='errorfiled' id={"eNamevalidErr" + index} style={{ display: "none" }}>Enter the valid email id</span>
                                                         <span className='errorfiled' id={"eNameExistErr" + index} style={{ display: "none" }}>Email already exist</span>

                                                      </div>
                                                      <div className={`add_fild_com`} >
                                                         <label>Contact Number</label>
                                                         <div className="contct_no">
                                                            <div className={`country_iso`} >

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

                                                            </div>
                                                            <div className={`contact_num`} id={"conNo" + index}>
                                                               <input
                                                                  type="number"
                                                                  className="form-control"
                                                                  placeholder="Mobile No."
                                                                  value={item.contact_number}
                                                                  id={index}
                                                                  name="contact_number"
                                                                  onChange={updateFieldChanged(index)}
                                                                  onKeyPress={onClickValidationChangeCon(item.contact_number, index)}
                                                                  onKeyDown={(e) => {
                                                                     if (numberInputInvalidChars.includes(e.key)) {
                                                                        e.preventDefault();
                                                                     }
                                                                  }}
                                                                  required
                                                               />

                                                            </div>

                                                         </div>

                                                         <span className='errorfiled' id={"conNoErr" + index} style={{ display: "none" }}>Enter the contact no.</span>
                                                         <span className='errorfiled' id={"conNoValidErr" + index} style={{ display: "none" }}>Enter the valid contact no.</span>
                                                      </div>

                                                   </div>
                                                </div>
                                                :
                                                <div id="mor_contc" className="other_detl add_contct" >
                                                   <strong>Other Contact Details</strong>

                                                   <button
                                                      type='button'
                                                      className="btn btn-nobg btn-lg remov_con"
                                                      onClick={morcontcclose(index)}>
                                                      <i className="bi bi-plus-circle"></i> Delete Contact</button>

                                                   <div className="add_comp_fm">

                                                      <div className={`add_fild_com`} id={"fName" + index}>
                                                         <label>Full Name </label>
                                                         <input
                                                            type="text"
                                                            name="full_name"
                                                            className="form-control"
                                                            placeholder="Enter your full name"
                                                            value={item.full_name}
                                                            id={index}
                                                            onChange={updateFieldChanged(index)}
                                                            onKeyPress={onClickValidationChangeName(item.full_name, index)}
                                                            required
                                                            onKeyDown={(e) => {
                                                               if (!regspecial.test(e.key)) {
                                                                  e.preventDefault();
                                                               }
                                                            }}
                                                         />
                                                         <span className='errorfiled' id={"fNameErr" + index} style={{ display: "none" }}>Enter the full name</span>

                                                      </div>
                                                      <div className={`add_fild_com`} id={"dName" + index}>
                                                         <label>Designation</label>
                                                         {/* <select
                                                            className="form-select"
                                                            value={item.designation}
                                                            name="designation"
                                                            id={index}
                                                            onChange={updateFieldChanged(index)}
                                                            onKeyPress={onClickValidationChangeDes(item.designation, index)}
                                                            required
                                                         >
                                                            <option value="">Select</option>
                                                            <option value="CEO">CEO</option>
                                                            <option value="HR">HR</option>
                                                            <option value="Manager">Manager</option>
                                                         </select> */}

                                                         <Autocomplete
                                                            name="designation"
                                                            inputValue={item.designation}
                                                            value={item.designation}
                                                            onInputChange={(e, newInputValue) => { updateFieldChangedDes(e, index, newInputValue) }}
                                                            onKeyPress={onClickValidationChangeDes(item.designation, index)}
                                                            id={index}
                                                            options={myOptions}
                                                            renderInput={(params) => <TextField {...params}
                                                               placeholder="Enter or select your designation" />}
                                                         />

                                                         <span className='errorfiled' id={"dNameErr" + index} style={{ display: "none" }}>Select the designation</span>
                                                      </div>

                                                   </div>

                                                   <div className="add_comp_fm">

                                                      <div className={`add_fild_com`} id={"eName" + index}>
                                                         <label>Email ID </label>
                                                         <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter the email id"
                                                            value={item.email_id}
                                                            name="email_id"
                                                            id={index}
                                                            onChange={updateFieldChanged(index)}
                                                            onKeyPress={onClickValidationChangeEmail(item.email_id, index)}
                                                            required
                                                            onKeyDown={(e) => {
                                                               if (inputInvalidChars.includes(e.key)) {
                                                                  e.preventDefault();
                                                               }
                                                            }}
                                                         />
                                                         <span className='errorfiled' id={"eNameErr" + index} style={{ display: "none" }}>Enter the email id</span>
                                                         <span className='errorfiled' id={"eNamevalidErr" + index} style={{ display: "none" }}>Enter the valid email id</span>

                                                      </div>
                                                      <div className={`add_fild_com`} >
                                                         <label>Contact Number</label>
                                                         <div className="contct_no">
                                                            <div className={`country_iso`}>
                                                               <select
                                                                  className="form-select"
                                                                  value={item.country_code}
                                                                  name="country_code"
                                                                  id={index}
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
                                                            </div>
                                                            <div className={`contact_num`} id={"conNo" + index}>
                                                               <input
                                                                  type="number"
                                                                  className="form-control"
                                                                  placeholder="Mobile No. "
                                                                  name="contact_number"
                                                                  value={item.contact_number}
                                                                  onChange={updateFieldChanged(index)}
                                                                  onKeyPress={onClickValidationChangeCon(item.contact_number, index)}
                                                                  required
                                                                  onKeyDown={(e) => {
                                                                     if (numberInputInvalidChars.includes(e.key)) {
                                                                        e.preventDefault();
                                                                     }
                                                                  }}
                                                               />
                                                            </div>
                                                         </div>
                                                         <span className='errorfiled' id={"conNoErr" + index} style={{ display: "none" }}>Enter the contact no.</span>
                                                         <span className='errorfiled' id={"conNoValidErr" + index} style={{ display: "none" }}>Enter the valid contact no.</span>

                                                      </div>

                                                   </div>
                                                </div>
                                          }


                                       </div>


                                    )

                                 }

                                 <div className="mor_contct">
                                    <button className="btn btn-nobg btn-lg addnewcn" onClick={morcontc}>
                                       <i className="bi bi-plus-circle"></i> Add another contact</button>
                                 </div>


                                 <div className="butn_dv">
                                    <button onClick={backfun}><i className="bi bi-chevron-double-left"></i> Back</button>
                                    <button
                                       onClick={continuefun1}
                                       className="btn btn-primary btn-lg"
                                    >Continue</button>
                                 </div>
                              </div>

                              {/* Access & License */}
                              <div className="tab-pane fade " id="acc_lict" role="tabpanel"
                                 aria-labelledby="acc_lict-tab">
                                 <h4>Access & License Details</h4>

                                 <div className="add_comp_fm">

                                    <div className={`add_fild_com ${typeOfAccessError ? "error-fil" : ""}`}>
                                       <label>Type of Access</label>
                                       <select
                                          className="form-select"
                                          value={typeOfAccess}
                                          onChange={(e) => { setTypeOfAccess(e.target.value); onTypeOfAccessChange(e.target.value); callSmtpFun(e.target.value)  }}
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
                                    <div className={`add_fild_com ${noOfLicensesError ? "error-fil" : ""}`}>
                                       <label>No of Licenses</label>
                                       <input
                                          type="number"
                                          className="form-control"
                                          placeholder='Enter the no. of licenses'
                                          value={noOfLicenses}
                                          onChange={(e) => { setNoOfLicenses(e.target.value); onNoOfLicChange(e.target.value) }}
                                          required
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

                                 <div className="add_comp_fm">

                                    <div className={`add_fild_com ${startDateError ? "error-fil" : ""}`}>
                                       <label>Start Date</label>
                                       <input
                                          type="date"
                                          className="form-control"
                                          value={startDate}
                                          onChange={(e) => { setStartDate(e.target.value); dateChange(e.target.value); onStartDateChange(e.target.value) }}
                                          required
                                       />
                                       <i className="bi bi-calendar-minus"></i>
                                       {
                                          startDateError ?
                                             <span className='errorfiled'>Select the start date</span>
                                             : null
                                       }
                                    </div>
                                    <div className={`add_fild_com ${endDateError ? "error-fil" : ""}`}>
                                       <label>End Date</label>
                                       <input
                                          type="date"
                                          className="form-control"
                                          min={endDate}
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
                                    </div>

                                 </div>

                                 <div className="genert_lic_key">
                                    {
                                       typeOfAccess == 1 ? <button className={`btn btn-nobg btn-lg ${genKeyError ? "error-fil" : ""}  `} onClick={genKeyFun} disabled={genKey}>Generate License Key</button> : null
                                    }

                                    {
                                       typeOfAccess == 1 ? genKey ? <span>{genKey}</span> : null : null
                                    }

                                 </div>
                                 {genKeyError ? <span className='errorfiled'>Generate the license key</span> : null}


                                 <div className="add_comp_fm sing mt-3">
                                    <div className="add_fild_com brows_fil">
                                       <strong className='mb-2'>Contract</strong>

                                       <FileUploader
                                          handleChange={handleChangeCom}
                                          name="file"
                                          // types={contractFileType}
                                          children={stack1}
                                       />
                                    </div>

                                    {
                                       contractArr.map((item, i) => (
                                          <div className="poog_sts" style={{ width: "100%" }}>
                                             <div className="employee_progs">
                                                <div className="employee_file_icn"><i className="bi bi-file-text"></i>
                                                </div>
                                                <div className="employee_progs_div">
                                                   <p>{item.original_file_name}</p>

                                                   <div className="progress">

                                                      <div className="progress-bar" id="progress_bar_contract" style={{width:"100%"}}>
                                                         {/* <div className="progress-value">90%</div> */}
                                                         <div className="progress-value" id="progress_percentage_contract" >100%</div>
                                                      </div>

                                                   </div>

                                                </div>
                                                <button onClick={() => { removeConFile(i) }}><i className="bi bi-x"></i></button>

                                             </div>
                                          </div>
                                       ))
                                    }




                                 </div>
                                 <div className="butn_dv">
                                    <button onClick={backfun1}><i className="bi bi-chevron-double-left"></i> Back</button>
                                    <button className="btn btn-primary btn-lg" onClick={continuefun2}>Continue</button>
                                 </div>
                              </div>

                              {/* SMTP Settings */}
                              <div className="tab-pane fade"
                                 id="smtpt"
                                 role="tabpanel" aria-labelledby="smtpt-tab">
                                 <h4>SMTP Settings</h4>
                                 <div className="add_comp_fm sing">
                                    
                                    <div className={`add_fild_com ${serverAddressError ? "error-fil" : ""}`}>
                                       <label>SMTP Server Address</label>
                                       <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Enter your SMTP Server Address"
                                          value={serverAddress}
                                          onChange={(e) => { setServerAddress(e.target.value); onServerAddChange(e.target.value) }}
                                          required
                                          onKeyDown={(e) => {
                                             if (inputInvalidChars.includes(e.key)) {
                                                e.preventDefault();
                                             }
                                          }}
                                       />
                                       {
                                          serverAddressError ?
                                             <span className='errorfiled'>Enter the smtp server address</span>
                                             : null
                                       }
                                    </div>

                                 </div>
                                 <div className="add_comp_fm">
                                    <div className={`add_fild_com ${usernameError ? "error-fil" : ""}`}>
                                       <label>Username</label>
                                       <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Enter your username"
                                          value={username}
                                          onChange={(e) => { setUsername(e.target.value); onUserNameChange(e.target.value) }}
                                          required
                                          onKeyDown={(e) => {
                                             if (inputInvalidChars.includes(e.key)) {
                                                e.preventDefault();
                                             }
                                          }}
                                       />
                                       {
                                          usernameError ?
                                             <span className='errorfiled'>Enter the username</span>
                                             : null
                                       }
                                    </div>
                                    <div className={`add_fild_com ${passwordError ? "error-fil" : ""}`}>
                                       <label>Password</label>
                                       <input
                                          type="password"
                                          className="form-control"
                                          placeholder="Enter your password"
                                          value={password}
                                          onChange={(e) => { setPassword(e.target.value); onPasswordChange(e.target.value) }}
                                          required
                                          onKeyDown={(e) => {
                                             if (inputInvalidChars.includes(e.key)) {
                                                e.preventDefault();
                                             }
                                          }}
                                       />
                                       {
                                          passwordError ?
                                             <span className='errorfiled'>Enter the password</span>
                                             : null
                                       }
                                    </div>
                                 </div>
                                 <div className="add_comp_fm">
                                    <div className={`add_fild_com smtp_pt`}>
                                       <label>Encryption Type & Port Number</label>
                                       <div className="contct_no">
                                          <div className='con_port'>
                                          <select className="form-select"
                                             value={encryptionType}
                                             onChange={(e) => setEncryptionType(e.target.value)}
                                             required
                                          >
                                             <option value="0">None</option>
                                             <option value="1">SSL</option>

                                          </select>

                                          </div>
                                          
                                         <div className={`con_num ${portNumberError ? "error-fil" : ""}`} >
                                         <input
                                             type="text"
                                             className="form-control"
                                             placeholder="Enter your port number"
                                             value={portNumber}
                                             onChange={(e) => { setPortNumber(e.target.value); onPortNumChange(e.target.value) }}
                                             required
                                             onKeyDown={(e) => {
                                                if (numberInputInvalidChars.includes(e.key)) {
                                                   e.preventDefault();
                                                }
                                             }}
                                          />
                                         </div>
                                          

                                       </div>
                                       {
                                          portNumberError ?
                                             <span className='errorfiled'>Enter the port number</span>: null
                                       }
                                    </div>
                                    <div></div>
                                 </div>
                                 <div className="add_comp_fm">
                                    <div className={`add_fild_com ${defaultSenderError ? "error-fil" : ""}`}>
                                       <label>Default Sender</label>
                                       <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Enter your default sender"
                                          value={defaultSender}
                                          onChange={(e) => { setDefaultSender(e.target.value); onDefSenderChange(e.target.value) }}
                                          required
                                       />
                                       {
                                          defaultSenderError ?
                                             <span className='errorfiled'>Enter the default sender</span>
                                             : null
                                       }
                                    </div>
                                    <div className={`add_fild_com ${defaultSenderNameError ? "error-fil" : ""}`}>
                                       <label>Default Sender Name</label>
                                       <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Enter your default sender name"
                                          value={defaultSenderName}
                                          onChange={(e) => { setDefaultSenderName(e.target.value); onDefSenderNameChange(e.target.value) }}
                                          required
                                       />
                                       {
                                          defaultSenderNameError ?
                                             <span className='errorfiled'>Enter the default sender name</span>
                                             : null
                                       }
                                    </div>
                                 </div>
                                 <div className="butn_dv">
                                    <button onClick={backfun3}><i className="bi bi-chevron-double-left"></i> Back</button>
                                    {
                                       smtpBtn?<button className="btn btn-primary btn-lg" onClick={finalContinueFun}>Add Company</button>:<button className="btn btn-primary btn-lg" onClick={smtpCheckFun}>Check Connection</button>
                                    }
                                    
                                    
                                 </div>
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
      </>
   )
}

export default AddCompany