import React, {useEffect, useState} from "react";
import {Button, IconButton, Typography} from "@material-ui/core";
import {addDoc, collection, getDocs, query, where, deleteDoc, doc} from "firebase/firestore";
import {ref, getDownloadURL } from "firebase/storage";
import {auth, db, storage} from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";



const Post = ({post}) =>{

    const [user, loading, error] = useAuthState(auth);

    const [likes, setLikes] = useState([])

    const [image, setImage] = useState('')
    const [images, setImages] = useState([])

    const likesRef = collection(db, "likes")

    // console.log(post)
    //
    // const pathReference = ref(storage, post?.image);
    //
    // console.log(pathReference)



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
        // console.log(res.docs)
        setLikes(res.docs.map(el => ({...el.data(), id : el.id})))
    }

    useEffect(() =>{
        getLikes()
    },[]);

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
                    <div style={{width: "50px" , height: "50px", margin: "0 5px"}}>
                        <img src={el} alt={"img"} style={{width: "100%" , height: "100%"}}/>
                    </div>
                ))}
            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
                {!likes.some(el => el.userId === user?.uid) &&
                    <Button size={"small"} onClick={addLike}>
                        &#128077;
                    </Button>
                }
                {likes.some(el => el.userId === user?.uid) &&
                    <Button size={"small"} onClick={removeLike}>
                        &#128078;
                    </Button>
                }
                {likes.length> 0 &&
                    <p>{likes.length}</p>
                }
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