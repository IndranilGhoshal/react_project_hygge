import React, { useEffect, useState } from 'react'
import { hideLoader, showLoader } from '../../../service/Common'

import { getAllCampaignList } from '../../../service/CampaignService'
import { getCampMap } from '../../../service/EmployeeService'
import { getAllQuestions, getEmployeeHraScore } from '../../../service/questionService'

import { getAllCompanies } from '../../../service/Services'
import MyBodyViewPage from './MyBodyViewPage'
import MyLifestyleViewPage from './MyLifeStyleViewPage'
import MyMindViewPage from './MyMindViewPage'

function MainPage(props) {
    const [totalScore, setTotalScore] = useState(0);
    const [companyList, setCompanyList] = useState([])
    const [companyId, setCompanyId] = useState('')

    const [campaignList, setCampaignList] = useState([])
    const [campaignDtlId, setCampaignDtlId] = useState('')


    const [employeeList, setEmployeeList] = useState([])
    const [employeeId, setEmployeeId] = useState('');
    const [orgId, setOrgId] = useState(0);
    const [myBody, setMyBody] = useState([]);
    const [myLifestyle, setMyLifestyle] = useState([]);
    const [myMind, setMyMind] = useState([]);

    const [isBodyView, setIsBodyView] = useState(false);




    useEffect(() => {
        showLoader()
        getAllCompaniesFun()

        setTimeout(() => {
            hideLoader()
        }, 1000);

    }, [])


    function getAllCompaniesFun() {
        showLoader()
        var data = {
            "orgn_id": "",
            "parent_orgn_id": "",
            "businessType": "",
            "industryType": "",
            "size": "",
            "search": "",
            "sort": "",
            "limit": "",
            "offset": ""
        }
        getAllCompanies(data).then(result => {
            hideLoader()
            if (result.data.success) {
                setCompanyList(result.data.response.resp)
            }

        })
    }

    const getAllCampaignListFun = (val) => {
        setCampaignList([])
        setEmployeeList([])
        setCampaignDtlId("")
        setEmployeeId("");
        setIsBodyView(false);
        setTotalScore(0);
        for (let i = 0; i < companyList.length; i++) {
            if (companyList[i].id == val) {
                setOrgId(companyList[i].orgn_id);
                break;
            }
        }
        var data = {
            "searchText": "",
            "selectedOrgId": val
        }
        showLoader()
        getAllCampaignList(data).then(result => {
            hideLoader()
            if (result.data.success) {
                setCampaignList(result.data.response)
            }
        })
    }



    const getAllEmployeeList = (val) => {
        setEmployeeList([])
        setEmployeeId("");
        setIsBodyView(false);
        setTotalScore(0);
        var data = {
            "campaigndtlid": val
        }
        showLoader()
        getCampMap(data).then(result => {
            hideLoader()
            if (result.data.success) {
                if (result.data.response != 0) {
                    setEmployeeList(result.data.response)
                }
            }
        })
    }

    const employeeDetails = (val) => {
        if (val === "") {
            setIsBodyView(false);
            setTotalScore(0);
        } else {
            var data = {
                "emp_id": val,
                "campaigndtlid": campaignDtlId,
                "orgid": orgId
            }
            showLoader()
            getAllQuestions(data).then(res => {
                hideLoader()
                if (res.data.success) {
                    // console.log("Question Response >> ", res.data.response);
                    setMyBody(questionReArrange(res.data.response.data["My Body"]));
                    setMyLifestyle(questionReArrange(res.data.response.data["My Lifestyle"]));
                    setMyMind(questionReArrange(res.data.response.data["My Mind"]));
                    setIsBodyView(true);
                    getScore(val)
                } else {
                    setIsBodyView(false);
                    setTotalScore(0);
                }
            })
        }
    }

    function getScore(val) {

        let data = {
            campaigndtlid: campaignDtlId,
            emp_id: val
        }

        getEmployeeHraScore(data).then(res => {
            if (res.data.success) {
                hideLoader()
                let respObj = res.data.response;
                setTotalScore(respObj.score);
            } else {
                hideLoader()
            }
        })
    }

    function questionReArrange(arr) {
        let temp = [];

        arr.map((data) => {
            if (data.question_id == 14) {
                for (let i = 0; i < data.options.length; i++) {
                    if (data.options[i].option_id === 55) {
                        data.options[i].special_condition = 0;
                        break;
                    }
                }
            }
            let opArr = [];
            data.options.map((op) => {
                op['selected'] = false;
                op['isDisabled'] = false;
                opArr.push(op);
            });
            opArr.map((op) => {
                if (data.selected !== null) {
                    let str = data.selected.toString();
                    if (str.indexOf(",") > 0) {
                        let selectArr = data.selected.split(",");
                        // console.log("SelecteAtt >> ", selectArr)
                        selectArr.map((ss) => {
                            // console.log(ss)
                            if (op.option_id == ss) {
                                op.selected = true;
                            }
                        })
                    } else {
                        if (op.option_id == data.selected) {
                            op.selected = true
                        }
                    }
                }
            })
            data.options = opArr;
            if(data.havechild === 1){
                data.child.map((ch)=>{
                    let chOpArr = [];
                    ch.options.map((op) => {
                        op['selected'] = false;
                        op['isDisabled'] = false;
                        chOpArr.push(op);
                    });
                    chOpArr.map((op) => {
                        if (ch.selected !== null) {
                            let str = ch.selected.toString();
                            if (str.indexOf(",") > 0) {
                                let selectArr = ch.selected.split(",");
                                // console.log("SelecteAtt >> ", selectArr)
                                selectArr.map((ss) => {
                                    // console.log(ss)
                                    if (op.option_id == ss) {
                                        op.selected = true;
                                    }
                                })
                            } else {
                                if (op.option_id == ch.selected) {
                                    op.selected = true
                                }
                            }
                        }
                    })
                })
            }
            temp.push(data);
        })
        return temp;
    }


    return (<>
        <div className="main">
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="container-fluid p-0">
                            <div className="evalu_hra_scr">
                                <div className="bg-white shadow_d p-4 rounded-3">
                                    <div className="evalu_hra_scr_in">
                                        <div className="evalu_hra_scr_in_l">
                                            <h2>Find HRA Answers</h2>
                                        </div>

                                        <div className="evalu_hra_scr_in_r">
                                            <div className="get_ttl_scr" >
                                                <div className="get_ttl_scr_txt"><h3>Total Score<span>{totalScore}</span></h3>

                                                </div>
                                            </div>
                                            {/* <button class="btn btn-primary d-block" tabindex="0" type="button">Get Score</button> */}
                                        </div>
                                    </div>
                                    <div className="evalu_hra_scr_dropd">
                                        <div className="evalu_hra_scr_field">
                                            <label>Company</label>
                                            <select
                                                className='form-select'
                                                value={companyId}
                                                onChange={(e) => { setCompanyId(e.target.value); getAllCampaignListFun(e.target.value); }}
                                            >
                                                <option value=''>Select</option>
                                                {
                                                    companyList.map((item, i) => (
                                                        <option value={item.id} key={i}>{item.organisation_name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="evalu_hra_scr_field">
                                            <label>Campaign</label>
                                            <select
                                                className='form-select'
                                                value={campaignDtlId}
                                                onChange={(e) => { setCampaignDtlId(e.target.value); getAllEmployeeList(e.target.value) }}
                                            >
                                                <option value=''>Select</option>
                                                {
                                                    campaignList.map((item, i) => (
                                                        <option value={item.campaigndtlid} key={i}>{item.campName}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="evalu_hra_scr_field">
                                            <label>Employee</label>
                                            <select
                                                className='form-select'
                                                value={employeeId}
                                                onChange={(e) => { setEmployeeId(e.target.value); employeeDetails(e.target.value) }}
                                            >
                                                <option value=''>Select</option>
                                                {
                                                    employeeList.map((item, i) => (
                                                        <option value={item.emp_id} key={i}>{item.empemail}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isBodyView ?
                    <div className="bg-white shadow_d p-4 rounded-3 evalu_hra_scr_blo">
                        <div className="accordion" id="accordionExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick={() => { window.scrollTo(0, 0) }}>
                                        My Body
                                    </button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <MyBodyViewPage
                                            bodyArr={myBody}
                                            getScore={(val) => setTotalScore(val)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" onClick={() => { window.scrollTo(0, 0) }}>
                                        My Lifestyle
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <MyLifestyleViewPage
                                            bodyArr={myLifestyle}
                                            getScore={(val) => setTotalScore(val)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingThree">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" onClick={() => { window.scrollTo(0, 0) }}>
                                        My Mind
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <MyMindViewPage
                                            bodyArr={myMind}
                                            getScore={(val) => setTotalScore(val)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : <></>
                }
            </div>
        </div>

    </>)
}

export default MainPage;