///-----------Import Files-----------///
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import $ from 'jquery'
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import LoggedLayout from './LoggedLayout';
import { addRoleName, getOrgRoles, getHygMenu, getOrgRoleMenu, updateRoles, checkUser, addOrgUser, getOrgUser, deactiveOrgUser, activeRoles, editOrgUser, deleteOrgRole, deleteOrgUser, userEvent } from '../../../service/Services';
import { getUserData, getUserRole, showLoader, hideLoader } from '../../../service/Common';
import { getDownloadOrgUserDownload } from '../../../service/ReportServices';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { LIMIT_ARRAY } from '../../../constant/constantValue';
import { IMAGE_URL } from '../../../config/app_url';
import { saveAs } from 'file-saver'
import '../../../devCss/devCss.css'
///--------------Import Images-------------///
const downloadicon = require('../../../assets/images/download-icon.png');
const downloadicon1 = require('../../../assets/images/download-icon1.png');
const downloadicon2 = require('../../../assets/images/download-icon2.png');
const downloadicon3 = require('../../../assets/images/download-icon3.png');
const campemty = require('../../../assets/images/camp-emty.png');
//-----------Stateless Functional Component named RoleAndAccess--------//
function RoleAndAccess() {
    /* Variables */
    const [show, setShow] = useState(false);
    const [adminShow, setAdminShow] = useState(false);
    const [roleShow, setRoleShow] = useState(false);
    const [roleAdminShow, setRoleAdminShow] = useState(false);
    const [roleDes, setRoleDes] = useState("");
    const [roleDesFirst, setroleDesFirst] = useState(false);
    const [roleDesError, setRoleDesError] = useState(false);
    const [roleList, setRoleList] = useState([]);
    const [roleModuleList, setRoleModuleList] = useState([]);
    const [roleName, setRoleName] = useState("");
    const [isViewDiv, setIsViewDiv] = useState(false);
    const [moduleRole, setModuleRole] = useState([]);
    const [moduleRoleArr, setModuleRoleArr] = useState([]);
    const [modules, setModulesArr] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [role, setRole] = useState("");
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [contactError, setContactError] = useState(false);
    const [roleError, setRoleError] = useState(false);
    const [validEmailError, setValidEmailError] = React.useState(false)
    const [existEmailIdError, setExistEmailError] = useState(false);
    const [validContactError, setValidContactError] = React.useState(false)
    const [adminList, setAdminList] = useState([]);
    const [canEdit, setCanEdit] = useState(false);
    const [editIndex, setEditIndex] = useState("");
    const [canEditRole, setCanEditRole] = useState("");
    const [roleNameDes, setRoleNameDes] = useState("");
    const [roleId, setRoleId] = useState("");
    const [userId, setUserId] = useState("");
    const [search, setSearch] = React.useState("");
    const [searchRole, setSearchRole] = React.useState("");
    const [searchRoleAdmin, setSearchRoleAdmin] = React.useState("");
    const [limit, setLimit] = useState("10");
    const [offset, setOffset] = useState("0");
    const [totalPage, setTotalPage] = useState(0);
    const [totalRecors, setTotalRecords] = useState(0)
    const [limitArr, setLimitArr] = useState([]);
    const [canEditUser, SetCanEditUser] = React.useState(false)
    const [isHover, setIsHover] = React.useState(false)
    const [counrtyCode, setCounrtyCode] = React.useState("+91")
    const [counrtyCodeError, setCounrtyCodeError] = useState("");
    const [nameEditError, setNameEditError] = React.useState(false)
    const inputInvalidChars = [' '];
    const [report, setReport] = React.useState("csv")
    //Mail Format Regex//
    var mailformat = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$";
    //Contact No. Regex//
    var z1 = /^[0-9]*\d$/
    const [totalCount, setTotalCount] = useState(0);
    const [adminRole, setAdminRole] = useState([])
    const numberInputInvalidChars = ['-', '+', 'e', '.', ' '];

    /* Functions */
    //------------------UseEffect-----------------//
    useEffect(() => {
        var role = getUserRole("Roles and Access")
        if (role) {
            if (role.can_edit == 1) {
                SetCanEditUser(true)
            }
        }
        getOrgRoleFun()
        getOrgUserFun()
        if (getUserData().response.parent_orgn_id == "0") {
            getHygMenuFun(1)
        } else {
            if (getUserData().response.is_child == "0") {
                getHygMenuFun(2)
            } else {
                getHygMenuFun(3)
            }
        }
    }, [])
    useEffect(() => {
        if (roleList.length > 0) {
            getOrgInfoFundiv(roleList[0].role_id, roleList[0].role_desc, 0)
        }
    }, [roleDesFirst])
    useEffect(() => {
        getOrgUserFun();
        setLimitArr(LIMIT_ARRAY)
    }, [limit, offset])
    //-------------- callback functions -------------//
    const handleClose = () => {
        setShow(false)
        setRoleDes("")
        setRoleDesError(false)
    };
    const handleShow = () => {
        setShow(true)
    };
    const handleAdminClose = () => {
        setAdminShow(false)
        setNameError(false)
        setEmailError(false)
        setContactError(false)
        setRoleError(false)
        setValidEmailError(false)
        setExistEmailError(false)
        setValidContactError(false)
        setName("")
        setEmail("")
        setContact("")
        setRole("")
    };
    const handleAdminShow = () => {
        setAdminShow(true)
    };
    const handleRoleClose = () => {
        setRoleShow(false)
    };
    const handleRoleShow = () => {
        setRoleShow(true)
    };
    const handleRoleAdminClose = () => {
        setRoleAdminShow(false)
    };
    const handleRoleAdminShow = () => {
        setRoleAdminShow(true)
    };
    function getOrgRoleFun() {
        var data = {
            "orgn_id": getUserData().response.orgn_id,
            "search": search
        }
        showLoader()
        getOrgRoles(data).then(result => {
            hideLoader()
            if (result.data.success) {
                setRoleList(result.data.response)

                var tempArr = []

                for (var data of result.data.response) {
                    if (data.active == 1) {
                        tempArr.push(data)
                    }
                }

                setAdminRole(tempArr)
                setTimeout(() => {
                    setroleDesFirst(true)
                }, 100);
            }
        })
    }
    function getOrgUserFun() {
        var data = {
            "orgn_id": getUserData().response.orgn_id,
            "search": searchRoleAdmin,
            "offset": offset,
            "limit": limit
        }
        showLoader()
        getOrgUser(data).then(result => {
            hideLoader()
            if (result.data.success) {
                setAdminList(result.data.response.data)
                setTotalCount(result.data.response.totalCount)
                if (result.data.response.totalCount) {
                    let totalPage = Math.ceil(result.data.response.totalCount / limit);
                    setTotalPage(totalPage);
                    setTotalRecords(result.data.response.totalCount);
                }
            }
        })
    }
    const onAddRole = () => {
        setRoleDesError(false)
        var err = 0
        if (roleDes.trim() == "") {
            setRoleDesError(true)
            err++
        }
        var data = {
            "orgn_id": getUserData().response.orgn_id,
            "role_desc": roleDes
        }
        if (err == 0) {
            showLoader()
            addRoleName(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    userEvent("Add role")
                    NotificationManager.success(result.data.message);
                    handleClose()
                    setRoleDes("")
                    setRoleDesError(false)
                    getOrgRoleFun()
                } else {
                    NotificationManager.error(result.data.message);
                }

            })
        }
    }
    function getHygMenuFun(level) {
        var data = {
            "orgn_id": getUserData().response.orgn_id,
            "search": searchRole,
            "type": level
        }
        showLoader()
        getHygMenu(data).then(result => {
            hideLoader()
            if (result.data.success) {
                for (let arr of result.data.response) {
                    arr.can_edit = '0'
                    arr.can_view = '0'
                }
                setRoleModuleList(result.data.response)
            }
        })
    }
    const onCancel = (index) => {
        showLoader()
        setModuleRole([])
        setModuleRoleArr([])
        for (var i = 0; i < roleList.length; i++) {
            if (i == index) {
                $('#canButton' + i).click()
                $('#collapsemanu' + i).removeClass('show')
                $('#access' + i).removeClass('accessHover')
            }
        }
        setTimeout(() => {
            hideLoader()
        }, 1000);
    }
    const getOrgInfoFundiv = (role_id, name, index) => {
        for (var i = 0; i < roleList.length; i++) {
            if (i == index) {
                $('#canButton' + i).click()
                $('#access' + i).addClass('accessHover')
                // $('#collapsemanu' + i).addClass('show')
                // $('#access' + i).addClass('accessHover')
            } else {
                $('#canButton' + i).click()
                // $('#collapsemanu' + i).removeClass('show')
                // $('#access' + i).removeClass('accessHover')
            }
        }
        setIsViewDiv(true)
        setRoleName(name)
        var data = {
            "orgn_id": getUserData().response.orgn_id,
            "role_id": role_id
        }
        getOrgRoleMenu(data).then(result => {
            if (result.data.success) {
                var response = result.data.response
                var mod = modules
                var roleTemp = JSON.stringify(roleModuleList)
                var roleModule = JSON.parse(roleTemp)
                if (response.length > 0) {
                    for (let obj of roleModule) {
                        for (let res of response) {
                            if (res.menu_id == obj.id) {
                                obj.can_view = res.can_view
                                obj.can_edit = res.can_edit
                                mod.push({ menu_id: obj.id, can_view: obj.can_view, can_edit: obj.can_edit })
                            }
                        }
                    }
                    setModulesArr(mod)
                    setModuleRole(roleModule)


                    for (let i = 0; i < roleModule.length; i++) {
                        if (roleModule[i].can_edit == 1) {
                            roleModule[i].disabled = true
                        } else {
                            roleModule[i].disabled = false
                        }
                    }

                    setModuleRoleArr(roleModule)
                } else {
                    setModuleRole(roleModule)
                    setModuleRoleArr(roleModule)
                }
            } else {
                NotificationManager.error(result.data.message);
            }
        })
    }
    const getOrgInfoFun = (role_id, name, index) => {
        setModuleRoleArr([])
        for (var i = 0; i < roleList.length; i++) {
            if (i == index) {
                $('#canButton' + i).click()
                $('#collapsemanu' + i).addClass('show')
                $('#access' + i).addClass('accessHover')
            } else {
                $('#canButton' + i).click()
                $('#collapsemanu' + i).removeClass('show')
                $('#access' + i).removeClass('accessHover')
            }
        }
        
        setIsViewDiv(true)
        setRoleName(name)
        var data = {
            "orgn_id": getUserData().response.orgn_id,
            "role_id": role_id
        }
        getOrgRoleMenu(data).then(result => {
            if (result.data.success) {
                var response = result.data.response
                var mod = modules
                var roleTemp = JSON.stringify(roleModuleList)
                var roleModule = JSON.parse(roleTemp)
                if (response.length > 0) {
                    for (let obj of roleModule) {
                        for (let res of response) {
                            if (res.menu_id == obj.id) {
                                obj.can_view = res.can_view
                                obj.can_edit = res.can_edit
                                mod.push({ menu_id: obj.id, can_view: obj.can_view, can_edit: obj.can_edit })
                            }
                        }
                    }
                    
                    console.log("mod", mod)
                    setModulesArr(mod)
                    console.log("roleModule", roleModule)
                    setModuleRole(roleModule)


                    for (let i = 0; i < roleModule.length; i++) {
                        if (roleModule[i].can_edit == 1) {
                            roleModule[i].disabled = true
                        } else {
                            roleModule[i].disabled = false
                        }
                    }

                    setModuleRoleArr(roleModule)
                } else {
                    
                    setModuleRole(roleModule)
                    setModuleRoleArr(roleModule)
                    console.log(moduleRoleArr)
                }
            } else {
                NotificationManager.error(result.data.message);
            }
        })
    }
    const onCheckboxView = (e, index) => {
        const checkedValue = e.target.id;
        const checkedName = e.target.name;
        var tempobj = {}
        var modulesArr = moduleRoleArr
        const checked = e.target.checked;
        console.log(modulesArr[index])
        modulesArr[index].can_view = checked == true ? '1' : '0';
        setModuleRoleArr(modulesArr)
        console.log(modulesArr)
    }
    const onCheckboxEdit = (e, index) => {
        const checkedValue = e.target.id;
        const checkedName = e.target.name;
        var tempobj = {}
        var modulesArr = moduleRoleArr
        const checked = e.target.checked;
        modulesArr[index].can_edit = checked == true ? '1' : '0'
        console.log(modulesArr[index])
        if (modulesArr[index].can_edit == '1') {
            $('#can_view_checkbox' + index).prop('checked', true);
            $('#can_view_checkbox' + index).attr('disabled', true);
            // modulesArr[index].can_view = '1'
            modulesArr[index].can_view = checked == true ? '1' : '0'
        } else {
            $('#can_view_checkbox' + index).attr('disabled', false);
        }
        // modulesArr[index].can_view = checked == true ? '1' : '0'
        setModuleRoleArr(modulesArr)
        console.log(modulesArr)
    }
    const onSaveFun = (role_id, role_desc, index) => {
        setNameEditError(false)
        var err = 0
        if (roleName.trim() == "") {
            setNameEditError(true)
            err++
        }
        var modules = []
        for (let arr of moduleRole) {
            if (arr.can_view == '0' && arr.can_edit == '0') {
            } else {
                modules.push({
                    "menu_id": arr.id,
                    "can_view": arr.can_view,
                    "can_edit": arr.can_edit
                })
            }
        }
        var data = {
            "orgn_id": getUserData().response.orgn_id,
            "role_desc": roleName.trim(),
            "role_id": role_id,
            "menus": modules
        }
        if (err == 0) {
            showLoader()
            updateRoles(data).then(result => {
                hideLoader()
                if (result.data.success) {
                    userEvent("Add role")
                    getOrgRoleFun()
                    setIsViewDiv(false);
                    $('#collapsemanu' + index).removeClass('show')
                    NotificationManager.success(result.data.message);
                    setModulesArr([])
                    setModuleRole([])
                    setModuleRoleArr([])
                    setNameEditError(false)
                    getOrgInfoFundiv(role_id, role_desc, index)
                } else {
                    NotificationManager.error(result.data.message);
                }
            })
        }
    }
    const onAddUser = () => {
        setNameError(false)
        setEmailError(false)
        setContactError(false)
        setRoleError(false)
        setValidEmailError(false)
        setExistEmailError(false)
        setValidContactError(false)
        var err = 0
        if (name.trim() == "") {
            setNameError(true)
            err++
        }
        if (email.trim() == "") {
            setEmailError(true)
            err++
        } else {
            if (!email.trim().match(mailformat)) {
                setValidEmailError(true)
                err++
            }
        }
        if (contact.trim() == '') {
            setContactError(true)
            err++
        } else {
            if (!z1.test(contact.trim())) {
                setValidContactError(true)
                err++;
            } else if (contact.trim().length < 7) {
                setValidContactError(true)
                err++;
            } else if (contact.trim().length > 15) {
                setValidContactError(true)
                err++;
            } else {
                setValidContactError(false)
            }
        }
        if (role == "") {
            setRoleError(true)
            err++
        }
        if (err == 0) {
            let data = {
                "email_id": email
            }
            checkUser(data).then(result => {
                if (result.data.success) {
                    if (result.data.response.isAvailable === 0) {
                        setExistEmailError(true)
                    } else {
                        var obj = {
                            "user_id": getUserData().response.userId + "",
                            "orgn_id": getUserData().response.orgn_id + "",
                            "useremail": email.trim(),
                            "passwordexpiredate": moment(getUserData().response.passwordexpiredate).format('yyyy-MM-DD'),
                            "full_name": name.trim(),
                            "contact_number": contact.trim(),
                            "country_code": counrtyCode,
                            "role_id": role
                        }
                        showLoader()
                        addOrgUser(obj).then(result => {
                            hideLoader()
                            if (result.data.success) {
                                userEvent("Add admin")
                                getOrgUserFun();
                                NotificationManager.success(result.data.message);
                                setName("")
                                setEmail("")
                                setContact("")
                                setRole("")
                                handleAdminClose()
                                setNameError(false)
                                setEmailError(false)
                                setContactError(false)
                                setRoleError(false)
                                setValidEmailError(false)
                                setExistEmailError(false)
                                setValidContactError(false)
                            } else {
                                NotificationManager.error(result.data.message);
                            }
                        })

                    }
                }
            })
        }
    }
    const canEditFun = (index, value, roleIdValue) => {
        setCanEdit(true)
        setRoleNameDes(value)
        setCanEditRole(roleIdValue)
        setEditIndex(index)
    }
    function canEditCancel() {
        setCanEdit(false)
        setEditIndex("")
    }
    const onRoleDelete = () => {
        var data = {
            "role_id": roleId + "",
            "orgn_id": getUserData().response.orgn_id + ""
        }
        showLoader()
        deleteOrgRole(data).then(result => {
            hideLoader()
            if (result.data.success) {
                userEvent("Delete role")
                NotificationManager.success(result.data.message);
                handleRoleClose()
                getOrgRoleFun()
                setIsViewDiv(false)
            } else {
                NotificationManager.error(result.data.message);
            }
        })
    }
    const onAdminRoleDelete = () => {
        var data = {
            "orgn_id": getUserData().response.orgn_id + "",
            "user_id": userId + ""
        }
        showLoader()
        deleteOrgUser(data).then(result => {
            hideLoader()
            if (result.data.success) {
                userEvent("Delete admin")
                NotificationManager.success(result.data.message);
                handleRoleAdminClose()
                getOrgUserFun()
            } else {
                NotificationManager.error(result.data.message);
            }
        })

    }
    const onCheckbox = (e) => {
        const checked = e.target.checked;
        const checkedValue = e.target.value;
        let data = {
            "active": checked,
            "user_id": checkedValue + ""
        }
        console.log(data)
        deactiveOrgUser(data).then(result => {
            if (result.data.success) {
                getOrgUserFun()
                if (checked) {
                    NotificationManager.success(result.data.message);
                } else {
                    NotificationManager.error(result.data.message);
                }
            }
        })
    }
    const onCheckboxRole = (e) => {
        const checked = e.target.checked;
        const checkedValue = e.target.value;
        let data = {
            "active": checked,
            "role_id": checkedValue + ""
        }
        activeRoles(data).then(result => {
            if (result.data.success) {
                getOrgRoleFun()
                if (checked) {
                    NotificationManager.success(result.data.message);
                } else {
                    NotificationManager.error(result.data.message);
                }
            }
        })
    }
    const onSaveRoleAdminFun = () => {
        console.log(canEditRole)
        if (!canEditRole) {
            NotificationManager.error('Please select role');
            return false;
        }
        var data = {
            "orgn_id": getUserData().response.orgn_id + "",
            "user_id": roleNameDes + "",
            "role_id": canEditRole + ""
        }
        editOrgUser(data).then(result => {
            if (result.data.success) {
                NotificationManager.success(result.data.message);
                userEvent("Update admin")
                canEditCancel()
                getOrgUserFun()
            } else {
                NotificationManager.error(result.data.message);
            }
        })
    };
    const handleKeyPress = (event) => {
        if (search.length >= '2') {
            getOrgRoleFun()
        }
        if (search.length == '0') {
            getOrgRoleFun()
        }
    };
    const handleKeyPressRoleAdmin = (event) => {
        if (searchRoleAdmin.length >= '2') {
            setOffset(0)
            getOrgUserFun()
        }
        if (searchRoleAdmin.length == '0') {
            setOffset(0)
            getOrgUserFun()
        }
    };
    const handleChange = (val) => {
        let offeset = (val - 1) * limit;
        setOffset(offeset);
    };
    function pageLimitChange(e) {
        setLimit(e.target.value);
    };
    const reportDownloadFun = () => {
        var data = {
            "orgn_id": getUserData().response.orgn_id,
            "search": searchRoleAdmin,
            "type": report
        }
        showLoader()
        getDownloadOrgUserDownload(data).then(result => {
            if (result.data.success) {
                saveAs(IMAGE_URL + result.data.response.fileName, result.data.response.fileName)
                userEvent("Download admin report")
            } else {
                NotificationManager.error(result.data.message);
            }
            setTimeout(() => {
                hideLoader()
            }, 1000);
        })
    }
    const handleKeyPressRole = (value) => {
        if (value.length >= '2') {
            showLoader()
            let a = moduleRoleArr;
            var term = value; // search term (regex pattern)
            var search = new RegExp(term, 'i'); // prepare a regex object
            let b = a.filter(item => search.test(item.menulabel));
            console.log(b); // ["foo","fool","cool"]
            setModuleRoleArr(b)
            setTimeout(() => {
                hideLoader()
            }, 1000);
        }
        if (searchRole.length == '0') {
            showLoader()
            setModuleRoleArr(moduleRole)
            setTimeout(() => {
                hideLoader()
            }, 1000);
        }
    }

    return (
        <>
            <div className="main">
                <main className="content">
                    <div className="row mb-2 mb-lg-0">
                        <div className="col-md-12 d-lg-flex align-items-center main-hdng">
                            <div className="col-md-6">
                                <h3 className="access-compny">Access</h3>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <div className="access_page_tab">
                                {/* TAB */}
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        {/* Access */}
                                        <button
                                            className="nav-link active"
                                            id="access-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#accesst"
                                            type="button"
                                            role="tab"
                                            aria-controls="accesst"
                                            aria-selected="true"
                                            onClick={getOrgRoleFun}
                                        >
                                            Access
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        {/* Admin */}
                                        <button
                                            className="nav-link"
                                            id="admin-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#admint"
                                            type="button"
                                            role="tab"
                                            aria-controls="admint"
                                            aria-selected="false"
                                            onClick={getOrgUserFun}
                                        >
                                            Admin
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            {/* CONTENT */}
                            <div className="tab-content" id="myTabContent">
                                {/* ACCESS */}
                                <div className="tab-pane fade show active" id="accesst" role="tabpanel"
                                    aria-labelledby="access-tab">
                                    <div className="bg-light shadow_d rounded-3 mb-4">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <div className="bg-white shadow_d rounded-3">
                                                    <div className="assects_src">
                                                        <div className="assects_src_dv position-relative">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={search}
                                                                onChange={(e) => { setSearch(e.target.value) }}
                                                                onKeyUp={handleKeyPress}
                                                                placeholder="Search Roles"
                                                            />
                                                            <button className="btn no-bg"><i
                                                                className="bi bi-search"></i></button></div>
                                                        <div className="assects_src_dvadd">
                                                            <button
                                                                disabled={!canEditUser}
                                                                onClick={handleShow}
                                                                className="btn down_btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#addrole">
                                                                <i className="bi bi-plus"></i>
                                                                Add Role
                                                            </button></div>
                                                    </div>
                                                    <div className="acces_tabl">
                                                        <div
                                                            className="acces_tabl_top d-flex justify-content-between align-items-center">
                                                            <div className="acc_hed roledes">Roles</div>
                                                            <div className="acc_hed rolelis">Status</div>
                                                            <div className="acc_hed">Actions</div>
                                                        </div>
                                                        <div className="acces_tabl_blo mCustomScrollbar smootScrol">
                                                            {
                                                                roleList.length > 0 ?
                                                                    <>
                                                                        {roleList.map((item, index) => (
                                                                            <div key={index}>
                                                                                <div className={`acc_list_out`} id={'access' + index}>
                                                                                    <div className="acc_list roledes">{item.role_desc}</div>
                                                                                    <div className="acc_list rolelis" >
                                                                                        <div className="appr_dive">
                                                                                            <label className="switch">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    name="checkbox"
                                                                                                    defaultChecked={item.active == 1}
                                                                                                    value={item.role_id}
                                                                                                    onChange={(e) => { onCheckboxRole(e) }}
                                                                                                    disabled={!canEditUser}
                                                                                                />
                                                                                                <small></small>
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="acc_list actn_bt">

                                                                                        {/* EDIT BUTTON */}
                                                                                        {
                                                                                            // canEditUser ?
                                                                                                <button  onClick={() => { getOrgInfoFun(item.role_id, item.role_desc, index) }} className="d-inline me-3  collapsed" data-bs-toggle="collapse"
                                                                                                    href={'#collapseExample' + index} role="button" aria-expanded="false"
                                                                                                    aria-controls="collapseExample">
                                                                                                    <svg
                                                                                                        xmlns="http://www.w3.org/2000/svg" width="16"
                                                                                                        height="16" fill="currentColor"
                                                                                                        className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                                                                        <path
                                                                                                            d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z">
                                                                                                        </path>
                                                                                                    </svg>
                                                                                                </button>
                                                                                                // :
                                                                                                // <button disabled={canEditUser} onClick={() => { getOrgInfoFun(item.role_id, item.role_desc, index) }} className="d-inline me-3  collapsed" data-bs-toggle="collapse"
                                                                                                //     href={'#collapseExample' + index} role="button" aria-expanded="false"
                                                                                                //     aria-controls="collapseExample">
                                                                                                //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                                                                //         <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                                                                //         <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                                                                                //     </svg>
                                                                                                // </button>
                                                                                        }


                                                                                        {/* DELETE BUTTON */}
                                                                                        {
                                                                                            canEditUser ?
                                                                                                <button disabled={!canEditUser}
                                                                                                    onClick={() => { handleRoleShow(); setRoleId(item.role_id) }}
                                                                                                    className="d-inline"><svg
                                                                                                        xmlns="http://www.w3.org/2000/svg" width="16"
                                                                                                        height="16" fill="currentColor"
                                                                                                        className="bi bi-trash-fill" viewBox="0 0 16 16">
                                                                                                        <path
                                                                                                            d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z">
                                                                                                        </path>
                                                                                                    </svg>
                                                                                                </button>
                                                                                                :
                                                                                                null
                                                                                        }


                                                                                    </div>
                                                                                </div>

                                                                                <div className="ass_edit_dv collapse" id={'collapsemanu' + index}>
                                                                                    <input type="text"
                                                                                        className={`form-control-sm ${nameEditError ? "error-fil" : ""}`}
                                                                                        value={roleName}
                                                                                        onChange={(e) => setRoleName(e.target.value)}
                                                                                        required
                                                                                    />
                                                                                    <div className="btn_edit">
                                                                                        <button disabled={!canEditUser} className="btn btn-primary" onClick={() => { onSaveFun(item.role_id, item.role_desc, index) }}>Save</button>
                                                                                        <button disabled={!canEditUser} id={"canButton" + index} className="btn btn-nobg btn-witbord collapsed" data-bs-toggle="collapse"
                                                                                            href={'#collapseExample' + index} role="button" aria-expanded="false"
                                                                                            aria-controls="collapseExample"
                                                                                            onClick={() => { setIsViewDiv(false); onCancel(index); }}>Cancel</button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <div role="row">
                                                                            <div align="center" colSpan="6" style={{ border: "0" }}>
                                                                                <div className="camp_empty_st_ra">
                                                                                    <img src={campemty} />
                                                                                    <strong>There are no data available here!</strong>
                                                                                    <p>Start a new role now</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            {
                                                roleList.length > 0 ?
                                                    <>
                                                    {
                                                         isViewDiv ?
                                                         <div className="col-md-5">
                                                             <div className="bg-white shadow_d rounded-3 my-5 me-3 ms-0 acces_rit">
                                                                 <div className="assects_src">
                                                                     <div className="assects_src_dv position-relative">
                                                                         <input type="text"
                                                                             className="form-control"
                                                                             value={searchRole}
                                                                             onChange={(e) => { setSearchRole(e.target.value) }}
                                                                             onKeyUp={(e) => { handleKeyPressRole(e.target.value) }}
                                                                             placeholder="Search Modules"
     
                                                                         />
                                                                         <button className="btn no-bg"><i
                                                                             className="bi bi-search"></i></button></div>
                                                                 </div>
                                                                 <div className="acces_tabl">
                                                                     <div
                                                                         className="acces_tabl_top d-flex justify-content-between align-items-center">
                                                                         <div className="acc_hed" style={{ width: "210px" }}>Modules</div>
                                                                         <div className="acc_hed" >Can view</div>
                                                                         <div className="acc_hed" >Can Edit</div>
                                                                     </div>
                                                                     <div className="acces_tabl_blo mCustomScrollbar smootScrol">
                                                                         {   
                                                                             moduleRoleArr.map((item, index) => (
                                                                                 <div key={index} className="acc_list_out">
                                                                                     <div className="acc_list" style={{ width: "200px" }}>{item.menulabel}</div>
                                                                                     <div className="acc_list"><div className="appr_dive">
     
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_view_checkbox"
                                                                                                 value={item.can_view}
                                                                                                 id={"can_view_checkbox" + index}
                                                                                                 onChange={(e) => { onCheckboxView(e, index) }}
                                                                                                 defaultChecked={item.can_view == "1"}
                                                                                                 disabled={item.disabled}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                     <div className="acc_list" style={{ marginRight: "10px" }}><div className="appr_dive">
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_edit_checkbox"
                                                                                                 value={item.can_edit}
                                                                                                 id={item.id}
                                                                                                 defaultChecked={item.can_edit == "1"}
                                                                                                 onChange={(e) => { onCheckboxEdit(e, index) }}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                 </div>
                                                                             ))
                                                                         }
                                                                     </div>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                         : null
                                                    }
                                                     </>
                                                    :
                                                    <>
                                                    <div className="col-md-5">
                                                             <div className="bg-white shadow_d rounded-3 my-5 me-3 ms-0 acces_rit">
                                                                 <div className="assects_src">
                                                                     <div className="assects_src_dv position-relative">
                                                                         <input type="text"
                                                                             className="form-control"
     
                                                                         />
                                                                         <button className="btn no-bg"><i
                                                                             className="bi bi-search"></i></button></div>
                                                                 </div>
                                                                 <div className="acces_tabl">
                                                                     <div
                                                                         className="acces_tabl_top d-flex justify-content-between align-items-center">
                                                                         <div className="acc_hed" style={{ width: "210px" }}>Modules</div>
                                                                         <div className="acc_hed" >Can view</div>
                                                                         <div className="acc_hed" >Can Edit</div>
                                                                     </div>
                                                                     <div className="acces_tabl_blo mCustomScrollbar smootScrol">
                                                                         
                                                                                 <div className="acc_list_out">
                                                                                     <div className="acc_list" style={{ width: "200px" }}>Dashboard</div>
                                                                                     <div className="acc_list"><div className="appr_dive">
     
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_view_checkbox"
                                                                                                 disabled={true}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                     <div className="acc_list" style={{ marginRight: "10px" }}><div className="appr_dive">
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_edit_checkbox"
                                                                                                 disabled={true}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                 </div>

                                                                                 <div className="acc_list_out">
                                                                                     <div className="acc_list" style={{ width: "200px" }}>Companies</div>
                                                                                     <div className="acc_list"><div className="appr_dive">
     
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_view_checkbox"
                                                                                                 disabled={true}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                     <div className="acc_list" style={{ marginRight: "10px" }}><div className="appr_dive">
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_edit_checkbox"
                                                                                                 disabled={true}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                 </div>

                                                                                 <div className="acc_list_out">
                                                                                     <div className="acc_list" style={{ width: "200px" }}>HRA</div>
                                                                                     <div className="acc_list"><div className="appr_dive">
     
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_view_checkbox"
                                                                                                 disabled={true}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                     <div className="acc_list" style={{ marginRight: "10px" }}><div className="appr_dive">
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_edit_checkbox"
                                                                                                 disabled={true}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                 </div>

                                                                                 <div className="acc_list_out">
                                                                                     <div className="acc_list" style={{ width: "200px" }}>Roles and Access</div>
                                                                                     <div className="acc_list"><div className="appr_dive">
     
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_view_checkbox"
                                                                                                 disabled={true}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                     <div className="acc_list" style={{ marginRight: "10px" }}><div className="appr_dive">
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_edit_checkbox"
                                                                                                 disabled={true}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                 </div>

                                                                                 <div className="acc_list_out">
                                                                                     <div className="acc_list" style={{ width: "200px" }}>Reports</div>
                                                                                     <div className="acc_list"><div className="appr_dive">
     
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_view_checkbox"
                                                                                                 disabled={true}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                     <div className="acc_list" style={{ marginRight: "10px" }}><div className="appr_dive">
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_edit_checkbox"
                                                                                                 disabled={true}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                 </div>

                                                                                 <div className="acc_list_out">
                                                                                     <div className="acc_list" style={{ width: "200px" }}>Settings</div>
                                                                                     <div className="acc_list"><div className="appr_dive">
     
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_view_checkbox"
                                                                                                 disabled={true}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                     <div className="acc_list" style={{ marginRight: "10px" }}><div className="appr_dive">
                                                                                         <label className="switch">
                                                                                             <input
                                                                                                 type="checkbox"
                                                                                                 name="can_edit_checkbox"
                                                                                                 disabled={true}
                                                                                             />
                                                                                             <small></small>
                                                                                         </label>
                                                                                     </div></div>
                                                                                 </div>
                                                                     </div>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                    </>
                                               
                                            }
                                        </div>
                                    </div>
                                </div>
                                {/* ADMIN */}
                                <div className="tab-pane fade" id="admint" role="tabpanel" aria-labelledby="admin-tab">
                                    <div className="row">
                                        <div className="col-md-12 d-lg-flex align-items-center hdng-btm mb-3">
                                            <div className="d-inline-block src_dv">
                                                <label>Search</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={searchRoleAdmin}
                                                    onChange={(e) => { setSearchRoleAdmin(e.target.value) }}
                                                    onKeyUp={handleKeyPressRoleAdmin}
                                                />
                                                <button className="btn"><i className="bi bi-search"></i></button>
                                            </div>
                                            <div className="d-inline-block dwnld_btn">
                                                <label>&nbsp;</label>
                                                <button disabled={!canEditUser} className="down_btn dropdown-toggle no-dropdown-arrow" href="#"
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
                                                        <button className="btn btn down_btn" disabled={!canEditUser} onClick={reportDownloadFun}>Download</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-inline-block add_btn"><label>&nbsp;</label>
                                                <button disabled={!canEditUser} onClick={handleAdminShow} className="btn down_btn" data-bs-toggle="modal" data-bs-target="#addadmin"><i className="bi bi-plus"></i> Add
                                                    Admin</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-light mb-4">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="bg-white shadow_d py-4 px-0 rounded-3 table_compny">
                                                    <div className="table-responsive">
                                                        <table className="table table-hover">
                                                            <thead>
                                                                <tr role="row">
                                                                    <th align="left" style={{ textAlign: "left" }}>Sl No.</th>
                                                                    <th align="left" style={{ textAlign: "left" }}>Name</th>
                                                                    <th align="center">Email ID</th>
                                                                    <th align="center">Roles</th>
                                                                    <th align="center">Status</th>
                                                                    <th align="center">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {adminList.length > 0 ?
                                                                    <>
                                                                        {
                                                                            adminList.map((item, index) => (
                                                                                <tr key={index} role="row">
                                                                                    <td align="left" style={{ textAlign: "left" }}>{index + 1}. </td>
                                                                                    <td align="left" style={{ textAlign: "left" }}>
                                                                                        {/* <span className="comp_icn">{item.full_name.slice(0, 1)}</span> */}
                                                                                        {item.full_name}
                                                                                    </td>
                                                                                    <td align="center">{item.email_id}</td>
                                                                                    <td align="center">
                                                                                        {
                                                                                            canEdit ? editIndex == index ?
                                                                                                <select
                                                                                                    className="form-select-sm"
                                                                                                    value={canEditRole}
                                                                                                    onChange={(e) => setCanEditRole(e.target.value)}
                                                                                                    disabled={!canEditUser}
                                                                                                >
                                                                                                    <option value="">Select</option>
                                                                                                    {
                                                                                                        roleList.map((obj, i) => (
                                                                                                            <option key={i} value={obj.role_id}>{obj.role_desc}</option>
                                                                                                        ))
                                                                                                    }
                                                                                                </select>
                                                                                                :
                                                                                                <div>{item.role_desc}</div>
                                                                                                :
                                                                                                <div>{item.role_desc}</div>
                                                                                        }
                                                                                    </td>
                                                                                    <td align="center">
                                                                                        <div className="appr_dive">
                                                                                            <label className="switch">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    name="checkbox"
                                                                                                    checked={item.active}
                                                                                                    value={item.user_id}
                                                                                                    onChange={(e) => { onCheckbox(e) }}
                                                                                                    disabled={!canEditUser}
                                                                                                />
                                                                                                <small></small>
                                                                                            </label>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td align="center">
                                                                                        {
                                                                                            canEdit ? editIndex == index ?
                                                                                                <div className="btn_edit">
                                                                                                    <button className="btn btn-primary" disabled={!canEditUser} onClick={onSaveRoleAdminFun}>Save</button>
                                                                                                    <button className="btn btn-nobg btn-witbord" disabled={!canEditUser} onClick={canEditCancel}>Cancel</button>
                                                                                                </div>
                                                                                                :
                                                                                                <div>
                                                                                                    <button disabled={!canEditUser} onClick={() => { canEditFun(index, item.user_id, item.role_id) }} className="d-inline"><svg xmlns="http://www.w3.org/2000/svg"
                                                                                                        width="16" height="16" fill="currentColor"
                                                                                                        className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                                                                        <path
                                                                                                            d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                                                                                    </svg>
                                                                                                    </button>

                                                                                                    <button disabled={!canEditUser} onClick={() => { handleRoleAdminShow(); setUserId(item.user_id) }}
                                                                                                        className="d-inline ms-3"><svg xmlns="http://www.w3.org/2000/svg"
                                                                                                            width="16" height="16" fill="currentColor"
                                                                                                            className="bi bi-trash-fill" viewBox="0 0 16 16">
                                                                                                            <path
                                                                                                                d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                                                                                        </svg>
                                                                                                    </button>
                                                                                                </div>
                                                                                                :
                                                                                                <div>
                                                                                                    <button disabled={!canEditUser} onClick={() => { canEditFun(index, item.user_id, item.role_id) }} className="d-inline"><svg xmlns="http://www.w3.org/2000/svg"
                                                                                                        width="16" height="16" fill="currentColor"
                                                                                                        className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                                                                        <path
                                                                                                            d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                                                                                    </svg>
                                                                                                    </button>

                                                                                                    <button disabled={!canEditUser} onClick={() => { handleRoleAdminShow(); setUserId(item.user_id) }}
                                                                                                        className="d-inline ms-3"><svg xmlns="http://www.w3.org/2000/svg"
                                                                                                            width="16" height="16" fill="currentColor"
                                                                                                            className="bi bi-trash-fill" viewBox="0 0 16 16">
                                                                                                            <path
                                                                                                                d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                                                                                        </svg>
                                                                                                    </button>
                                                                                                </div>
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
                                                                                    <p>Start a new admin now</p>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="paginati">
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
                                                            <span> Admin <strong>per page</strong></span>
                                                            <span style={{ paddingLeft: "20px" }}> Total Admin <strong>{totalCount}</strong></span>
                                                        </div>

                                                    </div>
                                                    <div className="paginati_r">
                                                        <Stack spacing={2}>
                                                            <Pagination count={totalPage} shape="rounded" onChange={(e, value) => handleChange(value)} />
                                                        </Stack>
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
            <nav className="navbar navbar-expand navbar-light navbar-bg d-block">
                <div className="navbar-collapse collapse navright">
                    <LoggedLayout />
                </div>
                
            </nav>
            <NotificationContainer />
            <Modal show={show} onHide={handleClose}>
                <div className="addrole">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body accrol_mod">
                        <h5 className="modal-title text-center">Create New Role</h5>
                        <div className="frm">
                            <div className="role_select">
                                <label>Role</label>
                                <input
                                    className={`form-control mb-0 ${roleDesError ? "error-fil" : ""}`}
                                    value={roleDes}
                                    onChange={(e) => setRoleDes(e.target.value)}
                                    required
                                />
                                {roleDesError ?
                                    <><span className='errorfiled'>Enter the role name</span></>
                                    :
                                    <></>
                                }

                            </div>
                            <div className="add_btn">
                                <button type="button" disabled={!canEditUser} className="btn btn-primary w-100 mt-5 ms-0" onClick={onAddRole} >Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal show={adminShow} onHide={handleAdminClose}>
                <div className="addrole">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleAdminClose}></button>
                    </div>
                    <div className="modal-body accrol_mod">
                        <h5 className="modal-title text-center">Add Admin</h5>
                        <div className="frm">

                            <div className="role_select mt-3">
                                <label>Name</label>
                                <input
                                    style={{ marginBottom: "0" }}
                                    type="text"
                                    className={`form-control mb-0 ${nameError ? "error-fil" : ""}`}
                                    placeholder="Enter the name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                {
                                    nameError ? <span className='errorfiled'>Please enter the name</span> : null
                                }

                            </div>

                            <div className="role_select mt-3">
                                <label>Email ID  </label>
                                <input
                                    style={{ marginBottom: "0" }}
                                    type="text"
                                    className={`form-control mb-0 ${emailError || validEmailError || existEmailIdError ? "error-fil" : ""}`}
                                    placeholder="Enter the email id"
                                    value={email}

                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {
                                    emailError ? <span className='errorfiled'>Please enter the email</span> : null
                                }
                                {
                                    validEmailError ? <span className='errorfiled'>Enter valid email id</span> : null
                                }
                                {
                                    existEmailIdError ? <span className='errorfiled'>Email id already exist</span> : null
                                }

                            </div>

                            <div className="role_select mt-3">
                                <label>Contact Number</label>

                                <div className="contct_no">
                                    <div className={`country_iso`}>

                                        <select
                                            className="form-select"
                                            value={counrtyCode}
                                            onChange={(e) => setCounrtyCode(e.target.value)}
                                            required
                                        >
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

                                    <div className={`contact_num ${contactError || validContactError ? "error-fil" : ""}`}>
                                        <input
                                            style={{ marginBottom: "0" }}
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter the contact number"
                                            value={contact}
                                            onChange={(e) => setContact(e.target.value)}
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
                                    contactError ? <span className='errorfiled'>Please enter contact number</span> : null
                                }

                                {
                                    validContactError ? <span className='errorfiled'>Enter valid contact number</span> : null
                                }

                            </div>

                            <div className={`role_select mt-3 ${roleError ? "error-fil" : ""}`}>
                                <label>Role</label>
                                <select
                                    className="form-select"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    style={{ marginBottom: "0" }}
                                    required
                                >
                                    <option value="">Select</option>
                                    {
                                        adminRole.map((item, index) => (
                                            <option key={index} value={item.role_id}>{item.role_desc}</option>
                                        ))

                                    }
                                </select>
                                {
                                    roleError ? <span className='errorfiled'>Please select the role</span> : null
                                }

                            </div>
                            <div className="add_btn">
                                <button type="button" className="btn btn-primary w-100 mt-4 ms-0" onClick={onAddUser} disabled={!canEditUser}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal show={roleShow} onHide={handleRoleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ paddingLeft: "16px" }}>Are you want to delete this role?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={!canEditUser} onClick={handleRoleClose}>
                        No
                    </Button>
                    <Button variant="primary" disabled={!canEditUser} onClick={onRoleDelete}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={roleAdminShow} onHide={handleRoleAdminClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Admin Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ paddingLeft: "16px" }}>Are you want to delete this Admin role?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleRoleAdminClose} disabled={!canEditUser}>
                        No
                    </Button>
                    <Button variant="primary" onClick={onAdminRoleDelete} disabled={!canEditUser}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RoleAndAccess