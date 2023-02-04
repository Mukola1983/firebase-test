import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordeonItem from "./AccordeonItem";

const useStyles = makeStyles((theme) => ({
    root: {
        // maxWidth: '100%',
        overflow: "hidden",
        padding:"5px"
        // backgroundColor: "rgba(180, 180, 180, 0.9)",

    },
    accord:{
      //  backgroundColor: "rgba(180, 180, 180, 0.3)",
        boxShadow: "0 0 2px grey"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    description: {
        fontWeight: "bold"
    },
    commentsBlock:{
        display: "flex",
        flexDirection: "column"
    }
}));

const CommentsAccordeon = ({comments, itemToRefresh='refreshFeedbacks'}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Accordion className={classes.accord}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>Коментарі ({comments.length})</Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <div style={{width: "100%"}}>
                        {comments.length>0 && comments.map((el, ind)=>(
                            <AccordeonItem key={el.id} ind={ind} item={el} itemToRefresh={itemToRefresh}/>
                        ))}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default CommentsAccordeon
