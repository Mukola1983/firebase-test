import React from "react";
import { AppBar, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(5),
        paddingTop: theme.spacing(6),
    },
    appBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "15px 0",
        backgroundColor: theme.palette.primary.dark,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

const DialogComponent = ({ dialog, closeDialog,title, Component}) => {

    const cl =useStyles()

    return (
        <Dialog open={dialog}  TransitionComponent={Transition} fullWidth scroll="paper">
            <AppBar position="static" className={cl.appBar}>
                <Typography variant="h4">
                    {title}
                </Typography>
                <div>
                    <Button variant={"contained"} color={"secondary"} onClick={closeDialog} >Закрити</Button>
                </div>
            </AppBar>
            {Component}
        </Dialog>
    );
};

export default DialogComponent;
