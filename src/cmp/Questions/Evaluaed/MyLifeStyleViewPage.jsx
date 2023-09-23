import React, { useEffect, useState } from "react";
import { IMAGE_URL_ASSETS } from "../../../config/app_url";

function MyLifestyleViewPage(props) {

    const [myBodyArr, setMyBodyArr] = useState([]);
    const [answerDesc, setAnswerDesc] = useState("");

    useEffect(() => {
        // setMyBodyArr(props.bodyArr);
        if (props.bodyArr.length > 0) {
            reArrangeMainArr(props.bodyArr);
        }
    }, [props.bodyArr]);

    function reArrangeMainArr(tempArr) {
        let arr = [];
        tempArr.map((data) => {
            arr.push(data);
            if (data.havechild == 1) {
                data.child.map((ch, i) => {
                    let opArr = ch.parentoptions.split(",");
                    let currOp = data.selected.toString();
                    if (currOp.indexOf(",") > 0) {
                        let temp = currOp.split(",");
                        for (let i = 0; i < temp.length; i++) {
                            if (opArr.includes(temp[i])) {
                                let counter = 0;
                                tempArr.map((tt) => {
                                    if (tt.question_id == ch.question_id) {
                                        counter++;
                                    }
                                });
                                if (counter == 0) {
                                    arr.push(ch)
                                }
                                break;
                            }
                        }
                    } else if (opArr.includes(currOp)) {
                        let counter = 0;
                        tempArr.map((tt) => {
                            if (tt.question_id == ch.question_id) {
                                counter++;
                            }
                        });
                        if (counter == 0) {
                            arr.push(ch)
                        }
                    } else {
                        let temp = tempArr;
                        temp.map((ar, a) => {
                            if (ar.question_id == ch.question_id) {
                                temp.splice(a, 1);
                            }
                        });
                        // arr = temp;
                    }
                })
            }
        });

        setMyBodyArr(arr);
    }

    function optionTextVisibility(op) {
        if (op.selected && op.isbreif === 1) {
            return false;
        } else {
            return true
        }
    }

    return (
        <>
            {/* <h4>Total Score : {totalScore}</h4>
            <Button variant="contained" onClick={() => calculateScore()}>Get Score</Button> */}
            <div className="wrapper hraquestionSection" >
                <div className="main">
                    <main className="content">
                        <div className="container-fluid p-0">
                            <div className="qstn_sc_rit">
                                <div id="selectage" className="qstn_sec">
                                    {myBodyArr.map((data, i) => <div key={i}>
                                        <div className="qstn_sec_hed">
                                            <span>
                                                {data.qs_icon !== null ? <img src={IMAGE_URL_ASSETS + data.qs_icon} /> : data.questionsequence}
                                            </span>
                                            {data.questiondesc}
                                            <a className="nav-link dropdown-toggle d-none d-sm-inline-block" href="#"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bi bi-info-circle-fill"></i>
                                            </a>

                                            <div className="dropdown-menu dropdown-menu-end">
                                                <div className="persn_dtl_op">
                                                    <p dangerouslySetInnerHTML={{ __html: data.briefdesc }}></p>
                                                </div>
                                            </div>
                                        </div>



                                        <div className="qstn_sec_selct">
                                            {data.questiontype == "single" ?
                                                data.options[0].iconurl != null ?
                                                    <div className="select_gnd">
                                                        <div className="gndr">
                                                            {data ?
                                                                data.options ?
                                                                    data.options.map((op, j) =>
                                                                        <div className="col text-center" key={j}>
                                                                            <input
                                                                                type="radio"
                                                                                name={"imgbackground" + data.question_id}
                                                                                id={"img1" + op.option_id}
                                                                                className="d-none imgbgchk"
                                                                                checked={op.option_id == data.selected}
                                                                                value={op.option_id}
                                                                                disabled
                                                                            />
                                                                            <label htmlFor={"img1" + op.option_id}>
                                                                                <img src={IMAGE_URL_ASSETS + op.iconurl} />
                                                                                <div className="tick_container">
                                                                                    <div className="tick">&nbsp;</div>
                                                                                </div>
                                                                            </label>
                                                                            <strong>{op.option_text}</strong>
                                                                        </div>
                                                                    ) : <></> :
                                                                <></>
                                                            }
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="select_age">
                                                        <div className="siz_typ">
                                                            {data ?
                                                                data.options ?
                                                                    data.options.map((op, j) =>
                                                                        <p key={j}>
                                                                            <input
                                                                                key={j}
                                                                                type="radio"
                                                                                id={"test" + op.option_id}
                                                                                name={"radio-group" + data.question_id}
                                                                                checked={op.option_id == data.selected}
                                                                                value={op.option_id}
                                                                                disabled
                                                                            />
                                                                            <label htmlFor={"test" + op.option_id}>{op.option_text}</label>
                                                                        </p>
                                                                    ) : <></> :
                                                                <></>
                                                            }
                                                        </div>
                                                    </div> :
                                                <>
                                                    {data.questiontype == "radio" ? <>
                                                        {data.options[0].iconurl != null ?
                                                            <div className="select_age water_radio">
                                                                <div className="siz_typ">
                                                                    {data ?
                                                                        data.options ?
                                                                            data.options.map((op, j) =>
                                                                                <p key={j}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={"imgbackground" + data.question_id}
                                                                                        id={"img1" + op.option_id}
                                                                                        className="d-none imgbgchk"
                                                                                        checked={op.option_id == data.selected}
                                                                                        value={op.option_id}
                                                                                        disabled
                                                                                    />
                                                                                    <label htmlFor={"img1" + op.option_id}>
                                                                                        <img src={IMAGE_URL_ASSETS + op.iconurl} />
                                                                                    </label>
                                                                                    <strong>{op.option_text}</strong>
                                                                                </p>
                                                                            ) : <></> :
                                                                        <></>
                                                                    }
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="select_mstus">
                                                                <div className="portyp">
                                                                    {data ?
                                                                        data.options ?
                                                                            data.options.map((op, j) =>
                                                                                <p key={j}>
                                                                                    <input
                                                                                        key={j}
                                                                                        type="radio"
                                                                                        id={"test" + op.option_id}
                                                                                        name={"radio-group" + data.question_id}
                                                                                        value={op.option_id}
                                                                                        disabled
                                                                                        checked={op.option_id == data.selected}
                                                                                    />
                                                                                    <label htmlFor={"test" + op.option_id}>{op.option_text}</label>
                                                                                </p>
                                                                            ) : <></> :
                                                                        <></>
                                                                    }
                                                                </div>
                                                            </div>
                                                        }
                                                    </> : <>
                                                        {data.questiontype == "multi" ? <>
                                                            <div className="select_mstus">
                                                                <div className="blod_tst">
                                                                    {data ?
                                                                        data.options ?
                                                                            data.options.map((op, j) =>
                                                                                <>
                                                                                    <p key={j}>
                                                                                        <input
                                                                                            key={j}
                                                                                            type="checkbox"
                                                                                            id={"test" + op.option_id}
                                                                                            name="checkbox-group"
                                                                                            checked={op.selected}
                                                                                            value={op.option_id}
                                                                                            disabled={true}
                                                                                        />
                                                                                        <label htmlFor={"test" + op.option_id}>{op.option_text}</label>
                                                                                    </p>

                                                                                    <div className="entr_mnl" hidden={optionTextVisibility(op)}>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder=""
                                                                                            value={answerDesc}
                                                                                            readOnly />
                                                                                    </div>
                                                                                </>
                                                                            ) : <></> :
                                                                        <></>
                                                                    }

                                                                </div>
                                                            </div>

                                                        </> : <>
                                                            {data.questiontype == "feedback" ?
                                                                <>
                                                                    <div className="select_age roumd_radio">
                                                                        <div className="siz_typ">
                                                                            {data ?
                                                                                data.options ?
                                                                                    data.options.map((op, j) =>
                                                                                        <p key={j}>
                                                                                            <input key={j} type="radio" id={"test" + op.option_id} name={"radio-group" + data.question_id}
                                                                                                checked={op.option_id == data.selected}
                                                                                                value={op.option_id} disabled />
                                                                                            <label htmlFor={"test" + op.option_id}>&nbsp;</label>
                                                                                            <strong>{op.option_text}</strong>
                                                                                        </p>
                                                                                    ) : <></> :
                                                                                <></>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </> : <>

                                                                </>}
                                                        </>}
                                                    </>}
                                                </>
                                            }
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default MyLifestyleViewPage;