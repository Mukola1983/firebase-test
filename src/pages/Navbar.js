import React from "react";
import {Link, useHistory} from "react-router-dom";
import {AppBar, Button, IconButton, Typography} from "@material-ui/core";
import {auth}  from "../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {signOut} from "firebase/auth"


const Navbar = () => {

    const history = useHistory();

    const [user, loading, error] = useAuthState(auth);

    const handleSignOut = async () =>{
        await signOut(auth)
    }

    return (
        <AppBar position="static" >
            <div  style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{display: "flex",justifyContent: "space-between", padding: "10px 40px"}}>
                    <div style={{marginRight: "10px"}}>
                        <Button size={"small"} variant={"contained"} color={"secondary"} onClick={()=> history.push("/")} >
                            Home
                        </Button>
                    </div>
                    <div style={{marginRight: "10px"}}>
                        <Button size={"small"} variant={"contained"} color={"secondary"}  onClick={()=> history.push("/login")} >
                            Login
                        </Button>
                    </div>
                    <div style={{marginRight: "10px"}}>
                        <Button size={"small"} variant={"contained"} color={"secondary"}  onClick={()=> history.push("/posts")} >
                            posts
                        </Button>
                    </div>
                    <div>
                        <Button size={"small"} variant={"contained"} color={"secondary"}  onClick={()=> history.push("/images")} >
                            images
                        </Button>
                    </div>
                </div>
                {user &&
                    <div style={{display: "flex", alignItems: "center", padding: "10px 40px"}}>
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
            </div>
        </AppBar>
    )
}

export default Navbar