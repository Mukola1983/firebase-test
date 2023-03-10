import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Paper, TextField, Typography} from "@material-ui/core";
import {auth, provider, db, storage} from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import {addDoc,doc, updateDoc,collection} from "firebase/firestore"
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {v4} from "uuid";
import {AppContext} from "../../App";
import TextInputComponent from "../../shared/inputs/TextInputComponent";
import {makeStyles} from "@material-ui/core/styles";
import ImageItem from "./ImageItem";
import moment from "moment";
import {addImageHandler, imageRefObject, removeImageData, setEditImages} from "../../shared/Utils";


const useStyles = makeStyles((theme) => ({
    input: {
        width: "100%"
    },
    imgBox: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "space-around"
    },
    paperBox:{
        minHeight: "60vh",
        padding: "20px",
        '@media (max-width: 680px)': {
            padding: "5px",
        },
    }
}))

const CreateItem = ({edit=false, post=null, imagesToEdit=[]}) => {

    const cl = useStyles()

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);


    const [value, setValue] = useState({})
    const [check, setCheck] = useState(false);
    const[imgToSend, setImgToSend] = useState([]);
    const[images, setImages] = useState([])
    const[load, setLoad] = useState(false)

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

    useEffect(()=>{
        if(edit && post){
            setValue(post);
            setEditImages(imagesToEdit, post, setImages,setImgToSend)
        }
    },[])


    const removeImg = async (id) =>{
        if(edit){
            const del = imgToSend.find(el =>el.id === id)
            await deleteObject(ref(storage, del.img.metaData));
        }
        await removeImageData(imgToSend, images, setImgToSend,setImages,createPost, id)
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

    const postsRef = collection(db, "items")


    const createPost = async (imgToSendLoc) => {
        let metadata = [];
        for(let i = 0; i < imgToSendLoc.length; i++ ){
            if(imgToSendLoc[i].img &&  !imgToSendLoc[i].img.metaData) {

                const imgData = await imageRefObject('postImages', imgToSendLoc[i])

                metadata.push(imgData)
            }else{
                metadata.push(imgToSendLoc[i].img)
            }
        }

        if(value?.title && value?.description){
            const data = {
                title: value.title,
                price: value.price,
                discount: value.discount ? value?.discount : '',
                images: metadata,
                date:moment(Date.now()).format(),
                description: value.description,
                userId: user?.uid,
                userName: user?.displayName,
                userImg: user?.photoURL
            }
            if(edit){
                const updateRef = doc(db, "items", post.id);
                await updateDoc(updateRef, data)
            }else{
                await addDoc(postsRef, data)
            }
        }

    }

    const createPost_2 = async () =>{
        setLoad(true)
        await createPost(imgToSend)
        setLoad(false)
        setValues(prev =>({
            ...prev,
            openDialog: false,
            refreshItemsData: true
        }))
    }



    return (
        <div style={{padding: "10px"}}>
            <Paper className={cl.paperBox}>
                <div style={{ marginBottom: "10px"}}>
                    <div >
                        <input
                            style={{display: "none"}}
                            type="file"
                            onChange={(e)=> addImageHandler(e, setImgToSend, setImages,setValues)}
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
                        <TextInputComponent style={cl.input} value={value} name={'title'} label={"?????????? ????????????"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} multiline={true} name={'description'} label={"????????"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent type={"number"} style={cl.input} value={value}  name={'price'} label={"????????"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent type={"number"} style={cl.input} value={value}  name={'discount'} label={"????????????"} setVal={handleVal} />
                    </div>
                    <div>
                        <Button disabled={load} variant={"contained"} color={"primary"} onClick={createPost_2}>
                            {edit ?  "????????????????????" : "????????????????"}
                        </Button>
                    </div>
                </div>
            </Paper>
        </div>

    )
}

export default CreateItem;