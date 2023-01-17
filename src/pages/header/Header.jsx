import React from "react";
import Bricks from "./../../shared/images/bricksBackground.jpg"
import Bricks2 from "./../../shared/images/bricks2.jpg"
import {makeStyles} from "@material-ui/core/styles";
import Navbar from "../navBar/Navbar";


const useStyles = makeStyles((theme) => ({
    header:{
        background: `no-repeat url(${Bricks2}) center / cover`,
        height: "600px",
        width: "100%",
        // position: "relative"
        '@media (max-width: 980px)': {
            height: "500px",
        },
        '@media (max-width: 680px)': {
            height: "400px",
        },
    },
    navbar:{
        position: "sticky",
        width: "100%",
        top: "0",
        left: "0"
    }
}))

const Header = () =>{

    const cl = useStyles()
    return(
        <div className={cl.header} >
            {/*<div className={cl.navbar} >*/}
            {/*    <Navbar/>*/}
            {/*</div>*/}
        </div>
    )
}

export default Header