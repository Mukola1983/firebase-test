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

    const [posts, setPosts] = useState([])

    const postsRef = collection(db, "posts")

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
            dialogComponent: <CreatePost/>,
            dialogTitle: "Створити статтю"
        }))
    }
    return (
        <div className={cl.root}>
            {user &&
                <Button variant={"contained"} color={"primary"} onClick={openDialog}>
                    Додати Статтю
                </Button>
            }
            <Paper elevation={3} className={cl.paper}>
                {posts.length > 0  && posts.map(el =>(
                    <div  key={el.id} className={cl.flexBox}>
                        <PostItem post={el}/>
                    </div>
                ))}
            </Paper>
        </div>
    )
}

export default AboutUs