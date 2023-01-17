import './App.css';
import React, {createContext, useState} from "react";
import {BrowserRouter, Route, Switch } from "react-router-dom";
import Main from "./pages/main/Main";
import Login from "./pages/login/Login";
import Navbar from "./pages/navBar/Navbar";
import CreateItem from "./pages/createItem/CreateItem";
import DialogComponent from "./shared/DialogComponent";
import AlertComponent from "./shared/AlertComponent";
import Header from "./pages/header/Header";
import {makeStyles} from "@material-ui/core/styles";
import Bricks from "./shared/images/bricksBackground.jpg";
import AboutUs from "./pages/aboutUs/AboutUs";
import Feedbacks from "./pages/feedbacks/Feedbacks";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import CreatePost from "./pages/aboutUs/components/CreatePost";
import CreateOrder from "./pages/order/CreateOrder";
import OrdersBasket from "./pages/order/OrdeersBascet";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import IconButton from "@material-ui/core/IconButton";
import {LightTooltip} from "./shared/TooltipComponent";
import BoxBricks from "./shared/images/boxBricks.png"
import LocalOrders from "./pages/localOrders/LocalOrders";


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
    },
    addOrderButt:{
        position: "sticky",
        display: "inline-block",
        // width: "100%",
        bottom: "20px",
        left: "90%",
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
        refreshItemsData: false,
        refreshOrders:false,
        loading: false,
        items:[],
        posts:[],
        orders: []
    })


    const handleDialog =() =>{
        setValues(prev =>({
            ...prev,
            openDialog: false
        }))
    }

    const openDialog = () =>{
        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <CreateOrder/>,
            dialogTitle: "Створити Замовлення!"
        }))
    }

  return (
      <BrowserRouter>
          <AppContext.Provider value={{values, setValues}}>
              <div style={{position: "relative"}}>
                  <AlertComponent/>
                  <div className={cl.navbar} >
                      <Navbar/>
                  </div>
                  <Header/>
                  <Backdrop style={{zIndex: "100"}} open={values.loading} >
                      <CircularProgress color="primary"  />
                  </Backdrop>
                  <DialogComponent title={values.dialogTitle}  dialog={values.openDialog}
                                   closeDialog={handleDialog} Component={values.dialogComponent}/>
                  <Switch>
                      <Route path={"/"} exact component={Main}/>
                      <Route path={"/aboutUs"}  component={AboutUs}/>
                      <Route path={"/feedbacks"}  component={Feedbacks}/>
                      <Route path={"/orders"}  component={OrdersBasket}/>
                      <Route path={"/localOrders"}  component={LocalOrders}/>
                  </Switch>

                  <div  className={cl.addOrderButt}>
                        <LightTooltip title={"Створити замовлення!"} >
                            <IconButton variant={"contained"} color={"primary"} onClick={openDialog} >
                                <AddShoppingCartIcon style={{fontSize: "50px"}} />
                                {/*<div style={{width: "50px", height: "50px"}}>*/}
                                {/*    <img src={BoxBricks} alt={"icon"}  style={{width: "100%", height: "100%"}}/>*/}
                                {/*</div>*/}
                            </IconButton>
                        </LightTooltip>
                  </div>
              </div>
          </AppContext.Provider>
      </BrowserRouter>
  );
}

export default App;
