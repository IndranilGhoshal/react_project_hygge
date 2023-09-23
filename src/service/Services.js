import axios from "axios";
import { getUserData, GetEncrypt,GetDecrypt } from "./Common";
import { BASE_URL, PAYLOAD_ENCRYCT,PAYLOAD_DECRYCT } from "../config/app_url";
import { deviceDetails } from "../device/Device";

const baseURL = BASE_URL;
const encrypt = PAYLOAD_ENCRYCT;
const decrypt = PAYLOAD_DECRYCT;

axios.interceptors.request.use(function (config) {

        
        
        if (getUserData()) {
                config.headers.Authorization = 'Bearer ' + getUserData().response.token

                if(getUserData().response.userId && config.method === 'post'){
                        config.data.userId=getUserData().response.userId
                        config.data.orgId=getUserData().response.orgn_id
                } 
        }
        if (encrypt && config.method === 'post') {
                var ciphertext = GetEncrypt(config.data);
                let payloadData = {
                        "payload": ciphertext
                }
                config.data = payloadData;
        }

        return config;
}, function (error) {
        return Promise.reject(error);
});


axios.interceptors.response.use((response) => {
        if(decrypt){
                var res = GetDecrypt(response.data)
                response.data = res
        }
        
        return response
})

export const axiosInstance = axios.create({
        baseURL: baseURL,
        })


//userEvent//

export function userEvent(evn) {
        var value = {
                orgn_id: getUserData().response.orgn_id,
                user_id: getUserData().response.userId,
                user_agent: deviceDetails().user_agent,
                event_name: evn,
                device_type: deviceDetails().device_type
        }
        return axios.post(baseURL + '/mst_user/userEvent', value);
}
export function getNotification(data) {
        return axios.post(baseURL + '/mst_user/getNotification', data);
}
export function readNotification(data) {
        return axios.post(baseURL + '/mst_user/readNotification', data);
}
export function userLogin(data) {
        return axios.post(baseURL + '/mst_user/login', data);
}
export function userLogout(data) {
        return axios.post(baseURL + '/mst_user/logout', data);
}
export function userForgotPassword(data) {
        return axios.post(baseURL + '/mst_user/forgetpass', data);
}
export function sentOtp(data) {
        return axios.post(baseURL + '/mst_user/checkOtp', data);
}
export function createPassword(data) {
        return axios.post(baseURL + '/mst_user/resetPassword', data);
}
export function getOrgMainEmail(data) {
        return axios.post(baseURL + '/mst_user/getOrgMainEmail', data);
}
export function contactToAdmin(data) {
        return axios.post(baseURL + '/mst_user/contactToAdmin', data);
}
export function getPrivacyPolicy(data) {
        return axios.post(baseURL + '/mst_user/getPrivacyPolicy', data);
}
export function getIndustryType(data) {
        return axios.post(baseURL + '/company/getIndustryType', data);
}

export function uploadLogo(data) {
        var token = getUserData().token

        return fetch(baseURL + '/company/fileupload', {
                method: 'POST',
                headers: {
                        "Authorization": "Bearer " + token
                },
                body: data,
        }).then(res => res.json())
}

export function uploadLicence(data) {
        var token = getUserData().token

        return fetch(baseURL + '/v1/company/uploadLicence', {
                method: 'POST',
                headers: {
                        "Authorization": "Bearer " + token
                },
                body: data,
        }).then(res => res.json())
}

export function exportLicence(data) {
        return axios.post(baseURL + '/company/exportLicence', data);
}

export function checkUser(data) {
        return axios.post(baseURL + '/company/checkEmail', data);
}

export function addCompany(data) {
        return axios.post(baseURL + '/company/addOrg', data);
}

export function checkSmtp(data) {
        return axios.post(baseURL + '/company/checkSmtp', data);
}

export function generateLicence(data) {
        return axios.post(baseURL + '/company/generateLicence', data);
}

export function getAllCompanies(data) {
        return axios.post(baseURL + '/company/getAllCompanies', data);
}

export function getCountry(data) {
        return axios.post(baseURL + '/company/getCountry', data);
}

export function getCity(data) {
        return axios.post(baseURL + '/company/getCity', data);
}

export function getLicenseKey(data) {
        return axios.post(baseURL + '/company/getLicenseKey', data);
}

export function addCompanySuper(data) {
        return axios.post(baseURL + '/company/addOrgSuper', data);
}

