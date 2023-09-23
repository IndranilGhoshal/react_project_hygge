import axios from "axios";
import { BASE_URL, PAYLOAD_ENCRYCT } from "../config/app_url";
import { GetEncrypt, getUserData } from "./Common";

const encrypt = PAYLOAD_ENCRYCT;

export function getAllHRAQuestions(data) {
        return axios.post(BASE_URL + '/v1/question/fetch', data);
}


export function getHraSubCategory(data) {
    return axios.get(BASE_URL + '/v1/question/subcategory');
}

export function getCategory() {
    return axios.get(BASE_URL + '/v1/question/getCategory');
}


export function getQuestionDetails(data) {
        return axios.post(BASE_URL + '/v1/question/details', data);
}


export function updateQuestionDetails(data) {
        return axios.post(BASE_URL + '/v1/question/desc-update', data);
}