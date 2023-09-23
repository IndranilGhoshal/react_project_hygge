import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import Loader_Text from "./loading_text.json";
import { useNavigate, useParams } from "react-router-dom";
import { validateToken } from "../../service/questionService";
import { hideLoader } from "../../service/Common";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Welcome_page(props) {

    // var token_id = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBpZCI6IjQ5IiwiZW1wbGljZW5jZWlkIjoiMTAiLCJjYW1wYWlnbmR0bGlkIjoiMTIiLCJjYW1wYWlnbmlkIjoiMTIiLCJyZXF0aW1lIjoxNjc1ODU0MTcwNzM2LCJpYXQiOjE2NzU4NTQxNzB9.26NHtf2kAyP4PoUNpX1Smfsg5VqV9WjHFkcmTzCPPio";
    const { token_id } = useParams();

    // console.log("Token Id >>>> ", token_id);
    let navigate = useNavigate();

    const [errorMeaage, setErrorMessage] = useState("false");
    const [show, setShow] = useState(false);

    const handleClose = () => {
        window.location.replace('https://www.google.com');
        window.history.go(1);
        setShow(false);
    }


    // const handleShow = () => setShow(true);

    useEffect(() => {
        getValidation();
    }, []);

    // setTimeout(() => {
    //     hideLoader()
    // }, 1000);

    function getValidation() {
        let payload = {
            token: token_id
        };
        validateToken(payload).then(res => {
            // console.log(" validate Token response >>>>. ", res);
            if (res.data.success) {
                let data = res.data.response;
                if (data.isComplete === 1) {
                    setShow(true)
                    setErrorMessage('Campaign already completed');
                } else {
                    // localStorage.setItem("qs_campaign_data", JSON.stringify(data));
                    sessionStorage.setItem("qs_campaign_data", JSON.stringify(data));
                    navigate("/welcome_login");
                }
                hideLoader()
            } else {
                setShow(true)
                setErrorMessage(res.data.message);
                hideLoader()
            }
        })
    }


    return (
        <>
            <Lottie animationData={Loader_Text} loop={true} style={{ width: "100%", height: "90vh" }} />
            <Modal show={show} >
                <Modal.Body>{errorMeaage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}

export default Welcome_page;