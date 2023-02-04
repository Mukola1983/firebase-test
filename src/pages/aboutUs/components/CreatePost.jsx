import React, {useContext, useEffect, useRef, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {AppContext} from "../../../App";
import {auth, db, storage} from "../../../firebase";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ImageItem from "../../createItem/ImageItem";
import TextInputComponent from "../../../shared/inputs/TextInputComponent";
import {addDoc,doc, updateDoc,collection} from "firebase/firestore"
import makeStyles from "@material-ui/core/styles/makeStyles";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {v4} from "uuid";
import moment from "moment";
import {addImageHandler, imageRefObject, removeImageData, setEditImages} from "../../../shared/Utils";





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

const CreatePost = ({edit=false, post=null, imagesToEdit=[]}) => {

    const cl = useStyles()

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);
    const[load, setLoad] = useState(false)



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

    useEffect(()=>{
        if(edit && post){
            setValue(post);
            setEditImages(imagesToEdit, post,setImages,setImgToSend)
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

    const postsRef = collection(db, "posts")


    const createPost = async (imgToSendLoc) => {
        let metadata = [];
        for(let i = 0; i < imgToSendLoc.length; i++ ){
            if(imgToSendLoc[i].img && !imgToSendLoc[i].img.metaData) {

                const imgData = await imageRefObject('postImages', imgToSendLoc[i])
                metadata.push(imgData)
            }else{
                metadata.push(imgToSendLoc[i].img)
            }
        }

        if(value?.title && value?.description){
            const data = {
                title: value.title,
                images: metadata,
                link: value.link ? value.link : '',
                linkName: value.linkName ? value.linkName: "",
                date:moment(Date.now()).format(),
                description: value.description,
                userId: user?.uid,
                userName: user?.displayName,
                userImg: user?.photoURL
            }
            if(edit){
                const updateRef = doc(db, "posts", post.id);
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
        <div style={{padding: "20px"}}>
            <Paper style={{minHeight: "60vh", padding: "20px"}}>
                <div style={{ marginBottom: "10px"}}>
                    <div >
                        <input
                            style={{display: "none"}}
                            type="file"
                            onChange={(e)=> addImageHandler(e,setImgToSend,setImages,setValues)}
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
                        <TextInputComponent style={cl.input} value={value} name={'title'} label={"Назва статті"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} multiline={true} name={'description'} label={"Опис"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} multiline={true} name={'link'} label={"Лінк"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} multiline={true} name={'linkName'} label={"Назва лінку"} setVal={handleVal} />
                    </div>
                    <div>
                        <Button variant={"contained"} color={"primary"} onClick={createPost_2}>
                            {edit ?  "Редагувати" : "Створити"}
                        </Button>
                    </div>
                </div>
            </Paper>
        </div>

    )
}

export default CreatePost;