// import React,{useEffect, useState} from 'react'
// import { data, useLocation } from 'react-router-dom'
// import axios from "axios"


// const Coding_room = () => {
//     const query = new URLSearchParams(useLocation().search);
//       const username = query.get("username");
//       const room_id=query.get("room_id")
      
//       const[code ,setCode]=useState("")
//       const[input,setinput]=useState("")
//       const[compilemessage,setcompliemessage]=useState("")
//       const[output,setoutput]=useState("")
//       const[error,seterror]=useState("")
//       const[color,setcolor]=useState("")
//       const[timeleft,settimeleft]=useState(5)
//       const[fetch_status,setfetch_status]=useState(false)
//       const[question,setquestion]=useState([])
     


//       //run
//       const code_run = async()=>{
//        try {var response = await axios.post("http://127.0.0.1:5000/code_run",{code,input})
//         if(response.data.success){
//           setcolor("green")
//           seterror("")
//           setcompliemessage("😊Compilation Successfull👍🏻")
//           console.log(response.data.output);
          
//           setoutput(response.data.output)
//         }
//         else{
//             setcolor("red")
//             setcompliemessage("😟Compilation unSuccessfull❌")
//             setoutput(response.data.message)
//             seterror(response.data.error)
//         }}
//         catch{
//           setcompliemessage("🚨 Error connecting to the server!");
//           seterror(response.data.error);
//         }
//       }
//       useEffect(()=>{
//         if(!fetch_status){
//           const timer=setTimeout(()=>{
//             question_genarate()
//             setfetch_status(true)
//           },5000)

        
//         const coundown=setInterval(()=>{
//           settimeleft((prev)=>(prev>0)?prev-1:0)
//         },1000)
//         return ()=>
//          {
//         clearTimeout(timer)
//         clearInterval(coundown)// here  Before re-running the effect, React clears this means always return :
//         // Does useEffect Always Return Previous Things?
//         // When useEffect re-runs, it first cleans up the previous effect (if there was one) before executing the new effect. However, this does not mean it "returns" anything from the previous run. Instead, it stops any timers, intervals, or event listeners from the previous run to prevent memory leaks or duplicate effects.
        
        
//       }
//       }},[fetch_status])


// function starting_count(time){
//   const coundown2 =setInterval(() => {
//     settimeleft((prev)=>(prev>0?prev:0))
//   }, 1000);
//   setTimeout(() => {
//     clearInterval(coundown2)
//   }, time);
// }
      
//       const question_genarate =()=>{
//           fetch("http://127.0.0.1:5000/question_genarate").then((data)=>data.json()).then((data)=>{
            
//             setquestion(data)
          
//           })
        
          
          
//       }

//       function Submit(){
//         fetch("http://127.0.0.1:5000/code_submit",{
//           method:"POST",
//           headers:{
//             'Content-Type':'application/json'
//           },
//           body:JSON.stringify({"code":code,"room_id":room_id})
//         }).then((data)=>data.json())
//         .then((data)=>alert(data.message))
//       }
//   return (
//     <div>
//       <h1>Welcome {username} , your game have been started </h1>
        
//         <h1>the timer : {timeleft}</h1>
//         <p>the question : </p>
//         <ul>
//           {question.map((q,index)=>(
//                <div key={index}>
//                <p>the question : {q.question}</p>
//                <p>Input 1: {q.input1}</p>
//                <p>Input 2: {q.input2}</p>
//              </div>
//           ))}
//         </ul>
      
//       <h2>Here your Python idle</h2>
//       <textarea 
      
//       rows='20'
//       cols='60'
//       placeholder='Enter your code here'
//       value={code}
//       onChange={(e)=>{setCode(e.target.value)}}
//       />

// <textarea 
      
//       rows='10'
//       cols='60'
//       placeholder='Enter your input here'
//       value={input}
//       onChange={(e)=>{setinput(e.target.value)}}
//       />

      
//       <button onClick={code_run}>Run🏃🏻‍♀️‍➡️</button>
//       <button onClick={Submit}>Submit🎯</button>
//       <h3>Compilation Status⌛:</h3>
//       <pre style={{color:compilemessage ?"green":"red"}}>{compilemessage||error}</pre>
//       <h3>Result Status:</h3>
//       <pre style={{color:color}}>{output}</pre>
//       <h3>error:</h3>
//       <pre style={{color:color}}>{error}</pre>
//     </div>
//   )
// }

