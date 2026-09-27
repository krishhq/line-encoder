import {useEffect, useState} from "react";
import Graph from "../logic/Graph.jsx";
import Input from "../ui/Input.jsx";

function Hero(){
    let [info,setInfo]=useState({
        databits:"",
        encoding:""
    });
    let updateInfo=(newInfo)=>setInfo(newInfo);
    return(
        <div>
            <Input info={updateInfo}/>
            <Graph/>
        </div>
    );
}

export default Hero;