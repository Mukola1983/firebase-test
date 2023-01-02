import React, {useEffect, useRef, useState} from "react"
import {storage} from "../firebase";
import {ref, uploadBytes, listAll, getDownloadURL} from "firebase/storage";
import {v4} from "uuid"

import {auth} from "../firebase"
import {useAuthState} from "react-firebase-hooks/auth";
import {useHistory} from "react-router-dom";
import {Button, Paper, TextField} from "@material-ui/core";


const ImagesInput = () =>{
    const history = useHistory();
    const[value, setValue] = useState(null);
    const[image, setImage] = useState(null);
    const[imagesArr, setImagesArr] = useState([])
    const [user, loading, error] = useAuthState(auth);

    const reFF = useRef(null);

    const metadata = {
        contentType: 'image/jpeg',
    };


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

    function handler(e) {
        let url = URL.createObjectURL(e.target.files[0]);
        setValue(e.target.files[0])
        setImage(url)
        console.log(url)
    }

    useEffect(()=>{
        console.log(value)
    }, [value])


    useEffect(() =>{
        const imageRef = ref(storage,`images/`);

        setImagesArr([])
        listAll(imageRef). then(res =>{
            if(res){
                res.items.forEach(it =>{
                    getDownloadURL(it).then(el=> setImagesArr(prev=>[...prev, el]))
                })
                // setImagesArr(res.items)
            }
        })
    },[])


    return(
        <div style={{padding: "20px 50px", display: "flex", justifyContent: "center"}}>
            <Paper style={{width: "100%"}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-around"}}>
                    <div >
                        <input
                            style={{display: "none"}}
                            type="file"
                            onChange={(e)=> handler(e)}
                            ref={reFF}
                        />
                        <Button onClick={()=> reFF?.current?.click()} variant={"contained"} color={"primary"} size={"small"}>
                            Add Image
                        </Button>
                    </div>
                    <div style={{width: "100px", height: "100px", border: "1px dotted grey"}}>
                        <img src={image} style={{width: "100%" , height: "100%"}} />
                    </div>
                </div>

                <Button onClick={()=> uploadImage()} variant={"contained"} color={"primary"}>
                    upload
                </Button>

                {/*<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "60px"}}>*/}
                {/*    {imagesArr.length>0 && imagesArr.map(el =>(*/}
                {/*        <div>*/}
                {/*            <img src={el} style={{width: "100px", height:"100px"}}/>*/}
                {/*        </div>*/}
                {/*    ))}*/}
                {/*</div>*/}
            </Paper>
        </div>
    )
}

export default ImagesInput;