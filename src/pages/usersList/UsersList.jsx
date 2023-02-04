import React, {useContext, useEffect, useState} from "react";
import {getDocs, collection} from "firebase/firestore"
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../firebase";
import {Button, IconButton, Paper, Typography} from "@material-ui/core";
import {AppContext} from "../../App";
import {makeStyles} from "@material-ui/core/styles";
import {checkAdmin, handleGetDoc} from "../../shared/Utils";
import UserItem from "./components/UserItem";



const useStyles = makeStyles((theme) => ({
    postWrapper: {
        width: "90vw",
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        padding: "10px",
        '@media (max-width: 680px)': {
            padding: "0",
            width: "100vw",
        },
    },
    flexBox:{
        padding: "10px",
        flex: "0 0 40%",
        '@media (max-width: 680px)': {
            flex: "0 0 80%",
        },
    }
}))
const UsersList = () => {

    const cl = useStyles()
    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);

    // const [posts, setPosts] = useState([])

    useEffect(() =>{
        if(!values.users.length ) {
            handleGetDoc(setValues, "users", "users");
        }
    },[])






    return (
        <div >
            {user && checkAdmin(user?.uid) &&
                <Paper className={cl.postWrapper}>
                    {values.users.length >0 && values.users.map(el =>(
                        <UserItem key={el.uiD} item={el}/>
                    ))}
                </Paper>
            }
        </div>
    )
}

export default UsersList;