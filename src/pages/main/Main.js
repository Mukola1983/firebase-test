import React, {useEffect, useState} from "react";
import Navbar from "../Navbar";
import {useHistory} from "react-router-dom";
import {getDocs, collection} from "firebase/firestore"
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../firebase";
import {Button, IconButton, Typography} from "@material-ui/core";
import Post from "./Post";



const Main = () => {
    const history = useHistory();
    const [user, loading, error] = useAuthState(auth);

    const [posts, setPosts] = useState([])

    const postsRef = collection(db, "posts")

    useEffect(() =>{
        handleGetDoc()
    },[])

    const handleGetDoc = async () =>{
        const res =await getDocs(postsRef)
        if(res) {
            setPosts(res.docs.map(el => ({...el.data(), id : el.id})))
        }
    }

    return (
        <div>
            {posts.length && user && posts.map(el =>(
                <Post key={el.id} post={el}/>
            ))}
        </div>
    )
}

export default Main;