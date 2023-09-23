import React,{useEffect, useState} from 'react'
import Modal from 'react-bootstrap/Modal';

export default function PrivacyPolicy(props) {
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    


    return (
        <>
            <a style={{color:'#428FEC', textDecoration: 'underline'}} onClick={handleShow}>
            Privacy Policy
            </a>

            <Modal show={show} onHide={handleClose}>
            <Modal.Body className='p-0'>
                    <div className='bg-white rounded-3 '>
                    <div className="pop-header">
                        <div className="container-fluid">
                            <div className="row align-items-center">
                                <button type="button" onClick={handleClose} className="btn-close"></button>
                                <div className="headr_titl mt-5 mb-5">
                                    <h3>Privacy & Policy</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <div className="term_con px-4">
                                <div className="editor_div_camp editor_cls" dangerouslySetInnerHTML={{ __html: props.data }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

