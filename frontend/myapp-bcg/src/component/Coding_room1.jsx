import React ,{useEffect, useState} from 'react'
import axios from "axios"
import { data, useLocation,useNavigate } from 'react-router-dom'
import './Styles/Coding_room1.css';


const Coding_room1 = () => {
    const query = new URLSearchParams(useLocation().search)
    const username=query.get("username")
    const room_id=query.get("room_id")
    const question_ids=query.get("question_ids")
    // console.log(question_ids);
    
    const [user_email,setuser_email]=useState(localStorage.getItem("useremail"))
    const navigate=useNavigate()
    const [input ,setinput]=useState("")
    const [code,setcode]=useState("")
    const [compilation_status,setcompilation_status]=useState("")
    const [result,setresult]=useState("")
    const [error,seterror]=useState("")
    const [color,setcolor]=useState("")
    const [question , setquestion]=useState()
    const [timeLeft, settimeleft]=useState()
    const [totaltime, setdata] = useState();
    const [Testcases,settestcase]=useState({})
    const [test_result,settest_result]=useState({})
    
    let [game_round,setgame_round]=useState(0)
    // let total_round=Number(localStorage.getItem("Game_round"))
    // console.log("CODING PAGE: Game_round before navigation:", localStorage.getItem("Game_round"));

// question genarate
useEffect(()=>{
    try{fetch("http://127.0.0.1:5000/question_genarate",{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({room_id,question_ids})
    })
    .then((data)=>data.json())
    .then((data)=>{
        setdata(data.question_time);
        setquestion(data.question)
        settestcase(data.testcases)
        settimeleft(data.question_time)
    })
    .catch(()=>{
        setquestion({question:"Sorry server error"})
    })
}
    catch(err){
        alert(err)
    }
},[])
    
//timer showing 
useEffect(()=>{
    if(timeLeft<=0){
        autosubmit()
        return
    }
    const timout=setInterval(()=>{
        settimeleft((prev)=>prev-1)
    },1000)
    return()=> clearInterval(timout)
},[timeLeft])


const autosubmit = () =>{
    // if(!code.trim()){
    //     alert("Sorry you didn't write yet autosubmit not work ")
    //   return
    // }
    Submit()
}
const Submit = ()=>{
    // total_round=+total_round-1
    // localStorage.setItem("Game_round",total_round)
    let  time=totaltime-timeLeft
    try
    { 
        fetch("http://127.0.0.1:5000/code_submit",{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({code,room_id,user_email,time,question_ids})
    })
    // const data = await response.json()
    .then((res)=>res.json())
    .then((data)=>{
        alert("Submit success fully ",data.message)
        // console.log("message",data.message);
        // console.log(data);
        
        if(data.message){
            alert("all round finished")
            navigate('/')
           }
           else{
            navigate(`/room/${room_id}`,{state:{round:data.remaining_round}})
           }
        
    })
    
    // setresult("Submit success fully testcases passed ",data.result)
}
catch{
    alert("Error submitting code!")
}

}

// for code run
    const code_run= async()=>{
        if(!code.trim()){
            alert("you can't run")
            return
          }
       try{ const response = await axios.post("http://127.0.0.1:5000/code_run",{
           code, room_id,username,input
        })
        if(response.data.success){
            seterror("")
            settest_result(data)

            setcolor("green")
            setcompilation_status("😊 Compilation Successful 👍🏻")
            setresult(response.data.output)
        }
        else{
            setresult("")
            settest_result(data)

            setcolor("red")
            seterror(response.data.error)
            setcompilation_status("😟 Compilation Unsuccessful ❌")
        }
    }
    catch(err){
        setcompilation_status("🚨 Error connecting to the server!")
        seterror(err.message)
    }
    }
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            autosubmit(); // Call autosubmit before unload
            event.preventDefault();
            event.returnValue = ''; // Required for some browsers
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [code, timeLeft, totaltime]);
    function test_case_result(){

        if(!code.trim()){
            alert("you didn't write yet")
            return
          }
          fetch("http://127.0.0.1:5000/solo_submit",{
            method:"post",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({code,room_id})
          })
          .then(data=>data.json())
          .then((data)=>{
            if(!data.success){
              setresult("")
            setcolor("red")
            seterror(data.error)
            setcompilation_status("😟 Compilation Unsuccessful ❌")
            }
            settest_result(data)
          })

    }
  return (
//     <div className='body-co '>
//         <div style={{ textAlign: "center", padding: "20px" }}  class="container">
//         <h1>Welcome, {username}! Your game has started 🎮</h1>
//         <h2>timer {timeLeft}sec</h2>
//         <h2>Question: {question}</h2>

//     <h1>question_ids{question_ids}</h1>

// <h3>Test Cases:</h3>
// <ul>
//   {Object.entries(Testcases).slice(0, 2).map(([input,output],index) => (
//     <li key={index}>
//       <strong>Test {index+1} :-</strong> Input : {input} :: Output : {output}
//     </li>
//   ))}
// </ul>
// <div className="ide">
//       <textarea 
//        rows="10"
//         cols="60"
//       placeholder='Enter your Code here'
//       onChange={(e)=>{setcode(e.target.value)}}
//       />
// <br/>
//     <textarea 
//        rows="5"
//         cols="60"
//       placeholder='Enter your input  here'
//       onChange={(e)=>{setinput(e.target.value)}}
//       />
//       <br/>
//       <div className="buttons"  >
//       <button  className="btn-compile" onClick={code_run}>Run⌛</button>
//       <button className="btn-run" onClick={Submit}>Submit🎯</button>
      
//       </div>
//       </div>
//       <div className='output'>
//       <h3>
//         Compilation Message:
//         <pre style={{color:color}}>{compilation_status}</pre>
        
//       </h3>
//       <h3>
//         The output :
//         <pre style={{color:color}}>{result}</pre>
//       </h3>
//       <h3>
//         The Error :
//         <pre style={{color:color}}>{error}</pre>
//       </h3>
//       </div> 
//       {test_result &&(<div>
//       <h3>The test results are </h3>
//       {
//         Object.entries(test_result).map(([no,re],index)=>(
//           <p key={index}>Testcase no : {+no+1}) {re?"✅":"❌"} </p>
//         ))
//       }
//       </div>)}
//     </div>
//     </div>

<div id="coding-room-container">
<h1 className="welcome-text">Welcome, {username}! Your game has started 🎮</h1>
<h2 className="timer-text">Timer: {timeLeft} sec</h2>
<h2 className="question-heading">Question:</h2>
<p className="question-text">{question}</p>

<h1 className="question-ids">Question ID: {question_ids}</h1>

<div className="testcases">
  <h3>Test Cases:</h3>
  <ul>
    {Object.entries(Testcases).slice(0, 2).map(([input, output], index) => (
      <li key={index} className="testcase-item">
        <strong>Test {index + 1}:</strong> Input: {input} :: Output: {output}
      </li>
    ))}
  </ul>
</div>

<div className="ide">
  <textarea
    className="code-input"
    rows="10"
    cols="60"
    placeholder="Enter your code here"
    onChange={(e) => setcode(e.target.value)}
    // onPaste={(e) => e.preventDefault()}
  />
  <br />
  <textarea
    className="input-field"
    rows="5"
    cols="60"
    placeholder="Enter your input here"
    onChange={(e) => setinput(e.target.value)}
  />
  <br />
  <div className="buttons">
    <button className="btn-compile" onClick={code_run}>Run ⌛</button>
    <button className="btn-run" onClick={Submit}>Submit 🎯</button>
  </div>
</div>

<div className="output">
  <h3>Compilation Message:</h3>
  <pre className="compilation-status">{compilation_status}</pre>

  <h3>The Output:</h3>
  <pre className="output-result">{result}</pre>

  <h3>The Error:</h3>
  <pre className="error-message">{error}</pre>
</div>


</div>
  )
}

