import React, {useState} from "react"
import TextInputComponent from "../../shared/inputs/TextInputComponent";

const LogWithPassMail = () =>{

    const[value, setValue] = useState(null)

    const handleValue = (name, val) =>{
        setValue(prev =>({
            ...prev,
            [name]:val
        }))
    }
    return (
        <div>
            <div>
                <TextInputComponent type={"email"} value={value} setVal={handleValue} name={'email'} label={"Email"} />
            </div>
            <div>
                <TextInputComponent type={"password"} value={value} setVal={handleValue} name={'password'} label={"Password"} />
            </div>
        </div>
    )
}

export default LogWithPassMail;