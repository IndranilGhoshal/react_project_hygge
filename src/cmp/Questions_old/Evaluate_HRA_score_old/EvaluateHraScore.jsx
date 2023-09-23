import React, { useEffect, useState } from "react";
import { getUserData, hideLoader } from "../../../service/Common";
import { getAllQuestionData } from "../../../service/questionService";

import MyBodyPage from "./MyBodyPage";
import MyLifestylePage from "./MyLifestylePage";
import MyMindPage from "./MyMindPage";

function EvaluateHraScore(props) {
    const [sessionId, setSessionId] = useState("");
    const [totalScore, setTotalScore] = useState(0);
    const [myBody, setMyBody] = useState([]);
    const [myLifestyle, setMyLifestyle] = useState([]);
    const [myMind, setMyMind] = useState([]);


    useEffect(() => {
        setSessionId("HYG" + Date.now());
        hideLoader();
        let authData = getUserData();
        // console.log("AuthData", authData);
        getQuestionData();
    }, []);

    function getQuestionData() {
        let data = {};

        getAllQuestionData(data).then(res => {
            // console.log("All Question Data >>> ", res.data.response.data["My Body"]);
            setMyBody(questionReArrange(res.data.response.data["My Body"]));
            setMyLifestyle(questionReArrange(res.data.response.data["My Lifestyle"]));
            setMyMind(questionReArrange(res.data.response.data["My Mind"]));
        });

    }

    function questionReArrange(arr) {
        let temp = [];

        arr.map((data) => {

            if (data.question_id == 14) {
                for (let i = 0; i < data.options.length; i++) {
                    if (data.options[i].option_id === 55) {
                        data.options[i].special_condition = 0;
                        break;
                    }
                }
            }



            let opArr = [];
            data.options.map((op) => {

                op['selected'] = false;
                op['isDisabled'] = false;
                opArr.push(op);
            });

            // opArr.map((op) => {
            //     if (data.selected !== null) {
            //         let str = data.selected.toString();
            //         if (str.indexOf(",") > 0) {
            //             let selectArr = data.selected.split(",");
            //             // console.log("SelecteAtt >> ", selectArr)
            //             selectArr.map((ss) => {
            //                 // console.log(ss)
            //                 if (op.option_id == ss) {
            //                     op.selected = true;
            //                 }
            //             })
            //         } else {
            //             if (op.option_id == data.selected) {
            //                 op.selected = true
            //             }
            //         }
            //     }
            // })
            data.options = opArr;
            data["answerdesc"] = "";
            data['selected'] = "";
            data["score"] = 0;
            data["isView"] = true;
            if (data.havechild == 1) {
                data.child.map((ch) => {
                    ch['selected'] = "";
                    ch['score'] = 0;
                    ch['isView'] = false;
                })
            }
            temp.push(data);
        })
        // console.log("AllQuestion Data after reaarange >>> ", temp)
        return temp;
    }

    function updateBodyArr(arr) {
        // console.log("AAAA", arr)
        setMyBody(arr);
    }


    return (
        <>
            <div className="main">
                <div className="content">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="container-fluid p-0">
                                <div className="evalu_hra_scr">
                                    <div className="bg-white shadow_d p-4 rounded-3">
                                        <div className="evalu_hra_scr_in">
                                            <div className="evalu_hra_scr_in_l">
                                                <h2>Evaluate HRA Score</h2>
                                                <h4>{sessionId}</h4>
                                            </div>
                                            <div className="evalu_hra_scr_in_r">
                                                <div className="get_ttl_scr" >
                                                    <div className="get_ttl_scr_txt"><h3>Total Score<span>{totalScore}</span></h3>

                                                    </div></div>
                                                {/* <button class="btn btn-primary d-block" tabindex="0" type="button">Get Score</button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white shadow_d p-4 rounded-3 evalu_hra_scr_blo">
                        <div className="accordion" id="accordionExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick={()=>{window.scrollTo(0,0)}}>
                                        My Body
                                    </button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <MyBodyPage
                                            bodyArr={myBody}
                                            sessionId={sessionId}
                                            onUpArr={(arr) => updateBodyArr(arr)}
                                            getScore={(val) => setTotalScore(val)} />
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" onClick={()=>{window.scrollTo(0,0)}}>
                                        My Lifestyle
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <MyLifestylePage
                                            bodyArr={myLifestyle}
                                            sessionId={sessionId} 
                                            getScore={(val) => setTotalScore(val)} />
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingThree">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" onClick={()=>{window.scrollTo(0,0)}}>
                                        My Mind
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <MyMindPage bodyArr={myMind}
                                            sessionId={sessionId} 
                                            getScore={(val) => setTotalScore(val)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default EvaluateHraScore;