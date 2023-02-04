import React, {useEffect, useState} from "react";
import OrderItem from "./components/OrderItem";
import Typography from "@material-ui/core/Typography";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../../firebase";



const LocalOrders = () => {

    const[orders, setOrders] = useState([])

    const activeUser = localStorage.getItem("activeUser")? JSON.parse(localStorage.getItem("activeUser")):null
    const ordersLoc = async (activeUser) =>{
        if(activeUser) {
            const userRef = collection(db, "users");
            const userDoc = query(userRef, where("uiD", "==", activeUser['uiD']))
            const res = await getDocs(userDoc).catch(e => console.log(e));

            return res.docs.map(el => ({...el.data(), id: el.id}))
        }

    }

    useEffect(() =>{
        if(activeUser) {
            ordersLoc(activeUser).then(res => {

                if (res) {
                    setOrders(res?.[0].orders);
                }
            })
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