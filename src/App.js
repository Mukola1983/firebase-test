import './App.css';
import ImagesInput from "./components/ImagesInput";
import React from "react";
import {BrowserRouter, Route, Switch } from "react-router-dom";
import Main from "./pages/main/Main";
import Login from "./pages/Login";
import Navbar from "./pages/Navbar";
import Posts from "./pages/Posts";

function App() {
  return (
      <BrowserRouter>
              <div>
                  <Navbar/>
              </div>
          <Switch>
              <Route path={"/"} exact component={Main}/>
              <Route path={"/login"}  component={Login}/>
              <Route path={"/images"}  component={ImagesInput}/>
              <Route path={"/posts"}  component={Posts}/>
          </Switch>
      </BrowserRouter>
  );
}

export default App;
