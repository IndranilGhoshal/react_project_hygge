// ------------- Import Files ------------- //
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserData, dateDiff, showLoader, hideLoader } from '../../../service/Common.js'
import { userEvent, userLogout, getNotification, readNotification } from '../../../service/Services';
import { IMAGE_URL, IMAGE_URL_ASSETS, PAYLOAD_ENCRYCT } from '../../../config/app_url';
import Modal from 'react-bootstrap/Modal';
//-------------- Import files variables --------------//
const bellicon = require('../../../assets/images/bell-icon.png');
const profileicon = require('../../../assets/images/profile-img.png');
//Stateless Functional Component named LoggedLayout//
function LoggedLayout() {
    /* Variables */
    const navigate = useNavigate();
    const [imgUrl, setImgUrl] = useState("")
    const [name, setName] = useState("")
    const [notification, setNotification] = useState([])
    const [notificationCount, setNotificationCount] = useState('')
    /* Functions */
    //------------------UseEffect-----------------//
    useEffect(() => {
        setImgUrl(getUserData().response.imageurl)
        setName(getUserData().response.full_name)

        getNotificationFun()
        // console.log(name.split(" ").map((n)=>n[0]).join(""))


        let interval = setInterval(() => {
            getNotificationFun()
        }, 30000);

        return () => {
            clearInterval(interval);
        };

    }, [])
    //-------------- callback functions -------------//
    const logoutFun = () => {
        var data = {
            "userLogId": getUserData().response.userLogId
        }
        userLogout(data).then(result => {
            if (result.data.success) {
                userEvent("logout")
                // localStorage.removeItem("user");
                // localStorage.removeItem("userRole");
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("userRole");
                sessionStorage.removeItem("comList");
                sessionStorage.removeItem("userFilter");
                
                navigate("/")
            }
        })
    }
    function getNotificationFun() {
        var data = {
            "orgn_id": getUserData().response.orgn_id,
            "user_id": getUserData().response.userId
        }
        getNotification(data).then(result => {
            if (result.data.success) {
                setNotification(result.data.response.notification)
                setNotificationCount(result.data.response.count)

            }
        })
    }
    const readNotificationFun =()=>{
        var data = {
            "orgn_id": getUserData().response.orgn_id,
            "user_id": getUserData().response.userId
        }
        readNotification(data).then(result => {
            if (result.data.success) {
                console.log(result.data)
            }
        })
    }

   const [show, setShow] = useState(false);


    const handleClose = () => {
        showLoader()
        setShow(false);
        setTimeout(() => {
           hideLoader()
        }, 1000);
     }
     const handleShow = () => {
        showLoader()
        setShow(true)
        setTimeout(() => {
           hideLoader()
        }, 1000);
     };

    return (
        <>
            <ul className="navbar-nav navbar-align nav-bar-ul">

                {/* Notifications */}
                <li className="nav-item dropdown">

                    <a
                        className="nav-icon dropdown-toggle no-dropdown-arrow"
                        href="#"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        onClick={readNotificationFun}
                    >
                        <div className="position-relative">
                            <img src={bellicon} alt="bell" />
                            {notificationCount==0?null:<span className="indicator">{notificationCount}</span>}
                            
                        </div>
                    </a>


                    <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0"
                        aria-labelledby="alertsDropdown">

                        <div className="dropdown-menu-header">
                            {notification.length} New Notifications
                        </div>

                        <div className="list-group smootScrol">

                            {
                                notification.map((item, index) => (
                                    <a key={index} href="#" className="list-group-item">
                                        <div className="row g-0 align-items-center">
                                            <div className="col-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                    strokeLinecap="round" strokeLinejoin="round"
                                                    className="feather feather-user-plus text-success">
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="8.5" cy="7" r="4"></circle>
                                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                                </svg>
                                            </div>
                                            <div className="col-10">
                                                <div className="text-dark">{item.subject}</div>
                                                <div className="text-muted small mt-1">{item.body}</div>
                                                <div className="text-muted small mt-1">{dateDiff(item.created_at)}</div>
                                            </div>
                                        </div>
                                    </a>
                                ))
                            }




                        </div>

                        <div className="dropdown-menu-footer">
                            <a href="#" className="text-muted">Show all notifications</a>
                        </div>
                    </div>
                </li>

                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle d-none d-sm-inline-block" href="#" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        {
                            getUserData().response.imageurl ? <img src={IMAGE_URL + imgUrl}
                                className="avatar img-fluid rounded-circle me-1 d-sm-inline-block" alt="Chris Wood" />
                                : <span className='name_split'>{name.split(" ").map((n) => n[0]).join("")}</span>
                        }
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" onClick={handleShow}>Sign out</a>
                    </div>
                </li>

            </ul>

            <Modal show={show} onHide={handleClose}>
            <div className="addrole">
               <div className="modal-header">
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
               </div>
               <div className="modal-body">
                  <div className="mod_body">
                     <h5 className="modal-title text-center">Confirm logout</h5>
                     <p className='logtxt'>Are you sure you want to logout?</p>
                     <div className="frm_modl">
                     <div className="btn_edit"><div className='logbtn'><button class="btn btn-nobg btn-witbord" onClick={handleClose}>Cancel</button><button class="btn btn-primary" onClick={logoutFun}>Yes</button></div></div>
                    
                     </div>
                  </div>
               </div>
            </div>
         </Modal>
        </>
    )
}

export default LoggedLayout