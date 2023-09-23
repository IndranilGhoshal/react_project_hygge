import React, { useEffect, useState } from "react";
import { IMAGE_NAME } from "../../../constant/images";
import { hideLoader } from "../../../service/Common";

function Congratulations_body(props) {
    const [isLoad, setIsLoad] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoad(false)
            // hideLoader()
        }, 2000)
    }, []);

    function onContinue() {
        props.onContinueclick();
        setIsLoad(true);
    }

    return (<>
        <div class={isLoad ? "wrapper mybodycong" : "wrapper mybodycong mybodycongbg back_ani"}>


            <div class="main">

                {/* <!--Container Main start--> */}
                <main class="content">
                    <div class="container-fluid p-0">
                        <div class="cong_div_sec">
                            <div class="cong_head">
                                <h3>My Body</h3>
                                <strong>Congratulations</strong>
                            </div>
                            <div class="cong_mid">
                                {isLoad ? <>
                                    <div class="spinner">
                                        <div class="spinner__circle">
                                            <div class="spinner__circle-gradient"></div>

                                            <div class="spinner__circle-inner"></div>
                                        </div>
                                    </div>
                                    <p>Analysing your responses</p>
                                </> : <>
                                    <strong>You are Doing well!</strong>
                                    <p>Your health score for my body is assessed.<br />
                                        Please continue with the assessment </p>
                                </>
                                }
                            </div>
                            <div class="cong_btm_img">
                                <img src={IMAGE_NAME.MY_BODY_CONG_IMG} />
                            
                            {!isLoad ?
                                <button class="btn btn-primary btn-lg" onClick={onContinue}>Continue</button>
                                : <></>
                            }
                        </div>
                        </div>
                    </div>
                </main>
                {/* <!--Container Main end--> */}
            </div>

        </div>

    </>)
}

export default Congratulations_body;