import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  ChakraProvider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Select,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function SearchTrains() {
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [className, setClassName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission, e.g., make API call to fetch train data
    // console.log("From Station:", fromStation);
    // console.log("To Station:", toStation);
    // console.log("Date:", selectedDate);
    // console.log("Class:", className);
    navigate(`/trains`,{state: {
      fromStation,
      toStation,
      selectedDate,
      className
    }});

  };
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={20}
      p={5}
      borderWidth="1px"
      borderRadius="md"
      position="relative"
      //top="80%"
      right="20%"
      bottom="80%"
      width={500}
      boxShadow="lg"
    >
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>From</FormLabel>
          <Input
            type="text"
            placeholder="From station"
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>To</FormLabel>
          <Input
            type="text"
            placeholder="To station"
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Date of Journey</FormLabel>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MM/dd/yyyy"
            placeholderText="Pick a date"
            className="form-control"
          ></DatePicker>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Class</FormLabel>
          <Select
            placeholder="Select class"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          >
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="firstClass">First Class</option>
          </Select>
        </FormControl>
        <Button colorScheme="teal" type="submit" width="100%">
          Search Trains
        </Button>
      </form>
    </Box>
  );
}

export default SearchTrains;
