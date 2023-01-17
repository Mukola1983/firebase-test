import React, {useEffect} from "react";
import Checkbox from "@material-ui/core/Checkbox";
import {TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({

    input:{
        width: "100px",
        '@media (max-width: 680px)': {
            width: "80px",
        },
        '@media (max-width: 480px)': {
            width: "50px",
        }
    },
}))


const ItemsList = ({item, handle}) => {


    const cl = useStyles()
    useEffect(() =>{
        if(item.count > 0 ){
            const discount = +item.discount>0 ?(+item.price * +item.discount)/ 100 : 0
            handle("suma", (+item.count * (+item.price - discount)), item.id)
        }
    },[item.count])
    return (
        <div style={{display: "grid", position: "relative", gridTemplateColumns: " 1fr 1fr 1fr 1fr 1fr", alignItems: "center"}}>
            <div>
                <Checkbox
                    checked={item.checked}
                    onChange={(e) => handle("checked", e.target.checked, item.id)}
                />
            </div>
            {item.discount &&
                <div style={{position: "absolute", color: "red", top: "0px"}}>
                    Знижка:{item.discount}%
                </div>
            }
            <div>
                <p>{item.title}</p>
            </div>
            <div>
                <TextField
                    className={cl.input}
                    type={"number"}
                    label={"К-сть"}
                    value={item?.count ? item.count:''}
                    onChange={(e) => handle("count", e.target.value, item.id)}
                />
            </div>
            <p>
                {item.price}грн
            </p>
            <p>
                {item.suma}грн
            </p>
        </div>
    )
}

export default ItemsList;