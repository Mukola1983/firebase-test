import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const RatingComponent = ({name,  value, setVal, label,}) => {

    useEffect(()=> {
        if(!value?.[name]) {
            setVal(name, 0)
        }
    },[])

    return (
        <Box
            sx={{
                '& > legend': { mt: 2 },
            }}
        >
            <Typography component="legend">{label}</Typography>
            <Rating
                name="simple-controlled"
                onChange={(event, newValue) => {
                    setVal(name,newValue);
                }}
                value={value?.[name] ? value[name]:''}
            />
        </Box>
    );
}

export default RatingComponent