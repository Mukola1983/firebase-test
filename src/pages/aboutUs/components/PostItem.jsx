import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CarouselComponent from "../../../components/carousel/CarouselComponent";
import {getDownloadURL, ref} from "firebase/storage";
import {storage} from "../../../firebase";


const useStyles = makeStyles((theme) => ({
    root: {
        border: "1px solid grey",
        padding: "20px 40px"
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
    }
}))

const PostItem = ({post}) =>{

    const cl = useStyles();

    const [images, setImages] = useState([])

    const getImages = async () =>{
        setImages([])
        for(let i = 0; i < post?.images?.length; i++){
            const img = await getDownloadURL(ref(storage, `${post?.images[i]}`))
                .catch(e => console.log(e));
            setImages(prev => ([...prev, img]))
        }
    }

    useEffect(() =>{
        if(post?.images){
            getImages()
        }

    },[post]);

    return (
        <div className={cl.root} >
            <div style={{padding: "10px"}}>
                <CarouselComponent anim={"fade"} auto={true} indicators={false} images={images}/>
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