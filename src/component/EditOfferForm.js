import {Link,useParams,useLocation,useNavigate} from "react-router-dom";
import {AppStateContext,DispatchContext} from "./StateManager";
import {useContext,useState,useRef} from "react";


export function EditOfferForm(props)
{
    
    
    const appState=useContext(AppStateContext);
    

   
    return(
        <div id="EditOfferForm" className=" w-full flex flex-row justify-center items-center  ">
            {(appState.submitStatus=="")?<EditForm/>:<StatusMessageForm/>}
        </div>
    );
}



function EditForm(props){

    const location=useLocation();
    const navigate=useNavigate();
    const id=useParams().id;

    const appState=useContext(AppStateContext);
    const currentOffer=appState.currentOffer;
    const currentOfferInputValue=[currentOffer.title,currentOffer.company,currentOffer.salary,currentOffer.answer,currentOffer.requirement,currentOffer.description];

    const appDispatch=useContext(DispatchContext);
    const editForm=(location.state.editForm)?JSON.parse(location.state.editForm):undefined;
    
    const initialValue=(editForm)?[editForm.title,editForm.company,editForm.salary,editForm.requirement,editForm.description]:currentOfferInputValue;
    const [inputValue, setInputValue]=useState(initialValue);

    const handleChange=(index)=>{
        return (e)=>{
            const newInputValue=[...inputValue];
            newInputValue[index]=e.target.value;
            setInputValue(newInputValue);
        };
    };

    const handleOnKeyDown=(e)=>{
             if(e.code=="Enter" && e.target.tagName!="textarea"){
                e.preventDefault(); 
            }
             
    };

    const handleSubmit=(e)=>{

        e.preventDefault();
        const editForm=JSON.stringify({
            title:inputValue[0],
            company:inputValue[1],
            salary:inputValue[2],
            answer:inputValue[3],
            requirement:inputValue[4],
            description:inputValue[5],

        });
        
        appDispatch({type:"submitStatus",payload:"pending"});
        fetch("http://localhost:5870/app/offers/"+id+"/edit",{
            credentials: "include",
            method:"POST",
            headers:{
                "Content-Type": "application/json;charset=utf-8"
            },
            body:editForm,
        })
        .then((response)=>{
            if(response.ok){
                appDispatch({type:"submitStatus",payload:"success"});
                appDispatch({type:"setList",payload:""});
                appDispatch({type:"setCurrentOffer",payload:{}});
                navigate(location.pathname+location.search,{state:{...location.state,editForm:undefined}});
            }
            else
            {
                appDispatch({type:"submitStatus",payload:"failure"});
                navigate(location.pathname+location.search,{state:{...location.state,editForm:editForm}});
            }
        })
        .catch((error)=>{
            appDispatch({type:"submitStatus",payload:"failure"});
            navigate(location.pathname+location.search,{state:{...location.state,editForm:editForm}});
            console.log("The post request failed "+error.message);
        });
        
    };

    const handleDelete=(e)=>{

        e.preventDefault();
        const editForm=JSON.stringify({
            title:inputValue[0],
            company:inputValue[1],
            salary:inputValue[2],
            answer:inputValue[3],
            requirement:inputValue[4],
            description:inputValue[5],

        });
        
        appDispatch({type:"submitStatus",payload:"pending"});
        fetch("http://localhost:5870/app/offers/"+id+"/delete",{
            credentials: "include",
            method:"POST",
            headers:{
                "Content-Type": "application/json;charset=utf-8"
            },
            body:editForm,
        })
        .then((response)=>{
            if(response.ok){
                appDispatch({type:"submitStatus",payload:"success"});
                appDispatch({type:"setList",payload:""});
                appDispatch({type:"setCurrentOffer",payload:{}});
                navigate("/app/offers",{state:{editForm:undefined}});
            }
            else
            { 
                throw new Error("delete operation failed");
            }
        })
        .catch((error)=>{
            appDispatch({type:"submitStatus",payload:"failure"});
            navigate(location.pathname+location.search,{state:{...location.state,editForm:editForm}});
            console.log("The post request failed "+error.message);
        });
        
        
    };


    return(
        <form className={" w-[80%] h-[90%] flex flex-row p-6  bg-dark-gray rounded-xl shadow-2xl shadow-black border"} onKeyDown={handleOnKeyDown} onSubmit={handleSubmit}  >
            <InputSection onChange={handleChange} handleDelete={handleDelete} value={inputValue}/>
            <TextAreaSection onChange={handleChange} value={inputValue}/>        
        </form>
    );
}

