import axios from "axios";
import { BASE_URL, PAYLOAD_ENCRYCT } from "../config/app_url";
import { GetEncrypt, getUserData } from "./Common";

const encrypt = PAYLOAD_ENCRYCT;

function getHeaderData() {
    var token = getUserData().token
    let headerConfig = {
        headers: {
            'Content-Type': 'application/json',
            "accept": "application/json",
            "Authorization": "Bearer " + token
        }
    };
    return headerConfig;
}

function getReqPayload(data) {
    if (encrypt) {
        let val = {
            payload: GetEncrypt(data)
        }
        return val;
    } else {
        return data;
    }
}
//userEvent//

export function userEventQuestion(data, token) {
    if(encrypt){
        // var ciphertext = GetEncrypt(data);
        // let payloadData = {
        //     "payload": ciphertext
        // }
        return axios.post(BASE_URL + '/mst_user/userEvent', data, getQsHeaderData(token));
    }else{
        return axios.post(BASE_URL + '/mst_user/userEvent', data, getQsHeaderData(token));
    }
}


export function getAllQuestionData(data) {
    return axios.post(BASE_URL + '/v1/question/getAllQuestions',data);
}

export function validateToken(data){
    return axios.post(BASE_URL + "/v1/campaign/validate-token", data)
}

export function sendMailOtp(data, token){
    return axios.post(BASE_URL + "/v1/campaign/send-email", data , getQsHeaderData(token))
}


function getQsHeaderData(token) {
    let headerConfig = {
        headers: {
            'Content-Type': 'application/json',
            "accept": "application/json",
            "Authorization": "Bearer " + token
        }
    };
    // console.log("Header Config >>>> ", headerConfig)
    return headerConfig;
}

export function validateOtp(data, token){
    return axios.post(BASE_URL + "/v1/campaign/validate-otp", data , getQsHeaderData(token))
}

export function saveQuestionAnswer(data, token){
    return axios.post(BASE_URL + "/v1/question/saveQuestionAns", data , getQsHeaderData(token))
}

export function getHraScore(data, token){
    return axios.post(BASE_URL + "/v1/question/totalHraScore", data , getQsHeaderData(token))
}

export function saveAsComplete(data, token){
    return axios.post(BASE_URL + "/v1/question/markAsComplete", data , getQsHeaderData(token))
}

export function sendMailToUser(data, token){
    return axios.post(BASE_URL + "/v1/question/sendMailToUser", data , getQsHeaderData(token))
}

export function getAllQuestions(data, token){
    return axios.post(BASE_URL + "/v1/question/getAllQuestions", data , getQsHeaderData(token))
}

export function sendIndividualReport(data, token){
    return axios.post(BASE_URL + "/v1/analysis/sendIndividualReport", data , getQsHeaderData(token))
}

export function getPhysicianReport(data, token){
    return axios.post(BASE_URL + "/v1/analysis/getPhysicianReport", data , getQsHeaderData(token))
}

export function savetempQuestionAns(data){
    return axios.post(BASE_URL + "/v1/question/savetempQuestionAns", data )
}

export function getEmployeeHraScore(data){
    return axios.post(BASE_URL + "/v1/question/totalHraScore", data)
}


export function getPrivacyEmp(data){
    return axios.post(BASE_URL + "/mst_user/getPrivacyEmp", data)
}

