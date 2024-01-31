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
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh",
    }} 
    >
    <Box p={4} width="400px">
      <FormControl>
        <FormLabel>From Station</FormLabel>
        <Input type="text" placeholder="From" />
      </FormControl>
      <FormControl>
        <FormLabel>To Station</FormLabel>
        <Input type="text" placeholder="To" />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Choose a Class</FormLabel>
        <Select value={selectedOption} onChange={handleOptionChange}>
          <option value="option1">S_CHAIR</option>
          <option value="option2">Snigdha</option>
          <option value="option3">AC_B</option>
        </Select>
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Date of Journey</FormLabel>
        <InputGroup>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MM/dd/yyyy"
            placeholderText="Pick a date"
            className="form-control"
          ></DatePicker>
        </InputGroup>
      </FormControl>
      <Button colorScheme="teal" width="100%" mt={4} onClick={handleSearch}>Search Trains</Button>
    </Box>
    
    </div>
  );
};

export default Home;
