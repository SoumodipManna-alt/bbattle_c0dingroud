import React ,{useState,useEffect} from 'react'
import { data,useNavigate } from 'react-router-dom'
import "./Styles/Multiplayer.css";
import {io} from "socket.io-client"
const socket =io("http://localhost:5000")

const Multiplayer = () => {
  const[usernamelocal,setuserlocal]=useState(localStorage.getItem("username"))
  
  const[roomid,setroomid]=useState("")
  const[username,setusername]=useState("")
  const[round,setRound]=useState(1)
  const[roomType,setRoomType]=useState()
  const navigate=useNavigate()
useEffect(()=>{
  if(usernamelocal){
    setusername(usernamelocal)
  }
},[usernamelocal])
useEffect(()=>{
  const room_created_fun =(data)=>{
    // localStorage.setItem("username",username)
    localStorage.setItem("Game_round",data.round)
    alert("ROOM IS CREATED");
    navigate(`/room/${data.room_id}?username=${encodeURIComponent(username)}`,{state:{round:data.round}});
  }
  const handel_error=(data)=>{
    alert(data.message)
  }
  function join_room_fun(data){
    localStorage.setItem("Game_round",data.round)
  }
  socket.on("room_created",room_created_fun)
  socket.on("join_room_c",join_room_fun)
  socket.on("error",handel_error)
  return ()=>{
    socket.off("room_created",room_created_fun)//clean up
    socket.off("error",handel_error)
  }
},[navigate,username])


function createroom(e){
  e.preventDefault()
  if(!username){
    alert('Please enter your name before creating a room.')
    return 
  }
  let newrooid=Math.random().toString(36).substring(2,7)
  // console.log(newrooid);
  localStorage.setItem("Game_round",round)
  socket.emit("create_room",{room_id:newrooid,username,round})

}
function joinroom(e){
  // alert("ROOM not CREATED")
  e.preventDefault()
  if(! username || ! roomid){
    alert("Please fill up all required filed")
    return
  }
  // localStorage.setItem("Game_round",round)

  socket.emit("join_room",{room_id:roomid,username},)
  navigate(`/room/${roomid}?username=${encodeURIComponent(username)}`);
}
  return (
//    <div classNameName="room-page">
//      <h1>Debug & Dominate</h1>
//     <div classNameName='main' >
     
//       <h5>multiplayer mode</h5>
//       <h5>Real-Time Programming Battles</h5>
//     <div classNameName='forms'>
//         <div classNameName='form-card'> 
//         <h3>Create Room</h3>
//       <input type="text"  placeholder="Enter your name" value={username}  onChange={(e)=>setusername(e.target.value)} required/>
//       <div classNameName="dropdowns">
//              <select
                    //className="form-select"
//                 value={roomType}
//                 onChange={(e) => setRoomType(e.target.value)}
//               >
//                 <option value="" disabled>
//                   Select language
//                 </option>
//                 <option value="Java">Python</option>
//                 <option value="Python" disabled>Java</option>
//                 <option value="Ruby" disabled>Ruby</option>
//               </select>
//               <input
//                 className="form-round-input"
//                 type="text"
//                 value={round}
//                 onChange={(e) => setRound(e.target.value)}
//                 placeholder="Enter how many round"
//               />
//             </div>
//       <button classNameName="create-btn" onClick={createroom}>+Create Room</button>
//       </div>   
   

//       <div classNameName='form-card'> 
//       <input type='text' placeholder="Enter your room id" value={roomid}  onChange={(e)=>setroomid(e.target.value)} required/>
//       <button classNameName="join-btn" onClick={joinroom}>→ Join Room</button>
//       </div> 
//     </div>
//   </div>
// </div> 
<div className="room-page">
  <div className="header">
    <h1 className="header-title">Debug & Dominate</h1>

  </div>

  <div className="main">
    
    <h2 className="subheading">Multiplayer Mode</h2>
    <h3 className="subheading">Real-Time Programming Battles</h3>

    <div className="forms">
   
      <div className="form-card">
        <h3>Create Room</h3>
        <input className="form-input" type="text"  placeholder="Enter your name" value={username}  onChange={(e)=>setusername(e.target.value)} required />

        <div className="dropdowns">
        <select
                    className="form-select"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="" disabled>
                  Select language
                </option>
                <option value="Java">Python</option>
                <option value="Python" disabled>Java</option>
                <option value="Ruby" disabled>Ruby</option>
              </select>

              <input
                className="form-round-input"
                type="text"
                value={round}
                onChange={(e) => setRound(e.target.value)}
                placeholder="Enter how many round"
              />
        </div>

        <button className="create-btn" onClick={createroom}>+Create Room</button>
      </div>

     
      <div className="form-card">
        <input
          className="form-input"
          type='text' placeholder="Enter your room id" value={roomid}  onChange={(e)=>setroomid(e.target.value)} required
        />
         <button className="join-btn" onClick={joinroom}>→ Join Room</button>
      </div>
    </div>
  </div>
</div>

  )
}

export default Multiplayer
// why Math.random().toString(36).substring(2,7)
// is used to generate a random 5-character alphanumeric string. Let’s break it down:

// 1. Math.random()
// Generates a random decimal number between 0 and 1 (e.g., 0.8392940923).

// 2. .toString(36)
// Converts the random number to a base-36 string. Base-36 includes:

// Digits: 0-9

// Letters: a-z