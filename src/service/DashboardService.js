import axios from "axios";
import { getUserData, GetEncrypt } from "./Common";
import { BASE_URL, PAYLOAD_ENCRYCT } from "../config/app_url";

const baseURL = BASE_URL;
const encrypt = PAYLOAD_ENCRYCT;

export function getCompanyDashBoard(data) {
        return axios.post(baseURL + '/v1/dashboard/getCompanyDashBoard', data);
}

export function getVisitTrends(data) {
        return axios.post(baseURL + '/v1/dashboard/getVisitTrends', data);
}

export function getTraffic(data) {
        return axios.post(baseURL + '/v1/dashboard/getTraffic', data);
}