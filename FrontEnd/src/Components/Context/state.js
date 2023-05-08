import context from "./context";
import React, { useState } from "react";

const State=(props)=>{
    const [SignupModel,setSignupModel]=useState(false)
    const[LoginModel, setLoginModel]=useState(false)
    const[profile,setProfile]=useState(true)
    const[user,setUser]=useState({})
    return(
        <context.Provider value={{
            SignupModel,
            setSignupModel,
            LoginModel, 
            setLoginModel,
            profile,
            setProfile,
            user,
            setUser
        }}>
            {props.children}
        </context.Provider>
    )
}

export default State;