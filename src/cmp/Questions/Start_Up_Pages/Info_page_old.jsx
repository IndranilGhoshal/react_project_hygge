import React from "react";
import { IMAGE_NAME } from "../../../constant/images";

function Info_pages(props) {

    function showQuestion() {
        props.onShow();
    }

    return (<>
        <div className="wrapper health-risk-cong">
            <div className="main">
                <main className="content">
                    <div className="container-fluid p-0">
                        <div className="cong_div_sec">
                            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="true">
                                <div className="carousel-indicators">
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
                                        className="active" aria-current="true" aria-label="Slide 1"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                                        aria-label="Slide 2"></button>
                                </div>
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <div className="cong_head">
                                            <p>&nbsp;</p> <strong>What is a Health Risk Assessment?</strong>
                                        </div>
                                        <div className="cong_btm_img">
                                            <img src={IMAGE_NAME.HRA_QST_BODY_7} />
                                        </div>
                                        <div className="risk_below">
                                            <p>Health Risk Assesment paves the way for you to choose a healthy way of life
                                            </p>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <div className="cong_div_sec">
                                            <div className="cong_head">
                                                <p>&nbsp;</p> <strong>Benifits of taking a Health Risk Assesment</strong>
                                            </div>
                                            <div className="cong_btm_img caro_im">
                                                <div className="caro_im_in">
                                                    <img src={IMAGE_NAME.BENEFIT_IMAGE_1} />
                                                    <p>Get a detailed analysis of your current health status.</p>
                                                </div>
                                                <div className="caro_im_in">
                                                    <img src={IMAGE_NAME.BENEFIT_IMAGE_2} />
                                                    <p>Self-awareness a powerful motivation for adopting healthy lifestyle
                                                        choices.</p>
                                                </div>
                                                <div className="caro_im_in">
                                                    <img src={IMAGE_NAME.BENEFIT_IMAGE_3} />
                                                    <p>Reflect on the unhealthy behaviours that may be a part of your
                                                        lifestyle</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                                <button className="btn btn-primary btn-lg" onClick={() => showQuestion()}>Continue</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </>)
}

export default Info_pages;