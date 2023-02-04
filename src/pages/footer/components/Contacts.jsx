import React, {useContext} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebase";
import {AppContext} from "../../../App";
import {makeStyles} from "@material-ui/core/styles";
import FooterContItem from "./FooterContItem";


const useStyles = makeStyles((theme) => ({
    root:{
        margin: "10px"
    },
    title:{
        fontSize: "30px",
        fontWeight: "bold",
        color: "green",
        textAlign: "center"
    }

}))


const Contacts = () =>{
    const [user, loading, error] = useAuthState(auth);
    const cl = useStyles();
    const {values, setValues} = useContext(AppContext);
    return (
        <div>
            <div>
                Контакти :
            </div>
            {values.contacts.length > 0  && values.contacts.map(el =>(
                <div  key={el.id}>
                    <FooterContItem contact={el}/>
                </div>
            ))}
        </div>
    )
}

export default Contacts