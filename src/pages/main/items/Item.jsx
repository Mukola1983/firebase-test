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
import Paper from "@material-ui/core/Paper";
import AddCommentComponent from "../../feedbacks/components/AddCommentComponent";
import CommentsAccordeon from "../../feedbacks/components/CommentsAccordeon";
import Rating from "@material-ui/lab/Rating";

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
            padding: "5px"
        }
    },
    discountTitle: {
        fontSize: "20px",
        color: "white",
        '@media (max-width: 680px)': {
            fontSize: "18px",
        },
        '@media (max-width: 480px)': {
            fontSize: "15px",
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
        '@media (max-width: 680px)': {
            fontSize: "18px",
        },
        '@media (max-width: 480px)': {
            fontSize: "15px",
        }
    },
    price: {
        fontSize: "20px",
        color: "blue",
        '@media (max-width: 680px)': {
            fontSize: "18px",
        },
        '@media (max-width: 480px)': {
            fontSize: "15px",
        }
    }
}))

const Item = ({post}) =>{

    const cl = useStyles()
    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const[fullImg, setFullImg] = useState('')
    const[fullImgShow, setFullImgShow] = useState(false)

    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(0);

    const comentRef = collection(db, "comentsF");
    const commentsDoc = query(comentRef,where("feedbackId","==", post.id))
    const getComments = async () => {
        const res = await getDocs(commentsDoc);
        setComments(res.docs.map(el => ({...el.data(), id : el.id})))
    }


    useEffect(() =>{
        getComments().catch(e => console.log(e))
    },[post]);

    useEffect(() =>{
        if(comments.length> 0) {
            const rat = comments.reduce((ac, cur) => cur.stars? +ac + +cur.stars : ac, 0)
            const count = comments.filter(it => it.stars)
            if(rat > 0) {
                setRating(rat / count.length)
            }
        }
    }, [comments])

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




    const deleteImages = async () =>{
        for(let i = 0; i < post?.images?.length; i++){
           await deleteObject(ref(storage, `${post?.images[i].metaData}`))
               .catch(e =>console.log(e));
        }
    }

    const editItem = (post) =>{

        setValues(prev =>({
            ...prev,
            openDialog: true,
            dialogComponent: <CreateItem edit={true} post={post} imagesToEdit={post?.images}/>,
            dialogTitle: "Редагувати Товар"
        }))
    }


    const handleFullImg = (src) =>{
        setFullImg(src);
        setFullImgShow(true)
    }

    const handleClose = (src) =>{
        setFullImgShow(false)
    }


    const openCommentDialog = () => {
        setValues(prev => ({
            ...prev,
            openDialog: true,
            dialogComponent: <AddCommentComponent itemToRefresh={'refreshItemsData'} item={post}/>,
            dialogTitle: "Додати Коментар"
        }))
    }



    return (
        <Paper elevation={6} className={cl.box}>
            <Backdrop style={{zIndex: "100",}}  open={fullImgShow} onClick={handleClose} >
                <div style={{width: "90vw", height: "80vh"}}>
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
                    <div className={cl.discountTitle}>
                        Знижка: {post?.discount}%
                    </div>
                </div>
            }


            <div style={{padding: "10px"}}>
                <CarouselComponent handleFullImg={handleFullImg} images={post?.images}/>
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

            {rating > 0 &&
                <Rating name="read-only" value={rating} readOnly />
            }
            {comments.length >0 &&
            <CommentsAccordeon itemToRefresh={'refreshItemsData'} comments={comments.sort((a,b) => a.date>b.date?1:-1)}/>
            }

            <div className={cl.bottomBox}>
                <div style={{padding:"0 0 10px 0"}}>
                    <Button variant={"contained"} onClick={openCommentDialog}>
                        Коментувати
                    </Button>
                </div>
            </div>

        </Paper>
    )
}

export default Item;