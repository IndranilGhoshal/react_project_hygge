import React from 'react'
import Modal from 'react-bootstrap/Modal';

export default function TermsAndConditions() {
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <a style={{color:'#428FEC', textDecoration: 'underline'}} onClick={handleShow}>
                Terms and Conditions
            </a>

            <Modal show={show} onHide={handleClose}>
                <Modal.Body className='p-0'>
                    <div className='bg-white rounded-3 '>
                    <div className="pop-header">
                        <div className="container-fluid">
                            <div className="row align-items-center">
                                <button type="button" onClick={handleClose} className="btn-close"></button>
                                <div className="headr_titl mt-5 mb-5">
                                    <h3>Terms and Conditions</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <div className="term_con px-4">
                                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots
                                        in a piece of classical Latin literature from 45 BC, making it over 2000 years
                                        old. Richard McClintock, a Latin professor at Hampden-Sydney College in
                                        Virginia, looked up one of the more obscure Latin words, consectetur, from a
                                        Lorem Ipsum passage, and going through the cites of the word in classical
                                        literature, discovered the undoubtable source. Lorem Ipsum comes from sections
                                        1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and
                                        Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of
                                        ethics, very popular during the Renaissance. The first line of Lorem Ipsum,
                                        "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
                                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for
                                        those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et
                                        Malorum" by Cicero are also reproduced in their exact original form, accompanied
                                        by English versions from the 1914 translation by H. Rackham.
                                    </p>
                                    <p>&nbsp;</p> <p>&nbsp;</p>
                                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots
                                        in a piece of classical Latin literature from 45 BC, making it over 2000 years
                                        old. Richard McClintock, a Latin professor at Hampden-Sydney College in
                                        Virginia, looked up one of the more obscure Latin words, consectetur, from a
                                        Lorem Ipsum passage, and going through the cites of the word in classical
                                        literature, discovered the undoubtable source. Lorem
                                        College in Virginia, looked up one of the more obscure Latin words, consectetur,
                                        from a Lorem Ipsum passage, and going through the cites of the word in classical
                                        literature, discovered the undoubtable source. Lorem
                                    </p>
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

