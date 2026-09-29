import {useState, useEffect} from "react";
// import Chart from "chart.js";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {sampleSizeArr} from "../logic/input";

ChartJS.register(ArcElement, Tooltip, Legend);

function Graph({info, graphData}){
    console.log("info: ", info);
    console.log("graphData: ", graphData);
    
    return(
        <div className="container">
            <h1>Graph</h1>
        </div>
    );
}

export default Graph;