import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AvailableTrains from "./Components/AvailableTrains";
import Login from "./Components/Login";
import NavBar from "./Components/NavBar";
import RegistrationForm from "./Components/RegistrationForm";
import Seat from "./Components/Seat";
import Home from "./Home";
import SeatBooking from "./Components/SeatBooking";
import { useEffect, useState } from "react";
import Dashboard from "./Components/Dashboard";
import ReservationPage from "./Components/ReservationPage";
import Payment from "./Components/Payment";
import TrainInfo from "./Components/TrainInfo";
import Statistics from "./Components/Statistics";
import Ticket from "./Components/Ticket";

const App = () => {
  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/verify", {
        method: "GET",
        headers: { jwtToken: localStorage.jwtToken },
      });

      const parseRes = await res.json();
      console.log("parseRes:",parseRes);
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
      console.log("isAuthenticated:",isAuthenticated);
      if (parseRes ===true){
        setIsLogged(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const setAuth = (bool: boolean) => {
    console.log("setAuth called", bool);
    setIsAuthenticated(bool);
  };

  const setLogin = (bool: boolean) => { 
    console.log("setLogin called", bool);
    setIsLoginPage(bool);
  }

  const setLogged = (bool: boolean) => {
    console.log("setLogged called", bool);
    setIsLogged(bool);
  }

  return (
    <Router>
      <NavBar isLogged={isLogged} isLoginPage={isLoginPage} setAuth={setAuth} setIsLogged={setIsLogged}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setAuth={setAuth} setLogin={setLogin} setLogged={setLogged}/>} />
        <Route
          path="/register"
          element={<RegistrationForm setAuth={setAuth} />}
        />
        <Route path="/statistics" element={<Statistics/>} />
        <Route path="/trains" element={<AvailableTrains isAuthenticated={isAuthenticated}/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/*<Route path="/trains/:id" element={<Seat/>}/>*/}
       {/*<Route path="/trains/:id/:className" element={isAuthenticated?<SeatBooking />:<Login setAuth={setAuth} setLogin={setLogin} setLogged={setLogged}/>} />*/}
        {/*<Route path="/trains/:id" element={<SeatBooking />} />*/}
        <Route path="/reservation" element={isAuthenticated?<ReservationPage />:<Login setAuth={setAuth} setLogin={setLogin} setLogged={setLogged}/>} />
        <Route path="/payment" element={<Payment/>} />
        <Route path="/TrainInfo" element={<TrainInfo />} />
        <Route path="/Ticket" element={<Ticket />} />
      </Routes>
    </Router>
  );
};

export default App;
