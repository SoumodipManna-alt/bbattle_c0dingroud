import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Login.css'
const Login = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    // const [dataa,setdata]=useState([])
    const[sign,setsign]=useState(false)
    const navigate = useNavigate();
    const[name,setname]=useState()
        
    const submit_function = (e) => {
        e.preventDefault();

        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Login success");
                // setdata(data.data)
                // console.log(data.data);
                 //here all user info go to main (app.js)
                localStorage.setItem("auth", "true"); // Store login state
                localStorage.setItem("useremail",email)
                localStorage.setItem("username",data.data[1])
                navigate("/");
            } else {
                alert("Invalid user");
                setemail("");
                setpassword("");
            }
        })
        .catch((e) => console.log(e));
    }
// 
function sign_in_fun(e){
    if(name==='' || email==='' || password===''){
        alert("please fill up all")
        return
    }
    e.preventDefault();
  try{  fetch('http://127.0.0.1:5000/sign_up',{
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
            // setsign(false)
            
        }
        else{
            alert("Sign up failed || user already exist")
            
        }
    })
}
catch{
    alert("Sign up failed ")
}
finally{
    setsign(false)

}
}
if(!sign){


    return (
        <div className='auth-container'>
            <h1>Home (Login Page)</h1>
            
            <form onSubmit={submit_function} className="auth-form">
            
                <input type='email' placeholder='Enter your Email' required value={email} onChange={(e) => setemail(e.target.value)} />
                <input type='password' placeholder='Enter password' required value={password} onChange={(e) => setpassword(e.target.value)} />
                <button className="btn-login" type='submit'>Log in</button>
               
                <div className="switch-auth">
  <p>Not signed up yet? 🧐</p>
  <button className="auth-btn" type="button" onClick={() => setsign(true)}>Sign up</button>
</div>

            </form>
            
        </div>
    )
}
    return ( sign &&
        <div className="auth-container">
            <form onSubmit={sign_in_fun} className="auth-form">
                <input type='text' placeholder='Enter name' value={name}  onChange={(e)=>{setname(e.target.value)}} required />
                <input type='email' placeholder='Enter Email' value={email}  onChange={(e)=>{setemail(e.target.value)}} required/>
                <input type='password' placeholder='Enter password' value={password} onChange={(e)=>setpassword(e.target.value)} required/>
                <button className="auth-btn" type='submit'>Sign up </button>
            </form>
        </div>
      )
}

export default Login;

// import React, { useRef } from "react";
// import "./Styles/Login.css";

// const Login = () => {
//   const containerRef = useRef(null);

//   const handleRegisterClick = () => {
//     containerRef.current.classList.add("active");
//   };

//   const handleLoginClick = () => {
//     containerRef.current.classList.remove("active");
//   };

//   return (
//     <div className="container" id="container" ref={containerRef}>
//       <div className="form-container sign-up">
//         <form>
//           <h1>Create Account</h1>
//           <span>use your email for registration</span>
//           <input type="text" placeholder="Name" />
//           <input type="email" placeholder="Email" />
//           <input type="password" placeholder="Password" />
//           <button type="button">Sign Up</button>
//         </form>
//       </div>

//       <div className="form-container sign-in">
//         <form>
//           <h1>Sign In</h1>
//           <span>use your email and password</span>
//           <input type="email" placeholder="Email" />
//           <input type="password" placeholder="Password" />
//           <a href="#">Forget Your Password?</a>
//           <button type="button">Sign In</button>
//         </form>
//       </div>

//       <div className="toggle-container">
//         <div className="toggle">
//           <div className="toggle-panel toggle-left">
//             <h1>Welcome Back!</h1>
//             <p>Enter your personal details to use all of site features</p>
//             <button className="hidden" id="login" onClick={handleLoginClick}>
//               Sign In
//             </button>
//           </div>
//           <div className="toggle-panel toggle-right">
//             <h1>Hello, Friend!</h1>
//             <p>Create your account to use all of site features</p>
//             <button className="hidden" id="register" onClick={handleRegisterClick}>
//               Sign Up
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;