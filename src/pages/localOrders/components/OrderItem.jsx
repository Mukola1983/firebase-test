import React, {useContext, useState} from "react"
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Paper from "@material-ui/core/Paper";
import {AppContext} from "../../../App";
import {useStyles} from "../../order/OrderItem";


const OrderItem = ({order}) => {

    const [openOrder, setOpenOrder] = useState(false);


    const cl = useStyles({checked: order.checked})


    const openCloseOrder =  async () =>{
        setOpenOrder(prev => !prev);
    }
    return (
        <Paper className={cl.paper}>
            <Accordion className={cl.accordeon}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>} onClick={openCloseOrder}>
                    <div className={cl.titleBox}>
                        <p>
                            Замовлення від:
                        </p>
                        <p style={{color: "green"}}>
                            {order.surname} {order.name}
                        </p>
                    </div>
                </AccordionSummary>
                <AccordionDetails expanded={openOrder}>

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
                            <p className={cl.innerTitle}>
                                Товари
                            </p>
                            <div className={cl.orders}>
                                {order?.items?.length > 0 && order.items.map((el, ind) => (
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