import React, {useContext, useEffect, useState} from "react";
import Navbar from "../Navbar";
import {useHistory} from "react-router-dom";
import {getDocs, collection} from "firebase/firestore"
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../firebase";
import {Button, IconButton, Paper, Typography} from "@material-ui/core";
import Post from "./Post";
import {AppContext} from "../../App";
import Posts from "../Posts";



const Main = () => {
    const history = useHistory();
    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const [posts, setPosts] = useState([])

    const postsRef = collection(db, "posts")

    useEffect(() =>{
        handleGetDoc()
    },[values.openDialog])

    const handleGetDoc = async () =>{
        const res =await getDocs(postsRef)
        if(res) {
            setPosts(res.docs.map(el => ({...el.data(), id : el.id})))
        }
    }

    const openDialog = () =>{
        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <Posts/>,
            dialogTitle: "Create Post"
        }))
    }

    return (
        <div style={{ padding: "10px"}}>
            {user &&
                <Button variant={"contained"} color={"primary"} onClick={openDialog}>
                    CreatePost
                </Button>
            }
            <Paper style={{width: "90vw", display: "flex", flexWrap: "wrap", padding: "10px"}}>
                {posts.length >0  && posts.map(el =>(
                    <Post key={el.id} post={el}/>
                ))}
            </Paper>
        </div>
    )
}

export default Main;