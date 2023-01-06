import React, {useContext, useEffect, useState} from "react";
import {Button, IconButton, Typography} from "@material-ui/core";
import {addDoc, collection, getDocs, query, where, deleteDoc, doc} from "firebase/firestore";
import {ref, getDownloadURL } from "firebase/storage";
import {auth, db, storage} from "../../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import {LightTooltip} from "../../../shared/TooltipComponent";
import {AppContext} from "../../../App";
import CarouselComponent from "../../../components/carousel/CarouselComponent";
import AccordionComponent from "./AccordeonComponent";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    title:{
      textAlign: "center"
    },
    box:{
        border: "1px solid grey",
        margin: "10px",
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
    }
}))

const Item = ({post}) =>{

    const cl = useStyles()
    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const [likes, setLikes] = useState([])
    const [likesNames, setLikesNames] = useState([])
    const [images, setImages] = useState([])

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

    const getImages = async () =>{
        setImages([])
        for(let i = 0; i < post?.images?.length; i++){
            const img = await getDownloadURL(ref(storage, `${post?.images[i]}`));
            setImages(prev => ([...prev, img]))
        }
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


    return (
        <div className={cl.box}>
            <div className={cl.title}>
                <Typography variant={"h3"} color={"primary"}>
                    {post.title}
                </Typography>
            </div>

            <div style={{padding: "10px"}}>
                <CarouselComponent images={images}/>
            </div>

            <div>
                <AccordionComponent value={post}/>
            </div>
            <div style={{padding: "10px"}}>
                <Typography variant={"h6"} color={"primary"}> Ціна {post.price} грн</Typography>
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