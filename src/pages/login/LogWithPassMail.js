import React, {useState} from "react"
import TextInputComponent from "../../shared/inputs/TextInputComponent";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import {auth, provider} from "../../firebase";
import {Button} from "@material-ui/core";
import {useAuthState} from "react-firebase-hooks/auth";


const LogWithPassMail = () =>{

    const [user, loading, error] = useAuthState(auth);


    const[value, setValue] = useState(null)

    const handleValue = (name, val) =>{
        setValue(prev =>({
            ...prev,
            [name]:val
        }))
    }

    const createUser = async () =>{
        const useraa = await createUserWithEmailAndPassword(auth, value.email, value.password)

        console.log(useraa)
        console.log(user)
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
                <Button onClick={createUser}>LogIn</Button>
            </div>
        </div>
    )
}

export default LogWithPassMail;