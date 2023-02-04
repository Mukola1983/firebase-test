import React from "react";
import Paper from "@material-ui/core/Paper";
import {checkAdmin} from "../../../shared/Utils";
import {LightTooltip} from "../../../shared/TooltipComponent";
import {IconButton} from "@material-ui/core";
import BackspaceIcon from "@material-ui/icons/Backspace";
import moment from "moment";
import CommentsAccordeon from "../../feedbacks/components/CommentsAccordeon";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebase";
import OrdersList from "./OrdersList";


const useStyles = makeStyles((theme) => ({
    root:{
        margin: "10px",
        width: "100%"
    },
    box: {

    },
    userDataBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding:"10px 15px",
        fontSize: "20px",
        color: "blue",
        '@media (max-width: 680px)': {
            fontSize: "18px",
        },
        '@media (max-width: 480px)': {
            fontSize: "12px",
        },
    },
    imageBox: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        overflow: "hidden",
        '@media (max-width: 680px)': {
            width: "35px",
            height: "35px",
        },
        '@media (max-width: 480px)': {
            width: "25px",
            height: "25px",
        },
    },
    imageIcon: {
        width: "100%",
        height: "100%",
    },
    item:{
        marginRight: "10px"
    },
    buttonBox:{
        padding: "10px 15px"
    },
    fedbackTitle:{
        padding: "10px 15px",
        textAlign: "center",
        fontSize: "20px",
        display: "flex",
        alignItems: "center",
        '@media (max-width: 680px)': {
            fontSize: "18px",
            padding: "10px ",
        },
        '@media (max-width: 480px)': {
            fontSize: "15px",
            padding: "5px ",
        },

    },

}))




const UserItem = ({item}) =>{

    const [user, loading, error] = useAuthState(auth);

    const cl = useStyles()
    return (
        <Paper elevation={4} className={cl.root}>
            {user && checkAdmin(user?.uid) &&
            <div>
                <LightTooltip title={"Видалити Клієнта!"}>
                    <IconButton >
                        <BackspaceIcon/>
                    </IconButton>
                </LightTooltip>
            </div>
            }
            <div>
                <div className={cl.fedbackTitle}>
                    <p className={cl.item}>Імя : </p>
                    <p>{item.name}</p>
                </div>
                <div className={cl.fedbackTitle}>
                    <p className={cl.item}>Email : </p>
                    <p>{item.email}</p>
                </div>
                {item.phone &&
                    <div className={cl.fedbackTitle}>
                        <p className={cl.item}>Телефон: </p>
                        <p>{item.phone}</p>
                    </div>
                }
                {item.photoURL &&
                    <div className={cl.fedbackTitle}>
                        <p className={cl.item}>Фото:</p>
                        <div>
                            <img src={item.photoURL} alt={"icon"} />
                        </div>
                    </div>
                }

                <div>
                    {item.orders &&
                        <OrdersList orders={item.orders}/>
                    }
                </div>
            </div>
        </Paper>
    )
}

export default UserItem