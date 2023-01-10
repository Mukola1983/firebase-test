import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {IconButton} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    imgBox: {
        width: "90px",
        margin:"4px",
        height: "90px",
        border: "1px dotted grey",
        position: "relative"
    },
    img:{
        width: "100%" ,
        height: "100%"
    },
    icon: {
        position: "absolute",
        top: "-20px",
        right: "0px"
    }
}))

const ImageItem = ({image, delHandle}) =>{

    const cl = useStyles()
    return (
            <div className={cl.imgBox}>
                <img src={image.img} alt={'icon'} className={cl.img} />
                {/*<IconButton onClick={()=>delHandle(image.id)} className={cl.icon}>*/}
                    <DeleteForeverIcon color={"error"} onClick={()=>delHandle(image.id)} className={cl.icon}/>
                {/*</IconButton>*/}
            </div>
    )
}

export default ImageItem