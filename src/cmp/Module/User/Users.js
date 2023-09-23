import React from 'react'
import Layout from './Layout';
import { useNavigate } from 'react-router-dom'
function Users() {
  // let userData = JSON.parse(localStorage.getItem("user"))
  let userData = JSON.parse(sessionStorage.getItem("user"))
  const navigate = useNavigate();
  
  
  return userData ?  <div><Layout /></div> : <div>{navigate("/")}</div>
}

export default Users