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


const LogWithPassMail = ({setOpen}) =>{

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const[loadingF, setLoading] = useState(false)


    const[value, setValue] = useState(null)

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
        const useraa = await createUserWithEmailAndPassword(authT, value.email, value.password)

        const mmm = await sendSignInLinkToEmail(authT, useraa.user.email, actionCodeSettings)

    }
    const signeUser = async () =>{
        setLoading(true)
        const useraa = await signInWithEmailAndPassword(authT, value.email, value.password)
            .catch(e => console.log(e))

        setLoading(false)
        setValues(prev =>({
            ...prev,
            openDialog: false
        }))
    }
    return (
        <div>
            <div>
                <TextInputComponent type={"email"} value={value} setVal={handleValue} name={'email'} label={"Email"} />
            </div>
            <div>
                <TextInputComponent type={"password"} value={value} setVal={handleValue} name={'password'} label={"Password"} />
            </div>
            <div>
                <Button variant={"contained"} onClick={signeUser} disabled={loadingF}>LogIn</Button>
            </div>
        </div>
    )
}

export default LogWithPassMail;