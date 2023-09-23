import React, { useEffect, useState } from 'react'
import { hideLoader, showLoader } from '../../../service/Common'

import { getAllCampaignList } from '../../../service/CampaignService'
import { getCampMap } from '../../../service/EmployeeService'
import { getAllQuestions } from '../../../service/questionService'

import { getAllCompanies } from '../../../service/Services'
function EmployeeAnswer() {


    const [companyList, setCompanyList] = useState([])
    const [companyId, setCompanyId] = useState('')

    const [campaignList, setCampaignList] = useState([])
    const [campaignDtlId, setCampaignDtlId] = useState('')


    const [employeeList, setEmployeeList] = useState([])
    const [employeeId, setEmployeeId] = useState('')



    useEffect(() => {
        showLoader()
        // getAllCampaignListFun()
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
        setEmployeeId("")
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
        setEmployeeId("")
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
        var data = {
            "emp_id": val,
            "campaigndtlid": campaignDtlId
        }
        showLoader()
        getAllQuestions(data).then(result => {
            hideLoader()
            if (result.data.success) {
                console.log(result.data)
            }
        })
    }

    return (
        <>

            <div className='row' style={{ marginRight: "0" }}>

                <div className='col-sm-4 p-5'>
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

                <div className='col-sm-4 p-5'>
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


                <div className='col-sm-4 p-5'>
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


        </>
    )
}

export default EmployeeAnswer