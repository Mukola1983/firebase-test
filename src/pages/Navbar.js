import React, {useContext} from "react";
import {Link, useHistory} from "react-router-dom";
import {AppBar, Button, IconButton, Typography} from "@material-ui/core";
import {auth}  from "../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {signOut} from "firebase/auth"
import {AppContext} from "../App";
import Login from "./login/Login";


const Navbar = () => {

    const history = useHistory();

    const {values, setValues} = useContext(AppContext);


    const [user, loading, error] = useAuthState(auth);

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
            <div  style={{display: "flex", justifyContent: "space-between"}}>
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