import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AvailableTrains from "./Components/AvailableTrains";
import Login from "./Components/Login";
import NavBar from "./Components/NavBar";
import RegistrationForm from "./Components/RegistrationForm";
import Seat from "./Components/Seat";
import Home from "./Home";
import SeatBooking from "./Components/SeatBooking";
import { useEffect, useState } from "react";

const App = () => {
  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/verify", {
        method: "POST",
        headers: { jwtToken: localStorage.jwtToken },
      });

      const parseRes = await res.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
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

  const setAuth = (bool: boolean) => {
    console.log("setAuth called", bool);
    setIsAuthenticated(bool);
  };
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={<RegistrationForm setAuth={setAuth} />}
        />
        <Route path="/contact" element={<h1>Contact</h1>} />
        <Route path="/trains" element={<AvailableTrains />} />
        {/*<Route path="/trains/:id" element={<Seat/>}/>*/}
        <Route path="/trains/:id" element={<SeatBooking />} />
      </Routes>
    </Router>
  );
};

export default App;
