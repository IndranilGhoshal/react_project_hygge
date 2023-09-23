import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { IMAGE_NAME } from '../../constant/images';
import { HEIGHT_UNITS, WEIGHT_UNITS, WAIST_UNITS } from "../../constant/constantValue";
import { getAllQuestionData, saveAsComplete, saveQuestionAnswer, sendIndividualReport, userEventQuestion } from '../../service/questionService';

import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { toast, ToastContainer } from 'react-toastify';
import { IMAGE_URL, IMAGE_URL_ASSETS, IMAGE_URL_ASSETS_MOBILE } from '../../config/app_url';
import { deviceDetails } from '../../device/Device';
import { hideLoader } from '../../service/Common';
import Congratulations_body_m from './My_Body_m/Congratulations_body_m';
import Congrtulation_life_m from './My_Lifestyle_m/Congratulations_life_m';
import Congratulations_mind_m from './My_Mind_m/Congratulations_mind_m';
import Info_pages from '../Questions/Start_Up_Pages/Info_page';
import Informative_screen_one from '../Questions/Informative/Informative_screen_one';
import Informative_screen_two from '../Questions/Informative/Informative_screen_two';


function LinearProgressWithLabelMyBody(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress sx={{
                    backgroundColor: 'white',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: '#428FEC'
                    }
                }}
                    variant="determinate" {...props}
                />
            </Box>
        </Box>
    );
}
function LinearProgressWithLabelMyLifeStyle(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress sx={{
                    backgroundColor: 'white',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: '#069E15'
                    }
                }}
                    variant="determinate" {...props}
                />
            </Box>
        </Box>
    );
}
function LinearProgressWithLabelMyMind(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress sx={{
                    backgroundColor: 'white',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: '#FFBF3F'
                    }
                }}
                    variant="determinate" {...props}
                />
            </Box>
        </Box>
    );
}

