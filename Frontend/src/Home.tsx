// components/Home.tsx
import { ChangeEvent, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  IconButton,
  InputRightElement,
  InputGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Grid,
  GridItem,
  Button
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import SearchTrains from "./Components/SearchTrains";

// return (
//   <div >
//     <h1>Welcome to My Website</h1>
//     {/* Other content goes here */}
//   </div>
// );

const Home = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleSourceSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedSource(e.target.value);
  }

  const handleDestinationSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedDestination(e.target.value);
  }

  const handleSearch = () => {
    const dateString = selectedDate?.toISOString();
    //navigate(`/trains?date=${dateString}&classType=${selectedOption}&source=${selectedSource}&destination=${selectedDestination}`);
    navigate(`/trains`)
  }

  return (
    <SearchTrains/>
  );
};

export default Home;
