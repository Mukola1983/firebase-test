import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Paper, TextField, Typography} from "@material-ui/core";
import {auth, provider, db, storage} from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import {addDoc, collection} from "firebase/firestore"
import {ref, uploadBytes} from "firebase/storage";
import {v4} from "uuid";
import {AppContext} from "../../App";
import TextInputComponent from "../../shared/inputs/TextInputComponent";
import {makeStyles} from "@material-ui/core/styles";
import ImageItem from "./ImageItem";
import moment from "moment";


const useStyles = makeStyles((theme) => ({
    input: {
        width: "100%"
    },
    imgBox: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "space-around"
    }
}))

const CreateItem = () => {

    const cl = useStyles()

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

    const removeImg = (id) =>{

        const imgSend = imgToSend.filter(el => el.id !== id)
        const imgToShow = images.filter(el => el.id !== id)
        setImgToSend(imgSend);
        setImages(imgToShow);
    }

    const  addImageHandler = (e) => {
        const img = e.target.files[0];
        if(img.size < 1000000) {
            const id = v4()
            let url = URL.createObjectURL(img);
            // setImgToSend(prev => ([...prev, img]));
            setImgToSend(prev => ([...prev, {img: img, id:id}]));

            setImages(prev => ([...prev, {img:url, id:id}]));
        }else{
            setValues(prev =>({
                ...prev,
                openAlert: true,
                alertMassage: "Image should be less 1mb!"
            }))
        }
    }

    // useEffect(() =>{
    //     console.log(imgToSend)
    //     console.log(images)
    // },[images])

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

    console.log(moment(Date.now()).format())

    const createPost = async () => {
        let metadata = [];
        for(let i = 0; i < imgToSend.length; i++ ){
            const imageRef = ref(storage,`images/${imgToSend[i].img.name + v4()}`);
            const imgRes = await uploadBytes(imageRef, imgToSend[i].img)

            metadata.push(imgRes.metadata.fullPath)
        }

        if(value?.title && value?.description){
            const data = {
                title: value.title,
                price: value.price,
                images: metadata,
                date:moment(Date.now()).format(),
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
                    <div className={cl.imgBox}>
                        { images.map(el =>(
                            <ImageItem delHandle={removeImg} image={el}/>
                        ))
                        }
                    </div>
                </div>

                <div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} name={'title'} label={"Title"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} multiline={true} name={'description'} label={"Description"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent type={"number"} style={cl.input} value={value}  name={'price'} label={"Price"} setVal={handleVal} />
                    </div>
                    <div>
                        <Button variant={"contained"} color={"primary"} onClick={createPost}>submit</Button>
                    </div>
                </div>
            </Paper>
        </div>

    )
}

export default CreateItem;