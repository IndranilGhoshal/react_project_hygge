import React from "react";
import { IMAGE_NAME } from "../../../constant/images";

function Informative_screen_one(props) {
    function showSecond(){
        props.showScreenTwo();
    }
    return (
        <>
            <div className="hra_pop_div">
                <div className="hra_pop_div_in">
                    <div className="has-mnu">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="mybody-tab" data-bs-toggle="tab" data-bs-target="#mybodyt"
                                    type="button" role="tab" aria-controls="mybodyt" aria-selected="true">
                                    <img src={IMAGE_NAME.HRA_QST_NAV_ICON_1} /> My Body</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="mylifestyle-tab" data-bs-toggle="tab"
                                    data-bs-target="#mylifestylet" type="button" role="tab" aria-controls="mylifestylet"
                                    aria-selected="false" tabIndex="-1"><img src={IMAGE_NAME.HRA_QST_NAV_ICON_2} /> My
                                    Lifestyle</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="mymind-tab" data-bs-toggle="tab" data-bs-target="#mymindt"
                                    type="button" role="tab" aria-controls="mymindt" aria-selected="false" tabIndex="-1">
                                    <img src={IMAGE_NAME.HRA_QST_NAV_ICON_3} /> My Mind</button>
                            </li>
                        </ul>
                    </div>
                    <div className="indicator_div_pop">
                        <strong>Change through modules at any time</strong>
                        <p>Navigate through any modules from here or complete it in the given order.</p>
                        <div className="got_div_btn">
                            <span>1/2</span>
                            <button className="btn nobg-btn" onClick={()=>showSecond()}>Got it</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Informative_screen_one;