function MobileQuestions() {

    setTimeout(() => {
        hideLoader()
    }, 1000);

    const navigate = useNavigate();

    const [allQuestionData, setAllQuestionData] = useState({});
    const [currentQuestionSet, setCurrentQuestionSet] = useState([]);
    const [currentQusetionData, setCurrentQuestionData] = useState({});
    const [currentQsType, setCurrentQsType] = useState("");
    const [prevQsArr, setPrevQsArr] = useState([]);
    const [currPosition, setCurrPosition] = useState(0);
    const [currPart, setCurrPart] = useState(0);
    const [currentSelectedOption, setCurrentSelectedOption] = useState("");
    const [currentSelectedMultiOptions, setCurrentSelectedMultiOptions] = useState([]);
    const [progress, setProgress] = useState(0);
    const [heightUnit, setHeightUnit] = useState("feet");
    const [height, setHeight] = useState(4);
    const [heightString, setHeightString] = useState("4");
    const [weightUnit, setWeightUnit] = useState("kelo");
    const [weight, setWeight] = useState(60);
    const [waistUnit, setWaistUnit] = useState("inch");
    const [waist, setWaist] = useState(30);
    const [hipUnit, setHipUnit] = useState("inch");
    const [hip, setHip] = useState(30);
    const [totalQsCount, setTotalQsCount] = useState(0);
    const [modelIndex, setModelIndex] = useState(0);
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [isSpecial, setIsSpecial] = useState(0);
    const [authData, setAuthData] = useState();
    const [companyLogo, setCompanyLogo] = useState("");

    const [answerDesc, setAnswerDesc] = useState("");

    const [bodyCg, setBodyCg] = useState(false);
    const [lifeCg, setLifeCg] = useState(false);
    const [mindCg, setMindCg] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [screenOne, setScreenOne] = useState(false);
    const [screenTwo, setScreenTwo] = useState(false);
    const [infoPage, setInfoPage] = useState(true);
    const [allQsArr, setAllQsArr] = useState([]);
    const [sliderValue, setSliderValue] = useState(122);

    const [selectBoxClass, setSelectBoxClass] = useState("selectBox");
    const [isOpenSelect, setIsOpenSelect] = useState(false);


    /* click to show question module */
    function showQuestion() {
        setInfoPage(false) /* hide out display info page */
        setScreenOne(true); /* For show sidebar tab info and question number info */
        setIsShow(true); /* For show question screen */
    }

    useEffect(() => {
        let data = sessionStorage.getItem("qs_campaign_data");
        if (data === null) {
            window.location.replace('https://www.google.com');
            window.history.go(1);
        } else {
            if (data !== undefined || data !== null) {
                // console.log("Obj >>> ", data)
                let obj = JSON.parse(data)
                setAuthData(obj);
                let logo = IMAGE_URL + obj.organizationLogo;
                setCompanyLogo(logo);
                getQuestionData(obj);
            } else {
                window.location.replace('https://www.google.com');
                window.history.go(1);
            }
        }

    }, []);



    useEffect(() => {
        if (currentSelectedOption !== "") {
            if (currentQusetionData.questiontype != "multi") {
                goNext(currentQusetionData.question_id)
            }
        }
    }, [currentSelectedOption])

    function getQuestionData(obj) {
        let payload = {
            emp_id: obj.empId,
            orgid: obj.orgId
        };
        getAllQuestionData(payload).then(res => {
            if (res.data.success) {
                hideLoader();
                let respObj = res.data.response;
                // console.log("All Question Response >>>>>>>>", respObj);
                if (respObj.data) {
                    setAllQuestionData(respObj.data);
                    setTotalQsCount(respObj.totalCount);
                    let part = Object.keys(respObj.data);

                    if (respObj.lastId == 1) {
                        // setCurrentQuestionSet(respObj.data[part[currPart]]);
                        setCurrentQuestionSet(questionReArrange(respObj.data[part[currPart]]));
                        // getQuestionNumberWithId(questionReArrange(respObj.data[part[currPart]]))
                        if (respObj.data[part[currPart]].length > 0) {
                            let qsArr = respObj.data[part[currPart]];
                            setCurrentQuestionData(qsArr[0]);
                            setCurrentQsType(qsArr[0].questiontype)
                        }
                    } else {
                        /* Direct Show Question Module */

                        setInfoPage(false);
                        setScreenOne(false);
                        setScreenTwo(false);
                        setIsShow(true);


                        if (respObj.lastId < 24) {                                      /* If My Body */
                            startOn(respObj.data[part[0]], respObj.lastId);
                        } else if (respObj.lastId > 23 && respObj.lastId < 42) {        /* If My Lifestyle part */
                            startOn(respObj.data[part[1]], respObj.lastId);
                            setCurrPart(1);
                        } else {                                                       /* If My Mind Part */
                            startOn(respObj.data[part[2]], respObj.lastId);
                            setCurrPart(2);
                        }
                    }
                }
            }
        })
    }

    function startOn(qsArr, lastId) {
        setCurrentQuestionSet(questionReArrange(qsArr));
        // getQuestionNumberWithId(questionReArrange(qsArr))
        if (qsArr.length > 0) {
            for (let i = 0; i < qsArr.length; i++) {
                if (qsArr[i].question_id == lastId) {
                    setCurrentQuestionData(qsArr[i]);
                    setCurrentQsType(qsArr[i].questiontype);
                    setCurrPosition(i)
                } else if (qsArr[i].havechild === 1) {
                    qsArr[i].child.map((ch) => {
                        if (ch.question_id == lastId) {
                            setCurrentQuestionData(ch);
                            setCurrentQsType(ch.questiontype)
                            setCurrPosition(i)
                        }
                    })
                }

            }
        }

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

            opArr.map((op) => {
                if (data.selected !== null) {
                    let str = data.selected.toString();
                    if (str.indexOf(",") > 0) {
                        let selectArr = data.selected.split(",");
                        // console.log("SelecteAtt >> ", selectArr)
                        selectArr.map((ss) => {
                            // console.log(ss)
                            if (op.option_id == ss) {
                                op.selected = true;
                            }
                        })
                    } else {
                        if (op.option_id == data.selected) {
                            op.selected = true
                        }
                    }
                }
            })
            data.options = opArr;
            data["answerdesc"] = "";
            temp.push(data);
        })
        // console.log("AllQuestion Data after reaarange >>> ", temp)
        return temp;
    }

    function clickTab(id) {
        setCurrPart(id);
        let part = Object.keys(allQuestionData);
        console.log("Current Tab Question Set >>> ", questionReArrange(allQuestionData[part[id]]))
        setCurrentQuestionSet(questionReArrange(allQuestionData[part[id]]));
        if (allQuestionData[part[id]].length > 0) {
            let qsArr = allQuestionData[part[id]];
            setCurrentQuestionData(qsArr[0]);
            setCurrentQsType(qsArr[0].questiontype);
            setCurrPosition(0);
            calculateProgress(questionReArrange(allQuestionData[part[id]]));
        }
    }

    function clickQuestionId(id) {

        for (let i = 0; i < currentQuestionSet.length; i++) {
            if (currentQuestionSet[i].question_id === id) {
                setCurrentQuestionData(currentQuestionSet[i]);
                setCurrentQsType(currentQuestionSet[i].questiontype);
                setCurrPosition(i);
                break;
            } else if (currentQuestionSet[i].havechild === 1) {
                currentQuestionSet[i].child.map((ch) => {
                    if (ch.question_id === id) {
                        // console.log("Screen Question : ", ch)
                        setCurrentQuestionData(ch);
                        setCurrentQsType(ch.questiontype);
                        setCurrPosition(i);
                    }
                })
            }
        }

    }

    function calculateProgress(set) {
        if (set === undefined) {
            // console.log("Current Question Set >>>> ", currentQuestionSet)
            let count = 0,
                answerCounter = 0;

            currentQuestionSet.map((data) => {
                if (data.selected !== null) {
                    answerCounter++;
                }
            });

            count = Math.floor((answerCounter / currentQuestionSet.length) * 100);
            // console.log("Progress Counter >>>> ", count);
            setProgress(count);
        } else {
            // console.log("Current Question Set >>>> ", set)
            let count = 0,
                answerCounter = 0;

            set.map((data) => {
                if (data.selected !== null) {
                    answerCounter++;
                }
            });

            count = Math.floor((answerCounter / set.length) * 100);
            // console.log("Progress Counter >>>> ", count);
            setProgress(count);
        }
    }

    function goNext(qid) {
        if (currentQusetionData.selected !== null && currentQusetionData.selected !== "" && currentQsType !== "biometric") {
            let ansObj = {},
                score = [];
            let qsArr = prevQsArr;
            let hasValue = false;
            for (let i = 0; i < qsArr.length; i++) {
                if (qsArr[i].questionId == qid) {
                    hasValue = true;
                    break;
                }
            }
            if (!hasValue) {
                if (!currentQusetionData.parentquestion_id) {
                    ansObj = {
                        questionId: qid,
                        answer: currentSelectedOption
                    }

                    qsArr.push(ansObj);
                    setPrevQsArr(qsArr);
                }
                // let progressCount = Math.floor(((qsArr.length) / currentQuestionSet.length) * 100);
                // setProgress(progressCount);
                calculateProgress();
            }
            if (currentQusetionData.question_id === 1) {
                setGender(currentSelectedOption)
            } else if (currentQusetionData.question_id === 2) {
                setAge(currentSelectedOption)
            }

            if (currentQsType === "single" || currentQsType === "radio" || currentQsType === "feedback") {
                score = [];
                for (let n = 0; n < currentQusetionData.options.length; n++) {
                    let op = currentQusetionData.options[n];
                    if (currentQusetionData.selected == op.option_id) {
                        score.push({
                            option_id: op.option_id,
                            score: op.score.toString()
                        })
                        break;
                    }
                }

                let payload = {
                    "orgid": authData.orgId,
                    "campaigndtlid": authData.campaignDtlId,
                    "campaignuid": authData.campaignUid,
                    "question_id": qid,
                    "emp_id": authData.empId,
                    "option_id": currentQusetionData.selected,
                    "questiontype": currentQusetionData.questiontype,
                    "cat_id": currentQusetionData.cat_id,
                    "sub_cat_id": currentQusetionData.sub_cat_id,
                    "answerdesc": currentQusetionData.answerdesc ? currentQusetionData.answerdesc : "",
                    "parent_id": currentQusetionData.parentquestion_id ? currentQusetionData.parentquestion_id : null,
                    "score": score
                }
                saveQuestion(payload);
            } else if (currentQsType === "multi") {
                // console.log("current Questio DAta >>> ", currentQusetionData)
                let arr = currentQusetionData.selected !== null ? currentQusetionData.selected.toString().indexOf(",") > 0 ? currentQusetionData.selected.split(",") : [currentQusetionData.selected] : [];
                let temp = currentQusetionData;
                temp.answerdesc = answerDesc;
                setCurrentQuestionData(temp);
                reArrangeAll(temp);

                score = [];
                for (let n = 0; n < currentQusetionData.options.length; n++) {
                    let op = currentQusetionData.options[n];
                    for (let a = 0; a < arr.length; a++) {
                        if (arr[a] == op.option_id) {
                            // if (op.option_id === 57) {
                            //     if (currentQuestionSet[1].selected == 4 || currentQuestionSet[1].selected == 5) {
                            //         score.push({
                            //             option_id: op.option_id,
                            //             score: 2
                            //         })
                            //     } else {
                            //         score.push({
                            //             option_id: op.option_id,
                            //             score: op.score
                            //         })
                            //     }
                            //     break;
                            // } else {
                            score.push({
                                option_id: op.option_id,
                                score: op.score.toString()
                            })
                            break;
                            // }
                        }

                    }
                }

                let payload = {
                    "orgid": authData.orgId,
                    "campaigndtlid": authData.campaignDtlId,
                    "campaignuid": authData.campaignUid,
                    "question_id": qid,
                    "emp_id": authData.empId,
                    "option_id": currentQusetionData.selected,
                    "answers": arr,
                    "questiontype": currentQusetionData.questiontype,
                    "cat_id": currentQusetionData.cat_id,
                    "sub_cat_id": currentQusetionData.sub_cat_id,
                    "answerdesc": currentQusetionData.answerdesc,
                    "parent_id": currentQusetionData.parentquestion_id ? currentQusetionData.parentquestion_id : null,
                    "score": score
                }
                saveQuestion(payload);
            }
        } else if (currentQsType !== "biometric") {
            toast.error("Please select an option")
        }

        if (currentQsType === "biometric") {
            let errorCounter = 0;
            if (weight == 0) {
                errorCounter++;
                toast.error('Weight cannot be set as 0');
                return false;
            } else if (waist == 0) {
                errorCounter++;
                toast.error('waist cannot be set as 0');
                return false;
            } else if (hip == 0) {
                errorCounter++;
                toast.error('Hip cannot be set as 0');
                return false;
            }

            if (errorCounter == 0) {
                let ansObj = {};
                let qsArr = prevQsArr;

                let hasValue = false;
                qsArr.map((item) => {
                    if (item.questionId == qid) {
                        hasValue = true;
                    }
                })
                if (!hasValue) {

                    ansObj = {
                        questionId: qid,
                        answer: {
                            "orgid": authData.orgId,
                            "campaigndtlid": authData.campaignDtlId,
                            "campaignuid": authData.campaignUid,
                            "question_id": qid,
                            "emp_id": authData.empId,
                            "questiontype": currentQusetionData.questiontype,
                            "cat_id": currentQusetionData.cat_id,
                            "sub_cat_id": currentQusetionData.sub_cat_id,
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
                    }
                    qsArr.push(ansObj);
                    setPrevQsArr(qsArr);

                    // let progressCount = Math.floor(((qsArr.length) / currentQuestionSet.length) * 100);
                    // setProgress(progressCount);
                    calculateProgress();
                }
                /* function for next question View */
                let payload = {
                    "orgid": authData.orgId,
                    "campaigndtlid": authData.campaignDtlId,
                    "campaignuid": authData.campaignUid,
                    "question_id": qid,
                    "emp_id": authData.empId,
                    "questiontype": currentQusetionData.questiontype,
                    "cat_id": currentQusetionData.cat_id,
                    "sub_cat_id": currentQusetionData.sub_cat_id,
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
                let currQsData = currentQusetionData;
                currQsData.selected.push(payload);
                reArrangeAll(currQsData);
                saveQuestion(payload);
            }
        }
    }

    function submitLast(qid) {

        if (currentQusetionData.selected !== null && currentQusetionData.selected !== "") {
            let ansObj = {},
                score = [];
            let qsArr = prevQsArr;
            let hasValue = false;
            qsArr.map((item) => {
                if (item.questionId == qid) {
                    hasValue = true;
                }
            })
            if (!hasValue) {
                if (!currentQusetionData.parentquestion_id) {
                    ansObj = {
                        questionId: qid,
                        answer: currentSelectedOption
                    }

                    qsArr.push(ansObj);
                    setPrevQsArr(qsArr);
                }
                // let progressCount = Math.floor(((qsArr.length) / currentQuestionSet.length) * 100);
                // setProgress(progressCount);
                calculateProgress();
            }

            if (currentQsType === "single" || currentQsType === "radio" || currentQsType === "feedback") {
                score = [];
                for (let n = 0; n < currentQusetionData.options.length; n++) {
                    let op = currentQusetionData.options[n];
                    if (currentQusetionData.selected == op.option_id) {
                        score.push({
                            option_id: op.option_id,
                            score: op.score.toString()
                        })
                        break;
                    }
                }
                let payload = {
                    "orgid": authData.orgId,
                    "campaigndtlid": authData.campaignDtlId,
                    "campaignuid": authData.campaignUid,
                    "question_id": qid,
                    "emp_id": authData.empId,
                    "option_id": currentQusetionData.selected,
                    "questiontype": currentQusetionData.questiontype,
                    "cat_id": currentQusetionData.cat_id,
                    "sub_cat_id": currentQusetionData.sub_cat_id,
                    "answerdesc": currentQusetionData.answerdesc ? currentQusetionData.answerdesc : "",
                    "parent_id": currentQusetionData.parentquestion_id ? currentQusetionData.parentquestion_id : null,
                    "score": score
                }
                saveLastQuestion(payload);
            } else if (currentQsType === "multi") {

                let arr = currentQusetionData.selected.split(",");
                let temp = currentQusetionData;
                temp.answerdesc = answerDesc;
                setCurrentQuestionData(temp);
                reArrangeAll(temp);
                score = [];
                for (let n = 0; n < currentQusetionData.options.length; n++) {
                    let op = currentQusetionData.options[n];
                    for (let a = 0; a < arr.length; a++) {
                        if (arr[a] == op.option_id) {
                            // if (op.option_id === 57) {
                            //     if (currentQuestionSet[1].selected == 4 || currentQuestionSet[1].selected == 5) {
                            //         score.push({
                            //             option_id: op.option_id,
                            //             score: 2
                            //         })
                            //     } else {
                            //         score.push({
                            //             option_id: op.option_id,
                            //             score: op.score
                            //         })
                            //     }
                            //     break;
                            // } else {
                            score.push({
                                option_id: op.option_id,
                                score: op.score.toString()
                            })
                            break;
                            // }
                        }

                    }
                }
                let payload = {
                    "orgid": authData.orgId,
                    "campaigndtlid": authData.campaignDtlId,
                    "campaignuid": authData.campaignUid,
                    "question_id": qid,
                    "emp_id": authData.empId,
                    "option_id": currentQusetionData.selected,
                    "answers": arr,
                    "questiontype": currentQusetionData.questiontype,
                    "cat_id": currentQusetionData.cat_id,
                    "sub_cat_id": currentQusetionData.sub_cat_id,
                    "answerdesc": currentQusetionData.answerdesc,
                    "parent_id": currentQusetionData.parentquestion_id ? currentQusetionData.parentquestion_id : null,
                    "score": score
                }
                saveLastQuestion(payload);
            }
        } else {
            toast.error("Please select an option")
        }
    }

    function nextQuestionView() {
        setCurrentSelectedMultiOptions([])
        if (currentQusetionData.havechild === 0) {
            if (currentQuestionSet.length === (currPosition + 1)) {
                if (currPart === 0) {
                    setBodyCg(true);
                } else if (currPart === 1) {
                    setLifeCg(true);
                } else if (currPart === 3) {
                    setMindCg(true);
                }
                setIsShow(false);
                /* go to next Question Set */
                setModelIndex(0);
                let part = Object.keys(allQuestionData);
                setCurrentQuestionSet(allQuestionData[part[currPart + 1]]);
                setProgress(0);
                calculateProgress(allQuestionData[part[currPart + 1]])
                // console.log("Current Question Set::", allQuestionData[part[currPart + 1]]);
                if (allQuestionData[part[currPart + 1]].length > 0) {
                    let qsArr = allQuestionData[part[currPart + 1]];
                    // console.log("Curent Queston Data>>>>>>>", qsArr[0]);
                    setCurrentQsType(qsArr[0].questiontype)
                    setCurrentQuestionData(qsArr[0]);
                    setCurrPosition(0);
                }

                setCurrPart(currPart + 1);
            } else {
                /*Same set next question */
                if (currentQuestionSet[currPosition + 1].question_id === 3) {
                    if (currentQuestionSet[0].selected == 2 && (currentQuestionSet[1].selected == 4 || currentQuestionSet[1].selected == 5)) {
                        setModelIndex(modelIndex + 1);
                        setCurrentQsType(currentQuestionSet[currPosition + 1].questiontype);
                        setCurrentQuestionData(currentQuestionSet[currPosition + 1]);
                        setCurrPosition(currPosition + 1);
                    } else {
                        setModelIndex(modelIndex + 2);
                        setCurrentQsType(currentQuestionSet[currPosition + 2].questiontype);
                        setCurrentQuestionData(currentQuestionSet[currPosition + 2]);
                        setCurrPosition(currPosition + 2);
                    }
                } else {
                    setModelIndex(modelIndex + 1);
                    setCurrentQsType(currentQuestionSet[currPosition + 1].questiontype);
                    setCurrentQuestionData(currentQuestionSet[currPosition + 1]);
                    setCurrPosition(currPosition + 1);
                }

            }
        } else {
            // console.log("child answer have")
            if (currentQusetionData.child && currentQusetionData.child.length) {
                let childQs = currentQusetionData.child[0];
                if (childQs.parentoptions) {
                    let opArr = childQs.parentoptions.split(",");
                    // let currOp = currentSelectedOption.toString();
                    let currOp = currentQusetionData.selected.toString();
                    if (currOp.indexOf(",") > 0) {
                        let temp = currOp.split(",");
                        for (let i = 0; i < temp.length; i++) {
                            if (opArr.includes(temp[i])) {
                                setCurrentQsType(currentQusetionData.child[0].questiontype);
                                setCurrentQuestionData(currentQusetionData.child[0]);
                                break;
                            }
                        }
                    } else if (opArr.includes(currOp)) {
                        // console.log("Have child options single")
                        setCurrentQsType(currentQusetionData.child[0].questiontype);
                        setCurrentQuestionData(currentQusetionData.child[0]);
                    } else {
                        // console.log("Not child options")
                        setCurrentQsType(currentQuestionSet[currPosition + 1].questiontype);
                        setCurrentQuestionData(currentQuestionSet[currPosition + 1]);
                        setCurrPosition(currPosition + 1);
                    }
                }

            }
        }
    }

    function goBack() {
        if (currPart > 0) {
            if (currPosition > 0) {
                if (currentQusetionData.parentquestion_id) {
                    gotoParentQs(currentQusetionData.parentquestion_id);
                } else {
                    setCurrentQsType(currentQuestionSet[currPosition - 1].questiontype);
                    setCurrentQuestionData(currentQuestionSet[currPosition - 1]);
                    setCurrPosition(currPosition - 1);
                    if (currentQuestionSet[currPosition - 1].questiontype === "multi") {
                        goBackMultipleQuestionData(currentQuestionSet[currPosition - 1]);
                    }
                }
            } else {
                let part = Object.keys(allQuestionData);
                let prevSetLength = allQuestionData[part[currPart - 1]].length;
                console.log("In Back When back part >>> ", allQuestionData[part[currPart - 1]])
                setCurrentQuestionSet(allQuestionData[part[currPart - 1]]);
                let qsArr = allQuestionData[part[currPart - 1]];
                setCurrentQsType(qsArr[prevSetLength - 1].questiontype)
                setCurrentQuestionData(qsArr[prevSetLength - 1]);
                setCurrPosition(prevSetLength - 1);
                setCurrPart(currPart - 1);
                calculateProgress(allQuestionData[part[currPart - 1]]);

                if (qsArr[prevSetLength - 1].questiontype === "multi") {
                    goBackMultipleQuestionData(qsArr[prevSetLength - 1]);
                }
            }
        } else {
            if (currentQusetionData.parentquestion_id) {
                gotoParentQs(currentQusetionData.parentquestion_id);
            } else {
                if (currentQuestionSet[currPosition - 1].question_id === 3) {
                    if (currentQuestionSet[0].selected == 2 && (currentQuestionSet[1].selected == 4 || currentQuestionSet[1].selected == 5)) {
                        setCurrentQsType(currentQuestionSet[currPosition - 1].questiontype);
                        setCurrentQuestionData(currentQuestionSet[currPosition - 1]);
                        setCurrPosition(currPosition - 1);
                    } else {
                        setCurrentQsType(currentQuestionSet[currPosition - 2].questiontype);
                        setCurrentQuestionData(currentQuestionSet[currPosition - 2]);
                        setCurrPosition(currPosition - 2);
                    }
                } else {
                    setCurrentQsType(currentQuestionSet[currPosition - 1].questiontype);
                    setCurrentQuestionData(currentQuestionSet[currPosition - 1]);
                    setCurrPosition(currPosition - 1);
                    if (currentQuestionSet[currPosition - 1].questiontype === "multi") {
                        goBackMultipleQuestionData(currentQuestionSet[currPosition - 1]);
                    }
                }

            }
        }
    }

    function goBackMultipleQuestionData(qsData) {
        let currQsData = qsData;
        let arr = qsData.selected !== null ? qsData.selected.toString().indexOf(",") > 0 ? qsData.selected.split(",") : [qsData.selected] : [];
        let newSpecial = 0;


        for (let i = 0; i < currQsData.options.length; i++) {
            let op = currQsData.options[i];
            if (op.option_id == arr[0]) {
                newSpecial = op.special_condition;
                setIsSpecial(op.special_condition);
                break;
            }
        }

        currQsData.options.map((item) => {
            arr.map((ar) => {
                if (item.option_id == ar) {
                    item.selected = true;
                }
            })
        })

        currQsData.options.map((item) => {
            if (item.special_condition == newSpecial) {
                item.isDisabled = false;
            } else {
                // item.isDisabled = true;
                item.isDisabled = false;
            }
        })
        setCurrentQuestionData(currQsData)
        setCurrentSelectedMultiOptions(arr);
        reArrangeAll(currQsData);
    }

    function gotoParentQs(id) {
        currentQuestionSet.map((data) => {
            if (data.question_id === id) {
                setCurrentQuestionData(data);
                setCurrentQsType(data.questiontype);
            }
        })
    }

    async function changeOption(id) {
        setCurrentSelectedOption(id);

        let obj = currentQusetionData;
        obj.selected = id;

        setCurrentQuestionData(obj);
        reArrangeAll(obj);
    }

    function reArrangeAll(data) {
        // console.log("Rearrange All Data >>> ", data);
        // console.log("currPart >> ", currPart," CurrPosition >>> ", currPosition)
        let mainQs = allQuestionData;
        let part = Object.keys(mainQs);
        if (mainQs[part[currPart]][currPosition].question_id == data.question_id) {
            mainQs[part[currPart]][currPosition] = data;
        } else {
            if (mainQs[part[currPart]][currPosition].havechild == 1) {
                for (let i = 0; i < mainQs[part[currPart]][currPosition].child.length; i++) {
                    if (mainQs[part[currPart]][currPosition].child[i].question_id == data.question_id) {
                        mainQs[part[currPart]][currPosition].child[i] = data;
                        break;
                    }
                }
            }
        }
        // mainQs[part[currPart]][currPosition] = data;
        setAllQuestionData(mainQs);
    }

    function changeMultiOptions(e) {
        let value = e.target.value,
            currQsData = currentQusetionData,
            arr = currentSelectedMultiOptions,
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

        setCurrentQuestionData(currQsData)
        setCurrentSelectedMultiOptions(arr);
        setCurrentSelectedOption(arr.join(","));
        reArrangeAll(currQsData);
        // console.log("Option Arr >>>>", arr)
    }

    function changeMultiOptionDescription(e) {
        setAnswerDesc(e.target.value);
        // let temp = currentQusetionData;
        // temp.answerdesc = e.target.value;
        // setCurrentQuestionData(temp);
        // reArrangeAll(temp);
    }

    function changeHeightUnit(e) {
        setHeightUnit(e.target.value);
        if (e.target.value === 'feet') {
            setHeightString(convertedCentoFeet(sliderValue));
        } else {
            setHeightString(Math.floor(sliderValue))
        }
    }

    function changeWeightUnit(e) {
        let value = e.target.value;
        setWeightUnit(e.target.value);
        if (value === 'kelo') {
            setWeight(Math.ceil(weight / 2.20462))
        } else {
            setWeight(Math.floor(weight * 2.20462))
        }
    }

    function changeWaistUnit(e) {
        setWaistUnit(e.target.value);
        if (e.target.value === 'inch') {
            setWaist(Math.ceil(waist / 2.54))
        } else {
            setWaist(Math.floor(waist * 2.54))
        }
    }

    function changeHipUnit(e) {
        setHipUnit(e.target.value);
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
        if (inches >= 12) {
            feet += Math.floor(inches / 12);
            inches = inches % 12;
        }
        if (inches === 0) {
            return feet + "’";
        } else if (feet === 0) {
            return inches + "’’";
        } else {
            return feet + "’" + inches + "’’";
        }
        // return feet + "’" + inches + "’’";
    };

    const convertedCentoFeetInDb = (values) => {
        var realFeet = (values * 0.3937) / 12;
        var feet = Math.floor(realFeet);
        var inches = Math.round((realFeet - feet) * 12);
        if (inches >= 12) {
            feet += Math.floor(inches / 12);
            inches = inches % 12;
        }
        if (inches === 0) {
            return feet + "";
        } else if (feet === 0) {
            return inches + "";
        } else {
            return feet + "." + inches;
        }
        // return feet + "." + inches;
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

    function increaseValue(type) {
        if (type === "weight") {
            if (checkWeight(weight)) {
                setWeight(weight + 1);
            }
        } else if (type === "waist") {
            if (checkWaist(waist)) {
                setWaist(waist + 1);
            }
        } else if (type === "hip") {
            if (checkHip(hip)) {
                setHip(hip + 1);
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
                }
            } else if (type === "waist") {
                if (checkWaist(Number(value))) {
                    setWaist(Number(value));
                }
            } else if (type === "hip") {
                if (checkHip(Number(value))) {
                    setHip(Number(value));
                }
            }
        }
    }

    function decreaseValue(type) {
        if (type === "weight") {
            if (checkWeight(weight - 1)) {
                setWeight(weight - 1);
            }
        } else if (type === "waist") {
            if (checkWaist(waist - 1)) {
                setWaist(waist - 1);
            }
        } else if (type === "hip") {
            if (checkHip(hip - 1)) {
                setHip(hip - 1);
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

    // function getQuestionNumberWithId(value) {
    //     let arr = [];
    //     value.map((data) => {
    //         arr.push(data);
    //         if (data.havechild == 1) {
    //             // console.log("child >> ", data)
    //             data.child.map((ch) => {
    //                 console.log(ch)
    //                 arr.push(ch);
    //             })

    //         }
    //     });
    //     // console.log("All Qs Arr >> ", arr)
    //     setAllQsArr(arr);
    // }


    function getQsNumber(i) {
        let str = "";
        if (i > 9) {
            str = i;
        } else {
            str = "0" + (i);
        }
        return str;
    }

    function getViewClass(data) {
        let str = "";
        if (data.question_id === 7) {

            if (data.selected && data.selected.length > 0) {
                str = "ansr";
            } else if (currentQusetionData.question_id === data.question_id) {
                str = "prsnqsn";
            } else {
                str = ""
            }
            return str;
        } else {
            if (data.selected != null) {
                str = "ansr";
            } else if (currentQusetionData.question_id === data.question_id) {
                str = "prsnqsn";
            } else {
                str = ""
            }
            return str;
        }
    }

    function disableCalenderQuestion(data) {
        let str = true;
        // console.log("Type of Question_", data.question_id, "is >>> ", data.selected)
        if (data.selected !== null) {
            str = false;
        } else if (currentQusetionData.question_id === data.question_id) {
            str = false;
        } else {
            str = true
        }

        return str;
    }

    function getSidebarClass(id) {
        let str = "";
        if (id === 0) {
            str = "hra_qu_sidbar mybody";
        } else if (id === 1) {
            str = "hra_qu_sidbar mylifestyle";
        } else if (id === 2) {
            str = "hra_qu_sidbar mymind";
        }
        return str;
    }

    function sendUserAgent() {
        let value = {
            orgn_id: authData.orgId,
            user_id: authData.empId,
            campaigndtlid: authData.campaignDtlId,
            user_agent: deviceDetails().user_agent,
            event_name: "save questions",
            device_type: deviceDetails().device_type
        }
        userEventQuestion(value, authData.token);
    }

    function saveQuestion(payload) {

        saveQuestionAnswer(payload, authData.token).then(res => {
            // console.log(" Save Question Answer response >>>>. ", res);
            if (res.data.success) {
                sendUserAgent();

                nextQuestionView();
            } else {
                toast.error(res.data.message);
            }
        })
    }

    function saveLastQuestion(payload) {

        let errorCounter = 0,
            mainQs = allQuestionData,
            part = Object.keys(mainQs),
            body = mainQs[part[0]],
            life = mainQs[part[1]],
            mind = mainQs[part[2]];

        // console.log("mainQs >>> ", mainQs);
        // console.log("Part body>>> ", body);

        body.map((data) => {
            if (data.question_id == 3) {
                if (body[0].selected == 2 && (body[1].selected == 4 || body[1].selected == 5)) {
                    if (data.selected == null) {
                        errorCounter++;
                    }
                }
            } else {
                if (data.selected == null) {
                    // console.log("not answer qustion >>> ", data.question_id)
                    errorCounter++;
                }
            }
        })

        life.map((data) => {
            if (data.selected == null) {
                // console.log("not answer qustion >>> ", data.question_id)
                errorCounter++;
            }
        })

        mind.map((data) => {
            if (data.selected == null) {
                // console.log("not answer qustion >>> ", data.question_id)
                errorCounter++;
            }
        })


        if (errorCounter === 0) {
            saveQuestionAnswer(payload, authData.token).then(res => {
                // console.log(" Save last Question Answer response >>>>. ", res);
                if (res.data.success) {
                    sendUserAgent();
                    let temp = {
                        campaigndtlid: authData.campaignDtlId,
                        emp_id: authData.empId
                    }
                    saveAsComplete(temp, authData.token).then(result => {
                        // console.log("Mark As Complete", result);
                        if (result.data.success) {
                            let req = {
                                "userId": authData.empId,
                                "orgId": authData.orgId,
                                "campaignDtlId": authData.campaignDtlId
                            }
                            sendIndividualReport(req, authData.token).then(rep => {
                                console.log("Send Individual Report >>> ", rep)
                            })
                            setMindCg(true);
                            setIsShow(false);
                        }
                    })

                } else {
                    toast.error(res.data.message);
                }
            })
        } else {
            toast.error("Please answer all questions")
        }
    }

    function continue_bg() {
        // console.log("click on continue")
        setBodyCg(false);
        setIsShow(true);
    }

    function continue_life() {
        setLifeCg(false);
        setIsShow(true);
    }

    function continue_Mind() {
        setMindCg(false);
        setIsShow(false);

        navigate("/congratulations");
    }

    function toggleScreenOne() {
        setScreenOne(false);
        setScreenTwo(true);
    }

    function showSCRone() {
        setScreenTwo(false);
        setScreenOne(true);
    }

    function toggleScreenTwo() {
        setScreenTwo(false);
    }

    function showCalenderQuestion() {
        return (
            <>
                {currentQuestionSet.map((data, i) => <>
                    {disableCalenderQuestion(data) ? <>
                        {data.question_id == 3 ? <>
                            {currentQuestionSet[0].selected == 2 && (currentQuestionSet[1].selected == 4 || currentQuestionSet[1].selected == 5) ? <li className={getViewClass(data)} key={i}>{getQsNumber(data.question_id)}</li> : <></>}
                        </> : <>
                            <li className={getViewClass(data)} key={i}>{getQsNumber(data.question_id)}</li>
                        </>}
                    </> : <>
                        {data.question_id == 3 ? <>
                            {currentQuestionSet[0].selected == 2 && (currentQuestionSet[1].selected == 4 || currentQuestionSet[1].selected == 5) ? <li className={getViewClass(data)} key={i} onClick={() => clickQuestionId(data.question_id)}>{getQsNumber(data.question_id)}</li> : <></>}
                        </> : <>
                            <li className={getViewClass(data)} key={i} onClick={() => clickQuestionId(data.question_id)}>{getQsNumber(data.question_id)}</li>
                            {data.havechild == 1 ? <>

                                {data.child.map((ch, c) => <>
                                    {/* {ch.parentoptions.split(",").indexOf(data.selected + "") < 0 */}
                                    {!selectedValue(ch.parentoptions, data.selected) ? <></> : <>
                                        {disableCalenderQuestion(ch) ? <>
                                            <li className={getViewClass(ch)} key={c}>{getQsNumber(ch.question_id)}</li>
                                        </> : <>
                                            <li className={getViewClass(ch)} key={c} onClick={() => clickQuestionId(ch.question_id)}>{getQsNumber(ch.question_id)}</li>
                                        </>
                                        }</>
                                    }
                                </>)}
                            </> : <></>}
                        </>}
                    </>
                    }
                </>
                )}
            </>
        )
    }

    function selectedValue(checkData, selectedData) {
        let found = false;
        if (selectedData !== null && (checkData !== null || checkData !== undefined || checkData !== "")) {
            let selData = selectedData.toString();
            let chksp = checkData.split(","),
                selsp = selData.split(",");
            if (selsp !== null) {
                for (let i = 0; i < selsp.length; i++) {
                    if (chksp.indexOf(selsp[i] + "") > -1) {
                        found = true;
                        break;
                    }
                }
            }
        }
        return found
    }

    function clickSelectTab() {
        setIsOpenSelect(!isOpenSelect);

    }
    return (
        <>
            <ToastContainer hideProgressBar theme='colored' />
            {infoPage ? <Info_pages onShow={showQuestion} /> : <></>}
            {screenOne ? <Informative_screen_one
                showScreenTwo={() => toggleScreenOne()} /> : <></>}
            {screenTwo ? <Informative_screen_two goToMain={() => toggleScreenTwo()} backToPrev={() => showSCRone()} /> : <></>}
            <div className={currPart === 0 ? "wrapper hraquestionSection mob_resp mybodytop" :
                currPart === 1 ? "wrapper hraquestionSection mob_resp mylifstyletop" : "wrapper hraquestionSection mob_resp mymindtop"} hidden={!isShow}>


                <div className="main">
                    <div className="sidebar-content" id="sidebar-sticky">
                        <div className="progress">
                            {/* <span className="prog" style={{ width: "60" }}></span> */}
                            <Box sx={{ width: '100%' }}>
                                {currPart === 0 ?
                                    <LinearProgressWithLabelMyBody value={progress} /> :
                                    currPart === 1 ? <LinearProgressWithLabelMyLifeStyle value={progress} /> :
                                        <LinearProgressWithLabelMyMind value={progress} />
                                }
                            </Box>
                        </div>
                        <div className="has-mnu bg-hra-col">
                            <div className="clk_headng">
                                <a className="nav-link dropdown-toggle d-none d-sm-inline-block" href="#" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <img src={IMAGE_NAME.GRID_POP} className="block" alt="Chris Wood" />
                                </a>


                                <div className="dropdown-menu dropdown-menu-end">
                                    <div className="persn_dtl_op">
                                        <h4>{currentQusetionData.categorydesc}</h4>
                                        <ul>
                                            {showCalenderQuestion()}
                                        </ul>
                                        <div className="coln_to_knw">
                                            <ul>
                                                <li className="ansr">
                                                    <span>&nbsp;</span>
                                                    Answered
                                                </li>
                                                <li>
                                                    <span>&nbsp;</span>
                                                    Not answered
                                                </li>
                                                <li className="prsnqsn">
                                                    <span>&nbsp;</span>
                                                    Present Question
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {currPart === 0 ?
                                <div className={isOpenSelect ? "selectBox active show" : "selectBox"} onClick={() => clickSelectTab()}>
                                    <div className="selectBox__value">
                                        <button className="nav-link active" type="button" onClick={() => clickTab(0)}>
                                            <img src={IMAGE_NAME.MY_BODY} />
                                            My Body
                                        </button>
                                    </div>
                                    <div className="dropdown-menu">
                                        <button className="nav-link active" type="button" onClick={() => clickTab(1)}>
                                            <img src={IMAGE_NAME.MY_LIFESTYLE} />
                                            My Lifestyle
                                        </button>
                                        <button className="nav-link active" type="button" onClick={() => clickTab(2)}>
                                            <img src={IMAGE_NAME.MY_MIND} /> My Mind
                                        </button>

                                    </div>
                                </div> :
                                currPart == 1 ?
                                    <div className={isOpenSelect ? "selectBox active show" : "selectBox"} onClick={() => clickSelectTab()}>
                                        <div className="selectBox__value">
                                            <button className="nav-link active" type="button" onClick={() => clickTab(1)}>
                                                <img src={IMAGE_NAME.MY_LIFESTYLE} />
                                                My Lifestyle
                                            </button>
                                        </div>
                                        <div className="dropdown-menu"><button className="nav-link active" type="button" onClick={() => clickTab(0)}>
                                            <img src={IMAGE_NAME.MY_BODY} />
                                            My Body
                                        </button>
                                            <button className="nav-link active" type="button" onClick={() => clickTab(2)}>
                                                <img src={IMAGE_NAME.MY_MIND} />
                                                My Mind
                                            </button>

                                        </div>
                                    </div> :
                                    <div className={isOpenSelect ? "selectBox active show" : "selectBox"} onClick={() => clickSelectTab()}>
                                        <div className="selectBox__value">
                                            <button className="nav-link active" type="button" onClick={() => clickTab(2)}>
                                                <img src={IMAGE_NAME.MY_MIND} /> My Mind
                                            </button>
                                        </div>
                                        <div className="dropdown-menu">
                                            <button className="nav-link active" type="button" onClick={() => clickTab(1)}>
                                                <img src={IMAGE_NAME.MY_LIFESTYLE} />
                                                My Lifestyle
                                            </button>
                                            <button className="nav-link active" type="button" onClick={() => clickTab(0)}>
                                                <img src={IMAGE_NAME.MY_BODY} />
                                                My Body
                                            </button>

                                        </div>
                                    </div>
                            }
                            <div className="comp_rit_log">
                                <img src={companyLogo} />
                            </div>
                        </div>
                    </div>
                    <main>
                        <div className="container-fluid p-0">

                            <div className="" id="mybodyt" role="tabpanel" aria-labelledby="access-tab">
                                <div className="mobile_qstn_sc">

                                    <div id="selectage_mob1" className="qstn_sec">
                                        <div className="bg-hra-col">
                                            {currPart === 0 && currPosition === 0 ? <><button>&nbsp;</button></> :
                                                <button onClick={() => goBack()}><i className="bi bi-chevron-double-left"></i> back</button>
                                            }
                                            <div className="qstn_sec_hed">
                                                {/* <span>{currentQusetionData.questionsequence > 9 ? currentQusetionData.questionsequence : "0" + currentQusetionData.questionsequence}</span> */}

                                                <p>{currentQusetionData.questiondesc}</p>
                                                <span>
                                                    {currentQusetionData.qs_icon !== null ? <img src={IMAGE_URL_ASSETS_MOBILE + currentQusetionData.qs_icon} /> : (currentQusetionData.questionsequence > 9 ? currentQusetionData.questionsequence : "0" + currentQusetionData.questionsequence)}
                                                </span>
                                                {/* {currentQusetionData.briefdesc !== null ? <>
                                                    <a className="nav-link dropdown-toggle d-none d-sm-inline-block" href="#"
                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                            className="bi bi-info-circle-fill"></i></a>

                                                    <div className="dropdown-menu dropdown-menu-end">
                                                        <div className="persn_dtl_op">
                                                            <p dangerouslySetInnerHTML={{ __html: currentQusetionData.briefdesc }}></p>
                                                        </div>
                                                    </div>
                                                </> : <></>
                                                } */}
                                            </div>
                                        </div>
                                        <div className="qstn_sec_selct">
                                            {currentQusetionData.questiontype == "single" ?
                                                currentQusetionData.options[0].iconurl != null ?
                                                    <div className="select_gnd">
                                                        <div className="gndr">
                                                            {currentQusetionData ?
                                                                currentQusetionData.options ?
                                                                    currentQusetionData.options.map((op, j) =>
                                                                        <div className="col text-center" key={j}>
                                                                            <input
                                                                                type="radio"
                                                                                name="imgbackground"
                                                                                id={"img1" + op.option_id}
                                                                                className="d-none imgbgchk"
                                                                                checked={op.option_id == currentQusetionData.selected}
                                                                                value={op.option_id}
                                                                                onChange={() => changeOption(op.option_id)}
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
                                                            {currentQusetionData ?
                                                                currentQusetionData.options ?
                                                                    currentQusetionData.options.map((op, j) =>
                                                                        <p key={j}>
                                                                            <input key={j} type="radio" id={"test" + op.option_id} name="radio-group" checked={op.option_id == currentQusetionData.selected} value={op.option_id} onChange={() => changeOption(op.option_id)} />
                                                                            <label htmlFor={"test" + op.option_id}>{op.option_text}</label>
                                                                        </p>
                                                                    ) : <></> :
                                                                <></>
                                                            }
                                                        </div>
                                                    </div> :
                                                <>
                                                    {currentQusetionData.questiontype == "radio" ? <>
                                                        {currentQusetionData.options[0].iconurl != null ?
                                                            <div className="select_age water_radio">
                                                                <div className="siz_typ">
                                                                    {currentQusetionData ?
                                                                        currentQusetionData.options ?
                                                                            currentQusetionData.options.map((op, j) =>
                                                                                <p key={j}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        name="imgbackground"
                                                                                        id={"img1" + op.option_id}
                                                                                        className="d-none imgbgchk"
                                                                                        checked={op.option_id == currentQusetionData.selected}
                                                                                        value={op.option_id}
                                                                                        onChange={() => changeOption(op.option_id)}
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
                                                                    {currentQusetionData ?
                                                                        currentQusetionData.options ?
                                                                            currentQusetionData.options.map((op, j) =>
                                                                                <p key={j}>
                                                                                    <input key={j} type="radio" id={"test" + op.option_id} name="radio-group" value={op.option_id} onChange={() => changeOption(op.option_id)} checked={op.option_id == currentQusetionData.selected} />
                                                                                    <label htmlFor={"test" + op.option_id}>{op.option_text}</label>
                                                                                </p>
                                                                            ) : <></> :
                                                                        <></>
                                                                    }
                                                                </div>
                                                            </div>
                                                        }
                                                    </> : <>
                                                        {currentQusetionData.questiontype == "biometric" ? <>
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
                                                                                    color="primary"
                                                                                />
                                                                            </Box>
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
                                                            </div>

                                                        </> : <>
                                                            {currentQusetionData.questiontype == "multi" ? <>
                                                                <div className="select_mstus">
                                                                    <div className="blod_tst">
                                                                        {currentQusetionData ?
                                                                            currentQusetionData.options ?
                                                                                currentQusetionData.options.map((op, j) =>
                                                                                    <>
                                                                                        <p key={j}>
                                                                                            <input
                                                                                                key={j}
                                                                                                type="checkbox"
                                                                                                id={"test" + op.option_id}
                                                                                                name="checkbox-group"
                                                                                                checked={op.selected}
                                                                                                value={op.option_id}
                                                                                                onChange={(e) => changeMultiOptions(e)}
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
                                                                {currentQusetionData.questiontype == "feedback" ?
                                                                    <>
                                                                        <div className="select_age roumd_radio">
                                                                            <div className="siz_typ">
                                                                                {currentQusetionData ?
                                                                                    currentQusetionData.options ?
                                                                                        currentQusetionData.options.map((op, j) =>
                                                                                            <p key={j}>
                                                                                                <input key={j} type="radio" id={"test" + op.option_id} name="radio-group" checked={op.option_id == currentQusetionData.selected} value={op.option_id} onChange={() => changeOption(op.option_id)} />
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


                                        <div className="qstn_btn butn_dv">
                                            {currentQusetionData.question_id < 56 ?
                                                <button className="btn btn-primary btn-lg" onClick={() => goNext(currentQusetionData.question_id)}>Continue</button> :
                                                <button className="btn btn-primary btn-lg" onClick={() => submitLast(currentQusetionData.question_id)}>Submit</button>}
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </main>
                </div>

            </div>
            {bodyCg ? <Congratulations_body_m onContinueclick={() => continue_bg()} /> : <></>}

            {lifeCg ? <Congrtulation_life_m onContinueclick={() => continue_life()} /> : <></>}

            {mindCg ? <Congratulations_mind_m onContinueclick={() => continue_Mind()} /> : <></>}
        </>
    )
}

export default MobileQuestions;