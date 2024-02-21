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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate,useLocation, useParams,Link as RouterLink } from "react-router-dom";
import { taka } from "../Constants";
import axios from "axios";

// interface QueryParams {
//   [key: string]: string | null;
// }
type CLASS_FARE={
  CLASS:string,
  AMOUNT: number,
}

type train = {
  TRAIN_ID: number;
  TRAIN_NAME: string;
  CF:CLASS_FARE[]
};
// Custom hook to extract URL query parameters
// function useQueryParams(): QueryParams {
//   const [queryParams, setQueryParams] = useState<QueryParams>({});

//   useEffect(() => {
//     const searchParams = new URLSearchParams(window.location.search);
//     const params: QueryParams = {};
//     for (const [key, value] of searchParams) {
//       params[key] = value;
//     }
//     setQueryParams(params);
//   }, []);

//   return queryParams;
// 




function AvailableTrains() {
  const navigate = useNavigate();
  //const { date, classType, source, destination } = useParams();
  const selectedDate = new Date()
  //const [trains, setTrains] = useState<train[]>([]);
  const [trains, setTrains] = useState<train[]>([]); // [1
  const [filter, setFilter] = useState({
    fromStation: "",
    toStation: "",
    selectedDate: selectedDate,
    className: "",
  });
  const location = useLocation()
  useEffect(() => {
    // Retrieve data from location state
    const { fromStation, toStation, selectedDate, className } = location.state;
    console.log(fromStation)
    console.log(toStation)
    //console.log("selected date of available trains",selectedDate)
    // You can now use this data to set your component state or perform any necessary operations
    setFilter({
      fromStation:fromStation,
      toStation: toStation,
      selectedDate: new Date(selectedDate),
      className: className,
    });
    //getTrains()
  }, [location.state]);

  useEffect(() => {
    // Call getTrains whenever filter state changes
    if (filter.fromStation && filter.toStation && filter.selectedDate && filter.className) {
      getTrains();
    }
  }, [filter]);

  async function getTrains() {
    try {
      // Make GET request to backend API
      //console.log(filter)
      //console.log("selected date of available trains",filter.selectedDate)
      const response = await axios.get("http://localhost:5000/api/v1/trains", { params: filter });
      
      // Handle response
      if (response.data.success) {
        // Update state with fetched train data
        console.log("Response1",response.data.data);
        //setTrains(response.data.data.rows);
        const response2 = await axios.get(`http://localhost:5000/api/v1/trains/${filter.fromStation}/${filter.toStation}`);
        //console.log(trains)
        console.log(response2.data.data.rows)
        let t=[]
        for (let tmp of response.data.data.rows){
          let temp={
            TRAIN_ID:tmp.TRAIN_ID,
            TRAIN_NAME:tmp.TRAIN_NAME,
            CF:response2.data.data.rows
          }
          t.push(temp)
        }
        setTrains(t);
        console.log("trains:",trains)
      } else {
        // Handle error condition if necessary
        console.error("Error fetching trains:", response.data.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error fetching trains:", error);
    }
  }

  const trainsa = [
    {
      train_id: 765,
      name: "Nilsagar Express",
      seat: [
        { classType: "S_CHAIR", fare: `${taka}490` },
        { classType: "Snigdha", fare: `${taka}770` },
        { classType: "AC_S", fare: `${taka}1150` },
      ],
    },
    {
      train_id: 795,
      name: "Benapole Express",
      seat: [
        { classType: "S_CHAIR", fare: `${taka}490` },
        { classType: "Snigdha", fare: `${taka}770` },
      ],
    },
  ];
  //const queryParams = useQueryParams();

  // useEffect(() => {
  //   initialize();
  // }, []);
  return (trains.length===0? <h1>Not Found</h1> :(
    <Box>
      <Heading as="h2" mb="4" mt='8px' marginLeft="10px">
        Available Trains
      </Heading>
      {/*<p>{train?.name}</p>
      {/*<List spacing={3} mb="4">
        {trains.map((train, index) => (
          <ListItem key={index}>
            <Link href={`/trains/${train.train_id}`}>{train.name}</Link>
          </ListItem>
        ))}
      </List>*/}
      {trains?.map((train, index) => (
        <Box key={index} id={`train-${index}`} mt="4" marginLeft="10px">
          <Heading as="h1" size="md" color='brown'>
            {train.TRAIN_NAME}
          </Heading>
          <SimpleGrid
            spacing={4}
            templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            mt="2"
          >
            {train.CF.map((seat, index) => (
              <Card key={index} size="sm" backgroundColor='cornsilk' borderRadius='10px'>
                <CardHeader color='black'>
                  <Heading size="md"> {seat.CLASS}</Heading>
                  <Text size="sm">Including VAT</Text>
                  <Flex>
                  <Text>{seat.AMOUNT}</Text>
                  <Text fontSize="lg" fontWeight="bold">{taka}</Text>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Text>Available Tickets Counter+Online</Text>
                </CardBody>
                <CardFooter display='flex' justifyContent='center' alignContent='center'>
                  <Link as={RouterLink} to={`/trains/${train.TRAIN_ID}/${seat.CLASS}`}>
                  <Button colorScheme="teal" borderRadius="20px">Book Now</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </Box>
  ))
}

export default AvailableTrains;
