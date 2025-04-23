import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import Mainpage from './component/Mainpage';
import Signup from './component/Signup';
import Solo from './component/Solo';
import Navigation_bar from './component/Navigation_bar';
import MultiPlayer from './component/MultiPlayer';
import LeaderBoard from './component/LeaderBoard';
import Profile from './component/Profile';
import PrivateRoute from './component/PrivateRoute';
import Login from './component/Login';
import Room from './component/Room';
import Coding_room from './component/Coding_room';
import Coding_room1 from './component/Coding_room1';

function App() {
  useEffect(()=>{
    localStorage.clear()
  },[])
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation_bar />
        <Routes>
         
          <Route path="/" element={<Home />} />
          <Route path='/Login' element={<Login />}/>
          
          <Route path='/solo' element={<PrivateRoute Component={Solo} />}/>
          <Route path='/multiplayer' element={<PrivateRoute Component={MultiPlayer}  />}/>
          <Route path='/leaderboard' element={<PrivateRoute Component={LeaderBoard} />}/>
          <Route path='/profile' element={<PrivateRoute Component={Profile} />}/>
          <Route path='/room/:roomId' element={<Room/>}/>
          <Route path='coding_room' element={<Coding_room1/>}/>

          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
