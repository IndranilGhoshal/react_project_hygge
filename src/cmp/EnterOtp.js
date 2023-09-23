import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import TermsAndConditions from './Modal/TermsAndConditions';
import PrivacyPolicy from './Modal/PrivacyPolicy';
import { GetEncrypt, getOtpUserData, setOtpUserData, showLoader, hideLoader } from '../service/Common'
import { sentOtp, userForgotPassword } from '../service/Services';
const loginImage = require('../assets/images/login-image.png');
const loginLogo = require('../assets/images/login-logo.png');




function EnterOtp() {

  // We need ref in this, because we are dealing
  // with JS setInterval to keep track of it and
  // stop it when needed
  const Ref = useRef(null);

  // The state for our timer
  const [timer, setTimer] = useState('00:00');

  //////-------------variable----------------///////
  let navigate = useNavigate();
  const textInput1 = useRef('');
  const textInput2 = useRef('');
  const textInput3 = useRef('');
  const textInput4 = useRef('');
  const [value1, setValue1] = React.useState("")
  const [value2, setValue2] = React.useState("")
  const [value3, setValue3] = React.useState("")
  const [value4, setValue4] = React.useState("")
  const [otpError, setotpError] = React.useState("")

  // let delayResend = "120"
  // const [delay, setDelay] = React.useState(+delayResend);
  // const [minutes, setMinutes] = React.useState('02');
  // const [seconds, setSeconds] = React.useState('00');

  // const [isPending, startTransition] = React.useTransition();


  //////------------function-----------------///////

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    // const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total, minutes, seconds
    };
  }

  const startTimer = (e) => {
    let { total, minutes, seconds }
      = getTimeRemaining(e);
    if (total >= 0) {

      // update the timer
      // check if less than 10 then we need to 
      // add '0' at the beginning of the variable
      setTimer(
        (minutes > 9 ? minutes : '0' + minutes) + ':'
        + (seconds > 9 ? seconds : '0' + seconds)
      )
    }
  }


  const clearTimer = (e) => {

    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next    
    setTimer('02:00');

    // If you try to remove this line the 
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000)
    Ref.current = id;
  }

  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if 
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + 120);
    return deadline;
  }

  // We can use useEffect so that when the component
  // mount the timer will start as soon as possible

  // We put empty array to act as componentDid
  // mount only


  useEffect(() => {
    showLoader()
    if (!getOtpUserData().response) {
      let path = `/ForgotPassword`;
      navigate(path);
    } else {

    setTimeout(() => {
      hideLoader()
    }, 1000);
    clearTimer(getDeadTime());
    // const timer = setInterval(() => {
    //   startTransition(() => {
    //     setDelay(delay - 1);
    //     console.log("delay", delay)
    //     let min = Math.floor(delay / 60);
    //     min = min < 10 ? '0' + min : min;
    //     setMinutes(min);
    //     console.log("min", min)
    //     let sec = Math.floor(delay % 60);
    //     sec = sec < 10 ? '0' + sec : sec;
    //     setSeconds(sec);
    //     console.log("sec", sec)
    //   });
    // }, 1000);




    // if (delay === 0) {
    //   clearInterval(timer);
    //   setMinutes('00');
    //   setSeconds('00');
    // }
    // return () => {
    //   clearInterval(timer);
    // };
    }
  }, []);


  const onSubmit = () => {
    var data = {
      "userId": getOtpUserData().response.userId,
      "organisationId": getOtpUserData().response.organisationId,
      "otp": value1 + value2 + value3 + value4
    }

    // delayResend
    showLoader()
    sentOtp(data).then(result => {
      hideLoader()
      if (result.data.success) {
        setOtpUserData(data)
        let path = `/CreateNewPassword`;
        navigate(path);
      } else {
        setotpError("Oops! wrong OTP")
        setValue1("")
        setValue2("")
        setValue3("")
        setValue4("")
        // setDelay(delayResend);
        // setMinutes(2);
        // setSeconds(0);
      }
    })
  }

  const goToForgotPass = () => {
    let path = `/ForgotPassword`;
    navigate(path);
  }

  const otpSent = () => {

    var data = {
      "userEmail": getOtpUserData().response.useremail
    }

    showLoader()
    userForgotPassword(data).then(result => {
      hideLoader()
      if (result.data.success) {
        setValue1("")
        setValue2("")
        setValue3("")
        setValue4("")
        clearTimer(getDeadTime());
        // setDelay(delayResend);
        // setMinutes('02');
        // setSeconds('00');
      }
    })

  }

  const inputInvalidChars = ['-', '+', 'e', '.', ' '];

  return (
    <div>
      <div className="wrapper ">
        <div className="main_div">
          <div className="logn_dv_in_lf"><img src={loginImage} /></div>
          <div className="logn_dv_in">
            <div className="logn_dv_in_lft">
              <button className='back_icn' onClick={goToForgotPass}><i className="bi bi-chevron-left"></i></button>
              <div className="logn_dv_in_lf_wel_img">
              <img src={loginLogo} />
              </div>
              {
                otpError ? <h2><span className="wrong_otp">Oops! wrong OTP</span></h2> : <h2>Enter OTP</h2>
              }

              {
                otpError ? <h6>&nbsp;</h6> : <h6>Enter your OTP sent to your e-mail<span>{getOtpUserData().response ? getOtpUserData().response.useremail : null}</span></h6>
              }

              <form method="get" id="form1" className="digit-group" data-group-name="digits" data-autosubmit="false" autoComplete="off">
                <div className="input-container otp">

                  <input
                    className="input"
                    type="text"
                    maxLength={1}
                    ref={textInput1}
                    // onKeyUp={inputHandel} 
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                    onKeyDown={(e) => {
                      if (inputInvalidChars.includes(e.key)) {
                        e.preventDefault();
                      }

                      setTimeout(() => {
                        if (!inputInvalidChars.includes(e.key)) {
                          textInput2.current.focus();
                        }
                      }, 100);
                    }}
                  />

                  <input
                    className="input"
                    type="text"
                    maxLength={1}
                    ref={textInput2}
                    // onKeyUp={inputHandel2} 
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    onKeyDown={(e) => {
                      if (inputInvalidChars.includes(e.key)) {
                        e.preventDefault();
                      }
                      setTimeout(() => {
                        if (!inputInvalidChars.includes(e.key)) {
                          textInput3.current.focus();
                        }
                      }, 100);
                    }}

                  />

                  <input
                    className="input"
                    type="text"
                    maxLength={1}
                    ref={textInput3}
                    // onKeyUp={inputHandel3} 
                    value={value3}
                    onChange={(e) => setValue3(e.target.value)}
                    onKeyDown={(e) => {
                      if (inputInvalidChars.includes(e.key)) {
                        e.preventDefault();
                      }
                      setTimeout(() => {
                        if (!inputInvalidChars.includes(e.key)) {
                          textInput4.current.focus();
                        }
                      }, 100);
                    }}

                  />

                  <input
                    className="input"
                    type="text"
                    maxLength={1}
                    ref={textInput4}
                    value={value4}
                    onChange={(e) => setValue4(e.target.value)}
                    onKeyDown={(e) => {
                      if (inputInvalidChars.includes(e.key)) {
                        e.preventDefault();
                      }
                      // else{
                      //   inputHandel(e.target.value)
                      // }
                    }}

                  />

                </div>
                <div className="input-container ic2">
                  <div className="incorr_otp"><p><span className="incorr-pass"></span></p></div>
                </div>


                <div className="forgt_dv resentotp">
                  {/* <p><span style={{cursor:"pointer"}} className="resendOtpBtn" onClick={otpSent}>Resend OTP</span></p> */}

                  {
                    // minutes == "00" && seconds == "00" ? <p><span style={{ cursor: "pointer", color: "#428FEC" }} className="resendOtpBtn" onClick={otpSent}>Resend OTP</span> in <strong>{minutes}:{seconds}</strong></p> : <p>Resend OTP  in <strong>{minutes}:{seconds}</strong></p>
                  }
                  {
                    timer=='00:00'? 
                    <p><span style={{ cursor: "pointer", color: "#428FEC" }} className="resendOtpBtn" onClick={otpSent}>Resend OTP</span> in <strong>{timer}</strong></p>
                    :
                    <p>Resend OTP  in <strong>{timer}</strong></p>
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

export default EnterOtp