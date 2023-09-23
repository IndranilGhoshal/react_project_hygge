import React from "react";
import { IMAGE_NAME } from "../../../constant/images";

function Informative_screen_two(props) {

    function goToNext() {
        props.goToMain()
    }

    function showScreenOne() {
        props.backToPrev()
    }

    return (
        <>
            <div className="hra_pop_div">
                <div className="hra_pop_div_in">
                    <div className="mnu_hmb"><img src={IMAGE_NAME.MNU_HV} /></div>
                    <div className="indicator_div_pop pop_secnd">
                        <strong>Change through modules at any time</strong>
                        <p>Navigate through any modules from here or complete it in the given order.</p>
                        <div className="got_div_btn">
                            <span>2/2</span>
                            <button className="btn nobg-btn-txt" onClick={()=>showScreenOne()}>Back</button>
                            <button className="btn nobg-btn" onClick={()=>goToNext()}>Got it</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Informative_screen_two;