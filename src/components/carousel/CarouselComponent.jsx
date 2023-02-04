import React from 'react';
import Carousel from 'react-material-ui-carousel'
import {Button, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    imgBox:{
        width: "370px" ,
        height: "370px",
        margin: "0 auto",
        // boxShadow: "0 0 20px grey",
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
    },
    paper: {
    }
}))

const  CarouselComponent = ({ handleFullImg, images, anim="slide", auto=false, indicators=true}) => {

    const cl = useStyles()
    return (
        <Carousel indicators={indicators}
                  interval={5000}
                  autoPlay={auto}
                  animation={anim}
        >
            {images && images.map(el =>(
                    <Paper key={el} elevation={8}className={cl.paper}>
                        <div className={cl.imgBox}>
                            <img onClick={() => handleFullImg(el.path)} src={el.path} alt={"img"} className={cl.image}/>
                        </div>
                    </Paper>
                ))
            }
        </Carousel>
    )
}

export default CarouselComponent