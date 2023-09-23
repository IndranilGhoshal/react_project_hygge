import React, { useEffect, useState } from "react";
import { IMAGE_NAME } from "../../../constant/images";

function Congratulations_mind(props) {
    const [isLoad, setIsLoad] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoad(false)
        }, 2000)
    }, [])

    function onContinue() {
        props.onContinueclick();
    }
    return (<>
        <div class={isLoad ? "wrapper mymindcong" : "wrapper mymindcong mymindcongbg back_ani"} >


            <div class="main">

                {/* <!--Container Main start--> */}
                <main class="content">
                    <div class="container-fluid p-0">
                        <div class="cong_div_sec">
                            <div class="cong_head">
                                <h3>My Mind</h3>
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
                                    <p>Your health score for my mind is assessed.<br />
                                        Please continue with the assessment </p>
                                </>
                                }
                            </div>
                            <div class="cong_btm_img">
                                <img src={IMAGE_NAME.MY_MIND_CONG_IMG} />
                            
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

export default Congratulations_mind;