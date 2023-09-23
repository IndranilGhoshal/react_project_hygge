import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { CircularProgressbar } from "react-circular-progressbar";
import { toast, ToastContainer } from "react-toastify";
import { IMAGE_NAME } from "../../../constant/images";
import { deviceDetails } from "../../../device/Device";
import { hideLoader } from "../../../service/Common";
import { getHraScore, sendMailToUser, userEventQuestion } from "../../../service/questionService";

function Congratulations_m(props) {
    const [email, setEmail] = useState("");
    const [authData, setAuthData] = useState({});
    const [totalScore, setTotalScore] = useState(0);
    const [isMailShow, setIsMailShow] = useState(false);
    const [isHealthcare, setIsHealthCare] = useState(false);
    const [success, setSuccess] = useState(false);
    const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    useEffect(() => {

        let data = sessionStorage.getItem("qs_campaign_data");
        let obj = JSON.parse(data);
        // console.log("Object >>>> ", obj);
        if (obj.organisation_type === "Healthcare") {
            setIsHealthCare(true)
        }
        setAuthData(obj);
        getScore(obj);

    }, []);

    function getScore(obj) {

        let data = {
            campaigndtlid: obj.campaignDtlId,
            emp_id: obj.empId
        }

        console.log("AUth Data >>>> ", data)

        getHraScore(data, obj.token).then(res => {
            if (res.data.success) {
                hideLoader()
                let respObj = res.data.response;
                setTotalScore(respObj.score);
                var tempArr = [];
                tempArr.push(respObj.score);
            } else {
                hideLoader()
                toast.error(res.data.message);
            }
        })
    }

    function onMailChange(e) {
        setEmail(e.target.value);
    }

    function sendEmail() {
        var err = 0

        if (!EMAIL_REGEX.test(email)) {
            err++;
            toast.error("Please input valid email");
            return false;
        }
        if (email === "") {
            toast.error("Please enter your email");
            err++;
            return false;

        }
        if (err == 0) {

            setIsMailShow(true)
        }
    }

    function back() {
        setIsMailShow(false)
    }

    function reportSend() {
        let payload = {
            email: email,
            userId: authData.empId,
            orgId: authData.orgId,
            campaignDtlId : authData.campaignDtlId
        }
        getPhysicianReport(payload, authData.token).then(res => {
            if (res.data.success) {
                sendUserAgent();
                setSuccess(true);
            }
        })

        // let payload = {
        //     "email_id": email,
        //     "emp_id": authData.empId,
        //     "orgId": authData.orgId
        // }
        // sendMailToUser(payload, authData.token).then(res => {
        //     if (res.data.success) {
        //         sendUserAgent();
        //         setSuccess(true);
        //     }
        // })
    }

    function sendUserAgent() {
        let value = {
            orgn_id: authData.orgId,
            user_id: authData.empId,
            campaignDtlId: authData.campaignDtlId,
            user_agent: deviceDetails().user_agent,
            event_name: "send health report",
            device_type: deviceDetails().device_type
        }
        userEventQuestion(value, authData.token);
    }
    return (
        <>
            <ToastContainer hideProgressBar theme="colored" />
            <div class={isMailShow ? "wrapper congratpge congrat_bg" : "wrapper congratpge hracongrat_bg"}>


                <div class="main">
                    <main class="content">
                        <div class="container-fluid p-0">
                            <div class="cong_div_sec">
                                <div class="cong_head">
                                    <p>&nbsp;</p>
                                    <strong>Congratulations</strong>
                                    <p>You have completed your Health Risk Assesment</p>
                                </div>
                                <div class="cong_chart">
                                    <p>Total HRA score</p>
                                    {/* <img src={IMAGE_NAME.CHART_CONG} /> */}
                                    <div style={{ width: "30%", margin: "0 auto" }}>
                                        <CircularProgressbar value={totalScore} text={`${totalScore}/100`} styles={{ path: { stroke: totalScore < 50 ? '#E74C3C' : totalScore < 80 ? '#F7DC6F' : '#229954' }, trail: { stroke: '#EAECEE' }, text: { fill: '#000000', fontSize: '15px' } }} />
                                    </div>
                                </div>
                                {isHealthcare ?
                                    !isMailShow ? <>
                                        <div class="chart_cong_btn">
                                            <p>Share the report with your health care provider</p>
                                        </div>
                                        <div class="send_fed">
                                            <input type="text" placeholder="Enter the email ID" value={email} onChange={(e) => onMailChange(e)} />
                                            <button onClick={sendEmail}>Send</button>
                                        </div>
                                    </> : <>
                                        {success ? <>

                                            <div class="chart_cong_btn">
                                                <img src={IMAGE_NAME.CONG_TIC} />
                                                <p>Your HRA report has been successfully shared with <br />your health care provider</p>
                                                <a href="mailto:priyankasainani@gmailicom">{email}</a>
                                            </div>
                                        </> : <>
                                            <div class="chart_cong_btn">
                                                <img src={IMAGE_NAME.MAIN_ICON} alt="" />
                                                <p>Share the report with your health care provider</p>
                                                <a href="mailto:priyankasainani@gmailicom">{email}</a>
                                                <div class="btns_blo">
                                                    <button class="btn btn-nobg" onClick={() => back()}>No</button>
                                                    <button class="btn btn-primary" onClick={() => reportSend()}>Yes! Share it</button>
                                                </div>
                                            </div>
                                        </>}
                                    </>
                                    : <></>
                                }
                            </div>
                        </div>
                    </main>
                </div>

            </div>
        </>
    )
}

export default Congratulations_m;