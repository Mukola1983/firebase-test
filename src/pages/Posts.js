import React, {useState} from "react";
import {Button, Paper, TextField, Typography} from "@material-ui/core";
import {auth, provider, db} from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import {addDoc, collection} from "firebase/firestore"



const Posts = () => {

    const [user, loading, error] = useAuthState(auth);

    const [value, setValue] = useState({})
    const [check, setCheck] = useState(false)

    const handleVal = (name, val) => {
        if(!check){
            setCheck(true)
        }
        setValue(prev => ({
            ...prev,
            [name]: val
        }))
    }

    const postsRef = collection(db, "posts")

    const createPost = async () =>{
        if(value?.title && value?.description){
            const data = {
                title: value.title,
                description: value.description,
                userId: user?.uid,
                userName: user?.displayName,
                userImg: user?.photoURL
            }
            const res = await addDoc(postsRef, data)
        }
    }


    return (
        <div style={{padding: "30px 100px"}}>
            <Paper style={{height: "60vh", padding: "40px"}}>
                <div>
                    <div style={{marginBottom: "10px"}}>
                        <TextField
                            error={!value['title'] && check}
                            label="Title"
                            variant="filled"
                            value={value['title']}
                            onChange={(e) => handleVal('title', e.target.value)}
                        />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextField
                            error={!value['description'] && check}
                            label="Description"
                            variant="filled"
                            value={value['description']}
                            onChange={(e) => handleVal('description', e.target.value)}
                        />
                    </div>
                    <div>
                        <Button variant={"contained"} color={"primary"} onClick={createPost}>submit</Button>
                    </div>
                </div>
            </Paper>
        </div>

    )
}

export default Posts;