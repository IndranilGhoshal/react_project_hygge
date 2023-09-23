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
    const [limit, setLimit] = useState(true)

    /* Functions */
    //------------------UseEffect-----------------//
    useEffect(() => {
        setImgUrl(getUserData().response.imageurl)
        setName(getUserData().response.full_name)

        getNotificationFun()

    }, [])
    //-------------- callback functions -------------//
    const logoutFun = () => {
        var data = {
            "userLogId": getUserData().response.userLogId
        }
        userLogout(data).then(result => {
            if (result.data.success) {
                userEvent("logout")
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("userRole");
                sessionStorage.removeItem("comList");
                sessionStorage.removeItem("userFilter");
                
                navigate("/")
            }
        })
    }

    useEffect(()=>{
        let interval = setInterval(() => {
            getNotificationFun()
        }, 30000);

        getNotificationFun()

        return () => {
            clearInterval(interval);
        };
        

    },[limit])


    function getNotificationFun() {

        // console.log("limit", limit)

        var data = {
            "orgn_id": getUserData().response.orgn_id,
            "user_id": getUserData().response.userId,
            "isLimit": limit
        }
        getNotification(data).then(result => {
            if (result.data.success) {
                setNotification(result.data.response.notification)
                setNotificationCount(result.data.response.count)
            }
        })
    }

    function getNotificationMoreFun() {
        var data = {
            "orgn_id": getUserData().response.orgn_id,
            "user_id": getUserData().response.userId,
            "isLimit":false
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
                getNotificationFun()
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

     const [showDiv, setShowDiv]= useState(false)

     const showDivFun=()=>{
        if(!showDiv){
            setShowDiv(true)
        }else{
            setShowDiv(false) 
            setLimit(true)
        }
     }

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
                        onClick={showDivFun}
                    >
                        <div className="position-relative">
                            <img src={bellicon} alt="bell" />
                            {notificationCount==0?null:<span className="indicator">{notificationCount}</span>}
                            
                        </div>
                    </a>


                    <div className={`dropdown-menu dropdown-menu-lg dropdown-menu-end py-0 notifc ${showDiv?"notfy_div":""}`}
                        aria-labelledby="alertsDropdown">

                        <div className="dropdown-menu-header">
                            <strong>
                            {notification.length} Notifications</strong>
                            <span style={{cursor:"pointer"}} onClick={readNotificationFun}><i class="bi bi-check2-all"></i> Mark all as read</span>
                        </div>

                        <div className="list-group smootScrol">

                            {
                                notification.map((item, index) => (
                                    <a key={index} href="#" className="list-group-item">
                                        <div className="row g-0 align-items-center">
                                            <div className="col-md-12">
                                                {/* <div className="text-dark">{item.subject}</div>
                                                <div className="text-muted small mt-1">{item.body}</div>
                                                <div className="text-muted small mt-1">{dateDiff(item.created_at)}</div> */}
                                                <ul>
                                                <li style={{backgroundColor: item.is_read==0 ? "#dbd6d6" : ""}}>
                                                    <strong>{item.body}</strong>
                                                    <p>{dateDiff(item.created_at)}</p>
                                                </li> 
                                                </ul>
                                            </div>
                                        </div>
                                    </a>
                                ))
                            }




                        </div>

                        <div className="dropdown-menu-footer">
                            <a className="text-muted" onClick={()=>{setLimit(false)}}>View all notification <i class="bi bi-chevron-up"></i></a>
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
                    <div className="dropdown-menu dropdown-menu-end signout_try">
                        <div className='locout_tray'>
                            <div className='locout_tray_l'>
                                <span>{name.split(" ").map((n) => n[0]).join("")}</span>
                            </div>
                            <div className='locout_tray_r'>
                                <strong>{getUserData().response.full_name}</strong>
                                <p>{getUserData().response.useremail}</p>
                            </div>
                        </div>
                        <a className="dropdown-item" onClick={handleShow}> <i class="bi bi-upload"></i> Sign out</a>
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