import React from "react";
import {Route, Switch} from "react-router-dom";
import Main from "./main/Main";
import Login from "./Login";


const Test = () =>{

    return(
        <div>
            <Switch>
                <Route path={"/"} exact component={Main}/>
                <Route path={"/login"}  component={Login}/>
            </Switch>
        </div>
    )
}

export default Test