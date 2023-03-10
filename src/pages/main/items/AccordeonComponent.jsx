import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
       // maxWidth: '100%',
        overflow: "hidden",
        padding:"5px"
        // backgroundColor: "rgba(180, 180, 180, 0.9)",

    },
    accord:{
        backgroundColor: "rgba(180, 180, 180, 0.3)",
        boxShadow: "0 0 5px grey"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    description: {
        fontWeight: "bold"
    }
}));

const AccordionComponent = ({value}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Accordion className={classes.accord}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>Опис товару</Typography>
                </AccordionSummary>
                <AccordionDetails >
                        <div className={classes.description}>
                            {value.description}
                        </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default AccordionComponent
