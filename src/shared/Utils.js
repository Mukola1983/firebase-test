import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebase";
import moment from "moment";


export const handleGetDoc = async (setValues,valueName,path) =>{
    const itemsRef = collection(db, path)

    const res = await getDocs(itemsRef).catch(e => console.log(e))
    if(res) {
        const items = res.docs.map(el => ({...el.data(), id : el.id}))
            .sort((a, b) => moment(a.date)-moment(b.date)).reverse();

        setValues(prev =>({
            ...prev,
            [valueName]: items
        }))
    }else{
        setValues(prev =>({
            ...prev,
            [valueName]: []
        }))
    }
}

export const checkAdmin = (userId) =>{
    const admins = ["PCcDLGiCbROP99fII1JQ05ukLRH3", "btvlLW7JazTMxHLiLd7aks6rj7o2"]

    return admins?.some(el => el === userId)
}