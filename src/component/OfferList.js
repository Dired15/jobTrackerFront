
import {Link,useSearchParams,useLocation,useNavigate,useParams} from "react-router-dom";
import {AppStateContext,DispatchContext} from "./StateManager";
import {useContext,useState,useEffect} from "react";
import motif from "./../backgroundMotif.jpg"


export function OfferList(props){

    const [search,setSearch]=useSearchParams();
    const appState=useContext(AppStateContext);
    const appDispatch=useContext(DispatchContext);
    
   useEffect(()=>{
        if(appState.offersList==""){
            appDispatch({type:"setList",payload:"pending"});

            fetch("http://localhost:5870/app/offers",{ credentials: "include"})
            .then((response)=>{
                    return response.json();
                })
            .then((response)=>{
                
                appDispatch({type:"setList",payload:response});
            })
            .catch((error)=>{
                
                appDispatch({type:"setList",payload:"failed"});
                console.log("List fecth failed "+error.message);
            });
        }
   },[appState.offersList]);

   const filterList=()=>{
        let filteredList=appState.offersList;
        let pending;
        let searchQuery=search.get("search");

        if(search.get("pending")!=null){
            pending=(search.get("pending")=="true")?"true":"false";

            filteredList=appState.offersList.filter(
                (element)=>{
                    return (element.answer!==pending);
                }
            );
        }
        if(search.get("search")!=null){

            filteredList=filteredList.filter(
                (element)=>{
                    if(element.title.toUpperCase().indexOf(searchQuery.toUpperCase())!=-1)
                    {
                        return true;
                    }
                    else if(element.company.toUpperCase().indexOf(searchQuery.toUpperCase())!=-1)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                
                }


            );
        }
        
        return filteredList;
   };

    return (
        <div id="OfferSection" className=" w-[40%] flex flex-col justify-between">
            <SearchBar/>

            {(Array.isArray(appState.offersList)==true)?<List list={filterList()}/>:<ListState listStatus={appState.offersList}/>}
        </div>
    );
}

function ListState(props){

   
    const appDispatch=useContext(DispatchContext);
    let element;

    const handleClick=(e)=>{
        
        appDispatch({type:"setList",payload:"pending"});

            fetch("http://localhost:5870/app/offers",{ credentials: "include"})
            .then((response)=>{
                if(response.ok)
                {
                    console.log("oye");
                    return response.json();
                }
                else
                {
                    throw new Error("Not found");
                }
            })
            .then((response)=>{
                appDispatch({type:"setList",payload:response});
            })
            .catch((error)=>{
                appDispatch({type:"setList",payload:"failed"});
                console.log("List fecth failed "+error.message);
            });

    }

    if(props.listStatus=="pending"){
            element="Charging...";
        }
        else{
            element=(<div className="flex flex-col justify-center items-center w-[80%] h-[60%] ">
                    <p className="mb-4 text-center w-full text-xl font-medium">Failed</p>
                    <button onClick={handleClick}className="flex justify-center items-center w-[40%] h-[10%] border rounded-xl">Retry</button>
                </div>);
            
        }



    return(
        <div className="bg-dark h-[80%] flex flex-col justify-center items-center px-10 overflow-y-scroll ">
            {element}
        </div>
    );
}


function List(props)
{
   
    const offerArray=props.list;

    const getDays=(date)=>{
        const currentDate=Date.now();
        const dateCreation=new Date(date.substr(0,4)+"-"+date.substr(5,2)+"-"+date.substr(8,2));

        const days=(currentDate-dateCreation.getTime())/(3600*24*1000);

        return Math.floor(days);


    };
    
    const offerArrayComponent= offerArray.map(
        (element)=>{
            return (<OfferCard key={element._id} id={element._id}title={element.title} company={element.company} time={getDays(element.createdAt)}/>);
        }
    );
    return (
        <ul id="ListContainer" className="bg-dark h-[80%] flex flex-col items-center px-10 overflow-y-scroll ">
            {offerArrayComponent}
        </ul>
    );
}

function OfferCard(props){

    const params=useParams();
    const appDispatch=useContext(DispatchContext);
    const backgroundMotif='url('+motif+')';
    const style={backgroundImage:backgroundMotif};
    const location=useLocation();
    
    

    const isSelected=()=>{
        return (params.id==props.id)?"border ":"";
    }

    return (
        <li  style={style}  className={isSelected()+"  h-[18%] mb-4 flex flex-row w-full bg-[100%_auto] cursor-pointer justify-between items-center rounded-lg shadow-lg shadow-black"}>
            <Link to={"/app/offers/"+props.id+location.search} className="w-full h-full p-4 flex flex-row justify-between items-center"  >
                <div className="OfferCardInfo h-full">
                    <h3>{props.title}</h3>
                    <h4>{props.company}</h4>
                </div>
                <div className="OfferCardTime">{props.time}d</div>
            </Link>
        </li>
    );
}

function SearchBar(props)
{
    const navigate=useNavigate();
    const location=useLocation();
    const [search,setSearch]=useSearchParams();
    const indexSearch=location.search.indexOf("search")
    
    
    const getURL=(value)=>{
        let search=location.search;
        let newURL;
        let start;
        if(indexSearch!=-1 )
        {
            search=location.search.slice(0,indexSearch-1);

        }
        if(search=="")
        {
            start="?";
        }
        else if(location[indexSearch-1]!="?")
        {
            start="&"
        }
        

        newURL=(value=="")?search:search+start+"search="+value;
        return newURL;
    }
    const handleChange=(e)=>{
        navigate(getURL(e.target.value));
        
    }
    return (
        <div id="ToolContainer" className="h-[18%] p-x-5 pt-12 flex flex-col items-center  ">
            <div className=" flex flex-row justify-center mb-8   w-[80%] ">
                <form onSubmit={(e)=>e.preventDefault()} className="flex flex-row items-center h-[90%] w-[80%]  border-solid border border-light-gray rounded-lg">
                    <input type="text" placeholder="Search" value={search.get("search")}onChange={handleChange} className="flex items-center p-2  h-full w-[70%]  rounded-2xl  bg-dark text-light-gray focus:outline-none "/>
                    <input type="submit" value="OK"  className="h-full flex-1 bg-dark-gray rounded-r-lg cursor-pointer"/>
                </form>
                
            </div>
            <div className=" w-[60%] border-b"></div>
        </div>
    );
}