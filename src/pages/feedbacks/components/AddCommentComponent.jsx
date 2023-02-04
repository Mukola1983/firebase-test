import React, {useContext, useEffect, useState} from "react";
import TextInputComponent from "../../../shared/inputs/TextInputComponent";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../firebase";
import {AppContext} from "../../../App";
import moment from "moment";
import {addDoc, collection, doc, updateDoc} from "firebase/firestore";
import RatingComponent from "../../../shared/inputs/RatingComponent";



const useStyles = makeStyles((theme) => ({
    root:{
        padding: "40px"
    },
    input: {
        width: "100%"
    },
    paper: {
        // width: "100%",
        height:"100%",
    }

}))

const AddCommentComponent = ({item,itemToRefresh='refreshFeedbacks', edit=false}) =>{

    const cl = useStyles()

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const activeUser = localStorage.getItem("activeUser")? JSON.parse(localStorage.getItem("activeUser")):null

    const [value, setValue] = useState({});
    const [load, setLoad] =  useState(false)

    const handleVal = (name, val) => {

        setValue(prev => ({
            ...prev,
            [name]: val
        }))
    }





    const addComment = async () => {
        setLoad(true)
        const comentRef = collection(db, "comentsF");
        if(user && value.comment) {
            const data = {
                userId: user?.uid,
                userName: user?.displayName || activeUser?.name,
                userImg: user?.photoURL,
                feedbackId: item.id,
                comment: value.comment,
                stars: value.stars,
                date: moment(Date.now()).format(),
            }
            const res = await addDoc(comentRef, data)
                .catch(error=>{
                    console.log(error)
                    setValues(prev =>({
                        ...prev,
                        openAlert: true,
                        alertMassage: error.message
                    }))
                });
            if(res) {
                setValues(prev => ({
                    ...prev,
                    openDialog: false,
                    [itemToRefresh]: true
                }))
            }
            setLoad(false)
        }else{
            setValues(prev =>({
                ...prev,
                openAlert: true,
                alertMassage: "Потрібно авторизуатись  і написати коментар!"
            }))
            setLoad(false)
        }
    }


    return(
        <div className={cl.root}>

            <div style={{marginBottom: "10px"}}>
                <RatingComponent value={value} name={'stars'} label={"Оцініть від 1 до 5"} setVal={handleVal} />
            </div>
            <div style={{marginBottom: "10px"}}>
                <TextInputComponent style={cl.input} value={value} multiline={true} name={'comment'} label={"Коментар"} setVal={handleVal} />
            </div>
            <div>
                <Button variant={"contained"} color={"primary"} onClick={addComment} >
                    Додати коментар
                </Button>
            </div>
        </div>
    )
}

export default AddCommentComponent;