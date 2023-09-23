import React from 'react'
import Modal from 'react-bootstrap/Modal';
import { GetEncrypt } from '../../service/Common'
import { contactToAdmin } from '../../service/Services';
import { useNavigate } from "react-router-dom";

const loginLogo = require('../../assets/images/login-logo.png');

const sucsicon = require('../../assets/images/sucs-icon.png');
function ContactAdmin(props) {
    let navigate = useNavigate();
    const [show, setShow] = React.useState(false);

    
    const [comments, setComments] = React.useState("");


    const [divShow, setDivShow] = React.useState(false);


    const onSubmit = () => {
        var data = {
            "userId": props.userId,
            "userMsg": comments,
            "username":props.userName
        }
        contactToAdmin(data).then(result => {
            if (result.data.success) {
                setDivShow(true)
                setTimeout(() => {
                    navigate("/")
                }, 5000);
            }
        })
    }


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <button type='button' className="submit no-bg" onClick={handleShow}>Contact Your admin</button>

            <Modal show={show} onHide={handleClose} >
            {
                divShow ?
                    
                        <div class="modal-dialog modal-dialog-centered modal-md" style={{ margin: "0" }}>
                            <div class="modal-content bg-white">
                                <div class="pop-header">
                                    <div class="container-fluid">
                                        <div class="row align-items-center">
                                        <button type="button" data-bs-dismiss="modal" aria-label="Close" className="btn-close" onClick={handleClose}></button>
                                            <div class="headr_titl mt-5">
                                                <h3>&nbsp;</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-body py-0">
                                    <div class="container-fluid ">
                                        <div class="row">
                                            <div class="col-md-12 col-sm-12">
                                                <div class="sory_dv sucs">
                                                    <img src={loginLogo} />
                                                    <p>&nbsp;</p>
                                                    <img src={sucsicon} />
                                                    <strong class="d-block">Success</strong>
                                                    
                                                    
                                                    <p>&nbsp;</p>
                                                    <p>Your report regarding login error has been submitted successfiully</p>


                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                </div>
                            </div>
                        </div>
                    :
                        <div className="modal-dialog modal-dialog-centered modal-md" style={{ margin: "0" }}>
                            <div className="modal-content bg-white">
                                <div className="pop-header">
                                    <div className="container-fluid">
                                        <div className="row align-items-center">
                                            <button type="button" data-bs-dismiss="modal" aria-label="Close" className="btn-close" onClick={handleClose}></button>
                                            <div className="headr_titl mt-5">
                                                <h3>&nbsp;</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-body py-0">
                                    <div className="container-fluid ">
                                        <div className="row">
                                            <div className="col-md-12 col-sm-12">
                                                <div className="sory_dv">
                                                    <img src={loginLogo} />
                                                    <h3>Contact Your Admin</h3>
                                                    {/* <p>Your report will be sent to <a href="mailto:admin@hygge.io">admin@hygge.io</a></p> */}
                                                    <p>Your report will be sent to <a href={"mailto:"+props.userName} >{props.userName}</a></p>
                                                    <div className="typ_msg">

                                                        <textarea
                                                            className="form-control"
                                                            id=""
                                                            rows="3"
                                                            placeholder="Please type your comments here "
                                                            value={comments}
                                                            onChange={(e) => setComments(e.target.value)}
                                                            required
                                                        >

                                                        </textarea>
                                                    </div>
                                                    <div className="typ_msg_btn">
                                                        <button
                                                            className="btn btn-lg btn-primary"
                                                            onClick={onSubmit}
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                </div>
                            </div>
                        </div>
                    

            }
            </Modal>


        </>
    )
}

export default ContactAdmin