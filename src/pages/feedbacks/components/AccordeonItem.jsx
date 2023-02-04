import React, {useContext} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {deleteDoc, doc} from "firebase/firestore";
import {auth, db} from "../../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {AppContext} from "../../../App";
import {checkAdmin} from "../../../shared/Utils";
import {LightTooltip} from "../../../shared/TooltipComponent";
import {IconButton} from "@material-ui/core";
import BackspaceIcon from "@material-ui/icons/Backspace";
import Rating from "@material-ui/lab/Rating";

const useStyles = makeStyles((theme) => ({
    root:{
        width: "80%",
        margin: "10px",
        border: "1px solid grey",
    },
    rootBox: {
        display: "flex",
        justifyContent: (props) => props.even ? "flex-start": "flex-end"
    },
    userDataBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: (props) => props.even ? "flex-end" : "flex-start",
        padding:" 0px 10px",
        borderBottom: "1px dashed grey"
    },
    imageBox: {
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        overflow: "hidden",
        '@media (max-width: 680px)': {
            width: "30px",
            height: "30px",
        },
        '@media (max-width: 480px)': {
            width: "20px",
            height: "20px",
        },
    },
    imageIcon: {
        width: "100%",
        height: "100%",
    },
    item:{
        marginRight: "10px",
        fontSize: "25px",
        '@media (max-width: 680px)': {
            fontSize: "20px",
        },
        '@media (max-width: 480px)': {
            fontSize: "14px",
        },
    },
    buttonBox:{
        padding: "10px 15px"
    },
    comment:{
        padding: "10px",
        fontSize: "25px",
        '@media (max-width: 680px)': {
            fontSize: "20px",
        },
        '@media (max-width: 480px)': {
            fontSize: "14px",
        },
    }
}))

const AccordeonItem = ({item, ind, itemToRefresh }) =>{

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    const even = (ind % 2  === 0) ;
    const cl = useStyles({even:even})

    const deleteComment = async (item) =>{
        setValues(prev =>({
            ...prev,
            loading:true
        }))
        await deleteDoc(doc(db, "comentsF", item.id))
            .catch(e => {
                console.log(e)
                setValues(prev =>({
                    ...prev,
                    openAlert: true,
                    alertMassage: e.message
                }))
            });

        setValues(prev => ({
            ...prev,
            [itemToRefresh]: true,
            openAlert: true,
            alertMassage: "Коментар видалений!",
            loading:false
        }))
    }


    return (
        <div className={cl.rootBox}>
            <Paper className={cl.root}>
                {user && checkAdmin(user?.uid) &&
                <div>
                    <LightTooltip title={"Видалити коментар!"}>
                        <IconButton onClick={() => deleteComment(item)}>
                            <BackspaceIcon/>
                        </IconButton>
                    </LightTooltip>
                </div>
                }
                <div className={cl.userDataBox}>
                    {item.userName &&
                        <p className={cl.item}>{item.userName}</p>
                    }
                    {item.userImg &&
                    <div className={cl.imageBox}>
                        <img className={cl.imageIcon} src={item.userImg} alt={'icon'}/>
                    </div>
                    }

                </div>
                {item.stars>0 &&
                    <Rating name="read-only" value={item.stars} readOnly />
                }
                <div className={cl.comment}>
                    {item.comment}
                </div>
            </Paper>
        </div>
    )
}

export default AccordeonItem