import {BrowserRouter,Routes,Route} from "react-router-dom"
import {App} from "./App";
import {MainApp} from "./component/MainApp";
import {EditOfferForm} from "./component/EditOfferForm";
import {CreateOfferForm} from "./component/CreateOfferForm";
import {OfferDisplay,OfferDisplayDefault} from "./component/OfferDisplay";
import {Home} from "./component/Home";
import {Login} from "./component/Login";

export function RouterComponent(props)
{
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<App/>}>

                    
                    <Route path="app" element={<MainApp/>}>

                        <Route path="offers" element={<OfferDisplay/>}>
                            <Route path=":id" element={<OfferDisplayDefault/>}/>
                            <Route path=":id/edit" element={<EditOfferForm/>}/>   
                            <Route path="add" element={<CreateOfferForm/>}/>
                            <Route index element={<OfferDisplayDefault/>}/>
                        </Route>

                        <Route path="parameter">   
                        </Route>
                       
                    </Route>

                    <Route path="login" element={<Login/>}></Route>
                    <Route index element={<Home/>}/>
                </Route>

            </Routes>
        </BrowserRouter>
    );
}