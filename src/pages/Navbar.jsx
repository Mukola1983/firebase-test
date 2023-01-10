import React, {useContext, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {AppBar, Button, IconButton, Typography} from "@material-ui/core";
import {auth}  from "../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {signOut} from "firebase/auth"
import {AppContext} from "../App";
import Login from "./login/Login";
import {makeStyles} from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from "@material-ui/core/Drawer";
import HomeIcon from '@material-ui/icons/Home';
import FeedbackIcon from '@material-ui/icons/Feedback';
import PeopleIcon from '@material-ui/icons/People';




const useStyles = makeStyles((theme) => ({

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
        border: "1px solid red",
        display: "flex",
        padding: "15px 40px",
        backgroundColor: "rgba(192,192,192, 0.5)",
        "&:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(192,192,192, 0.5)"
        }
    }
}))
const Navbar = () => {

    const cl  = useStyles()
    const history = useHistory();

    const {values, setValues} = useContext(AppContext);


    const [user, loading, error] = useAuthState(auth);

    const[drawer, setDrawer] = useState(false);

    const handleDrawer = () =>{
        setDrawer(prev => !prev)
    }

    const handleChoose = (way) =>{
        history.push(way)
        handleDrawer()
    }

    const handleSignOut = async () =>{
        await signOut(auth)
    }

    const openDialog = () =>{
        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <Login/>,
            dialogTitle: "LogIn"
        }))
    }
    return (
        <AppBar position="static" >
            <div className={cl.mobile}>
                <Drawer  anchor={"top"} open={drawer} onClose={handleDrawer} >
                    <div className={cl.burgerItem} onClick={()=>handleChoose("/")} >
                        <HomeIcon />
                        <Typography>
                            Головна
                        </Typography>
                    </div>
                    <div className={cl.burgerItem} onClick={()=> handleChoose("/aboutUs")} >
                        <PeopleIcon />
                        <Typography>
                            Про нас
                        </Typography>
                    </div>
                    <div className={cl.burgerItem} onClick={()=> handleChoose("/feedbacks")} >
                        <FeedbackIcon />
                        <Typography>
                            Відгуки
                        </Typography>
                    </div>
                </Drawer>
                <IconButton className={cl.burger} onClick={handleDrawer}>
                    <MenuIcon />
                </IconButton>
                {user &&
                    <div style={{display: "flex", alignItems: "center", padding: "10px"}}>
                        <Typography>{user?.displayName}</Typography>
                        <img src={user?.photoURL} style={{
                            width: "30px", borderRadius: "50%",
                            overflow: "hidden",
                            height: "30px"
                        }} alt={'icon'}/>
                        <IconButton onClick={handleSignOut}>
                            <ExitToAppIcon color={"secondary"}/>
                        </IconButton>
                    </div>
                }
                {!user &&
                    <div style={{padding: "10px 40px"}}>
                        <Button variant={"contained"} size={"small"} color={"secondary"} onClick={openDialog}>
                            LogIn
                        </Button>
                    </div>
                }
            </div>
            <div  className={cl.desktop}>
                <div style={{display: "flex",justifyContent: "space-between", padding: "10px "}}>
                    <div style={{marginRight: "10px"}}>
                        <Button size={"small"} variant={"contained"} color={"secondary"} onClick={()=> history.push("/")} >
                            Головна
                        </Button>
                    </div>
                    <div style={{marginRight: "10px"}}>
                        <Button size={"small"} variant={"contained"} color={"secondary"}  onClick={()=> history.push("/aboutUs")} >
                            Про нас
                        </Button>
                    </div>
                    <div>
                        <Button size={"small"} variant={"contained"} color={"secondary"}  onClick={()=> history.push("/feedbacks")} >
                            Відгуки
                        </Button>
                    </div>
                </div>
                {user &&
                    <div style={{display: "flex", alignItems: "center", padding: "10px"}}>
                        <Typography>{user?.displayName}</Typography>
                        <img src={user?.photoURL} style={{
                            width: "30px", borderRadius: "50%",
                            overflow: "hidden",
                            height: "30px"
                        }} alt={'icon'}/>
                        <IconButton onClick={handleSignOut}>
                            <ExitToAppIcon color={"secondary"}/>
                        </IconButton>
                    </div>
                }
                {!user &&
                    <div style={{padding: "10px 40px"}}>
                        <Button variant={"contained"} size={"small"} color={"secondary"} onClick={openDialog}>
                            LogIn
                        </Button>
                    </div>
                }
            </div>
        </AppBar>
    )
}

export default Navbar