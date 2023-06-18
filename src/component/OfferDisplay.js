import {Outlet} from "react-router-dom"
import {OfferList} from "./OfferList"
import {Offer} from "./Offer"

export function OfferDisplay(props){


    return (
    <div id="main" className="border-l  flex flex-row flex-1 ">
          <Outlet/>

    </div>);
}

export function OfferDisplayDefault(props){

    return (
        <>
        <OfferList/>
          <div className="flex-1 flex flex-row justify-center items-center">
            <Offer/>
          </div>
        </>
    );
}