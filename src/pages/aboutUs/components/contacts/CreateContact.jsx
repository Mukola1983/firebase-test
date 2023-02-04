import React, {useContext, useEffect, useRef, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
//import {AppContext} from "../../../App";
//import {auth, db, storage} from "../../../firebase";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import {addDoc,doc, updateDoc,collection} from "firebase/firestore"
import makeStyles from "@material-ui/core/styles/makeStyles";
import {ref, uploadBytes} from "firebase/storage";
import {v4} from "uuid";
import moment from "moment";
import {auth,db} from "../../../../firebase";
import {AppContext} from "../../../../App";
import TextInputComponent from "../../../../shared/inputs/TextInputComponent";





const useStyles = makeStyles((theme) => ({
    input: {
        width: "100%"
    },
    imgBox: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "space-around"
    }
}))

const CreateContact = ({edit=false, contact=null}) => {

    const cl = useStyles()

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);


    const [value, setValue] = useState({})
    const [check, setCheck] = useState(false);





    const handleVal = (name, val) => {
        if(!check){
            setCheck(true)
        }
        setValue(prev => ({
            ...prev,
            [name]: val
        }))
    }

    const contactRef = collection(db, "contacts")

    useEffect(()=>{
        if(edit && contact){
            setValue(contact);
        }
    },[])


    const createContact = async () => {

        if(true){
            const data = {
                name: value.name,
                surname: value.surname,
                phone: value.phone,
                mail: value.mail,
                date:moment(Date.now()).format(),
                userId: user?.uid,
                userName: user?.displayName,
                userImg: user?.photoURL
            }
            if(edit){
                const updateRef = doc(db, "contacts", contact.id);
                await updateDoc(updateRef, data)
            }else{
                await addDoc(contactRef, data)
                    .catch(e => {
                        console.log(e)
                        setValues(prev =>({
                            ...prev,
                            openAlert: true,
                            alertMassage: e.message
                        }))
                    })
            }
        }

        setValues(prev =>({
            ...prev,
            openDialog: false,
            refreshContacts: true
        }))
    }


    return (
        <div style={{padding: "20px"}}>
            <Paper style={{minHeight: "60vh", padding: "20px"}}>
                <div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} name={'name'} label={"Імя"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} name={'surname'} label={"Прізвище"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value}  name={'phone'} label={"Телефон"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value}  name={'mail'} label={"Е-пошта"} setVal={handleVal} />
                    </div>
                    <div>
                        <Button variant={"contained"} color={"primary"} onClick={createContact}>
                            {edit ? "Редагувати контакт": "Додати контакт"}
                        </Button>
                    </div>
                </div>
            </Paper>
        </div>

    )
}

export default CreateContact;