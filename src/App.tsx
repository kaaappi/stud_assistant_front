import React, {memo} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import NavBar from "./components/Nav/NavBar";
import Teachers from "./components/Pages/Teachers/Teachers";
import Workloads from "./components/Pages/Workloads/Workloads";
import "./styles/styles.css"
import MErrorBoundary from "./ErrorBoundary/MErrorBoundary";
import Schedule from "./components/Pages/Schedule/Schedule";
import { Provider } from 'react-redux';
import store from "./Redux/store";
import Login from "./components/Pages/Login/Login";
import TestComp from "./components/testComp";
import Registration from "./components/Pages/Login/Registration";

const App = () => {
  return (
    <MErrorBoundary>
      <Provider store={store}>
      <div>
        <BrowserRouter>
          <NavBar/>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/login" replace />}
            />
            <Route path={"/teachers"} element={< Teachers/>}/>
            <Route path={"/workloads"} element={< Workloads/>}/>
            <Route path={"/schedule"} element={< Schedule/>}/>
            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/registration"} element={<Registration/>}/>
          </Routes>
        </BrowserRouter>
      </div>
      </Provider>
    </MErrorBoundary>
  );

};

export default memo(App);