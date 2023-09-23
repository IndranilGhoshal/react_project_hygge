
//----------------- Layout Component -----------------//
//-----------Import Files------------//
import React, {useEffect, useState} from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getUserData, imgUrlAssets, showLoader, hideLoader } from '../../../service/Common'
import { userLogout, getUserMenu, userEvent } from '../../../service/Services';
// -------------- Import Images -------------- //
const loginLogo = require('../../../assets/images/side-bar-logo.png');
const icon7 = require('../../../assets/images/icon7.png');
//Stateless Functional Component named Layout//
function Layout() {
    /* Variables */
    let navigate = useNavigate();
    //1= Master Admin, 2= Super Admin, 3= Admin
    const [menuArray, setMenuArray] = useState([])
    const [url, setUrl]= useState("")
    const [urlClass, setUrlClass]= useState(false)

    /* Functions */
    //------------------UseEffect-----------------// 
    useEffect(() => {
        if (getUserData().response.parent_orgn_id == "0") {
            getUserMenuFun(1)
        } else {
            if (getUserData().response.is_child == "0") {
                getUserMenuFun(2)
            } else {
                getUserMenuFun(3)

            }
        }
        showLoader()
        setUrl("/"+window.location.href.split('/')[4])
        if("/"+window.location.href.split('/')[4] == '/roleandaccess'){
            setUrlClass(true)
        }else{
            setUrlClass(false)
        }
        setTimeout(() => {
            hideLoader()
        }, 1000);


    }, [])
    //-------------- callback functions -------------//
    function openNav() {
        var element = document.getElementById("sidebar");
        element.classList.toggle("collapsed");
    }
    function getUserMenuFun(level) {
        var data = {
            "orgn_id": getUserData().response.orgn_id + "",
            "user_id": getUserData().response.userId + "",
            "type": level + ""
        }
        getUserMenu(data).then(result => {
            if (result.data.success) {
                setMenuArray(result.data.response)
                sessionStorage.setItem("userRole", JSON.stringify(result.data.response))
            }
        })
    }
    const logoutFun = () => {
        var data = {
            "userLogId": getUserData().response.userLogId
        }
        showLoader()
        userLogout(data).then(result => {
            hideLoader()
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


    const routerChange=(url)=>{
        showLoader()
        navigate("/users"+url)
        if(url == '/roleandaccess'){
            setUrlClass(true)
        }else{
            setUrlClass(false)
        }
        setTimeout(() => {
            hideLoader()
        }, 1000);
    }

    return (
        <div>
            <div className="body-slide body-pd" data-sidebar-behavior="sticky" style={{ background: '#F5F5F5' }}>
                <div className={`wrapper dashboardSection ${urlClass ? "div-exp" : ""}`}>


                    {/* LEFT SIDEBAR */}
                    <nav id="sidebar" className="sidebar">
                        <div className="sidebar-content" id="sidebar-sticky">

                            <div className="sidebar-brand text-start">
                                <button className="icon icon--transparent animated rubberBand d-btn" onClick={openNav}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </button>
                                <img className="d-inline-block align-middle" src={loginLogo} />
                            </div>



                            <ul className="sidebar-nav" style={{ paddingLeft: '0' }}>


                                {

                                    menuArray.map((item, index) => (

                                        <li className={`sidebar-item ${item.url == url ? "activeSideMenu" : ""}  `} key={index}>
                                            <a className="sidebar-link" onClick={()=>{routerChange(item.url); setUrl(item.url)} }>
                                                <img className="d-inline-block align-middle me-2" src={imgUrlAssets+item.logo} alt={item.menulabel} />
                                                <span className="align-middle">{item.menulabel}</span>
                                            </a>
                                        </li>

                                    ))
                                }


                                {/* <li className="sidebar-item">
                                    <a className="sidebar-link" onClick={logoutFun}>
                                        <img className="d-inline-block align-middle me-2" src={icon7} alt="opportunity" />
                                        <span className="align-middle"> Logout</span>
                                    </a>
                                </li> */}


                            </ul>
                        </div>
                    </nav>

                    {/* MAIN */}

                    <Outlet />




                </div>
            </div>
        </div>
    )
}

export default Layout