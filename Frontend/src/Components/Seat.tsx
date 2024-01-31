import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

type train = {
    TRAIN_ID: number;
    TRAIN_NAME: string;
  };


const Seat = () => {
    const {id} = useParams();
    //console.log(id)
    const [trains,setTrains] = useState<train[]>([]);
    const trainDetails= ()=>{
        console.log("train details called")
        axios.get(`http://localhost:5000/api/v1/trains/${id}`)
        .then((response)=>{
            console.log(response.data);
            setTrains(response.data.data);
            console.log("Train name:"+trains[0].TRAIN_NAME)
            //console.log(train?.name);
        }).catch((error)=>{
            console.log(error);
        })
    }
    useEffect(() => {
        trainDetails();
    }, [])
    // useEffect(() => {
    //     console.log(trains[0].train_name);
    // }, [trains])
  return (
    <div>
        <h1>Seat of {trains[0]?.TRAIN_NAME}</h1>
        
        </div>
  )
}

export default Seat