import React, {useContext, useEffect, useState} from "react";
import {Backdrop, Button, CircularProgress, Paper, Typography} from "@material-ui/core";
import {auth, db, provider} from "../../firebase";
import {signInWithPopup, getAuth} from "firebase/auth"
import { useAuthState } from 'react-firebase-hooks/auth';
import {AppContext} from "../../App";
import LogWithPassMail from "./LogWithPassMail";
import {makeStyles} from "@material-ui/core/styles";
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";


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


    const setNewUser = async (user) => {
        const userRef = collection(db, "users");
        const userDoc = query(userRef, where("uiD", "==", user.uid))
        const res = await getDocs(userDoc).catch(e => console.log(e));


        return res.docs.map(el => ({...el.data(), id : el.id}))
    }

    const handleSignIn = async () => {
        if(!open) {
            setOpen(true)
            const res = await signInWithPopup(auth, provider);


            if (res.user) {
                const existUser = await setNewUser(res.user)

                console.log(existUser)
                console.log(res.user)

                const data = {
                    uiD: res?.user.uid,
                    name: res?.user.displayName,
                    photoURL: res?.user.photoURL,
                    email: res?.user.email,
                    phone: res?.user.phoneNumber,
                    orders:[]
                }
                localStorage.setItem("activeUser", JSON.stringify(data))

                if(!existUser?.length >0) {

                    const userRef = collection(db, "users")
                    await addDoc(userRef, data)
                        .catch(e => {
                            console.log(e)
                            setValues(prev => ({
                                ...prev,
                                openAlert: true,
                                alertMassage: e.message
                            }))
                        });
                }

                setValues(prev => ({
                    ...prev,
                    openDialog: false,
                    refreshOrders: true
                }))
            }
            setOpen(false)
        }
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
                            <div  className={cl.divButton}>
                                <span  className={cl.span} onClick={handleSignIn}>
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