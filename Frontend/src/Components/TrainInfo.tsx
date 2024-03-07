import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosSubway } from 'react-icons/io';
import {
  Box,
  Input,
  VStack,
  Text,
  HStack,
  Button,
  Flex,
  List,
  ListItem,
  Spacer,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  ListIcon,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon, TimeIcon, ArrowRightIcon } from "@chakra-ui/icons";

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
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

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
    setSelectedTrain(suggestion);
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

  const boxBg = useColorModeValue("gray.200", "gray.700");

  return (
    <Flex justifyContent="center">
      <VStack spacing={4} align="start" w="300px" p={4}>
        <Heading size="sm">Select your prefered train</Heading>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter train name"
          />
        </InputGroup>
        <Button
          colorScheme="teal"
          onClick={() => {
            const trainId = search.match(/\((\d+)\)/)?.[1]; // Extract the train ID from the search string
            if (trainId) {
              const train = trains.find(
                (train) => train.TRAIN_ID === parseInt(trainId)
              );
              setSelectedTrain(train || null);
              searchStation(parseInt(trainId));
              setIsButtonClicked(true); // Pass the train ID to the searchStation function
            }
          }}
        >
          Search Train
        </Button>
        <VStack borderWidth="1px" shadow="md" bg={boxBg} ml={0}>
          {suggestions.map((suggestion) => (
            <Box
              w="100%"
              key={suggestion.TRAIN_ID}
              onClick={() => handleSuggestionClick(suggestion)}
              cursor="pointer"
              p={2}
              _hover={{ bg: "teal.200" }}
            >
              <Text fontSize="md">
                {suggestion.TRAIN_NAME} ({suggestion.TRAIN_ID})
              </Text>
            </Box>
          ))}
        </VStack>
      </VStack>
      <Spacer />
      <VStack spacing={2} align="start" w="1000px" ml={4} mt={10}>
        {isButtonClicked && (
          <Heading size="lg" mt={1}>
            {selectedTrain
              ? `${selectedTrain.TRAIN_NAME} (${selectedTrain.TRAIN_ID})`
              : "Station Info"}
          </Heading>
        )}
        <Box
          borderWidth="1px"
          mt={0}
          shadow="md"
          bg={boxBg}
          p={4}
          w="80%"
          mr={4}
        >
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th>Station Name</Th>
                <Th>Arrival Time</Th>
                <Th>Departure Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stations.map((station, index) => (
                <Tr key={index}>
                  <Td>
                    {" "}
                    <HStack spacing="10px">
                      <Icon as={IoIosSubway} /> {/* Display the landmark icon */}
                      <Text>{station.STATION_NAME}</Text>
                    </HStack>
                  </Td>
                  <Td>{station.ARR_TIME}</Td>
                  <Td>{station.DEPT_TIME}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Flex>
  );
};

export default TrainInfo;
