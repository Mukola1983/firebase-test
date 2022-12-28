import React, {useContext} from "react";
import {Button, Paper, Typography} from "@material-ui/core";
import {auth, provider} from "../../firebase";
import {signInWithPopup} from "firebase/auth"
import { useAuthState } from 'react-firebase-hooks/auth';
import {AppContext} from "../../App";
import LogWithPassMail from "./LogWithPassMail";


const Login = () => {

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);



    const handleSignIn = async () => {
        const res = await signInWithPopup(auth,provider);
        if(res.user){
            setValues(prev =>({
                ...prev,
                openDialog: false
            }))
        }
    }
    return (
        <div style={{padding: "30px 50px"}}>
            <Paper style={{height: "60vh"}}>
                <div style={{padding: "30px 40px"}}>
                    {!user &&
                        <>
                            <Typography variant={"h6"} color={"primary"}>Sign in with google</Typography>
                            <Button onClick={handleSignIn} variant={"contained"} color={"primary"}>Sign In</Button>
                        </>
                    }
                </div>
                <div style={{padding: "30px 40px"}}>
                    <Typography variant={"h6"} color={"primary"}>Sign in with Email and password</Typography>
                    <LogWithPassMail/>
                </div>
            </Paper>
        </div>

    )
}

export default Login;