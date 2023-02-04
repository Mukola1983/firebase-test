import {collection, getDocs} from "firebase/firestore";
import {db, storage} from "../firebase";
import moment from "moment";
import {v4} from "uuid";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";


export const handleGetDoc = async (setValues,valueName,path) =>{
    const itemsRef = collection(db, path)

    const res = await getDocs(itemsRef).catch(e => console.log(e, valueName))
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


export const setEditImages = async (imgs, post, setImages , setImgToSend) =>{
    for(let i = 0; i < imgs.length; i++) {
        const id = v4()
        await setImages(prev => ([...prev, {img: imgs[i], id: id}]));
        await setImgToSend(prev => ([...prev, {img: post?.images[i], id:id}]));

    }
}

export const removeImageData =async (imgToSend, images, setImgToSend, setImages, createPost, id) =>{
    const imgSend = imgToSend.filter(el => el.id !== id)
    const imgToShow = images.filter(el => el.id !== id)
    await setImgToSend(imgSend);
    await setImages(imgToShow);
    await createPost(imgSend);
}

export  const  addImageHandler = (e, setImgToSend, setImages , setValues) => {
    const img = e.target.files[0];
    if(img.size < 1000000) {
        const id = v4()
        let url = URL.createObjectURL(img);
        setImgToSend(prev => ([...prev, {img: img, id:id}]));

        setImages(prev => ([...prev, {img:{url:url, path:''}, id:id}]));
    }else{
        setValues(prev =>({
            ...prev,
            openAlert: true,
            alertMassage: "Фото повинно займати менше 1mb!"
        }))
    }
}

export const imageRefObject = async (url, imgToSendLoc,) =>{
    const imageRef = ref(storage, `${url}/${imgToSendLoc.img.name + v4()}`);
    const imgRes = await uploadBytes(imageRef, imgToSendLoc.img)
        .catch(e => console.log(e));
    const img = await getDownloadURL(ref(storage, imgRes?.metadata?.fullPath))
        .catch(e => console.log(e));
    return {path: img, metaData:imgRes?.metadata?.fullPath }
}