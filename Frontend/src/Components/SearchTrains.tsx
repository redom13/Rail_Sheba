import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
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
        suggestion.toLowerCase().includes(input.toLowerCase()) &&
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
    <Box maxW="md" mx="auto" mt={20} p={5} borderWidth="1px" borderRadius="md" width={500} boxShadow="lg">
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
            <ul>
              {fromSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() => handleFromSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
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
            <ul>
              {toSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() => handleToSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
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
  );
}

export default SearchTrains;
