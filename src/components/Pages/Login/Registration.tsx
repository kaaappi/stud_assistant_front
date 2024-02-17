import React, {FC, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import host_url from "../../../host/url";

const Registration:FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegistration = async () => {
    const dataToSend = {
      username: username,
      password: password
    };

    try {
      const response = await axios.post(
        `${host_url}/auth/register`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        handleClickRegistration()
        alert("User registered successfully");
      } else {
       alert(response.data.message)
      }
    } catch (error:any) {
      alert(error.response.data.message)
      handleClickRegistration()
    }
  };

  const handleClickRegistration = () => {
    navigate("/login");
  };

  return (
    <div className={"container"}>
      <h1>Registration</h1>
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
      <button className={"btn"} onClick={handleRegistration}>Register</button>
      <div className="links__cont">
        <div onClick={handleClickRegistration} className={"link register"}>Already have account? Log in</div>

      </div>
    </div>
  );
};

export default Registration;