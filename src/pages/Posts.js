import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Paper, TextField, Typography} from "@material-ui/core";
import {auth, provider, db, storage} from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import {addDoc, collection} from "firebase/firestore"
import {ref, uploadBytes} from "firebase/storage";
import {v4} from "uuid";
import {AppContext} from "../App";



const Posts = () => {

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);


    const [value, setValue] = useState({})
    const [check, setCheck] = useState(false);
    const[imgToSend, setImgToSend] = useState([]);
    const[images, setImages] = useState([])

    const reFF = useRef(null);

    const openFile = () =>{
        if(images.length < 5) {
            reFF?.current?.click()
        }else{
            setValues(prev =>({
                ...prev,
                openAlert: true,
                alertMassage: "Max count images 5!"
            }))
        }
    }

    const  addImageHandler = (e) => {
        const img = e.target.files[0]
        let url = URL.createObjectURL(img);
        setImgToSend(prev => ([...prev, img]))

        setImages(prev => ([...prev, url]))
    }


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

    const createPost = async () => {
        let metadata = [];
        for(let i = 0; i < imgToSend.length; i++ ){
            const imageRef = ref(storage,`images/${imgToSend[i].name + v4()}`);
            const imgRes = await uploadBytes(imageRef, imgToSend[i])

            metadata.push(imgRes.metadata.fullPath)
        }

        if(value?.title && value?.description){
            const data = {
                title: value.title,
                images: metadata,
                description: value.description,
                userId: user?.uid,
                userName: user?.displayName,
                userImg: user?.photoURL
            }
            await addDoc(postsRef, data)
        }

        setValues(prev =>({
            ...prev,
            openDialog: false,
            addPost: !prev.addPost
        }))
    }


    return (
        <div style={{padding: "20px"}}>
            <Paper style={{height: "60vh", padding: "20px"}}>
                <div style={{ marginBottom: "10px"}}>
                    <div >
                        <input
                            style={{display: "none"}}
                            type="file"
                            onChange={(e)=> addImageHandler(e)}
                            ref={reFF}
                        />
                        <Button onClick={()=> openFile()}
                                variant={"contained"}
                                color={"primary"} size={"small"}
                                style={{marginBottom: "10px"}}
                        >
                            Add Image
                        </Button>
                    </div>
                    <div style={{display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "space-around"}}>
                        { images.map(el =>(
                            <div style={{width: "70px", margin:"4px", height: "70px", border: "1px dotted grey"}}>
                                <img src={el} alt={'icon'} style={{width: "100%" , height: "100%"}} />
                            </div>
                        ))
                        }
                    </div>
                </div>

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