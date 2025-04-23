import React,{useEffect, useState} from 'react'
import { data,useNavigate, useParams,useLocation } from 'react-router-dom'
import {io} from "socket.io-client"
import "./Styles/Room.css"
const socket =io("http://localhost:5000")
const Room = () => {
  const {roomId}=useParams()
  const location = useLocation();
const set_round = location.state?.round;
localStorage.setItem("Game_round",set_round)
  const query = new URLSearchParams(useLocation().search);
  const username = localStorage.getItem("username")
  const [isReady, setIsReady] = useState(false);

  const [users,setusername]=useState([])
  const [user_messages,setuser_message]=useState([])
  const [message,setmessage]=useState("")
  const [question_ids,set_question_ids]=useState()
  const [toggle,settoggle]=useState(true)
  const navigate=useNavigate()
  const [round,setround]=useState()
  const[player_message,setplayer_message]=useState("")
  const[color,setcolor]=useState()
  const total_round = localStorage.getItem("Game_round")
 useEffect(()=>{
  if (!username) return;

  // room update
  socket.emit("join_room", { room_id: roomId, username });
  socket.on("room_update",(data)=>{
    // console.log(data.user);
    setusername(data.user)
})


// socket.on("message_history", (data) => {
  
//   console.log(data);
  
//   setuser_message(data.messages);
// });

  socket.on("new_message", (data) => {
    console.log(data);
    
  setuser_message((prevMessages) => [
    ...prevMessages,
    { user: data.user, text: data.msg },
  ]);
});
 

  socket.on("staring_game",(data)=>{
    set_question_ids(data.question_ids)
    setround(data.round)
  
    navigate(`/coding_room?username=${username}&room_id=${roomId}&question_ids=${data.question_ids}`)
  })

  return()=>{
    socket.off("room_update")
    // socket.off("message_history")
    socket.off("new_message")
    // socket.off("staring_game")
  }
 },[roomId,username])
 socket.on("palyer_not_ready",()=>{
  // console.log("hi");
  setcolor("red")
  setplayer_message("All players not ready")
})
socket.on("all_user_submitted",()=>{
  setcolor("green")
  setplayer_message("All players submitted previous round")
})

function message_submit(e){
  e.preventDefault()
  if (!message.trim()) return;

  fetch("http://127.0.0.1:5000/message_submit",{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({'user':username,'msg':message,'roomid':roomId})

  }).then((res) => res.json()).then((data) => {
    if (data.success) setmessage("");
    else{
      alert(data.message)
    }
  });
  
}

// starting game 
function Start_game(){
  // handleReadyToggle()
    socket.emit("start_game",{"room_id":roomId})
  
  
}
function handleReadyToggle() {
  const newReadyState = !isReady;
  setIsReady(newReadyState);

  socket.emit("player_ready_toggle", {
    room_id: roomId,
    username: username,
    ready: newReadyState
  });
}

useEffect(()=>{
  handleReadyToggle()
},[])
  return (
    <div className='body-c'>
      
      <div className="room-container">
  <div className="panel">
    <h3>Participants</h3>
    <ul className="participants">
      {users.map((user, index) => <li key={index}>{user}</li>)}
    </ul>
    <h3>Room: {roomId}</h3>
    <button className="copy-btn" onClick={()=>{navigator.clipboard.writeText(roomId)
        alert("Room id is copied")
      }}>Copy Room ID</button>
    <h3>Round Remaining: {total_round}</h3>
  </div>

  <div className="panel">
    <h3>Chat</h3>
    <div className="chat">
      {user_messages.map((msg, index) => (
        <p key={index}><strong>{msg.user}:</strong> {msg.text}</p>
      ))}
    </div>
    <div>
    <input
      type="text"
      placeholder="Enter message"
      value={message}
      onChange={(e) => setmessage(e.target.value)}
    />
    <button onClick={message_submit}  className='send-button'>Send</button>
  

    </div>
    <button className="start-btn" onClick={Start_game}>Start Game 🎮</button>

    <p className="message-status" style={{ color: color }}>{player_message}</p>
  </div>
</div>

      {/* <h2>The room id is : {roomId}</h2>
      <h2>Round Remaining:{total_round}</h2>
      <button onClick={()=>{navigator.clipboard.writeText(roomId)
        alert("Room id is copied")
      }}
      style={{ marginLeft: "10px", cursor: "pointer", color:"red", padding:"1px", width:50, height:100 }}
      >Copy 📋</button>
      <h3>Players in room :</h3>
      <ul>
        {users.map((user,index)=>(
          <li key={index}>{user}</li>
        ))}
      </ul>
      
      <h3>Chat message:</h3>
      <ul>
        
  {user_messages.map((msg, index) => (
   
    
    <li key={index}>
      <strong>{msg.user}</strong>: {msg.text}
    </li>
  ))}
</ul>

        <input type="text" placeholder='Enter message' value={message} onChange={(e)=>{setmessage(e.target.value)}} required/>
        <button onClick={message_submit}>Send🖋️</button>
        <button onClick={Start_game} >Start Game🎮</button>

<p style={{color:color}}>{player_message}</p> */}
    </div>
  )
}

export default Room


