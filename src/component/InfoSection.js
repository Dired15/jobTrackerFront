
import {AppStateContext,DispatchContext} from "./StateManager";
import {useContext} from "react";
import {Link,useParams,useLocation,useSearchParams, useNavigate} from "react-router-dom";


export function InfoSection(props){
    
    
    const appState=useContext(AppStateContext);

    return (
        <div id="InfoSection" className="flex flex-col items-center  pt-14 w-[20%]">
            <UserInfo pseudo={"Dired"}/>
            <MenuNav/>
        </div>
    );
}

function UserInfo(props){
    const navigate=useNavigate()
    const handleLogOut=(e)=>{
        fetch("http://localhost:5870/logout",{ 
            credentials: "include",
            method:"POST"})
        .then((response)=>{
            if(response.ok)
            {
                navigate("/login");
            }
            
        })
        .catch((e)=>{console.log("error while logout "+e.message)})
    };

    return (
        <div id="UserInfo" className="flex flex-col items-center  w-full">
            <h3 id="UserPseudo" className="text-2xl font-bold mb-4">{props.pseudo}</h3>
            <button id="ConfigButton" className="border bg-dark-gray w-[30%] text-sm rounded-xl mb-4">Parameter</button>
            <button id="DeconnexionButton" onClick={handleLogOut} className="border bg-dark-gray w-[30%] text-sm rounded-xl mb-4">Disconnect</button>
            <div className="w-[70%] border-b"></div>
        </div>
    );
}

function MenuNav(props){

    const appState=useContext(AppStateContext);
    const location=useLocation();
    const paramId=useParams().id;
    const [urlSearch,setSearch]=useSearchParams();
    const search=useLocation().search;
    const state=useLocation().state;

    
    const searchInput=(urlSearch.get("search")!=null)?"search="+urlSearch.get("search"):"";


    //test if there was an offer selected in the previous page
    const previousId=state?state.previousId:undefined;
    const id=(paramId!==undefined)?paramId:previousId;
    const pathId=(id!==undefined)?"/"+id:"";

    //list, pending list length
   
    const listLength=(Array.isArray(appState.offersList))?appState.offersList.length:0;
    const pendingListLength=(Array.isArray(appState.offersList))?appState.offersList.reduce(
        (value,element)=>{

            return (element.answer=="false")?value+1:value;
        },0):0;
    const answeredListLength=listLength-pendingListLength;

    const isSelected=(value)=>{
        let selected;
        switch(value)
        {
            case "All":
                {
                    selected=(search.indexOf("pending")==-1 && location.pathname.indexOf("add")==-1)?"bg-gray ":"";
                }
            break;

            case "Answered":
                {
                    selected=(urlSearch.get("pending")=="false")?"bg-gray ":"";
                }
            break;

            case "Pending":
                {
                    selected=(urlSearch.get("pending")=="true")?"bg-gray ":"";
                }
            break;

            case "ADD":
                {
                    selected=(location.pathname.indexOf("add")!=-1)?"bg-gray ":"";
                    
                }
            break;


        }

        return selected;
       
    };
   
    return (
        <div id="MenuInfo" className=" flex flex-col w-full flex-1 items-center pt-20">
            <button className={isSelected("All")+"w-[70%] h-[10%]  text-left rounded-lg hover:bg-gray font-bold mb-8 "}>
                <Link to={"offers"+pathId+(searchInput==""?"":"?"+searchInput)} state={{previousId:id}} className="flex flex-row pl-12  items-center w-full h-full">All({listLength})</Link> 
            </button>

            <button className={isSelected("Answered")+"w-[70%] h-[10%]  text-left rounded-lg hover:bg-gray font-bold mb-8 "}>
                <Link to={"offers"+pathId+"?pending=false"+(searchInput==""?"":"&"+searchInput)} state={{previousId:id}} className="flex flex-row pl-12  items-center w-full h-full">Answered({answeredListLength})</Link>
            </button>
            <button className={isSelected("Pending")+"w-[70%] h-[10%]  text-left rounded-lg hover:bg-gray font-bold mb-8 "}>
                <Link to={"offers"+pathId+"?pending=true"+(searchInput==""?"":"&"+searchInput)} state={{previousId:id}} className="flex flex-row pl-12  items-center w-full h-full">Pending({pendingListLength})</Link>
            </button>
            <button className={isSelected("ADD")+"w-[70%] h-[10%]  text-left rounded-lg hover:bg-gray font-bold mb-8 "}>
                <Link to={"offers/add"} state={{previousId:id,search:search}} className="flex flex-row pl-12 items-center w-full h-full">ADD</Link>           
            </button>
        </div>
    );
}