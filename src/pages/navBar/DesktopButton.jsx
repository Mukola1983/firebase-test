import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import {IconButton, Typography} from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import {useHistory, useLocation} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import Badge from "@material-ui/core/Badge";


const useStyles = makeStyles((theme) => ({


    buttonBox:{
        display:"flex",
        margin: "10px",
        alignItems: "center",
        cursor: "pointer",
        color: props => props.active ? "blue" : ""
    },
    button:{
        marginLeft: "10px"
    }
}))

const DesctopButton = ({way, icon, title, nevOrders=0}) =>{

    const history = useHistory();
    const location = useLocation();

    const cl = useStyles({active: location.pathname === way})
    return(
            <div className={cl.buttonBox} onClick={()=> history.push(way)} >
                {way === "/orders" ?
                    <Badge badgeContent={nevOrders} color="secondary">
                            {icon}
                    </Badge> :
                    <>
                        {icon}
                    </>
                }

                <div className={cl.button} >
                    {title}
                </div>
            </div>

    // <Badge badgeContent={nevOrders} color="secondary">
    //     <IconButton onClick={()=> history.push("/orders")} >
    //         <ProductionQuantityLimitsIcon/>
    //     </IconButton>
    // </Badge>
    )
}

export default DesctopButton;
