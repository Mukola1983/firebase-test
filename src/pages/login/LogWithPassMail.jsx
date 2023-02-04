import React, {useContext, useState} from "react"
import TextInputComponent from "../../shared/inputs/TextInputComponent";
import {
    getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, sendSignInLinkToEmail
} from "firebase/auth";
import {auth, db, provider} from "../../firebase";
import {Button} from "@material-ui/core";
import {useAuthState} from "react-firebase-hooks/auth";
import {AppContext} from "../../App";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";


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



    const createUser = async () => {
        setLoading(true);

        if(value.email && value.password && value.name) {
            const user = await createUserWithEmailAndPassword(authT, value.email, value.password)
                .catch(error => {
                    console.log(error)
                    setValues(prev => ({
                        ...prev,
                        openAlert: true,
                        alertMassage: error.message
                    }))
                })

            if (user) {
                const data = {
                    uiD: user?.user.uid,
                    name: value?.name,
                    photoURL: user?.user.photoURL,
                    email: user?.user.email,
                    phone: value?.phone,
                    orders:[]
                }

                localStorage.setItem("activeUser", JSON.stringify(data));

                const userRef = collection(db, "users");
                await addDoc(userRef, data)
                    .catch(e => {
                        console.log(e)
                        setValues(prev => ({
                            ...prev,
                            openAlert: true,
                            alertMassage: e.message
                        }))
                    });

                setValues(prev => ({
                    ...prev,
                    openDialog: false,
                    refreshOrders: true
                }))
            }
        }else{
            setValues(prev =>({
                ...prev,
                openAlert: true,
                alertMassage: "Введіть імя логін і е-пошту!"
            }))
        }

        setLoading(false)
    }
    const signUser = async () =>{
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
            const userRef = collection(db, "users");
            const userDoc = query(userRef, where("uiD", "==", user.user.uid))
            const res = await getDocs(userDoc).catch(e => console.log(e));

            const existUser = res.docs.map(el => ({...el.data(), id : el.id}))

            if(existUser?.length > 0){
                localStorage.setItem("activeUser", JSON.stringify(existUser[0]));
            }
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
            {!login &&
                <div className={cl.input}>
                    <TextInputComponent value={value} setVal={handleValue} name={'name'} label={"Прізвище, імя*"}/>
                </div>
            }
            {!login &&
                <div className={cl.input}>
                    <TextInputComponent type={"phone"} value={value} setVal={handleValue} name={'phone'} label={"Телефон"} />
                </div>
            }
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
                    <Button variant={"contained"} onClick={signUser} disabled={loadingF}>Увійти</Button>
                }
            </div>
        </Paper>
    )
}

export default LogWithPassMail;