// export default Coding_room
import React, { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";

const CodingRoom = () => {
  const query = new URLSearchParams(useLocation().search);
  const username = query.get("username");
  const room_id = query.get("room_id");

  const navigate=useNavigate()
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [compileMessage, setCompileMessage] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [color, setColor] = useState("");
  const [timeLeft, setTimeLeft] = useState(); // Start with 30 seconds
  const [data, setdata] = useState({});
  const [question,setquestion]=useState()
  const [Testcases,settestcase]=useState({})
  // ✅ Fetch question when the component mounts
  useEffect(() => {
    fetch("http://127.0.0.1:5000/question_genarate",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({room_id})
        })
      .then((res) => res.json())
      .then((data) => {
        setdata(data);
        setquestion(data.question)
        settestcase(data.testcases)
        setTimeLeft(data.question_time)
        console.log(Testcases);
        
      })
      .catch(() => {
        setdata({ question: "Error fetching question!" });
      });
  }, []);

  // ✅ Timer countdown & auto-submit
  useEffect(() => {
    if (timeLeft <= 0) {
      autoSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ Auto-submit when timer reaches 0
  const autoSubmit = () => {
    if (!code.trim()) {
      alert("No code written! Auto-submit skipped.");
      return;
    }
    Submit();
  };

  // ✅ Function to run code
  const codeRun = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/code_run", {
        code,
        input,
      });

      if (response.data.success) {
        setColor("green");
        setError("");
        setCompileMessage("😊 Compilation Successful 👍🏻");
        setOutput(response.data.output);
      } else {
        setColor("red");
        setCompileMessage("😟 Compilation Unsuccessful ❌");
        setOutput(response.data.message);
        setOutput(response.data.error);
      }
    } catch (err) {
      setCompileMessage("🚨 Error connecting to the server!");
      setError(err.message);
    }
  };

  // ✅ Function to submit code
  const Submit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/code_submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, room_id,username }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (err) {
      alert("Error submitting code!");
    }
    finally{
      navigate("/")
    }
  };
  

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome, {username}! Your game has started 🎮</h1>
      <h2>Timer: {timeLeft}s</h2>

      {/* ✅ Display question */}
      <h2>Question: {question}</h2>

<h3>Test Cases:</h3>
<ul>
  {Object.entries(Testcases).map(([input,output],index) => (
    <li key={index}>
      <strong>Test {index+1} :-</strong> Input : {input} :: Output : {output}
    </li>
  ))}
</ul>

        
       
      <h2>Python Code Editor</h2>

      {/* ✅ Code input */}
      <textarea
        rows="10"
        cols="60"
        placeholder="Enter your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {/* ✅ Input values */}
      <textarea
        rows="5"
        cols="60"
        placeholder="Enter your input here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br />
      <button onClick={codeRun}>Run🏃🏻‍♀️</button>
      <button onClick={Submit}>Submit🎯</button>

      {/* ✅ Compilation output */}
      <h3>Compilation Status:</h3>
      <pre style={{ color: compileMessage ? "green" : "red" }}>
        {compileMessage || error}
      </pre>

      <h3>Result Output:</h3>
      <pre style={{ color }}>{output}</pre>
    </div>
  );
};

export default CodingRoom;


//Explaintation
// Understanding Object.keys(Testcases).map(...)
// 💡 Goal: We are looping through the Testcases object and displaying the test cases dynamically.

// Step 1: Understanding the Data Structure
// Your Testcases object looks like this:

// json
// Copy code
// {
//   "testcase1": { "input1": "4", "output1": "True" },
//   "testcase2": { "input2": "5", "output2": "False" },
//   "testcase3": { "input3": "1", "output3": "False" }
// }
// Each testcase is an object containing an input and an output.

// Step 2: Object.keys(Testcases)
// 🔹 Object.keys(Testcases) gives us an array of keys:

// js
// Copy code
// ["testcase1", "testcase2", "testcase3"]
// Now we can loop through these keys to access the values inside each test case.

// Step 3: Using .map() to Loop
// js
// Copy code
// Object.keys(Testcases).map((key) => (
//   <li key={key}>
//     <strong>{key}:</strong> 
//     Input: {Testcases[key].input1 || Testcases[key].input2 || Testcases[key].input3}, 
//     Expected Output: {Testcases[key].output1 || Testcases[key].output2 || Testcases[key].output3}
//   </li>
// ))
// How it Works:
// Object.keys(Testcases).map((key) => { ... })

// Loops through the test case keys: "testcase1", "testcase2", "testcase3".
// key will be "testcase1" in the first loop, "testcase2" in the second loop, etc.
// Accessing Testcases[key]

// Testcases["testcase1"] → { "input1": "4", "output1": "True" }
// Testcases["testcase2"] → { "input2": "5", "output2": "False" }
// Testcases["testcase3"] → { "input3": "1", "output3": "False" }
// Why use || (OR operator)?

// Each test case stores input/output with different key names (input1, input2, input3).
// We check all possible keys and pick the first non-empty value:
// js
// Copy code
// Testcases[key].input1 || Testcases[key].input2 || Testcases[key].input3
// This ensures we always get the correct input value, no matter the key name.
// Final Output in HTML
// 🔹 This generates:

// html
// Copy code
// <ul>
//   <li><strong>testcase1:</strong> Input: 4, Expected Output: True</li>
//   <li><strong>testcase2:</strong> Input: 5, Expected Output: False</li>
//   <li><strong>testcase3:</strong> Input: 1, Expected Output: False</li>
// </ul>
// ✅ Now all test cases are displayed correctly! 🚀

// Let me know if you need further clarification. 😊