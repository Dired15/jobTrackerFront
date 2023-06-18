import { createContext,useEffect } from "react";
import  {useReducer} from "react";
import {appReducer} from "./reducer";
import {useLocation,useNavigate} from "react-router-dom";

export const AppStateContext=createContext();
export const DispatchContext=createContext();



export function StateProvider(props){

    const navigate=useNavigate()
    const appData={
        user:undefined,
        offersList:"",
        currentOffer:{},
        submitStatus:"",
        editStatus:"",
        deleteStatus:"",
    };

    const [appState,dispatch]=useReducer(appReducer,appData);
    useEffect(()=>{
        if(!appState.user)
        {
            console.log("statemanager");
            fetch("http://localhost:5870/app",{ credentials: "include"})
            .then((response)=>{
                return response.json();
            })
            .then((response)=>{
                dispatch({type:"setUser",payload:response})
            })
            .catch((error)=>{
                navigate("/login");
                console.log("Not authorized "+error.message);
            });
        }
    },[appState]);
    return (
        <AppStateContext.Provider value={appState}>
            <DispatchContext.Provider value={dispatch}>
                {props.children}
            </DispatchContext.Provider>
        </AppStateContext.Provider>
    );
}


