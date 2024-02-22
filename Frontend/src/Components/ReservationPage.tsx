import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Box,
  Stack,
  StackDivider,
  Text,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
//import backgroundImage from 'C:/Rail Sheba/Rail_Sheba/Frontend/src/reservation-img.jpg';

type seat = {
    COMPARTMENT_ID: number;
    SEAT_NO : number;
  };

const ReservationPage = () => {
    const navigate = useNavigate();
    const issueDate = new Date()
    const day = String(issueDate.getDate()).padStart(2, '0');
    const month = String(issueDate.getMonth() + 1).padStart(2, '0');
    const year = issueDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const [seats, setSeats] = useState<seat[]>([]);
    const [filter, setFilter] = useState({
        fromStation: "",
        toStation: "",
        selectedDate: issueDate,
        TRAIN_ID:"",
        TRAIN_NAME:"",
        TOTAL_FARE:"",
        SEATS:[],
      });
    const location = useLocation()
    // useEffect(() => {
    //     // Retrieve data from location state
    //     const { fromStation, toStation, selectedDate, TRAIN_ID,TRAIN_NAME,TOTAL_FARE,SEATS } = location.state;
    //     //console.log("selected date of available trains",selectedDate)
    //     // You can now use this data to set your component state or perform any necessary operations
    //     setFilter({
    //       fromStation:fromStation,
    //       toStation: toStation,
    //       selectedDate: new Date(selectedDate),
    //       TRAIN_ID:TRAIN_ID,
    //       TRAIN_NAME:TRAIN_NAME,
    //       TOTAL_FARE:TOTAL_FARE,
    //       SEATS:SEATS,
    //     });
    //     //getTrains()
    //   }, [location.state]);
  return (
    <div 
    //     style={{
    //     backgroundImage: `url(${backgroundImage})`,
    //     backgroundSize: 'cover',
    //     backgroundPosition: 'center',
    //     width: '100vw',
    //     height: '100vh',
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   }}
      >
    <Card>
      <CardHeader>
        <Heading size="md" fontSize={50} textAlign="center">
          RESERVATION DETAILS
        </Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontSize={20}
              textAlign="center"
            >
              FROM STATION:
            </Heading>
            <Text pt="2" fontSize={18} textAlign="center">
              JASHORE
            </Text>
          </Box>
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontSize={20}
              textAlign="center"
            >
              TO STATION:
            </Heading>
            <Text pt="2" fontSize={18} textAlign="center">
              DHAKA
            </Text>
          </Box>
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontSize={20}
              textAlign="center"
            >
              TRAIN NAME:
            </Heading>
            <Text pt="2" fontSize={18} textAlign="center">
              BENAPOLE EXPRESS (795)
            </Text>
          </Box>
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontSize={20}
              textAlign="center"
            >
              DATE OF JOURNEY:
            </Heading>
            <Text pt="2" fontSize={18} textAlign="center">
              04-03-2024
            </Text>
          </Box>
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontSize={20}
              textAlign="center"
            >
              NUMBER OF SEATS:
            </Heading>
            <Text pt="2" fontSize={18} textAlign="center">
              4
            </Text>
          </Box>
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontSize={20}
              textAlign="center"
            >
              TOTAL FARE:
            </Heading>
            <Text pt="2" fontSize={18} textAlign="center">
              1200 BDT
            </Text>
          </Box>
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontSize={20}
              textAlign="center"
            >
              ISSUE DATE:
            </Heading>
            <Text pt="2" fontSize={18} textAlign="center">
              {formattedDate}
            </Text>
          </Box>
        </Stack>
        <Button
          rightIcon={<ArrowForwardIcon />}
          colorScheme="teal"
          variant="outline"
          style={{
            position: "absolute",
            bottom: "10px", // Adjust as needed
            right: "10px", // Adjust as needed
          }}
        >
          Proceed to pay
        </Button>
      </CardBody>
    </Card>
    </div>
  );
};

export default ReservationPage;
