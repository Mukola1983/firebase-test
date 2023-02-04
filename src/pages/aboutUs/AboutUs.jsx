import React, {useContext, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Paper, Typography} from "@material-ui/core";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../firebase";
import CreateItem from "../createItem/CreateItem";
import {AppContext} from "../../App";
import CreatePost from "./components/CreatePost";
import {collection, getDocs} from "firebase/firestore";
import Item from "../main/items/Item";
import PostItem from "./components/PostItem";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {checkAdmin, handleGetDoc} from "../../shared/Utils";
import Contacts from "./components/contacts/Contacts";


const useStyles = makeStyles((theme) => ({
    root:{
        // width: "100vw",
        minHeight: "100vh",
        padding: "20px"
    },
    paper: {
        // width: "100%",
        // height:"100%",
    }

}))

const AboutUs = () =>{

    const [user, loading, error] = useAuthState(auth);
    const cl = useStyles();
    const {values, setValues} = useContext(AppContext);


    useEffect(() =>{
        if(values.refreshItemsData || !values.posts.length > 0) {
            handleGetDoc(setValues,"posts","posts" )
            setValues(prev =>({
                ...prev,
                refreshItemsData: false
            }))
        }
    },[ values.refreshItemsData])



    const openDialog = () => {
        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <CreatePost/>,
            dialogTitle: "Створити статтю"
        }))
    }
    return (
        <div className={cl.root}>
            <Contacts/>
            {user && checkAdmin(user?.uid) &&
                <Button variant={"contained"} color={"primary"} onClick={openDialog}>
                    Додати Статтю
                </Button>
            }
            <Paper elevation={3} className={cl.paper}>
                {values.posts.length > 0  && values.posts.map(el =>(
                    <div  key={el.id} className={cl.flexBox}>
                        <PostItem post={el}/>
                    </div>
                ))}
            </Paper>
        </div>
    )
}

export default AboutUs