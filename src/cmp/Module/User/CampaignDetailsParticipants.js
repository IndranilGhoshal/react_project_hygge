import React, { useState, useEffect } from 'react'
import LoggedLayout from './LoggedLayout'
import { useParams, useNavigate } from 'react-router-dom'
import { campaignDetails, campaignEmpList } from '../../../service/CampaignService';
import { getUserData, hideLoader, showLoader } from '../../../service/Common';
import { LIMIT_ARRAY } from '../../../constant/constantValue';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { IMAGE_URL } from '../../../config/app_url';


const campemty = require('../../../assets/images/camp-emty.png');

const campdtlcpmp = require('../../../assets/images/camp-dtl-cpmp.png');

function CampaignDetailsParticipants() {

    let { id } = useParams();
    let navigate = useNavigate();

    const [limit, setLimit] = useState("10");
    const [offset, setOffset] = useState("0");
    const [search, setSearch] = React.useState("");
    const [totalPage, setTotalPage] = useState(0);

    const [limitArr, setLimitArr] = useState([]);

    var reqData = {
        "userId": getUserData().response.userId,
        "orgId": getUserData().response.orgn_id,
        "campaignDtlId": id,
        "limit": limit,
        "offset": offset,
        "search": search
    }

    const [campDetails, setCampDetails] = useState({})

    useEffect(() => {
        campaignDetailsFun()
    }, [])

    useEffect(() => {
        campaignEmpListFun(reqData)
        setLimitArr(LIMIT_ARRAY)
    }, [limit, offset, search])

    const campaignDetailsFun = () => {
        var data = {
            "userId": getUserData().response.userId,
            "orgId": getUserData().response.orgn_id,
            "campaignDtlId": id
        }
        showLoader()
        campaignDetails(data).then(result => {
            hideLoader()
            if (result.data.success) {
                console.log(result.data.response)
                setCampDetails(result.data.response)
            }

        })
    }

    const [empList, setEmpList] = useState([])


    const campaignEmpListFun = (reqData) => {
        showLoader()
        campaignEmpList(reqData).then(result => {
            hideLoader()
            if (result.data.success) {
                setEmpList(result.data.response.empList)

                if (result.data.response.empCount) {
                    let totalPage = Math.ceil(result.data.response.empCount / limit);
                    setTotalPage(totalPage);
                }
            }
        })

    }

    const handleKeyPress = () => {
        if (search.length >= '2') {
            campaignEmpListFun(reqData)
        }
        if (search.length == '0') {
            campaignEmpListFun(reqData)
        }
    }


    function pageLimitChange(e) {
        setLimit(e.target.value);
    }

    const gotoCamp = () => {
        navigate("/users/campaignDetails/" + id)
    }

    const returnCampaign = () => {
        navigate("/users/campaign")
    }

    return (
        <>
            <div className="main">

                <main className="content">

                    <div className="container-fluid p-0 position-relative">
                        <div className="addemplo collapse show" id="myCollapse">
                            <div className="row mb-2 mb-lg-4">
                                <div className="col-md-12 d-lg-flex align-items-center main-hdng">
                                    <div className="col-md-6">
                                        <h3 className="compny-add">Campaign</h3>
                                    </div>

                                </div>
                                <div className="breadcum">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><a onClick={returnCampaign}>Campaign </a></li>
                                            <li className="breadcrumb-item"><a onClick={gotoCamp}>{campDetails.campaigndesc}</a></li>
                                            <li className="breadcrumb-item active" aria-current="page">Participants</li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="bg-white shadow_d p-5 rounded-3">
                                        <div className="camp_dtl_pge">
                                            <div className="camp_dtl_hed"><span><img src={IMAGE_URL+getUserData().response.organisation_logo} /></span><strong>{campDetails.campaigndesc}</strong></div>

                                            <div className='participanthead'>
                                                <h5>Participants</h5>
                                            </div>

                                            <div className="participt_pge_to">
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
                                                    <button className="btn"><i className="bi bi-search"></i></button>
                                                </div>
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
                                                        <span> per page</span>

                                                    </div></div>
                                            </div>
                                            <div className="participt_tabl">
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                            <tr role="row">
                                                                <th align="left">First Name</th>
                                                                <th align="left">Last Name</th>
                                                                <th align="left">Email ID</th>
                                                                <th align="left">Status</th>
                                                            </tr>
                                                        </thead>

                                                        {empList.length > 0 ?
                                                            <>
                                                                {
                                                                    empList.map((item, i) => (
                                                                        <tbody key={i}>
                                                                            <tr role="row">
                                                                                <td align="left">{item.first_name}</td>
                                                                                <td align="left">{item.last_name}</td>
                                                                                <td align="left">{item.empemail}</td>
                                                                                {
                                                                                    item.isattempt == 0 && item.isComplete == 0 ?
                                                                                        <>
                                                                                            <td align="left"><span className="not_initl_round"></span> Not Initiated</td>
                                                                                        </>
                                                                                        :
                                                                                        <>

                                                                                        </>
                                                                                }

                                                                                {
                                                                                    item.isattempt == 1 && item.isComplete == 0 ?
                                                                                        <>
                                                                                            <td align="left"><span className="initl_round"></span> Initiated</td>
                                                                                        </>
                                                                                        :
                                                                                        <>

                                                                                        </>
                                                                                }

                                                                                {
                                                                                    item.isattempt == 1 && item.isComplete == 1 ?
                                                                                        <>
                                                                                            <td align="left"><span className="comp_round"></span> Completed</td>
                                                                                        </>
                                                                                        :
                                                                                        <>

                                                                                        </>
                                                                                }

                                                                            </tr>
                                                                        </tbody>
                                                                    ))
                                                                }
                                                            </>
                                                            :
                                                            <>
                                                                <tr role="row">
                                                                    <td align="center" colSpan="6" style={{ border: "0" }}>
                                                                        <div className="camp_empty_st">
                                                                            <img src={campemty} className='mt-5' />
                                                                            <strong>There are no data available here!</strong>
                                                                            <p>Start a new employee now</p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        }


                                                    </table>
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
        </>
    )
}

export default CampaignDetailsParticipants