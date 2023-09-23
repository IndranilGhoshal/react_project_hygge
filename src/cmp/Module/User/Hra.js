// ------------- Import Files ------------- //
import React, { useEffect, useState } from 'react';
import LoggedLayout from './LoggedLayout'
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery'
import { getAllHRAQuestions, getHraSubCategory, getQuestionDetails, updateQuestionDetails, getCategory } from '../../../service/hraService';
import { getUserData, getUserRole, showLoader, hideLoader } from '../../../service/Common';
import { LIMIT_ARRAY } from '../../../constant/constantValue';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import '../../../devCss/devCss.css'
import { userEvent } from '../../../service/Services';
///--------------Import Images-------------///
const meditation1 = require('../../../assets/images/meditation1.png');
const campemty = require('../../../assets/images/camp-emty.png');
//-----------Stateless Functional Component named Hra--------//
function Hra() {
    /* Variables */ 
    const [show, setShow] = useState(false);
    const [listData, setListData] = useState([]);
    const [limitArr, setLimitArr] = useState([]);
    const [limit, setLimit] = useState("10");
    const [offset, setOffset] = useState("0");
    const [totalPage, setTotalPage] = useState(0);
    const [totalRecors, setTotalRecords] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [filterSearch, setFilterSearch] = useState("");
    const [allSubCategory, setAllSubCateory] = useState([]);
    const [allCategory, setAllCateory] = useState([]);
    const [subCategory, setSubCategory] = useState("");
    const [qsDetails, setQsDetails] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [editDetails, setEditDetails] = useState("");
    const [selectedQsId, setSelectedQsId] = useState("");
    const [rowIndex, setRowIndex] = React.useState("")
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [desError, SetDesError] = useState(false);
    const [desLengthError, SetDesLengthError] = useState(false);
    const [canEdit, SetCanEdit] = React.useState(false)
    const [totalCount, setTotalCount] = useState(0);
    /* Functions */
    //------------------UseEffect-----------------// 
    useEffect(() => {
        var role = getUserRole("HRA")
        if (role) {
            if (role.can_edit == 1) {
                SetCanEdit(true)
            }
        }
        getAllCategory()
    }, [])
    useEffect(() => {
        fetchAllQuestion();
        setLimitArr(LIMIT_ARRAY)
    }, [limit, offset, filterSearch])
    //-------------- callback functions -------------//
    const handleShow = (id, index) => {
        showLoader()
        getDetailsQuestion(id);
        setRowIndex(index)
        for (var i = 0; i < listData.length; i++) {
            if (i == index) {
                $('#hraRow' + i).addClass('hraRowHover')
            } else {
                $('#hraRow' + i).removeClass('hraRowHover')
            }
        }
        setTimeout(() => {
            hideLoader()
        }, 1000);
    }
    const handleClose = () => {
        showLoader()
        setShow(false)
        SetDesError(false)
        for (var i = 0; i < listData.length; i++) {
            if (i == rowIndex) {
                $('#hraRow' + i).removeClass('hraRowHover')
            }
        }
        setTimeout(() => {
            hideLoader()
        }, 1000);
    };
    const editpol = () => {
        setEditDetails(qsDetails.briefdesc)
        var html
        if (qsDetails.briefdesc) {
            html = qsDetails.briefdesc;
        } else {
            html = "<p></p>";
        }
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
        setIsEdit(true);
    }
    function changeEditDetails(e) {
        setEditDetails(e.target.value);
    }
    function fetchAllQuestion() {
        let payload = {
            userId: getUserData().response.userId,
            limit: limit,
            offset: offset.toString(),
            searchText: searchText,
            subcatId: '',
            catId: filterSearch,
        }
        showLoader()
        getAllHRAQuestions(payload).then(res => {
            hideLoader()
            let respObj = res.data;
            if (respObj.success) {
                if (respObj.response != null) {
                    setListData(respObj.response.data);
                }
                setTotalCount(respObj.response.totalCount)
                let totalPage = Math.ceil(respObj.response.totalCount / limit);
                setTotalPage(totalPage);
                setTotalRecords(respObj.response.totalCount);
            }else{
                NotificationManager.error(respObj.message);
            }
        })
    }
    function getHraSubCategories() {
        getHraSubCategory().then(res => {
            let respObj = res.data;
            if (respObj.success) {
                if (respObj.response !== null) {
                    setAllSubCateory(respObj.response)
                }
            }
        })
    }
    function getAllCategory() {
        var data = {

        }
        getCategory().then(res => {
            let respObj = res.data;
            if (respObj.success) {
                if (respObj.response !== null) {
                    setAllCateory(respObj.response)
                }
            }
        })
    }
    function pageLimitChange(e) {
        setLimit(e.target.value);
    }
    function changeSearchText(e) {
        setSearchText(e.target.value);
    }
    function changeFilterSearch(e) {
        setFilterSearch(e.target.value);
        setOffset(0)
    }
    function getDetailsQuestion(id) {
        let data = {
            userId: getUserData().response.userId,
            questionId: id
        }
        showLoader()
        getQuestionDetails(data).then(res => {
            hideLoader()
            let respObj = res.data;
            if (respObj.success) {
                setSelectedQsId(id);
                setQsDetails(respObj.response);
                if (Object.keys(respObj.response).length > 0) {
                    setEditDetails(respObj.response.briefdesc);
                }
                setShow(true);
            }
        })
    }
    function closeEdit() {
        setIsEdit(false);
        SetDesError(false)
    }
    function searchFun() {
        if (searchText.length >= '2') {
            setOffset(0)
            fetchAllQuestion()
        }
        if (searchText.length == '0') {
            setOffset(0)
            fetchAllQuestion()
        }
    }
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    };
    const updateQuestionDescription = () => {
        SetDesError(false)
        SetDesLengthError(false)
        var err = 0
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
        const hasText = editorState.getCurrentContent().hasText()
        if (!hasText) {
            SetDesError(true)
            err++
        }else if(value.length>500){
            SetDesLengthError(true)
            err++
        }
        let data = {
            userId: getUserData().response.userId,
            questionId: selectedQsId,
            description: draftToHtml(convertToRaw(editorState.getCurrentContent()))
        }
        if (err == 0) {
            showLoader()
            updateQuestionDetails(data).then(res => {
                hideLoader()
                if (res.data.success) {
                    userEvent("Update question description")
                    NotificationManager.success(res.data.message);
                    getDetailsQuestion(selectedQsId);
                    setIsEdit(false);
                }else{
                    NotificationManager.error(res.data.message);
                }
            })
        }
    }
    function createMarkup() {
        return { __html: editDetails };
    }
    const handleChange = (val) => {
        let offeset = (val - 1) * limit;
        setOffset(offeset);
        window.scrollTo(0, 0)
    };
    return (
        <>
            <div className="main">
                <main className="content">
                    <div className="row mb-2 mb-lg-0">
                        <div className="col-md-12 d-lg-flex align-items-center main-hdng">
                            <div className="col-md-6">
                                <h3 className="hra-hed">HRA Questions</h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <div className="mastr_hw">
                                {/* SEARCH */}
                                <div className="assects_src_dv position-relative">
                                    <label>Search</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={searchText}
                                        onChange={(e) => changeSearchText(e)}
                                        onKeyUp={searchFun}
                                    />
                                    <button className="btn no-bg">
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                                {/* FILTER */}
                                <div className="assects_src_dvadd">
                                    <label>Filter</label>
                                    <select className="form-select" value={filterSearch} onChange={(e) => changeFilterSearch(e)}>
                                        <option value="">All</option>
                                        {allCategory.map((data, i) =>
                                            <option value={data.catId} key={i}>{data.categorydesc}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="bg-white shadow_d rounded-3">
                                {/* HRA TABLE */}
                                <div className="mast_hw_tab">
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr role="row">
                                                    <th align="left">S.No.</th>
                                                    <th align="left">Name</th>
                                                    <th align="left">Type</th>
                                                    <th style={{ textAlign: "center" }} align="center">Max Points</th>
                                                    <th style={{ textAlign: "center" }} align="center">Attempted People</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {listData.length > 0 ? 
                                                <>
                                                    {listData.map((data, i) =>
                                                        <tr id={'hraRow' + i} role="row" key={i} >
                                                            <td style={{ textAlign: "left" }} align="left">{data.id}.</td>
                                                            <td align="left">
                                                                <a onClick={() => handleShow(data.id, i)} >{data.questiondesc}</a>
                                                            </td>
                                                            <td align="left" style={{maxWidth: "60px",overflow: "hidden",textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{data.subcategorydesc}</td>
                                                            <td align="center">{data.max_score}</td>
                                                            <td align="center">0</td>
                                                        </tr>
                                                    )}
                                                </> 
                                                : 
                                                <>
                                                <tr role="row">
                                                    <td align="center" colSpan="6" style={{border: "0"}}>
                                                     <div className="camp_empty_st">
                                                        <img src={campemty} />
                                                        <strong>There are no data available here!</strong>
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
                                        <span> Questions <strong>per page</strong></span>
                                        <span style={{paddingLeft:"20px"}}> Total Questions <strong>{totalCount}</strong></span>
                                    </div>
                                </div>
                                <div className="paginati_r">
                                    <Stack spacing={2}>
                                        <Pagination 
                                        count={totalPage} 
                                        shape="rounded" 
                                        onChange={(e, value) => handleChange(value)} 
                                        />
                                    </Stack>
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

            <Modal size='xl' show={show} onHide={handleClose} className="hra_modal" >
                <div className="addrole" >
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body hra_qss">
                        <div className="hwmo_top">
                            <ul style={{ paddingLeft: "0" }}>
                                <li>
                                    <strong>Category</strong>
                                    <span><img src={meditation1} /></span>
                                    <p>{qsDetails.categorydesc}</p>
                                </li>
                                <li>
                                    <strong>Sub Category</strong>
                                    <span>&nbsp;</span>
                                    <p>{qsDetails.subcategorydesc}</p>
                                </li>
                                <li>
                                    <strong>Max Points</strong>
                                    <span>&nbsp;</span>
                                    <p>{qsDetails.max_score}</p>
                                </li>
                                <li>
                                    <strong>Question Type</strong>
                                    <span>&nbsp;</span>
                                    <p>{qsDetails.questiontype}</p>
                                </li>
                            </ul>
                        </div>
                        <div className="hwmo_btm">
                            <p><strong>Question</strong></p>
                            <p>{qsDetails.questiondesc}</p>
                            <p><span>Ans</span></p>
                            <ol className="list-group list-group-numbered">
                                {Object.keys(qsDetails).length > 0 ? <>
                                    {qsDetails.options.map((option, i) =>
                                        <li className="list-group-item" key={i}>{option.option_text}</li>
                                    )}
                                </> : null
                                }
                            </ol>
                            <p className="desc_hd"><i className="bi bi-info-circle"></i><strong>Description</strong><i className="bi bi-pencil cursor-pointer" onClick={() => editpol()} disabled={!canEdit}></i></p>
                            <div id="edit_dv" hidden={isEdit}>
                                <p>
                                    {
                                        editDetails ? <div className="editor_div_camp editor_cls" dangerouslySetInnerHTML={createMarkup()} /> : null
                                    }
                                </p>
                            </div>
                            <div id="addpl_dv" hidden={!isEdit}>
                                <div className={`editor_box ${desError || desLengthError ? "error-fil" : ""}`} >
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
                                </div>
                                {
                                    desError ? <><span className='errorfiled'>Enter the description</span></> : <></>
                                }
                                {
                                    desLengthError ? <><span className='errorfiled'>Enter the maximum 500 characters</span></> : <></>
                                }
                                <div className="btn_edit mt-5">
                                    <button className="btn btn-primary" onClick={updateQuestionDescription}>Save</button>
                                    <button className="btn btn-nobg btn-witbord" style={{ color: "#242424", border: "0.3px solid #242424" }} onClick={() => closeEdit()}>Cancel</button>
                                </div>
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Hra