import { ArrowForwardIcon } from "@chakra-ui/icons";
import { groupBy } from "lodash";
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
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { taka } from "../Constants";
import backgroundImage from '../reservation-img.jpg';

type seat = {
  compId: Number;
  no: Number;
};

type Filter = {
  fromStation: string;
  toStation: string;
  selectedDate: Date;
  className: string;
  TRAIN_ID: Number;
  TOTAL_FARE: Number;
  SEATS: seat[];
};

const ReservationPage = () => {
  const navigate = useNavigate();
  const [trainName, setTrainName] = useState("");
  const [compartmentMap, setCompartmentMap] = useState(new Map());
  const issueDate = new Date();
  const day = String(issueDate.getDate()).padStart(2, "0");
  const month = String(issueDate.getMonth() + 1).padStart(2, "0");
  const year = issueDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const [seats, setSeats] = useState<seat[]>([]);
  const [filter, setFilter] = useState<Filter>({
    fromStation: "",
    toStation: "",
    selectedDate: issueDate,
    className: "",
    TRAIN_ID: 0,
    TOTAL_FARE: 0,
    SEATS: [],
  });
  const location = useLocation();
  useEffect(() => {
    // Retrieve data from location state
    const {
      trainID,
      className,
      fromStation,
      toStation,
      selectedDate,
      selectedSeat,
      fare
    } = location.state;
    console.log(
      fromStation,
      toStation,
      selectedDate,
      className,
      trainID,
      selectedSeat,
      fare
    );
    //console.log("selected date of available trains",selectedDate)
    // You can now use this data to set your component state or perform any necessary operations
    setFilter({
      fromStation: fromStation,
      toStation: toStation,
      selectedDate: new Date(selectedDate),
      className: className,
      TRAIN_ID: trainID,
      TOTAL_FARE: fare,
      SEATS: selectedSeat,
    });
    getTrainName(trainID);
    getCompartmentName(trainID, className);
  }, []);

  // useEffect(() => {
  //     // Call getTrains whenever filter state changes
  //     if (filter.fromStation && filter.toStation && filter.selectedDate && filter.className) {
  //       getTrainName();
  //     }
  //   }, [filter]);
  async function getTrainName(trainID: Number) {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/trains/${trainID}`
      );
      console.log(res.data);
      //setFilter({...filter,TRAIN_NAME:res.data.TRAIN_NAME})
      setTrainName(res.data.data[0]?.TRAIN_NAME);
      console.log("inside getTrainName :", trainName, trainID);
    } catch (err) {
      console.error(err);
    }
  }

  async function getCompartmentName(trainID: Number, className: string) {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/compartments/${trainID}/${className}`
      );
      console.log("inside getCompartmentName :", trainID, className);
      console.log("inside getCompartmentName :", res.data);

      const newCompartmentMap = new Map();
      res.data.forEach(
        (compartment: { COMPARTMENT_ID: number; COMPARTMENT_NAME: string }) => {
          newCompartmentMap.set(
            compartment.COMPARTMENT_ID,
            compartment.COMPARTMENT_NAME
          );
        }
      );

      setCompartmentMap(newCompartmentMap);

      console.log("Map:", compartmentMap);
    } catch (err) {
      console.error(err);
    }
  }
  const groupedSeats = groupBy(filter.SEATS, "compId");
  return (
    <div
      style={{
           backgroundImage: `url(${backgroundImage})`,
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center',
        //   backgroundColor: "teal",
        //   width: '100vw',
        //   height: '100vh',
        //   display: 'flex',
        //   justifyContent: 'center',
        //   alignItems: 'center',
      }}
    >
      <Card style={{ width: "50%", margin: "auto", marginTop:"0px" ,backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
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
                {filter.fromStation}
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
                {filter.toStation}
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
                {trainName + " (" + filter.TRAIN_ID + ")"}
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
                {filter.selectedDate.toDateString()}
              </Text>
            </Box>
            <Box>
              <Heading
                size="xs"
                textTransform="uppercase"
                fontSize={20}
                textAlign="center"
              >
                CLASS NAME
              </Heading>
              <Text pt="2" fontSize={18} textAlign="center">
                {filter.className}
              </Text>
            </Box>
            {/* <Box>
              <Heading
                size="xs"
                textTransform="uppercase"
                fontSize={20}
                textAlign="center"
              >
                SEAT NUMBERS:
              </Heading>
              <Text pt="2" fontSize={18} textAlign="center">
                {filter.SEATS.map(
                  (seat) =>
                    `Compartment: ${compartmentMap.get(seat.compId)}, Seat: ${
                      seat.no
                    }`
                ).join(", ")}
              </Text>
            </Box> */}
            <Box>
              <Heading
                size="xs"
                textTransform="uppercase"
                fontSize={20}
                textAlign="center"
              >
                SEATS:
              </Heading>
              {Object.entries(groupedSeats).map(([compId, seats]) => (
                <Text pt="2" fontSize={18} textAlign="center" key={compId}>
                  {compartmentMap.get(Number(compId))} {"["}seats:{" "}
                  {seats.map((seat: any) => seat.no).join(", ")}
                  {"]"}
                </Text>
              ))}
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
                {`${taka} ${filter.TOTAL_FARE}`}
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
        </CardBody>
      </Card>
      <Button
            rightIcon={<ArrowForwardIcon />}
            colorScheme="blackAlpha"
            variant="outline"
            style={{
              position: "absolute",
              bottom: "10px", // Adjust as needed
              right: "10px", // Adjust as needed
            }}
          >
            Proceed to pay
          </Button>
    </div>
  );
};

export default ReservationPage;
