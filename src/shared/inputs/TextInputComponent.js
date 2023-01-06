
import React, {useEffect, useState} from "react"
import {MenuItem, TextField} from "@material-ui/core";

const TextInputComponent = ({name, type='text', value, setVal, label, style='', multiline=false , minRows=1}) =>{

    useEffect(()=> {
        if(!value?.[name]) {
            setVal(name, '')
        }
    },[])


    return(

        <TextField
            className={style}
            type={type}
            label={label}
            multiline={multiline}
            minRows={minRows}
            value={value?.[name] ? value[name]:''}
            onChange={(e) => setVal(name, e.target.value)}
        />
    )
}

export  default  TextInputComponent;