import React, { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './Styles/Profile.css'
const Profile = () => {
  const[email,setemail]=useState()
  const[data ,setdata]=useState({})
  const[history,sethistory]=useState([])
  const[toggle,settoggle]=useState(false)
  const chartData = history.map((value, index) => ({
    game: `Game ${index + 1}`,
    position: value[1],
    performance: 1 / value[1], // Better position -> higher performance
  }));
  
  useEffect(()=>{
    const email_local=localStorage.getItem("useremail")
    if(!email_local){
     
      return
    }
    setemail(email_local)
    fetch("http://127.0.0.1:5000/profile",{
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({email:email_local})
    })
    .then(res=>res.json())
    .then((data)=>{
        setdata(data.data)
        sethistory(data.history)
       
    })
    
    
  },[])

  // function fetch_histry(){
  //  console.log(history);
   
  // }
 
  return (
    <div className='profile-container'>
    <ul className="profile-info" >
    <li>ID : {data.ID}</li>
    <li>Name : {data.Name}</li>
    <li>Email : {data.Email}</li>
    </ul>
    <button className='toggle-history-btn' onClick={()=>settoggle(!toggle)}>{toggle?"Hide History":"Show History"}</button>
    
    {
      toggle&&(
        
        <table className="history-table">
          <thead>
          
            <tr>
              <th>Room id</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {
              history.map((value,index)=>(
                <tr key={index}>
                  <td>{value[0]}</td>
                  <td>{value[1]}</td>
                </tr>
              ))
            }
          </tbody>

        </table>
      )
    }

{toggle && history.length > 0 && (
  <div className="performance-chart">
    <ResponsiveContainer>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="game" />
        <YAxis domain={[0, 'auto']} label={{ value: 'Performance', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Line type="monotone" dataKey="performance" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}

    </div>
  )
}

export default Profile
