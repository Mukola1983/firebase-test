import React, {useContext, useEffect, useState} from 'react';
import {Alert} from "@material-ui/lab";
import {Snackbar} from "@material-ui/core";
import {AppContext} from "../App";




const AlertComponent = () => {


    const {values, setValues} = useContext(AppContext);


    const [openAllert, setOpenAllert] = useState(false);
    const [message, setMessage] = useState('');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setValues(prev =>({
            ...prev,
            openAlert: false,
            alertType: "error"
        }))
    };

    return (
        <Snackbar open={values.openAlert} autoHideDuration={3000} onClose={handleClose}
                  anchorOrigin= {{ vertical: 'top', horizontal: 'right' }}>
            <Alert  onClose={handleClose} severity={values.alertType}>
                <p style={{fontSize:"17px", color: "palevioletred", }}>
                    {values.alertMassage}
                </p>
            </Alert>
        </Snackbar>
    )
}

export default AlertComponent;