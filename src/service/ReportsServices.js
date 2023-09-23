import axios from "axios";
import { getUserData, GetEncrypt } from "./Common";
import { BASE_URL, PAYLOAD_ENCRYCT } from "../config/app_url";

const baseURL = BASE_URL;
const encrypt = PAYLOAD_ENCRYCT;

export function getHealthWellOMeterReport(data) {
        return axios.post(baseURL + '/v1/analysis/getHealthWellOMeterReport', data);
}

export function getHealthAnalysisReport(data) {
        return axios.post(baseURL + '/v1/analysis/getHealthAnalysisReport', data);
}

export function getAnalysisReportHeader(data) {
        return axios.post(baseURL + '/v1/analysis/getAnalysisReportHeader', data);
}

export function getHealthAnalysisReportByHeader(data) {
        return axios.post(baseURL + '/v1/analysis/getHealthAnalysisReportByHeader', data);
}


export function getAnalysisReportFilters(data) {
        return axios.post(baseURL + '/v1/analysis/getAnalysisReportFilters', data);
}

export function getCampaignList(data) {
        return axios.post(baseURL + '/v1/compare-report/campaignList', data);
}

export function getCampaignReportList(data) {
        return axios.post(baseURL + '/v1/compare-report/getCampaignReport', data);
}


export function getCompanyList(data) {
        return axios.post(baseURL + '/company/getCompanyList', data);
}