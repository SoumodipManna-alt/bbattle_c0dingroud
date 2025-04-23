import React, { useState } from 'react'

import { data, useLocation,useNavigate } from 'react-router-dom'
const Home = () => {
  const query = new URLSearchParams(useLocation().search)
  const [username, setname] = useState(localStorage.getItem("username") || "Alian");
  const[toggle,settoggle]=useState(false)
 
    const question_ids=query.get("question_ids")
    console.log(localStorage.getItem("username"));
    
  return (
    <div>
      <h1>Hi {username}</h1>
      <h2>"Boost your programming skills with real-time coding challenges — compete, learn, and grow with friends."</h2>
      <div>
        {toggle&&
        <div>
        <h3>🔥 Step 1: Log in and get ready to compete</h3>
<h3>🎮 Step 2: Enter the Multiplayer zone</h3>
<h3>🏗️ Step 3: Create your coding arena with custom rounds</h3>
<h3>🤝 Step 4: Share your Room ID and bring your friends on board</h3>
<h3>🚀 Step 5: Start the game and show your skills!</h3>

<h2>🏆 Check the Results</h2>
<h3>📊 Step 1: Visit the Leaderboard section</h3>
<h3>🔍 Step 2: Enter your Room ID and Round to see who ruled the game</h3>









        </div>
        

        }
      </div>
      <button onClick={()=>settoggle(!toggle)}>Shows Rules</button>
    </div>
  )
}

export default Home
