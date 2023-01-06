import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Paper, Typography} from "@material-ui/core";



const useStyles = makeStyles((theme) => ({
    root:{
        // width: "100vw",
        height: "100vh",
        border: "1px solid red",
        padding: "140px"
    },
    paper: {
        // width: "100%",
        height:"100%",
    }

}))

const Feedbacks = () => {

    const cl = useStyles()

    return (
        <div className={cl.root}>
            <Paper elevation={3} className={cl.paper}>
               <Typography variant={"h3"} color={"primary"}>Feedback</Typography>
            </Paper>

        </div>
    )
}

export default Feedbacks