export default Coding_room1



// import React, { useEffect, useState } from 'react';
// import axios from "axios";
// import { useLocation, useNavigate } from 'react-router-dom';

// const Coding_room1 = () => {
//     const query = new URLSearchParams(useLocation().search);
//     const username = query.get("username");
//     const room_id = query.get("room_id");

//     const navigate = useNavigate();
//     const [input, setinput] = useState("");
//     const [code, setcode] = useState("");
//     const [compilation_status, setcompilation_status] = useState("");
//     const [result, setresult] = useState("");
//     const [error, seterror] = useState("");
//     const [color, setcolor] = useState("");
//     const [question, setquestion] = useState();
//     const [timeLeft, settimeleft] = useState();
//     const [totaltime, setdata] = useState();
//     const [Testcases, settestcase] = useState({});

//     // Fetch question on component mount
//     useEffect(() => {
//         try {
//             fetch("http://127.0.0.1:5000/question_genarate", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ room_id })
//             })
//                 .then((data) => data.json())
//                 .then((data) => {
//                     setdata(data.question_time);
//                     setquestion(data.question);
//                     settestcase(data.testcases);
//                     settimeleft(data.question_time);
//                 })
//                 .catch(() => {
//                     setquestion({ question: "Sorry server error" });
//                 });
//         } catch (err) {
//             alert(err);
//         }
//     }, []);

