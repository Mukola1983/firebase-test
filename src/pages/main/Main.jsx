import React, {useContext, useEffect, useState} from "react";
import Navbar from "../Navbar";
import {useHistory} from "react-router-dom";
import {getDocs, collection} from "firebase/firestore"
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../firebase";
import {Button, IconButton, Paper, Typography} from "@material-ui/core";
import Item from "./items/Item";
import {AppContext} from "../../App";
import CreateItem from "../createItem/CreateItem";
import {makeStyles} from "@material-ui/core/styles";



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
    const history = useHistory();

    const cl = useStyles()
    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const [posts, setPosts] = useState([])

    const postsRef = collection(db, "items")

    useEffect(() =>{
        handleGetDoc()
    },[values.addPost, values.refreshItemsData])

    const handleGetDoc = async () =>{
        const res = await getDocs(postsRef)
        if(res) {
            setPosts(res.docs.map(el => ({...el.data(), id : el.id})))
        }
    }

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
            {user &&
                <Button variant={"contained"} color={"primary"} onClick={openDialog}>
                    CreatePost
                </Button>
            }
            <Paper className={cl.postWrapper} >
                {posts.length > 0  && posts.map(el =>(
                    <div  key={el.id} className={cl.flexBox}>
                        <Item post={el}/>
                    </div>
                ))}
            </Paper>
        </div>
    )
}

export default Main;