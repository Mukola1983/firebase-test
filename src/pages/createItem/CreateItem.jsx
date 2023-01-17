import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Paper, TextField, Typography} from "@material-ui/core";
import {auth, provider, db, storage} from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import {addDoc,doc, updateDoc,collection} from "firebase/firestore"
import {deleteObject, ref, uploadBytes} from "firebase/storage";
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
            setEditImages(imagesToEdit)
        }
    },[])

    const setEditImages = async (imgs) =>{
        for(let i = 0; i < imgs.length; i++) {
            const id = v4()
            await setImages(prev => ([...prev, {img: imgs[i], id: id}]));
            await setImgToSend(prev => ([...prev, {img: post?.images[i], id:id}]));

        }
    }

    const removeImg = async (id) =>{
        if(edit){
            const del = imgToSend.find(el =>el.id === id)
            await deleteObject(ref(storage, del.img));
        }
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

    const postsRef = collection(db, "items")


    const createPost = async () => {
        setLoad(true)
        let metadata = [];
        for(let i = 0; i < imgToSend.length; i++ ){
            if(imgToSend[i].img && typeof imgToSend[i].img==="object") {
                const imageRef = ref(storage, `images/${imgToSend[i].img.name + v4()}`);
                const imgRes = await uploadBytes(imageRef, imgToSend[i].img);
                metadata.push(imgRes.metadata.fullPath)
            }else{
                metadata.push(imgToSend[i].img)
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
                        <TextInputComponent style={cl.input} value={value} name={'title'} label={"Назва товару"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} multiline={true} name={'description'} label={"Опис"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent type={"number"} style={cl.input} value={value}  name={'price'} label={"Ціна"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent type={"number"} style={cl.input} value={value}  name={'discount'} label={"Знижка"} setVal={handleVal} />
                    </div>
                    <div>
                        <Button disabled={load} variant={"contained"} color={"primary"} onClick={createPost}>
                            {edit ?  "Редагувати" : "Створити"}
                        </Button>
                    </div>
                </div>
            </Paper>
        </div>

    )
}

export default CreateItem;