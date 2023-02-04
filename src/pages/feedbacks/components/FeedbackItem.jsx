import React, {useContext, useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {addDoc, collection, deleteDoc, doc, getDocs, query, where} from "firebase/firestore";
import {auth, db} from "../../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {AppContext} from "../../../App";
import AddCommentComponent from "./AddCommentComponent";
import CommentsAccordeon from "./CommentsAccordeon";
import {checkAdmin} from "../../../shared/Utils";
import {LightTooltip} from "../../../shared/TooltipComponent";
import {IconButton} from "@material-ui/core";
import BackspaceIcon from "@material-ui/icons/Backspace";




const useStyles = makeStyles((theme) => ({
    root:{
        margin: "10px"
    },
    box: {

    },
    userDataBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding:"10px 15px",
        fontSize: "20px",
        color: "blue",
        '@media (max-width: 680px)': {
            fontSize: "18px",
        },
        '@media (max-width: 480px)': {
            fontSize: "12px",
        },
    },
    imageBox: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        overflow: "hidden",
        '@media (max-width: 680px)': {
            width: "35px",
            height: "35px",
        },
        '@media (max-width: 480px)': {
            width: "25px",
            height: "25px",
        },
    },
    imageIcon: {
        width: "100%",
        height: "100%",
    },
    item:{
       marginRight: "10px"
    },
    buttonBox:{
        padding: "10px 15px"
    },
    fedbackTitle:{
       textAlign: "center",
       fontSize: "30px"
    },
    fedback:{
        padding: "10px",
        fontSize: "20px"
    }
}))

const FeedbackItem = ({item}) =>{

    const cl = useStyles()
    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const [comments, setComments] = useState([]);

    const comentRef = collection(db, "comentsF");
    const commentsDoc = query(comentRef,where("feedbackId","==", item.id))
    const getComments = async () => {
        const res = await getDocs(commentsDoc);
        setComments(res.docs.map(el => ({...el.data(), id : el.id})))
    }

    const activeUser = localStorage.getItem("activeUser")? JSON.parse(localStorage.getItem("activeUser")):null


    useEffect(() =>{
        getComments()
    },[item]);


    const openCommentDialog = () => {
        setValues(prev => ({
            ...prev,
            openDialog: true,
            dialogComponent: <AddCommentComponent item={item}/>,
            dialogTitle: "Додати Коментар"
        }))
    }

    const deleteFeedback = async (contact) =>{
        setValues(prev =>({
            ...prev,
            loading:true
        }))
        await deleteDoc(doc(db, "feedbacks", contact.id))
            .catch(e => {
                console.log(e)
                setValues(prev =>({
                    ...prev,
                    openAlert: true,
                    alertMassage: e.message
                }))
            });

        for(let i = 0; i < comments.length; i++){
            await deleteDoc(doc(db, "comentsF", comments[i].id))
                .catch(e => {
                    console.log(e)
                    setValues(prev =>({
                        ...prev,
                        openAlert: true,
                        alertMassage: e.message
                    }))
                });
        }

        setValues(prev => ({
            ...prev,
            refreshFeedbacks: true,
            openAlert: true,
            alertMassage: "Відгук видалений!",
            loading:false
        }))
    }

    return (
        <Paper elevation={4} className={cl.root}>
            {user && checkAdmin(user?.uid) &&
                <div>
                    <LightTooltip title={"Видалити відгук!"}>
                        <IconButton onClick={() => deleteFeedback(item)}>
                            <BackspaceIcon/>
                        </IconButton>
                    </LightTooltip>
                </div>
            }
            <div>
                <div className={cl.userDataBox}>
                    <p className={cl.item}>{moment(item.date).locale('UA').format("yyyy-MM-DD")}</p>
                    {(item.userName) &&
                        <p className={cl.item}>{item.userName}</p>
                    }
                    {item.userImg &&
                        <div className={cl.imageBox}>
                            <img className={cl.imageIcon} src={item.userImg} alt={"icon"}/>
                        </div>
                    }
                </div>
                <div className={cl.fedbackTitle}>
                    <p>{item.name}</p>
                </div>
                <div className={cl.fedback}>
                    {item.feedback}
                </div>
                {comments.length >0 &&
                    <CommentsAccordeon comments={comments.sort((a,b) => a.date>b.date?1:-1)}/>
                }
                <div className={cl.buttonBox}>
                    <Button variant={"contained"} size={"small"} onClick={openCommentDialog}>
                        Коментувати
                    </Button>
                </div>
            </div>
        </Paper>
    )
}

export default FeedbackItem;