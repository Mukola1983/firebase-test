import React, {useContext, useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Contacts from "./components/Contacts";
import {handleGetDoc} from "../../shared/Utils";
import {AppContext} from "../../App";


export const useStyles = makeStyles((theme) => ({

    root: {
        backgroundColor: "rgba(180, 180, 180, 0.9)",
        padding: "20px 55px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        '@media (max-width: 680px)': {
            padding: "15px",

        },
        '@media (max-width: 480px)': {
            padding: "10px",
        }
    },
    itLink:{
        display: "flex",
        alignItems: "center"
    }
}))

const IT_link = "https://www.linkedin.com/in/mukola-kovalushun-970503214/";

const Footer = () =>{
    const cl = useStyles();
    const {values, setValues} = useContext(AppContext);


    useEffect(() =>{
        if(values.refreshContacts || !values.contacts.length > 0) {
            handleGetDoc(setValues,"contacts","contacts" )
            setValues(prev =>({
                ...prev,
                refreshContacts: false
            }))
        }
    },[ values.refreshContacts]);

    return (
        <div className={cl.root} >
            <Contacts/>
            <div className={cl.itLink}>
                <p>IT підтримка :</p>
                <a target={"blank"} href={IT_link} className={cl.link}>
                    Mukola Kovalushun
                </a>
            </div>
        </div>
    )
}

export default Footer;