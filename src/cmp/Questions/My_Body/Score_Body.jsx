import React, { useEffect } from "react";
import { IMAGE_NAME } from "../../../constant/images";

function Score_Body(props) {

    useEffect(() => {
        console.log("Score Body");
    }, []);

    setTimeout(() => {
        props.onContinueClick();
    }, 30000);

    return (
        <>
            <div class="wrapper congratpge">


                <div class="main">
                    <main class="content-congramybody">
                        <div class="container-fluid p-0">
                            <div class="congratuln_dv">
                                <div class="congratuln_dv_lf">
                                    <h3>My Body</h3>
                                    <p>&nbsp;</p>
                                    <p>&nbsp;</p>
                                    <img src={IMAGE_NAME.QST_BODY_3} />
                                </div>
                                <div class="congratuln_dv_rit">
                                    <div class="cong_div_sec">
                                        <div class="cong_head">
                                            <p>&nbsp;</p>
                                            <strong>Congratulations</strong>
                                            <p>You have completed My Body Assesment</p>
                                        </div>
                                        <div class="cong_chart">
                                            <strong>{props.score}%</strong>
                                            <img src={IMAGE_NAME.BODY_SCAN_IMAGE_1} />
                                        </div>


                                        <p>&nbsp;</p>
                                        <p>&nbsp;</p>
                                        <p>&nbsp;</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </main>
                </div>

            </div>
        </>
    )
}

export default Score_Body;