export function getCompanyInfo(data) {
        return axios.post(baseURL + '/company/getCompanyInfo', data);
}

export function editProfileDetails(data) {
        return axios.post(baseURL + '/company/editProfile', data);
}

export function editProfileCompany(data) {
        return axios.post(baseURL + '/company/editProfileCompany', data);
}

export function editSMTPDetails(data) {
        return axios.post(baseURL + '/company/editSMTPdetails', data);
}

export function editLicense(data) {
        return axios.post(baseURL + '/company/editLicense', data);
}

export function editContactDetails(data) {
        return axios.post(baseURL + '/company/editContactDetails', data);
}

export function companyActivate(data) {
        return axios.post(baseURL + '/company/companyActivate', data);
}

export function checkActiveOrNot(data) {
        return axios.post(baseURL + '/company/checkActiveOrNot', data);
}

export function totalCmpCount(data) {
        return axios.post(baseURL + '/company/totalCmpCount', data);
}

export function reInviteComp(data) {
        return axios.post(baseURL + '/company/reInviteComp', data);
}

export function deleteComp(data) {
        return axios.post(baseURL + '/company/deleteComp', data);
}

export function smtpsetting(data) {
        return axios.post(baseURL + '/company/smtpsetting', data);
}

export function addRoleName(data) {
        return axios.post(baseURL + '/role_access/addRoleName', data);
}

export function getOrgRoles(data) {
        return axios.post(baseURL + '/role_access/getOrgRoles', data);
}

export function getHygMenu(data) {
        return axios.post(baseURL + '/role_access/getHygMenu', data);
}

export function getOrgRoleMenu(data) {
        return axios.post(baseURL + '/role_access/getOrgRoleMenu', data);
}

export function updateRoles(data) {
        return axios.post(baseURL + '/role_access/updateRoles', data);
}

export function addOrgUser(data) {
        return axios.post(baseURL + '/role_access/addOrgUser', data);
}

export function getOrgUser(data) {
        return axios.post(baseURL + '/role_access/getOrgUser', data);
}

export function editOrgUser(data) {
        return axios.post(baseURL + '/role_access/editOrgUser', data);
}

export function deactiveOrgUser(data) {
        return axios.post(baseURL + '/role_access/deactiveOrgUser', data);
}

export function activeRoles(data) {
        return axios.post(baseURL + '/role_access/activeRoles', data);
}

export function deleteOrgRole(data) {
        return axios.post(baseURL + '/role_access/deleteOrgRole', data);
}

export function deleteOrgUser(data) {
        return axios.post(baseURL + '/role_access/deleteOrgUser', data);
}

export function getUserMenu(data) {
        return axios.post(baseURL + '/role_access/getUserMenu', data);
}

// ------------------------------------------------by Akash-------------------------------
export function fetchProfileDetails(data) {
        return axios.post(baseURL + '/v1/profile/fetch', data);
}

export function changePass(data) {
        return axios.post(baseURL + '/v1/profile/change-password', data);
}

export function fetchPrivacyPolicy(data) {
        return axios.post(baseURL + '/v1/policy/fetch', data);
}

export function updatePolicy(data) {
        return axios.post(baseURL + '/v1/policy/upsert', data);
}

export function addFAQContent(data) {
        return axios.post(baseURL + '/v1/faq/insert', data);
}

export function fetchFAQContent(data) {
        return axios.post(baseURL + '/v1/faq/fetch', data);
}

export function fetchcompany(data) {
        return axios.post(baseURL + '/v1/faq/fetchcompany', data);
}

export function deleteFAQContent(data) {
        return axios.post(baseURL + '/v1/faq/delete', data);
}

export function updateFAQContent(data) {
        return axios.post(baseURL + '/v1/faq/update', data);
}

export function uploadFile(data) {
        var token = getUserData().token
        return fetch(baseURL + '/v1/upload/file', {
                method: 'POST',
                headers: {
                        "Authorization": "Bearer " + token
                },
                body: data,
        }).then(res => res.json())
}

export function updProfilePic(data) {
        return axios.post(baseURL + '/v1/profile/change-picture', data);
}

export function getHRACover(data) {
        return axios.post(baseURL + '/v1/profile/getOrgCover', data);
}

export function updateHRACover(data) {
        return axios.post(baseURL + '/v1/profile/updateOrgCover', data);
}

export function proceedToLogin(data) {
        return axios.post(baseURL + '/mst_user/orgCover', data);
}

// ---------------------------------------! END-------------------------------------------