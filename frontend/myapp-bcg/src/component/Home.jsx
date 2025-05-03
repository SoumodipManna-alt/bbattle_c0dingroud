import React, { useState } from 'react'
import './Styles/Home.css'
import { data, useLocation,useNavigate } from 'react-router-dom'
const Home = () => {
  const query = new URLSearchParams(useLocation().search)
  const [username, setname] = useState(localStorage.getItem("username") || "Alien");
  const[toggle,settoggle]=useState(false)
 
    const question_ids=query.get("question_ids")
    console.log(localStorage.getItem("username"));
    
  return (
    <div className="home-container">
      <h1>Hi {username}</h1>
      <h2>"Boost your programming skills with real-time coding challenges — compete, learn, and grow with friends."</h2>
      <button onClick={()=>settoggle(!toggle)} className='auth-btn '>{!toggle?"Show rules":"Hide rules"}</button>
      <div>
      {toggle && (
  <div className="rules-container">
    <h3>📜 How to Play:</h3>
    <ul>
      <li>🔥 <strong>Step 1:</strong> Log in and get ready to compete</li>
      <li>🎮 <strong>Step 2:</strong> Enter the Multiplayer zone</li>
      <li>🏗️ <strong>Step 3:</strong> Create your coding arena with custom rounds</li>
      <li>🤝 <strong>Step 4:</strong> Share your Room ID and bring your friends on board</li>
      <li>🚀 <strong>Step 5:</strong> Start the game and show your skills!</li>
    </ul>
    <h3>🏆 Check the Results</h3>
    <ul>
      <li>📊 <strong>Step 1:</strong> Visit the Leaderboard section</li>
      <li>🔍 <strong>Step 2:</strong> Enter your Room ID and Round to see who ruled the game</li>
    </ul>
  </div>
)}

      </div>
     
    </div>
  )
}

export default Home
