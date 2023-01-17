import React, {useContext, useEffect, useState} from "react";
import {getDocs, collection} from "firebase/firestore"
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../firebase";
import {Button, IconButton, Paper, Typography} from "@material-ui/core";
import Item from "./items/Item";
import {AppContext} from "../../App";
import CreateItem from "../createItem/CreateItem";
import {makeStyles} from "@material-ui/core/styles";
import {checkAdmin, handleGetDoc} from "../../shared/Utils";



const useStyles = makeStyles((theme) => ({
    postWrapper: {
        width: "90vw",
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        padding: "10px",
        '@media (max-width: 680px)': {
            padding: "0",
            width: "100vw",
        },
    },
    flexBox:{
        padding: "10px",
        flex: "0 0 40%",
        '@media (max-width: 680px)': {
            flex: "0 0 80%",
        },
    }
}))
const Main = () => {

    const cl = useStyles()
    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    // const [posts, setPosts] = useState([])

    useEffect(() =>{
        handleGetDoc(setValues,"orders", "orders");
        setValues(prev =>({
            ...prev,
            refreshOrders: false
        }))
    },[values.refreshOrders])



    useEffect(() =>{
        if(values.refreshItemsData ||  !values.items.length > 0){
            // handleGetDoc()
            handleGetDoc(setValues, "items", "items")
            setValues(prev =>({
                ...prev,
                refreshItemsData: false
            }))
        }
    },[values.refreshItemsData])



    const openDialog = () =>{
        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <CreateItem/>,
            dialogTitle: "Створити товар"
        }))
    }

    return (
        <div >
            {user && checkAdmin(user?.uid) &&
                <Button variant={"contained"} color={"primary"} onClick={openDialog}>
                    Додати Товар
                </Button>
            }
            <Paper className={cl.postWrapper} >
                {values.items.length > 0  && values.items.map(el =>(
                    <div  key={el.id} className={cl.flexBox}>
                        <Item post={el}/>
                    </div>
                ))}
            </Paper>
        </div>
    )
}

export default Main;