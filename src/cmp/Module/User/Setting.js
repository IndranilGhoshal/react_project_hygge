///-----------Import Files-----------///
import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import LoggedLayout from './LoggedLayout'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { addFAQContent, changePass, deleteFAQContent, fetchFAQContent, fetchPrivacyPolicy, fetchProfileDetails, updateFAQContent, updatePolicy, updProfilePic, uploadFile, getHRACover, updateHRACover, userEvent } from '../../../service/Services';
import { GetDecrypt, getUserData, getUserRole, hideLoader, showLoader } from '../../../service/Common';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { IMAGE_URL, IMAGE_URL_ASSETS, PAYLOAD_ENCRYCT } from '../../../config/app_url';
///--------------Import Images-------------///
const profileImage = require('../../../assets/images/ppicture.png');
///------------Images urls------------///
var imgUrl = IMAGE_URL;
var imgUrlAsset = IMAGE_URL_ASSETS;
//-----------Stateless Functional Component named Setting--------//
function Setting() {
   /* Variables */  
   var mediumRegex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])([a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]{6,})$");
   var veryStrongRegex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])([a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]{8,})$");
   const [show, setShow] = useState(false);
   const [userData, setUserData] = useState({});
   const [faqData, setfaqData] = useState([]);
   const [hraCover, setHraCover] = useState([]);
   const [selectedCover, setSelectedCover] = useState([]);
   const [currPass, setCurrPass] = useState('');
   const [newPass, setNewPass] = useState('');
   const [cnfPass, setCnfPass] = useState('');
   const [addFAQ, setAddFAQ] = useState('');
   const [addFAQAns, setAddFAQAns] = useState('');
   const [profileimg, setprofileimg] = useState('');
   const [currPassNotify, setCurrPassNotify] = useState(false);
   const [newPassNotify, setNewPassNotify] = useState(false);
   const [cnfPassNotify, setCnfPassNotify] = useState(false);
   const [matchPassNotify, setMatchPassNotify] = useState(false);
   const [passMatchError, setPassMatchError] = useState(false);
   const [userLevel, setUserLevel] = React.useState(0)
   const [currvalues, setcurrValues] = React.useState({
      password: "",
      showPassword: false,
   });
   const [newvalues, setnewValues] = React.useState({
      password: "",
      showPassword: false,
   });
   const [cnfvalues, setcnfValues] = React.useState({
      password: "",
      showPassword: false,
   });
   const [canEdit, SetCanEdit] = React.useState(false)
   //--------------faq--------------//
   const [showDeleteFAQ, setShowDeleteFAQ] = useState(false);
   const [addFAQFormShow, setAddFAQFormShow] = useState(false);
   const [editQue, setEditQue] = useState("");
   const [editAns, setEditAns] = useState("");
   const [faqId, setFaqId] = useState("");
   const [search, setSearch] = React.useState("");
   const [editorStateFAQ, setEditorStateFAQ] = useState(EditorState.createEmpty());
   const [editorStateFAQOther, setEditorStateFAQOther] = useState(EditorState.createEmpty());
   const [faqQueError, SetFaqQueError] = React.useState(false)
   const [faqAnsError, SetFaqAnsError] = React.useState(false)
   const [faqAnsLengthError, SetFaqAnsLengthError] = React.useState(false)
   const [faqQueEditError, SetFaqQueEditError] = React.useState(false)
   const [faqAnsEditError, SetFaqAnsEditError] = React.useState(false)
   const [faqAnsEditLengthError, SetFaqAnsEditLengthError] = React.useState(false)
   const [isIndex, setIsIndex] = React.useState("")
   const [isUpdate, setIsUpdate] = React.useState("")
   ///--------------Privacy Policy----------------///
   const [policyData, setPolicyData] = useState("");
   const [otherpolicyData, setotherPolicyData] = useState("");
   const [editorState, setEditorState] = useState(EditorState.createEmpty());
   const [editorStateOther, setEditorStateOther] = useState(EditorState.createEmpty());
   /* Functions */
   //------------------UseEffect-----------------//  
   useEffect(() => {
      var role = getUserRole("Settings")
      if (role) {
         if (role.can_edit == 1) {
            SetCanEdit(true)
         }
      }
      if (getUserData().response.parent_orgn_id == "0") {
         setUserLevel(1)
      } else {
         if (getUserData().response.is_child == "0") {
            setUserLevel(2)
         } else {
            setUserLevel(3)
         }
      }
      fetchProfileDetailsFun()
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
   const handleShow = () => {
      showLoader()
      setShow(true)
      setTimeout(() => {
         hideLoader()
      }, 1000);
   };
   //--------------profile------------------//
   const fetchProfileDetailsFun = () =>{
      let data = {
         'userId': getUserData().response.userId,
         'orgId': getUserData().response.orgn_id
      }
      showLoader()
      fetchProfileDetails(data).then(result => {
         hideLoader()
         setUserData(result.data.response)
      })
   }
   const uploadProfile = (event) => {
      const logo = event.target.files
      const reader = new FileReader();
      reader.readAsDataURL(logo[0]);
      reader.onload = () => {
         const fileName = new FormData();
         fileName.append("file", logo[0]);
         uploadFile(fileName).then(result => {
            result = GetDecrypt(result)
            if (result.success) {
               var data = {
                  "userId": getUserData().response.userId,
                  "orgId": getUserData().response.orgn_id,
                  "fileName": result.response.fileName
               }
               showLoader()
               updProfilePic(data).then(result1 => {
                  hideLoader()
                  if (result1.data.success) {
                     setprofileimg(result1.data.response.fileName)
                     let data = {
                        'userId': getUserData().response.userId,
                        'orgId': getUserData().response.orgn_id
                     }
                     fetchProfileDetails(data).then(result => {
                        var user_data = result.data.response
                        setUserData(user_data)
                     })
                     NotificationManager.success(result.message);
                  }
               })
            }else{
               NotificationManager.error(result.message);
            }
         })
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
            hideLoader()
            if (res.data.success) {
               if (res.data.status == 1005) {
                  NotificationManager.error(res.data.message);
               } else if (res.data.status == 404) {
                  NotificationManager.error(res.data.message);
               } else {
                  handleClose()
                  NotificationManager.success(res.data.message);
                  userEvent("Password change")
               }
            }else{
               NotificationManager.error(res.data.message);
            }
         })
      }
   }
   ///-------------FAQ---------------///
   const handleFAQShow = () => {
      setShowDeleteFAQ(true)
   };
   const handleFAQShowCancel = () => {
      setShowDeleteFAQ(false)
   };
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
   const adfaq = () => {
      setAddFAQFormShow(true)
   }
   const faqCancel = () => {
      setAddFAQFormShow(false)
      SetFaqQueError(false)
      SetFaqAnsError(false)
      SetFaqAnsLengthError(false)
   }
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
         }else{
            NotificationManager.error(res.data.message);
         }
      })
   }
   const handleKeyPress = () => {
      if (search.length >= '2') {
         fetchFAQ()
      }
      if (search.length == '0') {
         fetchFAQ()
      }
   }
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
            }else{
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
            }else{
               NotificationManager.error(res.data.message);
            }
         })
      }

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
            }else{
               NotificationManager.error(res.data.message);
            }
         })
      }
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
   ///--------------Privacy Policy----------------/////
   function editpol() {
      document.getElementById('addpl_dv').style.display = 'block';
      document.getElementById('edit_dv').style.display = 'none';
   }
   function cancelAddPol() {
      document.getElementById('addpl_dv').style.display = 'none';
      document.getElementById('edit_dv').style.display = 'block';
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
            if (userLevel == 1) {
               if (!result.data.response.hygge || !result.data.response.hygge.policydesc) {
                  setPolicyData(result.data.response.hygge.policydesc)
                  const html = "<p></p>";
                  const contentBlock = htmlToDraft(html);
                  if (contentBlock) {
                     const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                     const editorState = EditorState.createWithContent(contentState);
                     setEditorState(editorState)
                  }
               } else {
                  setPolicyData(result.data.response.hygge.policydesc)
                  const html = result.data.response.hygge.policydesc;
                  const contentBlock = htmlToDraft(html);
                  if (contentBlock) {
                     const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                     const editorState = EditorState.createWithContent(contentState);
                     setEditorState(editorState)
                  }
               }
            }
            if (userLevel == 2) {
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

            if (userLevel == 3) {

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
         }else{
            NotificationManager.error(result.data.message);
         }

      })
   }
   const onEditorStateChange = (editorState) => {
      setEditorState(editorState)
   };
   const onEditorStateChangeOther = (editorState) => {
      setEditorStateOther(editorState)
   };
   const onSavePolicy = () => {
      let data = {
         "userId": getUserData().response.userId,
         "orgId": getUserData().response.orgn_id,
         "policydesc": draftToHtml(convertToRaw(editorState.getCurrentContent()))
      }
      showLoader()
      updatePolicy(data).then(res => {
         hideLoader()
         if (res.data.success){
            fetchPolicy()
            $('#cancelBtn').click()
            NotificationManager.success(res.data.message);
            userEvent("Save privacy policy")
         }else{
            NotificationManager.error(res.data.message);
         }
      })
   }
   function createMarkup() {
      return { __html: policyData };
   }
   function createMarkupCom() {
      return { __html: otherpolicyData };
   }
   const editpolCom = () => {
      document.getElementById('addpl_dv_com').style.display = 'block';
      document.getElementById('edit_dv_com1').style.display = 'none';
   }
   const cancelEditCom = () => {
      document.getElementById('addpl_dv_com').style.display = 'none';
      document.getElementById('edit_dv_com1').style.display = 'block';
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
         }else{
            NotificationManager.error(res.data.message);
         }
      })
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
   //-------------HRA COVER----------------//
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
            userEvent("Update HRA cover")
            getHraCover();
         }else{
            NotificationManager.error(res.data.message);
         }
      })
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
                        {/* TAB */}
                        <div className="addcompny_tab mt-0 norm_stngs">
                           <ul className="nav nav-tabs" id="myTab" role="tablist">
                          
                              {/* Profile */}
                              <li className="nav-item" role="presentation">
                                 <button 
                                 className="nav-link active" 
                                 id="prof_t-tab" 
                                 data-bs-toggle="tab"
                                 data-bs-target="#prof_t" 
                                 type="button" role="tab" 
                                 aria-controls="prof_t"
                                 aria-selected="true"
                                 onClick={fetchProfileDetailsFun}
                                 >
                                    Profile
                                 </button>
                              </li>

                              {/* FAQ */}
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
                                 onClick={fetchFAQ}
                                 
                                 >
                                    FAQ
                                 </button>
                              </li>

                              {/* Privacy Policy */}
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
                        <div className="mb-4 setting_page">
                           <div className="tab-content" id="myTabContent">
                              {/* Profile */}
                              <div className="tab-pane fade show active bg-white shadow_d rounded-3" id="prof_t"
                                 role="tabpanel" aria-labelledby="prof_dtlt-tab">
                                 <div className="prof_dtlt_in p-5">
                                    <div className="prof_dtlt_in_l me-5">
                                       <input id='file1' type='file' multiple
                                          accept='image/jpg, image/png, image/gif, image/jpeg'
                                          onChange={uploadProfile}
                                          style={{ display: "None" }}
                                       />
                                       <label htmlFor="file1" style={{ cursor: 'pointer', display: "inlineFlex" }} >
                                          {
                                             userData.imageurl ?
                                                <img width="197" height="194" src={imgUrl + userData.imageurl} />
                                                :
                                                <img width="197" height="194" src={profileImage} />
                                          }
                                       </label>
                                       <strong className='mt-3'>{userData.full_name}</strong>
                                       <p>{userData.useremail}</p>
                                    </div>
                                    <div className="prof_dtlt_in_r">
                                       <ul>
                                          <li>Name <strong>{userData.full_name}</strong></li>
                                          <li>Email ID <strong>{userData.useremail}</strong></li>
                                          <li>Contact Number <strong>{userData.contact_number}</strong></li>
                                          {
                                             userData.role_desc == null ?
                                             <><li>Role <strong>Master Admin</strong></li></>
                                                :
                                                <><li>Role <strong>{userData.role_desc}</strong></li></>
                                          }
                                       </ul>
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
                                                               faqQueError ? <><span className='errorfiled'>Enter the question</span></> : <></>
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
                                    userLevel == 1 ?
                                       <>
                                          <div id="edit_dv" className="edit_dv">
                                             <div className="ppolcy_hed">
                                                <strong>{getUserData().response.organisation_name} Privacy Policy</strong>
                                                <button
                                                   disabled={!canEdit}
                                                   className="btn btn-primary btn-lg"
                                                   onClick={editpol}
                                                   >
                                                   Edit Policy
                                                </button>
                                             </div>
                                             <div className="ed_min border-1 p-4 mt-4">
                                                {
                                                   policyData ?
                                                      <div className="editor_div_camp editor_cls" dangerouslySetInnerHTML={createMarkup()} /> : null
                                                }
                                             </div>
                                          </div>
                                          <div id="addpl_dv" className="hide">
                                             <div className="ppolcy_hed">
                                                <strong>{getUserData().response.organisation_name} Privacy Policy</strong>
                                                <div className="btn_edit">
                                                   <button disabled={!canEdit} className="btn btn-primary" onClick={onSavePolicy} style={{ width: "90px", height: "40px" }}>Save</button>
                                                   <button disabled={!canEdit} id="cancelBtn" className="btn btn-nobg btn-witbord" onClick={cancelAddPol} style={{ width: "100px", height: "40px" }}>Cancel</button>
                                                </div>
                                             </div>
                                             <div className="ed_min border-1 p-4 mt-4" id="editparent">
                                                <div id="editControls">
                                                   {
                                                      policyData ?
                                                         <>
                                                            <Editor
                                                               wrapperClassName="wrapper-class"
                                                               editorClassName="editor-class"
                                                               editorState={editorState}
                                                               onEditorStateChange={onEditorStateChange}
                                                               toolbar={{
                                                                  options: ['inline', 'list'],
                                                                  inline: { inDropdown: false },
                                                                  list: { inDropdown: true },
                                                              }}
                                                            />
                                                         </> 
                                                         :
                                                         <>
                                                            <Editor
                                                               wrapperClassName="wrapper-class"
                                                               editorClassName="editor-class"
                                                               editorState={editorState}
                                                               onEditorStateChange={onEditorStateChange}
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
                                       </> : null
                                 }
                              </div>
                              {/* HRA Cover */}
                              <div className="tab-pane fade" id="hracov_t" role="tabpanel">
                                 <div className="hra_sec_tm">
                                    {
                                       hraCover.map((item, index) =>
                                          <div key={index} className={selectedCover == item.img_id ? "hra_sec_tm_in is_hra_sec_active bg-white shadow_d rounded-3 p-3":"hra_sec_tm_in bg-white shadow_d rounded-3 p-3"}>
                                             <img src={imgUrlAsset+item.image_name} />
                                             <button className="btn btn-primary" disabled={!canEdit} onClick={()=>updHRACover(item.img_id)}>Set as HRA Cover</button>
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
                              newPass ? <div className="pass_mat" style={{marginTop:"20px"}}>
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

                                 newvalues.showPassword ?  <i onClick={handleClickShowNewPassword} id="eyeIcon" className="fa fa-fw fa-eye field-icon toggle-password"></i> : <i onClick={handleClickShowNewPassword} id="eyeIcon" className="fa fa-fw field-icon toggle-password fa-eye-slash"></i>

                              }
                           </button>

                        </div>
                        <div className={`add_fild_com ${cnfPassNotify ? "error-fil" : ""}`}>
                           <label>Confirm your new password </label>
                           <input type={cnfvalues.showPassword ? "text" : "password"} id="txtPassword3" className="form-control mb-0" name="txtPassword3" placeholder="Enter your password" value={cnfPass}
                              onChange={(e) => setCnfPass(e.target.value)} required />
                           <button type="button" id="btnToggle3" className="toggle">
                              {

                                 cnfvalues.showPassword ?  <i onClick={handleClickShowCnfPassword} id="eyeIcon" className="fa fa-fw fa-eye field-icon toggle-password"></i> : <i onClick={handleClickShowCnfPassword} id="eyeIcon" className="fa fa-fw field-icon toggle-password fa-eye-slash"></i>

                              }
                           </button>

                           {
                              cnfPassNotify ? <><span className='errorfiled'>Enter confirm password</span></> : <></>
                           }
                           {
                              matchPassNotify ? <><span className='errorfiled'>New and confirm password should be same</span></> : <></>
                           }
                           {
                              passMatchError ? <><span className='errorfiled mt-4' style={{lineHeight:"16px"}}>At least 8 characters, with uppercase and lowercase case, a number, and a special character</span></> : <></>
                           }
                        </div>


                        <div className="add_btn">
                           <button disabled={!canEdit} type="button" className="btn btn-primary w-100 mt-5 ms-0" onClick={onSubmit}>Add</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </Modal>
         {/* -----Indranil------ */}
         <Modal show={showDeleteFAQ} onHide={handleFAQShowCancel}>
            <Modal.Header closeButton>
               <Modal.Title>Delete FAQ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <p style={{ paddingLeft: "16px" }}>Are you want to delete this FAQ?</p>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" disabled={!canEdit} onClick={handleFAQShowCancel}>
                  No
               </Button>
               <Button variant="primary" disabled={!canEdit} onClick={() => { onDeleteFaq() }}>
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>
         <NotificationContainer />
      </>
   )
}

export default Setting