//     // Timer logic
//     useEffect(() => {
//         if (timeLeft <= 0) {
//             autosubmit();
//             return;
//         }
//         const timout = setInterval(() => {
//             settimeleft((prev) => prev - 1);
//         }, 1000);
//         return () => clearInterval(timout);
//     }, [timeLeft]);

//     // Autosubmit function
//     const autosubmit = () => {
//         // if (!code.trim()) {
//         //     alert("Sorry you didn't write yet. Autosubmit will not work.");
//         //     return;
//         // }
//         Submit();
//     };

//     // Submit function
//     const Submit = async () => {
//         let time = totaltime - timeLeft;
//         try {
//             const response = await fetch("http://127.0.0.1:5000/code_submit", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ code, room_id, username, time })
//             });
//             const data = await response.json();
//             alert("Submit successful! Testcases passed: " + data.result);
//         } catch {
//             alert("Error submitting code!");
//         } finally {
//             navigate("/");
//         }
//     };

//     // Code run function
//     const code_run = async () => {
//         try {
//             const response = await axios.post("http://127.0.0.1:5000/code_run", {
//                 code, room_id, username, input
//             });
//             if (response.data.success) {
//                 seterror("");
//                 setcolor("green");
//                 setcompilation_status("😊 Compilation Successful 👍🏻");
//                 setresult(response.data.output);
//             } else {
//                 setresult("");
//                 setcolor("red");
//                 seterror(response.data.error);
//                 setcompilation_status("😟 Compilation Unsuccessful ❌");
//             }
//         } catch (err) {
//             setcompilation_status("🚨 Error connecting to the server!");
//             seterror(err.message);
//         }
//     };

//     // Handle tab close or refresh
//     useEffect(() => {
//         const handleBeforeUnload = (event) => {
//             autosubmit(); // Call autosubmit before unload
//             event.preventDefault();
//             event.returnValue = ''; // Required for some browsers
//         };
//         window.addEventListener('beforeunload', handleBeforeUnload);

//         return () => {
//             window.removeEventListener('beforeunload', handleBeforeUnload);
//         };
//     }, [code, timeLeft, totaltime]); // Dependencies to track state changes

//     return (
//         <div style={{ textAlign: "center", padding: "20px" }} className="container">
//             <h1>Welcome, {username}! Your game has started 🎮</h1>
//             <h2>Timer: {timeLeft} sec</h2>
//             <h2>Question: {question}</h2>

//             <h3>Test Cases:</h3>
//             <ul>
//                 {Object.entries(Testcases).slice(0, 2).map(([input, output], index) => (
//                     <li key={index}>
//                         <strong>Test {index + 1}:</strong> Input: {input} :: Output: {output}
//                     </li>
//                 ))}
//             </ul>
//             <div className="ide">
//                 <textarea
//                     rows="10"
//                     cols="60"
//                     placeholder="Enter your code here"
//                     onChange={(e) => { setcode(e.target.value) }}
//                 />
//                 <br />
//                 <textarea
//                     rows="5"
//                     cols="60"
//                     placeholder="Enter your input here"
//                     onChange={(e) => { setinput(e.target.value) }}
//                 />
//                 <br />
//                 <div className="buttons">
//                     <button className="btn compile" onClick={code_run}>Run⌛</button>
//                     <button className="btn run" onClick={Submit}>Submit🎯</button>
//                 </div>
//             </div>
//             <div className="output">
//                 <h3>
//                     Compilation Message:
//                     <pre style={{ color: color }}>{compilation_status}</pre>
//                 </h3>
//                 <h3>
//                     The output:
//                     <pre style={{ color: color }}>{result}</pre>
//                 </h3>
//                 <h3>
//                     The Error:
//                     <pre style={{ color: color }}>{error}</pre>
//                 </h3>
//             </div>
//         </div>
//     );
// };

// export default Coding_room1;

