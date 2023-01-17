import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import {Typography} from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import {useLocation} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";


const useStyles = makeStyles((theme) => ({

    burgerItem:{
        border: "1px dotted grey",
        display: "flex",
        padding: "15px 40px",
        backgroundColor: "rgba(192,192,192, 0.5)",
        color: props => props.active ? "red" : "",
        "&:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(192,192,192, 0.5)"
        }
    },
}))

const NavbarButton = ({handleChoose, way, icon, title , nevOrders=0}) =>{

    const location = useLocation();

    const cl = useStyles({active: location.pathname === way})
    return(
        <div className={cl.burgerItem} onClick={()=>handleChoose(way)} >
            {way === "/orders" ?
                <Badge badgeContent={nevOrders} color="secondary">
                    {icon}
                </Badge> :
                <>
                    {icon}
                </>
            }
            <Typography>
                {title}
            </Typography>
        </div>
    )
}


export default NavbarButton;
