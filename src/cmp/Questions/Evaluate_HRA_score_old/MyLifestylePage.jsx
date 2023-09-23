import React, { useEffect, useState } from "react";
import { IMAGE_URL_ASSETS } from "../../../config/app_url";
import { savetempQuestionAns } from "../../../service/questionService";

function MyLifestylePage(props) {

    const [myBodyArr, setMyBodyArr] = useState([]);
    const [answerDesc, setAnswerDesc] = useState("");
    const [isSpecial, setIsSpecial] = useState(0);

    useEffect(() => {
        // setMyBodyArr(props.bodyArr);
        console.log("Props Lifestyle Arr >> ", props.bodyArr);
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

    const saveAnswer = (data) => {
        let payload = {};
        if (data.questiontype === 'multi') {
            let arr = data.selected !== null ? data.selected.toString().indexOf(",") > 0 ? data.selected.split(",") : [data.selected] : [];
            payload = {
                "timestamp": props.sessionId,
                "question_id": data.question_id,
                "option_id": data.selected,
                "answers": arr,
                "questiontype": data.questiontype,
                "cat_id": data.cat_id,
                "sub_cat_id": data.sub_cat_id,
                "answerdesc": data.answerdesc ? data.answerdesc : "",
                "parent_id": data.parentquestion_id ? data.parentquestion_id : null,
            }
        } else if (data.questiontype === 'biometric') {
            payload = {
                "timestamp": props.sessionId,
                "question_id": data.question_id,
                "questiontype": data.questiontype,
                "cat_id": data.cat_id,
                "sub_cat_id": data.sub_cat_id,
                "parent_id": null,
                "height": data.height,
                "heightunit": data.heightunit,
                "weightunit": data.weightunit,
                "weight": data.weight,
                "waistsize": data.waistsize,
                "waistunit": data.waistunit,
                "hipsize": data.hipsize,
                "hipunit": data.hipunit
            }
        } else {
            payload = {
                "timestamp": props.sessionId,
                "question_id": data.question_id,
                "option_id": data.selected,
                "questiontype": data.questiontype,
                "cat_id": data.cat_id,
                "sub_cat_id": data.sub_cat_id,
                "answerdesc": data.answerdesc ? data.answerdesc : "",
                "parent_id": data.parentquestion_id ? data.parentquestion_id : null,
            }
        }

        savetempQuestionAns(payload).then(res => {
            console.log("Save Answer  >>>>> ", res)
            if (res.data.success) {
                props.getScore(res.data.response.score);
            }
        })
    }

    const changeOption = (qId, opId, score) => {
        let mainArr = [...myBodyArr];

        for (let i = 0; i < mainArr.length; i++) {
            if (mainArr[i].question_id == qId) {
                mainArr[i].selected = opId;
                mainArr[i].score = score;
                saveAnswer(mainArr[i])
                break;
            } else {
                if (mainArr[i].havechild == 1) {
                    let chArr = mainArr[i].child;
                    chArr.map((ch) => {
                        if (ch.question_id == qId) {
                            ch.selected = opId;
                            ch.score = score;
                            saveAnswer(ch)
                        }
                    })
                    mainArr[i].child = chArr;
                }
            }
        }
        // console.log("Main >> ", mainArr)
        reArrangeMainArr(mainArr);
        // setMyBodyArr(mainArr);

    }

    function changeMultiOptions(e, qId) {
        // console.log("Option Id >>. ", e.target.value);
        let currQsData = {};
        let mainArr = [...myBodyArr];
        for (let a = 0; a < myBodyArr.length; a++) {
            if (myBodyArr[a].question_id == qId) {
                currQsData = myBodyArr[a];
                break;
            }
        }
        let value = e.target.value,
            arr = currQsData.selected === "" ? [] : currQsData.selected.split(","),
            special = isSpecial,
            newSpecial = 0;

        if (e.target.checked) {
            // arr.push(value);

            currQsData.options.map((op) => {
                if (op.option_id == value) {
                    if (op.special_condition == 1) {
                        arr = [value];
                        currQsData.options.map((data) => {
                            if (data.special_condition == 1 && data.option_id == value) {
                                data.selected = true;
                            } else {
                                // data.isDisabled = true;
                                data.selected = false;
                            }
                        })
                    } else {
                        if (special == op.special_condition) {
                            arr.push(value);
                        } else {
                            arr = [value];
                        }
                        op.selected = true;
                    }
                    setIsSpecial(op.special_condition);
                    newSpecial = op.special_condition;
                }
            });




            currQsData.options.map((data) => {
                if (data.special_condition == newSpecial) {
                    data.isDisabled = false;
                } else {
                    // data.isDisabled = true;
                    data.selected = false;
                }
            })
        } else {
            for (let i = 0; i < arr.length; i++) {
                let data = arr[i];
                if (data == value) {
                    arr.splice(i, 1);
                    currQsData.options.map((op) => {
                        if (op.option_id == value) {
                            op.selected = false;
                        }
                    })
                    break;
                }
            }
            if (arr.length > 0) {
                for (let i = 0; i < currQsData.options.length; i++) {
                    let op = currQsData.options[i];
                    if (op.option_id == arr[0]) {
                        newSpecial = op.special_condition;
                        setIsSpecial(op.special_condition);
                        break;
                    }
                }

                currQsData.options.map((item) => {
                    if (item.special_condition == newSpecial) {
                        item.isDisabled = false;
                    } else {
                        // item.isDisabled = true;
                        item.isDisabled = false;
                    }
                })
            } else {
                setIsSpecial(2);
                newSpecial = 2;
                currQsData.options.map((op) => {
                    op.isDisabled = false;
                })
            }

        }

        currQsData.selected = arr.join(",")

        for (let m = 0; m < mainArr.length; m++) {
            if (mainArr[m].question_id == qId) {
                mainArr[m] = currQsData;

                saveAnswer(currQsData)
                break;
            }
        }

        reArrangeMainArr(mainArr);

        // setCurrentQuestionData(currQsData)
        // setCurrentSelectedMultiOptions(arr);
        // setCurrentSelectedOption(arr.join(","));
        // reArrangeAll(currQsData);
        // console.log("Option Arr >>>>", arr)
    }

    function changeMultiOptionDescription(e) {
        // setAnswerDesc(e.target.value);
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
                                                                                onChange={() => changeOption(data.question_id, op.option_id, op.score)}
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
                                                                                onChange={() => changeOption(data.question_id, op.option_id, op.score)}
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
                                                                                        onChange={() => changeOption(data.question_id, op.option_id, op.score)}
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
                                                                                        onChange={() => changeOption(data.question_id, op.option_id, op.score)}
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
                                                                                            onChange={(e) => changeMultiOptions(e, data.question_id)}
                                                                                            disabled={op.isDisabled}
                                                                                        />
                                                                                        <label htmlFor={"test" + op.option_id}>{op.option_text}</label>
                                                                                    </p>

                                                                                    <div className="entr_mnl" hidden={optionTextVisibility(op)}>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder=""
                                                                                            value={answerDesc}
                                                                                            onChange={(e) => changeMultiOptionDescription(e)} />
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
                                                                                                value={op.option_id} onChange={() => changeOption(data.question_id, op.option_id, op.score)} />
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

export default MyLifestylePage;