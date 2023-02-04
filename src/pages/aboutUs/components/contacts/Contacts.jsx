import React, {useContext, useEffect} from "react"
import {checkAdmin, handleGetDoc} from "../../../../shared/Utils";
import {Button, Paper} from "@material-ui/core";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../../firebase";
import {AppContext} from "../../../../App";
import {makeStyles} from "@material-ui/core/styles";
import CreatePost from "../CreatePost";
import CreateContact from "./CreateContact";
import PostItem from "../PostItem";
import ContactItem from "./ContactItem";


const useStyles = makeStyles((theme) => ({
    root:{
        margin: "10px"
    },
    title:{
        fontSize: "30px",
        fontWeight: "bold",
        color: "green",
        textAlign: "center"
    }

}))

const Contacts = () => {

    const [user, loading, error] = useAuthState(auth);
    const cl = useStyles();
    const {values, setValues} = useContext(AppContext);


    // useEffect(() =>{
    //     if(values.refreshContacts || !values.contacts.length > 0) {
    //         handleGetDoc(setValues,"contacts","contacts" )
    //         setValues(prev =>({
    //             ...prev,
    //             refreshContacts: false
    //         }))
    //     }
    // },[ values.refreshContacts])

    const openDialog = () => {
        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <CreateContact/>,
            dialogTitle: "Додати контакт!"
        }))
    }

    return (
        <div className={cl.root}>
            {user && checkAdmin(user?.uid) &&
                <Button variant={"contained"} color={"primary"} onClick={openDialog}>
                    Додати контакт
                </Button>
            }
            <div style={{border: "1px solid green"}}>
                <div className={cl.title}>
                    Контакти !
                </div>
            </div>
            <div>
                {values.contacts.length > 0  && values.contacts.map(el =>(
                    <div  key={el.id}>
                        <ContactItem contact={el}/>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default Contacts;