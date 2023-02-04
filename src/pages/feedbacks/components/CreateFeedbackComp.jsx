import React, {useContext, useState} from "react";
import TextInputComponent from "../../../shared/inputs/TextInputComponent";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../firebase";
import {AppContext} from "../../../App";
import moment from "moment";
import {addDoc, collection, doc, updateDoc} from "firebase/firestore";



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

const CreateFeedbackComp = ({edit=false}) =>{

    const cl = useStyles()

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);


    const [value, setValue] = useState({});
    const [load, setLoad] =  useState(false);

    const activeUser = localStorage.getItem("activeUser")? JSON.parse(localStorage.getItem("activeUser")):null

    const handleVal = (name, val) => {

        setValue(prev => ({
            ...prev,
            [name]: val
        }))
    }

    const createFeedback_2 = async () => {
        const feedbackRef = collection(db, "feedbacks")
        if (value.feedback) {
            const data = {
                name: value.name,
                feedback: value.feedback,
                date: moment(Date.now()).format(),
                userId: user?.uid,
                userName: user?.displayName || activeUser?.name,
                userImg: user?.photoURL
            }

            if(edit){
                // const updateRef = doc(db, "items", post.id);
                // await updateDoc(updateRef, data)
            }else{
                await addDoc(feedbackRef, data)
                    .catch(e => {
                        console.log(e)
                        setValues(prev =>({
                            ...prev,
                            openAlert: true,
                            alertMassage: e.message
                        }))
                    });
            }
        }else{
            setValues(prev =>({
                ...prev,
                openAlert: true,
                alertMassage: "Потрібно добавити відгук!"
            }))
        }
    }

    const createFeedback = async () =>{
        setLoad(true)
        await createFeedback_2()
        setLoad(false)
        setValues(prev =>({
            ...prev,
            openDialog: false,
            refreshFeedbacks: true
        }))
    }

    return(
        <div className={cl.root}>

            <div style={{marginBottom: "10px"}}>
                <TextInputComponent style={cl.input} value={value} multiline={true} name={'name'} label={"Назва"} setVal={handleVal} />
            </div>
            <div style={{marginBottom: "10px"}}>
                <TextInputComponent style={cl.input} value={value} multiline={true} name={'feedback'} label={"Відгук"} setVal={handleVal} />
            </div>
            <div>
                <Button variant={"contained"} color={"primary"} onClick={createFeedback}>
                    Додати Відгук
                </Button>
            </div>
        </div>
    )
}

export default CreateFeedbackComp;