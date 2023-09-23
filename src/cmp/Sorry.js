import React from 'react'
import ContactAdmin from './Modal/ContactAdmin';
import PrivacyPolicy from './Modal/PrivacyPolicy';
import TermsAndConditions from './Modal/TermsAndConditions';
import { useParams } from 'react-router-dom'
import { getOrgMainEmail } from '../service/Services';
import { hideLoader, showLoader } from '../service/Common';
const loginImage = require('../assets/images/login-image.png');
const loginLogo = require('../assets/images/login-logo.png');
const sorryImage = require('../assets/images/sorry-image.png');




function Sorry() {

    let { id } = useParams();

    const [userName, setUserName] = React.useState("")

    React.useEffect(() => {
        showLoader()

        setTimeout(() => {
            hideLoader()
        }, 1000);

        let data = {
            "userId": id
        }
        getOrgMainEmail(data).then(result => {
            
            if (result.data.success) {

                setUserName(result.data.response.username)
                
            }


        })
        
    }, [])


    return (
        <div>
            <div className="wrapper ">
                <div className="main_div">
                    <div className="logn_dv_in_lf"><img src={loginImage} /></div>
                    <div className="logn_dv_in">
                        <div className="logn_dv_in_lft">
                            <img src={loginLogo} />
                            <h2><img src={sorryImage} /></h2>

                            <form id="form1">

                                <div className="input-container hasinpt ic2 second-example">
                                    <p className="sory_txt">We are Temporarily facing problem <br />
                                        activating your account</p>
                                </div>




                                <ContactAdmin userId={id} userName={userName} />

                            </form>
                        </div>
                        <div className="btm_sc">
                            <p>By Logging in you agree to our <br /> 
                            {/* <TermsAndConditions /> and  */}
                            
                            <PrivacyPolicy /></p>
                        </div>
                    </div>




                </div>

            </div>

        </div>
    )
}

export default Sorry