import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { IMAGE_URL, IMAGE_URL_ASSETS } from "../../config/app_url";
import { IMAGE_NAME } from "../../constant/images";
import { hideLoader } from "../../service/Common";
import { sendMailOtp, userEventQuestion, validateOtp, getPrivacyEmp } from "../../service/questionService";
import { deviceDetails } from "../../device/Device";
import { getPrivacyPolicy } from "../../service/Services";
import PrivacyPolicy from "../Modal/PrivacyPolicy";
import TermsAndConditions from "../Modal/TermsAndConditions";

function Login_Page_Question(props) {

    ////-------------------variables-------------------------///    
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userName, setuserName] = useState("");
    const [loginError, setloginError] = React.useState("");
    const [qs_data, setQsData] = useState({});
    const [loginLogo, setLoginLogo] = useState("");
    const [success, setSuccess] = useState(false);
    const [insertId, setInsertId] = useState("");
    const [policyData, setPolicyData]= useState('')


    const textInput1 = useRef(null);
    const textInput2 = useRef(null);
    const textInput3 = useRef(null);
    const textInput4 = useRef(null);
    const [value1, setValue1] = React.useState("")
    const [value2, setValue2] = React.useState("")
    const [value3, setValue3] = React.useState("")
    const [value4, setValue4] = React.useState("")
    const [otpError, setotpError] = React.useState("");

    const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const numberInputInvalidChars = [' '];

    useEffect(() => {
        let data = sessionStorage.getItem("qs_campaign_data");
        let obj = JSON.parse(data);
        setQsData(obj);
        let logo = IMAGE_URL + obj.organizationLogo;
        setLoginLogo(logo);
        getPrivacyPolicyFun()
    }, []);

    setTimeout(() => {
        hideLoader()
    }, 1000);

    const loginFun = () => {
        var err = 0

        if (!EMAIL_REGEX.test(userName)) {
            err++;
            setloginError("Please input valid email")
        }

        let token = qs_data.token;
        let data = {
            "email": userName,
        }

        if (err == 0) {
            setLoading((prevLoading) => !prevLoading);
            sendMailOtp(data, token).then(result => {
                setLoading((prevLoading) => !prevLoading);
                if (result.data.success) {
                    setSuccess(result.data.success);
                    setInsertId(result.data.response.insertId);
                    setDelay("120")
                    setMinutes('02');
                    setSeconds('00');
                } else {
                    if (result.data.status === 1008) {
                        navigate("/Sorry/" + result.data.response.userId)
                    } else {
                        setloginError(result.data.message)
                        setuserName("")
                    }
                }
            })

        }
    }


    //////------------function-----------------///////
    const inputHandel = () => {
        textInput2.current.focus();
    }
    const inputHandel2 = () => {
        textInput3.current.focus();
    }
    const inputHandel3 = () => {
        textInput4.current.focus();
    }
    var delayResend = "120"
    const [delay, setDelay] = React.useState(+delayResend);
    const [minutes, setMinutes] = React.useState('02');
    const [seconds, setSeconds] = React.useState('00');

    const [isPending, startTransition] = React.useTransition();



    const onSubmit = () => {
        var data = {
            "insertedId": insertId,
            "otp": value1 + value2 + value3 + value4
        }
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        // if (isMobile) {
        //     console.log("device Mobile");
        // } else {
        //     console.log("device >>>>> Web ")
        // }

        // delayResend
        validateOtp(data, qs_data.token).then(result => {
            if (result.data.success) {
                sendUserAgent()
                let path = "";
                if (isMobile) {
                    path = `/mquestion/${qs_data.token}`;
                } else {
                    path = `/question/${qs_data.token}`;
                }
                navigate(path);
            } else {
                setotpError("Oops! wrong OTP")
                setValue1("")
                setValue2("")
                setValue3("")
                setValue4("")
            }
        })
    }

    const otpSent = () => {

        loginFun();

    }

    function sendUserAgent() {
        let value = {
            orgn_id: qs_data.orgId,
            user_id: qs_data.empId,
            campaigndtlid: qs_data.campaignDtlId,
            user_agent: deviceDetails().user_agent,
            event_name: "emp_login",
            device_type: deviceDetails().device_type
        }
        userEventQuestion(value, qs_data.token);
    }



    useEffect(() => {

        if (Object.keys(qs_data).length < 1) {
            setSuccess(false);
        } else {
            const timer = setInterval(() => {
                startTransition(() => {
                    setDelay(delay - 1);
                    let min = Math.floor(delay / 60);
                    min = min < 10 ? '0' + min : min;
                    setMinutes(min);
                    let sec = Math.floor(delay % 60);
                    sec = sec < 10 ? '0' + sec : sec;
                    setSeconds(sec);

                });

            }, 1000);

            if (delay === 0) {
                clearInterval(timer);
                setMinutes('00');
                setSeconds('00');
            }
            return () => {
                clearInterval(timer);
            };
        }


    });

    const getPrivacyPolicyFun = () =>{
        let session = sessionStorage.getItem("qs_campaign_data");
        let obj = JSON.parse(session);

        var data ={
            "orgId":obj.orgId
        }
        getPrivacyEmp(data).then(result=>{
            if(result.data.success){
                setPolicyData(result.data.response.policydesc)
            }
        })
    }


    return (
        <>
            <div className="wrapper ">
                <div className="main_div hra_pgese">
                    <div className="logn_dv_in_lf"><img src={IMAGE_NAME.LOGIN_IMG} /></div>

                    <div className="logn_dv_in">
                        <div className="logn_dv_in_lft">
                            {!success ? <>

                                <div className="logn_dv_in_lf_wel_img">
                                    <img src={loginLogo} />
                                </div>

                                <h2>Login</h2>
                                <h5>Welcome to Hygge Lite</h5>
                                <form id="form1" >
                                    <div className={`input-container hasinpt ic1 ${loginError ? "error-field" : ""}  `}>
                                        <input id="Username"
                                            className="inputText"
                                            type="text"
                                            placeholder=""
                                            value={userName}
                                            onChange={(e) => {
                                                setuserName(e.target.value);
                                                setloginError("")
                                            }}
                                            required
                                            onKeyDown={(e) => {
                                                if (numberInputInvalidChars.includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />

                                        <span className="floating-label">Enter your email ID</span>
                                    </div>
                                    <div class="input-container hasinpt ic2 second-example">
                                    </div>

                                    <div className="forgt_dv">
                                        <p><span className="incorr-pass">{loginError}</span></p>
                                    </div>

                                    <button
                                        type="button"
                                        className="submit"
                                        disabled={!userName}
                                        onClick={loginFun}
                                    >
                                        {loading ? <div className="btn-loader"><img src={IMAGE_NAME.LOADER} /></div> : 'Send OTP'}
                                    </button>

                                    <p>&nbsp;&nbsp;</p>

                                </form>
                            </>
                                :
                                <>
                                    <div className="logn_dv_in_lf_wel_img">
                                        <img src={loginLogo} />
                                    </div>
                                    {/* {
                                    otpError ? <h2><span className="wrong_otp">Oops! wrong OTP</span></h2> : <h2>Enter OTP</h2>
                                } */}

                                    {/* {
                                    otpError ? <h6>&nbsp;</h6> : <h6>Enter your OTP sent to your e-mail<span>{getOtpUserData().response ? getOtpUserData().response.useremail : null}</span></h6>
                                } */}
                                    <h2>Enter OTP</h2>
                                    <h6>Enter your OTP sent to your e-mail<span>{userName}</span></h6>

                                    <form method="get" id="form1" className="digit-group" data-group-name="digits" data-autosubmit="false" autoComplete="off">
                                        <div className="input-container otp">

                                            <input className="input" type="text" maxLength={1} ref={textInput1} onKeyUp={inputHandel} value={value1} onChange={(e) => setValue1(e.target.value)} />
                                            <input className="input" type="text" maxLength={1} ref={textInput2} onKeyUp={inputHandel2} value={value2} onChange={(e) => setValue2(e.target.value)} />
                                            <input className="input" type="text" maxLength={1} ref={textInput3} onKeyUp={inputHandel3} value={value3} onChange={(e) => setValue3(e.target.value)} />
                                            <input className="input" type="text" maxLength={1} ref={textInput4} value={value4} onChange={(e) => setValue4(e.target.value)} />

                                        </div>
                                        <div class="input-container ic2">
                                            <div class="incorr_otp">
                                                {otpError ? <p><span class="incorr-pass">Incorrect OTP</span></p> : <p></p>}
                                            </div>
                                        </div>


                                        <div className="forgt_dv resentotp">
                                            {
                                                minutes == "00" && seconds == "00" ? <p><span style={{ cursor: "pointer", color: "#428FEC" }} className="resendOtpBtn" onClick={otpSent}>Resend OTP</span> in <strong>{minutes}:{seconds}</strong></p> : <p>Resend OTP  in <strong>{minutes}:{seconds}</strong></p>
                                            }
                                        </div>

                                        <button
                                            type='button'
                                            id="button_id"
                                            className="submit"
                                            disabled={!value1 || !value2 || !value3 || !value4}
                                            onClick={onSubmit}
                                        >
                                            Submit
                                        </button>

                                    </form>
                                </>
                            }
                        </div>
                        <div class="btm_sc">
                            <p>By Logging in you agree to our<br /> 
                            {/* <TermsAndConditions /> and  */}
                            <PrivacyPolicy data={policyData}/></p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Login_Page_Question;