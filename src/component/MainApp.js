
import {InfoSection} from "./InfoSection";
import {useLocation,useNavigate} from "react-router-dom";
import {OfferList} from "./OfferList";
import {Outlet} from "react-router-dom"
import {useEffect} from "react"
import {AppStateContext, DispatchContext,StateProvider} from "./StateManager"


export function MainApp() {

    const location=useLocation();
    const navigate=useNavigate();

    useEffect(()=>{
        if(location.pathname.indexOf("offers")==-1){
            navigate("offers");
        }
    });

  return (
    <StateProvider>
      <div className="App w-full h-full flex flex-row  ">
        <InfoSection/>
        <Outlet/>
      </div>
    </StateProvider>
  );
}

