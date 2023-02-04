import React from "react";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    box: {},
    row:{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
    },
    firstItem:{
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "right",
        color: "green",
        marginRight: "20px",
        '@media (max-width: 680px)': {
            fontSize: "16px",
            marginRight: "15px",
        },
        '@media (max-width: 480px)': {
            fontSize: "12px",
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


const FooterContItem = ({contact}) =>{

    const cl = useStyles()
    return (
        <div>
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

export default FooterContItem;