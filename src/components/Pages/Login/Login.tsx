import React, { useState} from 'react';
import {useDispatch} from "react-redux";
import {setAdmin} from "../../../Redux/authActions";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import host_url from "../../../host/url";

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const dataToSend ={
      username: username,
      password: password
    }
    try {
     const response = await axios.post(
        `${host_url}/auth/login`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        localStorage.setItem("jwtToken", response.data.token);

        if (response.data.isAdmin !== undefined) {
          dispatch(setAdmin(response.data.isAdmin));
        }
        alert("Logged successfully");
      }

    }catch (e:any){
     alert(e.response.data.message)
    }
  };

  const handleLogOut = ()=>{
    localStorage.removeItem("jwtToken");
    alert("Logged out successfully")

  }

  const handleClickRegistration = () => {
    navigate("/registration");
  };

  return (
    <div className={"container"}>
      <h1>Login</h1>
      <div>
        <input
          type="text"
          className={"cast__inp login"}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder={"enter username"}
          value={username}
        />
      </div>
      <div>
        <input
          type="password"
          className={"cast__inp login"}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder={"enter password"}
          value={password}
        />
      </div>
      <button className={"btn"} onClick={handleLogin}>Log in</button>
      <div className="links__cont">
        <div onClick={handleClickRegistration} className={"link register"}>Don't have an account? Register</div>
        <div onClick={handleLogOut} className={"link register"}>Log out</div>

      </div>

    </div>
  );
};

export default Login;