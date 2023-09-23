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
import { getUserData, dateDifference } from '../../../service/Common';
import { LIMIT_ARRAY } from '../../../constant/constantValue';
import { getEmpListForCampaign, campaignDetails } from '../../../service/CampaignService';
import { useNavigate, useParams } from "react-router-dom";



const closeicon = require('../../../assets/images/close-icon.png');
const iicon = require('../../../assets/images/i-icon.png');

function CampaignEdit() {

    let { id } = useParams();

    let navigate = useNavigate();

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


    const [licenseCount, setLicenseCount] = React.useState("");

    const [licenseCountRemaining, setLicenseCountRemaining] = React.useState("");

    const [licenseValidity, setLicenseValidity] = React.useState("");

    const [myArray, setMyArray] = useState([]);

    const [myArrayErr, setMyArrayErr] = useState(false)

    const [successMessage, setSuccessMessage] = useState("")

    const [campDetails, setCampDetails] = useState({})



    var reqData = {
        "userId": getUserData().response.userId,
        "orgId": getUserData().response.orgn_id,
        "limit": limit,
        "offset": offset + "",
        "searchUserName": search,
        "searchCreatedAt": searchDate
    }

    useEffect(() => {
        getEmpListForCampaignFun(reqData)
        setLimitArr(LIMIT_ARRAY)
    }, [limit, offset, searchDate])

    useEffect(() => {
        campaignDetailsFun()
    }, [])


    const campaignDetailsFun = () => {
        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "campaignDtlId": id
        }

        campaignDetails(data).then(result => {
            if (result.data.success) {
                console.log("response", result.data.response)
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


            }

        })
    }


    function pageLimitChange(e) {
        setLimit(e.target.value);
    }

    const handleKeyPress = () => {
        if (search.length >= '2') {
            getEmpListForCampaignFun(reqData)
        }
        if (search.length == '0') {
            getEmpListForCampaignFun(reqData)
        }
    }

    const getEmpListForCampaignFun = (reqData) => {

        getEmpListForCampaign(reqData).then(result => {
            if (result.data.success) {
                // console.log("Emp List", result.data.response.empList)

                for (let obj of result.data.response.empList) {
                    for (let val of myArray) {
                        if (obj.id == val.empId) {

                            obj.isChecked = true

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


        if (name === "allSelect") {
            let tempUser = tempEmpList.map((user) => {
                return { ...user, isChecked: checked };
            });

            setTempEmpList(tempUser)

            var count = 0


            for (let data of tempUser) {
                var id
                if (data.isChecked == true) {
                    count++
                }
            }
            setSelectCount(count)

            // var temp = []

            // for (let data of tempUser) {

            //     var val = data.id

            //     temp.push({
            //         "empId": val + ""
            //     })

            // }
            // setSelectId(temp)


        } else {
            let tempUser = tempEmpList.map((user) =>
                user.first_name === name ? { ...user, isChecked: checked } : user
            );
            setTempEmpList(tempUser)

            var count = 0

            for (let data of tempUser) {
                if (data.isChecked == true) {
                    count++
                }
            }

            setSelectCount(count)


            // console.log("checked", checked)

            // console.log("value", value)


            if (checked) {
                setMyArray(myArray => [...myArray, { "empId": value }]);

            } else {
                removeByAttr(myArray, 'empId', value);
            }


            // for (let data of tempUser) {

            //     if (data.isChecked == true) {

            //         var val = data.id

            //         temp.push({
            //             "empId": val + ""
            //         })

            //     }
            // }

            // setSelectId(temp)

        }
    };

    var removeByAttr = function (arr, attr, value) {
        var i = arr.length;
        while (i--) {
            if (arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value)) {

                arr.splice(i, 1);

            }
        }
        return arr;
    }

    const handleChangePage = (e, val) => {
        let offeset = (val - 1) * limit;
        setOffset(offeset);
    };

    const closeBtn =() =>{
        navigate("/users/campaign")
    }

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    };

    return (
        <>
            {/* EDIT CAMPAIGN */}
            <div className="bulk_upl_po " >
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
                                <a
                                    className="nav-link active"
                                    id="details_t-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#details_t"
                                    type="button"
                                    role="tab"
                                    aria-controls="details_t"
                                    aria-selected="true"
                                // disabled={!detailsTabChange.showTab}

                                >
                                    Details
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link"
                                    id="audience_t-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#audience_t"
                                    type="button"
                                    role="tab"
                                    aria-controls="audience_t"
                                    aria-selected="false"
                                // disabled={!audiencetabChange.showTab}

                                >
                                    Audience
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link"
                                    id="overview_t-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#overview_t"
                                    type="button"
                                    role="tab"
                                    aria-controls="overview_t"
                                    aria-selected="false"
                                // disabled={!overviewtabChange.showTab}

                                >
                                    Overview
                                </a>
                            </li>

                        </ul>

                    </div>
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <div className="mb-4 add_employ_page">
                                <div className="tab-content" id="myTabContent">

                                    {/* DETAILS */}
                                    <div className="tab-pane fade show active" id="details_t" role="tabpanel" aria-labelledby="uplodfile_t-tab">

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
                                                        className={`form-control ${subjectNameEditErr ? "error-fil" : ""}`}
                                                        type="text"
                                                        placeholder="Enter the subject name"
                                                        value={subjectNameEdit}
                                                        onChange={(e) => { setSubjectNameEdit(e.target.value) }}

                                                    />
                                                    {subjectNameEditErr ?
                                                        <span className='errorfiled'>Enter the subject name</span>
                                                        : null
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
                                                                inline: { inDropdown: true },
                                                                list: { inDropdown: true },
                                                                textAlign: { inDropdown: true },
                                                                link: { inDropdown: true },
                                                                history: { inDropdown: true },
                                                            }}
                                                        />

                                                    </div>
                                                    {desEditErr ?
                                                        <span className='errorfiled'>Enter the description</span>
                                                        : null
                                                    }
                                                    {desLengthEditErr ?
                                                        <span className='errorfiled'>Enter the maximum 500 characters</span>
                                                        : null
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
                                                <button className="btn btn-nobg btn-witbord" >Save and Exit</button>
                                                <button className="btn btn-primary" >Next</button>
                                            </div>
                                        </div>

                                    </div>

                                    {/* AUDIENCE */}
                                    <div className="tab-pane fade" id="repir_t" role="tabpanel" aria-labelledby="audience_t-tab" >
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
                                                    <p className="actvt_cams">{selectCount} active participants selected | {licenseCountRemaining} License used
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
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            className={`form-check-input ${myArrayErr ? "error-fil" : ""}`}
                                                                                            name={item.first_name}
                                                                                            checked={item?.isChecked || false}
                                                                                            value={item.id}
                                                                                            onChange={handleChange}
                                                                                        />

                                                                                    </div>
                                                                                </td>
                                                                                <td align="left">{item.first_name}</td>
                                                                                <td align="left">{item.last_name}</td>
                                                                                <td align="left">{moment(item.empinserted_datetime).format('yyyy-MM-DD')}</td>
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
                                                            <button className="btn btn-nobg btn-witbord" >Save and Exit</button>
                                                            <button className="btn btn-primary" >Next</button>
                                                        </div>
                                                    </div>

                                                    <div className="bulk_pagi paginati">
                                                        <Stack spacing={2}>
                                                            <Pagination count={totalPage} shape="rounded" onChange={(e, value) => handleChangePage(e, value)} />
                                                        </Stack>
                                                    </div>

                                    </div>

                                    {/* OVERVIEW */}
                                    <div className="tab-pane fade" id="privcyimpo_t" role="tabpanel" aria-labelledby="overview_t-tab">
                                                    <div className="comprese_div_main collapse show" id="collapseExample">
                                                        <div className="comprese_div">
                                                            <div className="comprese_div_top">
                                                                <strong>Your campaign is ready to be launched !</strong>
                                                                <p>Review the details below before launching the campaign
                                                                </p>
                                                            </div>
                                                            <div className="comprese_div_mid">
                                                                <p>
                                                                    <span>Campaign Info</span>
                                                                    <a className='a_tag' >Edit Info Details</a>
                                                                </p>

                                                                            <ul>
                                                                                <li>
                                                                                    <span>Campaign Name: </span>
                                                                                    <strong>{campaignNameEdit}</strong>
                                                                                </li>
                                                                                <li>
                                                                                    <span>Start Date : </span>
                                                                                    <strong>{startDateEdit}</strong>
                                                                                </li>
                                                                                <li>
                                                                                    <span>End Date : </span>
                                                                                    <strong>{endDateEdit}</strong>
                                                                                </li>
                                                                            </ul>

                                                            </div>
                                                            <div className="comprese_div_mid">
                                                                <p>
                                                                    <span>Audience</span>
                                                                    <a className='a_tag' >Edit Audience Details</a>
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
                                                                    <a className='a_tag'>Edit Message</a>
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
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#collapseExample"
                                                                aria-controls="collapseExample"
                                                                // onClick={launchCampaign}
                                                            >
                                                                Launch Campaign
                                                            </button>

                                                        </div>
                                                    </div>
                                                    <div className="sucs_dive collapse" id="collapseExample">
                                                        <p>&nbsp;</p>
                                                        <span>
                                                            <i
                                                                className="bi bi-check-circle-fill">
                                                            </i>
                                                        </span>
                                                        <strong>Success!</strong>
                                                        <p>{successMessage}</p>
                                                        <button className="btn btn-primary" 
                                                        // onClick={goDash}
                                                        >Go to Dashboard</button>
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
        </>
    )
}

export default CampaignEdit