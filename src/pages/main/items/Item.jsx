import React, {useContext, useEffect, useState} from "react";
import {Button, IconButton, Typography} from "@material-ui/core";
import {addDoc , collection, getDocs, query, where, deleteDoc, doc} from "firebase/firestore";
import {ref, getDownloadURL , deleteObject } from "firebase/storage";
import {auth, db, storage} from "../../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import {LightTooltip} from "../../../shared/TooltipComponent";
import {AppContext} from "../../../App";
import CarouselComponent from "../../../components/carousel/CarouselComponent";
import AccordionComponent from "./AccordeonComponent";
import {makeStyles} from "@material-ui/core/styles";
import BackspaceIcon from '@material-ui/icons/Backspace';
import EditIcon from '@material-ui/icons/Edit';
import CreateItem from "../../createItem/CreateItem";
import {checkAdmin} from "../../../shared/Utils";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";

const useStyles = makeStyles((theme) => ({
    title:{
        fontSize: "35px",
        color: "blue",
        textAlign: "center",
        '@media (max-width: 680px)': {
            fontSize: "20px",
        },
        '@media (max-width: 480px)': {
            fontSize: "18px",
        }
    },
    discount:{
        width: "80%",
        display: "flex",
        justifyContent: "flex-end",
        color: "red",
        position: "absolute",
        top: "-10px",
        right: "-10px",
        padding: "5px 10px",
        boxShadow: "0 0 20px rgb(255, 165, 0),0 0 25px rgb(238, 130, 238)",
        borderRadius: "10px",
        backgroundColor: "rgb(255, 165, 0)",
        '@media (max-width: 680px)': {
            width: "40%",
            padding: "2px 10px",
        },
        '@media (max-width: 480px)': {
            // fontSize: "18px",
        }
    },
    box:{
        border: "1px solid grey",
        margin: "10px",
        position: "relative",
        // flex: "1 1 40%"
    },
    bottomBox: {
        display: "flex",
        padding: "0 20px",
        justifyContent: "flex-end",
        alignItems: "center",
        height: "35px"
    },
    userBox: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "0 20px"
    },
    userImg:{
        width:"20px" ,
        height: "20px",
        borderRadius: "50%",
        overflow: "hidden"
    },
    oldPrice: {
        position: "absolute",
        width: "80%",
        top: "50%",
        // transform: "translate(10,-250px)",
        left: "10%",
        height: "3px",
        backgroundColor:"red",
        boxShadow: "0 0 10px rgb(255, 165, 0),0 0 10px rgb(255, 165, 0)",
    },
    price: {
        fontSize: "20px",
        color: "blue"
    }
}))

