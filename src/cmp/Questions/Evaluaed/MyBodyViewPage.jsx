import React, { useEffect, useState } from "react";
import { IMAGE_URL_ASSETS } from "../../../config/app_url";
import { HEIGHT_UNITS, WAIST_UNITS, WEIGHT_UNITS } from "../../../constant/constantValue";
import { IMAGE_NAME } from "../../../constant/images";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function MyBodyViewPage(props) {

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

    useEffect(() => {
        // setMyBodyArr(props.bodyArr);
        reArrangeMainArr(props.bodyArr);
        // console.log("Props view Page Body Arr >> ", props.bodyArr)
    }, [props.bodyArr]);

    function reArrangeMainArr(tempArr) {
        let arr = [];
        tempArr.map((data) => {
            if(data.question_id == 7){
                if(data.selected.length > 0){
                    let selData = data.selected[0];
                    
                    // setHeight(selData.height);
                    setHeightString(selData.height)
                    setHeightUnit(selData.heightunit);
                    setWeight(selData.weight);
                    setWeightUnit(selData.weightunit);
                    setWaist(selData.waistsize);
                    setWaistUnit(selData.waistunit);
                    setHip(selData.hipsize);
                    setHipUnit(selData.hipunit)
                }
            }
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
                                                                                            checked={op.option_id == data.selected}
                                                                                            disabled
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
                                                                                <select className="form-select" value={heightUnit} disabled>
                                                                                    {HEIGHT_UNITS.map((item, i) =>
                                                                                        <option value={item.value} key={i}>{item.label}</option>
                                                                                    )}
                                                                                </select>
                                                                                {/* <strong className="bht">6’2</strong> */}

                                                                                <strong className="bht">{heightString}</strong>
                                                                            </div>

                                                                            <div className="measure_range">
                                                                                {/* <Box sx={{ width: "100%" }}>
                                                                                    <Slider
                                                                                        // key={"slider"+height}
                                                                                        min={122}
                                                                                        max={heightUnit === "feet" ? 305 : 305}
                                                                                        step={heightUnit === "feet" ? 1.2 : 0.1}
                                                                                        aria-label="height"
                                                                                        value={sliderValue}
                                                                                        color="primary"
                                                                                        disabled
                                                                                    />
                                                                                </Box> */}
                                                                                {/* <label for="customRange1" className="form-label">&nbsp;</label>
                                                    <input type="range" className="form-range" id="customRange1" min="4" max="10" step="0.1" defaultValue={height} onChange={(e) => changeHeightSliderValue(e)} /> */}
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
                                                                                <select className="form-select" value={weightUnit} disabled>
                                                                                    {WEIGHT_UNITS.map((item, i) =>
                                                                                        <option value={item.value} key={i}>{item.label}</option>
                                                                                    )}
                                                                                </select>
                                                                            </div>


                                                                            <div className="incr_dic">
                                                                                <div className="input_group">
                                                                                    <input type="text" className="form-control" value={weight} readOnly />
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
                                                                                <select className="form-select" value={waistUnit} disabled>
                                                                                    {WAIST_UNITS.map((item, i) =>
                                                                                        <option value={item.value} key={i}>{item.label}</option>
                                                                                    )}
                                                                                </select>

                                                                            </div>
                                                                            <div className="incr_dic">
                                                                                <div className="input_group">
                                                                                    <input type="text" className="form-control" value={waist} readOnly/>
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
                                                                                <select className="form-select" value={hipUnit} disabled>
                                                                                    {WAIST_UNITS.map((item, i) =>
                                                                                        <option value={item.value} key={i}>{item.label}</option>
                                                                                    )}
                                                                                </select>

                                                                            </div>
                                                                            <div className="incr_dic">
                                                                                <div className="input_group">
                                                                                    <input type="text" className="form-control" value={hip} readOnly />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

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

export default MyBodyViewPage;