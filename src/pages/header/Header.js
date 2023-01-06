import React from "react";
import Bricks from "./../../shared/images/bricksBackground.jpg"
import {makeStyles} from "@material-ui/core/styles";
import Navbar from "../Navbar";


const useStyles = makeStyles((theme) => ({
    header:{
        background: `no-repeat url(${Bricks}) center / cover`,
        height: "800px",
        width: "100%",
        // position: "relative"
        '@media (max-width: 980px)': {
            height: "600px",
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