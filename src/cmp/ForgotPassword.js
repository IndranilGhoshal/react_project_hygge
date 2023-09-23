import React, {useEffect} from 'react'
import {GetEncrypt, setOtpUserData, showLoader, hideLoader} from '../service/Common'
import { useNavigate } from "react-router-dom";
import TermsAndConditions from './Modal/TermsAndConditions';
import PrivacyPolicy from './Modal/PrivacyPolicy';
import {userForgotPassword} from '../service/Services';
const loginImage = require('../assets/images/login-image.png');
const loginLogo = require('../assets/images/login-logo.png');


function ForgotPassword() {


////------------------variable------------------/////
let navigate = useNavigate();
const [userName, setuserName] = React.useState("")
const [loginError, setloginError] = React.useState("")


/////----------------function------------------//////

useEffect(()=>{

    showLoader()

    setTimeout(() => {

        hideLoader()
        
    }, 1000);

}, [])


function onSubmit(){
    setloginError("")
    let data = {
        userEmail: userName
    }
    showLoader()
    userForgotPassword(data).then(result => {
        hideLoader()
        if (result.data.success) {
        setOtpUserData(result.data)
        let path = `/EnterOtp`;
        navigate(path);
        } else {
            setloginError(result.data.message)
            setuserName("")
        }
    })

}


  return (
    <div>
        <div className="wrapper ">
        <div className="main_div">
            <div className="logn_dv_in_lf"><img src={loginImage} /></div>
            <div className="logn_dv_in">
                <div className="logn_dv_in_lft">
                    
                <div className="logn_dv_in_lf_wel_img">
                <img src={loginLogo} />
                </div>
                
                    <h2>Forgot password?</h2>
                    <h6>Enter your registered Email Address</h6>
                    <form id="form1">
                        <div className={`input-container hasinpt ic1 ${loginError ? "error-field" : ""}  `}>
                            <input 
                            id="Username" 
                            className="inputText" 
                            type="text" 
                            placeholder=""
                            value={userName}
                            onChange={(e) => setuserName(e.target.value)} 
                            required/>
                            <span className="floating-label">Username</span>
                        </div>
                        <div className="input-container ic2 second-example">
                            
                        </div>
                        

                        <div className="forgt_dv">
                        <p><span className="incorr-pass">{loginError}</span></p>
                        </div>

                        <button 
                        type='button' 
                        id="button_id" 
                        className="submit"
                        disabled={!userName}
                        onClick={onSubmit}
                        >
                        Submit
                        </button>
                        
                    </form>
                </div>
                <div className="btm_sc">
                    <p>By Logging in you agree to our
                        <br /> 
                        {/* <TermsAndConditions /> and  */}
                        <PrivacyPolicy /></p>
                </div>
            </div>




        </div>

    </div>
    </div>
  )
}

export default ForgotPassword