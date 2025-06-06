import React ,{useEffect, useState} from 'react'
import { data } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import './Styles/Solo.css'
const Solo = () => {
  const[username,setusername]=useState(localStorage.getItem("username"))
  const[room_id,setroom_id]=useState((Math.random().toString(36).substring(2,7)))
  const[random,setrandom]=useState(Math.random)
  const[question,setquestion]=useState()
  const[question_time,setqt]=useState()
  const[testcase,settestcases]=useState({})
  const[code,setcode]=useState("")
  const[input,setinput]=useState()
  const [compilation_status,setcompilation_status]=useState("")
  const [result,setresult]=useState("")
  const [error,seterror]=useState("")
  const [color,setcolor]=useState("")
  const navigate = useNavigate();
  const [test_result,settest_result]=useState({})
  const [toggle,settoggle]=useState(false)
  
  useEffect(()=>{
    const question_ids = Math.floor(Math.random() * 4) + 1;
    fetch("http://127.0.0.1:5000/question_genarate",{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({room_id,question_ids})
    })
    .then(res=>res.json()) 
    .then((data)=>{
      // console.log(data.testcases);
      
      setquestion(data.question)
      setqt(data.question_time)
      settestcases(data.testcases)
    })  
  },[])

  const code_run= async()=>{
    if(!code.trim()){
      alert("you can't run")
      return
    }
    try{ const response = await axios.post("http://127.0.0.1:5000/code_run",{
        code, room_id,input
     })
     if(response.data.success){
         seterror("")
         setcolor("green")
         setcompilation_status("😊 Compilation Successful 👍🏻")
         setresult(response.data.output)
     }
     else{
         setresult("")
         setcolor("red")
         seterror(response.data.error)
         setcompilation_status("😟 Compilation Unsuccessful ❌")
     }
 }
 catch(err){
    setcolor("red")
     setcompilation_status("🚨 Error connecting to the server!")
     seterror(err.message)
 }
 }

const code_submit =()=>{
  console.log(code);
  
  if(!code.trim()){
    alert("you can't submit")
    return
  }
  fetch("http://127.0.0.1:5000/solo_submit",{
    method:"post",
    headers:{"Content-Type": "application/json"},
    body:JSON.stringify({code,room_id})
  })
  .then(data=>data.json())
  .then((data)=>{
    // if()
    if(!data.success){
      setresult("")
    // setcolor("red")
    seterror(data.error)
    // setcompilation_status("😟 Compilation Unsuccessful ❌")
    }
    settest_result(data)
  })
}
if(!toggle){
return(
 
  <div className="solo-start-screen">
    <h1>Hi {username}</h1>
    <h2>Are you ready to start practice </h2>
    <button onClick={()=>{settoggle(true)}} className="solo-start">Start</button>
    <button onClick={()=>{navigate('/')}} className="solo-back">Back</button>
  </div>
)
}
return (toggle&&
    <div className='solo-container'>
      <div className="question-section">

      <h2>Question :</h2>
      <p>{question}</p>
      </div>
      <div className="testcase-section">
      <h2>Testcases</h2>
     {
      Object.entries(testcase).map(([input,output],index)=>(
        <p key={index}>{index+1}) input  : {input}  ::  Output  :  {output}</p>
      ))
     }
     </div>
     <textarea 
       rows="10"
        cols="60"
      placeholder='Enter your Code here'
      onChange={(e)=>{setcode(e.target.value)}}
      onPaste={(e) => e.preventDefault()}
      />
<br/>
    <textarea 
       rows="5"
        cols="60"
      placeholder='Enter your input  here'
      onChange={(e)=>{setinput(e.target.value)}}
      />
      <br></br>
      <button onClick={code_run} className="solo-btn">Run⌛</button>
      <button onClick={code_submit} className="solo-btnn">Submit🎯</button>
      <div className="result-section">
      <h3>
        Compilation Message:
        <pre style={{color:color}}>{compilation_status}</pre>
        
      </h3>
      <h3>
        The output :
        <pre style={{color:color}}>{result}</pre>
      </h3>
      <h3>
        The Error :
        <pre style={{color:color}}>{error}</pre>
      </h3>

      <h3>The test results are </h3>
      {
        Object.entries(test_result).map(([no,re],index)=>(
          <p key={index}>Testcase no : {+no+1}) {re?"✅":"❌"} </p>
        ))
      }
      </div>
    </div>
  )
}

export default Solo


