
import {Link,useParams,useLocation} from "react-router-dom";
import {AppStateContext,DispatchContext} from "./StateManager";
import {useContext,useEffect} from "react";

export function Offer(props){
    
    const appDispatch=useContext(DispatchContext);
    const {currentOffer}=useContext(AppStateContext);
    const location=useLocation();
    const id=useParams().id;

    const display=(id!==undefined)?"flex ":"hidden ";
    
    useEffect(()=>{
        if(currentOffer._id!==id && currentOffer!=="pending" && id!==undefined && currentOffer!=="failed" ){
            
            appDispatch({type:"setCurrentOffer",payload:"pending"});
            console.log("useeffect wilding");
            fetch("http://localhost:5870/app/offers/"+id,{ credentials: "include"})
            .then((response)=>{
                    return response.json();
            })
            .then((response)=>{
                appDispatch({type:"setCurrentOffer",payload:response});
            })
            .catch((error)=>{
                console.log("oye oye oye");
                appDispatch({type:"setCurrentOffer",payload:"failed"});
                console.log("Error while fetching the offer "+error.message);
            });
        }
    },[currentOffer,id]);
    
    return (
        <div className={display+"w-[70%] h-[90%] relative p-10 flex-col  bg-dark-gray rounded-2xl shadow-2xl shadow-black border "}>
        
           {(currentOffer._id==id && currentOffer._id)?<OfferInfo currentOffer={currentOffer} id={id} search={location.search}/>:<OfferStatus status={currentOffer}/>}


        </div>
    );
}

function OfferInfo(props){

    const currentOffer=props.currentOffer;
    const id=props.id;
    const search=props.search;

    return(
        <>
            <h5 className="text-left  text-black text-lg font-medium ">Title</h5>
            <h2  className="text-left   text-2xl mb-4 ">{currentOffer.title}</h2>

            <h5 className="text-left  text-black text-lg font-medium ">Company</h5>
            <h3 className="text-left text-xl mb-4 ">{currentOffer.company}</h3>

            <h5 className="text-left text-black text-lg font-medium ">Salary</h5>
            <h4  className="text-left text-lg mb-4 ">{currentOffer.salary}</h4>

            <h5 className="text-left text-black text-lg font-medium ">Date</h5>
            <p  className="text-left mb-4 ">{currentOffer.createdAt.substring(0,9)}</p>

            <h5 className="text-left text-black text-lg font-medium ">Answer</h5>
            <p  className="text-left mb-4 ">{currentOffer.answer}</p>

            <h5 className="text-left text-black text-lg font-medium ">Requirement</h5>
            <p  className="text-left mb-4 ">{currentOffer.requirement}</p>

            <h5 className="text-left text-black text-lg font-medium ">Description</h5>
            <p  className="text-left mb-4 ">{currentOffer.description}</p>

            <button className="absolute right-12 w-[15%] h-[6%] bg-dark font-bold border rounded-lg">
                <Link to={"/app/offers/"+id+"/edit"} state={{previousId:id,search:search}} className="flex flex-row justify-center items-center w-full h-full  rounded-lg">Edit</Link>
            </button>
        </>
        
    );
}

function OfferStatus(props){

    const appDispatch=useContext(DispatchContext);
    const params=useParams()
    let element;

    const handleClick=(e)=>{
        
        appDispatch({type:"setCurrentOffer",payload:"pending"});

            fetch("http://localhost:5870/app/offers/"+params.id,{ credentials: "include"})
            .then((response)=>{return response.json()})
            .then((response)=>{
                appDispatch({type:"setCurrentOffer",payload:response});
            })
            .catch((error)=>{
                appDispatch({type:"setCurrentOffer",payload:"failed"});
                console.log("Offer fecth failed "+error.message);
            });

    }

    if(props.status=="pending"){
            element="Charging...";
        }
        else{
            element=(<div className="flex flex-col justify-center items-center w-[80%] h-[60%] ">
                    <p className="mb-4 text-center w-full">Failed</p>
                    <button onClick={handleClick}className=" bg-dark flex justify-center items-center w-[40%] h-[10%] border rounded-xl">Retry</button>
                </div>);
            
        }



    return(
        <div className=" h-full  flex flex-col justify-center items-center px-10 ">
            {element}
        </div>
    );

}