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
import SeatBooking from "./SeatBooking";

type CLASS_FARE={
  CLASS:string,
  AMOUNT: number,
}

type train = {
  TRAIN_ID: number;
  TRAIN_NAME: string;
  CF:CLASS_FARE[]
};

interface Props{
  isAuthenticated:boolean
}

function AvailableTrains({isAuthenticated}:Props) {
  const navigate = useNavigate();
  //const { date, classType, source, destination } = useParams();
  const selectedDate = new Date()
  //const [trains, setTrains] = useState<train[]>([]);
  const [isClicked,setIsClicked]=useState(false)
  const [className,setClassName]=useState("")
  const [id,setId]=useState(-2)
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


  return (trains.length===0? <h1>Not Found</h1> :(
    <Box>
      <Heading as="h2" mb="4" mt='8px' marginLeft="10px">
        Available Trains
      </Heading>
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
                  {/*<Link as={RouterLink} to={`/trains/${train.TRAIN_ID}/${seat.CLASS}`}>*/}
                  <Button colorScheme="teal" borderRadius="20px" onClick={(e)=>{setIsClicked(true);setClassName(seat.CLASS);setId(train.TRAIN_ID)}}>Book Now</Button>
                  {/*</Link>*/}
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
          {isClicked && id===train.TRAIN_ID && <SeatBooking key={`${id}-${className}`} trainID={id} className={className} fromStation={filter.fromStation} toStation={filter.toStation} selectedDate={filter.selectedDate}></SeatBooking>}
        </Box>
      ))}
    </Box>
  ))
}

export default AvailableTrains;
