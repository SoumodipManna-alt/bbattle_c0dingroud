import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = (props) => {
  const { Component, ...rest } = props;
  const navigate = useNavigate();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return; // Prevents the second execution

    let set_ket = localStorage.getItem('auth');
    if (set_ket !== 'true') {
      alert("You didn't login yet");
      navigate("/Login");
    }

    effectRan.current = true;
  }, []);

  return <Component {...rest} />;
};

export default PrivateRoute;
