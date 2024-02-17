import React, {FC, memo, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Logo from "../../svgs/SvgComponents/Logo";

const NavBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState<string>(location.pathname);

  const handleClickTeachers = () => {
    navigate("/teachers");
    setActiveIcon("teachers");
  };
  const handleClickSchedule = () => {
    navigate("/schedule");
    setActiveIcon("schedule");
  };
  const handleClickWorkloads = () => {
    navigate("/workloads");
    setActiveIcon("workloads");
  };
  const handleLogin = () => {
    navigate("/login");
    setActiveIcon("login");
  };



  return (
    <div className="navbar">
      <Logo />
      <div  className="links">
        <div onClick={handleClickTeachers} className={activeIcon==="teachers" ?"link__active": "link"}>Teachers</div>
        <div onClick={handleClickSchedule} className={activeIcon==="schedule" ?"link__active": "link"}>Schedule</div>
        <div onClick={handleClickWorkloads} className={activeIcon==="workloads" ?"link__active":"link"}>Workloads</div>
      </div>
      <div onClick={handleLogin} className={activeIcon==="login" ?"link__active":"link"}>Login</div>
    </div>
  );
};

export default memo(NavBar);