const Item = ({post}) =>{

    const cl = useStyles()
    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const [likes, setLikes] = useState([])
    const [likesNames, setLikesNames] = useState([])
    const [images, setImages] = useState([]);
    const[fullImg, setFullImg] = useState('')
    const[fullImgShow, setFullImgShow] = useState(false)

    const likesRef = collection(db, "likes")

    const addLike = async () =>{

        if(user && !likes.some(el=> el.userId === user?.uid)) {
            const data = {
                userId: user?.uid,
                userName: user?.displayName,
                postId: post.id
            }
            await addDoc(likesRef, data);
            await getLikes()
        }else{
            setValues(prev =>({
                ...prev,
                openAlert: true,
                alertMassage: "You should authorize!"
            }))
        }
    }

    const removeLike = async (id) =>{

        const likeToDelete = doc(db, "likes", likes.find(el=> el.userId === user?.uid).id);
        await deleteDoc(likeToDelete);
        await getLikes()
    }

    const deleteDocument = async (id) =>{
        setValues(prev =>({
            ...prev,
            loading:true
        }))
        await deleteDoc(doc(db, "items", id.id));
        await deleteImages();
        setValues(prev =>({
            ...prev,
            refreshItemsData: true,
            openAlert: true,
            alertMassage: "Товар видалений!",
            loading:false
        }))

    }

    const likesDoc = query(likesRef,where("postId","==", post.id))
    const getLikes = async () => {
        const res = await getDocs(likesDoc);
        setLikes(res.docs.map(el => ({...el.data(), id : el.id})))
    }

    useEffect(() =>{
        getLikes()
    },[]);

    useEffect(() =>{
        setLikesNames(likes.map(el => el.userName))
    },[likes]);

    useEffect(() =>{
        if(post?.images){
            getImages()
        }

    },[post]);

    const deleteImages = async () =>{
        for(let i = 0; i < post?.images?.length; i++){
           await deleteObject(ref(storage, `${post?.images[i]}`));
        }
    }

    const getImages = async () =>{
        await setImages([])
        for(let i = 0; i < post?.images?.length; i++){
            const img = await getDownloadURL(ref(storage, `${post?.images[i]}`));
             await setImages(prev => ([...prev, img]))
        }
        setImages(prev => ([...new Set(prev)]))
    }

    const editItem = (post) =>{

        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <CreateItem edit={true} post={post} imagesToEdit={images}/>,
            dialogTitle: "Редагувати Товар"
        }))
    }

    const ToltipTitle = ({arr}) =>{
        return (
            <>
                {arr.length > 0 ? arr.map(el =>(
                    <p key={el}>{el}</p>
                )):
                    <p>No likes</p>
                }
            </>
        )
    }

    const handleFullImg = (src) =>{
        setFullImg(src);
        setFullImgShow(true)
    }

    const handleClose = (src) =>{
        setFullImgShow(false)
    }



    return (
        <div className={cl.box}>
            <Backdrop style={{zIndex: "100",}}  open={fullImgShow} onClick={handleClose} >
                <div style={{width: "80vw", height: "80vh"}}>
                    <img src={fullImg} style={{height: "100%", width: "100%", objectFit: "contain"}} />
                </div>
            </Backdrop>
            {user && checkAdmin(user?.uid) &&
            <div>
                <LightTooltip title={"Видалити Товар!"}>
                    <IconButton onClick={() => deleteDocument(post)}>
                        <BackspaceIcon/>
                    </IconButton>
                </LightTooltip>
                <LightTooltip title={"Редагувати Товар"}>
                    <IconButton onClick={() => editItem(post)}>
                        <EditIcon/>
                    </IconButton>
                </LightTooltip>
            </div>
            }
            <div className={cl.title}>
                <p >
                    {post.title}
                </p>
            </div>
            {post?.discount &&
                <div className={cl.discount}>
                    <div style={{fontSize: "20px", color: "white"}}>
                        Знижка: {post?.discount}%
                    </div>
                </div>
            }


            <div style={{padding: "10px"}}>
                <CarouselComponent handleFullImg={handleFullImg} images={images}/>
            </div>

            <div>
                <AccordionComponent value={post}/>
            </div>
            <div style={{padding: "10px"}}>
                {post?.discount ?
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div>Ціна :</div>
                        <div className={cl.price}  style={{position: "relative", marginRight: "10px"}}>
                            <div className={cl.oldPrice} />
                            {post.price}
                        </div>
                        <div className={cl.price}>
                            {+post.price -(+post.price * +post.discount)/100} грн
                        </div>
                    </div>
                    :
                    <div className={cl.price}> Ціна {post.price} грн</div>
                }
            </div>

            <div className={cl.bottomBox}>
                <div>
                    {!likes.some(el => el.userId === user?.uid) &&
                        <LightTooltip title={<ToltipTitle arr={likesNames}/>}>
                            <IconButton size={"small"} onClick={addLike}>
                                <ThumbUpAltIcon style={{color: "yellowgreen"}}/>
                            </IconButton>
                        </LightTooltip>
                    }
                    {likes.some(el => el.userId === user?.uid) &&
                        <LightTooltip title={<ToltipTitle arr={likesNames}/>}>
                            <IconButton size={"small"} onClick={removeLike}>
                                <ThumbUpAltIcon style={{color: "blue"}}/>
                            </IconButton>
                        </LightTooltip>
                    }
                </div>
                <div>
                    {likes.length> 0 &&
                        <p>{likes.length}</p>
                    }
                </div>
            </div>
            <div className={cl.userBox}>
                <Typography color={"primary"} style={{marginRight: "10px"}}>
                    {post.userName}
                </Typography>
                {post.userImg &&
                    <img src={post.userImg} alt={'icon'} className={cl.userImg} />
                }
            </div>

        </div>
    )
}

export default Item;