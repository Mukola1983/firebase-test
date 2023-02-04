import React, {useContext, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CarouselComponent from "../../../components/carousel/CarouselComponent";
import {deleteObject, getDownloadURL, ref} from "firebase/storage";
import {auth, db, storage} from "../../../firebase";
import {LightTooltip} from "../../../shared/TooltipComponent";
import {IconButton} from "@material-ui/core";
import BackspaceIcon from "@material-ui/icons/Backspace";
import EditIcon from "@material-ui/icons/Edit";
import {useAuthState} from "react-firebase-hooks/auth";
import {deleteDoc, doc} from "firebase/firestore";
import CreateItem from "../../createItem/CreateItem";
import {AppContext} from "../../../App";
import {checkAdmin} from "../../../shared/Utils";
import CreatePost from "./CreatePost";
import Iframe from 'react-iframe'


const useStyles = makeStyles((theme) => ({
    root: {
        border: "1px solid grey",
        padding: "30px 40px 20px",
        position: 'relative',
        margin: "10px 0"
    },
    titleBox:{
        textAlign: "center",
    },
    ArticleBox:{
        maxHeight: "300px",
        overflowY: "auto"
    },
    article:{
        fontSize: "25px",
        '@media (max-width: 680px)': {
            fontSize: "20px",
        },
        // '@media (max-width: 480px)': {
        //     fontSize: "10px",
        // }
    },
    linkBox:{
        position: "absolute",
        top: "0px",
        right: "20px",
        zIndex: "100"
    },
    link:{
        fontSize: "40px",
        color: "green",
        '@media (max-width: 680px)': {
            fontSize: "25px",
        },
        '@media (max-width: 480px)': {
            fontSize: "18px",
        },
    },
    videoBox:{
        width:"90%",
        height:"580px",
        border: "2px solid blue",
        padding: "40px",
        '@media (max-width: 680px)': {
            fontSize: "25px",
            padding: "0 20px",
            height:"480px",
        },
        '@media (max-width: 480px)': {
            width:"100%",
            height:"280px",
            padding: "0",
        },
    },
    frame:{
        width:"100%",
        height:"100%",
    }
}))

const PostItem = ({post}) =>{

    const cl = useStyles();

    const [user, loading, error] = useAuthState(auth);

    const {values, setValues} = useContext(AppContext);

    const [images, setImages] = useState([])

    const [link, setLink] = useState('')


    const deleteDocument = async (id) =>{
        setValues(prev =>({
            ...prev,
            loading:true
        }))
        await deleteDoc(doc(db, "posts", id.id))
            .catch(e => console.log(e))
        await deleteImages();
        setValues(prev =>({
            ...prev,
            refreshItemsData: true,
            openAlert: true,
            alertMassage: "Стаття видалена!",
            loading:false
        }))
    }

    const deleteImages = async () =>{
        for(let i = 0; i < post?.images?.length; i++){
            await deleteObject(ref(storage, `${post?.images[i]?.metaData}`))
                .catch(e =>console.log(e));
        }
    }

    const editItem = (post) =>{

        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <CreatePost edit={true} post={post} imagesToEdit={post?.images}/>,
            dialogTitle: "Редагувати Статтю!"
        }))
    }

    useEffect(() =>{
        if(post){
           setLink(post.link.split('/')[post.link.split('/').length-1])
        }
    },[post])

    return (
        <div className={cl.root} >
            {post.link &&
            <div className={cl.linkBox} >
                <a target={"blank"} href={post.link} className={cl.link}>
                    {post.linkName}
                </a>
            </div>
            }
            {user && checkAdmin(user?.uid) &&
            <div>
                <LightTooltip title={"Видалити Статтю!"}>
                    <IconButton onClick={() => deleteDocument(post)}>
                        <BackspaceIcon/>
                    </IconButton>
                </LightTooltip>
                <LightTooltip title={"Редагувати Статтю"}>
                    <IconButton onClick={() => editItem(post)}>
                        <EditIcon/>
                    </IconButton>
                </LightTooltip>
            </div>
            }
            <div style={{padding: "10px"}}>
                <CarouselComponent anim={"fade"} auto={true} indicators={false} images={post?.images}/>
            </div>
            <div className={cl.videoBox}>
                {link &&
                <Iframe
                    width="100%"
                   // height="400px"
                    styles={{height: "100%"}}
                    src={`https://www.youtube.com/embed/${link}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    // allowFullScreen
                    title="Embedded youtube"
                />
                }
            </div>
            <div className={cl.titleBox}>
                <Typography variant={"h3"} color={"primary"}>
                    {post.title}
                </Typography>
            </div>
            <div className={cl.ArticleBox}>
                <p className={cl.article}>
                    {post.description}
                </p>
            </div>
        </div>
    )
}

export default PostItem