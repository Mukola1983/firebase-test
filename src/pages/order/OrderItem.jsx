import React, {useContext, useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {deleteDoc, doc, updateDoc} from "firebase/firestore";
import {auth, db} from "../../firebase";
import moment from "moment";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {AppContext} from "../../App";
import {checkAdmin} from "../../shared/Utils";
import {LightTooltip} from "../../shared/TooltipComponent";
import {IconButton} from "@material-ui/core";
import BackspaceIcon from "@material-ui/icons/Backspace";
import EditIcon from "@material-ui/icons/Edit";
import {useAuthState} from "react-firebase-hooks/auth";
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import Checkbox from "@material-ui/core/Checkbox";

export const useStyles = makeStyles((theme) => ({
    ordersBox:{
        overflow: "hidden",
        transition: "0.4s"
    },
    paper: {
        position: "relative",
        margin: "20px",
        textAlign: "center",
        backgroundColor: props => props.checked ? "rgba(180, 180, 180, 0.2)" : "rgba(180, 180, 180, 0.5)"
    },
    checkedTitle:{
        position: "absolute",
        right: "20px",
        top: "0",
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
        flex: "0 0 40%",
        fontSize: "25px",
        marginBottom: "10px",
        '@media (max-width: 680px)': {
            minWidth: "300px",
            fontSize: "20px",
        },
        '@media (max-width: 480px)': {
            minWidth: "200px",
            fontSize: "18px",
        }
    },
    total:{
        color: "green",
        fontSize: "25px",
        '@media (max-width: 680px)': {
            fontSize: "20px",
        },
        '@media (max-width: 480px)': {
            fontSize: "18px",
        }
    },
    delIcons:{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: "15px"
    },
    status: {
        display: "flex",
        alignItems: "center",
        color: "blue",
        fontWeight: "bold",
        justifyContent: "center",
        fontSize: "35px",
        '@media (max-width: 680px)': {
            fontSize: "25px",
        },
        '@media (max-width: 480px)': {
            fontSize: "20px",
        }
    }
}))

//    color: (props) => props.salary ? "green" : "red"minHeight

const OrderItem = ({order}) =>{

    const [user, loading, error] = useAuthState(auth);
    const [openOrder, setOpenOrder] = useState(false);
    const {values, setValues} = useContext(AppContext);
    const[load, setLoad] = useState(false)


    const cl = useStyles({checked: order.checked})


    const openCloseOrder =  async () =>{
        setOpenOrder(prev => !prev);
        await setOrderChecked();
        setValues(prev =>({
            ...prev,
            refreshOrders: true
        }))
    }

    const handleSendData = (name, val) =>{
           return  {
                ...order,
                [name]: val
            }
    }


    const setOrderChecked = async () =>{
        setLoad(true);
        if(order && !order.checked) {

            const data = handleSendData("checked", true)

            const updateRef = doc(db, "orders", order.id);
            await updateDoc(updateRef, data).catch(e => console.log(e))
        }
        setLoad(false);

    }

    const handleFinished =async (e) =>{
        setLoad(true);

        const data = handleSendData("finished", e.target.checked)

        const updateRef = doc(db, "orders", order.id);
        await updateDoc(updateRef, data).catch(e => console.log(e));
        setValues(prev =>({
            ...prev,
            refreshOrders: true
        }))
        setLoad(false);

    }

    const deleteDocument = async (order) =>{
        setValues(prev =>({
            ...prev,
            loading:true
        }))
        await deleteDoc(doc(db, "orders", order.id))
            .catch(e => {
                console.log(e)
                setValues(prev =>({
                    ...prev,
                    openAlert: true,
                    alertMassage: e.message
                }))
            });

        setValues(prev => ({
            ...prev,
            refreshOrders: true,
            openAlert: true,
            alertMassage: "Замовлення видалений!",
            loading:false
        }))
    }

    return (
        <Paper className={cl.paper} elevation={8}>
            {user && checkAdmin(user?.uid) &&
                <div className={cl.delIcons}>
                    <LightTooltip title={"Видалити амовлення!"}>
                        <IconButton onClick={() => deleteDocument(order)}>
                            <BackspaceIcon/>
                        </IconButton>
                    </LightTooltip>
                   <div className={cl.delIcons}>
                       <p>Дата ст:</p>
                       <p>
                           {moment(order.date).format("yyyy-MM-DD")}
                       </p>
                   </div>
                </div>
            }
            {!order.checked &&
                <div className={cl.checkedTitle}>Нове Замовлення!</div>
            }
            {order.finished &&
                <div className={cl.checkedTitle}>
                    <LightTooltip title={"Замовлення виконане!"}>
                        <DoneOutlineIcon style={{color: "green"}}/>
                    </LightTooltip>
                </div>
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
                            <div className={cl.status}>
                                <Checkbox
                                    disabled={load}
                                    checked={order?.finished}
                                    style={{color: "green"}}
                                    onChange={(e)=> handleFinished(e)}
                                />
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <p> Статус замовлення :</p>
                                    <p style={{color:order?.finished? "green": "red" }}>
                                        {order?.finished ? " Виконано":" В обробці"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className={cl.innerTitle} >
                                Товари
                            </p>
                            <div className={cl.orders} style={{flexWrap: "wrap"}}>
                                {order?.items?.length > 0 && order.items.map((el,ind) =>(
                                    <div key={ind} className={cl.orderElement}>
                                        <p>Назва товару: {el.name}</p>
                                        <p>К-сть: {el.count}</p>
                                        <p>Ціна: {el.price}</p>
                                        <p>Сума: {el.suma}</p>
                                    </div>
                                ))}
                            </div>
                            <div className={cl.total}>
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