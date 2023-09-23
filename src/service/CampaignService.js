import axios from "axios";
import { getUserData, GetEncrypt } from "./Common";
import { BASE_URL, PAYLOAD_ENCRYCT } from "../config/app_url";
import { deviceDetails } from "../device/Device";

const baseURL = BASE_URL;
const encrypt = PAYLOAD_ENCRYCT;


export function getEmpListForCampaign(data) {
        return axios.post(baseURL + '/v1/campaign/getEmpListForCampaign', data);
}

export function getOnboardingDataOfCampaign(data) {
        return axios.post(baseURL + '/v1/campaign/getOnboardingDataOfCampaign', data);
}

export function getCampaignInitialSubDesc(data) {
        return axios.post(baseURL + '/v1/campaign/getCampaignInitialSubDesc', data);
}

export function createCampaign(data) {
        return axios.post(baseURL + '/v1/campaign/createCampaign', data);   
}

export function campaignList(data) {
        return axios.post(baseURL + '/v1/campaign/campaignList', data);
}


export function campaignDetails(data) {
        return axios.post(baseURL + '/v1/campaign/campaignDetails', data); 
}


export function campaignEmpList(data) {
        return axios.post(baseURL + '/v1/campaign/campaignEmpList', data);
}

export function upSertCampaign(data) {
        return axios.post(baseURL + '/v1/campaign/upSertCampaign', data);
}


export function endCampaign(data) {
        return axios.post(baseURL + '/v1/campaign/endCampaign', data);
}


// export function upSertRepetCampaign(data) {
//     if(encrypt){
//         var ciphertext = GetEncrypt(data);
//         let payloadData = {
//             "payload": ciphertext
//         }
//         return axios.post(baseURL + '/v1/campaign/upSertRepetCampaign', payloadData, getHeaderData());
//     }else{
//         return axios.post(baseURL + '/v1/campaign/upSertRepetCampaign', data, getHeaderData());
//     }
    
// }

export function upSertRepetCampaign(data) {
        return axios.post(baseURL + '/v1/campaign/upsertRepetCampaign_v2', data);
}

// export function repetCampaignEmpList(data) {
//     if(encrypt){
//         var ciphertext = GetEncrypt(data);
//         let payloadData = {
//             "payload": ciphertext
//         }
//         return axios.post(baseURL + '/v1/campaign/repetCampaignEmpList', payloadData, getHeaderData());
//     }else{
//         return axios.post(baseURL + '/v1/campaign/repetCampaignEmpList', data, getHeaderData());
//     }
    
// }

// export function repetCampaignEmpList(data) {
//     if(encrypt){
//         var ciphertext = GetEncrypt(data);
//         let payloadData = {
//             "payload": ciphertext
//         }
//         return axios.post(baseURL + '/v1/campaign/upsertRepetCampaignEmp_v2', payloadData, getHeaderData());
//     }else{
//         return axios.post(baseURL + '/v1/campaign/upsertRepetCampaignEmp_v2', data, getHeaderData());
//     }
    
// }

export function repetCampaignEmpList(data) {
        return axios.post(baseURL + '/v1/campaign/getRepetCampaignEmp_v2', data);
}
export function publishCampaign(data) {
        return axios.post(baseURL + '/v1/campaign/publishCampaign', data);
}
export function sendRemindersForCampaign(data) {
        return axios.post(baseURL + '/v1/campaign/sendRemindersForCampaign', data);   
}
export function deleteCampaign(data) {
        return axios.post(baseURL + '/v1/campaign/deleteCampaign', data);
}

export function getAllCampaignList(data) {
        return axios.post(baseURL + '/v1/campaign/getAllCampaignList', data);
}

export function checkLicence(data) {
        return axios.post(baseURL + '/mst_user/checkLicence', data);
}