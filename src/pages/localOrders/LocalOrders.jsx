import React, {useEffect, useState} from "react";
import OrderItem from "./components/OrderItem";
import Typography from "@material-ui/core/Typography";



const LocalOrders = () => {

    const[orders, setOrders] = useState([])

    useEffect(() =>{
        const ordersLS = JSON.parse(localStorage.getItem("localOrders"));
        if(ordersLS){
            setOrders(ordersLS);
        }
    },[])
    return (
        <div style={{padding: "10px 20px"}}>
            <div>
                <Typography variant={"h5"} color={"primary"}>
                    Мої замовлення!
                </Typography>
            </div>
            {orders.length > 0 ? orders.map(el =>(
                <OrderItem order={el}/>
            )) :

                <div>
                    <Typography variant={"h5"} color={"primary"}>
                       У вас немає замовлень
                    </Typography>
                </div>
            }
        </div>
    )
}

export default LocalOrders;