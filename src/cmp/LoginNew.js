import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { GetEncrypt } from '../service/Common'
import { userEvent, userLogin, proceedToLogin, getPrivacyPolicy } from '../service/Services';
import TermsAndConditions from './Modal/TermsAndConditions';
import PrivacyPolicy from './Modal/PrivacyPolicy';
import { setData } from '../service/Common';
import { showLoader } from '../service/Common';
import { hideLoader } from '../service/Common';

const loginImage = require('../assets/images/login-image.png');
const loginLogo = require('../assets/images/login-logo.png');
const loader = require('../assets/images/loader.gif');



const LoginNew = () => {

    ////-------------------variables-------------------------///    

    //Mail Format Regex//
    var mailformat = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$";

    const [validEmailError, setValidEmailError] = React.useState(false)


    let navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [userName, setuserName] = React.useState("")
    const [passWord, setpassWord] = React.useState("")
    const [loginError, setloginError] = React.useState("")
    const [values, setValues] = React.useState({
        password: "",
        showPassword: false,
    });
    const [eyeValues, seteyeValues] = React.useState({
        showEye: false,
    });
    const textInputUserName = useRef(null);
    const textInputPassword = useRef(null);


    /////-------------------functions----------------------/////
    const routeChange = () => {
        let path = `/ForgotPassword`;
        navigate(path);
    }
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const eyeHide = () => {

        if (passWord) {
            seteyeValues({ ...eyeValues, showEye: !values.showEye });
        } else {
            seteyeValues({ ...eyeValues, showEye: false });
        }

    };

    const loginFun = () => {
        setValidEmailError(false)
        setloginError("")
        var err = 0

        if (!userName.match(mailformat)) {
            setValidEmailError(true)
            err++
        }

        let data = {
            "userName": userName,
        }


        if (err == 0) {
            setLoading((prevLoading) => !prevLoading);
            showLoader()
            proceedToLogin(data).then(result => {
                hideLoader()
                setLoading((prevLoading) => !prevLoading);
                if (result.data.success) {
                    var data1 = {
                        "response": result.data.response,
                        "username": userName
                    }
                    setData(data1)
                    navigate("/Login")
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


    const [policyData, setPolicyData]= useState('')


    const getPrivacyPolicyFun = () =>{
        var data ={

        }
        getPrivacyPolicy(data).then(result=>{
            if(result.data.success){
                setPolicyData(result.data.response.policydesc)
            }
        })
    }


    // useEffect(()=>{
    //     if(policyData){
    //         // console.log(policyData)
    //     }
    // },[policyData])

    




    useEffect(() => {
        // if (localStorage.getItem('user')) {
        if (sessionStorage.getItem('user')) {
            navigate("/users/dashboard")
        }
            
            setTimeout(() => {
                getPrivacyPolicyFun()
                hideLoader()
            }, 1000);
        

        
    }, [])


    const numberInputInvalidChars = [' '];



    return (
        <>
            <div className="wrapper ">
                <div className="main_div">
                    <div className="logn_dv_in_lf"><img src={loginImage} /></div>

                    <div className="logn_dv_in_new">
                        <div className="logn_dv_in_lft">
                        <div className='login_logo_img'><img src={loginLogo} /></div>
                            <h2>Login</h2>
                            <h5>Welcome to Hygge Lite</h5>
                            <form id="form1" >
                                <div className={`input-container hasinpt ic1 ${loginError || validEmailError ? "error-field" : ""}  `}>
                                    <input
                                        id="Username"
                                        className="inputText"
                                        type="text"
                                        placeholder=""
                                        value={userName}
                                        onChange={(e) => setuserName(e.target.value)}
                                        ref={textInputUserName}
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

                                    <span className="floating-label">Username</span>
                                </div>

                                <div className="forgt_dv mt-2">
                                    {
                                        loginError?<p><span className="incorr-pass">{loginError}</span></p>:null
                                    }
                                    
                                    {
                                        validEmailError ? <><p><span className="incorr-pass">Enter valid email id</span></p></> : null
                                    }

                                    <button type="button" onClick={routeChange}>Forgot Password?</button>
                                </div>

                                <button
                                    type="button"
                                    className="submit"
                                    disabled={!userName}
                                    onClick={loginFun}
                                >
                                    {loading ? <div className="btn-loader"><img src={loader} /></div> : 'Proceed'}
                                </button>

                                <p>&nbsp;&nbsp;</p>

                            </form>
                        </div>
                        <div className="btm_sc">
                            <p>By Logging in you agree to our
                                <br /> 
                                {/* <TermsAndConditions /> and  */}
                                <PrivacyPolicy data={policyData}/></p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default LoginNew

