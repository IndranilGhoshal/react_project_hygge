import axios from "axios";
import { getUserData, GetEncrypt } from "./Common";
import { BASE_URL, PAYLOAD_ENCRYCT } from "../config/app_url";

const baseURL = BASE_URL;
const encrypt = PAYLOAD_ENCRYCT;


export const getCompanyPDFFileToDownload = async (data) => {
        return axios.post(baseURL + '/v1/analysis/companyReport', data)
}


export const getCompanyCSVFileToDownload = async (data) => {
        return axios.post(baseURL + '/v1/analysis/companyCSVReport', data)
}


export const getCompanyEXCELFileToDownload = async (data) => {
        return axios.post(baseURL + '/v1/analysis/companyXLXReport', data)
}


export const getDownloadOrgUserDownload = async (data) => {
        return axios.post(baseURL + '/role_access/downloadOrgUser', data)
}

export const generateCampaignCompareReport = async (data) => {
        return axios.post(baseURL + '/v1/compare-report/generateCampaignCompareReport', data)
}

export const getAggregatedReport = async (data) => {
        return axios.post(baseURL + '/v1/analysis/getAggregatedReport', data)
}



