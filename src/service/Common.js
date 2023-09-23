import { IMAGE_URL_ASSETS } from "../config/app_url";
import moment from 'moment';


var CryptoJS = require("crypto-js");


export var imgUrlAssets = IMAGE_URL_ASSETS

export function GetEncrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), 'hygge@!123').toString();
}
export function GetDecrypt(data) {
  var bytes = CryptoJS.AES.decrypt(data, 'hygge@!123');
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}


export function getUserRole(menuName) {
  // var data = JSON.parse(localStorage.getItem("userRole"))
  var data = JSON.parse(sessionStorage.getItem("userRole"))

  for (let obj of data) {
    if (obj.menulabel == menuName) {
      return obj
    }
  }
}


export function getUserData() {
  // return JSON.parse(localStorage.getItem("user"))
  return JSON.parse(sessionStorage.getItem("user"))
}


var userData = {}

export function setOtpUserData(data) {
  userData = data
}


export function getOtpUserData() {
  return userData
}



var datas = {}

export function setData(data) {
  datas = data
}


export function getData() {
  return datas
}

export function showLoader() {
  document.querySelector( '.loader_wait' ).style.display = 'block';
  document.querySelector( '.loader_bg' ).style.display = 'block';
}

export function hideLoader() {
  document.querySelector( '.loader_wait' ).style.display = 'none';
  document.querySelector( '.loader_bg' ).style.display = 'none';
}


export function dateDifference(start, end, datePrediod) {

  const date1 = new Date(start);
  const date2 = new Date(end);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // console.log(diffTime + " milliseconds");
  // console.log(diffDays + " days");
  if (diffDays > datePrediod) {
    return true
  } else {
    return false
  }

}

export function dateDiff(end) {
  // return moment(end).fromNow()
  return moment(end).format("MMM DD,YYYY [at] h:mm a");
}



export function deleteCommonItem(data, selectedVal, selectedKey) {
  let respArray = [];
  for (let i = 0; i < data.length; i++) {
    let tempObj = {};
    if (data[i][selectedKey] != selectedVal) {
      tempObj = data[i];
      respArray.push(tempObj);
    }
  }
  return respArray;
}