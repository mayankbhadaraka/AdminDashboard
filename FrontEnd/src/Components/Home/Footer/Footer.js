import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import context from '../../Context/context'
import '../Footer/Footer.css'
const Footer = () => {
  // let [admin,setAdmin]=useState(JSON.parse(localStorage.getItem("Log_User")))
  const {profile,user } =useContext(context);
  return (
    <div id='footer'>
    {!profile?user.isAdmin?<Link to='/admin'>Admin</Link>:null:null}
    <Link to='/contact'>Contact us</Link>
    <Link to='/faq'>FAQ</Link>
    </div>
  )
}

export default Footer
