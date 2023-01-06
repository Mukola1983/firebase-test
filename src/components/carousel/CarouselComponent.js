import React from 'react';
import Carousel from 'react-material-ui-carousel'
import {Button, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    imgBox:{
        width: "370px" ,
        height: "370px",
        margin: "0 auto",
        '@media (max-width: 980px)': {
            width: "300px" ,
            height: "300px",
        },
        '@media (max-width: 480px)': {
            width: "200px" ,
            height: "200px",
        },
    },
    image: {
        width: "100%" ,
        height: "100%",
        objectFit: "contain",

    }
}))

const  CarouselComponent = ({images}) => {

    const cl = useStyles()
    return (
        <Carousel autoPlay={false} animation={"slide"}>
            {images && images.map(el =>(
                    <Paper style={{}}>
                        <div className={cl.imgBox}>
                            <img src={el} alt={"img"} className={cl.image}/>
                        </div>
                    </Paper>
                ))
            }
        </Carousel>
    )
}

export default CarouselComponent