import React from 'react'
import './App.css';
import { Helmet } from "react-helmet";
import 'react-toastify/dist/ReactToastify.css';

import './assets/css/style.css'
import './assets/css/responsive.css'


// import './assets/vendor/apexcharts/apexcharts.min.js'
// import './assets/vendor/bootstrap/js/bootstrap.bundle.min.js'
// import './assets/vendor/chart.js/chart.min.js'
// import './assets/vendor/echarts/echarts.min.js'
// import './assets/vendor/quill/quill.min.js'
// import './assets/vendor/simple-datatables/simple-datatables.js'
// import './assets/vendor/tinymce/tinymce.min.js'
// import './assets/vendor/php-email-form/validate.js'


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './cmp/Login';
import LoginNew from './cmp/LoginNew';
import CreateNewPassword from './cmp/CreateNewPassword';
import EnterOtp from './cmp/EnterOtp';
import ForgotPassword from './cmp/ForgotPassword';
import Sorry from './cmp/Sorry';

import Users from './cmp/Module/User/Users';
import Protected from './cmp/Module/User/Protected';
import Dashboard from './cmp/Module/User/Dashboard';
import CompanyDashboard from './cmp/Module/User/CompanyDashboard';
import CompanyDetails from './cmp/Module/User/CompanyDetails';
import AddCompany from './cmp/Module/User/AddCompany';
import NewCompany from './cmp/Module/User/NewCompany';
import RoleAndAccess from './cmp/Module/User/RoleAndAccess';
import Hra from './cmp/Module/User/Hra';
import Setting from './cmp/Module/User/Setting';
import Reports from './cmp/Module/User/Reports';
import Question from '../src/cmp/Questions/Question';
import Employee from './cmp/Module/User/Employee';
import Campaign from './cmp/Module/User/Campaign';
import CampaignDetails from './cmp/Module/User/CampaignDetails';
import CampaignDetailsParticipants from './cmp/Module/User/CampaignDetailsParticipants';

import Welcome_page from '../src/cmp/Questions/Welcome_page';
import Login_Page_Question from '../src/cmp/Questions/Login_page_question';
import CampaignEdit from './cmp/Module/User/CampaignEdit';

import Congratulations from './cmp/Questions/Congratulations_HRA/congratulations';
import CompanySetting from './cmp/Module/User/CompanySetting';
import SuperAdminSetting from './cmp/Module/User/SuperAdminSetting';
import EmployeeAnswer from './cmp/Questions/Evaluaed/EmployeeAnswer';
import SpiderChart from './cmp/Module/User/D3Chart/SpiderChart';

import EvaluateHraScore from './cmp/Questions/Evaluate_HRA_score/EvaluateHraScore';
import MainPage from './cmp/Questions/Evaluaed/MainPage';

const loader = require('./assets/images/loader_tra.gif');


function App() {


  return (
    
    <BrowserRouter>
    
      <div className="App">
      {/* <div className='loader_wait'> */}
      <div className='loader_bg'>
        <div className='loader_body_bg'></div>

        <div id='nest' className='loader_wait'>
          <span>&nbsp;</span>
        </div>

        </div>
      
        
      {/* </div> */}
        <Routes>
          <Route exact path='/Login' element={< Login />}></Route>
          <Route exact path='/' element={< LoginNew />}></Route>
          <Route path='/CreateNewPassword' element={< CreateNewPassword />}></Route>
          <Route path='/EnterOtp' element={< EnterOtp />}></Route>
          <Route path='/ForgotPassword' element={< ForgotPassword />}></Route>
          <Route path='/Sorry/:id' element={< Sorry />}></Route>
          <Route path="/welcome/:token_id" element={< Welcome_page />} /> 
          <Route path="/welcome_login" element={<Login_Page_Question />} /> 
          <Route path="/question/:id" element={<Question />}/>
          <Route path="/congratulations" element={<Congratulations />} />
          <Route path="employeeanswer" element={<MainPage />} />
          <Route path="spiderchart" element={<SpiderChart />}/>
          <Route path="/evaluateHRAscore" element={<EvaluateHraScore />} />



          <Route path='/users/*'
            element={
              <Protected Cmp={Users}>
                <Users />
              </Protected>
            }
          > 
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companydashboard" element={<CompanyDashboard />} />
          <Route path="companydetails/:id" element={<CompanyDetails />} />
          
          <Route path="addcompany" element={<AddCompany />} />
          <Route path="newcompany" element={<NewCompany />} />
          <Route path="roleandaccess" element={<RoleAndAccess />} />
          <Route path="hra" element={<Hra />} />
          <Route path="setting" element={<Setting />} />
          <Route path="reports" element={<Reports />} />
          <Route path="employee" element={<Employee />}/>
          <Route path="campaign" element={<Campaign />}/>
          <Route path="campaigndetails/:id" element={<CampaignDetails />}/>
          <Route path="campaignDetailsParticipants/:id" element={<CampaignDetailsParticipants />}/>
          <Route path="campaignedit" element={<CampaignEdit />}/>
          <Route path="companysetting" element={<CompanySetting />}/>
          <Route path="superadminsetting" element={<SuperAdminSetting />}/>
          
          
          

          </Route>
        </Routes>


        <Helmet>
          <script src="../assets/vendor/apexcharts/apexcharts.min.js" type="text/javascript" ></script>
          <script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js" type="text/javascript" ></script>
          <script src="../assets/vendor/chart.js/chart.min.js" type="text/javascript" ></script>
          <script src="../assets/vendor/echarts/echarts.min.js" type="text/javascript" ></script>
          <script src="../assets/vendor/quill/quill.min.js" type="text/javascript" ></script>
          <script src="../assets/vendor/simple-datatables/simple-datatables.js" type="text/javascript" ></script>
          <script src="../assets/vendor/tinymce/tinymce.min.js" type="text/javascript" ></script>
          <script src="../assets/vendor/php-email-form/validate.js" type="text/javascript" ></script>
        </Helmet>
      </div>
    </BrowserRouter>
    
  );
  
}



export default App;


