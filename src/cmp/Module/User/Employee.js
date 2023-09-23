///-----------Import Files-----------///
import React, { useState, useEffect } from 'react'
import LoggedLayout from './LoggedLayout'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FileUploader } from "react-drag-drop-files";
import { addEmployee, deleteEmployee, editEmployee, getEmployee, toggleCheck, getTempEmployee, editTempEmployee, saveTempEmployee, deleteAllEmployee, axiosInstance, downloadEmpolyee } from '../../../service/EmployeeService';
import { getUserData, showLoader, hideLoader, getUserRole, GetDecrypt } from '../../../service/Common';
import { EMPLOYEE_CSV_TEMP } from '../../../config/app_url';
import { saveAs } from 'file-saver'
import $ from 'jquery'
import { LIMIT_ARRAY } from '../../../constant/constantValue';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { checkUser, userEvent } from '../../../service/Services';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { IMAGE_URL } from '../../../config/app_url';
///--------------Import Images-------------///
const closeicon = require('../../../assets/images/close-icon.png');
const dragicon = require('../../../assets/images/drag-icon.png');
const infoicon = require('../../../assets/images/info-icon.png');
const iicon = require('../../../assets/images/i-icon.png');
const downloadicon = require('../../../assets/images/download-icon.png');
const folderarrowup = require('../../../assets/images/folder-arrow-up.png');
const downloadicon2 = require('../../../assets/images/download-icon2.png');
const downloadicon3 = require('../../../assets/images/download-icon3.png');
const campemty = require('../../../assets/images/camp-emty.png');
///--------------Import File upload format-------------///
const fileType = ["CSV", "XLS", "XLSX"];
//-----------Stateless Functional Component named Employee--------//
function Employee() {
  /* Variables */
  const [show, setShow] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [empId, setEmpId] = useState("");
  //Add Employee 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNameValidate, setFirstNameValidate] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameValidate, setLastNameValidate] = useState(false);
  const [emailIdError, setEmailIdError] = useState(false);
  const [validEmailIdError, setValidEmailError] = useState(false);
  const [existEmailIdError, setExistEmailError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  //Edit Employee
  const [firstNameEdit, setFirstNameEdit] = useState("");
  const [lastNameEdit, setLastNameEdit] = useState("");
  const [emailIdEdit, setEmailIdEdit] = useState("");
  const [firstNameEditError, setFirstNameEditError] = useState(false);
  const [firstNameEditValidate, setFirstNameEditValidate] = useState(false);
  const [lastNameEditError, setLastNameEditError] = useState(false);
  const [lastNameEditValidate, setLastNameEditValidate] = useState(false);
  const [emailIdEditError, setEmailIdEditError] = useState(false);
  const [validEmailIdEditError, setValidEmailEditError] = useState(false);
  //Employee List
  const [employeeList, setEmployeeList] = useState([]);
  const [deleteDiv, setDeleteDiv] = useState(false);
  const [selectDeleteDiv, setSelectDeleteDiv] = useState(false);
  const [selectDeleteCount, setSelectDeleteCount] = useState(0);
  // ------------- Tab Change Variable ----------------//
  const [uploadFileChange, setUploadFileChange] = React.useState({ showTab: true })
  const [repairtabChange, setRepairTabChange] = React.useState({ showTab: false })
  const [privacytabChange, setPrivacyTabChange] = React.useState({ showTab: false })
  // ------------- Button Change Variable ----------------//
  const [nextBtn, setNextBtn] = React.useState({ showTab: false })
  const [privacyBtn, setPrivacyBtn] = React.useState({ showTab: false })
  //Bulk Inport 
  const [batchId, setBatchId] = useState("");
  const [limitArr, setLimitArr] = useState([]);
  const [tempEmpList, setTempEmpList] = useState([])
  const [limit, setLimit] = useState("10");
  const [offset, setOffset] = useState("0");
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [limitEmpList, setLimitEmpList] = useState("10");
  const [offsetEmpList, setOffsetEmpList] = useState("0");
  const [totalPageEmpList, setTotalPageEmpList] = useState(0);
  const [deleteBulkId, setDeleteBulkId] = useState([])
  const [report, setReport] = useState("csv")
  const [uploadError, setUploadError] = useState(false)
  const [upFileName, setUpFileName] = useState("")
  const [csvFormatError, setCsvFormatError] = useState(false)
  const [csvSizeError, setCsvSizeError] = useState(false)
  const [csvFormatErrorMsg, setCsvFormatErrorMsg] = useState("")
  let [errorCount, setErrorCount] = useState(0)
  let [errorDiv, setErrorDiv] = useState(false)
  let [successDiv, setSuccessDiv] = useState(false)
  const [totalPage, setTotalPage] = useState(0);
  var mailformat = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$";
  var regName = /^[A-Za-z ]+$/;
  var reqData = {
    "user_id": getUserData().response.userId,
    "orgn_id": getUserData().response.orgn_id,
    "limit": limitEmpList,
    "offset": offsetEmpList,
    "search": search,
    "sort": sort
  }
  const inputInvalidChars = [' '];

  const [totalCount, setTotalCount] = useState(0);

  const [orgType, setorgType] = useState('');
  const [orgTypes, setorgTypes] = useState('');

  const [canEdit, SetCanEdit] = React.useState(false)


  /* Functions */
  //------------------UseEffect-----------------// 
  useEffect(() => {
    fetchEmployeeFun(reqData)
  }, [limitEmpList, offsetEmpList, sort])
  useEffect(() => {
    getTempEmployeeFun(false)
    setLimitArr(LIMIT_ARRAY)
  }, [limit, offset])
  useEffect(() => {
    if (getUserData().response.organisation_type == "Non-Healthcare") {
      setorgType("Employee")
      setorgTypes("Employees")
      var role = getUserRole("Employees")
      if (role) {
        if (role.can_edit == 1) {
          SetCanEdit(true)
        }
      }
    } else if (getUserData().response.organisation_type == "Healthcare") {
      setorgType("Patient")
      setorgTypes("Patients")
      var role = getUserRole("Patients")
      if (role) {
        if (role.can_edit == 1) {
          SetCanEdit(true)
        }
      }
    }
  }, [])
  //-------------- callback functions -------------//
  const handleShow = () => {
    showLoader()
    setShow(true)
    setTimeout(() => {
      hideLoader()
    }, 1000);
  };
  const handleShowSuccessModal = () => {
    setSuccessModal(true)
  };
  const handleShowEditModal = (item) => {
    setEditModal(true);
    setFirstNameEdit(item.first_name)
    setLastNameEdit(item.last_name)
    setEmailIdEdit(item.empemail)
    setEmpId(item.emp_id)
  }
  const handleShowDeleteModal = (item) => {
    setDeleteModal(true)
    setEmpId(item.emp_id)
  };
  const handleClose = () => {
    showLoader()
    setShow(false);
    setFirstName('')
    setLastName('')
    setEmailId('')
    setErrorMsg('')
    setFirstNameError(false)
    setLastNameError(false)
    setEmailIdError(false)
    setValidEmailError(false)
    setFirstNameValidate(false)
    setLastNameValidate(false)
    setExistEmailError(false)
    setTimeout(() => {
      hideLoader()
    }, 1000);
  }
  const handleCloseSuccessModal = () => {
    showLoader()
    setSuccessModal(false);
    setTimeout(() => {
      hideLoader()
    }, 1000);
  }
  const handleCloseEditModal = () => {
    showLoader()
    setEditModal(false);
    setFirstNameEdit('')
    setLastNameEdit('')
    setEmailIdEdit('')
    setFirstNameEditError(false)
    setLastNameEditError(false)
    setEmailIdEditError(false)
    setValidEmailEditError(false)
    setFirstNameEditValidate(false)
    setLastNameEditValidate(false)
    setTimeout(() => {
      hideLoader()
    }, 1000);
  }
  const crossTab = () => {
    setUploadError(false);
    setCsvFormatError(false)
    setBatchId('');
    setNextBtn({ ...nextBtn, showTab: false });
    $("input[name=file]").val('');
  }
  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
  }
  const addEmployeeFun = () => {
    setFirstNameError(false)
    setLastNameError(false)
    setEmailIdError(false)
    setValidEmailError(false)
    setFirstNameValidate(false)
    setLastNameValidate(false)
    setExistEmailError(false)
    setErrorMsg("")
    var err = 0
    if (firstName.trim() == '') {
      setFirstNameError(true)
      err++
    }
    if (firstName.trim() != '' && !regName.test(firstName.trim())) {
      setFirstNameValidate(true)
      err++
    }
    if (lastName.trim() == '') {
      setLastNameError(true)
      err++
    }
    if (lastName.trim() != '' && !regName.test(lastName.trim())) {
      setLastNameValidate(true)
      err++
    }
    if (emailId == '') {
      setEmailIdError(true)
      err++
    } else {
      if (!emailId.match(mailformat)) {
        setValidEmailError(true)
        err++
      }
    }
    var val = {
      "orgn_id": getUserData().response.orgn_id,
      "first_name": firstName.trim(),
      "last_name": lastName.trim(),
      "email_id": emailId,
      "user_id": getUserData().response.userId
    }
    if (err == 0) {
      showLoader()
      addEmployee(val).then(result => {
        hideLoader()
        if (result.data.success) {
          userEvent("Add " + orgType)
          handleClose()
          handleShowSuccessModal()
          fetchEmployeeFun(reqData)
          setFirstName('')
          setLastName('')
          setEmailId('')
          setErrorMsg('')
          setFirstNameError(false)
          setLastNameError(false)
          setEmailIdError(false)
          setValidEmailError(false)
          setFirstNameValidate(false)
          setLastNameValidate(false)
          setExistEmailError(false)
        } else {
          setErrorMsg(result.data.message)
          setExistEmailError(true)
        }
      })
    }

  }
  const fetchEmployeeFun = (reqData) => {
    showLoader()
    getEmployee(reqData).then(result => {
      hideLoader()
      if (result.data.success) {
        setEmployeeList(result.data.response.employee)
        setTotalCount(result.data.response.count)
        let totalPage = Math.ceil(result.data.response.count / limitEmpList);
        setTotalPageEmpList(totalPage);
      }
    })
  }
  const handleKeyPress = () => {
    if (search.length >= '2') {
      fetchEmployeeFun(reqData)
    }
    if (search.length == '0') {
      fetchEmployeeFun(reqData)
    }
  }
  const toggleCheckbox = (e, item) => {
    const { checked, value } = e.target;
    var data = {
      "orgn_id": getUserData().response.orgn_id,
      "emp_id": value,
      "activated": checked
    }
    showLoader()
    toggleCheck(data).then(result => {
      hideLoader()
      if (result.data.success) {
        fetchEmployeeFun(reqData);
        if (checked) {
          NotificationManager.success(result.data.message);
        } else {
          NotificationManager.error(result.data.message);
        }
      } else {
        NotificationManager.error(result.data.message);
      }
    })
  }
  const editEmployeeFun = () => {
    setFirstNameEditError(false)
    setLastNameEditError(false)
    setEmailIdEditError(false)
    setValidEmailEditError(false)
    setFirstNameEditValidate(false)
    setLastNameEditValidate(false)
    var err = 0
    if (firstNameEdit == '') {
      setFirstNameEditError(true)
      err++
    }
    if (firstNameEdit != '' && !regName.test(firstNameEdit)) {
      setFirstNameEditValidate(true)
      err++
    }
    if (lastNameEdit == '') {
      setLastNameEditError(true)
      err++
    }
    if (lastNameEdit != '' && !regName.test(lastNameEdit)) {
      setLastNameEditValidate(true)
      err++
    }
    var data = {
      "orgn_id": getUserData().response.orgn_id,
      "emp_id": empId,
      "first_name": firstNameEdit,
      "last_name": lastNameEdit
    }
    if (err == 0) {
      showLoader()
      editEmployee(data).then(result => {
        hideLoader()
        if (result.data.success) {
          userEvent("Update " + orgType)
          NotificationManager.success(result.data.message);
          fetchEmployeeFun(reqData);
          handleCloseEditModal()
          setFirstNameEdit('')
          setLastNameEdit('')
          setEmailIdEdit('')
          setEmpId('')
        } else {
          NotificationManager.error(result.data.message);
        }
      })
    }
  }
  const delEmployee = () => {
    var data = {
      "orgn_id": getUserData().response.orgn_id,
      "emp_id": empId
    }
    deleteEmployee(data).then(result => {
      showLoader()
      if (result.data.success) {
        hideLoader()
        handleCloseDeleteModal();
        NotificationManager.success(result.data.message);
        userEvent("Delete " + orgType)
        fetchEmployeeFun(reqData);
      } else {
        NotificationManager.error(result.data.message);
      }
    })
  }
  const handleChange = (e) => {
    setDeleteBulkId([])
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempUser = employeeList.map((user) => {
        return { ...user, isChecked: checked };
      });
      if (checked) {
        setDeleteDiv(true)
      } else {
        setDeleteDiv(false)
      }
      setSelectDeleteDiv(false)
      setEmployeeList(tempUser);
      var temp = []
      for (let data of tempUser) {
        var val = data.emp_id
        temp.push(val)
      }
      setDeleteBulkId(temp)
    } else {
      let tempUser = employeeList.map((user, index) =>
        user.first_name + index === name ? { ...user, isChecked: checked } : user
      );
      setDeleteDiv(false)
      var count = 0
      for (let data of tempUser) {
        if (data.isChecked == true) {
          count++
        }
      }
      setSelectDeleteCount(count)
      if (tempUser.length == count) {
        setDeleteDiv(true)
        setSelectDeleteDiv(false)
      } else {
        setDeleteDiv(false)
        setSelectDeleteDiv(true)
      }
      if (count == 0) {
        setDeleteDiv(false)
        setSelectDeleteDiv(false)
      }
      setEmployeeList(tempUser);
      var temp = []
      for (let data of tempUser) {
        if (data.isChecked == true) {
          var val = data.emp_id
          temp.push(val)
        }
      }
      setDeleteBulkId(temp)
    }
  };
  const cancelSelect = () => {
    let tempUser = employeeList.map((user) => {
      return { ...user, isChecked: false };
    });
    setDeleteBulkId([])
    setEmployeeList(tempUser);
    setDeleteDiv(false)
    setSelectDeleteDiv(false)
  }
  const reportDownloadFun = () => {
    var data = {
      "orgn_id": getUserData().response.orgn_id,
      "search": search,
      "type": report,
      "sort": sort
    }
    showLoader()
    downloadEmpolyee(data).then(result => {
      hideLoader()
      if (result.data.success) {
        saveAs(IMAGE_URL + result.data.response.fileName, result.data.response.fileName)
        userEvent("Download " + orgType + " report")
      } else {
        NotificationManager.error(result.data.message);
      }
    })
  }
  const handleChangeFile = (file) => {
    $('#progress_bar_csv').css('width', '0%');
    $('#progress_percentage_csv').html('0%');
    setUploadError(true)
    setCsvFormatError(false)
    setCsvSizeError(false)
    setUpFileName("")
    setBatchId("")
    setNextBtn({ ...nextBtn, showTab: false });
    setCsvFormatErrorMsg("")
    const fileSize = file.size;
    const fileMb = fileSize / 1024 ** 2;
    if (fileMb > 25) {
      setCsvSizeError(true)
      return false;
    }
    setUpFileName(file.name)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fileName = new FormData();
      fileName.append("file", file);
      fileName.append("orgn_id", getUserData().response.orgn_id);
      fileName.append("user_id", getUserData().response.userId);
      showLoader()
      axiosInstance.post("/v1/employee/uploadEmployee", fileName, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: data => {
          var bar = $('#progress_bar_csv');
          var percentage = parseInt($('#progress_percentage_csv').html());
          function stopProgress() {
            clearInterval(progress);
          }
          var progress = setInterval(function () {
            percentage++;
            if (percentage <= 100) {
              $('#progress_percentage_csv').html(percentage + '%');
              if (percentage > 0) {
                bar.css('width', percentage + '%');
              }
            }
            else {
              stopProgress()
            }
          }, 30);
        },

      }).then(result => {
        hideLoader()
        result = GetDecrypt(result.data)
        console.log(result)
        if (result.success) {
          setCsvFormatError(false)
          setCsvSizeError(false)
          setBatchId(result.response.batch_id)
          $("input[name=file]").val('');
          setNextBtn({ ...nextBtn, showTab: true });

        } else {
          setUploadError(false)
          setCsvFormatError(true)
          setCsvSizeError(false)
          setCsvFormatErrorMsg(result.message)
          $("input[name=file]").val('');
          setNextBtn({ ...nextBtn, showTab: false });
        }
      })
    }
  }
  const stack = (
    <>
      <div className="add_drg">
        <span><img src={dragicon} /></span>
        <p>
          <strong>Drag CSV here</strong>
          or click to browse (25 MB Max)
        </p>
      </div>
    </>
  );
  const downloadCSVTempEmp = () => {
    showLoader()
    setTimeout(() => {
      hideLoader()
      saveAs(EMPLOYEE_CSV_TEMP + "employee.csv", "employee.csv")
      userEvent("Download csv temp file")
    }, 500);
  }
  const nextBtnUpFile = () => {
    showLoader()
    setRepairTabChange({ ...repairtabChange, showTab: true });
    getTempEmployeeFun(false)
    setTimeout(() => {
      hideLoader()
      $("#repir_t-tab").click();
      $("input[name=file]").val('');
    }, 1000);
  }
  const proceedBtn = () => {
    var data = {
      "user_id": getUserData().response.userId,
      "orgn_id": getUserData().response.orgn_id,
      "batch_id": batchId
    }
    showLoader()
    saveTempEmployee(data).then(result => {
      hideLoader()
      if (result.data.success) {
        userEvent(orgType + "bulk import")
        setUploadFileChange({ ...uploadFileChange, showTab: false });
        setRepairTabChange({ ...repairtabChange, showTab: false });
        setPrivacyTabChange({ ...privacytabChange, showTab: !privacytabChange.showTab });
        setTimeout(() => {
          $("#privcyimpo_t-tab").click();
        }, 1000);
      }
    })
  }
  const previousDiv = () => {
    showLoader()
    setTimeout(() => {
      hideLoader()
      $("#uplodfile_t-tab").click();
    }, 1000);
  }
  const goDash = () => {
    showLoader()
    setUploadFileChange({ ...uploadFileChange, showTab: true });
    setRepairTabChange({ ...repairtabChange, showTab: false });
    setPrivacyTabChange({ ...privacytabChange, showTab: false });
    setNextBtn({ ...nextBtn, showTab: false });
    setUploadError(false)
    setTempEmpList([])
    setTimeout(() => {
      hideLoader()
      $("#closeBtn").get(0).click()
      $("#uplodfile_t-tab").click();
      setBatchId("")
      fetchEmployeeFun(reqData)
    }, 1000);
  }
  const editEmail = (value, index) => {
    var tempArr = []
    for (let i = 0; i < tempEmpList.length; i++) {
      var e_value
      if (index == i) {
        e_value = value
      } else {
        e_value = tempEmpList[i].email_id
      }
      var data = {
        batch_id: tempEmpList[i].batch_id,
        email_id: e_value,
        error: tempEmpList[i].error,
        first_name: tempEmpList[i].first_name,
        last_name: tempEmpList[i].last_name,
        msg: tempEmpList[i].msg,
        temp_emp_id: tempEmpList[i].temp_emp_id
      }
      tempArr.push(data)
    }
    setTempEmpList(tempArr)
  }
  const editFirstName = (value, index) => {
    var tempArr = []
    for (let i = 0; i < tempEmpList.length; i++) {
      var e_value
      if (index == i) {
        e_value = value
      } else {
        e_value = tempEmpList[i].first_name
      }
      var data = {
        batch_id: tempEmpList[i].batch_id,
        email_id: tempEmpList[i].email_id,
        error: tempEmpList[i].error,
        first_name: e_value,
        last_name: tempEmpList[i].last_name,
        msg: tempEmpList[i].msg,
        temp_emp_id: tempEmpList[i].temp_emp_id
      }
      tempArr.push(data)
    }
    setTempEmpList(tempArr)
  }
  const editLastName = (value, index) => {
    var tempArr = []
    for (let i = 0; i < tempEmpList.length; i++) {
      var e_value
      if (index == i) {
        e_value = value
      } else {
        e_value = tempEmpList[i].last_name
      }
      var data = {
        batch_id: tempEmpList[i].batch_id,
        email_id: tempEmpList[i].email_id,
        error: tempEmpList[i].error,
        first_name: tempEmpList[i].first_name,
        last_name: e_value,
        msg: tempEmpList[i].msg,
        temp_emp_id: tempEmpList[i].temp_emp_id
      }
      tempArr.push(data)
    }
    setTempEmpList(tempArr)
  }
  const editEmailSave = (value, index, item) => {
    var temp = [...tempEmpList]
    $("#inputId" + index).removeClass("error-fil")
    var err = 0
    if (value == '') {
      $("#inputId" + index).addClass("error-fil")
      temp[index].msg = "Enter the email id"
      err++
    } else {
      if (!value.match(mailformat)) {
        $("#inputId" + index).addClass("error-fil")
        temp[index].msg = "Enter the valid email id"
        err++
      }
    }
    var val = {
      "first_name": item.first_name,
      "last_name": item.last_name,
      "email_id": value,
      "temp_emp_id": item.temp_emp_id,
      "batch_id": item.batch_id
    }
    if (err == 0) {
      showLoader()
      editTempEmployee(val).then(result => {
        hideLoader()
        if (result.data.success) {
          $("#inputId" + index).removeClass("error-fil")
          temp[index].error = result.data.response.error
          temp[index].msg = result.data.response.msg
          setTempEmpList(temp)
          errorFun()
        } else {
          NotificationManager.error(result.data.message);
        }
      })
    }

  }
  const editFirstNameSave = (value, index, item) => {
    var temp = [...tempEmpList]
    $("#inputIdFirstName" + index).removeClass("error-fil")
    var err = 0
    if (value == '') {
      $("#inputIdFirstName" + index).addClass("error-fil")
      temp[index].msg = "Enter the first name"
      err++
    }
    var val = {
      "first_name": value,
      "last_name": item.last_name,
      "email_id": item.email_id,
      "temp_emp_id": item.temp_emp_id,
      "batch_id": item.batch_id
    }
    if (err == 0) {
      showLoader()
      editTempEmployee(val).then(result => {
        hideLoader()
        if (result.data.success) {
          $("#inputIdFirstName" + index).removeClass("error-fil")
          temp[index].error = result.data.response.error
          temp[index].msg = result.data.response.msg
          setTempEmpList(temp)
          errorFun()
        } else {
          NotificationManager.error(result.data.message);
        }
      })
    }
  }
  const editLastNameSave = (value, index, item) => {
    var temp = [...tempEmpList]
    $("#inputIdLastName" + index).removeClass("error-fil")
    var err = 0
    if (value == '') {
      $("#inputId" + index).addClass("error-fil")
      temp[index].msg = "Enter the last name"
      err++
    }
    var val = {
      "first_name": item.first_name,
      "last_name": value,
      "email_id": item.email_id,
      "temp_emp_id": item.temp_emp_id,
      "batch_id": item.batch_id
    }
    if (err == 0) {
      showLoader()
      editTempEmployee(val).then(result => {
        hideLoader()
        if (result.data.success) {
          $("#inputId" + index).removeClass("error-fil")
          temp[index].error = result.data.response.error
          temp[index].msg = result.data.response.msg
          setTempEmpList(temp)
          errorFun()
        } else {
          NotificationManager.error(result.data.message);
        }
      })
    }
  }
  const errorFun = () => {
    var errCount = 0
    for (let val of tempEmpList) {
      if (val.error != 0) {
        errCount++
      }
    }
    if (errCount == 0) {
      setSuccessDiv(true)
      setErrorDiv(false)
    } else {
      setErrorDiv(true)
      setSuccessDiv(false)
    }
    setErrorCount(errCount)
  }
  const getTempEmployeeFun = (type) => {
    var data = {}
    if (type) {
      data = {
        "batch_id": batchId + "",
        "orgn_id": getUserData().response.orgn_id,
        "limit": limit,
        "offset": offset,
        "search": "",
        "error": "1"
      }
    } else {
      data = {
        "batch_id": batchId + "",
        "orgn_id": getUserData().response.orgn_id,
        "limit": limit,
        "offset": offset,
        "search": "",
        "error": ""
      }
    }
    showLoader()
    getTempEmployee(data).then(result => {
      hideLoader()
      if (result.data.success) {
        var err = 0
        for (let val of result.data.response.employee) {
          if (val.error != 0) {
            err++
          }
        }
        if (err == 0) {
          setSuccessDiv(true)
          setErrorDiv(false)
        } else {
          setErrorDiv(true)
          setSuccessDiv(false)
        }
        setErrorCount(err)
        setTempEmpList(result.data.response.employee)
        let totalPage = Math.ceil(result.data.response.count / limit);
        setTotalPage(totalPage);
      }
    })
  }
  function pageLimitChange(e) {
    setLimit(e.target.value);
  }
  const handleChangePage = (e, val) => {
    let offeset = (val - 1) * limit;
    setOffset(offeset);
  };
  function pageLimitChangeEmp(e) {
    setLimitEmpList(e.target.value);
  }
  const handleChangePageEmp = (e, val) => {
    let offeset = (val - 1) * limitEmpList;
    setOffsetEmpList(offeset);
    setTimeout(() => {
      setDeleteDiv(false)
      setSelectDeleteDiv(false)
    }, 100);
  };
  const deleteAllEmp = () => {
    var data = {
      "empIdList": deleteBulkId,
      "orgn_id": getUserData().response.orgn_id
    }
    showLoader()
    deleteAllEmployee(data).then(result => {
      if (result.data.success) {
        hideLoader()
        NotificationManager.success(result.data.message);
        userEvent("Delete Employees")
        fetchEmployeeFun(reqData);
        setDeleteDiv(false)
        setSelectDeleteDiv(false)
      } else {
        NotificationManager.error(result.data.message);
      }
    })

  }
  const closeBtn = () => {
    showLoader()
    setUploadFileChange({ ...uploadFileChange, showTab: true });
    setRepairTabChange({ ...repairtabChange, showTab: false });
    setPrivacyTabChange({ ...privacytabChange, showTab: false });
    setNextBtn({ ...nextBtn, showTab: false });
    setUploadError(false)
    setTempEmpList([])
    setTimeout(() => {
      hideLoader()
      $("#uplodfile_t-tab").click();
      setBatchId("")
      fetchEmployeeFun(reqData)
    }, 1000);
  }
  const bulkInportFun = () => {
    showLoader()
    setTimeout(() => {
      hideLoader()
    }, 1000);
  }

  return (
    <>
      <div className="main">
        <main className="content">
          <div className="container-fluid p-0 position-relative">
            {/* BULK INPORT */}
            <div className="bulk_upl_po collapse" id="myCollapse">
              <a
                id="closeBtn"
                href="#myCollapse"
                data-bs-toggle="collapse"
                className="close_btn_addemp"
                onClick={closeBtn}
              >
                <img src={closeicon} />
              </a>
              <div className="bulk_upl_po_bd">
                <h3>Bulk Import</h3>
                <div className="addcompny_tab addemploy_tab">
                  {/* TAB LIST */}
                  <ul className="nav nav-tabs" id="myTab" role="tablist">

                    {/* Upload File */}
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="uplodfile_t-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#uplodfile_t"
                        type="button"
                        role="tab"
                        aria-controls="uplodfile_t"
                        aria-selected="true"
                        disabled={!uploadFileChange.showTab}
                      >
                        Upload File
                      </button>
                    </li>

                    {/* Repair */}
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="repir_t-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#repir_t"
                        type="button"
                        role="tab"
                        aria-controls="repir_t"
                        aria-selected="false"
                        disabled={!repairtabChange.showTab}
                      >
                        Repair
                      </button>
                    </li>

                    {/* Import */}
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="privcyimpo_t-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#privcyimpo_t"
                        type="button"
                        role="tab"
                        aria-controls="privcyimpo_t"
                        aria-selected="false"
                        disabled={!privacytabChange.showTab}
                      >
                        Import
                      </button>
                    </li>

                  </ul>
                </div>
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <div className="mb-4 add_employ_page">
                      <div className="tab-content" id="myTabContent">
                        {/* UPLOAD FILE TAB */}
                        <div className="tab-pane fade show active" id="uplodfile_t" role="tabpanel"
                          aria-labelledby="uplodfile_t-tab">
                          <p className="add_emp_step_sec">Step <span>1</span> of 3</p>
                          <div className="ad_emp_drag">
                            <p>Upload a CSV file to import {orgType} data to your system.</p>
                            <FileUploader
                              handleChange={handleChangeFile}
                              name="file"
                              types={fileType}
                              children={stack}
                            />
                          </div>
                          {
                            uploadError ?
                              <>
                                <div className="poog_sts">
                                  <div className="employee_progs">
                                    <div className="employee_file_icn"  ><i className="bi bi-file-text"></i>
                                    </div>
                                    <div className="employee_progs_div">
                                      <p>{upFileName}</p>
                                      <div className="progress">
                                        <div className="progress-bar" id="progress_bar_csv">
                                          <div className="progress-value" id="progress_percentage_csv">0%</div>
                                        </div>
                                      </div>
                                    </div>
                                    <button onClick={() => { crossTab() }}><i className="bi bi-x"></i></button>
                                  </div>
                                </div>
                              </>
                              :
                              null
                          }
                          {
                            csvFormatError ?
                              <>
                                <div className="poog_sts eror_ocr">
                                  <div className="employee_progs">
                                    <div className="employee_file_icn"><i className="bi bi-file-text"></i>
                                    </div>
                                    <div className="employee_progs_div">
                                      <p>{upFileName}</p>
                                      <div className="progress">
                                        <div className="progress-bar"
                                          style={{ width: '0%', background: '#4286f4' }}>
                                          <div className="progress-value">100%</div>
                                        </div>
                                      </div>
                                    </div>
                                    <button onClick={() => { crossTab() }} ><i className="bi bi-x"></i></button>
                                  </div>
                                  <p><strong>
                                    <i className="bi bi-exclamation-triangle"></i> {csvFormatErrorMsg}</strong></p>
                                </div>
                              </>
                              :
                              null
                          }
                          {
                            csvSizeError ?
                              <>
                                <div className="poog_sts eror_ocr">
                                  <div className="employee_progs">
                                    <div className="employee_file_icn"><i className="bi bi-file-text"></i>
                                    </div>
                                    <div className="employee_progs_div">
                                      <p>{upFileName}</p>
                                      <div className="progress">
                                        <div className="progress-bar"
                                          style={{ width: '0%', background: '#4286f4' }}>
                                          <div className="progress-value">100%</div>
                                        </div>
                                      </div>
                                    </div>
                                    <button onClick={() => { crossTab() }} ><i className="bi bi-x"></i></button>
                                  </div>
                                  <p><strong>
                                    <i className="bi bi-exclamation-triangle"></i> File size exceeds 25 MB</strong></p>
                                </div>
                              </>
                              :
                              null
                          }
                          <div className="down_load_note">
                            <ul>
                              <li>1. Download sample CSV template to see an example of format
                                required</li>
                              <li>2. Import file must be in <span>CSV</span> format</li>
                              <li>3. Import files should not exceed 25MB in size</li>
                            </ul>
                          </div>
                          <div className="suprt_btne">
                            <div className='creat_camp_div_top'>
                            <a className="support_btn">
                              <img src={infoicon} />


                              Support

                              <div className="inf_hov_dv">
                                <p>You can add a large number of participants by using our import template. You can review, update & fix mistakes while importing. Files supported are CSV and Excel. </p>
                              </div>

                            </a>
                            </div>
                            <div className="btn_edit">
                              <button className="btn btn-nobg btn-witbord" onClick={goDash}>Discard</button>
                              <button
                                className={`btn btn-primary ${!nextBtn.showTab ? "disable-btn" : ""}`}
                                onClick={nextBtnUpFile}
                                disabled={!nextBtn.showTab || !canEdit}>
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* REPAIR TAB */}
                        <div className="tab-pane fade" id="repir_t" role="tabpanel"
                          aria-labelledby="repir_t-tab">
                          <p className="add_emp_step_sec">Step <span>2</span> of 3</p>
                          <div className="check_colm_vla">
                            <strong>Check column Values</strong>
                            <p>Our system checks for the values of each row if any issues found you can easily edit by clicking on the cell</p>
                          </div>
                          {
                            errorDiv ?
                              <>
                                <div className="box_wit_not alart-box">
                                  <i className="bi bi-exclamation-triangle text-danger"></i>
                                  <p>{errorCount} rows contain errors.</p>
                                  <button><i className="bi bi-x"></i></button>
                                </div>
                              </>
                              :
                              null
                          }
                          {
                            successDiv ?
                              <>
                                <div className="box_wit_not succes-box">
                                  <i className="bi bi-check-circle-fill"></i>
                                  <p>All good! You are ready to import</p>
                                  <button><i className="bi bi-x"></i></button>
                                </div>
                              </>
                              :
                              null
                          }
                          <div className="vw_swo">
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
                              <span>per page</span>
                            </div>
                            <div className="appr_dive">
                              <label className="switch">
                                <input type="checkbox" onChange={(e) => { getTempEmployeeFun(e.target.checked) }} />
                                <small></small>
                              </label>
                              <strong>Show only rows with errors</strong>
                            </div>
                          </div>
                          <div className="list_of_tabl">
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr role="row">
                                    <th align="left">&nbsp;</th>
                                    <th align="left">S.No</th>
                                    <th align="left">First Name</th>
                                    <th align="left">Last Name</th>
                                    <th align="left">Email ID</th>
                                  </tr>
                                </thead>
                                <tbody >
                                  {tempEmpList.length > 0 ?
                                    <>
                                      {
                                        tempEmpList.map((item, index) => (
                                          <tr key={index} role="row">
                                            <td align="center">

                                              {item.error == 1 || item.error == 2 || item.error == 3 || item.error == 4 || item.error == 5 || item.error == 6 || item.error == 7 ?
                                                <i className="bi bi-exclamation-triangle text-danger"></i>
                                                :
                                                <i className="bi bi-check-circle-fill"></i>}

                                            </td>
                                            <td align="left">{index + 1}</td>
                                            {
                                              item.error == 1 || item.error == 2 || item.error == 3 || item.error == 6 ?
                                                <>
                                                  <td align="left" className="nrml_td alrt_td">
                                                    <div className="alart_td_div">
                                                      <input
                                                        id={"inputIdFirstName" + index}
                                                        type="text"
                                                        className='form-control me-2'
                                                        value={item.first_name}
                                                        onChange={(e) => { editFirstName(e.target.value, index) }}
                                                        onBlur={(e) => { editFirstNameSave(e.target.value, index, item) }}
                                                      />
                                                      <a className="link" draggable="false"
                                                        data-tooltip={item.msg}>
                                                        <img src={iicon} /></a>
                                                    </div>
                                                  </td>
                                                </>
                                                :
                                                <><td align="left">{item.first_name}</td></>
                                            }
                                            {
                                              item.error == 1 || item.error == 2 || item.error == 4 || item.error == 5 ?
                                                <>
                                                  <td align="left" className="nrml_td alrt_td">
                                                    <div className="alart_td_div">
                                                      <input
                                                        id={"inputIdLastName" + index}
                                                        type="text"
                                                        className='form-control me-2'
                                                        value={item.last_name}
                                                        onChange={(e) => { editLastName(e.target.value, index) }}
                                                        onBlur={(e) => { editLastNameSave(e.target.value, index, item) }}
                                                      />
                                                      <a className="link" draggable="false"
                                                        data-tooltip={item.msg}>
                                                        <img src={iicon} /></a>
                                                    </div>
                                                  </td>
                                                </>
                                                :
                                                <><td align="left">{item.last_name}</td></>
                                            }
                                            {
                                              item.error == 1 || item.error == 3 || item.error == 4 || item.error == 7 ?
                                                <>
                                                  <td align="left" className="nrml_td alrt_td">
                                                    <div className="alart_td_div">
                                                      <input
                                                        id={"inputId" + index}
                                                        type="text"
                                                        className='form-control me-2'
                                                        value={item.email_id}
                                                        onChange={(e) => { editEmail(e.target.value, index) }}
                                                        onBlur={(e) => { editEmailSave(e.target.value, index, item) }}
                                                      />
                                                      <a className="link" draggable="false"
                                                        data-tooltip={item.msg}>
                                                        <img src={iicon} /></a>
                                                    </div>
                                                  </td>
                                                </>
                                                :
                                                <>
                                                  <td align="left">{item.email_id}</td>
                                                </>
                                            }
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
                                            <p>Start a new {orgType} now</p>
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
                            <span className="support_btn"><img src={infoicon} />
                              Support</span>
                            <div className="btn_edit">
                              <button className="btn btn-nobg btn-witbord" onClick={previousDiv}>Previous</button>
                              <button className="btn btn-primary" onClick={proceedBtn} disabled={!canEdit} >Proceed anyway</button>
                            </div>
                          </div>
                          <div className="bulk_pagi paginati">
                            <Stack spacing={2}>
                              <Pagination count={totalPage} shape="rounded" onChange={(e, value) => handleChangePage(e, value)} />
                            </Stack>
                          </div>
                        </div>

                        {/* PRIVACY IMPORT */}
                        <div className="tab-pane fade" id="privcyimpo_t" role="tabpanel"
                          aria-labelledby="privcyimpo_t-tab">
                          <p className="add_emp_step_sec">Step <span>3</span> of 3</p>

                          <div className="sucs_dive">
                            <span><i
                              className="bi bi-check-circle-fill"></i></span><strong>Success!</strong>
                            <p>Your file has been successfully imported</p>
                            <button className="btn btn-primary" onClick={goDash}>Go to Dashboard</button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* EMPLOYEE  */}
            <div className="addemplo collapse show" id="myCollapse">
              <div className="row mb-2 mb-lg-0">
                <div className="col-md-12 d-lg-flex align-items-center main-hdng">
                  <div className="col-md-6">
                    <h3 className="compny-dashbrd">{orgTypes}</h3>
                  </div>
                </div>
              </div>
              <div className="row mt-0 mb-4">
                <div className="col-md-12 col-sm-12 down_rit">
                  <button disabled={!canEdit} onClick={downloadCSVTempEmp} className="btn btn-nobg only_txt">
                    <i className="bi bi-arrow-down-short"></i>
                    Download CSV template
                  </button>
                </div>
                <div className="col-md-12 d-lg-flex align-items-center hdng-btm">
                  <div className="d-inline-block src_dv">
                    <label>Search</label>
                    <input
                      className="form-control"
                      type="text"
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
                      <select id="selectinput1" className="form-select" onChange={(e) => { setSort(e.target.value) }}>
                        <option value="all">All</option>
                        <option value="alphabet">Alphabet</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-inline-block dwnld_btn">
                    <label>&nbsp;</label>
                    <button disabled={!canEdit} className="down_btn dropdown-toggle no-dropdown-arrow" href="#"
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
                            id="exampleRadios2"
                            value="csv"
                            defaultChecked
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
                            value="xlx"
                            onChange={(e) => { setReport(e.target.value) }}
                          />
                          <label className="form-check-label" htmlFor="exampleRadios3">
                            <img src={downloadicon3} />
                            Excel
                          </label>
                        </div>
                        <button
                          className="btn btn down_btn"
                          onClick={reportDownloadFun}
                          disabled={employeeList.length <= 0 || !canEdit}
                        >
                          Download
                        </button>

                      </div>
                    </div>
                  </div>
                  <div className="d-inline-block add_btn">
                    <label>&nbsp;</label>
                    <button
                      onClick={handleShow}
                      className="btn down_btn"
                      data-bs-toggle="modal"
                      data-bs-target="#addemployee-pop"
                      disabled={!canEdit}
                    >
                      <i className="bi bi-plus"></i>
                      Add {orgType}
                    </button>
                  </div>
                  <div className="d-inline-block add_btn addbulk">
                    <label>&nbsp;</label>
                    <button
                      disabled={!canEdit}
                      className="btn down_btn"
                      data-bs-toggle="collapse"
                      data-bs-target="#myCollapse"
                      onClick={bulkInportFun}
                    >
                      <img src={folderarrowup} />
                      Bulk Import
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
                            <th align="center" style={{ textAlign: "center" }}>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                name="allSelect"
                                checked={employeeList.length > 0 ? !employeeList.some((user) => user?.isChecked !== true) : false}
                                onChange={handleChange}
                                disabled={employeeList.length == 0}
                              />
                            </th>
                            <th align="left">First Name</th>
                            <th align="left">Last Name</th>
                            <th align="left">Email ID</th>
                            <th align="center" style={{ textAlign: "center" }}>Status</th>
                            <th align="center" style={{ textAlign: "center" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody >
                          {employeeList.length > 0 ?
                            <>
                              {
                                employeeList.map((item, index) => (

                                  <tr role="row" key={index}>
                                    <td align="center">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name={item.first_name + index}
                                        checked={item?.isChecked || false}
                                        onChange={handleChange}
                                      />
                                    </td>
                                    <td align="left">{item.first_name}</td>
                                    <td align="left">{item.last_name}</td>
                                    <td align="left">{item.empemail}</td>
                                    <td align="center">
                                      <div className="appr_dive">
                                        <label className="switch">
                                          <input
                                            type="checkbox"
                                            value={item.emp_id}
                                            checked={item.empdeactivation == 0}
                                            onClick={(e) => { toggleCheckbox(e) }}
                                            disabled={!canEdit}
                                          />
                                          <small></small>
                                        </label>
                                      </div>
                                    </td>
                                    <td align="center">
                                      <button disabled={!canEdit} onClick={() => { handleShowEditModal(item) }} className="d-inline"><svg xmlns="http://www.w3.org/2000/svg"
                                        width="16" height="16" fill="currentColor"
                                        className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                        <path
                                          d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                      </svg>
                                      </button>
                                      <button disabled={!canEdit} onClick={() => { handleShowDeleteModal(item) }} className="d-inline ms-3"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="16"
                                        height="16" fill="currentColor" className="bi bi-trash-fill"
                                        viewBox="0 0 16 16">
                                        <path
                                          d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                      </svg>
                                      </button>
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
                                    <p>Start a new {orgType} now</p>
                                  </div>
                                </td>
                              </tr>
                            </>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="btn_edit emply_btn mt-5 mb-4">
                    {
                      deleteDiv ? <button className="btn btn-primary" disabled={!canEdit} onClick={deleteAllEmp}>Delete all</button> : null
                    }
                    {
                      deleteDiv ? <button className="btn btn-nobg btn-witbord" disabled={!canEdit} onClick={cancelSelect}>Cancel</button> : null
                    }

                    {
                      selectDeleteDiv ? <button className="btn btn-primary" disabled={!canEdit} onClick={deleteAllEmp}>Delete Selected ({selectDeleteCount})</button> : null
                    }
                    {
                      selectDeleteDiv ? <button className="btn btn-nobg btn-witbord" disabled={!canEdit} onClick={cancelSelect}>Cancel</button> : null
                    }
                  </div>
                  <div className="paginati">
                    <div className="paginati_l">
                      <div className="dataTables_length d-flex align-items-center"
                        id="datatables-reponsive_length">
                        <label>View </label>
                        <select name="datatables-reponsive_length"
                          aria-controls="datatables-reponsive"
                          className="form-select form-select-sm" value={limitEmpList} onChange={(e) => pageLimitChangeEmp(e)}>
                          {limitArr.map((item, i) =>
                            <option value={item.value} key={i}>{item.label}</option>
                          )}
                        </select>
                        <span> {orgType} <strong>per page</strong></span>
                        <span style={{ paddingLeft: "20px" }}> Total {orgType} <strong>{totalCount}</strong></span>
                      </div>
                    </div>
                    <div className="paginati_r">
                      <Stack spacing={2}>
                        <Pagination count={totalPageEmpList} shape="rounded" onChange={(e, value) => handleChangePageEmp(e, value)} />
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
        <div className="addrole" id="addemployee-pop" tabIndex="-1">

          <div className="modal-header">
            <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="mod_body">
              <h5 className="modal-title text-center">Add {orgType}</h5>
              <div className="frm_modl">

                <div className={`add_fild_com ${firstNameError || firstNameValidate ? "error-fil" : ""}`}>
                  <label htmlFor="txtPassword">First name </label>
                  <input
                    type="text"
                    id="firsrname"
                    className="form-control mb-0"
                    name="firsrname"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value) }}
                    required
                  />
                  {
                    firstNameError ?
                      <span className='errorfiled'>Enter the first name</span>
                      : null
                  }
                  {
                    firstNameValidate ?
                      <span className='errorfiled'>Enter the valid first name</span>
                      : null
                  }
                </div>
                <div className={`add_fild_com ${lastNameError || lastNameValidate ? "error-fil" : ""}`}>
                  <label htmlFor="txtPassword">Last Name </label>
                  <input
                    type="text"
                    id="lastname"
                    className="form-control mb-0"
                    name="lastname"
                    placeholder="Enter your Last Name"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value) }}
                    required
                  />
                  {
                    lastNameError ?
                      <span className='errorfiled'>Enter the last name</span>
                      : null
                  }
                  {
                    lastNameValidate ?
                      <span className='errorfiled'>Enter the valid last name</span>
                      : null
                  }
                </div>
                <div className={`add_fild_com ${emailIdError || validEmailIdError || existEmailIdError ? "error-fil" : ""}`}>
                  <label htmlFor="txtPassword">Email ID </label>
                  <input
                    type="text"
                    id="emailid"
                    className="form-control mb-0"
                    name="emailid"
                    placeholder="Enter the email ID"
                    value={emailId}
                    onChange={(e) => { setEmailId(e.target.value) }}
                    required
                    onKeyDown={(e) => {
                      if (inputInvalidChars.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {
                    emailIdError ?
                      <span className='errorfiled'>Enter the email id</span>
                      : null
                  }
                  {
                    validEmailIdError ?
                      <span className='errorfiled'>Enter the valid email id</span>
                      : null
                  }
                  {
                    existEmailIdError ?
                      <span className='errorfiled'>{errorMsg}</span>
                      : null
                  }
                </div>


                <div className="add_btn">
                  <button type="button" className="btn btn-primary w-100 mt-5 ms-0" disabled={!canEdit} onClick={addEmployeeFun}>Add</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Modal>
      <Modal show={successModal} onHide={handleCloseSuccessModal}>
        <div class="addrole" id="addemployee-success-pop" tabIndex="-1">

          <div class="modal-header">
            <button onClick={handleCloseSuccessModal} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mod_body">

              <div class="sucs_dive">
                <span><i class="bi bi-check-circle-fill"></i></span><strong>Success!</strong>
                <p>{orgType} has been successfully added</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal show={editModal} onHide={handleCloseEditModal}>
        <div className="addrole" id="addemployee-pop" tabIndex="-1">

          <div className="modal-header">
            <button onClick={handleCloseEditModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="mod_body">
              <h5 className="modal-title text-center">Edit {orgType}</h5>
              <div className="frm_modl">

                <div className={`add_fild_com ${firstNameEditError || firstNameEditValidate ? "error-fil" : ""}`}>
                  <label htmlFor="txtPassword">First name </label>
                  <input
                    type="text"
                    id="firsrname"
                    className="form-control mb-0"
                    name="firsrname"
                    placeholder="Enter your first name"
                    value={firstNameEdit}
                    onChange={(e) => { setFirstNameEdit(e.target.value) }}
                    required
                    onKeyDown={(e) => {
                      if (inputInvalidChars.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {
                    firstNameEditError ?
                      <span className='errorfiled'>Enter the first name</span>
                      : null
                  }
                  {
                    firstNameEditValidate ?
                      <span className='errorfiled'>Enter the first valid name</span>
                      : null
                  }
                </div>
                <div className={`add_fild_com ${lastNameEditError ? "error-fil" : ""}`}>
                  <label htmlFor="txtPassword">Last Name </label>
                  <input
                    type="text"
                    id="lastname"
                    className="form-control mb-0"
                    name="lastname"
                    placeholder="Enter your last name"
                    value={lastNameEdit}
                    onChange={(e) => { setLastNameEdit(e.target.value) }}
                    required
                    onKeyDown={(e) => {
                      if (inputInvalidChars.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {
                    lastNameEditError ?
                      <span className='errorfiled'>Enter the last name</span>
                      : null
                  }
                  {
                    lastNameEditValidate ?
                      <span className='errorfiled'>Enter the last valid name</span>
                      : null
                  }
                </div>
                <div className={`add_fild_com`}>
                  <label htmlFor="txtPassword">Email ID </label>
                  <input
                    type="text"
                    id="emailid"
                    className="form-control mb-0"
                    name="emailid"
                    placeholder="Enter your email ID"
                    value={emailIdEdit}
                    onChange={(e) => { setEmailIdEdit(e.target.value) }}
                    required
                    disabled
                  />
                </div>


                <div className="add_btn">
                  <button type="button" className="btn btn-primary w-100 mt-5 ms-0" disabled={!canEdit} onClick={editEmployeeFun}>Edit</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Modal>
      <Modal show={deleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete {orgType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ paddingLeft: "16px" }}>Are you want to delete this {orgType}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" disabled={!canEdit} onClick={handleCloseDeleteModal}>
            No
          </Button>
          <Button variant="primary" disabled={!canEdit} onClick={delEmployee}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Employee