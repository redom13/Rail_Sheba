import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AvailableTrains from "./Components/AvailableTrains"
import Login from "./Components/Login"
import NavBar from "./Components/NavBar"
import RegistrationForm from "./Components/RegistrationForm"
import Seat from "./Components/Seat"
import Home from "./Home"
import SeatBooking from "./Components/SeatBooking";

const App=()=>{
  return(
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<RegistrationForm/>}/>
        <Route path="/contact" element={<h1>Contact</h1>}/>
        <Route path="/trains" element={<AvailableTrains/>}/>
        {/*<Route path="/trains/:id" element={<Seat/>}/>*/}
        <Route path="/trains/:id" element={<SeatBooking/>}/>
      </Routes>
    </Router>
  )
}

export default App
