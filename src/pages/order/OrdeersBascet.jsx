import React, {useContext, useEffect, useState} from "react"
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../firebase";
import {AppContext} from "../../App";
import {collection, getDocs} from "firebase/firestore";
import OrderItem from "./OrderItem";
import {checkAdmin, handleGetDoc} from "../../shared/Utils";
import {useHistory} from "react-router-dom";



const OrdersBasket = () =>{
    const [user, loading, error] = useAuthState(auth);
    // const cl = useStyles();
    const {values, setValues} = useContext(AppContext);
    const history = useHistory();


    useEffect(() =>{
        if(!checkAdmin(user?.uid)){
            history.push('/')
        }
    },[user])
    useEffect(() =>{
        handleGetDoc(setValues,"orders", "orders");
        setValues(prev =>({
            ...prev,
            refreshOrders: false
        }))
    },[values.refreshOrders])



    return (
        <div>
            {values.orders.length > 0 && values.orders.map(el =>(
                <OrderItem key={el.id} order={el}/>
            ))}
        </div>
    )
}

export default OrdersBasket