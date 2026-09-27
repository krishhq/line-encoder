import {useState, useEffect} from "react";
// import Plotly from "plotly.js";
// import Chart from "chart.js";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Graph(){
    

    return(
        <div className="container">
            <h1>Graph</h1>
        </div>
    );
}

export default Graph;