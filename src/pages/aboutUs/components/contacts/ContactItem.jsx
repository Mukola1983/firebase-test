import React, {useContext} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {checkAdmin} from "../../../../shared/Utils";
import {LightTooltip} from "../../../../shared/TooltipComponent";
import {IconButton} from "@material-ui/core";
import BackspaceIcon from "@material-ui/icons/Backspace";
import EditIcon from "@material-ui/icons/Edit";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../../firebase";
import {deleteDoc, doc} from "firebase/firestore";
import {AppContext} from "../../../../App";
import CreateItem from "../../../createItem/CreateItem";
import CreateContact from "./CreateContact";



const useStyles = makeStyles((theme) => ({
    box:{
        padding: "10px 20px",
        textAlign: "center",
        '@media (max-width: 680px)': {
            padding: "10px 10px",
        },
        '@media (max-width: 480px)': {
            padding: "5px",
        },
    },
    row:{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
    },
    firstItem:{
        fontSize: "20px",
        fontWeight: "bold",
        textAlign: "right",
        color: "green",
        marginRight: "20px",
        '@media (max-width: 680px)': {
            fontSize: "18px",
            marginRight: "15px",
        },
        '@media (max-width: 480px)': {
            fontSize: "15px",
            marginRight: "5px",
        },
    },
    secondItem:{
        fontSize: "18px",
        textAlign: "left",
        '@media (max-width: 680px)': {
            fontSize: "16px",
        },
        '@media (max-width: 480px)': {
            fontSize: "14px",
        },
    }

}))

const ContactItem = ({contact}) =>{
    const cl = useStyles();
    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);



    const deleteDocument = async (contact) =>{
        setValues(prev =>({
            ...prev,
            loading:true
        }))
        await deleteDoc(doc(db, "contacts", contact.id))
            .catch(e => {
                console.log(e)
                setValues(prev =>({
                    ...prev,
                    openAlert: true,
                    alertMassage: e.message
                }))
            });

        setValues(prev => ({
            ...prev,
            refreshContacts: true,
            openAlert: true,
            alertMassage: "Контакт видалений!",
            loading:false
        }))
    }

    const editItem = (contact) =>{

        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <CreateContact edit={true} contact={contact} />,
            dialogTitle: "Редагувати контакт"
        }))
    }


    return (
        <div className={cl.box}>
            {user && checkAdmin(user?.uid) &&
                <div>
                    <LightTooltip title={"Видалити Товар!"}>
                        <IconButton onClick={() => deleteDocument(contact)}>
                            <BackspaceIcon/>
                        </IconButton>
                    </LightTooltip>
                    <LightTooltip title={"Редагувати Товар"}>
                        <IconButton onClick={() => editItem(contact)}>
                            <EditIcon/>
                        </IconButton>
                    </LightTooltip>
                </div>
            }
            {(contact.name || contact.surname) &&
                <div className={cl.row}>
                    <div className={cl.firstItem}>{contact.name} {contact.surname}</div>
                    <div className={cl.secondItem}>тел: +{contact.phone}</div>
                </div>
            }
            {contact.mail &&
                <div className={cl.row}>
                    <div className={cl.firstItem}>Email</div>
                    <div className={cl.secondItem}>{contact.mail}</div>
                </div>
            }
        </div>
    )
}

export default ContactItem;