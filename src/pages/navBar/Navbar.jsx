import React, {useContext, useEffect, useState} from "react";
import {Link, useHistory,useLocation } from "react-router-dom";
import {AppBar, Button, IconButton, Typography} from "@material-ui/core";
import {auth}  from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {signOut} from "firebase/auth"
import {AppContext} from "../../App";
import Login from "../login/Login";
import {makeStyles} from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from "@material-ui/core/Drawer";
import HomeIcon from '@material-ui/icons/Home';
import FeedbackIcon from '@material-ui/icons/Feedback';
import Badge from "@material-ui/core/Badge";
import MailIcon from '@material-ui/icons/Mail';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import PeopleIcon from '@mui/icons-material/People';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LoginIcon from '@mui/icons-material/Login';
import {LightTooltip} from "../../shared/TooltipComponent";
import NavbarButton from "./NavbarButton";
import DesctopButton from "./DesktopButton";
import {checkAdmin} from "../../shared/Utils";
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import GroupsIcon from '@mui/icons-material/Groups';

const useStyles = makeStyles((theme) => ({

    root:{
        backgroundColor: "rgba(180, 180, 180, 0.9)",
        padding: "10px 15px",
        '@media (max-width: 680px)': {
            padding: "5px",
        },
        '@media (max-width: 480px)': {
            padding: "0px",
        }
    },
    desktop:{

        display: "flex",
        justifyContent: "space-between",
        '@media (max-width: 680px)': {
            display: 'none',
        }
    },
    mobile: {
        display: "none",
        justifyContent: "space-between",
        '@media (max-width: 680px)': {
            display: 'flex',
        }
    },
    burger:{
        color: "white"
    },
    burgerItem:{
        border: "1px dotted grey",
        display: "flex",
        padding: "15px 40px",
        backgroundColor: "rgba(192,192,192, 0.5)",
        "&:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(192,192,192, 0.5)"
        }
    },
    buttonBox:{
        display:"flex",
        margin: "10px",
        alignItems: "center",
        cursor: "pointer"
    },
    button:{
        marginLeft: "10px"
    }
}))
const Navbar = () => {

    const cl  = useStyles()
    const history = useHistory();


    const {values, setValues} = useContext(AppContext);


    const [user, loading, error] = useAuthState(auth);


    const[drawer, setDrawer] = useState(false);
    const[nevOrders, setNewOrders] = useState(0);

    const activeUser = localStorage.getItem("activeUser")? JSON.parse(localStorage.getItem("activeUser")):null

    useEffect(() =>{
        if(values.orders.length > 0){

            setNewOrders(values.orders.filter(el => !el.checked).length)
        }else{
            setNewOrders(0)
        }
    },[values.orders])

    const handleDrawer = () =>{
        setDrawer(prev => !prev)
    }


    const handleChoose = (way) =>{
        history.push(way)
        handleDrawer()
    }

    const handleSignOut = async () =>{
        await signOut(auth)
        setValues(prev =>({
            ...prev,
            refreshOrders:true
        }))
        localStorage.setItem("activeUser", "")
    }

    const openDialog = () =>{
        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <Login/>,
            dialogTitle: "Реєстрація"
        }))
    }

    //UsersList
    return (
        <div className={cl.root} >
            <div className={cl.mobile}>
                <Drawer  anchor={"top"} open={drawer} onClose={handleDrawer} >

                    <NavbarButton handleChoose={handleChoose} icon={<HomeIcon/>} title={"Головна"} way={"/"}/>

                    <NavbarButton handleChoose={handleChoose} icon={<PeopleIcon/>} title={"Про нас"} way={"/aboutUs"}/>

                    <NavbarButton handleChoose={handleChoose} icon={<RateReviewIcon/>} title={"Відгуки"} way={"/feedbacks"}/>

                    <NavbarButton handleChoose={handleChoose} icon={<LocalGroceryStoreIcon/>} title={"Мої замовлення"} way={"/localOrders"}/>

                    {user && checkAdmin(user?.uid) &&
                    <NavbarButton nevOrders={nevOrders} handleChoose={handleChoose}
                                  icon={<GroupsIcon/>} title={"Клієнти"} way={"/users"}/>
                    }
                    {user && checkAdmin(user?.uid) &&
                        <NavbarButton nevOrders={nevOrders} handleChoose={handleChoose}
                                  icon={<ProductionQuantityLimitsIcon/>} title={"Замовлення"} way={"/orders"}/>
                    }
                </Drawer>
                <IconButton className={cl.burger} onClick={handleDrawer}>
                    <MenuIcon />
                </IconButton>
                {user &&
                    <div style={{display: "flex", alignItems: "center", padding: "10px"}}>
                        <Typography>
                            {user?.displayName ?user?.displayName : "Невідомо" }
                        </Typography>
                        {user?.photoURL &&
                            <img src={user?.photoURL} style={{
                                width: "30px", borderRadius: "50%",
                                overflow: "hidden",
                                height: "30px"
                            }} alt={'icon'}/>
                        }
                        <IconButton onClick={handleSignOut}>
                            <ExitToAppIcon color={"secondary"}/>
                        </IconButton>
                    </div>
                }
                {!user &&
                    <div style={{padding: "10px", display: "flex", alignItems: "center",}}>
                        <p style={{color: "white"}}>Увійти</p>
                        <IconButton variant={"contained"} size={"small"} color={"secondary"} onClick={openDialog}>
                            <LoginIcon/>
                        </IconButton>
                    </div>
                }
            </div>
            <div  className={cl.desktop}>
                <div style={{display: "flex",justifyContent: "space-between", padding: "10px "}}>

                    <DesctopButton icon={<AddHomeWorkIcon/>} title={"Головна"} way={"/"} />
                    <DesctopButton icon={<PeopleIcon/>} title={"Про нас"} way={"/aboutUs"} />
                    <DesctopButton icon={<RateReviewIcon/>} title={"Відгуки"} way={"/feedbacks"} />

                    <DesctopButton icon={<LocalGroceryStoreIcon/>} title={"Мої замовлення"} way={"/localOrders"} />

                    {user && checkAdmin(user?.uid) &&
                    <DesctopButton icon={<GroupsIcon/>} nevOrders={nevOrders} title={"Клієнти"}
                                   way={"/users"}/>
                    }
                    {user && checkAdmin(user?.uid) &&
                    <DesctopButton icon={<ProductionQuantityLimitsIcon/>} nevOrders={nevOrders} title={"Замовлення"}
                                   way={"/orders"}/>
                    }
                </div>
                {user &&
                    <div style={{display: "flex", alignItems: "center", padding: "10px"}}>
                        <Typography>
                            {/*{user?.displayName ? user?.displayName : "Невідомо" }*/}
                            {user?.displayName || activeUser?.name }
                        </Typography>
                        {user?.photoURL &&
                            <img src={user?.photoURL} style={{
                                width: "30px", borderRadius: "50%",
                                overflow: "hidden",
                                height: "30px"
                            }} alt={'icon'}/>
                        }
                        <LightTooltip title={"Вийти!"}>
                            <IconButton onClick={handleSignOut}>
                                <ExitToAppIcon style={{color: "green"}}/>
                            </IconButton>
                        </LightTooltip>
                    </div>
                }
                {!user &&
                    <div style={{display: "flex", alignItems: "center", padding: "10px"}}>
                        <p style={{color: "white"}}>Увійти</p>
                        <LightTooltip title={"Увійти"}>
                                <IconButton  onClick={openDialog}>
                                    <LoginIcon style={{color: "red"}}/>
                                </IconButton>
                        </LightTooltip>
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar