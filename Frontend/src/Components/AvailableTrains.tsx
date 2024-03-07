import {
  Box,
  Heading,
  List,
  ListItem,
  Link,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Button,
  CardFooter,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Flex,
  Center,
  Spacer,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
  useParams,
  Link as RouterLink,
} from "react-router-dom";
import { taka } from "../Constants";
import axios from "axios";
import SeatBooking from "./SeatBooking";

type CLASS_FARE = {
  CLASS: string;
  AMOUNT: number;
};

type train = {
  TRAIN_ID: number;
  TRAIN_NAME: string;
  CF: CLASS_FARE[];
  FROM_ARRIVAL: string;
  FROM_DEPARTURE: string;
  TO_ARRIVAL: string;
  TO_DEPARTURE: string;
  Hr: number;
  Min: number;
};

interface Props {
  isAuthenticated: boolean;
}

function AvailableTrains({ isAuthenticated }: Props) {
  const navigate = useNavigate();
  //const { date, classType, source, destination } = useParams();
  const selectedDate = new Date();
  //const [trains, setTrains] = useState<train[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [className, setClassName] = useState("");
  const [id, setId] = useState(-2);
  const [trains, setTrains] = useState<train[]>([]); // [1
  const [filter, setFilter] = useState({
    fromStation: "",
    toStation: "",
    selectedDate: selectedDate,
    className: "",
  });
  const location = useLocation();
  useEffect(() => {
    // Retrieve data from location state
    const { fromStation, toStation, selectedDate, className } = location.state;
    console.log(fromStation);
    console.log(toStation);
    //console.log("selected date of available trains",selectedDate)
    // You can now use this data to set your component state or perform any necessary operations
    setFilter({
      fromStation: fromStation,
      toStation: toStation,
      selectedDate: new Date(selectedDate),
      className: className,
    });
    //getTrains()
  }, [location.state]);

  useEffect(() => {
    // Call getTrains whenever filter state changes
    if (
      filter.fromStation &&
      filter.toStation &&
      filter.selectedDate &&
      filter.className
    ) {
      getTrains();
    }
  }, [filter]);

  async function getTrains() {
    try {
      // Make GET request to backend API
      //console.log(filter)
      //console.log("selected date of available trains",filter.selectedDate)
      const response = await axios.get("http://localhost:5000/api/v1/trains", {
        params: filter,
      });

      // Handle response
      if (response.data.success) {
        // Update state with fetched train data
        console.log("Response1", response.data.data);
        //setTrains(response.data.data.rows);
        const response2 = await axios.get(
          `http://localhost:5000/api/v1/trains/${filter.fromStation}/${filter.toStation}`
        );
        //console.log(trains)
        console.log(response2.data.data.rows);
        let t = [];
        for (let tmp of response.data.data.rows) {
          const fromDeparture = moment(tmp.FROM_DEPARTURE, "HH:mm");
          const toArrival = moment(tmp.TO_ARRIVAL, "HH:mm");
          const duration = moment.duration(toArrival.diff(fromDeparture));
          const hours = Math.floor(duration.asHours());
          const minutes = Math.floor(duration.asMinutes()) - hours * 60;
          let temp = {
            TRAIN_ID: tmp.TRAIN_ID,
            TRAIN_NAME: tmp.TRAIN_NAME,
            CF: response2.data.data.rows,
            FROM_ARRIVAL: tmp.FROM_ARRIVAL,
            FROM_DEPARTURE: tmp.FROM_DEPARTURE,
            TO_ARRIVAL: tmp.TO_ARRIVAL,
            TO_DEPARTURE: tmp.TO_DEPARTURE,
            Hr: hours,
            Min: minutes,
          };
          t.push(temp);
        }
        setTrains(t);
        console.log("trains:", trains);
      } else {
        // Handle error condition if necessary
        console.error("Error fetching trains:", response.data.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error fetching trains:", error);
    }
  }

return trains.length === 0 ? (
  <h1>Not Found</h1>
) : (
  <Box maxWidth="70%" m="0 auto">
    <Heading as="h2" mb="4" mt="8px" marginLeft="10px">
      Available Trains
    </Heading>
    <Accordion allowToggle>
      {trains?.map((train, index) => (
        <AccordionItem key={index}>
          <AccordionButton bg="#d5d6d4" mb={4}>
            <Box flex="1" textAlign="left">
              <Heading as="h1" size="md" color="brown">
                {train.TRAIN_NAME} ({train.TRAIN_ID})
              </Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Box id={`train-${index}`} mt="4">
              <Flex direction="row" align="center" >
                <Text>
                  <strong>{train.FROM_DEPARTURE}</strong>
                </Text>
                <Box flex="1" borderBottom="1px solid black" my={2} ml={2} />
                {/* <Text>
                  <strong>
                    {(train.Hr < 0) ? train.Hr * -1 : train.Hr} hours {train.Min} minutes
                  </strong>
                </Text> */}
                <Box border="solid" w="10px" h="10px" borderWidth="1px">
                  </Box>
                <Box flex="1" borderBottom="1px solid black" my={2} mr={2} />
                <Text>
                  <strong>{train.TO_ARRIVAL}</strong>
                </Text>
              </Flex>
              <Flex direction="row" align="center" >
                <Text><strong>{filter.fromStation}</strong></Text>
                <Spacer />
                <Text>
                  <strong>
                    {(train.Hr < 0) ? train.Hr * -1 : train.Hr} hours {train.Min} minutes
                  </strong>
                </Text>
                <Spacer />
                <Text><strong>{filter.toStation}</strong></Text>
              </Flex>
              <SimpleGrid
            spacing={4}
            templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            mt="2"
          >
            {train.CF.map((seat, index) => (
              <Card
                key={index}
                size="sm"
                backgroundColor="cornsilk"
                borderRadius="10px"
                border={
                  className === seat.CLASS && id === train.TRAIN_ID
                    ? "2px solid blue"
                    : "none"
                }
              >
                <CardHeader color="black">
                  <Heading size="md"> {seat.CLASS}</Heading>
                  <Text size="sm">Including VAT</Text>
                  <Flex direction="row">
                    <Text fontSize="xl" fontWeight="bold">
                      {taka}
                    </Text>
                    <Text fontSize="xl">{seat.AMOUNT}</Text>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Text>Tickets Counter+Online</Text>
                </CardBody>
                <CardFooter
                  display="flex"
                  justifyContent="center"
                  alignContent="center"
                >
                  {/*<Link as={RouterLink} to={`/trains/${train.TRAIN_ID}/${seat.CLASS}`}>*/}
                  <Button
                    colorScheme="teal"
                    borderRadius="20px"
                    onClick={(e) => {
                      setIsClicked(true);
                      setClassName(seat.CLASS);
                      setId(train.TRAIN_ID);
                    }}
                  >
                    Book Now
                  </Button>
                  {/*</Link>*/}
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
          {isClicked && id === train.TRAIN_ID && (
            <SeatBooking
              key={`${id}-${className}`}
              trainID={id}
              className={className}
              fromStation={filter.fromStation}
              toStation={filter.toStation}
              selectedDate={filter.selectedDate}
              FROM_DEPARTURE={train.FROM_DEPARTURE}
            ></SeatBooking>
          )}
            </Box>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  </Box>
);
}

export default AvailableTrains;
