import React, {useContext, useEffect, useRef, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import {addDoc, doc, updateDoc, collection, query, where, getDocs} from "firebase/firestore"
import makeStyles from "@material-ui/core/styles/makeStyles";
import {ref, uploadBytes} from "firebase/storage";
import {v4} from "uuid";
import moment from "moment";
import {auth, db} from "../../firebase";
import {AppContext} from "../../App";
import TextInputComponent from "../../shared/inputs/TextInputComponent";
import ItemsList from "./ItemsList";

//import {auth, db, storage} from "../../../firebase";



const useStyles = makeStyles((theme) => ({
    input: {
        width: "100%"
    },
    imgBox: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "space-around"
    },
    total:{
        fontWeight: "bold",
        fontSize: "20px",
        color: "blue",
        '@media (max-width: 680px)': {
            fontSize: "18px",
        },
        '@media (max-width: 480px)': {
            fontSize: "16px",
        }
    }
}))

const CreateOrder = ({edit=false, post=null, imagesToEdit=[]}) => {

    const cl = useStyles()

    const [user, loading, error] = useAuthState(auth);
    const {values, setValues} = useContext(AppContext);


    const [value, setValue] = useState({})
    const [check, setCheck] = useState(false);
    const [itemsList, setItemsList] = useState([]);
    const [totalSum, settotalSum] = useState(0)
    const activeUser = localStorage.getItem("activeUser")? JSON.parse(localStorage.getItem("activeUser")):null


    useEffect(()=>{
        if(values.items){
            const list = values.items.map(el => ({...el, checked:false, count:null, suma: 0}))
            setItemsList(list)
        }
    },[])

    const handleVal = (name, val) => {
        if(!check){
            setCheck(true)
        }
        setValue(prev => ({
            ...prev,
            [name]: val
        }))
    }

    const handleList = (name, val, id) =>{

        const list = itemsList.reduce((ac, cur) =>{
           if(cur.id===id){
               const newItem = {...cur, [name]:val}
               return [...ac, newItem]
           }else{
               return [...ac, cur]
           }
        },[])

        setItemsList(list)
    }

    useEffect(() =>{
        const total = itemsList.filter(el=> el.checked).reduce((ac,cur) =>{
            return ac + cur.suma
        },0)
        settotalSum(total)
    },[itemsList])


    const createPost = async () => {

        const ordersRef = collection(db, "orders")

        const orders = itemsList.filter(el => el.checked).map(el => (
            {
                name: el.title,
                price: el.price,
                count: el.count,
                suma: el.suma
            }))


        if(value.name && value.phone ){
            const data = {
                note: value.note,
                name: value.name,
                surname: value.surname,
                phone: value.phone,
                date:moment(Date.now()).format(),
                mail: value.mail,
                userId: user?.uid ? user?.uid : '',
                userName: user?.displayName ? user?.displayName : '',
                userImg: user?.photoURL ? user?.photoURL : "",
                items: orders,
                totalSum: totalSum,
                checked:false,
                finished: false,
            }
            if(edit){
                // const updateRef = doc(db, "posts", post.id);
                // await updateDoc(updateRef, data)
            }else{
                if(activeUser) {
                    const userRef = collection(db, "users");
                    const userDoc = query(userRef, where("uiD", "==", activeUser['uiD']))
                    const res = await getDocs(userDoc).catch(e => console.log(e));

                    const existUser = res.docs.map(el => ({...el.data(), id: el.id}))

                    const updateRef = doc(db, "users", existUser[0].id);

                    const userData = {
                        ...activeUser,
                        orders: [...existUser[0].orders, data]
                    }
                    await updateDoc(updateRef, userData)
                }

                const storageOrders = JSON.parse(localStorage.getItem("localOrders"))
                const locOrders = storageOrders ? [...storageOrders, data] : [data]
                localStorage.setItem("localOrders", JSON.stringify(locOrders))
                const order = await addDoc(ordersRef, data).catch(e => console.log(e));
                if (order){
                    setValues(prev =>({
                        ...prev,
                        openAlert: true,
                        alertType: "success",
                        alertMassage: "???????????????????? ????????????????!!",
                        openDialog: false,
                    }))
                }
            }
        }else{
            setValues(prev =>({
                ...prev,
                openAlert: true,
                alertMassage: "???????????????? ?????????????? ?????? ?? ?????????? ????????????????!"
            }))
        }
    }



    return (
        <div style={{padding: "20px"}}>
            <Paper style={{minHeight: "60vh", padding: "20px"}}>

                <div>
                    <p> ???????????? ???????????????? ?????? ?? ?????????????? ?? ???? ?????? ????????????????????????)</p>
                </div>
                <div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} name={'name'} label={"??????"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} name={'surname'} label={"????????????????"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} name={'phone'} label={"??????????????"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} name={'mail'} label={"Email"} setVal={handleVal} />
                    </div>
                    <div style={{marginBottom: "10px"}}>
                        <TextInputComponent style={cl.input} value={value} multiline={true} name={'note'} label={"??????????????"} setVal={handleVal} />
                    </div>
                    <div style={{maxHeight: "200px", overflowY: "auto"}}>
                        {itemsList.length >0 && itemsList.map(el =>(
                            <ItemsList item={el} handle={handleList}/>
                        ))}
                    </div>

                    <div className={cl.total}>
                        ???????? ???????????????????? : {totalSum} ??????.
                    </div>

                    <div>
                        <Button variant={"contained"} color={"primary"} onClick={createPost}>
                            {edit ?  "????????????????????" : "????????????????"}
                        </Button>
                    </div>
                </div>
            </Paper>
        </div>

    )
}

export default CreateOrder;