import React, {useContext, useState} from "react";
import {Backdrop, Button, CircularProgress, Paper, Typography} from "@material-ui/core";
import {auth, provider} from "../../firebase";
import {signInWithPopup} from "firebase/auth"
import { useAuthState } from 'react-firebase-hooks/auth';
import {AppContext} from "../../App";
import LogWithPassMail from "./LogWithPassMail";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({

    root: {
        // backgroundColor: "rgba(180, 180, 180, 0.8)",
        padding: "30px 50px",
        '@media (max-width: 680px)': {
            padding: "5px",
        },
        '@media (max-width: 480px)': {
            padding: "0px",
        }
    },
    divButton:{
        // display: "flex"
        margin: "10px"
    },
    buttBox:{
        display: "flex",
        flexDirection: "column"
    },
    span:{
        border: "1px solid grey",
        cursor: "pointer",
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "10px",
        transition: "0.3s",
        "&:hover": {
            color: "red",
            backgroundColor: "rgba(180, 180, 180, 0.8)",
        }

    }
}))

const Login = () => {

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const[open, setOpen] = useState(false)


    const cl = useStyles()


    const handleSignIn = async () => {
        setOpen(true)
        const res = await signInWithPopup(auth,provider);
        if(res.user){
            setValues(prev =>({
                ...prev,
                openDialog: false,
                refreshOrders:true
            }))
        }
        setOpen(false)
    }

    const logInHandle = () =>{
        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <LogWithPassMail login={true}/>,
            dialogTitle: "Увійти"
        }))
    }

    const signInHandle = () =>{
        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <LogWithPassMail/>,
            dialogTitle: "Реєстрація"
        }))
    }
    return (
        <div className={cl.root}>
            <Paper>
                <Backdrop  open={open} >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div style={{padding: "30px 40px"}}>
                    {!user &&
                        <div>
                            <Typography variant={"h6"} color={"primary"}>
                                Зареєструватись в один клік з Google
                            </Typography>
                            <div disabled={open} className={cl.divButton}>
                                <span className={cl.span} onClick={handleSignIn}>
                                    Google
                                </span>
                            </div>
                        </div>
                    }
                </div>
                <div className={cl.buttBox}>
                    <div style={{padding: "30px 40px"}}>
                        <Typography variant={"h6"} color={"primary"}>
                            Зареєструватись з поштою і паролем
                        </Typography>
                        <div className={cl.divButton}>
                           <span className={cl.span} onClick={signInHandle}>
                                Створити новий акаунт
                           </span>
                        </div>
                        <div className={cl.divButton}>
                             <span className={cl.span} onClick={logInHandle}>
                                Увійти!
                             </span>
                        </div>
                    </div>
                </div>
            </Paper>
        </div>

    )
}

export default Login;