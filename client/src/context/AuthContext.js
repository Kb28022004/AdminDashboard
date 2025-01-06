import { createContext, useContext, useReducer } from "react";
import reducer from '../reducer/AuthReducer'

const AuthContext=createContext()


const initialState={
email:"",
password:"",
loading:false,
errorMessage:"",    
successMessage:""
}

const AuthContextProvider=({children})=>{

    const [state,dispatch]=useReducer(reducer,initialState)

   return (<AuthContext.Provider value={{...state}}>
        {children}
    </AuthContext.Provider>)
}


// custom hook

const useAuthContext=()=>{
    return useContext(AuthContext)
}


export{AuthContextProvider,AuthContext,useAuthContext}