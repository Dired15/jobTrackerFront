
import {useState} from "react"
import {useNavigate} from "react-router-dom"

export function Login(props){

    const navigate=useNavigate();
    const [value,setValue]=useState(["example@email.com","exemplePassword"])
    const labelStyle="text-black text-left text-lg font-bold mb-2 w-[70%]";
    const inputStyle=" border w-[70%] h-[7%] mb-6 px-4 rounded-lg bg-dark shadow-2xl shadow-black text-light-gray focus:outline-none";

    const handleChange=(index)=>{
        return (e)=>{
            const newValue=[...value];
            newValue[index]=e.target.value;
            setValue(newValue);
        };
    };

    const handleOnKeyDown=(e)=>{
        if(e.code=="Enter" && e.target.tagName!="textarea"){
           e.preventDefault(); 
       }
        
    };

    const handleSubmit=(e)=>{

        e.preventDefault();
       
       
        fetch("http://localhost:5870/login",{
            credentials: "include",
            method:"POST",
            headers:{
                "Content-Type": "application/json;charset=utf-8"
            },
            body:JSON.stringify({email:value[0],password:value[1]}),
        })
        .then((response)=>{
            if(response.ok){
                console.log("login success");
                navigate("/app");
            }
            else
            {
                throw new Error("the credential are wrong");
            }
            
        })
        .catch((error)=>{
           
            console.log("Login failed "+error.message);
        });
        
    };

    return (
        <div className="w-full h-full flex flex-row justify-center items-center  ">

            <form onKeyDown={handleOnKeyDown} onSubmit={handleSubmit} className={" w-[25%] h-[80%] flex flex-col items-center  p-4 pt-10  bg-dark-gray rounded-xl shadow-2xl shadow-black border"}>
                <h3 className="w-[70%] font-bold text-2xl mb-10">Login</h3>
                <label htmlFor="email" className={labelStyle}>Email</label>
                <input id="email" name="title" type="email" value={value[0]} placeholder="Email address" onChange={handleChange(0)} className={inputStyle}/>

                <label htmlFor="inputCompany" className={labelStyle}>Password</label>
                <input id="password" name="company" type="password" value={value[1]} placeholder="Password" onChange={handleChange(1)} className={inputStyle}/>

                <input type="submit" value="Login" className=" mt-8 cursor-pointer border font-bold bg-dark w-[30%] h-[7%] rounded-lg"/>
            </form>
        </div>
        );
}