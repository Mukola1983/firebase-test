import React, {useEffect, useState} from "react"
import {storage} from "../firebase";
import {ref, uploadBytes, listAll, getDownloadURL} from "firebase/storage";
import {v4} from "uuid"

import {auth} from "../firebase"
import {useAuthState} from "react-firebase-hooks/auth";
import {useHistory} from "react-router-dom";


const ImagesInput = () =>{
    const history = useHistory();
    const[value, setValue] = useState(null);
    const[imagesArr, setImagesArr] = useState([])
    const [user, loading, error] = useAuthState(auth);


    useEffect(() =>{
        if(!user){
            history.push('/login')
        }
    },[])

    const uploadImage = () =>{
        console.log(value)
        if(!value) return;
        const imageRef = ref(storage,`images/${value.name + v4()}`);
        uploadBytes(imageRef, value).then(res => console.log(res))
    }
    const handler = (e) =>{
        console.log(e.target.files[0])
        setValue(e.target.files[0])
    }

    useEffect(() =>{
        const imageRef = ref(storage,`images/`);

        listAll(imageRef). then(res =>{
            if(res){
                res.items.forEach(it =>{
                    getDownloadURL(it).then(el=> setImagesArr(prev=>[...prev, el]))
                })
                // setImagesArr(res.items)
            }
        })
    },[])

    useEffect(()=>{
        console.log(v4())
    }, [imagesArr])
    return(
        <div>
            <input type="file"  onChange={(e)=> handler(e)}/>
            <button onClick={()=> uploadImage()}>upload</button>
            {imagesArr.length>0 && imagesArr.map(el =>(
                <div>
                    <img src={el} style={{width: "40px", height:"40px"}}/>
                </div>
            ))}
        </div>
    )
}

export default ImagesInput;