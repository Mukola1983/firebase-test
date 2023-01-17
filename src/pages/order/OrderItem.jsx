import React, {useContext, useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import moment from "moment";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {AppContext} from "../../App";

export const useStyles = makeStyles((theme) => ({
    ordersBox:{
        overflow: "hidden",
        transition: "0.4s"
    },
    paper: {
        margin: "20px",
        textAlign: "center",
        backgroundColor: props => props.checked ? "" : "rgba(180, 180, 180, 0.5)"
    },
    checkedTitle:{
        color: "red",
        fontWeight: "bold",
        fontSize: "25px",
        '@media (max-width: 680px)': {
            fontSize: "15px",
        },
        '@media (max-width: 480px)': {
            fontSize: "15px",
        }
    },
    accordeon:{
        backgroundColor: props => props.checked ? "" : "rgba(180, 180, 180, 0.5)"

    },
    titleBox:{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        fontSize: "30px",
        '@media (max-width: 680px)': {
            fontSize: "25px",
        },
        '@media (max-width: 480px)': {
            fontSize: "15px",
        }
    },
    innerTitle:{
        display: "flex",
        justifyContent: "space-around",
        color: "blue",
        fontWeight: "bold",
        fontSize: "35px",
        '@media (max-width: 680px)': {
            fontSize: "25px",
        },
        '@media (max-width: 480px)': {
            fontSize: "20px",
        }
    },
    details:{
        width: "100%"
    },
    orders:{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap"
    },
    orderElement:{
        border: "1px solid green",
        flex: "1 1 40%"
    }
}))

//    color: (props) => props.salary ? "green" : "red"minHeight

const OrderItem = ({order}) =>{


    const [openOrder, setOpenOrder] = useState(false);
    const {values, setValues} = useContext(AppContext);


    const cl = useStyles({checked: order.checked})


    const openCloseOrder =  async () =>{
        setOpenOrder(prev => !prev);
        await setOrderChecked();
        setValues(prev =>({
            ...prev,
            refreshOrders: true
        }))
    }


    const setOrderChecked = async () =>{
        if(order && !order.checked) {
            const data = {
                note: order.note,
                name: order.name,
                surname: order.surname,
                phone: order.phone,
                date:order.date,
                mail: order.mail,
                userId: order.userId,
                userName: order.userName,
                userImg: order.userImg,
                items: order.items,
                checked:true
            }
            const updateRef = doc(db, "orders", order.id);
            await updateDoc(updateRef, data).catch(e => console.log(e))
        }
    }
    return (
        <Paper className={cl.paper}>
            {!order.checked &&
                <p  className={cl.checkedTitle}>Нове Замовлення!</p>
            }
            <Accordion className={cl.accordeon}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}  onClick={openCloseOrder}>
                    <div className={cl.titleBox}>
                        <p>
                            Замовлення від:
                        </p>
                        <p style={{color: "green"}}>
                            {order.surname} {order.name}
                        </p>
                    </div>
                </AccordionSummary>
                <AccordionDetails  expanded={openOrder}  >

                    <div className={cl.details}>
                        <div>
                            <div>
                                <p className={cl.innerTitle}>
                                    Імя клієнта : <span style={{color: 'green'}}>{order.surname} {order.name}</span>
                                </p>
                            </div>
                            <div>
                                <p className={cl.innerTitle}>
                                    Телефон : <span style={{color: 'green'}}>{order.phone}</span>
                                </p>
                            </div>
                            <div>
                                <p className={cl.innerTitle}>
                                    Е-пошта : <span style={{color: 'green'}}> {order.mail}</span>
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className={cl.innerTitle} >
                                Товари
                            </p>
                            <div className={cl.orders}>
                                {order?.items?.length > 0 && order.items.map((el,ind) =>(
                                    <div key={ind} className={cl.orderElement}>
                                        <p>Назва товару: {el.name}</p>
                                        <p>К-сть: {el.count}</p>
                                        <p>Ціна: {el.price}</p>
                                        <p>Сума: {el.suma}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                Сума Замовлення : {order.totalSum}
                            </div>
                        </div>
                    </div>

                </AccordionDetails>
            </Accordion>
        </Paper>
    )
}


export default OrderItem;