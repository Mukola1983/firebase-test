import React, {useContext, useState} from "react";
import {Backdrop, Button, CircularProgress, Paper, Typography} from "@material-ui/core";
import {auth, provider} from "../../firebase";
import {signInWithPopup} from "firebase/auth"
import { useAuthState } from 'react-firebase-hooks/auth';
import {AppContext} from "../../App";
import LogWithPassMail from "./LogWithPassMail";


const Login = () => {

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const[open, setOpen] = useState(false)





    const handleSignIn = async () => {
        setOpen(true)
        const res = await signInWithPopup(auth,provider);
        if(res.user){
            setValues(prev =>({
                ...prev,
                openDialog: false
            }))
        }
        setOpen(false)
    }
    return (
        <div style={{padding: "30px 50px"}}>
            <Paper style={{height: "60vh"}}>
                <Backdrop  open={open} >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div style={{padding: "30px 40px"}}>
                    {!user &&
                        <>
                            <Typography variant={"h6"} color={"primary"}>Sign in with google</Typography>
                            <Button disabled={open} onClick={handleSignIn} variant={"contained"} color={"primary"}>Google реєстрація</Button>
                        </>
                    }
                </div>
                <div style={{padding: "30px 40px"}}>
                    <Typography variant={"h6"} color={"primary"}>Sign in with Email and password</Typography>
                    <LogWithPassMail setOpen={setOpen}/>
                </div>
            </Paper>
        </div>

    )
}

export default Login;