import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getData } from '../service/Common'
import { userEvent, userLogin } from '../service/Services';
import TermsAndConditions from './Modal/TermsAndConditions';
import PrivacyPolicy from './Modal/PrivacyPolicy';
import { IMAGE_URL_ASSETS } from '../config/app_url';
import { showLoader } from '../service/Common';
import { hideLoader } from '../service/Common';
const loginImage = require('../assets/images/login-image.png');
const loginLogo = require('../assets/images/login-logo.png');
const loader = require('../assets/images/loader.gif');

const Login = () => {

    ////-------------------variables-------------------------///    
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
    var imgUrlAsset = IMAGE_URL_ASSETS;

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
        setLoading((prevLoading) => !prevLoading);
        setloginError("")
        let data = {
            "userName": getData().username,
            "password": passWord
        }
        console.log(data)
        showLoader()
        userLogin(data).then(result => {
            hideLoader()
            setLoading((prevLoading) => !prevLoading);
            if (result.data.success) {
                // localStorage.setItem("user", JSON.stringify(result.data));
                sessionStorage.setItem("user", JSON.stringify(result.data));

                console.log("result.data",result.data);
                navigate("/users/dashboard")
                userEvent("login")
            } else {
                if (result.data.status === 1008) {
                    navigate("/Sorry/" + result.data.response.userId)
                } else {
                    setloginError(result.data.message)
                    setuserName("")
                    setpassWord("")
                    seteyeValues("")
                }


            }


        })

    }


    const [policyData, setPolicyData]= useState('')



    useEffect(() => {
        if (!getData().response) {
            let path = `/`;
            navigate(path);
        }
        if (getData().response && getData().response.policy) {
            setPolicyData(getData().response.policy.policydesc)
        }
        
    }, [])

    const numberInputInvalidChars = [' '];


    return (
        <>
            <div className="wrapper ">
                <div className="main_div">
                    <div className="logn_dv_in_lf">{getData().response?<img src={imgUrlAsset + getData().response.imageUrl} />:null }</div>

                    <div className="logn_dv_in">
                        <div className="logn_dv_in_lft">
                        <div className='login_logo_img'><img src={loginLogo} /></div>
                            <h2>Password</h2>
                            <h5>Welcome {getData().response?getData().response.orgDetails[0].full_name:null}</h5>
                            <form id="form1" >
                                {/* <div className={`input-container hasinpt ic1 ${loginError ? "error-field" : ""}  `}>
                                    <input id="Username"
                                        className="inputText"
                                        type="text"
                                        placeholder=""
                                        value={userName}
                                        onChange={(e) => setuserName(e.target.value)}
                                        ref={textInputUserName}
                                        required />

                                    <span className="floating-label">Username</span>
                                </div> */}
                                <div className={`input-container hasinpt ic2 second-example ${loginError ? "error-field" : ""}`}>
                                    <input 
                                    // id="txtPassword"
                                    autoComplete='off'
                                        className="inputText"
                                        type={values.showPassword ? "text" : "password"}
                                        placeholder=""
                                        name="password"
                                        onKeyUp={eyeHide}
                                        value={passWord}
                                        onChange={(e) => setpassWord(e.target.value)}
                                        ref={textInputPassword}
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
                                    <span className="floating-label">Password</span>
                                    {

                                        eyeValues.showEye ? 
                                            values.showPassword ?  
                                                <span onClick={handleClickShowPassword} className="fa fa-fw fa-eye field-icon toggle-password"></span> 
                                                : 
                                                <span onClick={handleClickShowPassword} className="fa fa-fw field-icon toggle-password fa-eye-slash"></span>
                                         : null

                                    }

                                </div>


                                <div className="forgt_dv">
                                    <button type="button" onClick={routeChange}>Forgot Password?</button>
                                    <p><span className="incorr-pass text-left">{loginError}</span></p>
                                </div>

                                <button
                                    type="button"
                                    className="submit"
                                    disabled={!passWord}
                                    onClick={loginFun}
                                >
                                    {loading ? <div className="btn-loader"><img src={loader} /></div> : 'Login'}
                                </button>




                            </form>
                        </div>
                        <div className="btm_sc">
                            <p>By Logging in you agree to our<br /> 
                            {/* <TermsAndConditions /> and  */}
                            <PrivacyPolicy data={policyData} /></p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Login

