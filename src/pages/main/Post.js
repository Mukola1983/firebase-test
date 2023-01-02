import React, {useEffect, useState} from "react";
import {Button, IconButton, Typography} from "@material-ui/core";
import {addDoc, collection, getDocs, query, where, deleteDoc, doc} from "firebase/firestore";
import {ref, getDownloadURL } from "firebase/storage";
import {auth, db, storage} from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import {LightTooltip} from "../../shared/TooltipComponent";



const Post = ({post}) =>{

    const [user, loading, error] = useAuthState(auth);

    const [likes, setLikes] = useState([])
    const [likesNames, setLikesNames] = useState([])
    const [images, setImages] = useState([])

    const likesRef = collection(db, "likes")

    const addLike = async () =>{
        if(!likes.some(el=> el.userId === user?.uid)) {
            const data = {
                userId: user?.uid,
                userName: user?.displayName,
                postId: post.id
            }
            const res = await addDoc(likesRef, data);
        }else{
            console.log("you already like it")
        }
        await getLikes()
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

    console.log('jhk')

    return (
        <div style={{border: "1px solid grey", margin: "10px", textAlign: "center"}}>
            <Typography variant={"h6"} color={"primary"}>
                {post.title}
            </Typography>

            <Typography>
                {post.description}
            </Typography>
            <div style={{display: "flex"}}>
                {images.length> 0 && images.map(el =>(
                    <div style={{width: "70px" , height: "70px", margin: "0 5px"}}>
                        <img src={el} alt={"img"} style={{width: "100%" , height: "100%"}}/>
                    </div>
                ))}
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "35px"
            }}>
                <div>
                    {!likes.some(el => el.userId === user?.uid) &&
                        // <LightTooltip title={likesNames}>
                        <LightTooltip title={<ToltipTitle arr={likesNames}/>}>
                            <IconButton size={"small"} onClick={addLike}>
                                <ThumbUpAltIcon style={{color: "yellowgreen"}}/>
                            </IconButton>
                        </LightTooltip>
                    }
                    {likes.some(el => el.userId === user?.uid) &&
                        // <LightTooltip title={likesNames}>
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
            <div style={{display: "flex", justifyContent: "flex-end", padding: "0 20px"}}>
                <Typography color={"primary"} style={{marginRight: "10px"}}>
                    {post.userName}
                </Typography>
                {post.userImg && <img src={post.userImg} alt={'icon'}
                                    style={{width:"20px" ,height: "20px", borderRadius: "50%",
                                        overflow: "hidden"}} />}
            </div>

        </div>
    )
}

export default Post;