import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'


const Signup = () => {
    const[name,setname]=useState()
    const[email,setemail]=useState()
    const[password,setpassword]=useState()
    const navigate=useNavigate()

    function sign_in_fun(e){
        if(name==='' || email==='' || password===''){
            alert("please fill up all")
            return
        }
        e.preventDefault();
        fetch('http://127.0.0.1:5000/sign_up',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({name,email,password})
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.value){
                alert("Sign up Successful")
                navigate("/Login")
                
            }
            else{
                alert("Sign up failed || user already exist")
                navigate("/Login")
            }
        })
    }
  return (
    <div>
        <form onSubmit={sign_in_fun}>
            <input type='text' placeholder='Enter name' value={name}  onChange={(e)=>{setname(e.target.value)}} required />
            <input type='email' placeholder='Enter Email' value={email}  onChange={(e)=>{setemail(e.target.value)}} required/>
            <input type='password' placeholder='Enter password' value={password} onChange={(e)=>setpassword(e.target.value)} required/>
            <button className="btn run" type='submit'>Sign up </button>
        </form>
    </div>
  )
}

export default Signup