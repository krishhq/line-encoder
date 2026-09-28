import {useEffect, useState} from "react";
import Graph from "./Graph.jsx";
import Input from "../ui/Input.jsx";

function Hero(){
    let [info,setInfo]=useState({
        databits:"",
        encoding:""
    });
    let updateInfo=(newInfo)=>{
        setInfo(newInfo);
    }
    // console.log("hero section",info);
    return(
        <div>
            <div className="container">
                <h1>Line Encoder</h1>
            </div>
            <div className="container">
                <Input updateInfo={updateInfo}/>
                <Graph info={info}/>
            </div>
        </div>
    );
}

export default Hero;