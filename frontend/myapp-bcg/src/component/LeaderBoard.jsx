import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { LineChart, Line } from 'recharts';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';


const LeaderBoard = () => {
  const [data, setData] = useState([]);
  const [room_id, setId] = useState("");
    const [round, setround] = useState("");

  const [message, setMessage] = useState("");
  const [toggle,settoggle]=useState(false)
  const user_email=localStorage.getItem("useremail")
  const[username,setusername]=useState(localStorage.getItem("username"))
  const chartData = data.map((row) => ({
    email: row[1],
    executionTime: row[4],
    memory: row[5],
    totalTime: row[6],
  }));
  
  
  // console.log(user_email);
  
  // Function to fetch result
  function fetching_result() {
    fetch("http://127.0.0.1:5000/result_showing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room_id ,round})
    })
    .then((data) => data.json())
    .then((res) => {
      setData(res.result);  // Set result data
      setMessage(res.message);  // Set message if any
      settoggle(true)
    })
    .catch((err) => {
      console.error("Error fetching results:", err);
      setMessage("Failed to fetch results.");
    });
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome {username} to Leaderboard</h1>
    {
      toggle&&
      data.map((row)=>{
        
        
        if(user_email==row[1]){
          return(
            <div>
            <h3 style={{color:"green"}} key={row[0]}>{username} , your possition is {row[7]} for this "{row[2]}" room </h3>
            <h3>The entire table is :</h3>
            </div>
          )
          
        }
        return null
        }
      )
      
    }
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Enter room ID" 
          value={room_id} 
          onChange={(e) => setId(e.target.value)} 
          className="border p-2 rounded mr-2"
        />
        <input 
          type="text" 
          placeholder="Enter round" 
          value={round} 
          onChange={(e) => setround(e.target.value)} 
          className="border p-2 rounded mr-2"
        />
        <button 
          onClick={fetching_result} 
          className="btn run"        >
          Fetch Results
        </button>
      </div>
      
      {message && <p className="mb-4 text-red-500" style={{color:"red"}}>{message}</p>}
      
      {data.length > 0 ? (
        <table className="">
          <thead>
            <tr className="bg-gray-200">
              
              <th className="border p-2">User_Email</th>
              <th className="border p-2">Room ID</th>
              <th className="border p-2">Testcases</th>
              <th className="border p-2">Execution Time (s)</th>
              <th className="border p-2">Memory Use (MB)</th>
              <th className="border p-2">Total Time (s)</th>
              <th className="border p-2">Position</th>
              <th className="border p-2">game round</th>
              <th className="border p-2">question id</th>


            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row[0]} className="text-center">
                 {/* Position */}
                <td className="border p-2">{row[1]}</td>  {/* Username */}
                <td className="border p-2">{row[2]}</td>  {/* Room ID */}
                <td className="border p-2">{row[3]}</td>  {/* Testcases */}
                <td className="border p-2">{row[4]}</td>  {/* Execution Time */}
                <td className="border p-2">{row[5]}</td>  {/* Memory Usage */}
                <td className="border p-2">{row[6]}</td> 
                <td className="border p-2">{row[7]}</td> {/* Total Time */}
                <td className="border p-2">{row[8]}</td>
                <td className="border p-2">{row[9]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No results to display.</p>
      )}
      
      {data.length > 0 && (
  <div style={{ width: "50%", height: 200, marginTop: "2rem" }}>
    <h3>Performance Chart</h3>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="email" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="executionTime" fill="#8884d8" name="Execution Time (s)" />
        <Bar dataKey="memory" fill="#82ca9d" name="Memory Use (MB)" />
        <Bar dataKey="totalTime" fill="#ffc658" name="Total Time (s)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}


    </div>
  );
};

export default LeaderBoard;
