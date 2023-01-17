import React, {useContext, useState} from "react"
import TextInputComponent from "../../shared/inputs/TextInputComponent";
import {
    getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, sendSignInLinkToEmail
} from "firebase/auth";
import {auth, provider} from "../../firebase";
import {Button} from "@material-ui/core";
import {useAuthState} from "react-firebase-hooks/auth";
import {AppContext} from "../../App";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";


const useStyles = makeStyles((theme) => ({

    root: {
        // backgroundColor: "rgba(180, 180, 180, 0.8)",
        padding: "15px 25px",
        // '@media (max-width: 680px)': {
        //     padding: "5px",
        // },
        // '@media (max-width: 480px)': {
        //     padding: "0px",
        // }
    },
    input:{
        margin: "10px 0"

    }
}))

const LogWithPassMail = ({login = false}) =>{

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const[loadingF, setLoading] = useState(false)


    const[value, setValue] = useState(null)

    const cl = useStyles()

    const handleValue = (name, val) =>{
        setValue(prev =>({
            ...prev,
            [name]:val
        }))
    }

    const authT = getAuth()

    const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: 'https://test-01-dd84c.web.app',
        // This must be true.
        handleCodeInApp: true,
        // iOS: {
        //     bundleId: 'com.example.ios'
        // },
        // android: {
        //     packageName: 'com.example.android',
        //     installApp: true,
        //     minimumVersion: '12'
        // },
        // dynamicLinkDomain: 'https://test-01-dd84c.web.app'
    };

    const createUser = async () =>{
        setLoading(true)
        const user = await createUserWithEmailAndPassword(authT, value.email, value.password)
            .catch(error => {
                console.log(error)
                setValues(prev =>({
                    ...prev,
                    openAlert: true,
                    alertMassage: error.message
                }))
            })
        if(user){
            setValues(prev =>({
                ...prev,
                openDialog: false,
                refreshOrders:true
            }))
        }

        setLoading(false)
    }
    const signeUser = async () =>{
        setLoading(true)
        const user = await signInWithEmailAndPassword(authT, value.email, value.password)
            .catch(e => {
                console.log(e)
                setValues(prev =>({
                    ...prev,
                    openAlert: true,
                    alertMassage: e.message
                }))
            })
        if(user){
            setValues(prev =>({
                ...prev,
                openDialog: false,
                refreshOrders:true
            }))
        }
        setLoading(false)
    }
    return (
        <Paper className={cl.root}>
            <div className={cl.input}>
                <TextInputComponent type={"email"} value={value} setVal={handleValue} name={'email'} label={"Email*"} />
            </div>
            <div>
                <TextInputComponent type={"password"} value={value} setVal={handleValue} name={'password'} label={"Пароль*"} />
            </div>
            <div>
                {!login &&
                    <Button variant={"contained"} onClick={createUser} disabled={loadingF}>Зареєструватись</Button>
                }
                {login &&
                    <Button variant={"contained"} onClick={signeUser} disabled={loadingF}>Увійти</Button>
                }
            </div>
        </Paper>
    )
}

export default LogWithPassMail;