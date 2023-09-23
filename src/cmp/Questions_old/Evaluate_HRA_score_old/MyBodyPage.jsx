import React, { useEffect, useState } from "react";
import { IMAGE_URL_ASSETS } from "../../../config/app_url";
import { HEIGHT_UNITS, WAIST_UNITS, WEIGHT_UNITS } from "../../../constant/constantValue";
import { IMAGE_NAME } from "../../../constant/images";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Button } from "@mui/material";
import { savetempQuestionAns } from "../../../service/questionService";

function MyBodyPage(props) {

    const [myBodyArr, setMyBodyArr] = useState([]);
    const [heightUnit, setHeightUnit] = useState("feet");
    const [height, setHeight] = useState(4);
    const [heightString, setHeightString] = useState("4");
    const [weightUnit, setWeightUnit] = useState("kelo");
    const [weight, setWeight] = useState(60);
    const [waistUnit, setWaistUnit] = useState("inch");
    const [waist, setWaist] = useState(30);
    const [hipUnit, setHipUnit] = useState("inch");
    const [hip, setHip] = useState(30);
    const [sliderValue, setSliderValue] = useState(122);
    const [answerDesc, setAnswerDesc] = useState("");
    const [totalScore, setTotalScore] = useState(0);
    const [isSpecial, setIsSpecial] = useState(0);

    const biomatricQsData = {
        "timestamp": props.sessionId,
        "question_id": 7,
        "questiontype": "biometric",
        "sub_cat_id": 2,
        "cat_id": 1,
        "parent_id": null,
        "height": height,
        "heightunit": heightUnit,
        "weightunit": weightUnit,
        "weight": weight,
        "waistsize": waist,
        "waistunit": waistUnit,
        "hipsize": hip,
        "hipunit": hipUnit
    }

    useEffect(() => {
        // setMyBodyArr(props.bodyArr);
        reArrangeMainArr(props.bodyArr);
    }, [props.bodyArr]);

    function reArrangeMainArr(tempArr) {
        // console.log("Rearrange Temp ARR >>> ", tempArr)
        let arr = [];
        tempArr.map((data) => {
            arr.push(data);
            if (data.havechild == 1) {
                data.child.map((ch) => {
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
            // console.log("Save Answer  >>>>> ", res)
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
        let currQsData = {};
        let mainArr = [...myBodyArr];
        for (let a = 0; a < myBodyArr.length; a++) {
            if (myBodyArr[a].question_id == qId) {
                currQsData = myBodyArr[a];
                break;
            }
        }
        let value = e.target.value,
            arr = currQsData.selected==="" ? [] : currQsData.selected.split(","),
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

    function changeHeightUnit(e) {
        setHeightUnit(e.target.value);
        // let obj = Object.assign(biomatricQsData, { "heightunit": e.target.value });
        // saveAnswer(obj);
        if (e.target.value === 'feet') {
            setHeightString(convertedCentoFeet(sliderValue));
        } else {
            setHeightString(Math.floor(sliderValue))
        }
    }

    function changeWeightUnit(e) {
        let value = e.target.value;
        setWeightUnit(e.target.value);
        // let obj = Object.assign(biomatricQsData, { "weightunit": e.target.value });
        // saveAnswer(obj);
        if (value === 'kelo') {
            setWeight(Math.ceil(weight / 2.20462))
        } else {
            setWeight(Math.floor(weight * 2.20462))
        }
    }

    function changeWaistUnit(e) {
        setWaistUnit(e.target.value);
        // let obj = Object.assign(biomatricQsData, { "waistunit": e.target.value });
        // saveAnswer(obj);
        if (e.target.value === 'inch') {
            setWaist(Math.ceil(waist / 2.54))
        } else {
            setWaist(Math.floor(waist * 2.54))
        }
    }

    function changeHipUnit(e) {
        setHipUnit(e.target.value);
        // let obj = Object.assign(biomatricQsData, { "hipunit": e.target.value });
        // saveAnswer(obj);
        if (e.target.value === 'inch') {
            setHip(Math.ceil(hip / 2.54))
        } else {
            setHip(Math.floor(hip * 2.54))
        }
    }

    const convertedCentoFeet = (values) => {
        var realFeet = (values * 0.3937) / 12;
        var feet = Math.floor(realFeet);
        var inches = Math.round((realFeet - feet) * 12);
        return feet + "’" + inches + "’’";
    };

    const convertedCentoFeetInDb = (values) => {
        var realFeet = (values * 0.3937) / 12;
        var feet = Math.floor(realFeet);
        var inches = Math.round((realFeet - feet) * 12);
        return feet + "." + inches;
    };

    function changeHeightSliderValue(e) {
        setHeight(convertedCentoFeetInDb(e.target.value));
        setSliderValue(e.target.value)
        if (heightUnit === "feet") {
            let str = e.target.value;

            // let val = str.replace(".", "’");
            let val = convertedCentoFeet(str);
            setHeightString(val);
        } else {
            let str = e.target.value.toString();
            setHeightString(Math.floor(str));
        }
    }

    function changeCommitted() {
        // let obj = Object.assign(biomatricQsData, { "height": height });
        // saveAnswer(obj);
    }

    function increaseValue(type) {
        if (type === "weight") {
            if (checkWeight(weight)) {
                setWeight(weight + 1);
                // let obj = Object.assign(biomatricQsData, { "weight": weight + 1 });
                // saveAnswer(obj);
            }
        } else if (type === "waist") {
            if (checkWaist(waist)) {
                setWaist(waist + 1);
                // let obj = Object.assign(biomatricQsData, { "waistsize": waist + 1 });
                // saveAnswer(obj);
            }
        } else if (type === "hip") {
            if (checkHip(hip)) {
                setHip(hip + 1);
                // let obj = Object.assign(biomatricQsData, { "hipsize": hip + 1 });
                // saveAnswer(obj);
            }
        }
    }

    function textChange(e, type) {
        let value = e.target.value;
        if (value == "") {
            value = '0';
        }
        var reg = /^[0-9 +\b]+$/;
        let checkNumber = value.match(reg);
        // console.log("Check NUmber :::", checkNumber);
        if (checkNumber) {
            if (type === "weight") {
                if (checkWeight(Number(value))) {
                    setWeight(Number(value));
                    // let obj = Object.assign(biomatricQsData, { "weight": Number(value) });
                    // saveAnswer(obj);
                }
            } else if (type === "waist") {
                if (checkWaist(Number(value))) {
                    setWaist(Number(value));
                    // let obj = Object.assign(biomatricQsData, { "waistsize": Number(value) });
                    // saveAnswer(obj);
                }
            } else if (type === "hip") {
                if (checkHip(Number(value))) {
                    setHip(Number(value));
                    // let obj = Object.assign(biomatricQsData, { "hipsize": Number(value) });
                    // saveAnswer(obj);
                }
            }
        }
    }

    function decreaseValue(type) {
        if (type === "weight") {
            if (checkWeight(weight - 1)) {
                setWeight(weight - 1);
                // let obj = Object.assign(biomatricQsData, { "weight": weight - 1 });
                // saveAnswer(obj);
            }
        } else if (type === "waist") {
            if (checkWaist(waist - 1)) {
                setWaist(waist - 1);
                // let obj = Object.assign(biomatricQsData, { "waistsize": waist - 1 });
                // saveAnswer(obj);
            }
        } else if (type === "hip") {
            if (checkHip(hip - 1)) {
                setHip(hip - 1);
                // let obj = Object.assign(biomatricQsData, { "hipsize": hip - 1 });
                // saveAnswer(obj);
            }
        }
    }

    function checkWaist(val) {
        if (waistUnit === 'cms') {
            if (val < 200) {
                return true;
            }
        } else if (waistUnit === 'inch') {
            if (val < 100) {
                return true;
            }
        } else {
            return false;
        }
    }

    function checkWeight(val) {
        if (weightUnit === 'kelo') {
            if (val < 361) {
                return true;
            }
        } else if (weightUnit === 'pound') {
            if (val < 795) {
                return true;
            }
        } else {
            return false;
        }
    }

    function checkHip(val) {
        if (hipUnit === 'cms') {
            if (val < 200) {
                return true;
            }
        } else if (hipUnit === 'inch') {
            if (val < 100) {
                return true;
            }
        } else {
            return false;
        }
    }

    function optionTextVisibility(op) {
        if (op.selected && op.isbreif === 1) {
            return false;
        } else {
            return true
        }
    }

    function calculateScore() {
        let score = 0;
        myBodyArr.map((data) => {
            score = score + Number(data.score);
            if (data.havechild == 1) {
                data.child.map((ch) => {
                    score = score + Number(ch.score);
                })
            }
        })

        setTotalScore(score);
    }

    function submitBiomatricData() {
        saveAnswer(biomatricQsData);
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
                                    {myBodyArr.map((data, i) =>
                                        <div key={i}>
                                            {data.question_id == 3 ?
                                                myBodyArr[0].selected == 2 && (myBodyArr[1].selected == 4 || myBodyArr[1].selected == 5) ?
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
                                                    </div> : <></> :
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
                                            }



                                            <div className="qstn_sec_selct">
                                                {data.questiontype == "single" ?
                                                    data.options[0].iconurl != null ?
                                                        <div className="select_gnd">
                                                            {data.question_id == 3 ? <>
                                                                {myBodyArr[0].selected == 2 && (myBodyArr[1].selected == 4 || myBodyArr[1].selected == 5) ? <>
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
                                                                </> : <></>}
                                                            </> : <>
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
                                                            </>}
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
                                                            {data.questiontype == "biometric" ? <>
                                                                <div className="select_msr">
                                                                    <div className="select_msr_in pnk_bg">
                                                                        <div className="select_msr_icn">
                                                                            <img src={IMAGE_NAME.BODY_MEASURE_1} />
                                                                        </div>
                                                                        <div className="select_msr_con">
                                                                            <p>Height</p>
                                                                            <div className="select_msr_con_in">
                                                                                <select className="form-select" value={heightUnit} onChange={(e) => changeHeightUnit(e)}>
                                                                                    {HEIGHT_UNITS.map((item, i) =>
                                                                                        <option value={item.value} key={i}>{item.label}</option>
                                                                                    )}
                                                                                </select>
                                                                                {/* <strong className="bht">6’2</strong> */}

                                                                                <strong className="bht">{heightString}</strong>
                                                                            </div>

                                                                            <div className="measure_range">
                                                                                <Box sx={{ width: "100%" }}>
                                                                                    <Slider
                                                                                        // key={"slider"+height}
                                                                                        min={122}
                                                                                        max={heightUnit === "feet" ? 305 : 305}
                                                                                        step={heightUnit === "feet" ? 1.2 : 0.1}
                                                                                        aria-label="height"
                                                                                        value={sliderValue}
                                                                                        onChange={(e) => changeHeightSliderValue(e)}
                                                                                        onChangeCommitted={changeCommitted}
                                                                                        color="primary"
                                                                                    />
                                                                                </Box>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="select_msr_in blu_bg">
                                                                        <div className="select_msr_icn">
                                                                            <img src={IMAGE_NAME.BODY_MEASURE_2} />
                                                                        </div>
                                                                        <div className="select_msr_con">
                                                                            <div className="select_msr_con_in">
                                                                                <strong>Weight</strong>
                                                                                <select className="form-select" value={weightUnit} onChange={(e) => changeWeightUnit(e)}>
                                                                                    {WEIGHT_UNITS.map((item, i) =>
                                                                                        <option value={item.value} key={i}>{item.label}</option>
                                                                                    )}
                                                                                </select>
                                                                            </div>


                                                                            <div className="incr_dic">
                                                                                <div className="input_group">
                                                                                    <button className="btn btn-primary" onClick={() => increaseValue("weight")}>+</button>
                                                                                    <input type="text" className="form-control" value={weight} onChange={(e) => textChange(e, "weight")} />
                                                                                    <button className="btn btn-primary" onClick={() => decreaseValue("weight")} disabled={weight <= 0}>-</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div className="select_msr_in blu_bg">
                                                                        <div className="select_msr_icn">
                                                                            <img src={IMAGE_NAME.BODY_MEASURE_3} />
                                                                        </div>
                                                                        <div className="select_msr_con">
                                                                            <div className="select_msr_con_in">
                                                                                <strong>Waist</strong>
                                                                                <select className="form-select" value={waistUnit} onChange={(e) => changeWaistUnit(e)}>
                                                                                    {WAIST_UNITS.map((item, i) =>
                                                                                        <option value={item.value} key={i}>{item.label}</option>
                                                                                    )}
                                                                                </select>

                                                                            </div>
                                                                            <div className="incr_dic">
                                                                                <div className="input_group">
                                                                                    <button className="btn btn-primary" onClick={() => increaseValue("waist")}>+</button>
                                                                                    <input type="text" className="form-control" value={waist} onChange={(e) => textChange(e, "waist")} />
                                                                                    <button className="btn btn-primary" onClick={() => decreaseValue("waist")} disabled={waist <= 0}>-</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="select_msr_in pnk_bg">
                                                                        <div className="select_msr_icn">
                                                                            <img src={IMAGE_NAME.BODY_MEASURE_4} />
                                                                        </div>
                                                                        <div className="select_msr_con">
                                                                            <div className="select_msr_con_in">
                                                                                <strong>Hip</strong>
                                                                                <select className="form-select" value={hipUnit} onChange={(e) => changeHipUnit(e)}>
                                                                                    {WAIST_UNITS.map((item, i) =>
                                                                                        <option value={item.value} key={i}>{item.label}</option>
                                                                                    )}
                                                                                </select>

                                                                            </div>
                                                                            <div className="incr_dic">
                                                                                <div className="input_group">
                                                                                    <button className="btn btn-primary" onClick={() => increaseValue("hip")}>+</button>
                                                                                    <input type="text" className="form-control" value={hip} onChange={(e) => textChange(e, "hip")} />
                                                                                    <button className="btn btn-primary" onClick={() => decreaseValue("hip")} disabled={hip <= 0}>-</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div className="select_msr_in">
                                                                    </div> */}
                                                                </div>
                                                                <button class="btn btn-primary d-block" tabindex="0" type="button" onClick={() => submitBiomatricData()}>submit</button>

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

export default MyBodyPage;