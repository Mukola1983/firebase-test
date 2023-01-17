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
import {ref, uploadBytes} from "firebase/storage";
import {v4} from "uuid";
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

const CreatePost = ({edit=false, post=null, imagesToEdit=[]}) => {

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


    const setEditImages = async () =>{

    }

    const removeImg = async (id) =>{

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
            if(imgToSend[i].img && typeof imgToSend[i].img==="object") {
                const imageRef = ref(storage, `postImages/${imgToSend[i].img.name + v4()}`);
                const imgRes = await uploadBytes(imageRef, imgToSend[i].img)

                metadata.push(imgRes.metadata.fullPath)
            }else{
                metadata.push(imgToSend[i].img)
            }
        }

        if(value?.title && value?.description){
            const data = {
                title: value.title,
                images: metadata,
                link: value.link,
                linkName: value.linkName,
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
                        <Button variant={"contained"} color={"primary"} onClick={createPost}>
                            {edit ?  "Редагувати" : "Створити"}
                        </Button>
                    </div>
                </div>
            </Paper>
        </div>

    )
}

export default CreatePost;