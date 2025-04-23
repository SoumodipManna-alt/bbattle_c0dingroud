import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// const Navigation_bar = () => {
//   const isAuthenticated = localStorage.getItem("auth") === "true";
  // const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("auth"); // Remove authentication
//     navigate("/");
//   };

//   return (
//     <div>
//       <ul className='navbar'>
//         <li><NavLink className='navbarlink' to="/mainpage">Home</NavLink></li>
//         {isAuthenticated ? (
//           <>
//             <li><NavLink className='navbarlink' to="/solo">Solo</NavLink></li>
//             <li><NavLink className='navbarlink' to="/multiplayer">MultiPlayer</NavLink></li>
//             <li><NavLink className='navbarlink' to="/leaderboard">LeaderBoard</NavLink></li>
//             <li><NavLink className='navbarlink' to="/profile">Profile</NavLink></li>
//             <li><button onClick={handleLogout}>Logout</button></li>
//           </>
//         ) : (
//           <li><NavLink className='navbarlink' to="/">Login</NavLink></li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default Navigation_bar;






const Navigation_bar = () => {
  return (
    <div>
      <ul className='navbar'>
        <li><NavLink className='navbarlink' to="/">Home</NavLink></li>
      <li><NavLink className='navbarlink' to="/solo">Solo</NavLink></li>
      <li><NavLink className='navbarlink' to="/multiplayer">MultiPlayer</NavLink></li>
      <li><NavLink className='navbarlink' to="/leaderboard">LeaderBoard</NavLink></li>
      <li><NavLink className='navbarlink' to="/profile">Profile</NavLink></li>
      <li><NavLink className='navbarlink' to="/Login">Login</NavLink></li>

      </ul>

    </div>
  )
}

export default Navigation_bar