function InputSection(props){

    const value=props.value;
    const handleChange=props.onChange;
    const labelStyle="text-black text-left font-bold mb-2";
    const inputStyle=" border w-[70%] h-[7%] mb-6 px-4 rounded-lg bg-dark shadow-2xl shadow-black text-light-gray focus:outline-none";

    return(
        <div className=" w-1/2 flex flex-col">
            <label htmlFor="inputTitle" className={labelStyle}>Title</label>
            <input id="inputTitle" name="title" type="text" value={value[0]} placeholder="Enter the job title..." onChange={handleChange(0)} className={inputStyle}/>

            <label htmlFor="inputCompany" className={labelStyle}>Company</label>
            <input id="inputCompany" name="company" type="text" value={value[1]} placeholder="Enter the company name" onChange={handleChange(1)} className={inputStyle}/>

            <label htmlFor="inputSalary" className={labelStyle}>Salary</label>
            <input id="inputSalary" name="salary" type="text" value={value[2]} placeholder="Enter the salary..." onChange={handleChange(2)} className={inputStyle}/>

            <label htmlFor="inputAnswer" className={labelStyle}>Answer</label>
            <input id="inputAnswer" name="answer" type="text" value={value[3]} placeholder="Enter the answer..." onChange={handleChange(3)} className={inputStyle}/>
            <FormButton handleDelete={props.handleDelete}/>
        </div>

    );
}

function FormButton(props){

    const location=useLocation();
    const previousId=location.state.previousId;
    const previousIdPath=(previousId!==undefined)?"/"+previousId:"";
    const search=location.state.search;
    
    

    return(
        <div className=" w-[70%]   h-[7%] mt-12 flex flex-row justify-center items-center">
            <button className="border font-bold bg-dark w-[30%] h-full mr-12 rounded-lg" onClick={(e)=>{e.preventDefault();}}>
                    <Link to={"/app/offers"+previousIdPath+search} state={{...location.state,editForm:undefined}} className="flex flex-row justify-center items-center w-full h-full">Cancel</Link>
            </button>
            <button className="border font-bold bg-dark w-[30%] h-full mr-12 rounded-lg" onClick={props.handleDelete}>DELETE </button>
            <input type="submit" value="EDIT" className=" cursor-pointer h-full border font-bold bg-dark w-[30%] rounded-lg"/>
        </div>
    );
}

function TextAreaSection(props){

    const value=props.value;
    const handleChange=props.onChange;
    const textAreaStyle="border h-[30%] p-4 mb-16 [resize:none] rounded-lg bg-dark shadow-2xl shadow-black text-light-gray focus:outline-none";
    const labelStyle="text-black text-left font-bold mb-2";

    return(
        <div className=" flex-1 flex flex-col">
            <label htmlFor="inputSkills" className={labelStyle}>Requirement</label>
            <textarea id="inputSkills" name="skills"  value={value[4]} placeholder="Enter the requirement..." onChange={handleChange(4)} className={textAreaStyle}></textarea>

            <label htmlFor="inputDescription" className={labelStyle}>Description</label>
            <textarea id="inputDescription" name="description" value={value[5]} placeholder="Enter a description" onChange={handleChange(5)} className={textAreaStyle}  ></textarea>
        </div>

    );
}

function StatusMessageForm(props)
{
    const appDispatch=useContext(DispatchContext);
    const appState=useContext(AppStateContext);
    let element;

    const handleClick=(e)=>{
        appDispatch({type:"submitStatus",payload:""});
    };

    switch(appState.submitStatus)
    {
        case "pending":
            {
                element=(<>
                    <p className="mb-8">"Saving..."</p>
                </>);
            }
        break;

        case "success":
            {
                element=(<>
                    <p className="mb-8">"Success!"</p>
                    <button onClick={handleClick} className=" w-[10%] h-[8%] bg-dark-gray rounded-lg border">Go back</button>
                </>);
            }
        break;

        case "failure":
            {
                element=(<>
                    <p className="mb-8">"Request failed!"</p>
                    <button onClick={handleClick} className=" w-[10%] h-[8%] bg-dark-gray rounded-lg border">Retry</button>
                </>);
            }
        break;
    }

    return (
        <div className=" w-[80%] h-[90%] flex flex-col p-6 justify-center items-center bg-dark-gray rounded-xl shadow-2xl shadow-black border">
            {element}
        </div>

    );
}