import React, {useContext, useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Paper, Typography} from "@material-ui/core";
import {checkAdmin, handleGetDoc} from "../../shared/Utils";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../firebase";
import {AppContext} from "../../App";
import CreatePost from "../aboutUs/components/CreatePost";
import CreateFeedbackComp from "./components/CreateFeedbackComp";
import FeedbackItem from "./components/FeedbackItem";



const useStyles = makeStyles((theme) => ({
    root:{
        // width: "100vw",
        minHeight: "100vh",
        padding: "140px",
        '@media (max-width: 680px)': {
            padding: "40px",
        },
        '@media (max-width: 480px)': {
            padding: "0px",
        },
    },

}))

const Feedbacks = () => {
    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const cl = useStyles()

    const openDialog = () => {
        if(user) {
            setValues(prev => ({
                ...prev,
                openDialog: true,
                dialogComponent: <CreateFeedbackComp/>,
                dialogTitle: "Додати Відгук"
            }))
        }else{
            setValues(prev =>({
                ...prev,
                openAlert: true,
                alertMassage: "Потрібно авторизуатись!"
            }))
        }
    }

    useEffect(() =>{
        if(values.refreshFeedbacks ||  !values.feedbacks.length > 0){
            // handleGetDoc()
            handleGetDoc(setValues, "feedbacks", "feedbacks")
            setValues(prev =>({
                ...prev,
                refreshFeedbacks: false
            }))
        }
    },[values.refreshFeedbacks])

    return (
        <div className={cl.root}>
            <Paper elevation={3} className={cl.paper}>
               <Typography variant={"h3"} color={"primary"}>Відгуки</Typography>

                <Button variant={"contained"} color={"primary"} onClick={openDialog}>
                    Додати Відгук
                </Button>
                <div>
                    {values.feedbacks.length> 0 && values.feedbacks.map(el =>(
                        <FeedbackItem key={el.id} item={el} />
                    ))}
                </div>
            </Paper>

        </div>
    )
}

export default Feedbacks