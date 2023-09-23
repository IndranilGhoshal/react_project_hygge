import axios from "axios";
import { getUserData, GetEncrypt } from "./Common";
import { BASE_URL, PAYLOAD_ENCRYCT } from "../config/app_url";
import { deviceDetails } from "../device/Device";

const baseURL = BASE_URL;
const encrypt = PAYLOAD_ENCRYCT;


export const axiosInstance = axios.create({
baseURL: baseURL,
})


export function getTempEmployee(data) {
        return axios.post(baseURL + '/v1/employee/getTempEmployee', data);
}

export function editTempEmployee(data) {
        return axios.post(baseURL + '/v1/employee/editTempEmployee', data);
}


export function saveTempEmployee(data) {
        return axios.post(baseURL + '/v1/employee/saveTempEmployee', data);
}


export function addEmployee(data) {
        return axios.post(baseURL + '/v1/employee/addEmployee', data);
} 

export function getEmployee(data) {
        return axios.post(baseURL + '/v1/employee/getEmployee', data);
} 

export function editEmployee(data) {
        return axios.post(baseURL + '/v1/employee/updateEmployee', data);
} 

export function deleteEmployee(data) {
        return axios.post(baseURL + '/v1/employee/deleteEmployee', data);
}

export function toggleCheck(data) {
        return axios.post(baseURL + '/v1/employee/activeOrDeactiveEmployee', data);
}


export function deleteAllEmployee(data) {
        return axios.post(baseURL + '/v1/employee/deleteAllEmployee', data);
}

export function downloadEmpolyee(data) {
        return axios.post(baseURL + '/v1/employee/downloadEmpolyee', data);
}

export function getCampMap(data) {
        return axios.post(baseURL + '/v1/employee/getCampMap', data);
}