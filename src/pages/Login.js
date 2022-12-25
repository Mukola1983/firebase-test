import React from "react";
import {Button, Paper, Typography} from "@material-ui/core";
import {auth, provider} from "../firebase";
import {signInWithPopup} from "firebase/auth"
import { useAuthState } from 'react-firebase-hooks/auth';


const Login = () => {

    const [user, loading, error] = useAuthState(auth);



    const handleSignIn = async () => {
        await signInWithPopup(auth,provider);
    }
    return (
        <div style={{padding: "30px 50px"}}>
            <Paper style={{height: "60vh"}}>
                <div style={{padding: "30px 40px"}}>
                    {!user &&
                        <>
                            <Typography variant={"h4"} color={"primary"}>Sign in with google</Typography>
                            <Button onClick={handleSignIn} variant={"contained"} color={"primary"}>Sign In</Button>
                        </>
                    }
                </div>
            </Paper>
        </div>

    )
}

export default Login;