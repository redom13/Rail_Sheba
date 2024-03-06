import axios from "axios";
import { set } from "lodash";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// type train = {
//     train_id: Number;
//     train_name: string;
//     };

type station = {
  station_id: Number;
  station_name: string;
  arrival_time: string;
  departure_time: string;
};

const TrainInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [train, setTrain] = useState({
    train_id: 0,
    train_name: "",
  });
  const [stations, setStations] = useState<station[]>([]);
  
  useEffect(() => {
    const { train_id, train_name } = location.state;
    setTrain({ train_id, train_name });
  }, []);

  async function getStations() {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/stations/${train.train_name}`);
        console.log(res.data);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    }
  }
  return (
    <div>
      <h1>Train Info</h1>
    </div>
  );
};

export default TrainInfo;
