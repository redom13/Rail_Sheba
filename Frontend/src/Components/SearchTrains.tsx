import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Portal,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import backgroundImage from "../trainImg3.jpg";

function SearchTrains() {
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [className, setClassName] = useState("");
  const [stations, setStations] = useState<string[]>([]);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/trains`, {
      state: {
        fromStation,
        toStation,
        selectedDate,
        className,
      },
    });
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const getStations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/stations");
      const tmp = res.data.map((station: any) => station.STATION_NAME);
      setStations(tmp);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    }
  };

  const filterSuggestions = (input: string, suggestions: string[]) => {
    return suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().startsWith(input.toLowerCase()) &&
        suggestion !== input
    );
  };

  const handleFromInputChange = (input: string) => {
    setFromStation(input);
    setFromSuggestions(input ? filterSuggestions(input, stations) : []);
  };

  const handleToInputChange = (input: string) => {
    setToStation(input);
    setToSuggestions(input ? filterSuggestions(input, stations) : []);
  };

  const handleFromSuggestionClick = (suggestion: string) => {
    setFromStation(suggestion);
    setFromSuggestions([]);
  };

  const handleToSuggestionClick = (suggestion: string) => {
    setToStation(suggestion);
    setToSuggestions([]);
  };

  useEffect(() => {
    getStations();
  }, []);

  return (
    <div
    style={
      {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }
    }
    >
    <Box
      maxW="md"
      mx="auto"
      ml={20} 
      mt={20}
      p={5}
      borderWidth="1px"
      borderRadius="md"
      width={500}
      boxShadow="lg"
      bg="rgba(255, 255, 255,0.85)"
    >
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>From</FormLabel>
          <Input
            type="text"
            placeholder="From station"
            value={fromStation}
            onChange={(e) => handleFromInputChange(e.target.value)}
          />
          {fromSuggestions.length > 0 && (
            <VStack align="start" spacing={1}>
              {fromSuggestions.map((suggestion) => (
                <Box
                  key={suggestion}
                  onClick={() => handleFromSuggestionClick(suggestion)}
                  p={1}
                  borderRadius="md"
                  _hover={{ bg: "gray.200", cursor: "pointer" }}
                  w="100%"
                >
                  {suggestion}
                </Box>
              ))}
            </VStack>
          )}
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>To</FormLabel>
          <Input
            type="text"
            placeholder="To station"
            value={toStation}
            onChange={(e) => handleToInputChange(e.target.value)}
          />
          {toSuggestions.length > 0 && (
            <VStack align="start" spacing={1}>
              {toSuggestions.map((suggestion) => (
                <Box
                  key={suggestion}
                  onClick={() => handleToSuggestionClick(suggestion)}
                  p={1}
                  borderRadius="md"
                  _hover={{ bg: "gray.200", cursor: "pointer" }}
                  w="100%"
                >
                  {suggestion}
                </Box>
              ))}
            </VStack>
          )}
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Date of Journey</FormLabel>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MM/dd/yyyy"
            placeholderText="Pick a date"
            className="form-control"
            minDate={new Date()}
            maxDate={new Date(new Date().setDate(new Date().getDate() + 10))}
          ></DatePicker>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Class</FormLabel>
          <Select
            placeholder="Select class"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          >
            <option value="economy">AC_S</option>
            <option value="business">SNIGDHA</option>
            <option value="firstClass">S_CHAIR</option>
          </Select>
        </FormControl>
        <Button colorScheme="teal" type="submit" width="100%">
          Search Trains
        </Button>
      </form>
    </Box>
    </div>
  );
}

export default SearchTrains;
