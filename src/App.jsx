import './App.css';
import React, {createContext, useState} from "react";
import {BrowserRouter, Route, Switch } from "react-router-dom";
import Main from "./pages/main/Main";
import Login from "./pages/login/Login";
import Navbar from "./pages/Navbar";
import CreateItem from "./pages/createItem/CreateItem";
import DialogComponent from "./shared/DialogComponent";
import AlertComponent from "./shared/AlertComponent";
import Header from "./pages/header/Header";
import {makeStyles} from "@material-ui/core/styles";
import Bricks from "./shared/images/bricksBackground.jpg";
import AboutUs from "./pages/aboutUs/AboutUs";
import Feedbacks from "./pages/feedbacks/Feedbacks";


export const AppContext = createContext(null);

const useStyles = makeStyles((theme) => ({
    header:{
        background: `no-repeat url(${Bricks}) center / cover`,
        height: "800px",
        width: "100%",
        // position: "relative"
    },
    navbar:{
        position: "sticky",
        width: "100%",
        top: "0",
        left: "0",
        zIndex: "20"
    }
}))

function App() {
    const cl = useStyles()

    const [values, setValues] = useState({
        openDialog: false,
        dialogComponent: <Login/>,
        dialogTitle: "Реєстрація",
        addPost: false,
        openAlert: false,
        alertType: "error",
        alertMassage: '',
        refreshItemsData: false
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
              <AlertComponent/>
              <div className={cl.navbar} >
                  <Navbar/>
              </div>
              <Header/>
              <DialogComponent title={values.dialogTitle}  dialog={values.openDialog}
                               closeDialog={handleDialog} Component={values.dialogComponent}/>
          <Switch>
              <Route path={"/"} exact component={Main}/>
              <Route path={"/aboutUs"}  component={AboutUs}/>
              <Route path={"/feedbacks"}  component={Feedbacks}/>
              {/*<Route path={"/posts"}  component={CreateItem}/>*/}
          </Switch>
          </AppContext.Provider>
      </BrowserRouter>
  );
}

export default App;
