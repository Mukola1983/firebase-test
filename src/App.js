import './App.css';
import ImagesInput from "./components/ImagesInput";
import React, {createContext, useState} from "react";
import {BrowserRouter, Route, Switch } from "react-router-dom";
import Main from "./pages/main/Main";
import Login from "./pages/login/Login";
import Navbar from "./pages/Navbar";
import Posts from "./pages/Posts";
import DialogComponent from "./shared/DialogComponent";


export const AppContext = createContext(null);

function App() {

    const [values, setValues] = useState({
        openDialog: false,
        dialogComponent: <Login/>
    })


    const handleDialog =() =>{
        setValues(prev =>({
            ...prev,
            openDialog: false
        }))
    }
  return (
      <BrowserRouter>
          <AppContext.Provider value={{values, setValues}}>
              <div>
                  <Navbar/>
              </div>
              <DialogComponent title={'Реєстрація'}  dialog={values.openDialog}
                               closeDialog={handleDialog} Component={values.dialogComponent}/>
          <Switch>
              <Route path={"/"} exact component={Main}/>
              <Route path={"/login"}  component={Login}/>
              <Route path={"/images"}  component={ImagesInput}/>
              <Route path={"/posts"}  component={Posts}/>
          </Switch>
          </AppContext.Provider>
      </BrowserRouter>
  );
}

export default App;
