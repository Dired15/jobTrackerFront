import {Link,useParams,useLocation,useNavigate} from "react-router-dom";
import {AppStateContext,DispatchContext} from "./StateManager";
import {useContext,useState,useRef} from "react";


export function CreateOfferForm(props)
{
    
    
    const appState=useContext(AppStateContext);
    

   
    return(
        <div id="CreateOfferForm" className=" w-full flex flex-row justify-center items-center  ">
            {(appState.submitStatus=="")?<AddForm/>:<StatusMessageForm/>}
        </div>
    );
}



function AddForm(props){

    const location=useLocation();
    const navigate=useNavigate();
    const appDispatch=useContext(DispatchContext);
    const addForm=(location.state.addForm)?JSON.parse(location.state.addForm):undefined;
    
    const initialValue=(addForm)?[addForm.title,addForm.company,addForm.salary,addForm.requirement,addForm.description]:["","","","",""];
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
        const addForm=JSON.stringify({
            title:inputValue[0],
            company:inputValue[1],
            salary:inputValue[2],
            requirement:inputValue[3],
            description:inputValue[4],

        });
        
        appDispatch({type:"submitStatus",payload:"pending"});
        fetch("http://localhost:5870/app/offers/add",{
            credentials: "include",
            method:"POST",
            headers:{
                "Content-Type": "application/json;charset=utf-8"
            },
            body:addForm,
        })
        .then((response)=>{
            if(response.ok){
                appDispatch({type:"submitStatus",payload:"success"});
                appDispatch({type:"setList",payload:""});
                navigate(location.pathname,{state:{...location.state,addForm:undefined}});
            }
            else
            {
                appDispatch({type:"submitStatus",payload:"failure"});
                navigate(location.pathname,{state:{...location.state,addForm:addForm}});
            }
        })
        .catch((error)=>{
            appDispatch({type:"submitStatus",payload:"failure"});
            navigate(location.pathname,{state:{...location.state,addForm:addForm}});
            console.log("The post request failed "+error.message);
        });
        
    };


    return(
        <form className={" w-[80%] h-[90%] flex flex-row p-6  bg-dark-gray rounded-xl shadow-2xl shadow-black border"} onKeyDown={handleOnKeyDown} onSubmit={handleSubmit}  >
            <InputSection onChange={handleChange} value={inputValue}/>
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

            <FormButton/>
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
                    <Link to={"/app/offers"+previousIdPath+search} state={{...location.state,addForm:undefined}} className="flex flex-row justify-center items-center w-full h-full">Cancel</Link>
            </button>
            <input type="submit" value="ADD" className=" cursor-pointer h-full border font-bold bg-dark w-[30%] rounded-lg"/>
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
            <textarea id="inputSkills" name="skills"  value={value[3]} placeholder="Enter the requirement..." onChange={handleChange(3)} className={textAreaStyle}></textarea>

            <label htmlFor="inputDescription" className={labelStyle}>Description</label>
            <textarea id="inputDescription" name="description" value={value[4]} placeholder="Enter a description" onChange={handleChange(4)} className={textAreaStyle}  ></textarea>
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
                    <p className="mb-8">"SAVED!"</p>
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