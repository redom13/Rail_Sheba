import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Input, VStack, Text, HStack, Button, Flex, List, ListItem, Spacer } from "@chakra-ui/react";

type Train = {
  TRAIN_ID: number;
  TRAIN_NAME: string;
};

type Station = {
  STATION_NAME: string;
  ARR_TIME: string;
  DEPT_TIME: string;
};

const TrainInfo = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Train[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  const fetchTrains = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/trains/all/trains/details"
      );
      setTrains(response.data.data.rows);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  useEffect(() => {
    if (search === "") {
      setSuggestions([]);
    } else {
      setSuggestions(
        trains.filter((train) =>
          train.TRAIN_NAME.toLowerCase().startsWith(search.toLowerCase())
        )
      );
    }
  }, [search, trains]);

  const handleSuggestionClick = (suggestion: Train) => {
    setSearch(`${suggestion.TRAIN_NAME} (${suggestion.TRAIN_ID})`);
  };

  const searchStation = async (trainId: number) => {
    console.log(trainId);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/stations/${trainId}`
      );
      console.log(response.data);
      setStations(response.data);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    }
  };

  return (
    <Flex>
    <VStack spacing={0} align="start" w="300px">
      <Text fontSize="2xl">Train Info</Text>
      <HStack spacing={4}>
        <Input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Enter train name" 
          w="300px" // Set the width to 300px
        />
        <Button 
          colorScheme="teal" 
          onClick={() => {
            const trainId = search.match(/\((\d+)\)/)?.[1]; // Extract the train ID from the search string
            if (trainId) {
              searchStation(parseInt(trainId)); // Pass the train ID to the searchStation function
            }
          }}
        >
          Search Train
        </Button>
      </HStack>
      <VStack borderWidth="1px" shadow="md">
        {suggestions.map((suggestion) => (
          <Box 
            key={suggestion.TRAIN_ID}
            onClick={() => handleSuggestionClick(suggestion)}
            cursor="pointer"
            p={0}
            w="300px" // Set the width to 300px, same as the Input component
            margin={0}
            _hover={{ bg: "lightgreen" }}
          >
            <Text fontSize="lg" mb={0}>{suggestion.TRAIN_NAME} ({suggestion.TRAIN_ID})</Text>
          </Box>
        ))}
      </VStack>
    </VStack>
    <Spacer/>
    <VStack spacing={0} align="start" w="300px" ml={4}>
      <Text fontSize="2xl">Station Info</Text>
      <List spacing={1}>
        {stations.map((station, index) => (
          <ListItem key={index} borderWidth="1px" p={1}>
            <Text>Station Name: {station.STATION_NAME}</Text>
            <Text>Arrival Time: {station.ARR_TIME}</Text>
            <Text>Departure Time: {station.DEPT_TIME}</Text>
          </ListItem>
        ))}
      </List>
    </VStack>
  </Flex>
  );
};

export default TrainInfo;
