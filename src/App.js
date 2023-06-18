

import {InfoSection} from "./component/InfoSection";
import {OfferList} from "./component/OfferList";
import {Outlet} from "react-router-dom"
import {AppStateContext, DispatchContext,StateProvider} from "./component/StateManager"


export function App() {
  return (
        <Outlet/>
  );
}



