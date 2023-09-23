
import React, { useEffect } from 'react'
import { GetEncrypt, getOtpUserData, showLoader, hideLoader } from '../service/Common'
import { createPassword } from '../service/Services';
import { useNavigate } from "react-router-dom";
import TermsAndConditions from './Modal/TermsAndConditions';
import PrivacyPolicy from './Modal/PrivacyPolicy';
import { PAYLOAD_ENCRYCT } from '../config/app_url';
const loginImage = require('../assets/images/login-image.png');
const loginLogo = require('../assets/images/login-logo.png');

function CreateNewPassword() {


    var strongRegex = new RegExp("^(?=.{14,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])([a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]{6,})$");
    var veryStrongRegex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])([a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]{8,})$");

    //////-------------variable---------------//////
    let navigate = useNavigate();
    const [passWord, setpassWord] = React.useState("")
    const [passWordConf, setpassWordConf] = React.useState("")
    const [passMatchError, setPassMatchError] = React.useState("")
    const [values, setValues] = React.useState({
        password: "",
        showPassword: false,
    });
    const [valuesConf, setValuesConf] = React.useState({
        password: "",
        showPassword: false,
    });
    const [eyeValues, seteyeValues] = React.useState({
        showEye: false,
    });
    const [eyeValuesConf, seteyeValuesConf] = React.useState({
        showEye: false,
    });

    //////-------------function---------------////////

    useEffect(() => {

        // showLoader()

        setTimeout(() => {

            hideLoader()

        }, 1000);


        if (!getOtpUserData().userId) {
            let path = `/ForgotPassword`;
            navigate(path);
        }
    });

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const eyeHide = () => {
        seteyeValues({ ...eyeValues, showEye: !values.showEye });
    };

    const handleClickShowPasswordConf = () => {
        setValuesConf({ ...valuesConf, showPassword: !valuesConf.showPassword });
    };

    const eyeHideConf = () => {
        seteyeValuesConf({ ...eyeValuesConf, showEye: !valuesConf.showEye });
    };

    function passwordChanged() {
        document.getElementById("strong").style.backgroundColor = "";
        document.getElementById("normal").style.backgroundColor = "";
        document.getElementById("week").style.backgroundColor = "";
        var pwd = document.getElementById("password");

        if (pwd.value) {
            if (veryStrongRegex.test(pwd.value)) {
                document.getElementById("strong").style.backgroundColor = "green";
            }

            if (mediumRegex.test(pwd.value)) {
                document.getElementById("normal").style.backgroundColor = "orange";
            }
            if (pwd.value.length > 0) {
                document.getElementById("week").style.backgroundColor = "red";
            }
        }
    }

    function checkPass() {
        if (passWord != passWordConf) {
            setPassMatchError("Password does not match")
        } else {
            setPassMatchError("")
        }
    }

    const onSubmit = () => {
        setPassMatchError("");
        if (PAYLOAD_ENCRYCT) {
            if (!veryStrongRegex.test(passWord)) {
                setPassMatchError("At least 8 characters, with uppercase and lowercase case, a number, and a special character");
                return false;
            }
        }
        if (passWord != passWordConf) {
            setPassMatchError("Password does not match")
            return false
        } else {
            setPassMatchError("")
        }
        var data = {
            "userId": getOtpUserData().userId,
            "organisationId": getOtpUserData().organisationId,
            "password": passWord
        }
        showLoader()
        createPassword(data).then(result => {
            // console.log("Password create response:", result)
            hideLoader()
            if (result.data.success) {
                let path = `/`;
                navigate(path);
            } else {
                setPassMatchError(result.data.message)
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

                            <h2>Create New Password</h2>

                            <form id="form1">
                                <div className="input-container hasinpt ic1 second-example">
                                    <input
                                        id="password"
                                        className="inputText"
                                        type={values.showPassword ? "text" : "password"}
                                        placeholder=""
                                        name="password"
                                        onKeyUp={() => { eyeHide(); passwordChanged(); }}
                                        value={passWord}
                                        onChange={(e) => setpassWord(e.target.value)}
                                        required
                                    />


                                    <span class="floating-label">Add New Password</span>
                                    {

                                        eyeValues.showEye ? values.showPassword ? <span onClick={handleClickShowPassword} className="fa fa-fw fa-eye field-icon toggle-password"></span> : <span onClick={handleClickShowPassword} className="fa fa-fw field-icon toggle-password fa-eye-slash"></span> : null

                                    }

                                </div>

                                <div className="pass_mat">
                                    <p id="pass_text">At least 8 characters, with uppercase and lowercase case, a number, and a special
                                        character</p>
                                    {
                                        passWord ?  <ul style={{ paddingLeft: '0' }}>
                                        <li id="week">&nbsp;</li>
                                        <li id="normal">&nbsp;</li>
                                        <li id="strong">&nbsp;</li>
                                    </ul> : null
                                    }

                                   
                                </div>





                                <div className="input-container hasinpt ic2 second-example">
                                    <input
                                        id="password1"
                                        className="inputText"
                                        type={valuesConf.showPassword ? "text" : "password"}
                                        placeholder=""
                                        name="password"
                                        onKeyUp={() => { eyeHideConf(); checkPass(); }}
                                        value={passWordConf}
                                        onChange={(e) => { setpassWordConf(e.target.value); }}
                                        required />

                                    <span class="floating-label">Confirm Password</span>
                                    {

                                        eyeValuesConf.showEye ? valuesConf.showPassword ? <span onClick={handleClickShowPasswordConf} className="fa fa-fw fa-eye field-icon toggle-password"></span> : <span onClick={handleClickShowPasswordConf} className="fa fa-fw field-icon toggle-password fa-eye-slash"></span> : null

                                    }


                                </div>

                                <div className="new_pass">
                                    <p><span className="incorr-pass">{passMatchError}</span></p>
                                </div>


                                <button
                                    type="button"
                                    id="button_id"
                                    className="submit"
                                    disabled={!passWord || !passWordConf}
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

export default CreateNewPassword